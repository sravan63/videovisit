import React from "react";
import { connect } from 'react-redux';

import './loader.less';

function loader() {
    return (
        <div className="container-fluid">
            <div className="row loader-container"> 
                <div className="loader"></div>
            </div>
        </div>
    );
}


export default loader;