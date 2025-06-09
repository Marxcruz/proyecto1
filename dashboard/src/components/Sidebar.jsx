import React, { useContext, useState } from "react";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import { TiHome } from "react-icons/ti";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { RiLogoutBoxFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
const Sidebar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigate = useNavigate();

  // función para mostrar todo

  const gotoHome = () => {
    navigate("/");
    setShow(false);
  };
  // mostrar página de todos los médicos
  const gotoDoctors = () => {
    navigate("/todos-medicos");
    setShow(false);
  };

  // mostrar página de todos los pacientes
  const gotoPatients = () => {
    navigate("/todos-pacientes");
    setShow(false);
  };

  // mostrar página de todos los mensajes
  const gotoMessages = () => {
    navigate("/todos-mensajes");
    setShow(false);
  };

  // mostrar página para agregar nuevo doctor
  const gotoAddDoctor = () => {
    navigate("/add-new/doctor");
    setShow(false);
  };

  // mostrar página para agregar nuevo administrador
  const gotoAddAdmin = () => {
    navigate("/add-new/admin");
    setShow(false);
  };

  const handleLogOut = async () => {
    try {
      await axios.get(
        "http://localhost:3030/api/v1/user/logout-admin",
        { withCredentials: true }
      );
      // Opcional: Podrías mostrar un toast de éxito aquí si lo deseas,
      // pero la redirección inmediata podría hacerlo menos visible.
      // toast.success("Sesión cerrada exitosamente");
    } catch (error) {
      // Es buena práctica registrar el error, aunque no lo mostremos al usuario
      // para no interrumpir el flujo de cierre de sesión.
      console.error("Error durante la llamada API de cierre de sesión del administrador:", error);
      // Opcionalmente, podrías mostrar un toast de error si la API falla,
      // pero la redirección y limpieza de sesión seguirán ocurriendo.
      // if (error.response && error.response.data && error.response.data.message) {
      //   toast.error(error.response.data.message);
      // } else {
      //   toast.error("Error al intentar cerrar sesión con el servidor.
      // }
    } finally {
      setIsAuthenticated(false);
      // Limpiar localStorage y sessionStorage para asegurar un estado limpio
      localStorage.clear();
      sessionStorage.clear();
      // Redirigir a la página principal del cliente
      window.location.href = "http://localhost:5173/";
    }
  };
  return (
    <>
      <div
        className={`fixed top-1/2 left-[10px] rounded-t-[5px] rounded-b-[7px] h-[370px] w-[60px] lg:w-[80px] 
    bg-gray-900 p-4 transition-all duration-300 ease-in-out transform ${
      show ? "translate-x-0" : "-translate-x-full "
    } lg:translate-x-0 -translate-y-1/2 flex flex-col items-center justify-center z-50`}
        style={!isAuthenticated ? { display: "none" } : {}}
      >
        <div className="flex flex-col items-center space-y-6 text-white">
          <TiHome
            className="text-3xl lg:text-4xl cursor-pointer text-blue-400 hover:bg-blue-600"
            onClick={gotoHome}
          />
          <FaUserDoctor
            className="text-3xl lg:text-4xl cursor-pointer text-green-400 hover:bg-green-600"
            onClick={gotoDoctors}
          />
          <MdAddModerator
            className="text-3xl lg:text-4xl cursor-pointer text-blue-400 hover:bg-blue-600"
            onClick={gotoAddAdmin}
          />
          <IoPersonAddSharp
            className="text-3xl lg:text-4xl cursor-pointer text-purple-400 hover:bg-purple-600"
            onClick={gotoAddDoctor}
          />
          <AiFillMessage
            className="text-3xl lg:text-4xl cursor-pointer text-pink-400 hover:bg-pink-600"
            onClick={gotoMessages}
          />
          <FaUserFriends
            className="text-3xl lg:text-4xl cursor-pointer text-blue-400 hover:bg-blue-600"
            onClick={gotoPatients}
          />
          <RiLogoutBoxFill
            className="text-3xl lg:text-4xl cursor-pointer text-red-400 hover:bg-red-600"
            onClick={handleLogOut}
          />
        </div>
      </div>
      <div
        className="fixed top-0 left-0 p-4 z-50"
        style={!isAuthenticated ? { display: "none" } : {}}
      >
        <GiHamburgerMenu
          className="cursor-pointer text-gray-900 text-3xl lg:text-4xl"
          onClick={() => setShow(!show)}
        />
      </div>
    </>
  );
};

export default Sidebar;
