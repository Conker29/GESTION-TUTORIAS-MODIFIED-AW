import storeProfile from "../../context/storeProfile";

const CardProfileEstudiante = () => {
  const { user } = storeProfile();

  return (
    <div className="bg-white border border-slate-200 h-auto p-4 
                    flex flex-col items-center justify-between shadow-xl rounded-lg">

      <div>
        <img
          src={user.fotoPerfil || "https://marketup.com/wp-content/themes/marketup/assets/icons/perfil-vazio.jpg"}
          alt="Foto del estudiante"
          className="m-auto rounded-full border border-gray-300"
          width={120}
          height={120}
        />
      </div>

      <div className="self-start mt-4">
        <b>Nombre:</b>
        <p className="inline-block ml-3">{user.nombreEstudiante}</p>
      </div>
      <div className="self-start">
        <b>Celular:</b>
        <p className="inline-block ml-3">{user.telefono}</p>
      </div>
      <div className="self-start">
        <b>Email:</b>
        <p className="inline-block ml-3">{user.emailEstudiante}</p>
      </div>
    </div>
  );
};

export default CardProfileEstudiante;