import React from 'react';
import { shallow } from 'enzyme';
import Conference from './conference';

describe("Conference Component", function() {
    let wrapper;
    const historyMock = { push: jest.fn() };
    localStorage.setItem('signedIn', true);
    beforeEach(() => {
        wrapper = shallow(<Conference history={historyMock} />);
    });
    afterEach(() => {
        localStorage.clear();
    });

    it("Render Conference component", function() {
        wrapper.setState({
            myMeetings: [{
                "host": { "firstName": "Joe" },
                "member": { "firstname": "Mama" }
            }]
        });
        const instance = wrapper.instance();
        instance.getHoursAndMinutes(11232232);
        expect(instance).toBeDefined();
    });

    it("Render Conference component", function() {
        const instance2 = wrapper.instance();
        expect(instance2.props.history.push).toHaveBeenCalled();
    });

});