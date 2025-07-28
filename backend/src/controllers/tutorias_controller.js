import Tutoria from '../models/tutorias.js';
import { Stripe } from "stripe"
const stripe = new Stripe(`${process.env.STRIPE_PRIVATE_KEY}`)

// Crear una nueva tutoría
const registrarTutoria = async (req, res) => {
  try {
    const { emailEstudiante, emailDocente, fecha, hora } = req.body;

    // Verificar si ya existe una tutoría para ese docente en la misma fecha y hora
    const existe = await Tutoria.findOne({ docente: emailDocente, fecha, hora });

    if (existe) {
      return res.status(400).json({ msg: "Este horario se encuentra ocupado o no disponible" });
    }

    const nuevaTutoria = new Tutoria({ estudiante: emailEstudiante, docente: emailDocente, fecha, hora });
    await nuevaTutoria.save();

    res.status(201).json(nuevaTutoria);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear tutoría.', error });
  }
};

// Obtener todas las tutorías
const listarTutorias = async (req, res) => {
  try {
    const tutorias = await Tutoria.find()
      .populate('estudiante', 'nombre')
      .populate('docente', 'nombre');

    res.json(tutorias);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al momento de listar las tutorias.', error });
  }
};

// Actualizar una tutoría
const actualizarTutoria = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    const tutoria = await Tutoria.findByIdAndUpdate(id, datosActualizados, { new: true });

    if (!tutoria) return res.status(404).json({ mensaje: 'Tutoría no encontrada.' });

    res.json(tutoria);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar tutoría.', error });
  }
};

// Eliminar una tutoría
const eliminarTutoria = async (req, res) => {
  try {
    const { id } = req.params;
    const tutoria = await Tutoria.findByIdAndDelete(id);

    if (!tutoria) return res.status(404).json({ mensaje: 'Tutoría no encontrada.' });

    res.json({ mensaje: 'Tutoría eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar tutoría.', error });
  }
}

const pagarTutoriaPremium = async (req, res) => {

    const { paymentMethodId, tutoriaId, cantidad, motivo } = req.body


    try {

        const tutoriaP = await tutoriaP.findById(tutoriaId).populate('estudiante')
        if (!tutoriaP) return res.status(404).json({ message: "Tutoria no registrada" })
        if (tutoriaP.estadoPago === "Pagado") return res.status(400).json({ message: "Tu tutoria premium ya fue cancelada" })
        if (!paymentMethodId) return res.status(400).json({ message: "paymentMethodId no proporcionado" })

        let [cliente] = (await stripe.customers.list({ email:tutoriaP.emailEstudiante, limit: 1 })).data || [];
        
        if (!cliente) {
            cliente = await stripe.customers.create({ name:tutoriaP.nombreEstudiante, email:tutoriaP.emailEstudiante });
        }
        

        const payment = await stripe.paymentIntents.create({
            amount:cantidad,
            currency: "USD",
            description: motivo,
            payment_method: paymentMethodId,
            confirm: true,
            customer: cliente.id,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never"
            }
        })

        if (payment.status === "succeeded") {
            await tutoriaP.findByIdAndUpdate(tutoriaId, { estadoPago: "Pagado" });
            return res.status(200).json({ msg: "El pago se realizó exitosamente" })
        }
    } catch (error) {
        res.status(500).json({ msg: "Error al intentar pagar la tutoria premium", error });
    }
}

export{
  registrarTutoria,
  listarTutorias,
  actualizarTutoria,
  eliminarTutoria,
  pagarTutoriaPremium
}
