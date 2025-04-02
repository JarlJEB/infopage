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
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setPlaceholder("Takk! Spør gjerne om noe mer...");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();
    setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <Head>
        <title>SkillHouse</title>
        <meta name="description" content="SkillHouse InfoPage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative min-h-screen bg-[#2e2f32] text-white font-inter overflow-hidden">
        <div className="absolute bottom-4 right-4 text-white/30 text-xs select-none z-10">
          SkillHouse
        </div>

        <div
          ref={containerRef}
          className="flex flex-col-reverse items-center justify-end max-h-[80vh] overflow-y-auto space-y-4 space-y-reverse px-4 pt-20 pb-32"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`w-full max-w-2xl fade-in px-2 ${
                msg.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <span className="inline-block bg-[#1a1a1a] px-4 py-2 rounded-2xl">
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 flex items-center z-20"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 p-4 rounded-full bg-[#1a1a1a] text-white placeholder-white/40 outline-none shadow-md"
          />
          <button
            type="submit"
            className="ml-4 w-10 h-10 bg-[#2bb77b] text-white rounded-md flex items-center justify-center text-xl shadow-md hover:bg-[#28a06d] transition"
          >
            →
          </button>
        </form>
      </main>
    </>
  );
}
