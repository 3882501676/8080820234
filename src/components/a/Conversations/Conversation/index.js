// @flow
import React, { Component } from 'react';
import Fn from '../../../../utils/fn/Fn';
import MessageBox from '../../../elements/display/messages/messagebox.js';

// import PropTypes from 'prop-types';

class Conversation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      ready: true,
      data: {},
      conversationData: {}
    }

    console.log('Conversation -- ', props)

    // this.fetchRecipientData = this.fetchRecipientData.bind(this)
  }

  // async fetchRecipientData(item) {
  //   let recipientId = item.participants[0];

  //   await Fn.fetchRecipientData({ self: this, recipientId })

  // }
  componentDidMount = () => {
    console.log('ConversationItem mounted', this.props);
    // this.fetchRecipientData(this.props.item)
  }

  // static getDerivedStateFromError(error) {
  //   // getDerivedStateFromError -> Update state so the next render will show the fallback UI.
  //   return { hasError: true };
  // }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
  }
  // componentWillReceiveProps() {
  //   console.log('Conversation ',this.props)
  // }
  // getDerivedStateFromProps = (nextProps, prevState) => {
  //   console.log('ConversationItem getDerivedStateFromProps', nextProps, prevState);
  // }

  // getSnapshotBeforeUpdate = (prevProps, prevState) => {
  //   console.log('ConversationItem getSnapshotBeforeUpdate', prevProps, prevState);
  // }

  componentDidUpdate = () => {
    console.log('ConversationItem did update');
    console.log('Conversation ', this.props)
  }

  componentWillUnmount = () => {
    console.log('ConversationItem will unmount');
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      this.state.ready &&
      <div
        id={this.props.activeConversation.id}
        className="conversation-item flex flex-column w-100 ph3">
        <MessageBox
          {...this.props}

          activeConversation={this.props.activeConversation}
          updateConversations={this.props.updateConversations}
          conversations={this.props.conversations}
          updateActiveConversation={this.props.updateActiveConversation}
        />
      </div>
    );
  }
}


export default Conversation;