import React from 'react';
import { Route } from 'react-router-dom';

import Videovisit from './components/videovisit';
import Login from './components/login/login';
import TempAccess from './components/tempaccess/tempaccess';

//import MyMeetings from './components/secure/mymeetings/myMeetings';

export const routes = [
	{
		path: '/',
		component: Videovisit
	},
	{
		path: '/login',
		component: Login
	},
	{
		path: '/tempaccess',
		component: TempAccess
	}
];
export const RouteWithSubRoutes = (route)=>(
    <Route
      path={route.path}
      render={props => (
        <route.component {...props} routes={route.routes} />
      )}
    />
  );