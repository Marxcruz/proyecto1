import { errorHandleMiddleware } from "../middleware/errorHandleMiddleware.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import Appointment from "../model/appointmentModel.js";
import User from "../model/userModel.js";
import mongoose from "mongoose";

// create appointment - versión mejorada para manejar datos del paciente
export const createAppointmentController = async (req, res, next) => {
  try {
    console.log('=== INICIO DE CREACIÓN DE CITA ===');
    console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
    
    // Buscar un doctor disponible para la especialidad solicitada (especialidad = departamento)
    let doctorId;
    let doctorNombre = '';
    let doctorApellido = '';
    
    try {
      // Buscar un doctor según el departamento médico (especialidad)
      const departamento = req.body.departamento || req.body.especialidad || 'Medicina General';
      console.log(`Buscando doctor para departamento: ${departamento}`);
      
      // Buscar todos los doctores de esta especialidad
      const doctores = await User.find({ 
        rol: "Doctor", 
        departamentoMedico: departamento 
      });
      
      console.log(`Se encontraron ${doctores.length} doctores para ${departamento}`);
      
      if (doctores && doctores.length > 0) {
        // Seleccionar un doctor aleatoriamente entre los disponibles
        const doctorSeleccionado = doctores[Math.floor(Math.random() * doctores.length)];
        console.log(`Doctor seleccionado: ${doctorSeleccionado.nombre} ${doctorSeleccionado.apellido}`);
        
        doctorId = doctorSeleccionado._id;
        doctorNombre = doctorSeleccionado.nombre;
        doctorApellido = doctorSeleccionado.apellido;
      } else {
        // Si no hay doctores de esta especialidad, buscar cualquier doctor
        const cualquierDoctor = await User.findOne({ rol: "Doctor" });
        
        if (cualquierDoctor) {
          console.log(`No hay doctores de ${departamento}, asignando a: ${cualquierDoctor.nombre} ${cualquierDoctor.apellido}`);
          doctorId = cualquierDoctor._id;
          doctorNombre = cualquierDoctor.nombre;
          doctorApellido = cualquierDoctor.apellido;
        } else {
          console.log('No se encontró ningún doctor en el sistema, usando ID temporal');
          doctorId = new mongoose.Types.ObjectId();
          doctorNombre = 'Doctor';
          doctorApellido = 'No Asignado';
        }
      }
    } catch (err) {
      console.log('Error al buscar doctor:', err);
      console.log('Usando ID temporal');
      doctorId = new mongoose.Types.ObjectId();
      doctorNombre = 'Doctor';
      doctorApellido = 'No Asignado';
    }
    
    // Si se proporciona un ID de paciente, lo usamos, de lo contrario creamos uno temporal
    const idPaciente = req.body.idPaciente || new mongoose.Types.ObjectId();
    
    // Datos para la cita con mejor manejo de datos
    const citaData = {
      // Datos del paciente
      nombre: req.body.nombre || 'Paciente',
      apellido: req.body.apellido || 'Temporal',
      correo: req.body.correo || 'paciente@ejemplo.com',
      telefono: req.body.telefono || '1234567890',
      identificacion: req.body.identificacion || '12345678',
      fechaNacimiento: req.body.fechaNacimiento || new Date().toISOString().split('T')[0],
      genero: req.body.genero || 'No especificado',
      
      // Datos de la cita
      fechaCita: req.body.fechaCita || new Date().toISOString().split('T')[0],
      horaCita: req.body.horaCita || '12:00', // Solo usa el valor predeterminado si no hay horaCita
      departamento: req.body.departamento || req.body.especialidad || 'Medicina General',
      motivo: req.body.motivo || 'Consulta general',
      
      // Log para depuración de la hora
      ...((req.body.horaCita) ? console.log('Hora recibida:', req.body.horaCita) : console.log('Hora no recibida, usando valor predeterminado')),
      
      // Log para depuración del motivo
      ...((req.body.motivo) ? console.log('Motivo recibido:', req.body.motivo) : console.log('Motivo no recibido')),
      
      // Datos del doctor asignado
      doctor: {
        nombre: doctorNombre,
        apellido: doctorApellido
      },
      
      // Otros datos
      haVisitado: false,
      direccion: req.body.direccion || 'No especificada',
      idDoctor: doctorId,
      idPaciente: idPaciente,
      estado: 'Pendiente',
      fechaCreacion: new Date()
    };
    
    console.log('Intentando crear cita con datos:', JSON.stringify(citaData, null, 2));
    
    // Crear la cita en la base de datos
    const appointment = await Appointment.create(citaData);
    console.log('¡Cita creada exitosamente con ID:', appointment._id);
    
    return res.status(201).json({
      success: true,
      message: "Cita registrada exitosamente y pendiente de aprobación",
      appointment,
    });
  } catch (error) {
    console.error('Error al crear cita:', error);
    
    // Devolver un mensaje de error detallado
    return res.status(500).json({
      success: false,
      message: "Error al crear la cita",
      error: error.message
    });
  }
};

