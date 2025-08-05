import Tutoria from '../models/tutorias.js';
import disponibilidadDocente from '../models/disponibilidadDocente.js';

// Registrar una nueva tutoría
const registrarTutoria = async (req, res) => {
  try {
    const { docente, fecha, horaInicio, horaFin } = req.body;
    //Obtener el ID del estudiante 
    const estudiante = req.estudianteBDD?._id;

    if (!estudiante) {
      return res.status(401).json({ msg: "Estudiante no autenticado" });
    }

    // 1. Verificar si ya existe una tutoría ocupando ese espacio
    const existe = await Tutoria.findOne({
      docente,
      fecha,
      horaInicio,
      horaFin,
      estado: { $in: ['pendiente', 'confirmada'] }
    });

    if (existe) {
      return res.status(400).json({ msg: "Este horario no se encuentra disponible. Elija otro." });
    }

    // 2. Validar que el bloque esté en la disponibilidad del docente
    const fechaUTC = new Date(fecha + 'T05:00:00Z');   //Forzar la zona horaria a Ecuador
    const diaSemana = fechaUTC.toLocaleDateString('es-EC', { weekday: 'long' }).toLowerCase();
    const disponibilidad = await disponibilidadDocente.findOne({ docente, diaSemana });
    if (!disponibilidad) {
      return res.status(400).json({ msg: "El docente no tiene disponibilidad registrada para ese día." });
    }

    //Buscar el bloque especifico en el array de bloques disponibles
    const bloqueValido = disponibilidad.bloques.some(
      b => b.horaInicio === horaInicio && b.horaFin === horaFin
    );

    if (!bloqueValido) {
      return res.status(400).json({ msg: "Ese bloque no está dentro del horario disponible del docente." });
    }

    // 3. Registrar la tutoría si todo es válido
    const nuevaTutoria = new Tutoria({
      estudiante,
      docente,
      fecha,
      horaInicio,
      horaFin,
      estado: 'pendiente' // por defecto
    });

    await nuevaTutoria.save();

    // Eliminar los campos innecesarios para la respuesta
    const { motivoCancelacion, observacionesDocente, _id, __v, ...tutoria} = nuevaTutoria.toObject();

    res.status(201).json({msg:"Tutoria registrada con éxito!", nuevaTutoria: tutoria});

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear tutoría.', error });
  }
};

// Listar todas las tutorías
const listarTutorias = async (req, res) => {
  try {
    let filtro = {};

    //Filtrado por rol
    if (req.docenteBDD) {
      filtro.docente = req.docenteBDD._id;
    } else if (req.estudianteBDD) {
      filtro.estudiante = req.estudianteBDD._id;
    } // Si es admin, ve todo 

    // Filtros opcionales por query
    const { fecha, estado } = req.query;

    if (fecha) {
      filtro.fecha = fecha; 
    }

    if (estado) {
      filtro.estado = estado; 
    }

    const tutorias = await Tutoria.find(filtro)
      .populate('estudiante', 'nombre')
      .populate('docente', 'nombre');

    res.json(tutorias);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar tutorías.', error });
  }
};

const actualizarTutoria = async (req, res) => {
  try {
    const { id } = req.params;
    const tutoria = await Tutoria.findById(id);

    if (!tutoria) return res.status(404).json({ msg: 'Tutoría no encontrada.' });

    if (['cancelada_por_estudiante', 'cancelada_por_docente'].includes(tutoria.estado)) {
      return res.status(400).json({ msg: 'No se puede modificar una tutoría cancelada.' });
    }

    // Validar que el usuario autenticado modifica la tutoria
    if (!req.estudianteBDD || tutoria.estudiante.toString() !== req.estudianteBDD._id.toString()) {
      return res.status(403).json({ msg: 'No autorizado para modificar esta tutoría.' });
    }

    Object.assign(tutoria, req.body); //Actualiza los campos recibidos
    await tutoria.save();

    res.json(tutoria);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar tutoría.', error });
  }
};

//Cancelar una tutoría por estudiante o docente
const cancelarTutoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo, canceladaPor } = req.body;

    const tutoria = await Tutoria.findById(id);
    if (!tutoria) return res.status(404).json({ msg: 'Tutoría no encontrada.' });

    const hoy = new Date();
    const fechaTutoria = new Date(tutoria.fecha);

    if (fechaTutoria < hoy) {
      return res.status(400).json({ msg: 'No puedes cancelar una tutoría anterior.' });
    }

    tutoria.estado = canceladaPor === 'Estudiante'
      ? 'cancelada_por_estudiante'
      : 'cancelada_por_docente';

    tutoria.motivoCancelacion = motivo;
    tutoria.asistenciaEstudiante = null;
    tutoria.observacionesDocente = null;

    await tutoria.save();

    res.json({ msg: 'Tutoría cancelada correctamente.', tutoria });

  } catch (error) {
    res.status(500).json({ msg: 'Error al cancelar la tutoría.', error });
  }
};

// Registrar asistencia (solo si no está cancelada)
const registrarAsistencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { asistio, observaciones } = req.body;

    const tutoria = await Tutoria.findById(id);
    if (!tutoria) return res.status(404).json({ msg: 'Tutoría no encontrada.' });

    //Validar que la tutoría no esté cancelada
    if (['cancelada_por_estudiante', 'cancelada_por_docente'].includes(tutoria.estado)) {
      return res.status(400).json({ msg: 'No se puede registrar asistencia en una tutoría cancelada.' });
    }

    // Validar que no se haya registrado ya
    if (tutoria.asistenciaEstudiante !== null) {
      return res.status(400).json({ msg: 'La asistencia ya fue registrada.' });
    }

    tutoria.asistenciaEstudiante = asistio;
    tutoria.observacionesDocente = observaciones || null;
    tutoria.estado = 'finalizada';

    await tutoria.save();

    res.json({ msg: 'Asistencia registrada exitosamente.', tutoria });
  } catch (error) {
    res.status(500).json({ msg: 'Error al registrar asistencia.', error });
  }
};

// Funcion para que el docente registre/actualice su disponibilidad semanal
const registrarDisponibilidadDocente = async (req, res) => {
  try {
    const { diaSemana, bloques } = req.body;
    const docente = req.docenteBDD?._id;
    if (!docente) return res.status(401).json({ msg: "Docente no autenticado" });
    // Validar que el docente y día exista o no
    let disponibilidad = await disponibilidadDocente.findOne({ docente, diaSemana });

    if (disponibilidad) {
      // Actualiza bloques
      disponibilidad.bloques = bloques;
    } else {
      // Crea nuevo documento
      disponibilidad = new disponibilidadDocente({ docente, diaSemana, bloques });
    }

    await disponibilidad.save();
    res.status(200).json({ msg: "Su horario se actualizó con éxito.", disponibilidad });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar disponibilidad", error });
  }
};

const verDisponibilidadDocente = async (req, res) => {
  try {
    const { docenteId } = req.params;

    // Buscar TODA la disponibilidad semanal del docente
    const disponibilidad = await disponibilidadDocente.find({ docente: docenteId });

    if (!disponibilidad || disponibilidad.length === 0) {
      return res.status(404).json({ msg: "El docente no tiene disponibilidad registrada." });
    }

    res.status(200).json({ disponibilidad });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener la disponibilidad.", error });
  }
};

export {
  registrarTutoria,
  listarTutorias,
  actualizarTutoria,
  cancelarTutoria,
  registrarAsistencia,
  registrarDisponibilidadDocente,
  verDisponibilidadDocente,
};