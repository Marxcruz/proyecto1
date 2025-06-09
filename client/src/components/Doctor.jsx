import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./Doctor.css";

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3030/api/v1/user/get-all-doctor",
          { withCredentials: true }
        );
        setDoctors(data.doctor);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch doctors."
        );
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="doctors-section py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-4xl font-bold mb-10">
          Nuestros Médicos Especialistas
        </h1>
        
        <div className="doctors-grid">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="doctor-item">
              <div className="doctor-image">
                <img 
                  src={doctor.imagenDoctor?.url || 'https://via.placeholder.com/150?text=Doctor'} 
                  alt={`Dr. ${doctor.nombre} ${doctor.apellido}`} 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Doctor' }}
                />
              </div>
              <div className="doctor-info">
                <h3 className="doctor-name">{`Dr. ${doctor.nombre} ${doctor.apellido}`}</h3>
                <p className="doctor-specialty">{doctor.departamentoMedico}</p>
                <p className="doctor-contact">{doctor.correo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

};

export default Doctor;
