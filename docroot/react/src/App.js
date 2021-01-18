import React from 'react';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import Utilities from './services/utilities-service.js';

import { routes, RouteWithSubRoutes } from './routerConfig';

class App extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {userDetails: {}};
		Utilities.setLang('english');

	}	
	render() {
		return (
			<Router basename='/'>
				<div className='container-fluid p-0'>
					{routes.map((route, i) => (
					  <RouteWithSubRoutes key={i} {...route} />
					))}
				</div>
			</Router>     
		);
	}
}
export default App;
