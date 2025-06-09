import React from "react";

const PrivacyandPolicy = () => {
  return (
    <div className="max-w-[1540px] mx-auto justify-center items-center">
      <div className="flex justify-center items-center py-20">
        <div className="w-[1540px] bg-slate-200 justify-center items-center shadow-lg rounded-xl py-4">
          <h1 className="text-center text-[35px] text-[#b6ad05] underline underline-offset-8 py-8 font-bold">
            Política de Privacidad del Sistema de Historial Clínico Digital
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="w-[600px] h-[500px]">
              <img
                src="https://plus.unsplash.com/premium_photo-1676618539987-12b7c8a8ae61?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                className="w-[100%] object-cover cursor-pointer py-4 px-6 rounded-lg"
              />
            </div>
            <div className="cursor-pointer w-[700px]">
              <h1 className="text-center text-[25px] w-full py-4 underline underline-offset-8 font-bold">
                Privacidad Garantizada
              </h1>
              <p className="text-light py-2 px-3 w-full">
                En el Sistema de Historial Clínico Digital, nos comprometemos a proteger
                la privacidad y confidencialidad de su información médica personal. Esta
                política de privacidad describe cómo recopilamos, utilizamos y protegemos
                sus datos personales y médicos en cumplimiento con las leyes y regulaciones
                aplicables de protección de datos.
                
                Entendemos la naturaleza sensible de la información médica y tomamos todas
                las medidas necesarias para garantizar que sus datos estén seguros. Solo el
                personal autorizado tiene acceso a su historial clínico, y todos los accesos
                son registrados y monitoreados para prevenir usos indebidos.
                
                Sus datos personales y médicos solo serán utilizados para los fines específicos
                de atención médica, seguimiento de tratamientos, y mejora de nuestros servicios.
                No compartimos su información con terceros sin su consentimiento explícito,
                excepto cuando sea requerido por ley o por razones médicas de emergencia.
                
                Implementamos medidas de seguridad técnicas y organizativas avanzadas para
                proteger sus datos contra accesos no autorizados, pérdidas o alteraciones.
                Todos nuestros sistemas están encriptados y regularmente actualizados para
                mantener los más altos estándares de seguridad informática.
              </p>
              <div className="mt-4 w-full">
                <ul className="flex flex-col gap-5 cursor-pointer">
                  <li className="text-xl cursor-pointer list-inside list-decimal">
                    Recopilación y uso de datos personales
                  </li>
                  <li className="text-xl cursor-pointer list-inside list-decimal">
                    Protección de información médica confidencial
                  </li>
                  <li className="text-xl cursor-pointer list-inside list-decimal">
                    Derechos de acceso y rectificación de datos
                  </li>
                  <li className="text-xl cursor-pointer list-inside list-decimal">
                    Medidas de seguridad implementadas
                  </li>
                  <li className="text-xl cursor-pointer list-inside list-decimal">
                    Compartición de datos con profesionales de la salud
                  </li>
                  <li className="text-xl cursor-pointer list-inside list-decimal">
                    Conservación y eliminación de historiales clínicos
                  </li>
                </ul>
              </div>
              <div className="text-center py-6">
                <button className="px-5 py-2 bg-[blue] rounded-xl text-black cursor-pointer hover:bg-[#484948] hover:text-white">
                  Más Información
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyandPolicy;
