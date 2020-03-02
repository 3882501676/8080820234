import React from 'react';
import ReactDOM from 'react-dom';
import OwnProjectList from './OwnProjectList';

it('OwnProjectList renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<OwnProjectList />, div);
  ReactDOM.unmountComponentAtNode(div);
});
