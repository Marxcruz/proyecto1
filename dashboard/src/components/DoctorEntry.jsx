import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

// Configuraciu00f3n bu00e1sica de axios
axios.defaults.withCredentials = true;
axios.defaults.timeout = 15000; // 15 segundos de timeout
axios.defaults.headers.common['Content-Type'] = 'application/json';

const DoctorEntry = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginAsSampleDoctor = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Usando las credenciales de un doctor existente para pruebas
      const response = await axios.post(
        "http://localhost:3030/api/v1/user/login-user",
        { 
          correo: "doctor@hospital.com", 
          contrasena: "doctor123", 
          rol: "Doctor" 
        }
      );
      
      console.log('Respuesta del servidor:', response.data);
      
      if (response.data.success) {
        toast.success("Acceso al dashboard de doctor exitoso");
        
        // Redirigir despuu00e9s de un breve retraso para que la cookie se establezca
        setTimeout(() => {
          navigate("/doctor-dashboard");
        }, 1000);
      } else {
        toast.error("Error de acceso: " + (response.data.message || "Credenciales invu00e1lidas"));
      }
    } catch (error) {
      console.error('Error de acceso:', error);
      toast.error('Error al acceder al dashboard: ' + (error.response?.data?.message || 'Verifica la conexiu00f3n al servidor'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Acceso al Dashboard de Doctor</h2>
      
      <div className="space-y-4">
        <p className="text-gray-600 text-center">Accede directamente al dashboard de doctor para probar su funcionalidad</p>
        
        <div className="flex justify-center">
          <button
            onClick={handleLoginAsSampleDoctor}
            disabled={loading}
            className={`w-full py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? "Accediendo..." : "Acceder como Doctor"}
          </button>
        </div>
        
        <div className="text-center mt-4">
          <a href="/doctor-login" className="text-blue-500 hover:underline">Ir al inicio de sesiu00f3n regular</a>
        </div>
      </div>
    </div>
  );
};

export default DoctorEntry;
