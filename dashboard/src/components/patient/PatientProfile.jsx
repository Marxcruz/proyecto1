import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../../main';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaPen, FaLock, FaHeartbeat, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';

const PatientProfile = ({ darkMode }) => {
  const { patient } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    identificacion: '',
    fechaNacimiento: '',
    genero: '',
    direccion: '',
    grupoSanguineo: '',
    alergias: '',
    condicionesCronicas: '',
    contactoEmergencia: '',
    telefonoEmergencia: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Cargar datos del paciente
  useEffect(() => {
    if (patient) {
      setProfileData({
        nombre: patient.nombre || '',
        apellido: patient.apellido || '',
        correo: patient.correo || '',
        telefono: patient.telefono || '',
        identificacion: patient.identificacion || '',
        fechaNacimiento: patient.fechaNacimiento || '',
        genero: patient.genero || '',
        direccion: patient.direccion || '',
        grupoSanguineo: patient.grupoSanguineo || '',
        alergias: patient.alergias || '',
        condicionesCronicas: patient.condicionesCronicas || '',
        contactoEmergencia: patient.contactoEmergencia || '',
        telefonoEmergencia: patient.telefonoEmergencia || ''
      });
    }
  }, [patient]);

  // Manejar cambios en el formulario de perfil
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en el formulario de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar cambios del perfil
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!profileData.nombre || !profileData.apellido || !profileData.correo) {
      toast.error('Los campos nombre, apellido y correo son obligatorios');
      return;
    }
    
    try {
      setLoading(true);
      
      // En un entorno real, esto sería una llamada a la API para actualizar el perfil
      // const response = await axios.put(
      //   `http://localhost:3030/api/v1/user/update-patient/${patient._id}`,
      //   profileData,
      //   { withCredentials: true }
      // );
      
      // Simulación de actualización exitosa
      setTimeout(() => {
        toast.success('Perfil actualizado correctamente');
        setIsEditing(false);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('Error al actualizar el perfil');
      setLoading(false);
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Todos los campos de contraseña son obligatorios');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden');
      return;
    }
    
    try {
      setLoading(true);
      
      // En un entorno real, esto sería una llamada a la API para cambiar la contraseña
      // const response = await axios.post(
      //   `http://localhost:3030/api/v1/user/change-patient-password`,
      //   passwordData,
      //   { withCredentials: true }
      // );
      
      // Simulación de actualización exitosa
      setTimeout(() => {
        toast.success('Contraseña actualizada correctamente');
        setShowPasswordForm(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      toast.error('Error al actualizar la contraseña');
      setLoading(false);
    }
  };

  const themeClasses = {
    mainBg: darkMode ? 'bg-gray-800' : 'bg-white',
    text: darkMode ? 'text-white' : 'text-gray-800',
    subText: darkMode ? 'text-gray-300' : 'text-gray-600',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    inputBg: darkMode ? 'bg-gray-700' : 'bg-white',
    inputText: darkMode ? 'text-white' : 'text-gray-800',
    inputBorder: darkMode ? 'border-gray-600' : 'border-gray-300',
    buttonPrimary: darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600',
    buttonSecondary: darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300',
    icon: darkMode ? 'text-green-400' : 'text-green-500'
  };

  return (
    <div className={`${themeClasses.mainBg} rounded-lg shadow-md p-6 ${themeClasses.text}`}>
      {/* Cabecera de perfil */}
      <div className={`flex flex-col md:flex-row items-center mb-8 pb-6 border-b ${themeClasses.border}`}>
        <div className="bg-green-500 text-white p-4 rounded-full mb-4 md:mb-0 md:mr-6">
          <FaUser size={48} />
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            {profileData.nombre} {profileData.apellido}
          </h2>
          <p className={themeClasses.subText}>Paciente #{patient?.numeroHistoria || "N/A"}</p>
          <div className={`flex items-center mt-2 ${themeClasses.subText}`}>
            <FaEnvelope className="mr-2" />
            <span>{profileData.correo}</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:ml-auto">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 ${themeClasses.buttonPrimary} text-white rounded-lg flex items-center`}
          >
            <FaPen className="mr-2" /> {isEditing ? 'Cancelar edición' : 'Editar perfil'}
          </button>
        </div>
      </div>
      
      {isEditing ? (
        /* Formulario de edición */
        <form onSubmit={handleSaveProfile}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block ${themeClasses.text} mb-2`}>Nombre</label>
              <input 
                type="text"
                name="nombre"
                value={profileData.nombre}
                onChange={handleProfileChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.inputBg} ${themeClasses.inputText} ${themeClasses.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block ${themeClasses.text} mb-2`}>Apellido</label>
              <input 
                type="text"
                name="apellido"
                value={profileData.apellido}
                onChange={handleProfileChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.inputBg} ${themeClasses.inputText} ${themeClasses.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block ${themeClasses.text} mb-2`}>Correo electrónico</label>
              <input 
                type="email"
                name="correo"
                value={profileData.correo}
                onChange={handleProfileChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.inputBg} ${themeClasses.inputText} ${themeClasses.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block ${themeClasses.text} mb-2`}>Teléfono</label>
              <input 
                type="text"
                name="telefono"
                value={profileData.telefono}
                onChange={handleProfileChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.inputBg} ${themeClasses.inputText} ${themeClasses.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block ${themeClasses.text} mb-2`}>Identificación</label>
              <input 
                type="text"
                name="identificacion"
                value={profileData.identificacion}
                onChange={handleProfileChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.inputBg} ${themeClasses.inputText} ${themeClasses.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block ${themeClasses.text} mb-2`}>Fecha de nacimiento</label>
              <input 
                type="date"
                name="fechaNacimiento"
                value={profileData.fechaNacimiento}
                onChange={handleProfileChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.inputBg} ${themeClasses.inputText} ${themeClasses.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block ${themeClasses.text} mb-2`}>Género</label>
              <select 
                name="genero"
                value={profileData.genero}
                onChange={handleProfileChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.inputBg} ${themeClasses.inputText} ${themeClasses.inputBorder}`}
              >
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className={`block ${themeClasses.text} mb-2`}>Grupo sanguíneo</label>
              <select 
                name="grupoSanguineo"
                value={profileData.grupoSanguineo}
                onChange={handleProfileChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.inputBg} ${themeClasses.inputText} ${themeClasses.inputBorder}`}
              >
                <option value="">Seleccionar</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={`block ${themeClasses.text} mb-2`}>Dirección</label>
              <input 
                type="text"
                name="direccion"
                value={profileData.direccion}
                onChange={handleProfileChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.inputBg} ${themeClasses.inputText} ${themeClasses.inputBorder}`}
              />
            </div>
            <div className="md:col-span-2">
              <label className={`block ${themeClasses.text} mb-2`}>Alergias</label>
              <textarea 
                name="alergias"
                value={profileData.alergias}
                onChange={handleProfileChange}
                rows="2"
                placeholder="Indique sus alergias, o escriba 'Ninguna' si no tiene"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.inputBg} ${themeClasses.inputText} ${themeClasses.inputBorder}`}
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <label className={`block ${themeClasses.text} mb-2`}>Condiciones crónicas</label>
              <textarea 
                name="condicionesCronicas"
                value={profileData.condicionesCronicas}
                onChange={handleProfileChange}
                rows="2"
                placeholder="Indique sus condiciones médicas crónicas, o escriba 'Ninguna' si no tiene"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.inputBg} ${themeClasses.inputText} ${themeClasses.inputBorder}`}
              ></textarea>
            </div>
            <div>
              <label className={`block ${themeClasses.text} mb-2`}>Contacto de emergencia</label>
              <input 
                type="text"
                name="contactoEmergencia"
                value={profileData.contactoEmergencia}
                onChange={handleProfileChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.inputBg} ${themeClasses.inputText} ${themeClasses.inputBorder}`}
              />
            </div>
            <div>
              <label className={`block ${themeClasses.text} mb-2`}>Teléfono de emergencia</label>
              <input 
                type="text"
                name="telefonoEmergencia"
                value={profileData.telefonoEmergencia}
                onChange={handleProfileChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.inputBg} ${themeClasses.inputText} ${themeClasses.inputBorder}`}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className={`px-4 py-2 ${themeClasses.buttonSecondary} ${darkMode ? 'text-white' : 'text-gray-700'} rounded-lg hover:bg-gray-400 mr-2`}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className={`px-4 py-2 ${themeClasses.buttonPrimary} text-white rounded-lg flex items-center`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : 'Guardar cambios'}
            </button>
          </div>
        </form>
      ) : (
        /* Vista de información */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`${themeClasses.subText} font-medium mb-2`}>Información personal</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaIdCard className={`${themeClasses.icon} mr-2`} />
                  <div>
                    <span className={`${themeClasses.subText} text-sm`}>Identificación</span>
                    <p>{profileData.identificacion || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaPhone className={`${themeClasses.icon} mr-2`} />
                  <div>
                    <span className={`${themeClasses.subText} text-sm`}>Teléfono</span>
                    <p>{profileData.telefono || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className={`${themeClasses.icon} mr-2`} />
                  <div>
                    <span className={`${themeClasses.subText} text-sm`}>Correo electrónico</span>
                    <p>{profileData.correo}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className={`${themeClasses.icon} mr-2`} />
                  <div>
                    <span className={`${themeClasses.subText} text-sm`}>Fecha de nacimiento</span>
                    <p>{profileData.fechaNacimiento || 'No especificado'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className={`${themeClasses.subText} font-medium mb-2`}>Información médica</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaHeartbeat className={`${themeClasses.icon} mr-2`} />
                  <div>
                    <span className={`${themeClasses.subText} text-sm`}>Grupo sanguíneo</span>
                    <p>{profileData.grupoSanguineo || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaUser className={`${themeClasses.icon} mr-2`} />
                  <div>
                    <span className={`${themeClasses.subText} text-sm`}>Género</span>
                    <p>{profileData.genero || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaPhone className={`${themeClasses.icon} mr-2`} />
                  <div>
                    <span className={`${themeClasses.subText} text-sm`}>Contacto de emergencia</span>
                    <p>{profileData.contactoEmergencia || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaPhone className={`${themeClasses.icon} mr-2`} />
                  <div>
                    <span className={`${themeClasses.subText} text-sm`}>Teléfono de emergencia</span>
                    <p>{profileData.telefonoEmergencia || 'No especificado'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {profileData.direccion && (
            <div className="mt-6">
              <h3 className={`${themeClasses.subText} font-medium mb-2`}>Dirección</h3>
              <p className={themeClasses.text}>{profileData.direccion}</p>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className={`${themeClasses.subText} font-medium mb-2`}>Alergias</h3>
            <p className={themeClasses.text}>{profileData.alergias || 'Ninguna registrada'}</p>
          </div>
          
          <div className="mt-6">
            <h3 className={`${themeClasses.subText} font-medium mb-2`}>Condiciones médicas crónicas</h3>
            <p className={themeClasses.text}>{profileData.condicionesCronicas || 'Ninguna registrada'}</p>
          </div>
        </>
      )}
      
      {/* Sección de cambio de contraseña */}
      <div className={`mt-8 pt-6 border-t ${themeClasses.border}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Seguridad</h3>
          <button 
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className={`px-4 py-2 ${themeClasses.buttonSecondary} ${darkMode ? 'text-white' : 'text-gray-700'} rounded-lg flex items-center`}
          >
            <FaLock className="mr-2" /> {showPasswordForm ? 'Cancelar' : 'Cambiar contraseña'}
          </button>
        </div>
        
        {showPasswordForm && (
          <form onSubmit={handleChangePassword} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block ${themeClasses.text} mb-2`}>Contraseña actual</label>
                <input 
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.inputBg} ${themeClasses.inputText} ${themeClasses.inputBorder}`}
                />
              </div>
              <div>
                <label className={`block ${themeClasses.text} mb-2`}>Nueva contraseña</label>
                <input 
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.inputBg} ${themeClasses.inputText} ${themeClasses.inputBorder}`}
                />
              </div>
              <div>
                <label className={`block ${themeClasses.text} mb-2`}>Confirmar contraseña</label>
                <input 
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.inputBg} ${themeClasses.inputText} ${themeClasses.inputBorder}`}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button 
                type="submit"
                className={`px-4 py-2 ${themeClasses.buttonPrimary} text-white rounded-lg flex items-center`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Actualizando...
                  </>
                ) : 'Actualizar contraseña'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;
