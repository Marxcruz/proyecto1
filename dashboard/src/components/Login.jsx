import React, { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

// Configuración básica de axios
axios.defaults.withCredentials = true;
axios.defaults.timeout = 15000; // 15 segundos de timeout
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Crear instancia de axios con configuración específica para este componente
const api = axios.create({
  baseURL: 'http://localhost:3030/api/v1',
  withCredentials: true
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim()) {
      toast.error("Por favor, ingrese su correo electrónico");
      return false;
    }
    if (!password.trim()) {
      toast.error("Por favor, ingrese su contraseña");
      return false;
    }
    return true;
  };

  // Establecer valores predeterminados para facilitar las pruebas
  useEffect(() => {
    // Puedes comentar estas líneas después de probar
    setEmail("admin@hospital.com");
    setPassword("admin123");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validar formulario antes de enviar
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      console.log('Intentando iniciar sesión con:', { correo: email, rol: "Administrador" });
      
      // Realizar directamente la petición de login sin verificación previa
      const response = await api.post(
        "/user/login-user",
        { 
          correo: email, 
          contrasena: password, 
          rol: "Administrador" 
        }
      );
      
      console.log('Respuesta del servidor:', response.data);
      toast.success("Inicio de sesión exitoso");
      setIsAuthenticated(true);
      navigate("/"); // Redireccionar al panel después del inicio de sesión
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      
      // Mensaje de error simplificado
      toast.error('Error al iniciar sesión: ' + (error.response?.data?.message || 'Verifica tus credenciales o la conexión al servidor'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-300">
      <section className="flex justify-center items-center py-24 w-[500px] rounded-md">
        <div className="px-4 bg-white p-2 py-6 w-full lg:max-w-[650px] md:max-w-[500px] max-w-[300px] mx-auto flex flex-col rounded-lg shadow-lg">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-center py-8 text-xl md:text-2xl font-bold text-blue-500">
              Sistema de Historial Clínico Digital - Iniciar Sesión
            </h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-6 w-full">
              <input
                type="text"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 bg-slate-300 rounded-md outline-none shadow-md"
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 bg-slate-300 rounded-md outline-none shadow-md"
                required
              />
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-5 w-full py-1 rounded-lg cursor-pointer bg-blue-200 text-lg text-black text-center border-2 border-black hover:border-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
