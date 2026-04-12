import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

// session memory
const sessions = new Map();

// per-session quota blocking (FIXED)
const quotaBlockedUntilMap = new Map();

// single model only (IMPORTANT FIX)
const MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash-latest";

const SYSTEM_PROMPT = `
You are HaatBazar Assistant for the HaatBazar agriculture marketplace project.
Help users with:
- buyer tasks: finding produce, bookings, orders, payment flow
- farmer tasks: creating crop listings, managing stock, handling bookings/orders
- admin tasks: approvals, users, logs, and platform operations

Rules:
- Keep responses concise, practical, and polite.
- Use HaatBazar terminology only.
- If unsure, suggest safe next steps.
`;

const parseRetryMs = (value) => {
  const text = String(value || "");

  const retryInMatch = text.match(/retry in\s+([0-9.]+)s/i);
  if (retryInMatch?.[1]) {
    return Math.max(1000, Math.round(Number(retryInMatch[1]) * 1000));
  }

  const retryDelayMatch = text.match(/retryDelay":"?(\d+)s/i);
  if (retryDelayMatch?.[1]) {
    return Math.max(1000, Number(retryDelayMatch[1]) * 1000);
  }

  return 30000;
};

const buildQuotaFallbackReply = (retryMs) => {
  const seconds = Math.max(1, Math.ceil(retryMs / 1000));

  return `AI assistant is temporarily busy due to API quota limits. Please try again in about ${seconds}s.

Meanwhile:
- Buyer: use Marketplace, Bookings, Orders
- Farmer: manage crops in My Crops
- Admin: review Posts, Orders, Payments, Logs`;
};

const buildLocalAssistantReply = (message) => {
  const text = String(message || "").toLowerCase();

  if (/order|booking|payment/.test(text)) {
    return "Buyer help: check Orders & Bookings sections. Payments are in transaction history.";
  }

  if (/crop|listing|marketplace/.test(text)) {
    return "Farmer help: add crops in Add Listing, update stock in My Crops.";
  }

  if (/admin|approve|log|user/.test(text)) {
    return "Admin help: manage users, approvals, and logs from Admin dashboard.";
  }

  return "AI is unavailable. Please use Buyer, Farmer, or Admin dashboard menus.";
};

const isQuotaError = (msg) =>
  String(msg || "").toLowerCase().includes("quota") ||
  String(msg || "").includes("429") ||
  String(msg || "").toLowerCase().includes("too many requests");

router.post("/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body || {};

    if (!message || !sessionId) {
      return res.status(400).json({
        error: "message and sessionId are required",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: buildLocalAssistantReply(message),
        mode: "local",
        degraded: true,
        reason: "missing_api_key",
      });
    }

    // session-based quota blocking (FIXED)
    const blockedUntil = quotaBlockedUntilMap.get(sessionId) || 0;

    if (Date.now() < blockedUntil) {
      const retryMs = blockedUntil - Date.now();

      return res.json({
        reply: buildQuotaFallbackReply(retryMs),
        mode: "quota",
        degraded: true,
        retryAfterSeconds: Math.ceil(retryMs / 1000),
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const history = sessions.get(sessionId) || [];

    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: SYSTEM_PROMPT,
    });

    const chat = model.startChat({ history });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    // update history
    history.push(
      { role: "user", parts: [{ text: message }] },
      { role: "model", parts: [{ text: reply }] }
    );

    sessions.set(sessionId, history);

    return res.json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error);

    const msg = error?.message || "";

    // QUOTA HANDLING (FIXED per session)
    if (isQuotaError(msg)) {
      const retryMs = parseRetryMs(msg);
      const sessionId = req.body?.sessionId;

      if (sessionId) {
        quotaBlockedUntilMap.set(sessionId, Date.now() + retryMs);
      }

      return res.json({
        reply: buildQuotaFallbackReply(retryMs),
        mode: "quota",
        degraded: true,
        retryAfterSeconds: Math.ceil(retryMs / 1000),
      });
    }

    return res.json({
      reply: buildLocalAssistantReply(req.body?.message),
      mode: "local",
      degraded: true,
      reason: "provider_error",
    });
  }
});

export default router;