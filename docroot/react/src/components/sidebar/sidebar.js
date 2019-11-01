import React from "react";
import './sidebar.less';

class sidebar extends React.Component {
  render() {
    return (
	    <div className="sidenav">
			<img src={require('../../assets/sm-TPMG-banner-logo.png')} alt="sidebar-image" />
		</div>
    );
  }
}

export default sidebar;
