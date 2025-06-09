import { errorHandleMiddleware } from "../middleware/errorHandleMiddleware.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import User from "../model/userModel.js";
import { jsontoken } from "../utils/token.js";
import cloudinary from "cloudinary";

export const createUserController = errorHandleMiddleware(
  async (req, res, next) => {
    const { nombre, apellido, correo, identificacion, fechaNacimiento, contrasena, genero, telefono } =
      req.body;

    if (
      !nombre ||
      !apellido ||
      !correo ||
      !telefono ||
      !identificacion ||
      !fechaNacimiento ||
      !genero ||
      !contrasena
    ) {
      return next(new ErrorHandler("Por favor, complete todo el formulario.", 400));
    }

    const isRegistered = await User.findOne({ correo });
    if (isRegistered) {
      return next(
        new ErrorHandler("Paciente ya registrado. Por favor inicie sesión.", 400)
      );
    }

    const user = await User.create({
      nombre,
      apellido,
      correo,
      identificacion,
      fechaNacimiento,
      contrasena,
      genero,
      telefono,
      rol: "Paciente",
    });

    jsontoken(user, "Usuario creado exitosamente", 201, res);
  }
);

// controlador de inicio de sesión
export const loginUserController = errorHandleMiddleware(
  async (req, res, next) => {
    const { correo, contrasena, rol } = req.body;
    
    console.log('Intento de inicio de sesión:', { correo, rol });
    
    if (!correo || !contrasena || !rol) {
      console.log('Error: Formulario incompleto');
      return next(new ErrorHandler("Por favor complete todo el formulario", 400));
    }
    
    try {
      const user = await User.findOne({ correo }).select("+contrasena");
      
      if (!user) {
        console.log('Error: Usuario no encontrado');
        return next(new ErrorHandler("Correo o contraseña inválidos", 404));
      }
      
      const passwordMatch = await user.compararContrasena(contrasena);
      if (!passwordMatch) {
        console.log('Error: Contraseña incorrecta');
        return next(new ErrorHandler("Correo o contraseña inválidos", 404));
      }
      
      if (rol !== user.rol) {
        console.log('Error: Rol incorrecto', { rolSolicitado: rol, rolUsuario: user.rol });
        return next(
          new ErrorHandler("El rol del correo y el rol del usuario no coinciden", 404)
        );
      }
      
      console.log('Inicio de sesión exitoso para:', { correo, rol });
      jsontoken(user, "Inicio de sesión exitoso", 200, res);
    } catch (error) {
      console.error('Error en loginUserController:', error);
      return next(new ErrorHandler("Error en el servidor. Por favor, inténtelo de nuevo más tarde.", 500));
    }
  }
);
// crear un token web json para paciente, administrador y doctor

// crear nuevo administrador
export const createAdminController = errorHandleMiddleware(
  async (req, res, next) => {
    const { nombre, apellido, correo, telefono, contrasena, identificacion, fechaNacimiento, genero } =
      req.body;
    if (
      !nombre ||
      !apellido ||
      !correo ||
      !telefono ||
      !contrasena ||
      !identificacion ||
      !fechaNacimiento ||
      !genero
    ) {
      return next(new ErrorHandler("¡Por favor complete todo el formulario!", 400));
    }
    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return next(new ErrorHandler("Este correo ya está registrado", 400));
    }
    const admin = await User.create({
      nombre,
      apellido,
      correo,
      telefono,
      contrasena,
      identificacion,
      fechaNacimiento,
      genero,
      rol: "Administrador",
    });
    res.status(201).send({
      success: true,
      message: "Administrador registrado exitosamente",
      admin,
    });
  }
);

// crear nuevo Doctor
export const createNewDoctorController = errorHandleMiddleware(
  async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Se requieren imágenes del doctor", 404));
    }
    
    // Obtener la imagen del doctor - aceptar tanto docImage (del frontend) como imagenDoctor
    const doctorImage = req.files.docImage || req.files.imagenDoctor;
    
    // Verificar que la imagen exista antes de acceder a su propiedad mimetype
    if (!doctorImage) {
      return next(new ErrorHandler("No se encontró la imagen del doctor", 404));
    }
    
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(doctorImage.mimetype)) {
      return next(new ErrorHandler("¡Formato de archivo no soportado!", 400));
    }
    // Mapear los nombres de campos del frontend (inglés) a los nombres esperados en el backend (español)
    const nombre = req.body.firstName || req.body.nombre;
    const apellido = req.body.lastName || req.body.apellido;
    const correo = req.body.email || req.body.correo;
    const contrasena = req.body.password || req.body.contrasena;
    const telefono = req.body.phone || req.body.telefono;
    
    // Mapear los valores de género de inglés a español
    let genero;
    if (req.body.gender === "Male" || req.body.genero === "Masculino") {
      genero = "Masculino";
    } else if (req.body.gender === "Female" || req.body.genero === "Femenino") {
      genero = "Femenino";
    } else {
      genero = req.body.gender || req.body.genero;
    }
    
    const identificacion = req.body.nic || req.body.identificacion;
    const fechaNacimiento = req.body.dob || req.body.fechaNacimiento;
    const departamentoMedico = req.body.doctorDepartment || req.body.departamentoMedico;
    
    if (
      !nombre ||
      !apellido ||
      !correo ||
      !contrasena ||
      !telefono ||
      !genero ||
      !identificacion ||
      !fechaNacimiento ||
      !departamentoMedico ||
      !doctorImage
    ) {
      return next(new ErrorHandler("Por favor complete todo el formulario", 400));
    }
    const register = await User.findOne({ correo });
    if (register) {
      return next(
        new ErrorHandler(`Este correo ya está registrado como ${register.rol}`, 400)
      );
    }
    // código para cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      doctorImage.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(
        "Error de Cloudinary:",
        cloudinaryResponse.error || "Error desconocido de Cloudinary"
      );
      return next(
        new ErrorHandler("Error al subir la imagen a Cloudinary", 404)
      );
    }
    const doctor = await User.create({
      nombre,
      apellido,
      correo,
      telefono,
      contrasena,
      identificacion,
      fechaNacimiento,
      genero,
      rol: "Doctor",
      departamentoMedico,
      imagenDoctor: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });
    res.status(201).send({
      success: true,
      message: "Nuevo doctor registrado",
      doctor,
    });
  }
);
// por favor configure cloudinary para la carga de imágenes

