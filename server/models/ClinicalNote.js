import mongoose from "mongoose";

const clinicalNoteSchema = new mongoose.Schema(
  {
    pacienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    diagnostico: {
      type: String,
      default: "",
    },
    tratamiento: {
      type: String,
      default: "",
    },
    medicamentos: {
      type: String,
      default: "",
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ClinicalNote", clinicalNoteSchema);
