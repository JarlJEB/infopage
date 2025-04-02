// pages/index.js
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [placeholder, setPlaceholder] = useState("Hva lurer du på?");
  const containerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);
    setInput("");
    setPlaceholder("Takk! Spør gjerne om noe mer...");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: data.reply },
    ]);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-[#2e2f32] text-white flex flex-col items-center justify-end px-4 pb-10 relative">
      <div
        ref={containerRef}
        className="w-full max-w-2xl flex-1 overflow-y-auto space-y-4 px-4 pt-10 pb-40"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`fade-in ${msg.sender === "user" ? "text-right" : "text-left"}`}>
            <span className="inline-block bg-gray-800 px-4 py-2 rounded-2xl">
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center px-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-4 rounded-full bg-[#1a1a1a] text-white placeholder-gray-500 outline-none shadow-lg"
        />
        <button
          type="submit"
          className="ml-4 w-10 h-10 bg-[#2bb77b] text-white rounded-md flex items-center justify-center text-xl shadow-md hover:bg-[#28a06d] transition"
        >
          →
        </button>
      </form>

      <div className="absolute bottom-4 right-4 text-sm text-white/30 select-none">
        SkillHouse
      </div>
    </div>
  );
}
