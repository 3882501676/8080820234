import React from 'react';
import ReactDOM from 'react-dom';
import RecentWork from './RecentWork';

it('RecentWork renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RecentWork />, div);
  ReactDOM.unmountComponentAtNode(div);
});
