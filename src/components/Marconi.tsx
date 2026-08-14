import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Radio, X, Send, Sparkles } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! I'm Marconi — your IEEE AP-S IEM assistant. Ask me anything about the chapter, our events, or how to join.",
};

export function Marconi() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Focus the input when the panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send only the real conversation (drop the canned greeting)
        body: JSON.stringify({ messages: next.filter((m, i) => !(i === 0 && m === GREETING)) }),
      });
      const data = await res.json();
      const reply = res.ok
        ? data.reply
        : data.error || "Something went wrong. Please try again.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I couldn't reach the server. If you're running this locally, the chat API only works after deploying to Vercel (or via `vercel dev`).",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Launcher button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Marconi chat" : "Open Marconi chat"}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 left-6 z-[120] w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_0_24px_rgba(0,212,255,0.5)] border border-primary/40"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="r" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Radio size={22} />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping bg-primary/30 pointer-events-none" />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-24 left-6 z-[120] w-[calc(100vw-3rem)] max-w-sm h-[70vh] max-h-[560px] flex flex-col overflow-hidden rounded-2xl border border-primary/25 bg-surface-container-high shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            style={{ background: "linear-gradient(180deg, rgba(21,24,27,0.98), rgba(12,14,16,0.98))" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-outline-variant/20 shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                <Radio size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline text-lg font-black uppercase tracking-tight text-on-surface leading-none">Marconi</h3>
                  <span className="flex items-center gap-1 text-[9px] font-label uppercase tracking-widest text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online
                  </span>
                </div>
                <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 mt-1">IEEE AP-S IEM Assistant</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="w-8 h-8 rounded-full hover:bg-surface/60 flex items-center justify-center text-on-surface-variant transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" data-lenis-prevent>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-sm font-body leading-relaxed whitespace-pre-wrap rounded-2xl ${
                      m.role === "user"
                        ? "bg-primary text-on-primary rounded-br-sm"
                        : "bg-surface/70 text-on-surface border border-outline-variant/15 rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-surface/70 border border-outline-variant/15 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-outline-variant/20 shrink-0">
              <div className="flex items-end gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Ask about IEEE AP-S IEM..."
                  className="flex-1 bg-surface/60 border border-outline-variant/20 rounded-full px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                  className="w-10 h-10 shrink-0 rounded-full bg-primary text-on-primary flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="flex items-center justify-center gap-1 mt-2 text-[9px] font-label uppercase tracking-widest text-on-surface-variant/40">
                <Sparkles size={10} /> Powered by Claude
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
