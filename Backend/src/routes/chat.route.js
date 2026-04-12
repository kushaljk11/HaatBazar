import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
const sessions = new Map();
let quotaBlockedUntil = 0;

const FALLBACK_MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-1.5-flash-latest",
].filter(Boolean);

const SYSTEM_PROMPT = `
You are HaatBazar Assistant for the HaatBazar agriculture marketplace project.
Help users with:
- buyer tasks: finding produce, bookings, orders, payment flow
- farmer tasks: creating crop listings, managing stock, handling bookings/orders
- admin tasks: approvals, users, logs, and platform operations

Rules:
- Keep responses concise, practical, and polite.
- Use HaatBazar terminology, never EasyKotha or rental domain.
- If unsure, state assumptions and suggest safe next steps.
`;

const parseRetryMs = (value) => {
  const text = String(value || "");
  const retryInMatch = text.match(/retry in\s+([0-9.]+)s/i);
  if (retryInMatch?.[1]) {
    return Math.max(1000, Math.round(Number(retryInMatch[1]) * 1000));
  }

  const retryDelayMatch = text.match(/retryDelay\":\"(\d+)s/i);
  if (retryDelayMatch?.[1]) {
    return Math.max(1000, Number(retryDelayMatch[1]) * 1000);
  }

  return 30_000;
};

const buildQuotaFallbackReply = (retryMs) => {
  const seconds = Math.max(1, Math.ceil(retryMs / 1000));
  return `AI assistant is temporarily busy due to API quota limits. Please try again in about ${seconds}s.\n\nMeanwhile I can still help with quick guidance:\n- Buyer: use Marketplace, Bookings, and Orders pages\n- Farmer: list crops and manage stock in My Crops\n- Admin: review Posts, Orders, Payments, and Logs`;
};

router.post("/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body || {};

    if (!message || !sessionId) {
      return res.status(400).json({ error: "message and sessionId are required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    }

    if (Date.now() < quotaBlockedUntil) {
      const retryMs = quotaBlockedUntil - Date.now();
      return res.json({
        reply: buildQuotaFallbackReply(retryMs),
        degraded: true,
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const history = sessions.get(sessionId) || [];
    let reply = "";
    let lastError = null;

    for (const modelName of FALLBACK_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_PROMPT,
        });

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(message);
        reply = result.response.text();
        break;
      } catch (error) {
        lastError = error;
        const messageText = String(error?.message || "");
        const isModelNotFound = messageText.includes("404") || messageText.includes("is not found");
        if (!isModelNotFound) {
          throw error;
        }
      }
    }

    if (!reply) {
      const providerMessage =
        lastError?.errorDetails?.[0]?.message ||
        lastError?.message ||
        "No supported Gemini model found for this API key";
      return res.status(500).json({ error: providerMessage });
    }

    history.push(
      { role: "user", parts: [{ text: message }] },
      { role: "model", parts: [{ text: reply }] },
    );
    sessions.set(sessionId, history);

    return res.json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    const providerMessage =
      error?.errorDetails?.[0]?.message ||
      error?.message ||
      "Chatbot request failed";

    const isQuotaError = String(providerMessage).includes("429") ||
      String(providerMessage).toLowerCase().includes("quota") ||
      String(providerMessage).toLowerCase().includes("too many requests");

    if (isQuotaError) {
      const retryMs = parseRetryMs(providerMessage);
      quotaBlockedUntil = Date.now() + retryMs;
      return res.json({
        reply: buildQuotaFallbackReply(retryMs),
        degraded: true,
      });
    }

    return res.status(500).json({ error: providerMessage });
  }
});

export default router;
