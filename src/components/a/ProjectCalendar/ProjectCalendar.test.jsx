import React from 'react';
import ReactDOM from 'react-dom';
import ProjectCalendar from './ProjectCalendar';

it('ProjectCalendar renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ProjectCalendar />, div);
  ReactDOM.unmountComponentAtNode(div);
});
