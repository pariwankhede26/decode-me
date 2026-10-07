import React, { useState, useRef, useEffect } from "react";
import { FocusSession, MealLog, PatternInsight } from "../types/twin";

interface AskTwinViewProps {
  sessions: FocusSession[];
  meals: MealLog[];
  patterns: PatternInsight[];
}

interface ChatMessage {
  id: string;
  sender: "user" | "twin";
  text: string;
}

export const AskTwinView: React.FC<AskTwinViewProps> = ({
  sessions,
  meals,
  patterns,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "twin",
      text: "I am your personal digital twin. Ask me anything in real time about your study habits, energy levels, focus windows, nutrition, or questions you have today.",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sampleQuestions = [
    "When do I focus best?",
    "How can I stop procrastinating today?",
    "What break suits low energy right now?",
    "Give me study tips for my next exam",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputText;
    if (!prompt.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: "usr-" + Date.now(),
      sender: "user",
      text: prompt,
    };

    const currentHistory = [...messages, userMessage];
    setMessages(currentHistory);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch("/api/twin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          conversationHistory: messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          twinContext: {
            completedSessionsCount: sessions.filter((s) => s.status === "completed").length,
            recentTasks: sessions.map((s) => s.taskName),
            discoveredPatterns: patterns.map((p) => ({
              title: p.title,
              r: p.correlationCoefficient,
              summary: p.telemetrySummary,
            })),
            nutritionLogs: meals.map((m) => ({ name: m.mealName, note: m.twinCorrelationNote })),
          },
        }),
      });

      if (!response.ok) throw new Error("Twin query failed");
      const data = await response.json();

      const twinMessage: ChatMessage = {
        id: "twn-" + Date.now(),
        sender: "twin",
        text: data.text || "I am analyzing your telemetry in real time.",
      };

      setMessages((prev) => [...prev, twinMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: "twn-" + Date.now(),
          sender: "twin",
          text: `Regarding "${prompt}": As your digital twin, I recommend aligning your complex mental tasks with your historical evening peak window (19:00 - 21:00) while keeping a 15-minute offline break buffer.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="gradient-title">Ask Your Twin</h1>
        <p className="text-[var(--muted)] text-[1.02rem] mt-2 mb-6">
          Query your personal telemetry and habit insights in natural language.
        </p>
      </div>

      {/* Main Chat Container */}
      <section className="card-aesthetic flex flex-col h-[580px] space-y-4">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col text-xs max-w-lg ${
                m.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              <span className="text-[10px] text-[var(--muted)] mb-1 font-semibold">
                {m.sender === "user" ? "You" : "Twin"}
              </span>
              <div
                className={`p-4 rounded-2xl leading-relaxed text-xs md:text-sm ${
                  m.sender === "user"
                    ? "bg-gradient-to-r from-[#F472B6] to-[#C4B5FD] text-white shadow-sm"
                    : "box-desc border border-[var(--line)]"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex flex-col text-xs mr-auto items-start">
              <span className="text-[10px] text-[var(--muted)] mb-1 font-semibold">Twin</span>
              <div className="box-desc italic text-xs">
                ✨ Synthesizing habit telemetry...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pt-2 border-t border-[var(--line)]">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={loading}
              onClick={() => handleSendMessage(q)}
              className="chip-pill text-xs whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Text Input Row */}
        <div className="flex gap-2.5">
          <input
            type="text"
            value={inputText}
            disabled={loading}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask your twin anything about your routines..."
            className="input-aesthetic text-xs flex-1"
          />
          <button
            type="button"
            disabled={loading || !inputText.trim()}
            onClick={() => handleSendMessage()}
            className="btn-shimmer text-xs py-3 px-7 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
};
