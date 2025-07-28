import mongoose, {Schema,model} from 'mongoose'

const tutoriaSchema = new mongoose.Schema({
  estudiante: { type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante', required: true },
  docente: { type: mongoose.Schema.Types.ObjectId, ref: 'Docente', required: true },
  fecha: { type: String, required: true },
  hora: { type: String, required: true }
});

export default model('Tutoria', tutoriaSchema);
