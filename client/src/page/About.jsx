import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div>
      <div className="max-w-[1540px] mx-auto px-2 py-12 justify-center items-center">
        <div className="flex justify-center items-center min-h-screen rounded-md">
          <div className="w-[15400px] grid grid-cols-1 shadow-xl py-4 md:grid-cols-2">
            <div className="py-12">
              <h1 className="text-blue-500 text-[35px] text-center cursor-pointer font-bold py-2">
                Sobre Nosotros
              </h1>
              <p className="text-black text-[25px] text-center cursor-pointer font-bold py-2">
                Sistema de Historial Clínico Digital
              </p>
              <p className="text-center text-light py-8 px-2 cursor-pointer font-light">
                Nuestro sistema de historial clínico digital ofrece una solución integral para
                la gestión de información médica de pacientes. Desarrollado con tecnología
                de vanguardia, permite a los profesionales de la salud acceder, actualizar y
                compartir información clínica de manera segura y eficiente.
                
                La plataforma centraliza todos los datos médicos relevantes, incluyendo
                diagnósticos, tratamientos, medicamentos recetados y resultados de exámenes,
                facilitando una atención médica coordinada y personalizada. Nuestro sistema
                garantiza la confidencialidad de la información mediante protocolos de seguridad
                avanzados, cumpliendo con todas las normativas de protección de datos médicos.
                
                Con una interfaz intuitiva y accesible, tanto médicos como pacientes pueden
                navegar fácilmente por el historial clínico, mejorando la comunicación y
                la toma de decisiones en el cuidado de la salud.
              </p>
              <div className="text-center">
                <button className="font-light bg-[blue] px-12 cursor-pointer py-2 rounded-xl text-black hover:text-red-500 hover:bg-[#646664]">
                  Leer Más
                </button>
              </div>
            </div>
            <div className="w-[700px] h-[300px]">
              <img
                className="w-full h-full object-cover rounded-lg cursor-pointer"
                src="https://st.depositphotos.com/2325841/2529/i/450/depositphotos_25293855-stock-photo-multi-ethnic-group-thumbs-up.jpg"
                alt=""
              />
            </div>
            <h1 className="text-center py-1 cursor-pointer text-[20px] font-bold text-[#222] underline underline-offset-8">
              Nuestras Estadísticas
            </h1>
            <div className="grid grid-cols-2 justify-around items-center py-4 px-3 gap-4">
              <div className="shadow-2xl bg-blue-400 rounded-xl w-[340px] h-[120px] items-center justify-center">
                <h1 className="text-center cursor-pointer justify-center text-[black] font-bold text-[20px] mt-[40px]">
                  300000
                </h1>
                <p className="text-center cursor-pointer  justify-center text-[black] items-center font-light">
                  Pacientes
                </p>
              </div>
              <div className="shadow-2xl bg-blue-400 rounded-xl w-[340px] h-[120px] items-center justify-center">
                <h1 className="text-center cursor-pointer justify-center text-[black] font-bold text-[20px] mt-[40px]">
                  20000+
                </h1>
                <p className="text-center cursor-pointer  justify-center text-[black] items-center font-light">
                  Médicos
                </p>
              </div>
              <div className="shadow-2xl bg-blue-400 rounded-xl w-[340px] h-[120px] items-center justify-center">
                <h1 className="text-center cursor-pointer justify-center text-[black] font-bold text-[20px] mt-[40px]">
                  100+
                </h1>
                <p className="text-center cursor-pointer  justify-center text-[black] items-center font-light">
                  Consultorios
                </p>
              </div>
              <div className="shadow-2xl bg-blue-400 rounded-xl w-[340px] h-[120px] items-center justify-center">
                <h1 className="text-center cursor-pointer justify-center text-[black] font-bold text-[20px] mt-[40px]">
                  24/7
                </h1>
                <p className="text-center cursor-pointer  justify-center text-[black] items-center font-light">
                  Servicio Rápido
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-md">
        <button className=" text-center py-4 text-blue-600 underline underline-offset-8">
          <Link to="/">Página Principal</Link>
        </button>
      </div>
    </div>
  );
};

export default About;