// obtener todos los doctores
export const getAllDoctorController = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      console.log("Buscando doctores con rol: 'Doctor'");
      const doctor = await User.find({ rol: "Doctor" });
      console.log(`Doctores encontrados: ${doctor.length}`);
      
      if (doctor.length === 0) {
        return next(new ErrorHandler("Doctor no encontrado", 404));
      }
      
      // Log de los doctores encontrados con sus departamentos
      doctor.forEach((doc, index) => {
        console.log(`Doctor ${index + 1}: ${doc.nombre} ${doc.apellido}, Departamento: ${doc.departamentoMedico}`);
      });
      
      res.status(200).send({
        success: true,
        message: "Doctores obtenidos exitosamente",
        doctor,
      });
    } catch (error) {
      console.error("Error al obtener doctores:", error);
      return next(new ErrorHandler("Error al obtener doctores", 500));
    }
  }
);

// obtener todos los pacientes
export const getAllPatientController = errorHandleMiddleware(
  async (req, res, next) => {
    const patient = await User.find({ rol: "Paciente" });
    if (!patient.length === 0) {
      return next(new ErrorHandler("Paciente no encontrado", 404));
    }
    res.status(200).send({
      success: true,
      message: "Pacientes obtenidos exitosamente",
      patient,
    });
  }
);

// obtener un solo paciente
export const getSinglePtientController = errorHandleMiddleware(
  async (req, res, next) => {
    const user = req.user;
    res.status(200).send({
      success: true,
      message: "Paciente individual obtenido exitosamente",
      user,
    });
  }
);

// obtener un solo doctor
export const getSingleDoctorController = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      const user = req.user;
      console.log(`Obteniendo información del doctor: ${user._id}`);
      
      res.status(200).send({
        success: true,
        message: "Información del doctor obtenida exitosamente",
        user,
      });
    } catch (error) {
      console.error('Error al obtener información del doctor:', error);
      return next(new ErrorHandler("Error al obtener información del doctor", 500));
    }
  }
);

// obtener un solo administrador
export const getSingleAdminController = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      const user = req.user;
      
      res.status(200).send({
        success: true,
        message: "Administrador obtenido exitosamente",
        user,
      });
    } catch (error) {
      console.error('Error al obtener información del administrador:', error);
      return next(new ErrorHandler("Error al obtener información del administrador", 500));
    }
  }
);

// obtener un paciente por ID (para doctores)
export const getPatientByIdController = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(`Buscando paciente con ID: ${id}`);
      
      const patient = await User.findOne({ _id: id, rol: "Paciente" });
      
      if (!patient) {
        return next(new ErrorHandler("Paciente no encontrado", 404));
      }
      
      res.status(200).send({
        success: true,
        message: "Paciente obtenido exitosamente",
        patient,
      });
    } catch (error) {
      console.error('Error al obtener paciente por ID:', error);
      return next(new ErrorHandler("Error al obtener información del paciente", 500));
    }
  }
);

// cerrar sesión de administrador
export const logOutAdmin = errorHandleMiddleware(async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .send({
      success: true,
      message: "Administrador cerró sesión exitosamente",
    });
});

// cerrar sesión de paciente
export const logOutPatient = errorHandleMiddleware(async (req, res, next) => {
  res
    .status(200)
    .cookie("patientToken", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .send({
      success: true,
      message: "Paciente cerró sesión exitosamente",
    });
});

// cerrar sesión de doctor
export const logOutDoctor = errorHandleMiddleware(async (req, res, next) => {
  res
    .status(200)
    .cookie("doctorToken", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .send({
      success: true,
      message: "Doctor cerró sesión exitosamente",
    });
});

// controlador para eliminar un doctor
export const deleteDoctorController = errorHandleMiddleware(
  async (req, res, next) => {
    const { id } = req.params;
    // encontrar el doctor por id y rol doctor
    const doctor = await User.findByIdAndDelete({ _id: id, rol: "Doctor" });
    if (!doctor && doctor.length === 0) {
      return next(new ErrorHandler("Doctor no encontrado", 404));
    }
    res.status(200).send({
      success: true,
      message: "Doctor eliminado exitosamente",
    });
  }
);

// controlador para eliminar un paciente
export const deletePatientController = errorHandleMiddleware(
  async (req, res, next) => {
    const { id } = req.params;
    // encontrar el paciente por id y rol paciente
    const patient = await User.findByIdAndDelete({ _id: id, rol: "Paciente" });
    if (!patient && patient.length === 0) {
      return next(new ErrorHandler("Paciente no encontrado", 404));
    }
    res.status(200).send({
      success: true,
      message: "Paciente eliminado exitosamente",
    });
  }
);
