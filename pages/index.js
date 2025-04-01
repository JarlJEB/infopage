
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { from: "bot", words: ["Hei!", "Hva", "lurer", "du", "på?"] },
  ]);
  const [input, setInput] = useState("");
  const containerRef = useRef(null);

  const fakeAIResponse = (question) => {
    return `Skillhouse tilbyr rekruttering og konsulentformidling innen elektro, automasjon og bygg. Vi skreddersyr bemanningsløsninger som gir bedrifter konkurransekraft.`;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const question = input.trim();
    setInput("");
    const reply = fakeAIResponse(question);
    const words = reply.split(" ");

    setMessages((prev) => [
      { from: "user", text: question },
      ...prev,
    ]);

    let i = 0;

    const animateWords = () => {
      setMessages((prev) => {
        const prevBotMsg = prev.find((m) => m.from === "bot" && m.words);
        const others = prev.filter((m) => !(m.from === "bot" && m.words));
        const newWords = prevBotMsg ? [...prevBotMsg.words, words[i]] : [words[i]];
        return [
          { from: "bot", words: newWords },
          ...others,
        ];
      });

      i++;
      if (i < words.length) {
        setTimeout(animateWords, 250);
      }
    };

    setTimeout(animateWords, 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[#312f2f] text-white font-sans relative overflow-hidden flex flex-col items-center">
      <div className="w-full max-w-2xl px-4 pt-32 pb-28 space-y-8" ref={containerRef}>
        {[...messages].reverse().map((msg, i) => (
          <div key={i} className="text-[16px] leading-relaxed">
            {msg.text && (
              <p className="text-right bg-[#403d3d] rounded-xl p-3 inline-block max-w-full text-skillwhite">
                {msg.text}
              </p>
            )}
            {msg.words && (
              <p className="italic text-skillwhite flex flex-wrap gap-1">
                {msg.words.map((word, j) => (
                  <span
                    key={j}
                    style={{
                      opacity: 0,
                      animation: `fadeIn 0.6s ease forwards`,
                      animationDelay: `${j * 200}ms`,
                    }}
                  >
                    {word}
                  </span>
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
          onKeyDown={handleKeyDown}
          placeholder="Hva lurer du på?"
          className="flex-1 bg-[#312f2f] text-white border-none focus:outline-none text-[15px] placeholder-gray-400"
        />
        <button
          onClick={handleSend}
          className="bg-skillgreen text-white p-2 rounded-lg hover:opacity-90 transition text-xl"
        >
          <span className="inline-block rotate-45">&#10148;</span>
        </button>
      </div>

      <img
        src="/skillhouse-logo.svg"
        alt="Skillhouse Logo"
        className="fixed bottom-4 right-4 w-32 opacity-80"
      />

      <style jsx>{`
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
