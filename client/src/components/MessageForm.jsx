import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const MessageForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleMessage = async (e) => {
    e.preventDefault();
    
    // Validar que todos los campos estén completos
    if (!firstName || !lastName || !email || !phone || !message) {
      toast.error("Por favor complete todos los campos del formulario");
      return;
    }
    
    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor ingrese un correo electrónico válido");
      return;
    }
    
    // Validar que el teléfono tenga 9 dígitos
    if (phone.length !== 9 || !/^\d+$/.test(phone)) {
      toast.error("El teléfono debe contener exactamente 9 dígitos");
      return;
    }
    
    // Validar longitud mínima del mensaje
    if (message.length < 10) {
      toast.error("El mensaje debe contener al menos 10 caracteres");
      return;
    }
    
    // Crear objeto con los datos en el formato esperado por el servidor
    const formData = {
      nombre: firstName,
      apellido: lastName,
      correo: email,
      telefono: phone,
      mensaje: message
    };
    
    console.log('Enviando datos:', formData);
    
    try {
      // Enviar solicitud al servidor
      const response = await axios({
        method: 'post',
        url: 'http://localhost:3030/api/v1/message/create-message',
        data: formData,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      
      console.log('Respuesta del servidor:', response.data);
      toast.success(response.data.message);
      
      // Limpiar el formulario después de enviar con éxito
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      toast.error(error.response?.data?.message || "Error al enviar el mensaje");
    }
  };
  return (
    <div className="max-w-[1540px] mx-auto py-12 mb-2 px-4 bg-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Solicitud de Información Clínica
      </h2>
      <form action="" className="space-y-6" onSubmit={handleMessage}>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Nombre"
            className="w-full md:w-1/2 p-3 text-xl border-gray-300 bg-slate-300 rounded-md outlien-none shadow-md"
          />
          <input
            type="text"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full md:w-1/2 p-3 text-xl border-gray-300 bg-slate-300 rounded-md outlien-none shadow-md"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full md:w-1/2 p-3 text-xl border-gray-300 bg-slate-300 rounded-md outlien-none shadow-md"
          />
          <input
            type="phone"
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full md:w-1/2 p-3 text-xl border-gray-300 bg-slate-300 rounded-md outlien-none shadow-md"
          />
        </div>
        <textarea
          placeholder="Describa su consulta o solicitud de información sobre su historial clínico (mínimo 10 caracteres)"
          rows="7"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 text-md border border-gray-300  bg-slate-300 rounded-md outline-none shadow-md"
        />
        <div className="flex justify-center mb-4">
          <button className="bg-blue-500 text-black py-2 px-24 rounded hover:bg-blue-600">
            Enviar Solicitud
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageForm;
