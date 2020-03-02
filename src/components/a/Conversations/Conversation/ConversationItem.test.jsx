import React from 'react';
import ReactDOM from 'react-dom';
import ConversationItem from './ConversationItem';

it('ConversationItem renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ConversationItem />, div);
  ReactDOM.unmountComponentAtNode(div);
});
