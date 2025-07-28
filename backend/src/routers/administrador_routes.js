import {Router} from 'express'
import {
        recuperarPasswordAdministrador, 
        comprobarTokenPasswordAdministrador, 
        crearNuevoPasswordAdministrador, 
        loginAdministrador, 
        perfilAdministrador, 
        actualizarPerfilAdministrador, 
        actualizarPasswordAdministrador} from '../controllers/administrador_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

const routerAdministrador = Router()

//Rutas públicas

//routerAdministrador.get('/confirmar/:token', confirmarMailAdministrador)

routerAdministrador.post('/recuperarpassword', recuperarPasswordAdministrador)

routerAdministrador.get('/recuperarpassword/:token', comprobarTokenPasswordAdministrador)

routerAdministrador.post('/nuevopassword/:token',crearNuevoPasswordAdministrador)

routerAdministrador.post ('/login',loginAdministrador)

//Rutas privadas
routerAdministrador.get('/perfil',verificarTokenJWT,perfilAdministrador)

routerAdministrador.put('/administrador/:id',verificarTokenJWT,actualizarPerfilAdministrador)

routerAdministrador.put('/administrador/actualizarpassword/:id',verificarTokenJWT,actualizarPasswordAdministrador)

export default routerAdministrador