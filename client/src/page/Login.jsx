import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Paciente");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Accessing context
  const { setIsAuth, setUser } = useContext(Context);

  const validateForm = () => {
    if (!email.trim()) {
      toast.error("Por favor, ingrese su correo electrónico");
      return false;
    }
    if (!password.trim()) {
      toast.error("Por favor, ingrese su contraseña");
      return false;
    }
    if (!role) {
      toast.error("Por favor, seleccione un rol");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validar formulario antes de enviar
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3030/api/v1/user/login-user",
        { correo: email, contrasena: password, rol: role },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      // Update context on successful login
      setIsAuth(true);
      setUser(response.data.user);

      toast.success("Inicio de sesión exitoso");
      
      // Redirigir según el rol seleccionado
      if (role === "Doctor") {
        // Redirigir al dashboard del doctor
        window.location.href = "http://localhost:5174/doctor-dashboard";
      } else if (role === "Administrador") {
        // Redirigir al dashboard del administrador
        window.location.href = "http://localhost:5174";
      } else {
        // Redirigir al dashboard del paciente
        window.location.href = "http://localhost:5174/patient-dashboard";
      }
      
      setEmail("");
      setPassword("");
      setRole("Paciente");
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-300">
      <section className="flex justify-center items-center py-24 w-[500px] rounded-md">
        <div className="px-4 bg-white p-2 py-6 w-full lg:max-w-[650px] md:max-w-[500px] max-w-[300px] mx-auto flex flex-col rounded-lg shadow-lg">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-center py-8 text-xl md:text-2xl font-bold text-blue-500">
              Iniciar Sesión
            </h2>
            <form className="flex flex-col gap-6 w-full" onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <input
                  type="email"
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
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 border border-gray-300 bg-slate-300 rounded-md outline-none shadow-md"
                  required
                >
                  <option value="">Seleccionar Rol</option>
                  <option value="Paciente">Paciente</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              <div className="flex justify-between px-4 items-center mb-4">
                <p className="mb-0">¿No tienes una cuenta?</p>
                <Link to="/register" className="text-blue-600 hover:underline">
                  Regístrate Ahora
                </Link>
              </div>
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-5 w-full py-1 rounded-lg cursor-pointer bg-blue-200 
            text-lg text-black text-center border-2 border-black hover:border-3 hover:scale-105 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
