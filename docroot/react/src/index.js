import 'core-js/es6/map';
import 'core-js/es6/set';
import 'raf/polyfill';
import 'babel-polyfill';
/*To Make the application works in IE(npm install babel-polyfill --save)*/

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom';



import App from './App';
import './index.less';


ReactDOM.render(
    <App />, document.getElementById('root'));