import React, { Component } from "react";
import Header from '../header/header';
import './user-confirmation-box.less';
import BrowserBlock from '../browser-block/browser-block';
import Langtranslation from '../lang-translation/lang-translation';
class UserConfirmationBox extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {}

  changeLang(event){
    this.props.conf.changeLang(event);
  }

  denyUser(){
    this.props.conf.denyUser();
  }

  allowLogin(){
    this.props.conf.allowLogin();
  }

  render() {
      let Details = this.props.conf.data.staticData;
      if(Details && Details.instant_join){
          var instantDetails = Details.instant_join;
      }
      return ( <div className='instantJoin-container' style={{visibility: this.props.conf.data.userConfirmBox ? 'visible' : 'hidden'}}>
      <Header helpUrl = {this.props.conf.data.mdoHelpUrl} data={Details}/>
      <div className='instant-content'>
          <div className="row instant-help-link-container">
          {this.props.conf.data.invalidSession ?
              (<div className="row error-text">
                  <p className="col-sm-12" style={{fontWeight:this.props.conf.data.isMobile ? 'bold': '',height:this.props.conf.data.isMobile? '60px': '',lineHeight:this.props.conf.data.isMobile ? '55px': ''}}>{Details.errorCodes.ECErrorInvalidLink}</p>
              </div>)
          : ('')}
          {/* {this.props.conf.data.invalidSession && !this.props.conf.data.isBrowserBlockError ?
              (<div className="row error-text">
                  <p className="col-sm-12">{Details.errorCodes.ECErrorInvalidLink}</p>
              </div>)
          : ('')} */}
            <div className="col-lg-12 col-md-12 help-icon text-right p-0">
                <a href={Details.HelpLink} className="help-link" target="_blank">{Details.Help}</a>
                <Langtranslation />
            </div>
            {this.props.conf.data.isBrowserBlockError ? (<BrowserBlock browserblockinfo = {{isBrowserBlockError: this.props.conf.data.isBrowserBlockError }}/>) :('') }
          </div>
          {!this.props.conf.data.invalidSession && !this.props.conf.data.isBrowserBlockError ?
              (<div>
                  <div className="row instant-mobile-header">
                      <div className="title">
                          <p className="col-12 p-0 m-0 header">Kaiser Permanente</p>
                          <p className="col-12 p-0 sub-header">{Details.videoVisits}</p>
                      </div>
                  </div>
                  <div className="confirmationContent">
                      <h3 className="patientConfirm"> {instantDetails && instantDetails.AreYou}{this.props.conf.data.displayName}{instantDetails && instantDetails.Isit}?</h3>
                      <div>
                          <button  type="button" className="denyUser" onClick={this.denyUser.bind(this)}>{instantDetails && instantDetails.No}</button>
                          <button  type="button" className="allowUser" onClick={this.allowLogin.bind(this)}>{instantDetails && instantDetails.Yes}</button>
                      </div>
                  </div>
                  <div className="instant-form-footer">
                      <div className="instant-main-footer">
                          <ul id="instant-list-conditions">
                              <li><a href="http://mydoctor.kaiserpermanente.org/ncal/mdo/terms_and_conditions.jsp"
                                    target="_blank"> Terms and Conditions</a></li>
                              <li className="last"><a
                                  href="https://members.kaiserpermanente.org/kpweb/privacystate/entrypage.do"
                                  target="_blank">Privacy Practices</a></li>
                          </ul>
                          <p className="copyright">Copyright ©2012-2022 The Permanente Medical Group, Inc. All rights
                              reserved.</p>
                      </div>
                  </div>
              </div>)
          : ('')}
      </div>
  </div> )
  }
}

export default UserConfirmationBox;
