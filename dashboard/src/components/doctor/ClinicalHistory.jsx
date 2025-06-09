import React, { useState } from 'react';
import { FaFileMedical, FaNotesMedical, FaUserInjured, FaSearch, FaPlusCircle } from 'react-icons/fa';

const ClinicalHistory = ({ darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [newNote, setNewNote] = useState({
    titulo: '',
    descripcion: '',
    diagnostico: '',
    tratamiento: '',
    medicamentos: ''
  });

  // Datos de ejemplo
  const dummyPatients = [
    { id: 1, nombre: 'María', apellido: 'García', identificacion: '12345678', edad: 45 },
    { id: 2, nombre: 'Juan', apellido: 'Pérez', identificacion: '87654321', edad: 32 },
    { id: 3, nombre: 'Ana', apellido: 'López', identificacion: '56781234', edad: 28 }
  ];

  const dummyHistoricalNotes = [
    { 
      id: 1, 
      pacienteId: 1, 
      fecha: '2025-05-20', 
      titulo: 'Consulta inicial', 
      descripcion: 'Paciente acude por dolor abdominal', 
      diagnostico: 'Gastritis aguda',
      tratamiento: 'Reposo y dieta blanda',
      medicamentos: 'Omeprazol 20mg cada 12 horas por 7 días'
    },
    { 
      id: 2, 
      pacienteId: 1, 
      fecha: '2025-05-25', 
      titulo: 'Seguimiento', 
      descripcion: 'Paciente refiere mejoría parcial del dolor abdominal', 
      diagnostico: 'Gastritis en resolución',
      tratamiento: 'Continuar con dieta blanda',
      medicamentos: 'Continuar Omeprazol 20mg cada 12 horas por 7 días más'
    },
    { 
      id: 3, 
      pacienteId: 2, 
      fecha: '2025-05-22', 
      titulo: 'Consulta por cefalea', 
      descripcion: 'Paciente con dolor de cabeza intenso de 3 días de evolución', 
      diagnostico: 'Migraña',
      tratamiento: 'Reposo en ambiente oscuro y silencioso',
      medicamentos: 'Ibuprofeno 600mg cada 8 horas si hay dolor'
    }
  ];

  const filteredPatients = dummyPatients.filter(patient => 
    `${patient.nombre} ${patient.apellido} ${patient.identificacion}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const patientHistory = selectedPatient 
    ? dummyHistoricalNotes.filter(note => note.pacienteId === selectedPatient.id)
    : [];

  const handleAddNote = () => {
    // En un sistema real, esto enviaría los datos al backend
    console.log("Nueva nota:", {
      ...newNote,
      pacienteId: selectedPatient?.id,
      fecha: new Date().toISOString().split('T')[0]
    });
    
    // Resetear el formulario
    setNewNote({
      titulo: '',
      descripcion: '',
      diagnostico: '',
      tratamiento: '',
      medicamentos: ''
    });
    setShowAddNoteForm(false);
  };

  return (
    <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-700'} mb-4 flex items-center`}>
        <FaFileMedical className="mr-2" /> Historial Clínico
      </h2>
      
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
          </div>
          <input
            type="text"
            placeholder="Buscar paciente por nombre o identificación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                  <FaUserInjured className="mr-2" />
                  <div>
                    <p className="font-medium">{patient.nombre} {patient.apellido}</p>
                    <p className="text-sm">ID: {patient.identificacion} | Edad: {patient.edad}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Historial del paciente */}
        <div className={`md:col-span-2 rounded-lg border ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        } p-4`}>
          {!selectedPatient ? (
            <div className="h-full flex items-center justify-center">
              <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Selecciona un paciente para ver su historial
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Historial de {selectedPatient.nombre} {selectedPatient.apellido}
                </h3>
                <button
                  onClick={() => setShowAddNoteForm(true)}
                  className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  <FaPlusCircle className="mr-1" /> Agregar nota
                </button>
              </div>
              
              {showAddNoteForm && (
                <div className={`mb-6 p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                }`}>
                  <h4 className={`text-md font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Nueva nota clínica
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Título
                      </label>
                      <input
                        type="text"
                        value={newNote.titulo}
                        onChange={(e) => setNewNote({...newNote, titulo: e.target.value})}
                        className={`mt-1 block w-full rounded-md border ${
                          darkMode ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'
                        }`}
                        placeholder="Ej. Consulta por dolor abdominal"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Descripción
                      </label>
                      <textarea
                        value={newNote.descripcion}
                        onChange={(e) => setNewNote({...newNote, descripcion: e.target.value})}
                        rows={2}
                        className={`mt-1 block w-full rounded-md border ${
                          darkMode ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'
                        }`}
                        placeholder="Descripción detallada"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Diagnóstico
                      </label>
                      <input
                        type="text"
                        value={newNote.diagnostico}
                        onChange={(e) => setNewNote({...newNote, diagnostico: e.target.value})}
                        className={`mt-1 block w-full rounded-md border ${
                          darkMode ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'
                        }`}
                        placeholder="Ej. Gastritis aguda"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Tratamiento
                      </label>
                      <textarea
                        value={newNote.tratamiento}
                        onChange={(e) => setNewNote({...newNote, tratamiento: e.target.value})}
                        rows={2}
                        className={`mt-1 block w-full rounded-md border ${
                          darkMode ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'
                        }`}
                        placeholder="Tratamiento recomendado"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Medicamentos
                      </label>
                      <textarea
                        value={newNote.medicamentos}
                        onChange={(e) => setNewNote({...newNote, medicamentos: e.target.value})}
                        rows={2}
                        className={`mt-1 block w-full rounded-md border ${
                          darkMode ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300'
                        }`}
                        placeholder="Medicamentos recetados"
                      ></textarea>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={handleAddNote}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setShowAddNoteForm(false)}
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
              
              {patientHistory.length === 0 ? (
                <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No hay notas clínicas para este paciente
                </p>
              ) : (
                <div className="space-y-4">
                  {patientHistory.map(note => (
                    <div 
                      key={note.id}
                      className={`p-4 rounded-lg border ${
                        darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{note.titulo}</h4>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {note.fecha}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Descripción:
                          </p>
                          <p className="text-sm">{note.descripcion}</p>
                        </div>
                        
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Diagnóstico:
                          </p>
                          <p className="text-sm">{note.diagnostico}</p>
                        </div>
                        
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Tratamiento:
                          </p>
                          <p className="text-sm">{note.tratamiento}</p>
                        </div>
                        
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Medicamentos:
                          </p>
                          <p className="text-sm">{note.medicamentos}</p>
                        </div>
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

export default ClinicalHistory;
