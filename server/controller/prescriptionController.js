import Prescription from "../models/Prescription.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import errorHandleMiddleware from "../middleware/errorHandleMiddleware.js";

export const createPrescription = errorHandleMiddleware(async (req, res, next) => {
  const { titulo, medicamentos, indicaciones, pacienteId } = req.body;
  if (!titulo || !medicamentos || !pacienteId) {
    return next(new ErrorHandler("Datos insuficientes", 400));
  }
  const doctorId = req.user._id;
  const prescription = await Prescription.create({
    titulo,
    medicamentos,
    indicaciones,
    pacienteId,
    doctorId,
  });
  res.status(201).json({ success: true, prescription });
});

export const getPatientPrescriptions = errorHandleMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const prescriptions = await Prescription.find({ pacienteId: id }).sort({ fecha: -1 });
  res.status(200).json({ success: true, prescriptions });
});
