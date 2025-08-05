import Administrador from "../models/administrador.js"
import {sendMailToRegister, sendMailToRecoveryPassword} from "../config/nodemailer.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose" 

/*const registroAdministrador = async (req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Todos los campos son obligatorios."})
    const verificarEmailBDD = await Administrador.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    const nuevoAdministrador = new Administrador(req.body)
    nuevoAdministrador.password = await nuevoAdministrador.encrypPassword(password)
    const token = nuevoAdministrador.crearToken()
    await sendMailToRegister(email,token)
    await nuevoAdministrador.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}

const confirmarMailAdministrador = async (req,res)=>{
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const administradorBDD = await Administrador.findOne({token:req.params.token})
    if(!administradorBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    administradorBDD.token = null
    administradorBDD.confirmEmail=true
    await administradorBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
}
*/

//Etapa 1
const registrarAdministrador = async () => {
    const admin = await Administrador.findOne({ email: "danna.lopez@epn.edu.ec" });

    if (!admin) {
        const nuevoAdmin = new Administrador({
            nombreAdministrador: "Danna",
            email: "danna.lopez@epn.edu.ec",
            password: await new Administrador().encrypPassword("dannamishelle23"),
            confirmEmail: true,
        });
        await nuevoAdmin.save();
        console.log("Administrador registrado con éxito.");
    } else {
        console.log("El administrador ya se encuentra registrado en la base de datos.");
    }
};

const recuperarPasswordAdministrador = async(req, res) => {
    //Primera validacion: Obtener el email 
    const {email} = req.body
    //2: Verificar que el correo electronico no este en blanco
    if (Object.values(req.body).includes("")) return res.status(404).json({msg: "Todos los campos deben ser llenados obligatoriamente."})

    //Verificar que exista el correo electronico en la base de datos
    const administradorBDD = await Administrador.findOne({email})

    if (!administradorBDD) return res.status(404).json({msg: "Lo sentimos, el usuario no existe"})
    //3
    const token = administradorBDD.crearToken()
    administradorBDD.token = token

    //Enviar email
    await sendMailToRecoveryPassword(email,token)
    await administradorBDD.save()
    //4
    res.status(200).json({msg: "Revisa tu correo electrónico para restablecer tu contraseña."})
}

//Etapa 2
const comprobarTokenPasswordAdministrador = async (req, res) => {
    //1
    const {token} = req.params
    //2
    const administradorBDD = await Administrador.findOne({token})
    if (administradorBDD.token !== token) return res.status (404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    //3
    await administradorBDD.save()
    //4
    res.status(200).json({msg:"Token confirmado ya puedes crear tu password"})
}

//Etapa 3
const crearNuevoPasswordAdministrador = async (req, res) => {
    //1
    const {password,confirmpassword} = req.body
    //2
    if (Object.values(req.body).includes("")) return res.status(404).json({msg: "Lo sentimos debes llenar todos los campos"})
    
    if (password!== confirmpassword) return res.status(404).json({msg: "Lo sentimos, los passwords no coinciden"})
    
    const administradorBDD = await Administrador.findOne({token:req.params.token})

    console.log(administradorBDD);
    

    if (administradorBDD.token !== req.params.token) return res.status(404).json({msg: "Lo sentimos no se puede validar su cuenta"})

    //3
    administradorBDD.token = null
    administradorBDD.password = await administradorBDD.encrypPassword(password)
    await administradorBDD.save()

    //4
    res.status(200).json({msg:"Ya puede iniciar sesion con su nueva contraseña."})
}

const loginAdministrador = async (req, res) => {
    //1
    const {email, password} = req.body
    //2
    if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Todos los campos son obligatorios."})
    
    const administradorBDD = await Administrador.findOne({email}).select("-status -__v -token -createdAt -updateAt")   //Quitar de la base de datos los siguientes campos
    
    //Verificar que el email del usuario exista en la base de datos.
    if(!administradorBDD) return res.status(404).json({msg: "Lo sentimos, el usuario no existe."})
    
    //Comparar que la contraseña proporcionada por el usuario sea la misma que está guardada en la BDD
    const verificarPassword = await administradorBDD.matchPassword(password)

    if (!verificarPassword) return res.status(401).json({msg: "Lo sentimos, la contraseña es incorrecta."})
    //3
    const{nombreAdministrador, _id, rol} = administradorBDD
    const token = crearTokenJWT(administradorBDD._id,administradorBDD.rol)

    //4: Enviar los siguientes campos al frontend
    res.status(200).json({
        token,
        rol,
        nombreAdministrador,
        _id,
        email: administradorBDD.email
    })
}

const perfilAdministrador =(req,res)=>{
		const {token,confirmEmail,createdAt,updatedAt,__v,...datosPerfil} = req.administradorBDD
    res.status(200).json(datosPerfil);
}

const actualizarPerfilAdministrador = async (req,res)=>{
    const {id} = req.params
    const {nombreAdministrador,email} = req.body
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"});
    const administradorBDD = await Administrador.findById(id)
    if(!administradorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el Administrador ${id}`})
    if (administradorBDD.email != email)
    {
        const administradorBDDMail = await Administrador.findOne({email})
        if (administradorBDDMail)
        {
            return res.status(404).json({msg:`Lo sentimos, el email existe ya se encuentra registrado`})  
        }
    }
        administradorBDD.nombreAdministrador = nombreAdministrador ?? administradorBDD.nombreAdministrador
        administradorBDD.email = email ?? administradorBDD.email
        await administradorBDD.save()
        console.log(administradorBDD)
        res.status(200).json(administradorBDD)
}

const actualizarPasswordAdministrador = async (req,res)=>{
    const administradorBDD = await Administrador.findById(req.administradorBDD._id)
    if(!administradorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el Administrador ${id}`})
    const verificarPassword = await administradorBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
    administradorBDD.password = await administradorBDD.encrypPassword(req.body.passwordnuevo)
    await administradorBDD.save()
    res.status(200).json({msg:"Password actualizado correctamente"})
}

export {
    registrarAdministrador, recuperarPasswordAdministrador,
    comprobarTokenPasswordAdministrador,
    crearNuevoPasswordAdministrador,
    loginAdministrador,
    perfilAdministrador,
    actualizarPerfilAdministrador,
    actualizarPasswordAdministrador
}
