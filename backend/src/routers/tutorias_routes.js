import {Router} from 'express'
import {
  registrarTutoria,
  actualizarTutoria,
  eliminarTutoria,
  listarTutorias,
  pagarTutoriaPremium
} from '../controllers/tutorias_controller.js';
import { verificarTokenJWT } from '../middlewares/JWT.js'


const routerTutorias = Router();

routerTutorias.post('/tutoria/registro', registrarTutoria);
routerTutorias.get('/tutorias', listarTutorias);
routerTutorias.put('/tutoria/actualizar/:id', actualizarTutoria);
routerTutorias.delete('/tutoria/eliminar:id', eliminarTutoria);
routerTutorias.post('/tratamiento/pago',verificarTokenJWT,pagarTutoriaPremium)

export default routerTutorias;
