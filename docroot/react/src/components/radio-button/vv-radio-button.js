import React from "react";
import { connect } from 'react-redux';

import './vv-radio-button.less';

class VVRadioButton extends React.Component {
    constructor(props){
        super(props);
    }

    toggleRadio(event){
        this.props.config.onChange(event, this.props.config.data);
    }

    componentWillUnmount() {}

    render() {
        return (
            <div className="custom-radio-container">
                <input type="radio" id={this.props.config.id} name={this.props.config.name} value={this.props.config.value} 
                defaultChecked={this.props.config.defaultChecked} onClick={this.toggleRadio.bind(this)}/>
                <label className="custom-radio-label" htmlFor={this.props.config.id} >
                </label>
                {this.props.config.value}
            </div>
        )
    }
}
export default VVRadioButton;