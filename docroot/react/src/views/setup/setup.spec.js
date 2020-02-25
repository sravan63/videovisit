import React from 'react';
import { shallow } from 'enzyme';
import Setup from './setup';
jest.mock('../../pexip/complex/EventSource.js', () => ({
  doSomething: jest.fn()
}))

xdescribe("Setup Component", function() {
    let wrapper;
    const historyMock = { push: jest.fn() };
    localStorage.setItem('signedIn', true);
    beforeEach(() => {
        wrapper = shallow(<Setup history={historyMock} />);
    });
    afterEach(() => {
        localStorage.clear();
    });



    it("Render Setup component", function() {
        const instance2 = wrapper.instance();
        expect(instance2.props.history.push).toHaveBeenCalled();
    });

});