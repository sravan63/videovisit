import React, { Component } from "react";
import './footer.less';
import FooterLogo from '../../../assets/email/pm-tpmg-white.webp';
class emailfooter extends Component {
  
  constructor(props) {
      super(props);
      this.state = { staticData : props.content };
  }
  componentDidMount() {
      // let data = require('../../../lang/'+this.state.emailContentthis.state.staticData.lang+'.json');
      this.setState({
          staticData: this.props.content
      });
  }

  render() {
    return  <div className="container-fluid p-0"> <div className="row footer">
      <div className="col-12 footer-text">
          <a>
              <img src={FooterLogo} className="footer-logo"/>
          </a>
      </div>
      <div className="col-12 content-block">
          <span className="apple-link">{this.state.staticData.notification}</span>
      </div>
      <div className="col-12 important-block">
          <span style={{fontWeight:'bold'}}>{this.state.staticData.important}</span>
          <ul style={{marginBottom:'0', paddingLeft:'1rem'}}>
              <li>{this.state.staticData.emergency1}</li>
              <li>{this.state.staticData.emergency2}</li>
          </ul>
      </div>
      <div className="col-12 future-announcement">{this.state.staticData.futureAnnouncement1}<a href="#" style={{color: '#92ccf0'}}>{this.state.staticData.doNotReply}</a>{this.state.staticData.futureAnnouncement2}
      </div>
      <div className="col-12 privacy">
          <a href="https://healthy.kaiserpermanente.org/privacy" target="_blank" style={{color: '#92ccf0'}}>{this.state.staticData.privacy}</a>
        </div>
      </div>
    </div>
  }
}

export default emailfooter;