// get all appointments
export const getAllAppointmentController = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      console.log('Obteniendo todas las citas...');
      const appointments = await Appointment.find().sort({ createdAt: -1 });
      console.log(`Se encontraron ${appointments.length} citas`);
      
      // Devolver un array vacío en lugar de un error cuando no hay citas
      // response
      res.status(200).send({
        success: true,
        message: appointments.length > 0 
          ? "Todos los historiales clínicos obtenidos" 
          : "No hay historiales clínicos registrados",
        appointment: appointments, // Cambiado de 'appointments' a 'appointment' para coincidir con el frontend
      });
    } catch (error) {
      console.error('Error al obtener citas:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener los historiales clínicos",
        error: error.message
      });
    }
  }
);

// delete appointment
export const deleteAppointmentController = errorHandleMiddleware(
  async (req, res, next) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Historial clínico no encontrado", 400));
    }
    // response
    await appointment.deleteOne();
    res.status(200).send({
      success: true,
      message: "Historial clínico eliminado exitosamente",
    });
  }
);

// update appointment status
export const updateAppointmentController = errorHandleMiddleware(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Historial clínico no encontrado", 400));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).send({
      success: true,
      message: "Estado del historial clínico actualizado",
    });
  }
);

// obtener todas las citas para un doctor específico 
export const getDoctorAppointmentsController = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      console.log('=== OBTENIENDO CITAS PARA MOSTRAR EN EL DASHBOARD DEL DOCTOR ===');
      
      // Obtener ID y departamento médico del doctor desde el token
      const doctorId = req.user?._id;
      let doctorInfo = null;
      
      // Buscar la información completa del doctor para obtener su especialidad
      if (doctorId) {
        doctorInfo = await User.findById(doctorId);
        console.log(`Doctor identificado: ${doctorInfo?.nombre} ${doctorInfo?.apellido} - Especialidad: ${doctorInfo?.departamentoMedico || 'No especificada'}`);
      } else {
        console.log('No se pudo identificar al doctor, se mostrarán todas las citas');
      }
      
      // Crear el filtro de búsqueda
      const filter = {};
      
      // Si tenemos la especialidad del doctor, filtrar por departamento
      if (doctorInfo?.departamentoMedico) {
        filter.departamento = doctorInfo.departamentoMedico;
        console.log(`Filtrando citas por especialidad: ${doctorInfo.departamentoMedico}`);
      }
      
      // Obtener las citas que corresponden a la especialidad del doctor
      let appointments = await Appointment.find(filter).sort({ fechaCita: -1 });
      console.log(`Se encontraron ${appointments.length} citas para la especialidad ${doctorInfo?.departamentoMedico || 'No especificada'}`);
      
      
      // Asegurarse de que todas las citas tengan un campo motivo
      appointments = appointments.map(app => {
        // Si la cita no tiene motivo o es undefined/null, asignar un valor por defecto
        if (!app.motivo) {
          console.log(`Asignando motivo por defecto a la cita ID: ${app._id}`);
          app.motivo = 'Consulta general';
          // Guardar la actualización en la base de datos (esto es asíncrono pero no esperamos su finalización)
          Appointment.findByIdAndUpdate(app._id, { motivo: 'Consulta general' })
            .catch(err => console.error(`Error al actualizar motivo de cita ${app._id}:`, err));
        }
        return app;
      });
      
      // Si no hay citas, devolver un array vacío en lugar de un error
      res.status(200).send({
        success: true,
        message: appointments.length > 0 
          ? "Citas obtenidas exitosamente" 
          : "No hay citas registradas en el sistema",
        appointments: appointments.length > 0 ? appointments : [],
      });
    } catch (error) {
      console.error('Error al obtener citas para el dashboard del doctor:', error);
      // Devolver un array vacío en caso de error
      return res.status(200).json({
        success: true,
        message: "No se pudieron obtener las citas, pero se permite continuar",
        appointments: []
      });
    }
  }
);

