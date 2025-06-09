import React from "react";

const Biography = () => {
  return (
    <div
      className="container py-12 px-4 mx-auto bg-blue-200 flex
   flex-col md:flex-row gap-8"
    >
      <div className="flex-1 flex items-center justify-center">
        <img
          src="https://s3.envato.com/files/354413107/2072.jpg"
          alt="historial clínico"
          className="w-full h-auto object-cover rounded-md hover:scale-105"
        />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <p className="text-2xl font-bold text-gray-800 text-center ">
          Nuestra Historia
        </p>
        <h3 className="text-lg font-bold text-gray-800">Quiénes Somos</h3>
        <p className="text-lg text-gray-700">
          Somos un equipo multidisciplinario de profesionales de la salud comprometidos
          con la innovación tecnológica en el sector médico. Nuestro Sistema de Historial
          Clínico Digital nació de la necesidad de centralizar y digitalizar la información
          médica de los pacientes, facilitando el acceso y la gestión de datos clínicos
          para mejorar la calidad de atención y seguimiento médico.
        </p>
        <p className="text-lg text-gray-700">Fundado en 2024, nuestro sistema está en constante evolución.</p>
        <p className="text-lg text-gray-700">
          Nos especializamos en el desarrollo de Sistemas de Historial Clínico Digital
        </p>
        <p className="text-lg text-gray-700">
          Nuestra plataforma permite a los médicos acceder a historiales completos,
          registrar diagnósticos, tratamientos y resultados de exámenes, todo en un
          entorno digital seguro. Para los pacientes, ofrecemos acceso transparente a
          su información médica, facilitando la comunicación con sus especialistas
          y mejorando la comprensión de su estado de salud y tratamientos.
        </p>
        <p className="text-lg text-gray-700">
          Nuestro Sistema de Historial Clínico Digital ya cuenta con módulos completos
          para la gestión de pacientes, consultas y expedientes médicos.
        </p>
        <p className="text-lg text-gray-700">
          Próximamente implementaremos nuevas funcionalidades como telemedicina,
          integración con dispositivos médicos y análisis predictivo basado en IA.
        </p>
      </div>
    </div>
  );
};

export default Biography;
