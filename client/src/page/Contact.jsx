import React from "react";
import { IoLocation } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { TbWorldWww } from "react-icons/tb";

const Contact = () => {
  return (
    <div>
      <div className="max-w-[1540px] mx-auto px-4 py-10 justify-center items-center">
        <div className="flex justify-center items-center min-h-screen rounded-md">
          <div className="w-[1500px] border rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2">
            <div className="items-center py-4 justify-center">
              <h1 className="text-[green] font-bold py-4 text-[35px] text-center underline underline-offset-8 cursor-pointer">
                Ponte en Contacto
              </h1>
              <div
                className="text-center py-2
              "
              >
                <IoLocation size={30} className="ml-[42%]" />
                <div className="flex gap-4 justify-center items-center text-center">
                  <h1 className="text-center text-[22px] font-bold">
                    Dirección :
                  </h1>
                  <span className="text-center text-light">Arequipa</span>
                </div>
              </div>
              <div className="text-center py-2">
                <FaPhoneAlt size={30} className="ml-[42%] " />
                <div className="flex gap-4 justify-center items-center text-center">
                  <h1 className="text-center text-[22px] font-bold">Teléfono :</h1>
                  <span className="text-center text-light">965314753</span>
                </div>
              </div>
              <div className="text-center py-2">
                <MdEmail size={30} className="ml-[42%] " />
                <div className="flex gap-4 justify-center items-center text-center">
                  <h1 className="text-center text-[22px] font-bold">Correo :</h1>
                  <span className="text-center text-light">
                    projectwithSGK@gmail.com
                  </span>
                </div>
              </div>
              <div className="text-center py-2">
                <TbWorldWww size={30} className="ml-[42%] " />
                <div className="flex gap-4 justify-center items-center text-center">
                  <h1 className="text-center text-[22px] font-bold">Sitio Web</h1>
                  <span className="text-center text-light">
                    www.historialclinico.con.sgk
                  </span>
                </div>
              </div>
            </div>
            <div className="cursor-pointer py-8">
              <h1 className="text-[35px]  font-bold underline underline-offset-8 text-center cursor-pointer">
                Contáctanos
              </h1>
              <form action="">
                <label
                  htmlFor=""
                  className="text-[22px] mt-1 font-bold py-2 cursor-pointer"
                >
                  {" "}
                  Nombre
                </label>
                <br />
                <input
                  type="text"
                  placeholder="Ingresa tu nombre"
                  className="w-full md:w-1/2 p-3 text-lg border-gray-300 bg-slate-300 rounded-md outline-none shadow-md"
                />
                <br />
                <label className="text-[22px] mt-1 font-bold py-2 cursor-pointer">
                  {" "}
                  Apellido
                </label>
                <br />
                <input
                  type="text"
                  placeholder="Ingresa tu apellido"
                  className="w-full md:w-1/2 p-3 text-lg border-gray-300 bg-slate-300 rounded-md outline-none shadow-md"
                />
                <br />
                <label className="text-[22px] mt-1 font-bold py-2 cursor-pointer">
                  {" "}
                  Correo
                </label>
                <br />
                <input
                  type="email"
                  placeholder="Ingresa tu correo"
                  className="w-full md:w-1/2 p-3 text-lg border-gray-300 bg-slate-300 rounded-md outline-none shadow-md"
                />
                <br />

                <label className="text-[22px] mt-1 font-bold py-2 cursor-pointer">
                  {" "}
                  Asunto{" "}
                </label>
                <br />
                <input
                  type="text"
                  placeholder="Ingresa el asunto"
                  className="w-full md:w-1/2 p-3 text-lg border-gray-300 bg-slate-300 rounded-md outline-none shadow-md"
                />
                <br />
                <label className="text-[22px] mt-1 font-bold py-2 cursor-pointer">
                  {" "}
                  Escribe tu Mensaje{" "}
                </label>
                <br />
                <input
                  type="text"
                  placeholder="Escribe tu mensaje"
                  className="w-full md:w-1/2 h-[100px] p-3 text-lg border-gray-300 bg-slate-300 rounded-md outline-none shadow-md"
                />
                <br />
                <button
                  className="bg-[green] text-white px-12 py-2 text-center rounded-xl mt-4 cursor-pointer hover:bg-[#686968] hover:text-white
                "
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
