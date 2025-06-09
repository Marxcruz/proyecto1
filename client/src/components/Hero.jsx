import React from "react";

const Hero = () => {
  return (
    <div className="max-w-[1540px] mx-auto pt-24 flex flex-col items-center">
      <div className="w-[1500px] h-[600px] mx-auto py-4">
        <div className="relative w-full h-full group">
          <div
            className="absolute w-full h-full bg-blue-300/80 rounded-xl
   text-black flex flex-col justify-center items-center opacity-0 
   group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
          >
            <p className="font-bold text-4xl px-4 text-center">
              Sistema de Historial Clínico Digital
            </p>
            <p className="px-4 text-center py-4 text-xl">
              Acceda a toda su información médica en un solo lugar. Nuestro sistema permite
              a los profesionales de la salud registrar, consultar y dar seguimiento a su historial
              clínico completo, incluyendo diagnósticos, tratamientos, medicamentos y resultados
              de exámenes. Garantizamos la seguridad y confidencialidad de sus datos médicos
              mientras facilitamos una atención médica más eficiente y personalizada.
            </p>
            <div className="text-center">
              <button
                className="mt-4 border-white bg-white text-black px-4 py-2
              rounded-md hover:border-2 hover:border-pink-500"
              >
                Acceder a mi Historial Clínico
              </button>
            </div>
          </div>
          <img
            className="w-full h-full object-cover reunded-xl bg-red-600/50 group-hover:bg-transparent transition-all duration-500 ease-in-out"
            src="https://images.unsplash.com/photo-1584516150909-c43483ee7932?q=80&w=1424&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
