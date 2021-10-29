import React, { Component } from "react";
import BackendService from "../../services/backendService";
import './email-templates.less';
import Utilities from '../../services/utilities-service.js';

class emailStartEarlySp extends Component {
    constructor(props) {
        super(props);
        this.state = {emailContentDetails:{}}
    }

    componentDidMount() {
        const params = window.location.href.split('?')[1];
        const urlParams = new URLSearchParams( params );
        const tokenValue  = urlParams.has('tk') && urlParams.get('tk');
        const lang  = urlParams.has('lang') && urlParams.get('lang');
    }
    getHoursAndMinutes(millis, type) {
        if (!millis) {
            return;
        }
        let formatDatenTime = Utilities.formatInMeetingDateAndTime(new Date(parseInt(millis)), type);
        if(formatDatenTime.indexOf('AM') > -1){
            formatDatenTime = formatDatenTime.replace("AM",'a.m.');
        }
        if(formatDatenTime.indexOf('PM') > -1){
            formatDatenTime = formatDatenTime.replace("AM",'p.m.');
        }
        return formatDatenTime;
    }
    
    render() {
        const pStyle = {
            fontFamily: 'sans-serif',
            verticalAlign: 'top',
            fontSize: '14px'            
          };
          const pStyle1 = {
            fontFamily: 'sans-serif',
            verticalAlign: 'top',
            fontSize: '14px',
            display: 'block',
            margin: '0 auto',maxWidth: '580px',
            padding: '10px', width:' 580px'            
          };
          const pStyle2 = {
            boxSizing: 'border-box',display: 'block',
            margin: '0 auto',maxWidth: '580px',
            padding: '10px'           
          };
          const pStyle3 = {
            borderCollapse: 'separate', msoTableLspace: '0pt',
            msoTableRspace: '0pt', width: '100%', 
            background: '#ffffff', borderRadius: '3px'
          }
          const pStyle4 = {
            borderBottom: '2px solid #003b71',paddingBottom: '5px',
            margin: '0 auto',overflowX:'auto'
          }
          const pStyle5 = {
            paddingBottom: '5px',paddingTop: '26px',
            width: '50%'
          }
          const pStyle6 = {
            display: 'block', color: '#333333',  
            fontFamily: 'OpenSans, Arial, sans-serif', fontSize: '16px', 
            width:'212px',height:'40px'
          }
          const pStyle7 = {
            display: 'block',color: '#333333',  
            fontFamily: 'Open Sans, Arial, sans-serif', fontSize: '16px',
            width:'212px',height:'40px'
          }
          const pStyle8 = {
            fontFamily: 'sans-serif', fontSize: '14px',
            verticalAlign: 'top', boxSizing: 'border-box',
            padding: '5px 20px 20px 20px'
        }
        const pStyle9 = {
            borderCollapse: 'separate', msoTableLspace: '0pt',
            msoTableRspace: '0pt', width: '100%', backgroundColor: '#f6f6f6'
        }
        const pStyle10 = {
            clear: 'both', backgroundColor: '#003b71',
            textAlign: 'center', width: '100%'
          }
        const pStyle11 = {
            paddingBottom: '5px', width: '50%'
        }
        const pStyle12 = {
            color: '#92ccf0'
        }
        const pStyle13 = {
            textAlign:'left',fontFamily: 'sans-serif',
            verticalAlign: 'top', paddingTop: '15px',
            fontSize: '12px',paddingLeft: '20px',float:'left'
        }
        const pStyle14 = {
            height: '24px',width: '146px',objectFit: 'contain'
        }
        const pStyle15 = {
            textAlign:'left',fontFamily: 'sans-serif',
            verticalAlign: 'top', paddingBottom: '10px', paddingTop: '10px', fontSize: '12px',
            paddingLeft: '20px',float:'left'
        }
        const pStyle16 = {
            color: '#92ccf0',fontFamily: 'sans-serif', verticalAlign: 'top',
            paddingBottom: '10px', paddingTop: '10px', fontSize: '12px',paddingLeft: '20px',float:'left',textAlign: 'left'
        }
        const pStyle17 = {
            color: '#92ccf0',fontWeight: 'bold', fontSize: '12px'
        }
        const pStyle18 = {
            color: '#92ccf0', fontSize: '12px'
        }
        const pStyle19 = {
            borderCollapse: 'separate', msoTableLspace: '0pt',
            msoTableRspace: '0pt', width: '100%'
        }
        const pStyle20 = {
            fontFamily: 'sans-serif', fontSize: '14px', verticalAlign: 'top'
        }
        const pStyle21 = {
            fontFamily: 'sans-serif', fontSize: '17px',
            fontWeight: 'normal',marginTop:'0', marginBottom: '24px'
        }
        const pStyle22 = {
            color: '#006ba6',textDecoration: 'none'
        }
        const pStyle23 = {
            color: '#000000'
        }
        const pStyle24 = {
            color: '#006ba6',textDecoration: 'none'
        }
        const pStyle25 = {
            fontFamily: 'sans-serif', fontSize: '22px', fontWeight: 'bold',color: '#003b71'
        }
        const pStyle26 = {
            fontFamily: 'sans-serif',fontSize: '17px'
        }
        const pStyle27 = {
            fontWeight:'bold'
        }
        const pStyle28 = {
            textAlign:'center',margin:'30px 0px 50px 0px'
        }
        const pStyle29 = {
            color: '#ffffff',borderColor:'#006BA6',backgroundColor:'#006BA6',
            fontSize: '17px',height: '56px',padding: '13px 30px 13px 30px',textDecoration:'none',
            borderRadius:'1px',fontFamily:'sans-serif'
        }
        const pStyle30 = {
            color: '#006ba6',fontSize: '17px'
        }
        const pStyle31 = {
            backgroundColor: '#f6f6f6', fontFamily: 'sans-serif',
            WebkitFontSmoothing: 'antialiased', fontSize: '14px', lineHeight: '1.4', margin:'0', padding: '0',
            MsTextSizeAdjust: '100%',
            WebkitTextSizeAdjust: '100%'
        }
        const pStyle100 = {
            color: '#92ccf0',fontFamily: 'sans-serif',
            verticalAlign: 'top', paddingBottom: '10px',
            fontSize: '12px',paddingLeft: '20px',
            float:'left',textAlign: 'left'
         };
         const pStyle101 = {
            fontFamily: 'sans-serif', fontSize: '14px', verticalAlign: 'top'
         }
          
        return ( 
            <body className="" style={pStyle31}>
	
            <table border="0" className="body" style={pStyle9}>
        <tbody>                
      <tr>
        <td style={pStyle}>&nbsp;</td>
        <td className="container" style={pStyle1}>
          <div className="content" style={pStyle2}>
            <table className="main" style={pStyle3}>
              <tbody>
              <tr>
                <td>
                  <table  border="0" className="header" style={pStyle4}>
                    <tbody>
                      <tr>
                        <td align="left" style={pStyle5}>
                          <a href="https://mydoctor.kaiserpermanente.org/ncal/mdo/#/?origin=sysoutreach" target="_blank">                  
                            <img className="logo-image" src="https://dv1.mydoctor.kaiserpermanente.org/videovisit/images/email/pm-tpmg-blue.svg" border="0" alt="The Permanente Medical Group" style={pStyle6} />
                          </a>
                        </td>
                        <td align="right" style={pStyle11}>
                          <a href="https://mydoctor.kaiserpermanente.org/ncal/mdo/#/?origin=sysoutreach" target="_blank">
                            <img src="https://dv1.mydoctor.kaiserpermanente.org/videovisit/images/email/kp-logo.png" border="0" alt="The Permanente Medical Group" style={pStyle7} />
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td className="wrapper" style={pStyle8}>
                  <table border="0" cellpadding="0" cellspacing="0" style={pStyle19}>
                    <tbody>
                    <tr>
                      <td style={pStyle20}>
                        <p style={pStyle21}><a style={pStyle22} href="$dynamicContent.chineseTanslationUrl$">中文</a> <span style={pStyle23}>|</span> <a style={pStyle24} href="$dynamicContent.spanishTranslationUrl$">Español</a></p>
                        
                        <p style={pStyle25}>Inicie su videoconsulta ahora</p>
                        
                        <p style={pStyle26}>Su videoconsulta programada originalmente para el {this.getHoursAndMinutes(1635491100000, 'date')} at {this.getHoursAndMinutes(1635491100000, 'time')} Pacific Time,va a empezar más temprano.</p>
						
						<p style={pStyle26}>Para ingresar desde un teléfono inteligente o una tableta, descargue la app My Doctor Online. Para ingresar desde una computadora vaya a la página web de videoconsultas.</p>
						 <p>
                        <ul style={pStyle26}>
                        <li style={pStyle27}>No ingrese desde un vehículo en movimiento.</li>
                        <li>Tenga una conexión fuerte a Wi-Fi o internet.</li>
                        <li>Esté en un lugar tranquilo y bien iluminado.</li>
                        <li>Trate de ingresar 10 minutos antes para prepararse.</li>
                        </ul>
                        </p>                        
						<p> 
						<div style={pStyle28}>
                            <a href="$dynamicContent.meetingURL$" title="$dynamicContent.meetingURL$" style={pStyle29}>Inicie su videoconsulta
                            </a>
                        </div>
						</p>
						
						<p>
                        <div className="trouble-signIn">
                        
                        <p style={pStyle26}>Si necesita un intérprete, avísenos al iniciar su consulta.</p>
                        <p style={pStyle26}>¿Problemas para iniciar sesión? Use el acceso temporal a las videoconsultas (Video Visits Temporary Access).</p>
						            <p> <a href="$dynamicContent.guestHelpUrl$" style={pStyle30}>Aprenda más acerca de las videoconsultas y cómo prepararse.</a> </p>
						            <br/>
						            <p style={pStyle26}>  <a href="$dynamicContent.signInUrl$" style={pStyle30}>Inicie sesión</a> o llame al 1-866-454-8855 para cancelar o reprogramar.</p>
                        </div>
						            </p>
						
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
                <tr style={pStyle10}>
                  <td style={pStyle13}>
                     <a>
                      <img src="https://dv1.mydoctor.kaiserpermanente.org/videovisit/images/email/pm-tpmg-white.webp" style={pStyle14} className="pm_tpmg_lg_hr_tm_rgb_wht" />
                    </a>
                  </td>
                  <td className="content-block" style={pStyle15}>
                    <span className="apple-link" style={pStyle18}>Este aviso fue generado automáticamente por Kaiser Permanente. No responda a este correo electrónico.</span>
                  </td>
                  <td style={pStyle16}>
                    <span  style={pStyle17}>Importante: no trate de acceder a la atención de emergencia o de urgencia a través de este correo electrónico.</span>
                    <ul>
                      <li>Si cree que usted o un miembro de su familia tiene una emergencia médica o psiquiátrica, llame al 911 o acuda al hospital más cercano.</li>
                      <li>Si usted o un miembro de su familia tiene un síntoma urgente, o si desea hablar con un(a) enfermero(a), llame al centro de atención local de Kaiser Permanente.</li>
                    </ul>
                  </td>
                 <td style={pStyle100}>Para asegurarse de que los avisos futuros sean enviados a su bandeja de entrada (y no a su carpeta de correos no deseados), agregue <span style={{textDecoration: 'underline'}}>kp-donotreply@lp.org</span> a su libreta de contactos.</td>
                  <td style={pStyle100}><a href="$dynamicContent.privacyPolicyUrl$" style={pStyle12}>Nuestro aviso de privacidad del sitio web</a></td>
                </tr>
                </tbody>
            </table>
          </div>
        </td>
        <td style={pStyle101}>&nbsp;</td>
      </tr>
      </tbody>
    </table>
    </body> )
    }
}

export default emailStartEarlySp;
