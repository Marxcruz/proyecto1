import { useState, useRef, useEffect } from "react";
import { FaRobot, FaPaperPlane } from "react-icons/fa";

const getLlama3Response = async (message) => {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama3:latest", prompt: message, stream: false })
    });
    const data = await response.json();
    // Ollama responde con { response: "texto...", ... }
    return data.response ? data.response.trim() : "[Error: Sin respuesta de Llama 3]";
  } catch (error) {
    return "[Error de conexión con Llama 3]";
  }
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "¡Hola! ¿En qué puedo ayudarte hoy?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    // Respuesta real de Llama 3
    const aiText = await getLlama3Response(input);
    setMessages((prev) => [...prev, { from: "bot", text: aiText }]);
  };

  return (
    <>
      {/* Burbuja flotante */}
      <div
        className="fixed bottom-8 right-8 z-[100] flex flex-col items-end"
        style={{ pointerEvents: "auto" }}
      >
        {open && (
          <div className="w-80 bg-white shadow-xl rounded-xl mb-2 border border-gray-200 flex flex-col overflow-hidden animate-fade-in">
            <div className="bg-indigo-600 text-white px-4 py-2 flex items-center gap-2">
              <FaRobot /> <span>Chat IA</span>
              <button
                className="ml-auto text-white hover:text-gray-200"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="flex-1 px-4 py-2 h-64 overflow-y-auto bg-gray-50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`my-1 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${
                      msg.from === "user"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form
              className="flex border-t border-gray-200 bg-white"
              onSubmit={sendMessage}
            >
              <input
                className="flex-1 px-3 py-2 outline-none text-sm"
                type="text"
                placeholder="Escribe tu mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 text-indigo-600 hover:text-indigo-800"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        )}
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center text-2xl"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir chat IA"
        >
          <FaRobot />
        </button>
      </div>
    </>
  );
}
