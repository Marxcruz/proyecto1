import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../../main';
import DoctorSidebar from '../DoctorSidebar';
import { FaUserMd, FaHospital, FaEnvelope, FaPhone, FaIdCard, FaPen, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorPerfil = () => {
  const { doctor } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    identificacion: '',
    departamentoMedico: '',
    experiencia: '',
    educacion: '',
    especialidad: '',
    biografia: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Cargar datos del doctor
  useEffect(() => {
    if (doctor) {
      setProfileData({
        nombre: doctor.nombre || '',
        apellido: doctor.apellido || '',
        correo: doctor.correo || '',
        telefono: doctor.telefono || '',
        identificacion: doctor.identificacion || '',
        departamentoMedico: doctor.departamentoMedico || '',
        experiencia: doctor.experiencia || '',
        educacion: doctor.educacion || '',
        especialidad: doctor.especialidad || '',
        biografia: doctor.biografia || ''
      });
    }
  }, [doctor]);

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
      //   `http://localhost:3030/api/v1/user/update-doctor/${doctor._id}`,
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
      //   `http://localhost:3030/api/v1/user/change-doctor-password`,
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

  return (
    <div className="flex h-screen bg-gray-100">
      <DoctorSidebar />
      <div className="flex-1 overflow-auto p-6 ml-64">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Cabecera de perfil */}
          <div className="flex flex-col md:flex-row items-center mb-8 pb-6 border-b">
            <div className="bg-blue-500 text-white p-4 rounded-full mb-4 md:mb-0 md:mr-6">
              <FaUserMd size={48} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Dr. {profileData.nombre} {profileData.apellido}
              </h2>
              <p className="text-gray-600">{profileData.especialidad || profileData.departamentoMedico}</p>
              <div className="flex items-center mt-2 text-gray-500">
                <FaEnvelope className="mr-2" />
                <span>{profileData.correo}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-auto">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
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
                  <label className="block text-gray-700 mb-2">Nombre</label>
                  <input 
                    type="text"
                    name="nombre"
                    value={profileData.nombre}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Apellido</label>
                  <input 
                    type="text"
                    name="apellido"
                    value={profileData.apellido}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Correo electrónico</label>
                  <input 
                    type="email"
                    name="correo"
                    value={profileData.correo}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Teléfono</label>
                  <input 
                    type="text"
                    name="telefono"
                    value={profileData.telefono}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Identificación</label>
                  <input 
                    type="text"
                    name="identificacion"
                    value={profileData.identificacion}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Especialidad</label>
                  <input 
                    type="text"
                    name="especialidad"
                    value={profileData.especialidad}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Departamento Médico</label>
                  <input 
                    type="text"
                    name="departamentoMedico"
                    value={profileData.departamentoMedico}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Experiencia (años)</label>
                  <input 
                    type="text"
                    name="experiencia"
                    value={profileData.experiencia}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Educación</label>
                  <input 
                    type="text"
                    name="educacion"
                    value={profileData.educacion}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Biografía</label>
                  <textarea 
                    name="biografia"
                    value={profileData.biografia}
                    onChange={handleProfileChange}
                    rows="4"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 mr-2"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
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
                  <h3 className="text-gray-500 font-medium mb-2">Información personal</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaIdCard className="text-blue-500 mr-2" />
                      <div>
                        <span className="text-gray-500 text-sm">Identificación</span>
                        <p>{profileData.identificacion || 'No especificado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="text-blue-500 mr-2" />
                      <div>
                        <span className="text-gray-500 text-sm">Teléfono</span>
                        <p>{profileData.telefono || 'No especificado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="text-blue-500 mr-2" />
                      <div>
                        <span className="text-gray-500 text-sm">Correo electrónico</span>
                        <p>{profileData.correo}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-500 font-medium mb-2">Información profesional</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaUserMd className="text-blue-500 mr-2" />
                      <div>
                        <span className="text-gray-500 text-sm">Especialidad</span>
                        <p>{profileData.especialidad || 'No especificado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaHospital className="text-blue-500 mr-2" />
                      <div>
                        <span className="text-gray-500 text-sm">Departamento</span>
                        <p>{profileData.departamentoMedico || 'No especificado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaUserMd className="text-blue-500 mr-2" />
                      <div>
                        <span className="text-gray-500 text-sm">Experiencia</span>
                        <p>{profileData.experiencia ? `${profileData.experiencia} años` : 'No especificado'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {profileData.educacion && (
                <div className="mt-6">
                  <h3 className="text-gray-500 font-medium mb-2">Educación</h3>
                  <p className="text-gray-700">{profileData.educacion}</p>
                </div>
              )}
              
              {profileData.biografia && (
                <div className="mt-6">
                  <h3 className="text-gray-500 font-medium mb-2">Biografía</h3>
                  <p className="text-gray-700">{profileData.biografia}</p>
                </div>
              )}
            </>
          )}
          
          {/* Sección de cambio de contraseña */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Seguridad</h3>
              <button 
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
              >
                <FaLock className="mr-2" /> {showPasswordForm ? 'Cancelar' : 'Cambiar contraseña'}
              </button>
            </div>
            
            {showPasswordForm && (
              <form onSubmit={handleChangePassword} className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Contraseña actual</label>
                    <input 
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Nueva contraseña</label>
                    <input 
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Confirmar contraseña</label>
                    <input 
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
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
      </div>
    </div>
  );
};

export default DoctorPerfil;
