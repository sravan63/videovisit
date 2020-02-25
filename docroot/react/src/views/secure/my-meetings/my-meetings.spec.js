import React from 'react';
import { shallow } from 'enzyme';
import MyMeetings from './my-meetings';

xdescribe("MyMeetings Component", function() {
    let wrapper;
    const historyMock = { push: jest.fn() };
    localStorage.setItem('signedIn', true);
    beforeEach(() => {
        wrapper = shallow(<MyMeetings history={historyMock} />);
    });
    afterEach(() => {
        localStorage.clear();
    });

    it("Render MyMeetings component", function() {
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

    it("Render MyMeetings component", function() {
        const instance2 = wrapper.instance();
        expect(instance2.props.history.push).toHaveBeenCalled();
    });

});