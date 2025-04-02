import { useState, useEffect } from 'react';

export default function InfoPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    setPlaceholder('Spør meg om Skillhouse...');
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const question = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { from: 'user', text: question }]);
    setIsTyping(true);
    setMessageCount((count) => count + 1);

    const words = "Takk for spørsmålet! Skillhouse leverer rådgivning innen teknologi, ingeniørfag og salg.".split(' ');
    let i = 0;
    const interval = setInterval(() => {
      setMessages((prev) => {
        const existing = prev.filter((m) => m.from !== 'bot');
        const botMsg = { from: 'bot', text: words.slice(0, i + 1).join(' ') };
        return [...existing, botMsg];
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
    <main className="min-h-screen flex flex-col items-center px-4 pt-16 relative">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <input
              type="text"
              className="bg-transparent border-b border-skillwhite text-skillwhite placeholder-gray-500 focus:outline-none flex-1 text-lg pb-2"
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
              className={`whitespace-pre-wrap transition-opacity duration-300 ${
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