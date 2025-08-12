import Estudiante from "../models/estudiante.js"
import { sendMailToRegister, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"
import cloudinary from "cloudinary";
import fs from "fs-extra";

const registroEstudiante = async (req, res) => {
  const { emailEstudiante, password } = req.body;
  if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Todos los campos son obligatorios." });
  const verificarEmailBDD = await Estudiante.findOne({ emailEstudiante });
  if (verificarEmailBDD) return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
  const nuevoestudiante = new Estudiante(req.body);
  nuevoestudiante.password = await nuevoestudiante.encrypPassword(password);
  const token = nuevoestudiante.crearToken();
  await sendMailToRegister(emailEstudiante, token);
  await nuevoestudiante.save();
  res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });
}

const confirmarMailEstudiante = async (req, res) => {
  if (!(req.params.token)) return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta" });
  const estudianteBDD = await Estudiante.findOne({ token: req.params.token });
  if (!estudianteBDD?.token) return res.status(404).json({ msg: "La cuenta ya ha sido confirmada" });
  estudianteBDD.token = null;
  estudianteBDD.confirmEmail = true;
  await estudianteBDD.save();
  res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" });
}

const recuperarPasswordEstudiante = async (req, res) => {
  const { email } = req.body;
  if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Todos los campos deben ser llenados obligatoriamente." });

  const estudianteBDD = await Estudiante.findOne({ email });
  if (!estudianteBDD) return res.status(404).json({ msg: "Lo sentimos, el usuario no existe" });

  const token = estudianteBDD.crearToken();
  estudianteBDD.token = token;

  await sendMailToRecoveryPassword(email, token);
  await estudianteBDD.save();

  res.status(200).json({ msg: "Revisa tu correo electrónico para restablecer tu contraseña." });
}

const comprobarTokenPasswordEstudiante = async (req, res) => {
  const { token } = req.params;
  const estudianteBDD = await Estudiante.findOne({ token });

  if (!estudianteBDD) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" });

  res.status(200).json({ msg: "Token confirmado ya puedes crear tu password" });
}

const crearNuevoPasswordEstudiante = async (req, res) => {
  const { password, confirmpassword } = req.body;

  if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos debes llenar todos los campos" });

  if (password !== confirmpassword) return res.status(404).json({ msg: "Lo sentimos, los passwords no coinciden" });

  const estudianteBDD = await Estudiante.findOne({ token: req.params.token });

  if (!estudianteBDD) return res.status(404).json({ msg: "Lo sentimos no se puede validar su cuenta" });

  if (estudianteBDD.token !== req.params.token) return res.status(404).json({ msg: "Lo sentimos no se puede validar su cuenta" });

  estudianteBDD.token = null;
  estudianteBDD.password = await estudianteBDD.encrypPassword(password);
  await estudianteBDD.save();

  res.status(200).json({ msg: "Ya puede iniciar sesion con su nueva contraseña." });
}

const loginEstudiante = async (req, res) => {
  const { emailEstudiante, password } = req.body;

  if (Object.values(req.body).includes("")) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios." });
  }

  const estudianteBDD = await Estudiante.findOne({ emailEstudiante }).select("-status -__v -token -createdAt -updateAt");
  //console.log("Estudiante encontrado:", estudianteBDD);

  // Validar que el email del estudiante exista en la base de datos
  if (!estudianteBDD) {
    return res.status(404).json({ msg: "Lo sentimos, el usuario no existe." });
  }

  // Validar que el usuario haya confirmado su correo
  if (estudianteBDD.confirmEmail === false) {
    return res.status(401).json({ msg: "Debe confirmar su cuenta antes de iniciar sesión." });
  }

  //Validar que la contraseña del usuario sea la misma de la BDD  
  const verificarPassword = await estudianteBDD.matchPassword(password);
  if (!verificarPassword) {
    return res.status(401).json({ msg: "Lo sentimos, la contraseña es incorrecta." });
  }

  const { nombre, apellido, telefono, _id, rol } = estudianteBDD;
  const token = crearTokenJWT(_id, rol);

  res.status(200).json({
    token,
    rol,
    nombre,
    apellido,
    telefono,
    _id,
    emailEstudiante,
	fotoPerfil
  });
};

//Metodo para que el estudiante pueda ver su perfil
const perfilEstudiante =(req,res)=>{
	const {token,confirmEmail,createdAt,updatedAt,__v,...datosPerfil} = req.estudianteBDD
    res.status(200).json(datosPerfil);
}

const actualizarPerfilEstudiante = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ msg: "Lo sentimos, debe ser un id válido" });
  }

  const estudianteBDD = await Estudiante.findById(id);
  if (!estudianteBDD) {
    return res.status(404).json({ msg: `No existe el estudiante ${id}` });
  }

  // Subir imagen si se envía
  if (req.files?.imagen) {
    if (estudianteBDD.fotoPerfilID) {
      await cloudinary.uploader.destroy(estudianteBDD.fotoPerfilID);
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.imagen.tempFilePath,
      { folder: "Estudiantes" }
    );

    estudianteBDD.fotoPerfil = secure_url;
    estudianteBDD.fotoPerfilID = public_id;

    await fs.unlink(req.files.imagen.tempFilePath);
  } else {
    return res.status(400).json({ msg: "No se envió ninguna imagen" });
  }

  await estudianteBDD.save();

  res.status(200).json({
    msg: "Foto actualizada con éxito",
    estudiante: estudianteBDD
  });
};

const actualizarPasswordEstudiante = async (req,res)=>{
    const estudianteBDD = await Estudiante.findById(req.estudianteBDD._id)
    if(!estudianteBDD) return res.status(404).json({msg:`Lo sentimos, no existe el estudiante ${id}`})
    const verificarPassword = await estudianteBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
    estudianteBDD.password = await estudianteBDD.encrypPassword(req.body.passwordnuevo)
    await estudianteBDD.save()
    res.status(200).json({msg:"Password actualizado correctamente"})
}

//Funcion para cargar imagenes generadas con inteligencia artificial 

/*if (req.body?.avatarDocenteIA) {
      const base64Data = req.body.avatarDocenteIA.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const secure_url = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "Docentes", resource_type: "auto" },
          (error, response) => {
            if (error) reject(error);
            else resolve(response.secure_url);
          }
        );
        stream.end(buffer);
      });
      nuevoDocente.avatarDocenteIA = secure_url;
    }*/

export {
    registroEstudiante,
    confirmarMailEstudiante,
    recuperarPasswordEstudiante,
    comprobarTokenPasswordEstudiante,
    crearNuevoPasswordEstudiante,
    loginEstudiante,
    perfilEstudiante,
    actualizarPerfilEstudiante,
    actualizarPasswordEstudiante
}


