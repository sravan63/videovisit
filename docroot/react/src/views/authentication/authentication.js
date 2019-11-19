import React from 'react';
import Header from '../../components/header/header';
import Sidebar from '../../components/sidebar/sidebar';
import Footer from '../../components/footer/footer';
import Ssologin from '../../components/ssologin/ssologin';
import Login from '../../components/tempaccess/tempaccess';
import './authentication.less';

class Authentication extends React.Component {
    constructor(props) {
        super(props);
        localStorage.clear();
        this.tempAccessToken = false;
        this.state = { tempAccessToken: false };
    }
    toggleLoginScreen(item) {
        //this.setState({tempAccessToken:item});
        this.state.tempAccessToken = item;
        this.props.history.push('/login');

    }

    render() {
        return (
            <div id='container' className="ssologin-page">
         <Header/>            
         <Sidebar/> 
         <div className="main-content">
                <div className="row">
                    <div className="col-12 text-right help-icon p-0">
                        <small><a href="#">Help</a></small>
                    </div>
                </div>  
                <div className="row mobile-tpmg-logo"></div>
                                 
                {this.state.tempAccessToken ? (
                    <Login data={{tempAccessToken:this.state.tempAccessToken,toggleLoginScreen:this.toggleLoginScreen.bind(this)}}/>
                ) : (
                    <Ssologin history={this.props.history} data={{tempAccessToken:this.state.tempAccessToken,toggleLoginScreen:this.toggleLoginScreen.bind(this)}}/>
                )}
                <div className="row mobile-footer mt-5">
                    <p className="col-12">If You're a Patient's Guest</p>
                    <p className="col-12 secondary">Guests of patients with a video visit, click the link in your email invitation.</p>
                </div>
            </div> 
             <Footer />
             
         </div>
        );
    }
}

export default Authentication;