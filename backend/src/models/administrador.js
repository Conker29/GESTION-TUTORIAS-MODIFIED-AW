/*import {Schema, model} from 'mongoose'
import bcrypt from 'bcryptjs'

const administradorSchema = new Schema({
    nombreAdministrador: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true,
    },
    token: {
        type: String,
        default: null,
    },
    confirmEmail: {
        type: Boolean,
        default: true,
    },
    rol: {
        type: String,
        default: "Administrador"
    }
}, {
    timestamps: true,
})

//Metodo para cifrar el password
administradorSchema.methods.encrypPassword = async function(password) {
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password, salt)
    return passwordEncryp
}

//Metodo para verificar si el password ingresado es el mismo en la BDD
administradorSchema.methods.matchPassword = async function(password) {
    const response = await bcrypt.compare(password, this.password)
    return response
}   

//Metodo para crear un token
administradorSchema.methods.crearToken = function() {
    const tokenGenerado = this.token = Math.random().toString(32).slice(2)
    return tokenGenerado
}

export default model('Administrador', administradorSchema)*/

//MODELO ADMINISTRADOR MODIFICADO PARA USAR AUTENTICACIÓN OAUTH

import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

const administradorSchema = new Schema({
  nombreAdministrador: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: function () {
      return !this.isOAuth; // solo requerido si no es OAuth
    }
  },
  status: {
    type: Boolean,
    default: true
  },
  token: {
    type: String,
    default: null
  },
  confirmEmail: {
    type: Boolean,
    default: true
  },
  rol: {
    type: String,
    default: "Administrador"
  },
  // Nuevos campos añadidos para la autenticación OAuth
  isOAuth: {
    type: Boolean,
    default: false
  },
  oauthProvider: {
    type: String,
    enum: ["google", "microsoft", null],
    default: null
  }
}, {
  timestamps: true
})

// Metodo para cifrar el password si no es OAuth
administradorSchema.methods.encrypPassword = async function(password) {
  const salt = await bcrypt.genSalt(10)
  const passwordEncryp = await bcrypt.hash(password, salt)
  return passwordEncryp
}

// Metodo para comparar contraseñas si no es OAuth
administradorSchema.methods.matchPassword = async function(password) {
  const response = await bcrypt.compare(password, this.password)
  return response
}

// Metodo para crear un token único 
administradorSchema.methods.crearToken = function() {
  const tokenGenerado = this.token = Math.random().toString(32).slice(2)
  return tokenGenerado
}

export default model('Administrador', administradorSchema)
