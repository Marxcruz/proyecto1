import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

const AddNewDoctor = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [docImage, setDocImage] = useState(null);
  const [docAvatarPreview, setDocAvatarPreview] = useState("");

  const navigateTo = useNavigate();

  const departmentsArray = [
    "Pediatría",
    "Ortopedia",
    "Cardiología",
    "Neurología",
    "Oncología",
    "Radiología",
    "Fisioterapia",
    "Dermatología",
    "Otorrinolaringología",
  ];

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocAvatarPreview(reader.result);
        setDocImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewDoctor = async (e) => {
    e.preventDefault();
    if (!docImage) {
      toast.error("¡Se requiere imagen del doctor!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("nic", nic);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("doctorDepartment", doctorDepartment);
      formData.append("docImage", docImage);

      const { data } = await axios.post(
        "http://localhost:3030/api/v1/user/create-new-doctor",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(data.message);
      navigateTo("/");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNic("");
      setDob("");
      setGender("");
      setPassword("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error en el registro del doctor"
      );
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
  return (
    <section className="flex justify-center items-center py-10 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden mx-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
          <h1 className="text-3xl font-bold mb-2">REGISTRAR UN NUEVO DOCTOR</h1>
          <p className="text-blue-100">Complete el formulario para agregar un nuevo doctor al sistema</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleAddNewDoctor} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-1 md:col-start-2 flex justify-center">
                <div className="w-40 h-40 bg-gray-100 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg relative group">
                  <img
                    src={docAvatarPreview || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2QhjRJKfxNsyqz7vTVU5hmOJfiAjeeEfrlg&s"}
                    alt="Doctor Preview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">Cambiar Foto</span>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-1 md:row-start-2 md:col-start-2 flex justify-center">
                <div className="relative w-40">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatar}
                    className="hidden"
                    id="doctor-image-upload"
                  />
                  <label 
                    htmlFor="doctor-image-upload"
                    className="cursor-pointer inline-block w-full text-center bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-lg border border-dashed border-blue-300 transition-colors duration-300"
                  >
                    Seleccionar Imagen
                  </label>
                  {docAvatarPreview && (
                    <span className="text-xs text-gray-500 block text-center mt-1">Imagen seleccionada</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Apellido</label>
                <input
                  type="text"
                  placeholder="Apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Número de Teléfono</label>
                <input
                  type="tel"
                  placeholder="Número de teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Identificación</label>
                <input
                  type="text"
                  placeholder="Identificación"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Género</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                  required
                >
                  <option value="">Seleccionar Género</option>
                  <option value="Male">Masculino</option>
                  <option value="Female">Femenino</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Especialidad</label>
                <select
                  value={doctorDepartment}
                  onChange={(e) => setDoctorDepartment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                  required
                >
                  <option value="">Seleccionar Especialidad</option>
                  {departmentsArray.map((depart, index) => (
                    <option value={depart} key={index}>
                      {depart}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Registrar Doctor
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddNewDoctor;
