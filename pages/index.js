
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { from: "bot", words: ["Hei!", "Hva", "lurer", "du", "på?"] },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [{ from: "user", text: userMsg }, ...prev]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: userMsg }),
    });
    const data = await res.json();
    const words = data.answer.split(" ");

    let i = 0;
    const reveal = () => {
      setMessages((prev) => {
        const botMsg = prev.find((m) => m.from === "bot" && m.words);
        const rest = prev.filter((m) => !(m.from === "bot" && m.words));
        const newWords = botMsg ? [...botMsg.words, words[i]] : [words[i]];
        return [{ from: "bot", words: newWords }, ...rest];
      });
      if (++i < words.length) setTimeout(reveal, 200);
    };
    setTimeout(reveal, 400);
  };

  return (
    <div className="min-h-screen bg-skilldark text-white font-sans relative overflow-hidden flex flex-col items-center">
      <div className="w-full max-w-2xl px-4 pt-32 pb-28 space-y-8">
        {[...messages].reverse().map((msg, i) => (
          <div key={i} className="text-[16px] leading-relaxed">
            {msg.text && (
              <p className="text-right bg-[#403d3d] rounded-xl p-3 inline-block text-skillwhite">
                {msg.text}
              </p>
            )}
            {msg.words && (
              <p className="italic text-skillwhite flex flex-wrap gap-1">
                {msg.words.map((w, j) => (
                  <span key={j} style={{
                    opacity: 0,
                    animation: `fadeIn 0.6s ease forwards`,
                    animationDelay: `${j * 200}ms`,
                  }}>{w}</span>
                ))}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="fixed top-[45vh] w-full max-w-2xl flex items-center gap-2 px-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Hva lurer du på?"
          className="flex-1 bg-skilldark text-white border-none focus:outline-none text-[15px] placeholder-gray-400"
        />
        <button onClick={handleSend} className="bg-skillgreen text-white p-2 rounded-lg text-xl">
          <span className="inline-block rotate-45">&#10148;</span>
        </button>
      </div>

      <img src="/skillhouse-logo.svg" alt="Skillhouse" className="fixed bottom-4 right-4 w-32 opacity-80" />
      <style jsx>{`@keyframes fadeIn { to { opacity: 1; } }`}</style>
    </div>
  );
}
