import { useState, useRef, useEffect } from "react";
import { FaRobot, FaPaperPlane } from "react-icons/fa";
import ResizableChatWindow from "./ResizableChatWindow";

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
    // Si doctorImage es un archivo, asegúrate de que va como FormData
    if (
      cleanDatos.doctorImage && typeof cleanDatos.doctorImage !== "string"
    ) {
      body = new FormData();
      Object.entries(cleanDatos).forEach(([k, v]) => {
        // Solo el campo doctorImage debe ser archivo, el resto string
        if (k === "doctorImage" && v instanceof File) {
          body.append("doctorImage", v);
        } else {
          body.append(k, v);
        }
      });
      headers = {};
    } else {
      // Si el usuario escribió 'omitir' o no hay imagen, enviar JSON
      if (
        !cleanDatos.doctorImage ||
        (typeof cleanDatos.doctorImage === "string" && cleanDatos.doctorImage.trim().toLowerCase() === "omitir")
      ) {
        delete cleanDatos.doctorImage;
      }
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
  const [selectedFile, setSelectedFile] = useState(null); // Para imagen de doctor
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
      // Manejo especial para imagen del doctor
      if (creationMode === "doctor" && step.key === "doctorImage") {
        if (selectedFile) {
          value = selectedFile;
        } else if (value.replace(/\s+/g, '').toLowerCase() === "omitir") {
          value = "omitir";
        }
        setSelectedFile(null); // Limpiar después de usar
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

    // Solo responder si la pregunta es del sistema
    function esPreguntaDelSistema(texto) {
      // Palabras clave ampliadas y robustas
      const keywords = [
        "doctor", "doctores", "paciente", "pacientes", "administrador", "usuario", "usuarios", "cita", "citas",
        "departamento", "departamentos", "login", "registro", "crear", "eliminar", "modificar", "hospital",
        "imagen", "correo", "contraseña", "teléfono", "identificación", "departamento médico", "dashboard", "rol",
        "token", "autenticación", "historial", "especialidad", "receta", "recetas", "laboratorio", "resultados", "perfil",
        "sistema", "gestión", "agendar", "cancelar", "consultar", "médico", "médicos"
      ];
      const lower = texto.toLowerCase();
      return keywords.some(k => lower.includes(k));
    }
    if (!esPreguntaDelSistema(input)) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Solo puedo responder preguntas relacionadas con el sistema de gestión hospitalaria (usuarios, doctores, pacientes, citas, etc.)." }
      ]);
      return;
    }
    // Respuesta real de Llama 3, pero forzando contexto de sistema (y forzando rechazo a temas no relacionados)
    const aiText = await getLlama3Response(
      `IMPORTANTE: Responde ÚNICAMENTE sobre el sistema de gestión hospitalaria (usuarios, doctores, pacientes, citas, historial médico, recetas, resultados de laboratorio, etc). Si la pregunta NO es relevante, responde EXCLUSIVAMENTE: 'Solo puedo responder preguntas relacionadas con el sistema de gestión hospitalaria.' NO cuentes chistes, ni respondas temas generales, ni des información fuera del sistema hospitalario. Pregunta: ${input}`
    );
    // Si la IA por error responde algo fuera de dominio, igual mostramos el mensaje estándar
    if (!esPreguntaDelSistema(aiText)) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Solo puedo responder preguntas relacionadas con el sistema de gestión hospitalaria (usuarios, doctores, pacientes, citas, etc.)." }
      ]);
    } else {
      setMessages((prev) => [...prev, { from: "bot", text: aiText }]);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end" style={{ pointerEvents: "auto" }}>
      {open ? (
        <ResizableChatWindow
          messages={messages}
          setMessages={setMessages}
          onClose={() => setOpen(false)}
          messagesEndRef={messagesEndRef}
          creationMode={creationMode}
          creationStep={creationStep}
          CREATION_STEPS={CREATION_STEPS}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          setInput={setInput}
          sendMessage={sendMessage}
          input={input}
          setOpen={setOpen}
        />
      ) : (
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center text-2xl"
          onClick={() => setOpen(true)}
          aria-label="Abrir chat IA"
        >
          <FaRobot />
        </button>
      )}
    </div>
  );
}
