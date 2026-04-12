import { useMemo, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";

const rawBase = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "/api" : "");
const sanitizedBase = String(rawBase || "").replace(/\/+$/, "");
const CHAT_ENDPOINT = sanitizedBase
  ? sanitizedBase.endsWith("/api")
    ? `${sanitizedBase}/chat`
    : `${sanitizedBase}/api/chat`
  : "";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Namaste! I am HaatBazar assistant. Ask me about crops, bookings, orders, or account help." },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionId = useMemo(() => crypto.randomUUID(), []);

  const onSend = async () => {
    if (!text.trim() || loading) return;

    if (!CHAT_ENDPOINT) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "API base URL is not configured. Set VITE_API_BASE_URL in frontend environment.",
        },
      ]);
      return;
    }

    const input = text.trim();
    setText("");
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setLoading(true);

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Chatbot request failed");
      }

      setMessages((prev) => [...prev, { role: "bot", text: data.reply || "No response" }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: error?.message || "Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-20 right-5 z-50 w-[330px] overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-emerald-800 px-4 py-3 text-white">
            <p className="inline-flex items-center gap-2 text-sm font-semibold">
              <Bot className="h-4 w-4" /> HaatBazar AI Helper
            </p>
            <button type="button" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="h-72 space-y-3 overflow-y-auto bg-emerald-50/40 p-3 text-sm">
            {messages.map((m, index) => (
              <div key={`${m.role}-${index}`} className={m.role === "user" ? "text-right" : "text-left"}>
                <span
                  className={[
                    "inline-block max-w-[85%] rounded-xl px-3 py-2",
                    m.role === "user"
                      ? "bg-emerald-800 text-white"
                      : "border border-emerald-100 bg-white text-slate-700",
                  ].join(" ")}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-emerald-100 p-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSend()}
              placeholder="Ask about HaatBazar..."
              className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={onSend}
              disabled={loading}
              className="inline-flex items-center rounded-xl bg-emerald-800 px-3 py-2 text-white disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      {!isOpen ? (
        <div className="fixed bottom-20 right-2 z-50 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-md">
          केही सहयोग चाहिन्छ...?
        </div>
      ) : null}

      {!isOpen ? (
        <div className="fixed bottom-[68px] right-[54px] z-50 h-0 w-10 rotate-[25deg] border-t-2 border-dashed border-emerald-400" />
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-800 text-white shadow-lg hover:bg-emerald-700"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    </>
  );
}