// obtener todos los pacientes para un doctor específico
export const getDoctorPatientsController = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      // Obtener el ID del doctor desde el token (middleware doctorTokenAuth)
      const doctorId = req.user._id;
      console.log(`Obteniendo pacientes para el doctor con ID: ${doctorId}`);
      
      // Obtener todas las citas de este doctor
      const appointments = await Appointment.find({ idDoctor: doctorId });
      
      // Extraer IDs de pacientes únicos
      const patientIds = [...new Set(appointments.map(app => app.idPaciente))];
      console.log(`IDs de pacientes únicos: ${patientIds.length}`);
      
      // Buscar información completa de los pacientes
      const patients = await User.find({ 
        _id: { $in: patientIds },
        rol: "Paciente"
      });
      
      console.log(`Información completa de pacientes obtenida: ${patients.length}`);
      
      res.status(200).send({
        success: true,
        message: patients.length > 0 
          ? "Pacientes obtenidos exitosamente" 
          : "No hay pacientes registrados para este doctor",
        patients: patients,
      });
    } catch (error) {
      console.error('Error al obtener pacientes del doctor:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener los pacientes del doctor",
        error: error.message
      });
    }
  }
);

// obtener citas de pacientes - funciona de dos formas:
// 1. Para doctores: obtiene las citas de un paciente específico con ID en la ruta
// 2. Para pacientes: obtiene las citas propias del paciente autenticado
export const getPatientAppointmentsController = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      // Determinar si la solicitud viene de un doctor o de un paciente
      const isDoctor = req.user.rol === "Doctor";
      let patientId;
      
      if (isDoctor) {
        // Si es doctor, usa el ID de paciente de los parámetros de la URL
        patientId = req.params.id;
        console.log(`Doctor ${req.user._id} consultando citas del paciente ${patientId}`);
      } else {
        // Si es paciente, usa su propio ID
        patientId = req.user._id;
        console.log(`Paciente ${patientId} consultando sus propias citas`);
      }
      
      if (!patientId) {
        return res.status(400).json({
          success: false,
          message: "ID de paciente no válido o no proporcionado"
        });
      }

      // Crear filtro de búsqueda
      let filter = { idPaciente: patientId };
      
      // Si es un doctor, filtrar sólo las citas asignadas a este doctor
      if (isDoctor) {
        filter.idDoctor = req.user._id;
      }
      
      const appointments = await Appointment.find(filter).sort({ fechaCita: -1 });
      
      console.log(`Se encontraron ${appointments.length} citas para el paciente ${patientId}`);
      
      res.status(200).send({
        success: true,
        message: appointments.length > 0 
          ? "Citas obtenidas exitosamente" 
          : "No hay citas registradas",
        appointments: appointments,
      });
    } catch (error) {
      console.error('Error al obtener citas del paciente:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener las citas",
        error: error.message
      });
    }
  }
);

