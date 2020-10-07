import React from "react";
import { connect } from 'react-redux';

import './vv-checkbox.less';

class VVCheckBox extends React.Component {
    constructor(props){
        super(props);
    }

    toggleCheckbox(event){
        this.props.config.onChange(event, this.props.config.data);
    }

    componentWillUnmount() {}

    render() {
        return (
            <div className="custom-checkbox-container">
                <input type="checkbox" id={this.props.config.id} name={this.props.config.name} value={this.props.config.value} 
                defaultChecked={this.props.config.defaultChecked} onClick={this.toggleCheckbox.bind(this)}/>
                <label className="custom-check-label" htmlFor={this.props.config.id} >
                    <span className="custom-checkbox"></span>
                </label>
                {this.props.config.value}
            </div>
        )
    }
}
export default VVCheckBox;