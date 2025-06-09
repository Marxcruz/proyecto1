import React, { useState } from 'react';
import { FaPills, FaDownload, FaCalendarAlt, FaUserMd, FaInfoCircle, FaCheck, FaClock } from 'react-icons/fa';

const PatientPrescriptions = ({ prescriptions = [], darkMode }) => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Datos de muestra para prescripciones si no hay datos reales
  const samplePrescriptions = [
    {
      id: 1,
      fecha: '2025-04-15',
      doctor: 'Dr. Juan Pérez',
      especialidad: 'Medicina General',
      diagnostico: 'Hipertensión arterial leve',
      fechaFin: '2025-05-15',
      medicamentos: [
        {
          nombre: 'Losartán',
          dosis: '50mg',
          frecuencia: 'Cada 24 horas',
          duracion: '30 días',
          instrucciones: 'Tomar 1 comprimido por la mañana con agua'
        }
      ],
      estado: 'Activa'
    },
    {
      id: 2,
      fecha: '2025-03-10',
      doctor: 'Dra. Laura Gómez',
      especialidad: 'Cardiología',
      diagnostico: 'Evaluación de riesgo cardiovascular',
      fechaFin: '2025-06-10',
      medicamentos: [
        {
          nombre: 'Aspirina',
          dosis: '100mg',
          frecuencia: 'Una vez al día',
          duracion: '90 días',
          instrucciones: 'Tomar 1 comprimido después del desayuno'
        }
      ],
      estado: 'Activa'
    },
    {
      id: 3,
      fecha: '2025-02-05',
      doctor: 'Dr. Roberto Sánchez',
      especialidad: 'Medicina General',
      diagnostico: 'Infección respiratoria aguda',
      fechaFin: '2025-02-12',
      medicamentos: [
        {
          nombre: 'Paracetamol',
          dosis: '500mg',
          frecuencia: 'Cada 8 horas',
          duracion: '5 días',
          instrucciones: 'Tomar 1 comprimido cada 8 horas'
        },
        {
          nombre: 'Amoxicilina',
          dosis: '500mg',
          frecuencia: 'Cada 8 horas',
          duracion: '7 días',
          instrucciones: 'Tomar 1 cápsula cada 8 horas con las comidas'
        }
      ],
      estado: 'Completada'
    }
  ];
  
  // Usar prescripciones de muestra si no hay datos reales
  const displayedPrescriptions = prescriptions.length > 0 ? prescriptions : samplePrescriptions;
  
  // Filtrar prescripciones activas e inactivas
  const activePrescriptions = displayedPrescriptions.filter(
    p => p.estado === 'Activa' || new Date(p.fechaFin) >= new Date()
  );
  
  const pastPrescriptions = displayedPrescriptions.filter(
    p => p.estado === 'Completada' || new Date(p.fechaFin) < new Date()
  );
  
  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  // Mostrar detalle de una prescripción
  const showPrescriptionDetail = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailModal(true);
  };
  
  // Renderizar tarjeta de medicamento
  const renderMedicineCard = (medicine, index) => (
    <div 
      key={index}
      className={`p-4 rounded-lg mb-3 ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}
    >
      <div className="flex items-start">
        <FaPills className={`mt-1 ${darkMode ? 'text-green-400' : 'text-green-600'} mr-3`} />
        <div>
          <h4 className="font-semibold">{medicine.nombre} {medicine.dosis}</h4>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <p>Frecuencia: {medicine.frecuencia}</p>
            <p>Duración: {medicine.duracion}</p>
            <p className="mt-1">{medicine.instrucciones}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="p-5">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaPills className="mr-2 text-green-500" />
          Mis Medicamentos
        </h2>
        
        {/* Medicamentos Activos */}
        <div className="mb-8">
          <h3 className={`text-lg font-semibold mb-3 pb-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <FaCheck className={`inline mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            Medicamentos Actuales
          </h3>
          
          {activePrescriptions.length === 0 ? (
            <div className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <FaPills className="mx-auto h-10 w-10 mb-2 opacity-50" />
              <p>No tienes medicamentos activos actualmente</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePrescriptions.map((prescription, index) => (
                <div 
                  key={index}
                  className={`rounded-lg shadow-sm overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}
                >
                  <div className={`px-4 py-3 ${darkMode ? 'bg-gray-600' : 'bg-green-50'}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{prescription.diagnostico}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        darkMode ? 'bg-green-700 text-green-100' : 'bg-green-100 text-green-800'
                      }`}>
                        Activo
                      </span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Recetado: {formatDate(prescription.fecha)} | Hasta: {formatDate(prescription.fechaFin)}
                    </p>
                  </div>
                  
                  <div className="p-4">
                    <div className={`mb-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <p className="flex items-center">
                        <FaUserMd className="mr-2" /> {prescription.doctor} - {prescription.especialidad}
                      </p>
                    </div>
                    
                    {prescription.medicamentos.map((med, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 mb-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                      >
                        <p className="font-medium">{med.nombre} {med.dosis}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{med.instrucciones}</p>
                      </div>
                    ))}
                    
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => showPrescriptionDetail(prescription)}
                        className={`px-3 py-1 rounded-md text-sm flex items-center ${
                          darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <FaInfoCircle className="mr-1" /> Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Medicamentos Anteriores */}
        <div>
          <h3 className={`text-lg font-semibold mb-3 pb-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <FaClock className={`inline mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            Medicamentos Anteriores
          </h3>
          
          {pastPrescriptions.length === 0 ? (
            <div className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <FaPills className="mx-auto h-10 w-10 mb-2 opacity-50" />
              <p>No hay registro de medicamentos anteriores</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastPrescriptions.map((prescription, index) => (
                <div 
                  key={index}
                  className={`rounded-lg shadow-sm overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}
                >
                  <div className={`px-4 py-3 ${darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{prescription.diagnostico}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        darkMode ? 'bg-gray-500 text-gray-100' : 'bg-gray-200 text-gray-800'
                      }`}>
                        Completado
                      </span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {formatDate(prescription.fecha)} - {formatDate(prescription.fechaFin)}
                    </p>
                  </div>
                  
                  <div className="p-4">
                    <div className={`mb-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <p className="flex items-center">
                        <FaUserMd className="mr-2" /> {prescription.doctor} - {prescription.especialidad}
                      </p>
                    </div>
                    
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => showPrescriptionDetail(prescription)}
                        className={`px-3 py-1 rounded-md text-sm flex items-center ${
                          darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <FaInfoCircle className="mr-1" /> Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de detalles */}
      {showDetailModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-lg p-6 max-w-2xl w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Detalles de la Prescripción</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
              <h4 className="text-lg font-semibold">{selectedPrescription.diagnostico}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div className="flex items-center">
                  <FaCalendarAlt className={`${darkMode ? 'text-green-400' : 'text-green-600'} mr-2`} />
                  <div>
                    <p className="text-xs font-medium">Fecha de prescripción</p>
                    <p>{formatDate(selectedPrescription.fecha)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className={`${darkMode ? 'text-green-400' : 'text-green-600'} mr-2`} />
                  <div>
                    <p className="text-xs font-medium">Fecha de finalización</p>
                    <p>{formatDate(selectedPrescription.fechaFin)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaUserMd className={`${darkMode ? 'text-green-400' : 'text-green-600'} mr-2`} />
                  <div>
                    <p className="text-xs font-medium">Doctor</p>
                    <p>{selectedPrescription.doctor}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaUserMd className={`${darkMode ? 'text-green-400' : 'text-green-600'} mr-2`} />
                  <div>
                    <p className="text-xs font-medium">Especialidad</p>
                    <p>{selectedPrescription.especialidad}</p>
                  </div>
                </div>
                <div className="flex items-center col-span-2">
                  <div className={`px-2 py-1 rounded-full text-sm ${
                    selectedPrescription.estado === 'Activa' || new Date(selectedPrescription.fechaFin) >= new Date()
                      ? (darkMode ? 'bg-green-700 text-green-100' : 'bg-green-100 text-green-800')
                      : (darkMode ? 'bg-gray-600 text-gray-100' : 'bg-gray-200 text-gray-800')
                  }`}>
                    {selectedPrescription.estado === 'Activa' || new Date(selectedPrescription.fechaFin) >= new Date()
                      ? 'Activa'
                      : 'Completada'
                    }
                  </div>
                </div>
              </div>
            </div>
            
            <h4 className="font-semibold mb-3">Medicamentos:</h4>
            <div className="space-y-4">
              {selectedPrescription.medicamentos.map((medicine, index) => (
                renderMedicineCard(medicine, index)
              ))}
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                className={`px-4 py-2 rounded-md flex items-center ${
                  darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                <FaDownload className="mr-2" /> Descargar Receta
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className={`px-4 py-2 rounded-md ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
