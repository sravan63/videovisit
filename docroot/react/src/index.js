import 'core-js/es6/map';
import 'core-js/es6/set';
import 'raf/polyfill';
import 'babel-polyfill';
/*To Make the application works in IE(npm install babel-polyfill --save)*/

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom';



import App from './App';
import './index.css';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import userDetailsReducer from './miscellaneous/userDetailsReducer';

const store = createStore(userDetailsReducer);


ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>
	, document.getElementById('root'));


