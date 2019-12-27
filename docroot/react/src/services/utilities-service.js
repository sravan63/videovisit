import React from 'react';
import Axios from 'axios-observable';


class UtilityService extends React.Component {

    constructor() {
        super();
        this.state = { basePath: '' };
        if (window.location.origin.indexOf('localhost') > -1) {
            this.state.basePath = "https://localhost.kp.org";
        } else {
            this.state.basePath = '';
        }
    }

}
export default new UtilityService();