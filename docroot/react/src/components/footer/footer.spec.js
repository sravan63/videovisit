import React from 'react';
import { shallow } from 'enzyme';
import Footer from './footer';

describe("Footer Component", function() {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<Footer />);
    });

    it("Render Footer component", function() {
        const instance = wrapper.instance();
        expect(instance).toBeDefined();
    });

});