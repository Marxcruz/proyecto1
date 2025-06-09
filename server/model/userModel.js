import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    minLength: [3, "El nombre es requerido"],
  },
  apellido: {
    type: String,
    required: true,
    minLength: [3, "El apellido es requerido"],
  },
  correo: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Por favor proporcione un correo electrónico válido"],
  },
  telefono: {
    type: String,
    required: true,
    minLength: [9, "El número de teléfono debe contener exactamente 9 dígitos"],
    maxLength: [9, "El número de teléfono debe contener exactamente 9 dígitos"],
  },
  identificacion: {
    type: String,
    required: true,
    minLength: [8, "El número de identificación debe contener exactamente 8 dígitos"],
    maxLength: [8, "El número de identificación debe contener exactamente 8 dígitos"],
  },
  fechaNacimiento: {
    type: Date,
    required: [true, "La fecha de nacimiento es requerida"],
  },
  genero: {
    type: String,
    required: true,
    enum: ["Masculino", "Femenino"],
  },
  contrasena: {
    type: String,
    required: [true, "La contraseña es requerida"],
    minLength: [6, "La contraseña debe contener al menos 6 caracteres"],
    select: false,
  },
  rol: {
    type: String,
    required: [true, "El rol de usuario es requerido"],
    enum: ["Paciente", "Doctor", "Administrador"],
  },
  //   esto es solo para doctor
  departamentoMedico: {
    type: String,
  },
  //   esto es solo para doctor no para usuario y administrador
  imagenDoctor: {
    public_id: String,
    url: String,
  },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("contrasena")) {
    next();
  }
  this.contrasena = await bcrypt.hash(this.contrasena, 10);
});

userSchema.methods.compararContrasena = async function (contrasenaIngresada) {
  return await bcrypt.compare(contrasenaIngresada, this.contrasena);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const User = mongoose.model("User", userSchema);
export default User;
