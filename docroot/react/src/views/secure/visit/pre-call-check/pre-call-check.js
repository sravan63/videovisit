import React from "react";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';

import Header from '../../../../components/header/header';
import Loader from '../../../../components/loader/loader';
import BackendService from '../../../../services/backendService.js';
import MediaService from '../../../../services/media-service.js';
import './pre-call-check.less';

class PreCallCheck extends React.Component {

    constructor(props) {
        super(props);
        this.interval = '';
        this.list = [];
        this.state = { userDetails: {}, showPage: false, showLoader: true, data:{}, media:{} };
    }

    componentDidMount() {
        // this.interval = setInterval(() => this.getMyMeetings(), 180000);
        if (localStorage.getItem('userDetails')) {
            this.state.userDetails = JSON.parse(localStorage.getItem('userDetails'));
            if (this.state.userDetails) {
                this.setState({showPage : true});
            }
        } else {
            this.props.history.push('/login');
        }
        this.list = MediaService.getMediaList();
        this.setState({media : this.list});
        console.log(this.list);
    }

    toggleOpen(type){
        console.log('DD :: '+ type);
        this.setState({data:{
            isVideo: type == 'video',
            isAudio: type == 'audio',
            isSpeaker: type == 'speaker',
        }});
    }

    selectPeripheral(media){
        console.log('SELECTED MEDIA IS :: '+media);
    }


    render() {
        return (
            <div id='container' className="pre-call-check-page">
                 <Header/>
                 <div className="pre-call-check-content">
                     <div className="col-md-8 pre-call-check">
                         <div className="col-md-6 options p-0">
                             <div className="dropdown show">
                                  <a className="btn col-md-12 dropdown-toggle rounded-0" href="#" role="button" data-toggle="dropdown" onClick={this.toggleOpen.bind(this,'video')}>
                                    Camera
                                  </a>
                                  <div className={this.state.data.isVideo ? 'dropdown-menu show' : 'dropdown-menu'} aria-labelledby="dropdownMenuButton">
                                    { this.state.media.videoinput && this.state.media.videoinput.length > 0 ? 
                                        this.state.media.videoinput.map((item,key) =>{
                                        return (
                                            <a className="dropdown-item" key={key} onClick={this.selectPeripheral.bind(this,item)}>{item.label}</a>
                                        )
                                    }) 
                                     : ('') 
                                    }
                                  </div>
                             </div>
                             <div className="dropdown show">
                                  <a className="btn col-md-12 dropdown-toggle rounded-0" href="#" role="button" data-toggle="dropdown" onClick={this.toggleOpen.bind(this,'audio')}>
                                    Microphone
                                  </a>
                                  <div className={this.state.data.isAudio ? 'dropdown-menu show' : 'dropdown-menu'} aria-labelledby="dropdownMenuButton">
                                    { this.state.media.audioinput && this.state.media.audioinput.length > 0 ? 
                                        this.state.media.audioinput.map((item,key) =>{
                                        return (
                                            <a className="dropdown-item" key={key} onClick={this.selectPeripheral.bind(this,item)}>{item.label}</a>
                                        )
                                    }) 
                                     : ('') 
                                    }
                                  </div>
                             </div>
                             <div className="dropdown show">
                                  <a className="btn col-md-12 dropdown-toggle rounded-0" href="#" role="button" data-toggle="dropdown" onClick={this.toggleOpen.bind(this,'speaker')}>
                                    Speakers
                                  </a>
                                  <div className={this.state.data.isSpeaker ? 'dropdown-menu show' : 'dropdown-menu'} aria-labelledby="dropdownMenuButton">
                                    { this.state.media.audiooutput && this.state.media.audiooutput.length > 0 ? 
                                        this.state.media.audiooutput.map((item,key) =>{
                                        return (
                                            <a className="dropdown-item" key={key} onClick={this.selectPeripheral.bind(this,item)}>{item.label}</a>
                                        )
                                    }) 
                                     : ('') 
                                    }
                                  </div>
                             </div>
                         </div>
                         <div className="col-md-6 p-0"></div>
                     </div>
                 </div>
            </div>
        )
    }
}

export default PreCallCheck;