import { useState, useRef, useEffect } from "react";
import { FaRobot, FaPaperPlane } from "react-icons/fa";

const CREATION_STEPS = {
  admin: [
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "correo", label: "Correo electrónico" },
    { key: "telefono", label: "Teléfono" },
    { key: "contrasena", label: "Contraseña" },
    { key: "identificacion", label: "Identificación" },
    { key: "fechaNacimiento", label: "Fecha de nacimiento (YYYY-MM-DD)" },
    { key: "genero", label: "Género (Masculino/Femenino)" },
  ],
  doctor: [
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "correo", label: "Correo electrónico" },
    { key: "telefono", label: "Teléfono" },
    { key: "contrasena", label: "Contraseña" },
    { key: "identificacion", label: "Identificación" },
    { key: "fechaNacimiento", label: "Fecha de nacimiento (YYYY-MM-DD)" },
    { key: "genero", label: "Género (Masculino/Femenino)" },
    { key: "departamentoMedico", label: "Departamento Médico" },
    { key: "doctorImage", label: "URL de la imagen del doctor (opcional, escribe 'omitir' para saltar)" },
  ],
};

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

async function crearUsuario(tipo, datos) {
  const url = tipo === "admin"
    ? "http://localhost:3030/api/v1/user/create-new-admin"
    : "http://localhost:3030/api/v1/user/create-new-doctor";
  const method = "POST";
  let body, headers;
  if (tipo === "doctor") {
    const cleanDatos = { ...datos };
    if (
      !cleanDatos.doctorImage ||
      (typeof cleanDatos.doctorImage === "string" && cleanDatos.doctorImage.trim().toLowerCase() === "omitir")
    ) {
      delete cleanDatos.doctorImage;
    }
    if (cleanDatos.doctorImage) {
      body = new FormData();
      Object.entries(cleanDatos).forEach(([k, v]) => body.append(k, v));
      headers = {};
    } else {
      body = JSON.stringify(cleanDatos);
      headers = { "Content-Type": "application/json" };
    }
  } else {
    body = JSON.stringify(datos);
    headers = { "Content-Type": "application/json" };
  }
  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
      credentials: "include",
    });
    const data = await response.json();
    if (response.ok) {
      return { ok: true, message: data.message || "Usuario creado exitosamente." };
    } else {
      return { ok: false, message: data.message || "Error al crear usuario." };
    }
  } catch (error) {
    return { ok: false, message: "Error de conexión con el servidor." };
  }
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "¡Hola! ¿En qué puedo ayudarte hoy?" },
  ]);
  const [input, setInput] = useState("");
  const [creationMode, setCreationMode] = useState(null); // "admin" | "doctor" | null
  const [creationStep, setCreationStep] = useState(0);
  const [creationData, setCreationData] = useState({});
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

    // --- Modo creación de usuario/doctor ---
    if (creationMode) {
      const step = CREATION_STEPS[creationMode][creationStep];
      let value = input.trim();
      // Permitir omitir imagen del doctor (robusto a mayúsculas/minúsculas y espacios)
      if (creationMode === "doctor" && step.key === "doctorImage" && value.replace(/\s+/g, '').toLowerCase() === "omitir") {
        value = "omitir";
      }
      setCreationData((prev) => ({ ...prev, [step.key]: value }));
      if (creationStep + 1 < CREATION_STEPS[creationMode].length) {
        setCreationStep(creationStep + 1);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: `Por favor, ingresa ${CREATION_STEPS[creationMode][creationStep + 1].label}:` },
          ]);
        }, 300);
      } else {
        // Enviar datos al backend
        setTimeout(async () => {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: "Creando usuario..." },
          ]);
          // Limpieza robusta: si doctorImage es 'omitir', elimínalo antes de enviar
          let datosEnviar = { ...creationData, [step.key]: value };
          if (
            creationMode === "doctor" &&
            typeof datosEnviar.doctorImage === "string" &&
            datosEnviar.doctorImage.replace(/\s+/g, '').toLowerCase() === "omitir"
          ) {
            delete datosEnviar.doctorImage;
          }
          const res = await crearUsuario(creationMode, datosEnviar);
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: res.message },
          ]);
          setCreationMode(null);
          setCreationStep(0);
          setCreationData({});
        }, 500);
      }
      return;
    }

    // --- Detectar comandos de creación ---
    const lower = input.trim().toLowerCase();
    if (lower.includes("crear administrador")) {
      setCreationMode("admin");
      setCreationStep(0);
      setCreationData({});
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: `Vamos a crear un administrador. Por favor, ingresa ${CREATION_STEPS.admin[0].label}:` },
        ]);
      }, 300);
      return;
    }
    if (lower.includes("crear doctor")) {
      setCreationMode("doctor");
      setCreationStep(0);
      setCreationData({});
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: `Vamos a crear un doctor. Por favor, ingresa ${CREATION_STEPS.doctor[0].label}:` },
        ]);
      }, 300);
      return;
    }

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
