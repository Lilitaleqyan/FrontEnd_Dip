import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([{ sender: "AI", text: "Բարև! Ես ԳրքաՊտույտի AI օգնականն եմ: Ինչո՞վ կարող եմ օգնել:" }]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
    const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8181";

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "you", text: message };
    setChatLog((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("jwt_token");
      const res = await fetch(`${API_URL}/chat`, { 
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      const aiResponse = data.reply || "Ներողություն, սխալ տեղի ունեցավ:";
      setChatLog((prev) => [...prev, { sender: "AI", text: aiResponse }]);
    } catch (err) {
      setChatLog((prev) => [...prev, { sender: "AI", text: "Կապի սխալ: Համոզվեք, որ սերվերը միացված է:" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
     
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
        >
          <MessageCircle size={28} />
        </button>
      )}

   
      {isOpen && (
        <div className="bg-card w-80 h-96 rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
     
          <div className="bg-primary p-4 text-white flex justify-between items-center">
            <span className="font-semibold">ԳրքաՊտույտի AI օգնական</span>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatLog.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                  msg.sender === "you" ? "bg-primary text-white" : "bg-muted text-foreground"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-muted-foreground italic">AI-ն մտածում է...</div>}
            <div ref={scrollRef} />
          </div>

       
          <div className="p-3 border-t border-border flex gap-2">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Հարցրեք..."
              className="flex-1 bg-muted rounded-md px-3 py-1 text-sm focus:outline-none"
            />
            <button onClick={handleSend} className="text-primary"><Send size={20} /></button>
          </div>
        </div>
      )}
    </div>
  );
}