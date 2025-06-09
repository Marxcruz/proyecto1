import React from "react";
import { FaLocationArrow, FaPhone, FaSquareInstagram } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaFacebookSquare } from "react-icons/fa";
import { FaYoutube, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const hours = [
    { id: 1, day: "Lunes", time: "9:00 AM a 11:00 PM" },
    { id: 2, day: "Martes", time: "9:00 AM a 11:00 PM" },
    { id: 3, day: "Miércoles", time: "9:00 AM a 11:00 PM" },
    { id: 4, day: "Jueves", time: "9:00 AM a 11:00 PM" },
    { id: 5, day: "Viernes", time: "9:00 AM a 11:00 PM" },
    { id: 6, day: "Sábado", time: "9:00 AM a 11:00 PM" },
  ];
  return (
    <div className="bg-blue-100 text-black shadow-xl">
      <footer className="max-w-[1540px] mx-auto py-8 px-4">
        <div className="flex flex-wrap gap-6">
          <div className="flex-1">
            <h1 className="text-xl font-bold cursor-pointer text-black">
              Sistema de Historial Clínico Digital
            </h1>
            <p className="text-gray-500 text-lg">
              Nuestro sistema de historial clínico digital centraliza toda la información
              médica de los pacientes, permitiendo un acceso seguro y eficiente a diagnósticos,
              tratamientos, medicamentos y resultados de laboratorio, mejorando así la calidad
              de la atención médica y la continuidad del cuidado.
            </p>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold cursor-pointer mb-4">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to={"/"} className="text-gray-700 hover:text-black">
                  Inicio
                </Link>
              </li>
              <li>
                {" "}
                <Link to={"/about"} className="text-gray-700 hover:text-black">
                  Acerca de
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  to={"/services"}
                  className="text-gray-700 hover:text-black"
                >
                  Servicios
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  to={"/contact"}
                  className="text-gray-700 hover:text-black"
                >
                  Contacto
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  to={"/privacyAndPolicy"}
                  className="text-gray-700 hover:text-black"
                >
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold cursor-pointer mb-4">Horarios</h4>
            <ul className="space-y-2">
              {hours.map((element) => (
                <li
                  key={element.id}
                  className="flex justify-between text-gray-700"
                >
                  <span>{element.day}</span>
                  <span>{element.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold cursor-pointer mb-4">Contacto</h4>
            <div className="flex items-center gap-2 mb-2">
              <FaPhone className="text-gray-700" />
              <span className="text-gray-700">963963963963</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <MdEmail className="text-gray-700" />
              <span className="text-gray-700">contacto@historialclinico.com</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <FaLocationArrow className="text-gray-700" />
              <span className="text-gray-700">Ciudad de Arequipa</span>
            </div>
          </div>
          <div className="flex justify-between gap-4 cursor-pointer items-center">
            <FaFacebookSquare />
            <FaYoutube />
            <FaSquareInstagram />
            <FaGithub />
          </div>
        </div>
      </footer>
      <p className="text-center cursor-pointer text-md py-4">
        &copy;2025 Sistema de Historial Clínico Digital
      </p>
    </div>
  );
};

export default Footer;
