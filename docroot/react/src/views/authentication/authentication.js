import React from 'react';
import Header from '../../components/header/header';
import Sidebar from '../../components/sidebar/sidebar';
import Footer from '../../components/footer/footer';
import Ssologin from '../../components/ssologin/ssologin';
import Login from '../../components/login/login';
import './authentication.less';

class Authentication extends React.Component {
    constructor(props) {
        super(props);
        localStorage.clear();
        this.tempAccessToken= false;
        this.state = { tempAccessToken: false };
    }
    changeUnit(item){
        //this.setState({tempAccessToken:item});
        this.state.tempAccessToken = item;
        this.props.history.push('/login');
        console.log(this.state);
        
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
                       			 
             {this.state.tempAccessToken ? (
							<Login data={{tempAccessToken:this.state.tempAccessToken,changeUnit:this.changeUnit.bind(this)}}/>
						) : (
                            <Ssologin history={this.props.history} data={{tempAccessToken:this.state.tempAccessToken,changeUnit:this.changeUnit.bind(this)}}/>
                        )}
            </div> 
             <Footer />
             
		 </div>
        );
    }
}

export default Authentication;