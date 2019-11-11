import React from 'react';
import { shallow } from 'enzyme';
import Ssologin from './Ssologin';
import * as axios from "axios"
jest.mock("axios");


xdescribe("Ssologin Component", function() {
    let wrapper;
    const historyMock = { push: jest.fn() };
    beforeEach(() => {
        wrapper = shallow(<Ssologin history={historyMock} />);
    });

    it("Render Ssologin component", function() {
        const instance = wrapper.instance();
        expect(instance).toBeDefined();
    });

    it(" On Submit click get LoginUserDetails", function() {
        const instance = wrapper.instance();
        axios.post.mockImplementation(() => Promise.resolve({ status: 200, data: {} }));
        instance.getLoginUserDetails();
        expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it(" On Submit click Call fail scenario for LoginUserDetails", function() {
        const instance = wrapper.instance();
        axios.post.mockImplementation(() => Promise.reject({ status: 404, data: {} }));
        instance.getLoginUserDetails();
    });

    it("handle onChange event for username", function() {
        const instance = wrapper.instance();
        var obj = {
            target: {
                value: "NC910742"
            }
        };
        instance.handleChange('username', obj);
        expect(wrapper.state().username).toEqual("NC910742");
    });

    it("handle onChange event for password", function() {
        const instance = wrapper.instance();
        var obj = {
            target: {
                value: "@online"
            }
        };
        instance.handleChange('password', obj);
        expect(wrapper.state().password).toEqual("@online");
    });

});