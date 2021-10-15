import React, { Component } from "react";
import './footer.less';
class footer extends Component {
  render() {
    return <div className="container-fluid main-footer">
    <div className="row ml-0 mt-2">
      <div className="col-12 text-center p-0">
        <ul id="list-conditions" className="text-left pl-0">
            <li><a href="http://mydoctor.kaiserpermanente.org/ncal/mdo/terms_and_conditions.jsp" target="_blank" className="pr-2 pb-0"> Terms &amp; Conditions</a></li>
            <li className="last b-0"><a href="https://members.kaiserpermanente.org/kpweb/privacystate/entrypage.do" target="_blank" className="pr-2 pl-2 pb-0">Privacy Practices</a></li>
        </ul>
        <p className="copyright text-left">Copyright ©2012-2022 The Permanente Medical Group, Inc. All rights reserved.</p>
      </div>
    </div>
  </div>
  }
}

export default footer;
