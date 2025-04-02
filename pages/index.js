// pages/index.js
import { useState, useEffect, useRef } from "react";
import Head from "next/head";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [placeholder, setPlaceholder] = useState("Spør meg om Skillhouse...");
  const containerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [
      { sender: "user", text: userMessage },
      ...prev.slice(0, 2),
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
      { sender: "bot", text: data.reply },
      ...prev.slice(0, 2),
    ]);
  };

  return (
    <>
      <Head>
        <title>SkillHouse</title>
        <meta name="description" content="SkillHouse InfoPage" />
      </Head>

      <main className="relative min-h-screen bg-[#312f2f] font-inter text-white overflow-hidden">
        {/* Logo */}
        <div className="absolute bottom-4 right-4 text-xs text-white/30 z-10 select-none">
          <img
            src="/Skillhouse_Logo_Use on Dark.svg"
            alt="Skillhouse logo"
            className="w-24 opacity-30"
          />
        </div>

        {/* Input (låst på 30vh) */}
        <form
          onSubmit={handleSubmit}
          className="absolute top-[30vh] left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 flex items-center z-20"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 p-4 rounded-full bg-[#1a1a1a] text-white placeholder-white/40 outline-none shadow-md text-base"
          />
          <button
            type="submit"
            className="ml-4 w-10 h-10 bg-[#2bb77b] text-white rounded-md flex items-center justify-center text-xl shadow-md hover:bg-[#28a06d] transition"
          >
            →
          </button>
        </form>

        {/* Chatlog under input, vokser oppover */}
        <div
          ref={containerRef}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 pb-32 pt-6 flex flex-col-reverse gap-3 items-start overflow-hidden"
          style={{ maxHeight: "calc(30vh - 6rem)" }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`w-full fade-in text-sm ${
                msg.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <span className={`inline-block ${msg.sender === "bot" ? "italic" : ""}`}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
