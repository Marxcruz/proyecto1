import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import { FiMessageSquare, FiSend } from 'react-icons/fi';

const AIChatWindow = ({ onClose, darkMode }) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: Date.now(), text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?', sender: 'ai', timestamp: new Date() },
  ]);
  const [inputText, setInputText] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');
    setIsAiTyping(true);

    try {
      // Usamos la misma lógica que el dashboard de administrador
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama3:latest", prompt: inputText, stream: false })
      });
      const data = await response.json();
      // Ollama responde con { response: "texto...", ... }
      const aiContent = data.response ? data.response.trim() : "[Error: Sin respuesta de Llama 3]";
      const aiResponse = {
        id: Date.now(),
        text: aiContent,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    } catch (error) {
      // Manejo de error igual que en el admin, mensaje claro para el usuario
      setMessages(prevMessages => [...prevMessages, {
        id: Date.now(),
        text: '[Error de conexión con Llama 3]',
        sender: 'ai',
        timestamp: new Date(),
      }]);
    } finally {
      setIsAiTyping(false);
    }
  };
  
  const formatTimestamp = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`fixed bottom-20 right-6 w-full max-w-md h-[70vh] max-h-[600px] shadow-2xl rounded-lg flex flex-col z-50 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} transition-all duration-300 ease-in-out transform animate-slide-in-bottom`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center">
          <FiMessageSquare className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
          <h3 className="font-semibold text-lg">Asistente Virtual</h3>
        </div>
        <button onClick={onClose} className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
          <FaTimes size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[75%] p-3 rounded-xl shadow ${msg.sender === 'user' ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-200')}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
            <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatTimestamp(msg.timestamp)}
            </span>
          </div>
        ))}
        {isAiTyping && (
          <div className="flex items-start">
            <div className={`max-w-[75%] p-3 rounded-xl shadow ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className="flex items-center space-x-1">
                <span className="text-sm">Asistente está escribiendo</span>
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe tu mensaje..."
            className={`flex-1 p-3 border rounded-lg focus:ring-2 ${darkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 placeholder-gray-400' : 'bg-white border-gray-300 focus:ring-blue-500 placeholder-gray-500'}`}
          />
          <button
            onClick={handleSendMessage}
            className={`p-3 rounded-lg text-white ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            disabled={isAiTyping}
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
      {/* Corregido: <style jsx global> ahora es solo <style jsx global> sin pasar booleanos directos */}
      <style jsx global>{`
        .animate-slide-in-bottom {
          animation: slide-in-bottom 0.3s ease-out forwards;
        }
        @keyframes slide-in-bottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .typing-indicator span {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin-left: 2px;
          background-color: ${darkMode ? '#9CA3AF' : '#6B7280'};
          border-radius: 50%;
          animation: typing-pulse 1.2s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(1) { animation-delay: 0s; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AIChatWindow;
