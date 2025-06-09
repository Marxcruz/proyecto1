import React, { useState } from 'react';
import { FaPills, FaPlus, FaTrash, FaFilePdf, FaSearch, FaCalendarAlt } from 'react-icons/fa';

const Prescriptions = ({ darkMode }) => {
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [medications, setMedications] = useState([{ nombre: '', dosis: '', frecuencia: '', duracion: '' }]);
  
  // Datos de ejemplo
  const dummyPatients = [
    { id: 1, nombre: 'María', apellido: 'García', identificacion: '12345678', edad: 45 },
    { id: 2, nombre: 'Juan', apellido: 'Pérez', identificacion: '87654321', edad: 32 },
    { id: 3, nombre: 'Ana', apellido: 'López', identificacion: '56781234', edad: 28 }
  ];

  const dummyPrescriptions = [
    {
      id: 1,
      pacienteId: 1,
      fecha: '2025-05-25',
      diagnostico: 'Hipertensión arterial',
      medicamentos: [
        { nombre: 'Enalapril', dosis: '10mg', frecuencia: '1 vez al día', duracion: '30 días' },
        { nombre: 'Hidroclorotiazida', dosis: '25mg', frecuencia: '1 vez al día', duracion: '30 días' }
      ],
      indicaciones: 'Tomar con el estómago lleno. Control en 1 mes.'
    },
    {
      id: 2,
      pacienteId: 2,
      fecha: '2025-05-22',
      diagnostico: 'Infección respiratoria',
      medicamentos: [
        { nombre: 'Amoxicilina', dosis: '500mg', frecuencia: 'Cada 8 horas', duracion: '7 días' },
        { nombre: 'Paracetamol', dosis: '500mg', frecuencia: 'Cada 6 horas si hay fiebre', duracion: '3 días' }
      ],
      indicaciones: 'Completar todo el tratamiento antibiótico aunque mejoren los síntomas.'
    }
  ];

  const filteredPatients = dummyPatients.filter(patient => 
    `${patient.nombre} ${patient.apellido} ${patient.identificacion}`.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const patientPrescriptions = selectedPatient 
    ? dummyPrescriptions.filter(prescription => prescription.pacienteId === selectedPatient.id)
    : [];

  const addMedicationField = () => {
    setMedications([...medications, { nombre: '', dosis: '', frecuencia: '', duracion: '' }]);
  };

  const removeMedicationField = (index) => {
    if (medications.length > 1) {
      const newMedications = [...medications];
      newMedications.splice(index, 1);
      setMedications(newMedications);
    }
  };

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...medications];
    newMedications[index][field] = value;
    setMedications(newMedications);
  };

  const handleCreatePrescription = () => {
    // En un sistema real, esto enviaría la receta al backend
    console.log("Nueva receta creada:", {
      pacienteId: selectedPatient?.id,
      fecha: new Date().toISOString().split('T')[0],
      medicamentos: medications,
      indicaciones: document.getElementById('indicaciones').value,
      diagnostico: document.getElementById('diagnostico').value
    });
    
    // Resetear el formulario
    setMedications([{ nombre: '', dosis: '', frecuencia: '', duracion: '' }]);
    setShowPrescriptionForm(false);
  };

  const generatePDF = (prescriptionId) => {
    // En un sistema real, esta función generaría un PDF de la receta
    console.log(`Generando PDF para la receta ${prescriptionId}`);
    alert('Generando PDF de la receta...');
  };

  return (
    <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-700'} mb-4 flex items-center`}>
        <FaPills className="mr-2" /> Prescripciones Médicas
      </h2>
      
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
          </div>
          <input
            type="text"
            placeholder="Buscar paciente por nombre o identificación..."
            value={patientSearch}
            onChange={(e) => setPatientSearch(e.target.value)}
            className={`pl-10 w-full p-2 border rounded-lg ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            }`}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lista de pacientes */}
        <div className={`md:col-span-1 rounded-lg border ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        } p-4`}>
          <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Pacientes
          </h3>
          
          {filteredPatients.length === 0 ? (
            <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No se encontraron pacientes
            </p>
          ) : (
            <ul className="space-y-2">
              {filteredPatients.map(patient => (
                <li 
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-3 rounded-lg cursor-pointer flex items-center ${
                    selectedPatient?.id === patient.id
                      ? 'bg-blue-500 text-white'
                      : darkMode 
                        ? 'hover:bg-gray-600' 
                        : 'hover:bg-gray-200'
                  }`}
                >
                  <div>
                    <p className="font-medium">{patient.nombre} {patient.apellido}</p>
                    <p className="text-sm">ID: {patient.identificacion} | Edad: {patient.edad}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Prescripciones del paciente */}
        <div className={`md:col-span-2 rounded-lg border ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        } p-4`}>
          {!selectedPatient ? (
            <div className="h-full flex items-center justify-center">
              <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Selecciona un paciente para ver sus prescripciones
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Prescripciones de {selectedPatient.nombre} {selectedPatient.apellido}
                </h3>
                <button
                  onClick={() => setShowPrescriptionForm(true)}
                  className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  <FaPlus className="mr-1" /> Nueva prescripción
                </button>
              </div>
              
              {showPrescriptionForm && (
                <div className={`mb-6 p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                }`}>
                  <h4 className={`text-md font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Nueva Prescripción
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Fecha
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendarAlt className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                        </div>
                        <input
                          type="date"
                          defaultValue={new Date().toISOString().split('T')[0]}
                          className={`pl-10 w-full p-2 border rounded-lg ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300'
                          }`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Diagnóstico
                      </label>
                      <input
                        id="diagnostico"
                        type="text"
                        className={`mt-1 block w-full rounded-md border ${
                          darkMode ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'
                        }`}
                        placeholder="Ej. Hipertensión arterial"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Medicamentos
                      </label>
                      
                      {medications.map((med, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                          <input
                            placeholder="Nombre"
                            value={med.nombre}
                            onChange={(e) => handleMedicationChange(index, 'nombre', e.target.value)}
                            className={`col-span-3 p-2 border rounded ${
                              darkMode ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'
                            }`}
                          />
                          <input
                            placeholder="Dosis"
                            value={med.dosis}
                            onChange={(e) => handleMedicationChange(index, 'dosis', e.target.value)}
                            className={`col-span-3 p-2 border rounded ${
                              darkMode ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'
                            }`}
                          />
                          <input
                            placeholder="Frecuencia"
                            value={med.frecuencia}
                            onChange={(e) => handleMedicationChange(index, 'frecuencia', e.target.value)}
                            className={`col-span-3 p-2 border rounded ${
                              darkMode ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'
                            }`}
                          />
                          <input
                            placeholder="Duración"
                            value={med.duracion}
                            onChange={(e) => handleMedicationChange(index, 'duracion', e.target.value)}
                            className={`col-span-2 p-2 border rounded ${
                              darkMode ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => removeMedicationField(index)}
                            className="col-span-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={addMedicationField}
                        className={`mt-2 px-3 py-1 rounded ${
                          darkMode 
                            ? 'bg-gray-500 text-white hover:bg-gray-400' 
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        <FaPlus className="inline mr-1" /> Agregar medicamento
                      </button>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Indicaciones adicionales
                      </label>
                      <textarea
                        id="indicaciones"
                        rows={3}
                        className={`mt-1 block w-full rounded-md border ${
                          darkMode ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'
                        }`}
                        placeholder="Indicaciones para el paciente"
                      ></textarea>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={handleCreatePrescription}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Guardar Prescripción
                      </button>
                      <button
                        onClick={() => setShowPrescriptionForm(false)}
                        className={`px-4 py-2 rounded ${
                          darkMode 
                            ? 'bg-gray-500 text-white hover:bg-gray-400' 
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {patientPrescriptions.length === 0 ? (
                <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No hay prescripciones para este paciente
                </p>
              ) : (
                <div className="space-y-4">
                  {patientPrescriptions.map(prescription => (
                    <div 
                      key={prescription.id}
                      className={`p-4 rounded-lg border ${
                        darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{prescription.diagnostico}</h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Fecha: {prescription.fecha}
                          </p>
                        </div>
                        <button
                          onClick={() => generatePDF(prescription.id)}
                          className="flex items-center text-blue-500 hover:text-blue-600"
                        >
                          <FaFilePdf className="mr-1" /> PDF
                        </button>
                      </div>
                      
                      <div className="mb-3">
                        <h5 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Medicamentos:
                        </h5>
                        <ul className={`list-disc pl-5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {prescription.medicamentos.map((med, idx) => (
                            <li key={idx}>
                              <strong>{med.nombre}</strong> {med.dosis}, {med.frecuencia}, durante {med.duracion}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Indicaciones:
                        </h5>
                        <p className="text-sm">{prescription.indicaciones}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;
