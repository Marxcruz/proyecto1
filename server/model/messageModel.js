import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      minLength: [3, "El nombre debe contener al menos 3 caracteres"],
    },
    apellido: {
      type: String,
      required: true,
      minLength: [3, "El apellido debe contener al menos 3 caracteres"],
    },
    correo: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Proporcione un correo electrónico válido"],
    },
    telefono: {
      type: String,
      required: true,
      minLength: [9, "El teléfono debe contener exactamente 9 dígitos"],
      maxLength: [9, "El teléfono debe contener exactamente 9 dígitos"],
    },
    mensaje: {
      type: String,
      required: true,
      minLength: [10, "El mensaje debe contener al menos 10 caracteres"],
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
