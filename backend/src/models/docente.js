import mongoose, {Schema,model} from 'mongoose'
import bcrypt from "bcryptjs"

const docenteSchema = new Schema({
    cedulaDocente:{
        type:String,
        required:true,
        trim:true,
        unique: true
    },
    nombreDocente:{
        type:String,
        required:true,
        trim:true
    },
    fechaNacimientoDocente:{
        type:Date,
        required:true,
        trim:true
    },
    oficinaDocente: {
        type: String,
        required: true,
        trim: true
    },
    emailDocente:{
        type:String,
        required:true,
        trim:true,
        unique: true
    },
    emailAlternativoDocente: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    passwordDocente:{
        type:String,
        required:true
    },
    celularDocente:{
        type:String,
        required:true,
        trim:true
    },
    avatarDocente:{
        type:String,
        default: "https://cdn-icons-png.flaticon.com/512/4715/4715329.png",
        trim:true
    },
    avatarDocenteID:{
        type:String,
        trim:true
    },
    fechaIngresoDocente:{
        type:Date,
        required:true,
        trim:true,
        default:Date.now
    },
    salidaDocente: {
        type: Date,
        trim: true,
        default: null
    },
    semestreAsignado: {
        type: String,
        enum: ['Nivelacion', 'Primer Semestre'],
        required: true
    },
    asignaturas: {
        type: [String],
        required: true
    },
    confirmEmail: {
    type: Boolean,
    default: false,
    },
    token: {
    type: String,
    default: null
    },
    estadoDocente:{
        type:Boolean,
        default:true
    },
    rol:{
        type:String,
        default:"Docente"
    },
    administrador:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Administrador'
    }
},{
    timestamps:true
})


// Método para cifrar el password del Docente
docenteSchema.methods.encrypPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

// Método para verificar si el password ingresado es el mismo de la BDD
docenteSchema.methods.matchPassword = async function(password){
    return bcrypt.compare(password, this.passwordDocente)
}

export default model('Docente',docenteSchema)