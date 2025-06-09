import React, { useState } from 'react';
import { FaCalculator, FaHeartbeat, FaWeight } from 'react-icons/fa';

const ClinicalTools = ({ darkMode }) => {
  const [activeCalculator, setActiveCalculator] = useState('imc');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [result, setResult] = useState(null);

  const calculateIMC = () => {
    if (!height || !weight) return;
    
    const heightMeters = parseInt(height) / 100;
    const weightKg = parseInt(weight);
    const imc = weightKg / (heightMeters * heightMeters);
    
    let category = '';
    if (imc < 18.5) category = 'Bajo peso';
    else if (imc < 25) category = 'Peso normal';
    else if (imc < 30) category = 'Sobrepeso';
    else if (imc < 35) category = 'Obesidad grado I';
    else if (imc < 40) category = 'Obesidad grado II';
    else category = 'Obesidad grado III';
    
    setResult({
      value: imc.toFixed(2),
      interpretation: category,
      color: imc < 18.5 ? 'text-blue-500' : 
             imc < 25 ? 'text-green-500' : 
             imc < 30 ? 'text-yellow-500' : 'text-red-500'
    });
  };

  const calculateRiesgoCardiovascular = () => {
    if (!age || !systolic || !diastolic) return;
    
    const ageNum = parseInt(age);
    const systolicNum = parseInt(systolic);
    const diastolicNum = parseInt(diastolic);
    
    let riskLevel = '';
    let color = '';
    
    if (systolicNum >= 180 || diastolicNum >= 120) {
      riskLevel = 'Crisis hipertensiva - Riesgo muy alto';
      color = 'text-red-600';
    } else if (systolicNum >= 160 || diastolicNum >= 100) {
      riskLevel = 'Hipertensión grado 2 - Riesgo alto';
      color = 'text-red-500';
    } else if (systolicNum >= 140 || diastolicNum >= 90) {
      riskLevel = 'Hipertensión grado 1 - Riesgo moderado';
      color = 'text-yellow-500';
    } else if (systolicNum >= 130 || diastolicNum >= 85) {
      riskLevel = 'Prehipertensión - Riesgo bajo';
      color = 'text-yellow-400';
    } else {
      riskLevel = 'Normal - Riesgo bajo';
      color = 'text-green-500';
    }
    
    if (ageNum > 60) {
      riskLevel += ' (Mayor riesgo por edad)';
    }
    
    setResult({
      value: `${systolicNum}/${diastolicNum} mmHg`,
      interpretation: riskLevel,
      color: color
    });
  };

  return (
    <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <h2 className="text-xl font-bold mb-6">Herramientas Clínicas</h2>
      
      {/* Selector de herramienta */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => { setActiveCalculator('imc'); setResult(null); }}
            className={`p-3 rounded-lg ${activeCalculator === 'imc' 
              ? 'bg-blue-500 text-white' 
              : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            <div className="flex flex-col items-center">
              <FaWeight className="text-2xl mb-2" />
              <span>Calculadora IMC</span>
            </div>
          </button>
          
          <button
            onClick={() => { setActiveCalculator('riesgoCardiovascular'); setResult(null); }}
            className={`p-3 rounded-lg ${activeCalculator === 'riesgoCardiovascular' 
              ? 'bg-blue-500 text-white' 
              : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            <div className="flex flex-col items-center">
              <FaHeartbeat className="text-2xl mb-2" />
              <span>Riesgo Cardiovascular</span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Formulario de calculadora IMC */}
      {activeCalculator === 'imc' && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Calculadora de IMC</h3>
          
          <div className="mb-4">
            <label className="block mb-2">Altura (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className={`w-full p-3 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              placeholder="Ej. 170"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Peso (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={`w-full p-3 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              placeholder="Ej. 70"
            />
          </div>
          
          <button
            onClick={calculateIMC}
            className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Calcular IMC
          </button>
        </div>
      )}
      
      {/* Formulario de riesgo cardiovascular */}
      {activeCalculator === 'riesgoCardiovascular' && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Evaluación de Riesgo Cardiovascular</h3>
          
          <div className="mb-4">
            <label className="block mb-2">Edad</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className={`w-full p-3 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              placeholder="Ej. 45"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Presión Sistólica (mmHg)</label>
            <input
              type="number"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              className={`w-full p-3 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              placeholder="Ej. 120"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Presión Diastólica (mmHg)</label>
            <input
              type="number"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              className={`w-full p-3 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              placeholder="Ej. 80"
            />
          </div>
          
          <button
            onClick={calculateRiesgoCardiovascular}
            className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Evaluar Riesgo
          </button>
        </div>
      )}
      
      {/* Resultados */}
      {result && (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border ${darkMode ? 'border-blue-700' : 'border-blue-200'}`}>
          <h3 className="font-semibold mb-2">Resultado:</h3>
          <p className="text-2xl font-bold mb-1">
            <span className={result.color}>{result.value}</span>
          </p>
          <p className="font-medium">{result.interpretation}</p>
        </div>
      )}
    </div>
  );
};

export default ClinicalTools;
