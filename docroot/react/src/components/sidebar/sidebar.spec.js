import React from 'react';
import { shallow } from 'enzyme';
import Sidebar from './sidebar';

describe("Sidebar Component", function() {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<Sidebar />);
    });

    it("Render Sidebar component", function() {
        const instance = wrapper.instance();
        expect(instance).toBeDefined();
    });

});