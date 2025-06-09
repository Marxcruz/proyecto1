import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

// Conectar a la base de datos
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
  })
  .catch((error) => {
    console.log('Error de conexión a la base de datos:', error);
    process.exit(1);
  });

// Definir el esquema de usuario (debe coincidir con el modelo real)
const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
  },
  contrasena: {
    type: String,
    required: true,
    select: false,
  },
  telefono: {
    type: String,
    required: true,
  },
  identificacion: {
    type: String,
    required: true,
  },
  fechaNacimiento: {
    type: String,
    required: true,
  },
  genero: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ['Administrador', 'Doctor', 'Paciente'],
    default: 'Paciente',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Agregar método para comparar contraseñas
userSchema.methods.compararContrasena = async function (contrasenaIngresada) {
  return await bcrypt.compare(contrasenaIngresada, this.contrasena);
};

// Encriptar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('contrasena')) {
    return next();
  }
  this.contrasena = await bcrypt.hash(this.contrasena, 10);
});

// Crear el modelo de usuario
const User = mongoose.model('User', userSchema);

// Datos del administrador a crear
const adminData = {
  nombre: 'Administrador',
  apellido: 'Sistema',
  correo: 'admin@hospital.com',
  contrasena: 'admin123',
  telefono: '1234567890',
  identificacion: 'ADMIN123',
  fechaNacimiento: '1990-01-01',
  genero: 'Masculino',
  rol: 'Administrador',
};

// Función para crear el administrador
async function createAdmin() {
  try {
    // Verificar si ya existe un administrador con ese correo
    const existingAdmin = await User.findOne({ correo: adminData.correo });
    
    if (existingAdmin) {
      console.log('Ya existe un administrador con ese correo. No se creará uno nuevo.');
      console.log('Credenciales para iniciar sesión:');
      console.log(`Correo: ${adminData.correo}`);
      console.log(`Contraseña: admin123 (o la contraseña que se estableció al crear el usuario)`);
    } else {
      // Crear el administrador
      const admin = await User.create(adminData);
      console.log('Administrador creado exitosamente:');
      console.log(`Correo: ${adminData.correo}`);
      console.log(`Contraseña: admin123`);
    }
    
    // Cerrar la conexión a la base de datos
    mongoose.connection.close();
  } catch (error) {
    console.error('Error al crear el administrador:', error);
    mongoose.connection.close();
  }
}

// Ejecutar la función
createAdmin();
