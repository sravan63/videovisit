import React from 'react';
import { shallow } from 'enzyme';
import TempAccess from './tempAccess';
import * as axios from "axios"
jest.mock("axios");


describe("TempAccess Component", function() {
    let wrapper;
    const historyMock = { push: jest.fn() };
    beforeEach(() => {
        wrapper = shallow(<TempAccess history={historyMock} />);
    });

    it("Render TempAccess component", function() {
        const instance = wrapper.instance();
        expect(instance).toBeDefined();
    });

    it(" On Submit click get LoginUserDetails", function() {
        const instance = wrapper.instance();
        axios.post.mockImplementation(() => Promise.resolve({ status: 200 }));
        instance.signOn();
        expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it(" On Submit click Call fail scenario for LoginUserDetails", function() {
        const instance = wrapper.instance();
        axios.post.mockImplementation(() => Promise.reject({ status: 404 }));
        instance.signOn();
    });

    it("handle onChange event for username", function() {
        const instance = wrapper.instance();
        var obj = {
            target: {
                value: "14404080"
            }
        };
        instance.handleChange('mrn', obj);
        expect(wrapper.state().mrn).toEqual("14404080");
    });

});