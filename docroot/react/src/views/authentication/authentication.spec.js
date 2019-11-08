import React from 'react';
import { shallow } from 'enzyme';
import Authentication from './authentication';

describe("Authentication View", function() {
    let wrapper;
    const historyMock = { push: jest.fn() };
    beforeEach(() => {
        wrapper = shallow(<Authentication history={historyMock} />);
        wrapper.setState({ tempAccessToken: true });
    });

    it("Call Authentication view", function() {
        const instance = wrapper.instance();
        expect(instance).toBeDefined();
    });

    it("On tempAccessToken set to Truthy", function() {
        const instance = wrapper.instance();
        instance.toggleLoginScreen(true);
        expect(wrapper.state().tempAccessToken).toEqual(true);
    });

    it("On tempAccessToken set to Falsy", function() {
        const instance = wrapper.instance();
        instance.toggleLoginScreen(false);
        expect(wrapper.state().tempAccessToken).toEqual(false);
    });

});