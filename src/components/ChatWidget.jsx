"use client";

import { useEffect, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const GREETING =
  "Hi! 👋 I'm the DS Solution AI assistant. Ask me anything about SEO, ads, social media, websites or design.";
const SUGGESTIONS = [
  "What services do you offer?",
  "SMM plans pricing?",
  "How does a website project work?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: GREETING },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  async function send(text) {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      // The greeting is UI-only; do not send it to the model.
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const data = await res.json().catch(() => ({}));
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            data.reply ||
            "Sorry, I couldn't get a reply right now. Please try again shortly or message us on the contact page.",
        },
      ]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Network issue. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      {open && (
        <section
          role="dialog"
          aria-label="Chat with AI"
          className="border-border bg-body absolute right-0 bottom-16 flex h-[min(25rem,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border shadow-2xl"
        >
          <header className="bg-primary text-on-accent flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-on-accent mb-0 text-sm font-bold">
                DS Solution AI
              </p>
              <p className="text-on-accent mb-0 text-xs">
                Usually replies in seconds
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-on-accent grid size-8 place-items-center rounded-full text-xl hover:bg-white/15"
            >
              ×
            </button>
          </header>

          <div
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            aria-live="polite"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user" ? "flex justify-end" : "flex justify-start"
                }
              >
                <p
                  className={`mb-0 max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-on-accent rounded-br-sm" : "bg-light text-text-dark rounded-bl-sm"}`}
                >
                  {m.content}
                </p>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <p className="bg-light text-text mb-0 rounded-2xl rounded-bl-sm px-3.5 py-2 text-sm">
                  Typing…
                </p>
              </div>
            )}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="border-border text-text hover:border-primary hover:text-primary rounded-full border px-3 py-1 text-xs transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-border flex items-center gap-2 border-t p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Type your question…"
              aria-label="Your message"
              className="border-border bg-light text-text-dark focus:border-primary min-w-0 flex-1 rounded-full border px-4 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-primary text-on-accent rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with AI"}
        aria-expanded={open}
        className="bg-primary group text-on-accent flex h-14 items-center overflow-hidden rounded-full shadow-xl transition-[width] duration-300 hover:w-44 focus-visible:w-44"
        style={{ width: open ? undefined : "3.5rem" }}
      >
        <span className="grid size-14 shrink-0 place-items-center text-2xl">
          {open ? "×" : "💬"}
        </span>
        {!open && (
          <span className="pr-5 text-sm font-semibold whitespace-nowrap">
            Chat with AI
          </span>
        )}
      </button>
    </div>
  );
}
