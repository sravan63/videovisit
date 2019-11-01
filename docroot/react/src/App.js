import React from 'react';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';

import { routes, RouteWithSubRoutes } from './routerConfig';

class App extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {userDetails: {}};
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
