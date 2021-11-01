import React, { Component } from "react";
import './header.less';
import PermanenteHeader  from '../../../assets/email/pm-tpmg-blue.svg';
import Logo from '../../../assets/email/kp-logo.png';

class emailheader extends Component {
  render() {
    return <div className="header container-fluid">
    <div className="row banner">
        <div className="image-holder">
            <a href="https://mydoctor.kaiserpermanente.org/ncal/mdo/#/?origin=sysoutreach"
                target="_blank">

                <img className="logo-image" border="0" src={PermanenteHeader}
                        alt="The Permanente Medical Group"/>
            </a>

        </div>
        <div className="image-holder">
            <a href="https://mydoctor.kaiserpermanente.org/ncal/mdo/#/?origin=sysoutreach"
                target="_blank">
                <img
                    src={Logo}
                    border="0" alt="The Permanente Medical Group"
                    className="right-logo"/>
            </a>
        </div>
    </div>
</div>
  }
}

export default emailheader;
