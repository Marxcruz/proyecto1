import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaPills, FaPlus, FaTrash, FaFilePdf, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Prescriptions = ({ darkMode }) => {
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [medications, setMedications] = useState([{ nombre: '', dosis: '', frecuencia: '', duracion: '' }]);
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    // obtener pacientes del doctor
    axios.get("http://localhost:3030/api/v1/appointments/doctor-patients", { withCredentials: true })
      .then(res => setPatients(res.data.patients || []))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedPatient) return;
    axios.get(`http://localhost:3030/api/v1/prescriptions/patient/${selectedPatient._id}`, { withCredentials: true })
      .then(res => {
        const processed = (res.data.prescriptions || []).map(p => ({
          ...p,
          medicamentos: typeof p.medicamentos === 'string' ? JSON.parse(p.medicamentos) : p.medicamentos,
        }));
        setPrescriptions(processed);
      })
      .catch(err => console.error(err));
  }, [selectedPatient]);

  const filteredPatients = patients.filter(patient => `${patient.nombre} ${patient.apellido} ${patient.identificacion}`.toLowerCase().includes(patientSearch.toLowerCase()));

  const patientPrescriptions = prescriptions;

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('es-PE');
    } catch {
      return iso;
    }
  };

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

  const handleCreatePrescription = async () => {
    if (!selectedPatient) return;
    const titulo = document.getElementById('diagnostico').value;
    const indicaciones = document.getElementById('indicaciones').value;
    try {
      await axios.post(
        "http://localhost:3030/api/v1/prescriptions/create",
        {
          titulo,
          medicamentos: JSON.stringify(medications),
          indicaciones,
          pacienteId: selectedPatient._id,
        },
        { withCredentials: true }
      );
      toast.success('Prescripción guardada');
      const res = await axios.get(`http://localhost:3030/api/v1/prescriptions/patient/${selectedPatient._id}`, { withCredentials: true });
      const processed = (res.data.prescriptions || []).map(p => ({
        ...p,
        medicamentos: typeof p.medicamentos === 'string' ? JSON.parse(p.medicamentos) : p.medicamentos,
      }));
      setPrescriptions(processed);
      setShowPrescriptionForm(false);
      setMedications([{ nombre: '', dosis: '', frecuencia: '', duracion: '' }]);
    } catch (err) {
      toast.error('Error al guardar');
      console.error(err);
    }
  };

  const generatePDF = (prescriptionId) => {
    const prescription = prescriptions.find(p => p._id === prescriptionId);
    if (!prescription) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Receta Médica', 105, 15, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Paciente: ${selectedPatient?.nombre} ${selectedPatient?.apellido}`, 14, 30);
    doc.text(`Identificación: ${selectedPatient?.identificacion || ''}`, 14, 38);
    doc.text(`Fecha: ${formatDate(prescription.fecha)}`, 14, 46);

    doc.setFontSize(13);
    doc.text('Medicamentos:', 14, 58);

    const medRows = (prescription.medicamentos || []).map(m => [m.nombre, m.dosis, m.frecuencia, m.duracion]);
    autoTable(doc, {
      head: [['Nombre', 'Dosis', 'Frecuencia', 'Duración']],
      body: medRows,
      startY: 62,
      styles: { fontSize: 11 },
    });

    let y = (doc.lastAutoTable?.finalY) || 62;
    doc.text('Indicaciones:', 14, y + 10);
    doc.text(prescription.indicaciones || '', 14, y + 18);

    const fileName = `prescripcion_${selectedPatient?.nombre || ''}_${formatDate(prescription.fecha)}.pdf`;
    doc.save(fileName);
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
                  key={patient._id || patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-3 rounded-lg cursor-pointer flex items-center ${
                    (selectedPatient?._id || selectedPatient?.id) === (patient._id || patient.id)
                      ? 'bg-blue-500 text-white'
                      : darkMode 
                        ? 'hover:bg-gray-600' 
                        : 'hover:bg-gray-200'
                  }`}
                >
                  <div>
                    <p className="font-medium">{patient.nombre} {patient.apellido}</p>
                    <p className="text-sm">ID: {patient.identificacion}</p>
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
                  {patientPrescriptions.map((prescription, idx) => (
                    <div 
                      key={prescription._id || prescription.id || idx}
                      className={`p-4 rounded-lg border ${
                        darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{prescription.diagnostico}</h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Fecha: {formatDate(prescription.fecha)}
                          </p>
                        </div>
                        <button
                          onClick={() => generatePDF(prescription._id || prescription.id)}
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
                          {Array.isArray(prescription.medicamentos) && prescription.medicamentos.map((med, idx) => (
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
