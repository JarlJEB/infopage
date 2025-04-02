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
    <div className="min-h-screen bg-[#2e2f32] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl h-[80vh] flex flex-col border border-gray-700 rounded-2xl overflow-hidden shadow-lg">
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
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
          className="border-t border-gray-700 p-4 bg-[#2e2f32] flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 p-3 rounded-full bg-gray-900 text-white placeholder-gray-500 outline-none"
          />
          <button
            type="submit"
            className="ml-4 text-green-400 hover:text-green-300 transition"
          >
            →
          </button>
        </form>
      </div>
    </div>
  );
}
