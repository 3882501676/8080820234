import React from 'react';
import ReactDOM from 'react-dom';
import FormBio from './FormBio';

it('FormBio renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FormBio />, div);
  ReactDOM.unmountComponentAtNode(div);
});
