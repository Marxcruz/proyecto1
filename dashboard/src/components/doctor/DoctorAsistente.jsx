import React, { useState, useRef } from 'react';
import DoctorSidebar from '../DoctorSidebar';
import { FaRobot, FaPaperPlane, FaSpinner } from 'react-icons/fa';

const DoctorAsistente = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hola doctor, soy su asistente médico IA. ¿En qué puedo ayudarle hoy?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Función para simular la respuesta de la IA
  const handleAIResponse = (query) => {
    // En un entorno real, esto sería una llamada a una API de IA
    setIsLoading(true);
    
    // Simular tiempo de procesamiento
    setTimeout(() => {
      let response = "Lo siento, no puedo procesar esa consulta en este momento.";
      
      // Respuestas predefinidas basadas en palabras clave
      if (query.toLowerCase().includes('diagnóstico') || query.toLowerCase().includes('diagnostico')) {
        response = "Para un diagnóstico preciso, recomiendo considerar los siguientes factores: síntomas presentados, duración, historial médico del paciente, y resultados de pruebas relevantes. Recuerde que esta es solo una sugerencia y el juicio clínico siempre debe prevalecer.";
      } else if (query.toLowerCase().includes('tratamiento')) {
        response = "Al considerar opciones de tratamiento, recuerde evaluar: eficacia basada en evidencia, posibles interacciones medicamentosas, contraindicaciones específicas del paciente, y relación riesgo-beneficio. Siempre personalice el tratamiento según las necesidades individuales del paciente.";
      } else if (query.toLowerCase().includes('medicamento') || query.toLowerCase().includes('dosis')) {
        response = "Para consultas sobre medicamentos específicos o dosificación, le recomiendo verificar las guías clínicas actualizadas o consultar con farmacología clínica. Recuerde considerar el peso del paciente, función renal y hepática, y posibles interacciones con otros medicamentos.";
      } else if (query.toLowerCase().includes('síntoma') || query.toLowerCase().includes('sintoma')) {
        response = "Al evaluar síntomas, considere factores como: inicio (agudo vs. gradual), duración, factores agravantes/atenuantes, y síntomas asociados. La contextualización de los síntomas dentro del cuadro clínico completo es esencial para una evaluación precisa.";
      } else if (query.length > 5) {
        response = "Su consulta es interesante. Como asistente médico, puedo ofrecer información general basada en literatura médica, pero recuerde que cada caso clínico es único y requiere su juicio profesional. ¿Necesita información adicional sobre algún aspecto específico?";
      }
      
      // Agregar respuesta al chat
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsLoading(false);
    }, 1500);
  };

  // Manejar envío de mensaje
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    // Obtener respuesta de la IA
    handleAIResponse(input);
    
    // Limpiar input
    setInput('');
  };

  // Auto-scroll al último mensaje
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-100">
      <DoctorSidebar />
      <div className="flex-1 overflow-auto p-6 ml-64">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FaRobot className="text-blue-500 mr-2" /> Asistente Médico IA
        </h1>
        
        <div className="bg-white rounded-lg shadow-md h-[calc(100vh-180px)] flex flex-col">
          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mb-4 flex justify-start">
                <div className="rounded-lg px-4 py-2 bg-gray-100 text-gray-800 flex items-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Pensando...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Área de input */}
          <form onSubmit={handleSubmit} className="border-t p-4 flex">
            <input
              type="text"
              placeholder="Escriba su consulta médica..."
              className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-r-lg px-4 py-2 hover:bg-blue-600 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default DoctorAsistente;
