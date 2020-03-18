import React, { Component } from "react";
import './authentication-failed.less';

class FailedAuthentication extends Component {
  render() {
      return ( <div className="error-container">
          <h3>Authentication Failed..!</h3>
      </div> )
  }
}

export default FailedAuthentication;
