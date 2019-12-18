import React from 'react';
import { shallow } from 'enzyme';
import Loader from './loader';

describe("Header Component", function() {
    let wrapper;
    var data = {
        firstName: "joe",
        lastName: "mama"
    };
    localStorage.setItem("userDetails", JSON.stringify(data));
    beforeEach(() => {
        wrapper = shallow(<Loader />);
    });



});