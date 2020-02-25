import React from 'react';
import { shallow } from 'enzyme';
import Conference from './conference/conference';
jest.mock('../../../pexip/complex/EventSource.js', () => ({
  doSomething: jest.fn()
}))

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
        const instance2 = wrapper.instance();
        expect(instance2.props.history.push).toHaveBeenCalled();
    });

});