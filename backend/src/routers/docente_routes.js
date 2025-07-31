import { Router } from 'express'
import { 
  registrarDocente, 
  listarDocentes, 
  detalleDocente,
  eliminarDocente, 
  actualizarDocente, 
  loginDocente, 
  perfilDocente, 
} from '../controllers/docente_controller.js'
import { loginOAuthDocente } from "../controllers/sesion_google_correo_controller.js"; // Nueva importación del controlador para OAuth
import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()

// --- Login del docente ---
router.post('/docente/login', loginDocente)
router.post('/docente/login-oauth', loginOAuthDocente) // Nueva ruta para el inicio/registro con Google/Microsoft
router.get('/docente/perfil', verificarTokenJWT, perfilDocente)

// --- Registro y administración por el administrador ---
router.post("/docente/registro", verificarTokenJWT, registrarDocente)
router.get("/docentes", verificarTokenJWT, listarDocentes)
router.get("/docente/:id", verificarTokenJWT, detalleDocente)
router.delete("/docente/eliminar/:id", verificarTokenJWT, eliminarDocente)
router.put("/docente/actualizar/:id", verificarTokenJWT, actualizarDocente)

export default router
