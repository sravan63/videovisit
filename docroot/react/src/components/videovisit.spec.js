import React from 'react';
import { shallow } from 'enzyme';
import Videovisit from './videovisit';

xdescribe("Videovisit Component", function() {
    let wrapper, wrapper2, wrapper3;
    const locationMock = { pathname: jest.fn() };
    const historyMock = { push: jest.fn() };
    const user = {
        ssoSession: "true"
    };
    localStorage.setItem('userDetails', JSON.stringify(user));
    beforeEach(() => {
        wrapper = shallow(<Videovisit history={historyMock} location={locationMock}/>);
    });
    it("Render Videovisit component and redirect to myMeetings Page", function() {
        wrapper3 = shallow(<Videovisit history={historyMock} location={locationMock}/>);
        const instance = wrapper3.instance();
        instance.redirectToSsoLoginPage();
        expect(instance.props.history.push).toHaveBeenCalledWith('/myMeetings');
    });

    it("When sso session is expired redirect to Login page", function() {
        localStorage.clear();
        wrapper3 = shallow(<Videovisit history={historyMock} location={locationMock}/>);
        const instance = wrapper3.instance();
        instance.redirectToSsoLoginPage();
        expect(instance.props.history.push).toHaveBeenCalledWith('/login');
    });

    it("Redirect to Login component", function() {
        wrapper.setProps({ location: { pathname: "/login" } });
        const instance = wrapper.instance();
        instance.redirectToSsoLoginPage();
        expect(instance.props.location.pathname).toEqual("/login");
    });

    it("Redirect to Login component when no path specified", function() {
        localStorage.clear();
        wrapper2 = shallow(<Videovisit history={historyMock} location={locationMock}/>);
        wrapper2.setProps({ location: { pathname: "/" } });
        const instance = wrapper2.instance();
        instance.redirectToSsoLoginPage();
        expect(instance.props.location.pathname).toEqual("/");
    });

});