// Actualizar estado de cita (confirmar/rechazar) - para uso de doctores
export const updateAppointmentStatusController = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      const { id } = req.params; // ID de la cita
      const { estado, observaciones } = req.body;
      
      console.log(`=== ACTUALIZANDO ESTADO DE CITA ${id} A ${estado} ===`);
      
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "ID de cita inválido"
        });
      }
      
      if (!estado || !['Confirmada', 'Cancelada', 'Completada', 'Pendiente'].includes(estado)) {
        return res.status(400).json({
          success: false,
          message: "Estado de cita inválido"
        });
      }
      
      // Buscar la cita primero para verificar que existe
      const appointment = await Appointment.findById(id);
      
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Cita no encontrada"
        });
      }
      
      // Actualizar el estado de la cita
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        id,
        { 
          $set: {
            estado: estado,
            observacionesDoctor: observaciones || appointment.observacionesDoctor
          }
        },
        { new: true }
      );
      
      res.status(200).json({
        success: true,
        message: `Estado de la cita actualizado a ${estado}`,
        appointment: updatedAppointment
      });
    } catch (error) {
      console.error('Error al actualizar estado de cita:', error);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar estado de la cita",
        error: error.message
      });
    }
  }
);

// actualizar doctores en citas existentes que tienen 'Por asignar'
export const updateAppointmentDoctors = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      console.log('=== ACTUALIZANDO DOCTORES EN CITAS EXISTENTES ===');
      
      // Buscar todas las citas donde el doctor es 'Por asignar'
      const citasSinDoctor = await Appointment.find({
        $or: [
          { 'doctor.nombre': 'Por asignar' },
          { 'doctor.nombre': '' },
          { 'doctor.nombre': null }
        ]
      });
      
      console.log(`Se encontraron ${citasSinDoctor.length} citas sin doctor asignado correctamente`);
      
      let actualizadas = 0;
      
      // Para cada cita, buscar un doctor adecuado según el departamento
      for (const cita of citasSinDoctor) {
        try {
          const departamento = cita.departamento || 'Medicina General';
          console.log(`Buscando doctor para cita ID: ${cita._id}, departamento: ${departamento}`);
          
          // Buscar todos los doctores de esta especialidad
          const doctores = await User.find({ 
            rol: "Doctor", 
            departamentoMedico: departamento 
          });
          
          if (doctores && doctores.length > 0) {
            // Seleccionar un doctor aleatoriamente
            const doctorSeleccionado = doctores[Math.floor(Math.random() * doctores.length)];
            console.log(`Doctor seleccionado: ${doctorSeleccionado.nombre} ${doctorSeleccionado.apellido}`);
            
            // Actualizar la cita con el doctor seleccionado
            await Appointment.updateOne(
              { _id: cita._id },
              { 
                $set: {
                  idDoctor: doctorSeleccionado._id,
                  doctor: {
                    nombre: doctorSeleccionado.nombre,
                    apellido: doctorSeleccionado.apellido
                  }
                }
              }
            );
            
            actualizadas++;
          } else {
            // Si no hay doctores de esta especialidad, buscar cualquier doctor
            const cualquierDoctor = await User.findOne({ rol: "Doctor" });
            
            if (cualquierDoctor) {
              await Appointment.updateOne(
                { _id: cita._id },
                { 
                  $set: {
                    idDoctor: cualquierDoctor._id,
                    doctor: {
                      nombre: cualquierDoctor.nombre,
                      apellido: cualquierDoctor.apellido
                    }
                  }
                }
              );
              
              actualizadas++;
            }
          }
        } catch (err) {
          console.error(`Error al actualizar cita ${cita._id}:`, err);
        }
      }
      
      res.status(200).send({
        success: true,
        message: `Se actualizaron ${actualizadas} de ${citasSinDoctor.length} citas`,
        actualizadas,
        total: citasSinDoctor.length
      });
    } catch (error) {
      console.error('Error al actualizar doctores en citas:', error);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar doctores en citas",
        error: error.message
      });
    }
  }
);
