import React from 'react';
import { shallow } from 'enzyme';
import MyMeetings from './myMeetings';

describe("MyMeetings Component", function() {
    let wrapper;
    const historyMock = { push: jest.fn() };
    beforeEach(() => {
        wrapper = shallow(<MyMeetings history={historyMock} />);
    });

    it("Render MyMeetings component", function() {
        const instance = wrapper.instance();
        expect(instance).toBeDefined();
    });

});