import React, { Component } from "react";
import './footer.less';
import FooterLogo from '../../../assets/email/pm-tpmg-white.webp';
class emailfooter extends Component {
  
  constructor(props) {
      super(props);
  }

  render() {
    return  <div className="container-fluid p-0"> <div className="row footer-email">
      <div className="col-12 footer-text">
          <a>
              <img src={FooterLogo} className="footer-logo"/>
          </a>
      </div>
      <div className="col-12 content-block">
          <span className="apple-link">{this.props.content.notification}</span>
      </div>
      <div className="col-12 important-block">
          <span style={{fontWeight:'bold'}}>{this.props.content.important}</span>
          <ul style={{marginBottom:'0', paddingLeft:'1rem'}}>
              <li>{this.props.content.emergency1}</li>
              <li>{this.props.content.emergency2}</li>
          </ul>
      </div>
      <div className="col-12 future-announcement">{this.props.content.futureAnnouncement1} <a href="#" style={{color: '#92ccf0', textDecoration:'underline'}}>{this.props.content.doNotReply}</a> {this.props.content.futureAnnouncement2}
      </div>
      <div className="col-12 privacy">
          <a href="https://healthy.kaiserpermanente.org/privacy" target="_blank" style={{color: '#92ccf0'}}>{this.props.content.privacy}</a>
        </div>
      </div>
    </div>
  }
}

export default emailfooter;
