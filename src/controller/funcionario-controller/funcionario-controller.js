import { funcionario } from "../../models/funcionario-models/funcionario-models.js";
import bcryptjs from "bcryptjs";
import jwt from "./token.js";
import nodemailer from "nodemailer"

export const get_funcionario = async (req, res) => {
  try {
    const nuevo_funcionario = await funcionario.findAll();
    res
      .status(200)
      .json({ succes: true, message: "lista de los funcionarios ", nuevo_funcionario });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const get_funcionario_id = async (req, res) => {
  const { funcionario_id } = req.params;
  try {
    const nuevo_funcionario = await funcionario.findOne({
      where: { funcionario_id },
    });
    res.status(200).json({ message: "Funcionario obtenido por id", nuevo_funcionario });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const create_funcionario = async (req, res) => {

  try {
    const {
      funcionario_iden,
      funcionario_nombre,
      funcionario_apellido,
      funcionario_correo,
      funcionario_telefono,
      funcionario_admin,
      funcionario_contrasena,
      
    } = req.body;
    console.log(req.body)

    const hashedPassword = await bcryptjs.hash(funcionario_contrasena, 10);

    const nuevo_funcionario = await funcionario.create({
      funcionario_iden,
      funcionario_nombre,
      funcionario_apellido,
      funcionario_correo,
      funcionario_telefono,
      funcionario_admin,
      funcionario_contrasena: hashedPassword
    })

    res.json(nuevo_funcionario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const update_funcionario_id = async (req, res) => {

  try {
    const { funcionario_id } = req.params;
    const { funcionario_iden,
      funcionario_nombre,
      funcionario_apellido,
      funcionario_correo,
      funcionario_telefono,
      funcionario_contrasena,
      funcionario_admin
    
    } = req.body
      const hashedPassword = await bcryptjs.hash(funcionario_contrasena, 10);

    
    const funcionarios = await funcionario.findByPk(funcionario_id)
    funcionarios.funcionario_nombre = funcionario_nombre,
      funcionarios.funcionario_apellido = funcionario_apellido,
      funcionarios.funcionario_correo = funcionario_correo,
      funcionarios.funcionario_telefono = funcionario_telefono,
      funcionarios.funcionario_iden = funcionario_iden,
      funcionarios.funcionario_contrasena = hashedPassword
    funcionarios.funcionario_admin = funcionario_admin

    await funcionarios.save();

    res.status(200).json({ message: "se ha actualizado la información del Funcionario", funcionarios })
  }

  catch (error) {
    return res.status(500).json({ message: error.message })

  }
}

//  }


//} 
export const delete_funcionario_id = async (req, res) => {

  try {
    const { funcionario_id } = req.params
    const resultado = await funcionario.destroy({
      where: { funcionario_id }
    })
    res.status(200).json({ message: 'Funcionario eliminado satisfactoriamente', resultado })


  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}


export const login = async (req, res) => {
  try {
    const { funcionario_iden, funcionario_contrasena } = req.body
    const usuario = await funcionario.findOne({
      where: { funcionario_iden: funcionario_iden }
    })

    const admin = usuario.funcionario_admin
    console.log(usuario);

    const contrasena_correcta = usuario === null ? false : await bcryptjs.compare(funcionario_contrasena, usuario.funcionario_contrasena)
    if (!(funcionario_iden && contrasena_correcta)) {
      // console.log("entro al if");

      res.status(401).json({
        error: 'Identificacion y/o Contraseña Incorrecta'
      })
 
    } else if ((funcionario_iden && contrasena_correcta) && !admin) {

      res.status(401).json({
        error: 'No tienes permiso para ingresar'
      })



    } else {
      // console.log("entro al else");
      const jsontoken = new jwt()
      const usuariotoken = {
        id: usuario.funcionario_id,
        identificacion: usuario.funcionario_iden,
        hashedPassword: usuario.funcionario_contrasena
      }
      console.log({ usuariotoken });
      const token = jsontoken.sing(usuariotoken)
      res.status(200).json({
        usuariotoken: usuariotoken,
        token: token
      })

    }


  } catch (error) {
    res.status(401).json({
      error: 'Usuario no Registrado'
    })

  }

  //   res.status(500).json(error);
}


function generarcodigo() {
  let codigo = "";
  const caracteres = "0123456789";
  const caracteresLength = caracteres.length;
  const longitud = 4; // Longitud deseada para el código generado

  for (let i = 0; i < longitud; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteresLength));


  }
  console.log(codigo);

  return codigo
}

export const recuperar_contrasena = async (req, res) => {

  const { funcionario_correo } = req.body


  const codigo_aleatorio = generarcodigo(4);
  const puerto_smtp = 587; // Ejemplo de valor de puerto SMTP


  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'tusenactpi@gmail.com',
      pass: 'tbdnapumanklnzxf'
    },

  })
  const correoVerificar = req.body.funcionario_correo
  const verificacion = await funcionario.findOne({
    where: { funcionario_correo: correoVerificar }
  })



  const mensaje = {
    from: 'tusenactpi@gmail.com',
    to: funcionario_correo, // Email del destinatario obtenido desde la solicitud
    subject: 'Restablecer Contraseña',
    text: ``,
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title></title>
        <!--[if (mso 16)]>
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]-->
        <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
        <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG></o:AllowPNG>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <style>
    
    
    /* CONFIG STYLES Please do not delete and edit CSS styles below */
    /* IMPORTANT THIS STYLES MUST BE ON FINAL EMAIL */
    #outlook a {
        padding: 0;
    }
    
    .ExternalClass {
        width: 100%;
    }
    
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
        line-height: 100%;
    }
    
    .es-button {
        mso-style-priority: 100 !important;
        text-decoration: none !important;
    }
    
    a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
    }
    
    .es-desk-hidden {
        display: none;
        float: left;
        overflow: hidden;
        width: 0;
        max-height: 0;
        line-height: 0;
        mso-hide: all;
    }
    
    .es-button-border:hover a.es-button,
    .es-button-border:hover button.es-button {
        background: #ffffff !important;
    }
    
    .es-button-border:hover {
        background: #ffffff !important;
        border-style: solid solid solid solid !important;
        border-color: #3d5ca3 #3d5ca3 #3d5ca3 #3d5ca3 !important;
    }
    
    /*
    END OF IMPORTANT
    */
    s {
        text-decoration: line-through;
    }
    
    html,
    body {
        width: 100%;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
    }
    
    body {
        font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif;
    }
    
    table {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        border-collapse: collapse;
        border-spacing: 0px;
    }
    
    table td,
    html,
    body,
    .es-wrapper {
        padding: 0;
        Margin: 0;
    }
    
    .es-content,
    .es-header,
    .es-footer {
        table-layout: fixed !important;
        width: 100%;
    }
    
    img {
        display: block;
        border: 0;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
    }
    
    table tr {
        border-collapse: collapse;
    }
    
    p,
    hr {
        Margin: 0;
    }
    
    h1,
    h2,
    h3,
    h4,
    h5 {
        Margin: 0;
        line-height: 120%;
        mso-line-height-rule: exactly;
        font-family: arial, 'helvetica neue', helvetica, sans-serif;
    }
    
    p,
    ul li,
    ol li,
    a {
        -webkit-text-size-adjust: none;
        -ms-text-size-adjust: none;
        mso-line-height-rule: exactly;
    }
    
    .es-left {
        float: left;
    }
    
    .es-right {
        float: right;
    }
    
    .es-p5 {
        padding: 5px;
    }
    
    .es-p5t {
        padding-top: 5px;
    }
    
    .es-p5b {
        padding-bottom: 5px;
    }
    
    .es-p5l {
        padding-left: 5px;
    }
    
    .es-p5r {
        padding-right: 5px;
    }
    
    .es-p10 {
        padding: 10px;
    }
    
    .es-p10t {
        padding-top: 10px;
    }
    
    .es-p10b {
        padding-bottom: 10px;
    }
    
    .es-p10l {
        padding-left: 10px;
    }
    
    .es-p10r {
        padding-right: 10px;
    }
    
    .es-p15 {
        padding: 15px;
    }
    
    .es-p15t {
        padding-top: 15px;
    }
    
    .es-p15b {
        padding-bottom: 15px;
    }
    
    .es-p15l {
        padding-left: 15px;
    }
    
    .es-p15r {
        padding-right: 15px;
    }
    
    .es-p20 {
        padding: 20px;
    }
    
    .es-p20t {
        padding-top: 20px;
    }
    
    .es-p20b {
        padding-bottom: 20px;
    }
    
    .es-p20l {
        padding-left: 20px;
    }
    
    .es-p20r {
        padding-right: 20px;
    }
    
    .es-p25 {
        padding: 25px;
    }
    
    .es-p25t {
        padding-top: 25px;
    }
    
    .es-p25b {
        padding-bottom: 25px;
    }
    
    .es-p25l {
        padding-left: 25px;
    }
    
    .es-p25r {
        padding-right: 25px;
    }
    
    .es-p30 {
        padding: 30px;
    }
    
    .es-p30t {
        padding-top: 30px;
    }
    
    .es-p30b {
        padding-bottom: 30px;
    }
    
    .es-p30l {
        padding-left: 30px;
    }
    
    .es-p30r {
        padding-right: 30px;
    }
    
    .es-p35 {
        padding: 35px;
    }
    
    .es-p35t {
        padding-top: 35px;
    }
    
    .es-p35b {
        padding-bottom: 35px;
    }
    
    .es-p35l {
        padding-left: 35px;
    }
    
    .es-p35r {
        padding-right: 35px;
    }
    
    .es-p40 {
        padding: 40px;
    }
    
    .es-p40t {
        padding-top: 40px;
    }
    
    .es-p40b {
        padding-bottom: 40px;
    }
    
    .es-p40l {
        padding-left: 40px;
    }
    
    .es-p40r {
        padding-right: 40px;
    }
    
    .es-menu td {
        border: 0;
    }
    
    .es-menu td a img {
        display: inline-block !important;
    }
    
    /* END CONFIG STYLES */
    a {
        text-decoration: none;
    }
    
    p,
    ul li,
    ol li {
        font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif;
        line-height: 150%;
    }
    
    ul li,
    ol li {
        Margin-bottom: 15px;
        margin-left: 0;
    }
    
    .es-menu td a {
        text-decoration: none;
        display: block;
        font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif;
    }
    
    .es-wrapper {
        width: 100%;
        height: 100%;
        background-repeat: repeat;
        background-position: center top;
    }
    
    .es-wrapper-color,
    .es-wrapper {
        background-color: #fafafa;
    }
    
    .es-header {
        background-color: transparent;
        background-repeat: repeat;
        background-position: center top;
    }
    
    .es-header-body {
        background-color: #ffffff;
    }
    
    .es-header-body p,
    .es-header-body ul li,
    .es-header-body ol li {
        color: #333333;
        font-size: 14px;
    }
    
    .es-header-body a {
        color: #1376c8;
        font-size: 14px;
    }
    
    .es-content-body {
        background-color: #ffffff;
    }
    
    .es-content-body p,
    .es-content-body ul li,
    .es-content-body ol li {
        color: #666666;
        font-size: 16px;
    }
    
    .es-content-body a {
        color: #0b5394;
        font-size: 16px;
    }
    
    .es-footer {
        background-color: transparent;
        background-repeat: repeat;
        background-position: center top;
    }
    
    .es-footer-body {
        background-color: transparent;
    }
    
    .es-footer-body p,
    .es-footer-body ul li,
    .es-footer-body ol li {
        color: #333333;
        font-size: 14px;
    }
    
    .es-footer-body a {
        color: #333333;
        font-size: 14px;
    }
    
    .es-infoblock,
    .es-infoblock p,
    .es-infoblock ul li,
    .es-infoblock ol li {
        line-height: 120%;
        font-size: 12px;
        color: #cccccc;
    }
    
    .es-infoblock a {
        font-size: 12px;
        color: #cccccc;
    }
    
    h1 {
        font-size: 20px;
        font-style: normal;
        font-weight: normal;
        color: #333333;
    }
    
    h2 {
        font-size: 14px;
        font-style: normal;
        font-weight: normal;
        color: #333333;
    }
    
    h3 {
        font-size: 20px;
        font-style: normal;
        font-weight: normal;
        color: #333333;
    }
    
    .es-header-body h1 a,
    .es-content-body h1 a,
    .es-footer-body h1 a {
        font-size: 20px;
    }
    
    .es-header-body h2 a,
    .es-content-body h2 a,
    .es-footer-body h2 a {
        font-size: 14px;
    }
    
    .es-header-body h3 a,
    .es-content-body h3 a,
    .es-footer-body h3 a {
        font-size: 20px;
    }
    
    a.es-button,
    button.es-button {
        display: inline-block;
        background: #ffffff;
        border-radius: 10px;
        font-size: 14px;
        font-family: arial, 'helvetica neue', helvetica, sans-serif;
        font-weight: bold;
        font-style: normal;
        line-height: 120%;
        color: #3D5CA3;
        text-decoration: none;
        width: auto;
        text-align: center;
        padding: 15px 20px 15px 20px;
        mso-padding-alt: 0;
        mso-border-alt: 10px solid #ffffff;
    }
    
    .es-button-border {
        border-style: solid solid solid solid;
        border-color: #3d5ca3 #3d5ca3 #3d5ca3 #3d5ca3;
        background: #ffffff;
        border-width: 2px 2px 2px 2px;
        display: inline-block;
        border-radius: 10px;
        width: auto;
    }
    
    /* RESPONSIVE STYLES Please do not delete and edit CSS styles below. If you don't need responsive layout, please delete this section. */
    @media only screen and (max-width: 600px) {
    
        p,
        ul li,
        ol li,
        a {
            line-height: 150% !important;
        }
    
        h1,
        h2,
        h3,
        h1 a,
        h2 a,
        h3 a {
            line-height: 120% !important;
        }
    
        h1 {
            font-size: 20px !important;
            text-align: center;
        }
    
        h2 {
            font-size: 16px !important;
            text-align: left;
        }
    
        h3 {
            font-size: 20px !important;
            text-align: center;
        }
    
        .es-header-body h1 a,
        .es-content-body h1 a,
        .es-footer-body h1 a {
            font-size: 20px !important;
        }
    
        h2 a {
            text-align: left;
        }
    
        .es-header-body h2 a,
        .es-content-body h2 a,
        .es-footer-body h2 a {
            font-size: 16px !important;
        }
    
        .es-header-body h3 a,
        .es-content-body h3 a,
        .es-footer-body h3 a {
            font-size: 20px !important;
        }
    
        .es-menu td a {
            font-size: 14px !important;
        }
    
        .es-header-body p,
        .es-header-body ul li,
        .es-header-body ol li,
        .es-header-body a {
            font-size: 10px !important;
        }
    
        .es-content-body p,
        .es-content-body ul li,
        .es-content-body ol li,
        .es-content-body a {
            font-size: 16px !important;
        }
    
        .es-footer-body p,
        .es-footer-body ul li,
        .es-footer-body ol li,
        .es-footer-body a {
            font-size: 12px !important;
        }
    
        .es-infoblock p,
        .es-infoblock ul li,
        .es-infoblock ol li,
        .es-infoblock a {
            font-size: 12px !important;
        }
    
        *[class="gmail-fix"] {
            display: none !important;
        }
    
        .es-m-txt-c,
        .es-m-txt-c h1,
        .es-m-txt-c h2,
        .es-m-txt-c h3 {
            text-align: center !important;
        }
    
        .es-m-txt-r,
        .es-m-txt-r h1,
        .es-m-txt-r h2,
        .es-m-txt-r h3 {
            text-align: right !important;
        }
    
        .es-m-txt-l,
        .es-m-txt-l h1,
        .es-m-txt-l h2,
        .es-m-txt-l h3 {
            text-align: left !important;
        }
    
        .es-m-txt-r img,
        .es-m-txt-c img,
        .es-m-txt-l img {
            display: inline !important;
        }
    
        .es-button-border {
            display: block !important;
        }
    
        a.es-button,
        button.es-button {
            font-size: 14px !important;
            display: block !important;
            border-left-width: 0px !important;
            border-right-width: 0px !important;
        }
    
        .es-btn-fw {
            border-width: 10px 0px !important;
            text-align: center !important;
        }
    
        .es-adaptive table,
        .es-btn-fw,
        .es-btn-fw-brdr,
        .es-left,
        .es-right {
            width: 100% !important;
        }
    
        .es-content table,
        .es-header table,
        .es-footer table,
        .es-content,
        .es-footer,
        .es-header {
            width: 100% !important;
            max-width: 600px !important;
        }
    
        .es-adapt-td {
            display: block !important;
            width: 100% !important;
        }
    
        .adapt-img {
            width: 100% !important;
            height: auto !important;
        }
    
        .es-m-p0 {
            padding: 0px !important;
        }
    
        .es-m-p0r {
            padding-right: 0px !important;
        }
    
        .es-m-p0l {
            padding-left: 0px !important;
        }
    
        .es-m-p0t {
            padding-top: 0px !important;
        }
    
        .es-m-p0b {
            padding-bottom: 0 !important;
        }
    
        .es-m-p20b {
            padding-bottom: 20px !important;
        }
    
        .es-mobile-hidden,
        .es-hidden {
            display: none !important;
        }
    
        tr.es-desk-hidden,
        td.es-desk-hidden,
        table.es-desk-hidden {
            width: auto !important;
            overflow: visible !important;
            float: none !important;
            max-height: inherit !important;
            line-height: inherit !important;
        }
    
        tr.es-desk-hidden {
            display: table-row !important;
        }
    
        table.es-desk-hidden {
            display: table !important;
        }
    
        td.es-desk-menu-hidden {
            display: table-cell !important;
        }
    
        .es-menu td {
            width: 1% !important;
        }
    
        table.es-table-not-adapt,
        .esd-block-html table {
            width: auto !important;
        }
    
        table.es-social {
            display: inline-block !important;
        }
    
        table.es-social td {
            display: inline-block !important;
        }
    
        .es-desk-hidden {
            display: table-row !important;
            width: auto !important;
            overflow: visible !important;
            max-height: inherit !important;
        }
        .codigo{
            display: flex;
            justify-content: center;
            font-weight: 700 !important;
            font-size: xx-large !important;
        }
    }
    
    /* END RESPONSIVE STYLES */
    
    
    
    </style>
    
    
    </head>
    
    <body>
        <div class="es-wrapper-color">
            <!--[if gte mso 9]>
          <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#fafafa"></v:fill>
          </v:background>
        <![endif]-->
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                    <tr>
                        <td class="esd-email-paddings" valign="top">                            
                            <table cellpadding="0" cellspacing="0" class="es-header" align="center">
                                <tbody>
                                    <tr>
                                        <td class="es-adaptive esd-stripe" align="center" esd-custom-block-id="88593">
                                            <table class="es-header-body" style="background-color: #EDEDED;" width="600" cellspacing="0" cellpadding="0" bgcolor="#EDEDED" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p20t es-p20b es-p20r es-p20l" style="background-color: #EDEDED;" bgcolor="#EDEDED" align="left">
                                                            <!--[if mso]><table width="560" cellpadding="0" 
                            cellspacing="0"><tr><td width="270" valign="top"><![endif]-->
                                                            <table class="es-left" cellspacing="0" cellpadding="0" align="left">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="es-m-p20b esd-container-frame" width="270" align="left">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-image es-m-p0l es-m-txt-c" align="left" style="font-size:0"><a href="https://viewstripo.email" target="_blank"><img src="https://i.imgur.com/CMWfvQ1.png" alt style="display: block;" width="80"></a></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]></td><td width="20"></td><td width="270" valign="top"><![endif]-->
                                                          
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" style="background-color: #fafafa;" bgcolor="#fafafa" align="center">
                                            <table class="es-content-body" style="background-color: #ffffff;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p40t es-p20r es-p20l" style="background-color: transparent; background-position: left top;" bgcolor="transparent" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="560" valign="top" align="center">
                                                                            <table style="background-position: left top;" width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-image es-p5t es-p5b" align="center" style="font-size:0"><a target="_blank"><img src="https://tlr.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png" alt style="display: block;" width="175"></a></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-text es-p15t es-p15b" align="center">
                                                                                            <h1 style="color: #333333; font-size: 20px;"><strong>¿OLVIDASTE TU </strong></h1>
                                                                                            <h1 style="color: #333333; font-size: 20px;"><strong> CONTRASE&Ntilde;A?</strong></h1>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-text es-p40r es-p40l" align="left">
                                                                                            <p style="text-align: center;">HOLA,<strong style="text-transform:uppercase;"> ${verificacion.funcionario_nombre}  ${verificacion.funcionario_apellido}</strong> </p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-text es-p35r es-p40l" align="left">
                                                                                            <p style="text-align: center;"><Ri:a>Recibimos una peticion para restablecer tu contrase&ntilde;a</Ri:a>!</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-text es-p25t es-p40r es-p40l" align="center">
                                                                                            <p>¡Si no hiciste esta solicitud, por favor ignora este e-mail. De otra forma, por favor copia el codigo que veras a continuacion el cual te ayudara en el proceso del cambio de contraseña:</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="codigo" align="center" style="background-position: center top;">
                                                                                        <h1><strong>${codigo_aleatorio}</strong></h1>                                                                            
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="esd-structure es-p20t es-p10r es-p10l" style="background-position: center center;" align="left">
                                                
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="esd-structure es-p5t es-p20b es-p20r es-p20l" style="background-position: left top;" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="560" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-text" esd-links-color="#666666" align="center">
                                                                                            <p style="font-size: 14px;">Contactanos: <a target="_blank" style="font-size: 14px; color: #666666;" href="tel:123456789">3207861408</a> | <a target="_blank" href="tusenactpi@gmail.com" style="font-size: 14px; color: #666666;">tusenactpi@gmail.com</a></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="es-footer" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" style="background-color: #fafafa;" bgcolor="#fafafa" align="center">
                                            <table class="es-footer-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p10t es-p30b es-p20r es-p20l" style=" background-color: #205072; background-position: left top;" bgcolor="#205072" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="560" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-text es-p5t es-p5b" align="left">
                                                                                            <h2 style="font-size: 16px; color: #ffffff;"><strong>¿TIENES PREGUNTAS?</strong></h2>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td esd-links-underline="none" esd-links-color="#ffffff" class="esd-block-text es-p5b" align="left">
                                                                                            <p style="font-size: 14px; color: #ffffff;">Estamos para ayudar, contactanos!<a target="_blank" style="font-size: 14px; color: #ffffff; text-decoration: none;"></a></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                       
                       
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
    
    </html>`
    
  };


  console.log(verificacion);

 transporter.sendMail(mensaje, async (error, info) => {
    if (verificacion) {
      


      const guardarCodigo = await funcionario.findByPk(verificacion.funcionario_id)
      guardarCodigo.funcionario_recuperar = codigo_aleatorio,
        await guardarCodigo.save();

      res.status(200).json({
        message: 'Correo de recuperación enviado exitosamente',
        codigo_aleatorio,
        // guardarCodigo
      });

    } else {
      console.log('Error al enviar el correo:', error);
      res.status(500).json({ error: 'Ocurrió un error al enviar el correo electrónico' });
    }
  });
};


// export const get_funcionario_correo = async (req, res) => {
//   const { funcionario_id } = req.params;
//   try {
//     const nuevo_funcionario = await funcionario.findOne({
//       where: { funcionario_id },
//     });
//     res.status(200).json({ message: "Funcionario obtenido por id", nuevo_funcionario });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };






export const actualizar_contrasena = async (req, res) => {

  const { funcionario_correo } = req.params;

  const usuario = await funcionario.findOne({
    where: { funcionario_correo: funcionario_correo }
  })

  const id = usuario.funcionario_id

  const { funcionario_recuperar, funcionario_contrasena } = req.body

  const hashedPassword = await bcryptjs.hash(funcionario_contrasena, 10);

  if (funcionario_recuperar == usuario.funcionario_recuperar) {


    try {
      const funcionarios = await funcionario.findByPk(id)

      funcionarios.funcionario_recuperar = funcionario_recuperar,
        funcionarios.funcionario_contrasena = hashedPassword

      await funcionarios.save();
      res.status(200).json({ message: "se ha actualizado la contraseña", funcionarios })

    } finally {
    }
  } else {
    return res.status(500).json({ message: "ERROR" })


  }

}