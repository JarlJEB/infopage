
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { from: "bot", words: ["Hei!", "Hva", "lurer", "du", "på?"] },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    const question = input.trim();
    setInput("");
    setMessages((prev) => [{ from: "user", text: question }, ...prev]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    const words = data.answer.split(" ");

    let i = 0;
    const reveal = () => {
      setMessages((prev) => [{ from: "bot", words: words.slice(0, i + 1) }, ...prev.filter(m => m.from !== "bot" || !m.words)]);
      if (++i < words.length) setTimeout(reveal, 180);
    };
    setTimeout(reveal, 400);
  };

  return (
    <div className="min-h-screen bg-skilldark text-skillwhite font-sans relative flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-2xl px-6 pt-[25vh] pb-36 space-y-6">
        {[...messages].reverse().map((msg, i) => (
          <div key={i} className="text-[15px]">
            {msg.text && (
              <p className="bg-[#403d3d] rounded-xl px-4 py-2 inline-block">{msg.text}</p>
            )}
            {msg.words && (
              <p className="italic flex flex-wrap gap-1">
                {msg.words.map((w, j) => (
                  <span key={j} style={{
                    opacity: 0,
                    animation: `fadeIn 0.7s ease forwards`,
                    animationDelay: `${j * 150}ms`,
                  }}>{w}</span>
                ))}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="fixed top-[45vh] w-full max-w-2xl flex items-center px-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Hva lurer du på?"
          className="flex-1 bg-skilldark text-white border-none text-[15px] placeholder-gray-400 focus:outline-none"
        />
        <button onClick={handleSend} className="bg-skillgreen rounded-xl p-3 ml-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white rotate-45">
            <path fill="currentColor" d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
          </svg>
        </button>
      </div>

      <img src="/skillhouse-logo.svg" alt="Skillhouse" className="fixed bottom-6 right-6 w-32 opacity-80" />
      <style jsx>{`@keyframes fadeIn { to { opacity: 1; } }`}</style>
    </div>
  );
}
