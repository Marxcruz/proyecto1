import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./page/Home";
import PageNotFound from "./page/PageNotFound";
import PrivacyandPolicy from "./page/PrivacyandPolicy";
import Contact from "./page/Contact";
import Services from "./page/Services";
import Appointment from "./page/Appointment";
import Register from "./page/Register";
import Login from "./page/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./page/About";
import ChatBubble from "./components/ChatBubble";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "./main";
const App = () => {
  // const { isAuth, setIsAuth, setUser } = useContext(Context);

  // // get single patinent
  // useEffect(() => {
  //   const fatchUser = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:3030/api/v1/user/single-patient",
  //         { withCredentials: true }
  //       );
  //       setIsAuth(true);
  //       setUser(response.data.user);
  //     } catch (error) {
  //       setIsAuth(false);
  //       setUser({});
  //     }
  //   };
  //   fatchUser();
  // }, [isAuth]);

  const { setIsAuth, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('Intentando obtener datos del usuario...');
        const response = await axios.get(
          "http://localhost:3030/api/v1/user/single-patient",
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        console.log('Datos del usuario obtenidos:', response.data);
        if (response.data && response.data.user) {
          setIsAuth(true);
          setUser(response.data.user);
        } else {
          console.warn('Respuesta del servidor no contiene datos de usuario');
          setIsAuth(false);
          setUser({});
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        // No es un error crítico si el usuario no está autenticado
        setIsAuth(false);
        setUser({});
      }
    };
    fetchUser();
  }, [setIsAuth, setUser]);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacyAndPolicy" element={<PrivacyandPolicy />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
      {/* Burbuja de chat flotante */}
      <ChatBubble />
      <ToastContainer position="top-center" />
    </div>
  );
};

export default App;
