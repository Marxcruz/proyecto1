import React, { useState } from 'react';
import { FaFileMedical, FaHeartbeat, FaWeight, FaRuler, FaLungs, FaHistory, FaSearch, FaAngleDown, FaAngleUp } from 'react-icons/fa';

const MedicalHistory = ({ darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRecords, setExpandedRecords] = useState({});
  const [activeTab, setActiveTab] = useState('historial');
  
  // Datos de muestra para el historial médico
  const sampleMedicalHistory = [
    {
      id: 1,
      fecha: '2025-04-15',
      doctor: 'Dr. Juan Pérez',
      especialidad: 'Medicina General',
      diagnostico: 'Hipertensión arterial leve',
      notas: 'Paciente presenta presión arterial de 140/90 mmHg. Se recomienda dieta baja en sodio y seguimiento mensual.',
      recetas: ['Losartán 50mg - 1 comprimido cada 24 horas durante 30 días'],
      signos: {
        presion: '140/90 mmHg',
        peso: '78 kg',
        temperatura: '36.5°C',
        frecuenciaCardiaca: '72 lpm',
        saturacion: '98%'
      }
    },
    {
      id: 2,
      fecha: '2025-03-10',
      doctor: 'Dra. Laura Gómez',
      especialidad: 'Cardiología',
      diagnostico: 'Evaluación de riesgo cardiovascular',
      notas: 'Paciente con factores de riesgo cardiovascular. ECG normal. Se recomienda actividad física moderada.',
      recetas: ['Aspirina 100mg - 1 comprimido diario'],
      signos: {
        presion: '135/85 mmHg',
        peso: '79 kg',
        temperatura: '36.7°C',
        frecuenciaCardiaca: '68 lpm',
        saturacion: '99%'
      }
    },
    {
      id: 3,
      fecha: '2025-02-05',
      doctor: 'Dr. Roberto Sánchez',
      especialidad: 'Medicina General',
      diagnostico: 'Infección respiratoria aguda',
      notas: 'Paciente con tos, rinorrea y dolor de garganta de 3 días de evolución. Se prescribe tratamiento sintomático.',
      recetas: [
        'Paracetamol 500mg - 1 comprimido cada 8 horas por 5 días', 
        'Amoxicilina 500mg - 1 cápsula cada 8 horas por 7 días'
      ],
      signos: {
        presion: '120/80 mmHg',
        peso: '80 kg',
        temperatura: '37.8°C',
        frecuenciaCardiaca: '85 lpm',
        saturacion: '96%'
      }
    }
  ];
  
  // Datos de muestra para condiciones crónicas
  const chronicConditions = [
    {
      condicion: 'Hipertensión Arterial',
      fechaDiagnostico: '2025-04-15',
      estado: 'Controlada',
      medicacionActual: 'Losartán 50mg diario',
      ultimoControl: '2025-04-15',
      proximoControl: '2025-05-15'
    }
  ];
  
  // Datos de muestra para alergias
  const allergies = [
    {
      alergia: 'Penicilina',
      reaccion: 'Erupción cutánea',
      severidad: 'Moderada',
      fechaDeteccion: '2020-05-10'
    },
    {
      alergia: 'Polen',
      reaccion: 'Rinitis alérgica',
      severidad: 'Leve',
      fechaDeteccion: '2018-03-22'
    }
  ];
  
  // Filtrar historiales según el término de búsqueda
  const filteredHistory = sampleMedicalHistory.filter(record => {
    const searchString = searchTerm.toLowerCase();
    return (
      record.doctor.toLowerCase().includes(searchString) ||
      record.especialidad.toLowerCase().includes(searchString) ||
      record.diagnostico.toLowerCase().includes(searchString) ||
      record.notas.toLowerCase().includes(searchString)
    );
  });
  
  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  // Alternar la expansión de un registro
  const toggleRecordExpansion = (recordId) => {
    setExpandedRecords(prev => ({
      ...prev,
      [recordId]: !prev[recordId]
    }));
  };
  
  // Renderizar la tarjeta para un registro médico
  const renderMedicalRecord = (record) => {
    const isExpanded = expandedRecords[record.id] || false;
    
    return (
      <div 
        key={record.id} 
        className={`mb-4 rounded-lg shadow-sm ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}
      >
        <div 
          className={`p-4 cursor-pointer ${isExpanded ? (darkMode ? 'border-b border-gray-600' : 'border-b border-gray-200') : ''}`}
          onClick={() => toggleRecordExpansion(record.id)}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <FaHeartbeat className={`${darkMode ? 'text-green-400' : 'text-green-600'} mr-2`} />
                <h3 className="font-bold">{record.diagnostico}</h3>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {formatDate(record.fecha)} - {record.doctor} ({record.especialidad})
              </p>
            </div>
            <div>
              {isExpanded ? <FaAngleUp /> : <FaAngleDown />}
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-4">
            <div className={`grid grid-cols-2 gap-4 mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center">
                <FaHeartbeat className={`${darkMode ? 'text-green-400' : 'text-green-600'} mr-2`} />
                <div>
                  <p className="text-xs font-medium">Presión Arterial</p>
                  <p className="font-bold">{record.signos.presion}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaWeight className={`${darkMode ? 'text-green-400' : 'text-green-600'} mr-2`} />
                <div>
                  <p className="text-xs font-medium">Peso</p>
                  <p className="font-bold">{record.signos.peso}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaHeartbeat className={`${darkMode ? 'text-green-400' : 'text-green-600'} mr-2`} />
                <div>
                  <p className="text-xs font-medium">Frecuencia Cardíaca</p>
                  <p className="font-bold">{record.signos.frecuenciaCardiaca}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaLungs className={`${darkMode ? 'text-green-400' : 'text-green-600'} mr-2`} />
                <div>
                  <p className="text-xs font-medium">Saturación O₂</p>
                  <p className="font-bold">{record.signos.saturacion}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <h4 className="font-semibold mb-1">Notas médicas:</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{record.notas}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">Medicamentos recetados:</h4>
              <ul className={`list-disc pl-5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {record.recetas.map((med, idx) => (
                  <li key={idx}>{med}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="p-5">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaFileMedical className="mr-2 text-green-500" />
          Mi Historial Clínico
        </h2>
        
        {/* Pestañas de navegación */}
        <div className={`flex border-b mb-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'historial' 
              ? (darkMode 
                ? 'border-b-2 border-green-500 text-green-400' 
                : 'border-b-2 border-green-500 text-green-600') 
              : (darkMode ? 'text-gray-400' : 'text-gray-600')}`}
            onClick={() => setActiveTab('historial')}
          >
            <FaHistory className="inline mr-2" />
            Historial de Consultas
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'condiciones' 
              ? (darkMode 
                ? 'border-b-2 border-green-500 text-green-400' 
                : 'border-b-2 border-green-500 text-green-600') 
              : (darkMode ? 'text-gray-400' : 'text-gray-600')}`}
            onClick={() => setActiveTab('condiciones')}
          >
            <FaHeartbeat className="inline mr-2" />
            Condiciones Crónicas
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'alergias' 
              ? (darkMode 
                ? 'border-b-2 border-green-500 text-green-400' 
                : 'border-b-2 border-green-500 text-green-600') 
              : (darkMode ? 'text-gray-400' : 'text-gray-600')}`}
            onClick={() => setActiveTab('alergias')}
          >
            <FaHeartbeat className="inline mr-2" />
            Alergias
          </button>
        </div>
        
        {activeTab === 'historial' && (
          <>
            {/* Buscador */}
            <div className={`relative mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className={`pl-10 pr-4 py-2 rounded-lg w-full ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 focus:border-green-500' 
                    : 'bg-gray-50 border-gray-300 focus:border-green-500'
                } border focus:outline-none focus:ring-2 focus:ring-green-200`}
                placeholder="Buscar en historial médico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Lista de registros médicos */}
            <div className="mt-4">
              {filteredHistory.length === 0 ? (
                <div className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FaFileMedical className="mx-auto h-10 w-10 mb-2 opacity-50" />
                  <p>No se encontraron registros médicos</p>
                </div>
              ) : (
                filteredHistory.map(record => renderMedicalRecord(record))
              )}
            </div>
          </>
        )}
        
        {activeTab === 'condiciones' && (
          <div className="mt-4">
            {chronicConditions.length === 0 ? (
              <div className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <FaHeartbeat className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p>No se encontraron condiciones crónicas registradas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chronicConditions.map((condition, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}
                  >
                    <h3 className="font-bold text-lg">{condition.condicion}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <div>
                        <p className="text-sm font-medium">Fecha de diagnóstico</p>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {formatDate(condition.fechaDiagnostico)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Estado actual</p>
                        <p className={`font-semibold ${
                          condition.estado === 'Controlada' 
                            ? (darkMode ? 'text-green-400' : 'text-green-600')
                            : (darkMode ? 'text-yellow-400' : 'text-yellow-600')
                        }`}>
                          {condition.estado}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Medicación actual</p>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {condition.medicacionActual}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Último control</p>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {formatDate(condition.ultimoControl)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Próximo control</p>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {formatDate(condition.proximoControl)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'alergias' && (
          <div className="mt-4">
            {allergies.length === 0 ? (
              <div className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <FaHeartbeat className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p>No se encontraron alergias registradas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Alergia</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Reacción</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Severidad</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Detectada</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {allergies.map((allergy, index) => (
                      <tr key={index} className={darkMode ? 'bg-gray-800' : 'bg-white'}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {allergy.alergia}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {allergy.reaccion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            allergy.severidad === 'Grave' 
                              ? 'bg-red-100 text-red-800' 
                              : allergy.severidad === 'Moderada'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {allergy.severidad}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(allergy.fechaDeteccion)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;
