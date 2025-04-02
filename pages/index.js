import { useState, useEffect } from 'react';

export default function InfoPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const intro = "Hei! Hva lurer du på?";
    const words = intro.split(' ');
    let i = 0;
    const interval = setInterval(() => {
      setMessages([{ from: 'bot', text: words.slice(0, i + 1).join(' ') }]);
      i++;
      if (i === words.length) {
        clearInterval(interval);
        setPlaceholder('Spør meg om Skillhouse...');
      }
    }, 150);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const question = input.trim();
    setInput('');
    setMessageCount((count) => count + 1);
    setMessages((prev) => {
      const updated = [{ from: 'user', text: question }, ...prev];
      return updated.slice(0, 6); // 3 par av spørsmål/svar
    });

    setIsTyping(true);
    const words = "Takk for spørsmålet! Skillhouse leverer rådgivning innen teknologi, ingeniørfag og salg.".split(' ');
    let i = 0;
    const interval = setInterval(() => {
      setMessages((prev) => {
        const withoutBot = prev.filter((m) => m.from !== 'bot');
        const newBotMsg = { from: 'bot', text: words.slice(0, i + 1).join(' ') };
        return [newBotMsg, ...withoutBot].slice(0, 6);
      });
      i++;
      if (i === words.length) {
        clearInterval(interval);
        setIsTyping(false);
        setPlaceholder(
          messageCount + 1 >= 3 ? 'Vil du høre en suksesshistorie?' : 'Lurer du på noe annet?'
        );
      }
    }, 150);
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 pt-32 relative bg-[#312f2f] text-skillwhite font-sans">
      <div className="w-full max-w-2xl">
        <div className="mb-12">
          <div className="flex items-center">
            <input
              type="text"
              className="bg-transparent border-none text-skillwhite placeholder-gray-500 focus:outline-none flex-1 text-lg"
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-4 p-2 bg-skillgreen rounded-md hover:bg-opacity-80 transition"
              aria-label="Send"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {messages.map((msg, i) => (
            <p
              key={i}
              className={`whitespace-pre-wrap transition-opacity duration-500 ${
                msg.from === 'bot' ? 'italic text-skillwhite' : 'font-semibold text-skillwhite'
              }`}
            >
              {msg.text}
            </p>
          ))}
          {isTyping && (
            <p className="italic text-gray-400 transition-opacity duration-300">Skillbot skriver...</p>
          )}
        </div>
      </div>
      <div className="absolute bottom-4 right-4 opacity-50">
        <img src="/skillhouse-logo.svg" alt="Skillhouse logo" className="h-5" />
      </div>
    </main>
  );
}