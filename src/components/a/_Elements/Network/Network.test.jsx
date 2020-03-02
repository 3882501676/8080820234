import React from 'react';
import ReactDOM from 'react-dom';
import Network from './Network';

it('Network renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Network />, div);
  ReactDOM.unmountComponentAtNode(div);
});
