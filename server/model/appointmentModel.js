import mongoose from "mongoose";

// Modelo de citas simplificado sin validaciones estrictas
const appointmentSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: false
  },
  apellido: {
    type: String,
    required: false
  },
  correo: {
    type: String,
    required: false
  },
  telefono: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        return !v || /^\d{9}$/.test(v);
      },
      message: props => `El telefono debe tener exactamente 9 digitos`
    }
  },
  identificacion: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        return !v || /^\d{8}$/.test(v);
      },
      message: props => `La identificación debe tener exactamente 8 dígitos`
    }
  },
  fechaNacimiento: {
    type: String,
    required: false
  },
  genero: {
    type: String,
    required: false
  },
  fechaCita: {
    type: String,
    required: false
  },
  horaCita: {
    type: String,
    required: false
  },
  departamento: {
    type: String,
    required: false
  },
  doctor: {
    nombre: {
      type: String,
      required: false
    },
    apellido: {
      type: String,
      required: false
    }
  },
  haVisitado: {
    type: Boolean,
    default: false
  },
  direccion: {
    type: String,
    required: false
  },
  idDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  idPaciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  estado: {
    type: String,
    default: "Pendiente"
  },
  motivo: {
    type: String,
    required: false
  }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
