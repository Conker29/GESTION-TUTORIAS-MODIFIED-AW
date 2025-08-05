import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
});

const sendMailToRegister = (userMail, token) => {

    let mailOptions = {
        from: 'tutorias.esfot@gmail.com',
        to: userMail,
        subject: "Confirmación de cuenta para acceder a la plataforma de tutorías",
        html: `
        <div style="font-family: Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; text-align: center;">
        <h2 style="color: #81180aff; font-weight: bold;">¡Bienvenido/a!</h2>
        <p style="font-size: 16px; color: #333;">Para tener acceso a la plataforma y agendar una cita con el docente de tu preferencia, haz clic en el siguiente botón para activar tu cuenta.</p>
        <a href="${process.env.URL_FRONTEND}confirmar/${token}" style="display: inline-block; padding: 12px 24px; margin: 20px 0; font-family: Verdana; font-size: 16px; font-weight: bold; color: #ffffff; background-color: #791515ff; text-decoration: none; border-radius: 10px;">Activar Cuenta</a>
        <p style="font-size: 14px; color: #777;">Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
        <p style="font-size: 12px; color: #1b1a1aff; word-break: break-all;">${process.env.URL_FRONTEND}confirmar/${token}</p>
        <hr style="border: 0; border-top: 1px solid #424040ff; margin: 20px 0;">
        <footer style="font-size: 12px; color: #999;">
        <p>&copy; 2025 ESFOT Tutorías. Todos los derechos reservados.</p>
        </footer>
        </div>
        `
        }

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else {
        console.log("Mensaje enviado al correo destinado");
    }
    })
    }

const sendMailToRecoveryPassword = async(userMail,token)=>{
    let info = await transporter.sendMail({
    from: 'tutorias.esfot@gmail.com',
    to: userMail,
    subject: "Correo para restablecer tu contraseña",
    html: `
    <h1>PLATAFORMA DE GESTION DE TUTORIAS😎</h1>
    <hr>
    <a href=${process.env.URL_FRONTEND}reset/${token}>Haz clic para reestablecer tu contraseña</a>
    <hr>
    <footer>2025 - TUTORIAS ESFOT - Todos los derechos reservados.</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

//Enviar correo de confirmacion de cuenta a los docentes
const sendMailToOwner = async(userMail,password)=>{
    let info = await transporter.sendMail({
    from: 'tutorias.esfot@gmail.com',
    to: userMail,
    subject: "Registro del docente en la plataforma",
    html: `
    <h1>Tutorias ESFOT</h1>
    <hr>
    <p>La plataforma le da la más cordial bienvenida a la plataforma. Sus credenciales otorgadas son las siguientes:</p>
    <p>Correo electrónico: ${userMail}</p>
    <p>Contraseña de acceso: ${password}</p>
    <a href=${process.env.URL_FRONTEND}login>Haz clic en el siguiente enlace para iniciar sesión</a>
    <hr>
    <footer>2025 - TUTORIAS ESFOT - Todos los derechos reservados.</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

//Enviar correo de confirmacion de cuenta a los docentes
const sendMailToOwner = async(userMail,password)=>{
    let info = await transporter.sendMail({
    from: 'tutorias.esfot@gmail.com',
    to: userMail,
    subject: "Registro del docente en la plataforma",
    html: `
    <h1>Tutorias ESFOT</h1>
    <hr>
    <p>La plataforma le da la más cordial bienvenida a la plataforma. Sus credenciales otorgadas son las siguientes:</p>
    <p>Correo electrónico: ${userMail}</p>
    <p>Contraseña de acceso: ${password}</p>
    <a href=${process.env.URL_FRONTEND}login>Haz clic en el siguiente enlace para iniciar sesión</a>
    <hr>
    <footer>2025 - TUTORIAS ESFOT - Todos los derechos reservados.</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

const sendMailWithCredentials = async (email, nombreAdministrador, password) => {
  try {
    let mailOptions = {
      from: 'Equipo de Desarrollo <no-reply@gmail.com>',
      to: email,
      subject: "Credenciales de acceso a la plataforma de tutorías",
      html: `
      <div style="font-family: Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; text-align: center;">
        <h2 style="color: #81180aff; font-weight: bold;">¡Bienvenido/a, ${nombreAdministrador}!</h2>
        <p style="font-size: 16px; color: #333;">Tus credenciales para acceder a tu perfil de administrador en la plataforma son las siguientes:</p>
        <p><strong>Correo electrónico:</strong> ${email}</p>
        <p><strong>Contraseña:</strong> ${password}</p>
        <p>Por favor, cambia tu contraseña en tu primer inicio de sesión para mayor seguridad.</p>
        <hr style="border: 0; border-top: 1px solid #424040ff; margin: 20px 0;">
        <footer style="font-size: 12px; color: #999;">
          <p>&copy; 2025 ESFOT Tutorías. Todos los derechos reservados.</p>
        </footer>
      </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);

  } catch (error) {
    console.log("Error enviando correo con credenciales:", error);
  }
}

export {
    sendMailToRegister,
    sendMailToRecoveryPassword,
    sendMailToOwner,
    sendMailWithCredentials
}

