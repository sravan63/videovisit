import React from 'react';
import { shallow } from 'enzyme';
import Header from './header';

xdescribe("Header Component", function() {
    let wrapper;
    var data = {
        firstName: "joe",
        lastName: "mama"
    };
    localStorage.setItem("userDetails", JSON.stringify(data));
    beforeEach(() => {
        wrapper = shallow(<Header />);
    });

    it("On componentMount set State", function() {
        const instance = wrapper.instance();
        expect(instance).toBeDefined();
        expect(wrapper.state().name).toEqual("joe mama");
    });

    it("On componentMount Empty data ", function() {
        localStorage.clear();
        let wrap = shallow(<Header />);
        const instance2 = wrap.instance();
        expect(instance2).toBeDefined();
        expect(wrap.state().name).toEqual("");
    });

});