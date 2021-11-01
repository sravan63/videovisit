import React, { Component } from "react";
import BackendService from "../../../services/backendService";
import './email-start-early.less';
import Utilities from '../../../services/utilities-service.js';
import GlobalConfig from "../../../services/global.config";
import PermanenteHeader  from '../../../assets/email/pm-tpmg-blue.svg';
import Logo from '../../../assets/email/kp-logo.png';
import FooterLogo from '../../../assets/email/pm-tpmg-white.webp';

class emailStartEarly extends Component {
    constructor(props) {
        super(props);
        this.state = {emailContentDetails:props.data,staticData:{}};
    }

    componentDidMount() {
      let data = require('../../../lang/'+this.state.emailContentDetails.lang+'.json');
      this.setState({
          staticData: data.email.startEarly
      });
    }
    getHoursAndMinutes(millis, type,lang) {
        if (!millis) {
            return;
        }
        return Utilities.formatDateAndTimeForEmails(new Date(parseInt(millis)), type,lang);
    }
    
    render() { 
      let details = this.state.staticData; 
      return ( <div>
        <div className="container">
                          <div className="row">
                                  
                                  <div className="col-md-12">
                                  <h3 className="instruct-header">{details.heading} </h3>
                                  {details.subHeading} {this.getHoursAndMinutes(this.state.emailContentDetails.meetingTimeStamp,'date',this.state.emailContentDetails.lang)} {details.atText} {this.getHoursAndMinutes(this.state.emailContentDetails.meetingTimeStamp,'time',this.state.emailContentDetails.lang)} {details.timeZone}</div>
                                  <div className="col-md-12 mt-3">{details.subHeading3} </div>
                                  <div className="col-md-12 "><a href="" target="_blank" className="email-data-link">{details.subHeading4}</a> {details.subHeading5} <a href="" target="_blank" className="email-data-link">{details.subHeading10}</a></div>                                  
                                  <div className="visit-rules">
                                  <ul>
                                    <li style={{ fontWeight:'bold' }}>{details.rule1}</li>
                                    <li>{details.rule2}</li>
                                    <li>{details.rule3}</li>
                                    <li style={{marginBottom:'12px'}}>{details.rule4}</li>
                                  </ul>
                                </div>
                                
                          </div>
                          <div className="row">
                            <div className="col-md-12 text-center mb-4"><a href={this.state.emailContentDetails.meetingURL} target="_blank" className="start-visit">{details.startVisit}</a></div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">{details.needHelp1}{details.subHeading6}</div>
                            <div className="col-md-12">{details.needHelp1}{details.subHeading7}</div>
                            <div className="col-md-12 mb-4"><a href={this.state.emailContentDetails.guestHelpUrl} className="email-data-link" target="_blank">{details.subHeading8} </a></div>
                          </div>
                          <div className="row">
                            <div className="col-md-12"><a href="" className="email-data-link" target="_blank">{details.needHelp1} </a>{details.needHelp2}</div>
                          </div>
          </div>
      {/* <table border="0" cellPadding="0" cellSpacing="0" className="email-container">
        <tbody>
          <tr>
            <td className="container">
              <div className="content">
                <table className="main-container">
                  <tbody>
                    <tr>
                      <td>
                        <table border="0" className="header" cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td align="left" rowSpan="2" className="left-header">
                                <a href="https://mydoctor.kaiserpermanente.org/ncal/mdo/#/?origin=sysoutreach" target="_blank">
                                  <img className="logo-image" border="0" src={PermanenteHeader} alt="The Permanente Medical Group" />
                                </a>
                              </td>
                              <td align="right" className="right-header">
                                <a href="https://mydoctor.kaiserpermanente.org/ncal/mdo/#/?origin=sysoutreach" target="_blank">
                                  <img src={Logo} border="0" alt="The Permanente Medical Group" className="right-logo" />
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td className="wrapper">
                        <table border="0" cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td className="instruction">
                                <p className="instruct-header">{details.heading} </p>
                                <p className="instruct-description">{details.subHeading}</p>
                                <div className="visit-rules">
                                  <ul>
                                    <li style={{ fontWeight:'bold' }}>{details.rule1}</li>
                                    <li>{details.rule2}</li>
                                    <li>{details.rule3}</li>
                                    <li style={{marginBottom:'12px'}}>{details.rule4}</li>
                                  </ul>
                                </div>
                                <div className="text-center">
                                  <a href={this.state.emailContentDetails.meetingURL} target="_blank" className="start-visit">{details.startVisit}</a>
                                </div>
                                <div className="time-details">
                                  <p>{details.dateTime}: {this.getHoursAndMinutes(this.state.emailContentDetails.meetingTimeStamp,'date',this.state.emailContentDetails.lang)} at {this.getHoursAndMinutes(this.state.emailContentDetails.meetingTimeStamp,'time',this.state.emailContentDetails.lang)} Pacific Time</p>
                                  <p>{details.patient}: {this.state.emailContentDetails.memberFirstName} {this.state.emailContentDetails.lastNameFirstCharMember}</p>
                                  <p>{details.clinician}: {this.state.emailContentDetails.doctorFirstName} {this.state.emailContentDetails.doctorLastName} {this.state.emailContentDetails.doctorTitle}</p>
                                </div>
                                <div className="learn-more">
                                  <a href={this.state.emailContentDetails.guestHelpUrl} target="_blank">{details.learnMore}</a>
                                </div>
                                <div className="need-help">
                                  <p>{details.needHelp1}</p>
                                  <p>{details.needHelp2}</p>
                                  <p>{details.needHelp3}</p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr className="footer">
                      <td className="footer-text">
                        <a>
                          <img src={FooterLogo} className="footer-logo" />
                        </a>
                      </td>
                      <td className="content-block">
                        <span className="apple-link">{details.notification}</span>
                      </td>
                      <td className="important-block">
                        <span style={{fontWeight:'bold'}}>{details.important}</span>
                        <ul style={{marginBottom:'0'}}>
                          <li>{details.emergency1}</li>
                          <li>{details.emergency2}</li>
                        </ul>
                      </td>
                      <td className="future-announcement">{details.futureAnnouncement1} <a href="#" style={{color: '#92ccf0'}}>{details.doNotReply}</a>{details.futureAnnouncement2} </td>
                      <td className="privacy">
                        <a href="https://healthy.kaiserpermanente.org/privacy" style={{color: '#92ccf0'}}>{details.privacy}</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table> */}
    </div>) }
  }
  

export default emailStartEarly;
