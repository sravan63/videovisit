import React from "react";
import './sidebar.less';

class sidebar extends React.Component {
  render() {
    return (
	    <div className="side-bar"> 
	    	<div className="tpmg-logo"></div>
	    	<div className="links-container">
	    		<ul>
	    			<li id="oncall-item">
						<a href="javascript:void(0)">
						  	<span className="navicon nav-oncall"></span><span className="nav-text">On Call</span>
						 </a>
				    </li>
				    <li id="phonebook-item">
					  	<a href="javascript:void(0)">
					  		<span className="navicon nav-phonebook"></span><span className="nav-text">Phonebook</span>
					  	</a>
				    </li>
				    <li id="Favorites-item">
				         <a href="javascript:void(0)">
				           <span className="navicon nav-favorite"></span><span className="nav-text">Favorites</span>
				         </a>
				    </li>
				    <li id="vv-item" className="active-nav">
				        <a href="javascript:void(0)">
				          <span className="navicon nav-vv"></span><span className="nav-text">Video Visits</span>
				        </a>
				    </li>
	    		</ul>
	    	</div>
	    </div>
    );
  }
}

export default sidebar;
