import React from 'react';
import { shallow } from 'enzyme';
import Tempaccess from './tempaccess';
import * as axios from "axios"
jest.mock("axios");


describe("Tempaccess Component", function() {
    let wrapper;
    const historyMock = { push: jest.fn() };
    beforeEach(() => {
        wrapper = shallow(<Tempaccess history={historyMock} />);
    });

    it("Render Tempaccess component", function() {
        const instance = wrapper.instance();
        expect(instance).toBeDefined();
    });

    xit(" On Submit click get signOn", function() {
        const instance = wrapper.instance();
        axios.post.mockImplementation(() => Promise.resolve({ status: 200, data: {} }));
        instance.signOn();
        expect(axios.post).toHaveBeenCalledTimes(1);
    });

    xit(" On Submit click Call fail scenario for signOn", function() {
        const instance = wrapper.instance();
        axios.post.mockImplementation(() => Promise.reject({ status: 404, data: {} }));
        instance.signOn();
    });

    xit("handle onChange event for username", function() {
        const instance = wrapper.instance();
        var obj = {
            target: {
                value: "NC910742"
            }
        };
        instance.handleChange('username', obj);
        expect(wrapper.state().username).toEqual("NC910742");
    });

    xit("handle onChange event for password", function() {
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