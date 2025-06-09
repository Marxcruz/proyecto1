import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [contrasena, setContrasena] = useState("");

  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3030/api/v1/user/create-patient",
        {
          nombre,
          apellido,
          correo,
          telefono,
          identificacion,
          fechaNacimiento,
          genero,
          contrasena,
          rol: "Paciente",
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(res.data.message);
      navigate("/login"); // Navega a la página de inicio de sesión después del registro exitoso
      setNombre("");
      setApellido("");
      setCorreo("");
      setTelefono("");
      setIdentificacion("");
      setFechaNacimiento("");
      setGenero("");
      setContrasena("");
    } catch (error) {
      console.error("Error de registro:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("El registro falló. Por favor, inténtelo de nuevo.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-300">
      <section className="flex justify-center items-center py-24 rounded-md">
        <div className="px-4 bg-white p-2 py-6 w-full lg:max-w-[650px] md:max-w-[500px] max-w-[300px] mx-auto flex flex-col rounded-lg shadow-lg">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-center py-8 text-xl md:text-2xl font-bold text-blue-500">
              Registro
            </h2>
            <form
              className="flex flex-col gap-6 w-full"
              onSubmit={handleRegistration}
            >
              <div className="flex gap-6">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full md:w-1/2 p-3 border border-gray-300 bg-slate-300 rounded-md outline-none shadow-md"
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="w-full md:w-1/2 p-3 border border-gray-300 bg-slate-300 rounded-md outline-none shadow-md"
                />
              </div>
              <div className="flex gap-6">
                <input
                  type="text"
                  placeholder="Correo electrónico"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full md:w-1/2 p-3 border border-gray-300 bg-slate-300 rounded-md outline-none shadow-md"
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full md:w-1/2 p-3 border border-gray-300 bg-slate-300 rounded-md outline-none shadow-md"
                />
              </div>
              <div className="flex gap-6">
                <input
                  type="text"
                  placeholder="Número de identificación"
                  value={identificacion}
                  onChange={(e) => setIdentificacion(e.target.value)}
                  className="w-full md:w-1/2 p-3 border border-gray-300 bg-slate-300 rounded-md outline-none shadow-md"
                />
                <input
                  type="date"
                  placeholder="Fecha de nacimiento"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  className="w-full md:w-1/2 p-3 border border-gray-300 bg-slate-300 rounded-md outline-none shadow-md"
                />
              </div>
              <div className="flex gap-6">
                <select
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  className="w-full md:w-1/2 p-3 border border-gray-300 bg-slate-300 rounded-md outline-none shadow-md"
                >
                  <option value="">Seleccionar género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
                <input
                  type="phone"
                  placeholder="Número de teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full md:w-1/2 p-3 border border-gray-300 bg-slate-300 rounded-md outline-none shadow-md"
                />
              </div>
              <div className="flex justify-between px-4 items-center mb-4">
                <p className="mb-0">¿Ya tienes una cuenta?</p>
                <Link to={"/login"} className="text-blue-600 hover:underline">
                  Iniciar Sesión
                </Link>
              </div>
              <div className="flex justify-center items-center">
                <button
                  className="px-5 w-full py-1 rounded-lg cursor-pointer
                 bg-blue-200 text-lg text-black text-center border-2
                  border-black hover:border-3"
                >
                  Registrarse
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
