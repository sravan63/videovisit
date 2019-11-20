import React, { Component } from "react";
import './footer.less';
class footer extends Component {
  render() {
    return <div className="container">
    <div className="row mt-3">
      <div className="col-12 text-center">
        <ul id="list-conditions">
                            <li><a href="http://mydoctor.kaiserpermanente.org/ncal/mdo/terms_and_conditions.jsp" target="_blank" className="pr-2 pl-2 pb-0"> Terms &amp; Conditions</a></li>
                            <li className="last b-0"><a href="https://members.kaiserpermanente.org/kpweb/privacystate/entrypage.do" target="_blank" className="pr-2 pl-2 pb-0">Privacy Practices</a></li>
                        </ul>
        <p className="copyright text-center">Copyright ©2012-2017 The Permanente Medical Group, Inc. All rights reserved.</p>
      </div>
    </div>
  </div>
  }
}

export default footer;
