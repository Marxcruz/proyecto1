import React, { useState } from 'react';
import { FaFlask, FaDownload, FaFileAlt, FaCalendarAlt, FaUserMd, FaChartLine, FaSearch, FaAngleDown, FaAngleUp } from 'react-icons/fa';

const LabResults = ({ darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedResults, setExpandedResults] = useState({});
  
  // Datos de muestra para resultados de laboratorio
  const sampleLabResults = [
    {
      id: 1,
      tipo: 'Hemograma completo',
      fecha: '2025-04-10',
      solicitadoPor: 'Dr. Juan Pérez',
      estado: 'Completado',
      resultados: [
        { nombre: 'Hemoglobina', valor: '14.2 g/dL', referencia: '13.5 - 17.5 g/dL', estado: 'Normal' },
        { nombre: 'Hematocrito', valor: '42%', referencia: '41 - 50%', estado: 'Normal' },
        { nombre: 'Leucocitos', valor: '7500 /mm³', referencia: '4500 - 11000 /mm³', estado: 'Normal' },
        { nombre: 'Plaquetas', valor: '240,000 /mm³', referencia: '150,000 - 450,000 /mm³', estado: 'Normal' }
      ]
    },
    {
      id: 2,
      tipo: 'Perfil lipídico',
      fecha: '2025-04-10',
      solicitadoPor: 'Dr. Juan Pérez',
      estado: 'Completado',
      resultados: [
        { nombre: 'Colesterol total', valor: '210 mg/dL', referencia: '< 200 mg/dL', estado: 'Alto' },
        { nombre: 'Colesterol HDL', valor: '45 mg/dL', referencia: '> 40 mg/dL', estado: 'Normal' },
        { nombre: 'Colesterol LDL', valor: '135 mg/dL', referencia: '< 130 mg/dL', estado: 'Alto' },
        { nombre: 'Triglicéridos', valor: '150 mg/dL', referencia: '< 150 mg/dL', estado: 'Normal' }
      ]
    },
    {
      id: 3,
      tipo: 'Glucosa en ayunas',
      fecha: '2025-04-10',
      solicitadoPor: 'Dr. Juan Pérez',
      estado: 'Completado',
      resultados: [
        { nombre: 'Glucosa', valor: '92 mg/dL', referencia: '70 - 100 mg/dL', estado: 'Normal' }
      ]
    },
    {
      id: 4,
      tipo: 'Radiografía de tórax',
      fecha: '2025-03-05',
      solicitadoPor: 'Dra. Laura Gómez',
      estado: 'Completado',
      resultados: [
        { 
          nombre: 'Hallazgos', 
          valor: 'Sin alteraciones radiográficas significativas. Campos pulmonares adecuadamente ventilados. Silueta cardíaca de tamaño normal.', 
          referencia: 'N/A', 
          estado: 'Normal' 
        }
      ],
      tieneImagen: true
    },
    {
      id: 5,
      tipo: 'Electrolitos en sangre',
      fecha: '2025-02-20',
      solicitadoPor: 'Dr. Roberto Sánchez',
      estado: 'Pendiente',
      resultados: []
    }
  ];
  
  // Filtrar resultados según el término de búsqueda
  const filteredResults = sampleLabResults.filter(result => {
    const searchString = searchTerm.toLowerCase();
    return (
      result.tipo.toLowerCase().includes(searchString) ||
      result.solicitadoPor.toLowerCase().includes(searchString)
    );
  });
  
  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  // Alternar la expansión de un resultado
  const toggleResultExpansion = (resultId) => {
    setExpandedResults(prev => ({
      ...prev,
      [resultId]: !prev[resultId]
    }));
  };
  
  // Obtener el color según el estado del resultado
  const getStatusColor = (status) => {
    switch (status) {
      case 'Alto':
        return darkMode ? 'text-red-400' : 'text-red-600';
      case 'Bajo':
        return darkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'Normal':
        return darkMode ? 'text-green-400' : 'text-green-600';
      default:
        return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  return (
    <div className={`rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="p-5">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaFlask className="mr-2 text-green-500" />
          Mis Resultados de Laboratorio
        </h2>
        
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
            placeholder="Buscar resultados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Lista de resultados */}
        <div className="mt-4">
          {filteredResults.length === 0 ? (
            <div className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <FaFlask className="mx-auto h-10 w-10 mb-2 opacity-50" />
              <p>No se encontraron resultados de laboratorio</p>
            </div>
          ) : (
            filteredResults.map(result => {
              const isExpanded = expandedResults[result.id] || false;
              const isPending = result.estado === 'Pendiente';
              
              return (
                <div 
                  key={result.id} 
                  className={`mb-4 rounded-lg shadow-sm ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}
                >
                  <div 
                    className={`p-4 cursor-pointer flex justify-between items-center ${
                      isExpanded ? (darkMode ? 'border-b border-gray-600' : 'border-b border-gray-200') : ''
                    }`}
                    onClick={() => !isPending && toggleResultExpansion(result.id)}
                  >
                    <div className="flex items-center">
                      <div className={`rounded-full p-2 mr-3 ${
                        isPending
                          ? (darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800')
                          : (darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800')
                      }`}>
                        <FaFlask />
                      </div>
                      <div>
                        <h3 className="font-bold">{result.tipo}</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {formatDate(result.fecha)} - {result.solicitadoPor}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold mr-3 ${
                        isPending
                          ? (darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800')
                          : (darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800')
                      }`}>
                        {result.estado}
                      </span>
                      {!isPending && (
                        isExpanded ? <FaAngleUp /> : <FaAngleDown />
                      )}
                    </div>
                  </div>
                  
                  {isExpanded && !isPending && (
                    <div className="p-4">
                      <div className="overflow-x-auto">
                        <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                          <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Parámetro</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Resultado</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Valores de Referencia</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Estado</th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                            {result.resultados.map((parametro, index) => (
                              <tr key={index} className={darkMode ? 'bg-gray-700' : 'bg-white'}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">
                                  {parametro.nombre}
                                </td>
                                <td className="px-6 py-4">
                                  {parametro.nombre === 'Hallazgos' 
                                    ? <div className="max-w-md">{parametro.valor}</div>
                                    : parametro.valor
                                  }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {parametro.referencia}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`${getStatusColor(parametro.estado)}`}>
                                    {parametro.estado}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {result.tieneImagen && (
                        <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          <h4 className="font-semibold mb-2 flex items-center">
                            <FaFileAlt className="mr-2" /> Imagen asociada
                          </h4>
                          <div className="h-48 bg-gray-300 rounded-lg flex items-center justify-center">
                            <p className="text-gray-600">Vista previa de imagen no disponible</p>
                          </div>
                          <button 
                            className={`mt-2 px-3 py-1 rounded-md text-sm flex items-center ${
                              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                          >
                            <FaDownload className="mr-1" /> Descargar imagen
                          </button>
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-end">
                        <button
                          className={`px-4 py-2 rounded-md flex items-center ${
                            darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                          } text-white`}
                        >
                          <FaDownload className="mr-2" /> Descargar PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default LabResults;
