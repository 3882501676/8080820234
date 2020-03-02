import React from 'react';
import ReactDOM from 'react-dom';
import Files from './Files';

it('Files renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Files />, div);
  ReactDOM.unmountComponentAtNode(div);
});
