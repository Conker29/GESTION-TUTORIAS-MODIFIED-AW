import storeAuth from '../context/storeAuth';
import { Forbidden } from '../pages/Forbidden';

// eslint-disable-next-line react/prop-types
export default function PrivateRouteWithRole({ children }) {
  const { rol } = storeAuth();
  const rolesPermitidos = ["Docente", "Administrador"];

  return rolesPermitidos.includes(rol) ? children : <Forbidden />;
}
