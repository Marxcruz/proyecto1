import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
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
    },
    medicamentos: {
      type: String,
      required: true,
    },
    indicaciones: {
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

export default mongoose.model("Prescription", prescriptionSchema);
