import React, { useRef, useState, useEffect } from "react";
import { FaRobot, FaExpand, FaCompress, FaHistory } from "react-icons/fa";

export default function ResizableChatWindow({
  messages,
  setMessages,
  onClose,
  messagesEndRef,
  creationMode,
  creationStep,
  CREATION_STEPS,
  selectedFile,
  setSelectedFile,
  setInput,
  sendMessage,
  input,
  setOpen,
  onImageStepComplete
}) {
  // Tamaño y modo expandido
  const [height, setHeight] = useState(420);
  const [width, setWidth] = useState(380);
  const [expanded, setExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const chatRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const resizing = useRef(false);

  useEffect(() => {
    if (messagesEndRef && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messagesEndRef]);

  // Drag para redimensionar
  const onMouseDown = (e) => {
    resizing.current = true;
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      width,
      height,
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!resizing.current) return;
    setWidth(Math.max(320, startPos.current.width + (e.clientX - startPos.current.x)));
    setHeight(Math.max(320, startPos.current.height + (e.clientY - startPos.current.y)));
  };

  const onMouseUp = () => {
    resizing.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  // Expandir/minimizar
  const toggleExpand = () => {
    setExpanded((prev) => {
      if (!prev) {
        setWidth(600);
        setHeight(650);
      } else {
        setWidth(380);
        setHeight(420);
      }
      return !prev;
    });
  };

  // Mostrar historial completo
  const handleShowHistory = () => setShowHistory((prev) => !prev);

  // Ref para botón enviar (sin animación)
  const sendBtnRef = useRef(null);

  return (
    <div
      ref={chatRef}
      className={`bg-white shadow-xl rounded-xl mb-2 border border-gray-200 flex flex-col overflow-hidden animate-fade-in relative select-none`}
      style={{ width, height, minWidth: 320, minHeight: 320, resize: "none" }}
    >
      {/* Barra superior */}
      <div className="bg-indigo-600 text-white px-4 py-2 flex items-center gap-2 cursor-move select-none">
        <FaRobot /> <span>Chat IA</span>
        <button
          className="ml-auto text-white hover:text-gray-200 px-2"
          onClick={toggleExpand}
          title={expanded ? "Minimizar" : "Expandir"}
        >
          {expanded ? <FaCompress /> : <FaExpand />}
        </button>
        <button
          className="text-white hover:text-gray-200 px-2"
          onClick={handleShowHistory}
          title="Ver historial completo"
        >
          <FaHistory />
        </button>
        <button
          className="text-white hover:text-gray-200 px-2"
          onClick={onClose}
          title="Cerrar chat"
        >
          ×
        </button>
      </div>
      {/* Mensajes */}
      <div className="flex-1 px-4 py-2 overflow-y-auto bg-gray-50" style={{ height: height - 120 }}>
        {(showHistory ? messages : messages.slice(-20)).map((msg, i) => (
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
      {/* Barra para redimensionar */}
      <div
        className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-10"
        style={{ userSelect: "none" }}
        onMouseDown={onMouseDown}
        title="Redimensionar"
      >
        <svg width="24" height="24" viewBox="0 0 24 24"><path d="M4 20h16v2H4z" fill="#6366f1"/><path d="M20 4v16h2V4z" fill="#6366f1"/></svg>
      </div>
      {/* Input y controles */}
      <form
        className="flex border-t border-gray-200 bg-white"
        onSubmit={sendMessage}
        style={{ minHeight: 56 }}
      >
        {/* Si estamos en el paso de imagen del doctor, mostrar input file */}
        {creationMode === "doctor" && CREATION_STEPS.doctor[creationStep]?.key === "doctorImage" && (
          <>
            <input
              type="file"
              accept="image/*"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded mr-2"
              onChange={e => {
                setSelectedFile(e.target.files[0]);
                setInput(e.target.files[0]?.name || "");
              }}
              style={{ maxWidth: 180 }}
            />
            <button
              type="button"
              className="ml-2 px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm"
              disabled={!selectedFile}
              onClick={() => {
                if (!selectedFile) return;
                const step = CREATION_STEPS.doctor[creationStep];
                let value = selectedFile;
                setInput("");
                setSelectedFile(null);
                setTimeout(() => {
                  setMessages(prev => ([
                    ...prev,
                    { from: "user", text: value.name },
                  ]));
                  if (typeof onImageStepComplete === 'function') {
                    onImageStepComplete(value);
                  }
                }, 100);
              }}
            >
              Aceptar imagen
            </button>
          </>
        )}
        <input
          className="flex-1 px-3 py-2 outline-none text-sm"
          type="text"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={creationMode === "doctor" && CREATION_STEPS.doctor[creationStep]?.key === "doctorImage"}
        />
        <button
          type="submit"
          ref={sendBtnRef}
          className="ml-2 px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-2xl flex items-center gap-2 transition-all duration-200 hover:from-pink-500 hover:to-indigo-500 focus:outline-none focus:ring-4 focus:ring-pink-300 text-base h-full self-stretch relative outline-none ring-0 border-none active:scale-97"
          style={{ minWidth: 56, minHeight: 56, width: 56, height: 56, justifyContent: 'center' }}
          disabled={!input.trim()}
        >
          <span className="flex items-center justify-center w-full h-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-6 9 6-9 6-9-6zm0 10l9-6 9 6M3 10v10m18-10v10" />
            </svg>
          </span>
        </button>
      </form>
    </div>
  );
}
