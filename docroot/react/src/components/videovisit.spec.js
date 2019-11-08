import React from 'react';
import { shallow } from 'enzyme';
import Videovisit from './videovisit';

describe("Videovisit Component", function() {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<Videovisit />);
    });

    it("Render Videovisit component", function() {
        const instance = wrapper.instance();
        expect(instance).toBeDefined();
    });

});