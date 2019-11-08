import React from 'react';
import { Route } from 'react-router-dom';

import Videovisit from './components/videovisit';
import Authentication from '../src/views/authentication/authentication';

import MyMeetings from './components/secure/mymeetings/myMeetings';

export const routes = [{
        path: '/',
        component: Videovisit
    },
    {
        path: '/login',
        component: Authentication
    },
    {
        path: '/myMeetings',
        component: MyMeetings
    }
];
export const RouteWithSubRoutes = (route) => (
<Route
      path={route.path}
      render={props => (
        <route.component {...props} routes={route.routes} />
)
}
/>
);