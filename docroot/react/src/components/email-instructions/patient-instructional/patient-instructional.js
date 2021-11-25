import React, { Component } from "react";
import '../email-templates.less';
import './patient-instructional.less';
import IosSpanish from '../../../assets/badges/appstore-spanish.svg';
import IosChinese from '../../../assets/badges/appstore-chinese.svg';
import AndroidSpanish from '../../../assets/badges/android-spanish.png';
import AndroidChinese from '../../../assets/badges/android-chinese.png';
import MdoIcon from '../../../assets/mdo-icon.png';



class PatientInstructional extends Component {
    constructor(props) {
        super(props);
        const content = props.content.patientInstructionalEmail;
        content['instructions'] = props.content.instructions;
        this.state = {emailContentDetails:props.data,staticData:content};
    }

    render() {
        var content = this.props.content.patientInstructionalEmail;
        content['instructions'] = this.props.content.instructions;
        let details = content;
        return (
            <div className="wrapper container-fluid p-0">
                <div className="instruction">
                    <p className="instruct-header">{details.heading} </p>
                    <div className="visit-rules patient-rules">
                        <ul>
                            <li style={{ fontWeight:'bold' }}>{details.instructions.rule1}</li>
                            <li>{details.instructions.rule2}</li>
                            <li>{details.instructions.rule3}</li>
                            <li style={{marginBottom:'12px'}}>{details.instructions.rule4}</li>
                        </ul>
                        <div className="learn-more" style={{margin:0}}>
                            <a href={this.state.emailContentDetails.patientHelpUrl} target="_blank">{details.learnMore}</a>
                        </div>
                    </div>
                    <div className="join-from-phone">{details.smartPhone}</div>
                    <ul className="rules-smart-phone">
                        <li>{details.smartPhoneRules1}</li>
                        <li className="sign-on">{details.smartPhoneRules2}
                        <b>{details.appointment}</b>{details.smartPhoneRules3}<b>{details.join}</b>{details.smartPhoneRules4}</li>
                    </ul>
                    <div className="iconsView">
                        <div className="mdo-btn">
                            <a href="https://apps.apple.com/us/app/kp-preventive-care-for-northern/id497468339?mt=8%22" target="_blank">
                                <img
                                    src={MdoIcon}
                                    border="0" alt="The Permanente Medical Group" className="mdo-icon"/></a>
                        </div>
                        <div className="download-icon">
                            <p className="download-text">{details.download}</p>
                            <div>
                                <a href="https://itunes.apple.com/us/app/kp-preventive-care-for-northern/id497468339?mt=8"
                                   target="_blank">
                                    <img
                                        src={this.state.emailContentDetails.lang==='spanish' ? IosSpanish : IosChinese}
                                        border="0" alt="The Permanente Medical Group" className="ios-link"/></a>
                                <a href="https://play.google.com/store/apps/details?id=org.kp.tpmg.preventivecare&amp;hl=en"
                                   target="_blank">
                                    <img
                                        src={this.state.emailContentDetails.lang==='spanish' ? AndroidSpanish : AndroidChinese}
                                        border="0" alt="The Permanente Medical Group" className="google-link"/></a>
                            </div>
                        </div>
                    </div>
                    <div className="join-from-pc">{details.computer}</div>
                    <ul className="rules-computer">
                            <li>{details.goTo}<a href={this.state.emailContentDetails.lang==='spanish' ? 'http://kp.org/mydoctor/videovisitsespanol':'http://kp.org/mydoctor/videovisits'} target="_blank"
                                         style={{textDecoration: 'none',color: '#006ba6',cursor: 'pointer'}}>{this.state.emailContentDetails.lang==='spanish' ? 'kp.org/mydoctor/videovisitsespanol':'kp.org/mydoctor/videovisits'}</a>
                                {details.andSelect}<b>{details.joinVisit}</b>{details.and}<b>{details.signIn}</b></li>
                            <li>{details.Select}<b>{details.joinYourVisit}</b>{details.computerRule}</li>
                    </ul>
                    <div className="trouble-signIn">
                        <p>{details.troubleSignIn1}</p>
                        <p>{details.troubleSignIn2}{this.state.emailContentDetails.lang==='spanish' || this.state.emailContentDetails.lang==='english' ? (<span style={{color: '#006ba6'}}>1-844-216-5769</span>):('')}{details.troubleSignIn3}{this.state.emailContentDetails.lang==='chinese' ? (<span style={{color: '#006ba6'}}>1-844-216-5769。</span>):('')}</p>
                        <p>{details.troubleSignIn4}</p>
                    </div>
                </div>
            </div>)
    }
}

export default PatientInstructional;
