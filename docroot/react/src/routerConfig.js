import React from 'react';
import { Route } from 'react-router-dom';

import Videovisit from './components/videovisit';
import Authentication from '../src/views/authentication/authentication';
import GuestAuthentication from '../src/views/guest-authentication/guest-authentication';
import Setup from '../src/views/setup/setup';
import MyMeetings from './views/secure/my-meetings/my-meetings';
import VideoVisit from './views/secure/visit/visit';
import FailedAuthentication from './components/authentication-failed/authentication-failed';
import emailInstructions from "./components/email-instructions/email-instructions";

export const routes = [{
        path: '/',
        component: Videovisit
    },
    {
        path: '/login',
        component: Authentication
    },
    {
        path: '/guestlogin',
        component: GuestAuthentication
    },
    {
        path: '/setup',
        component: Setup
    },
    {
        path: '/myMeetings',
        component: MyMeetings
    },
    {
        path: '/videoVisitReady',
        component: VideoVisit
    },
    {
        path: '/authenticationFailed',
        component: FailedAuthentication
    },
    {
        path: '/mailTranslation',
        component: emailInstructions
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
