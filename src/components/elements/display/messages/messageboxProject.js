import React from 'react';
import { getGlobal } from "reactn";
import io from 'socket.io-client';
import Fn from '../../../../utils/fn/Fn';
import AccountContext, { AccountConsumer } from '../../../../utils/context/AccountContext.js';

import { message } from "antd";
import { Icon } from "@blueprintjs/core";

import posed, { PoseGroup, Transition } from "react-pose";
import CommentListItem from './CommentListItem.js';

var socket;

const ItemC = React.forwardRef((props, ref) => {
  return (
    <CommentListItem {...props} ref={ref} />
  )
});
const Item = posed(ItemC)({
  enter: {
    y: 0,
    opacity: 1,
    delay: 0,
    transition: {
      y: { type: 'spring', stiffness: 1000, damping: 100 },
      default: { duration: 300 }
    }
  },
  exit: {
    y: -50,
    opacity: 1,
    delay: 300,
    transition: {
      y: { type: 'spring', stiffness: 1000, damping: 100 },
      default: { duration: 300 }
    }
  }
});
const List = posed.div({
  enter: {
    y: -50,
    opacity: 1,
    delay: 0,
    transition: {
      y: { type: 'spring', ease: 'easeInOut', stiffness: 1000, damping: 100 },
      default: { duration: 300 }
    }
  },
  exit: {
    y: 500,
    opacity: 0,
    delay: 0,
    transition: {
      y: {
        type: 'spring', stiffness: 1000, damping: 100, restDelta: 0.5,
        restSpeed: 10
      },
      default: { duration: 300 }
    }
  }
});
const TransitionItems = (props) => (
  <Transition animateOnMount={true}  >

    {
      props.items.map((item, index) => (
        <CommentListItem
          enterAfterExit={true}
          beforeChildren={true}
          animateOnMount={true}
          key={index}
          item={item}
          index={index}
          {...props}
        />
      ))
    }

  </Transition>
)

// const SOCKET_URI = 'http://localhost:8002';
// const SOCKET_URI = "http://3.135.242.213:8002"
const SOCKET_URI = "https://socketio.quantacom.co"

class MessageBoxProject extends React.Component {
  socket = null;

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      project: this.props.project,
      comments: this.props.project.comments,
      authors: []
    }

    console.log('Messagebox', props)

    this.avatar = this.avatar.bind(this);

    this.submitMessage = this.submitMessage.bind(this);

    this.messageText = React.createRef()

    this.addMessage = this.addMessage.bind(this)
    this.submitMessage = this.submitMessage.bind(this)
    this.initSocketConnection = this.initSocketConnection.bind(this)
    this.onClientDisconnected = this.onClientDisconnected.bind(this)
    this.onReconnection = this.onReconnection.bind(this)
    this.setupSocketListeners = this.setupSocketListeners.bind(this)
    this.onMessageRecieved = this.onMessageRecieved.bind(this)
    this.onConnect = this.onConnect.bind(this)
    this.extractAuthors = this.extractAuthors.bind(this)
    this.scrollMessageBoxIntoView = this.scrollMessageBoxIntoView.bind(this)

    this.messagesList = React.createRef();

  }
  scrollMessageBoxIntoView() {
    document.querySelector('body').scroll({
      top: 130,
      left: 0,
      behavior: 'smooth'
    })
  }
  addMessage = message =>
    this.setState(state => ({ comments: [message, ...state.comments] }))

  async submitMessage(e) {

    e.preventDefault();

    // on submitting the ChatInput form, send the message, add it to the list and reset the input
    // const message = { author: this.state.name, message: messageString }

    let authorId = this.context.account.user.id;
    let randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    let message = {
      author: authorId,
      text: this.messageText.current.value,
      createdAt: new Date(),
      id: randomId
    }

    console.log('message ]]', message)

    let authorIds = this.state.authorIds;

    if (!authorIds.includes(authorId)) {

      // this.setState(this.state => ({ authorIds: [authorId, ...this.state.authorIds] }))

      let authorIds = this.state.authorIds;

      let a = new Set(authorIds);

      a.add(authorId)

      let b = Array.from(a)

      this.setState({ authorIds: b })

      await Fn.fetchCommentAuthor({ self: this, authorId: authorId })
    }

    this.socket.emit('message', JSON.stringify(message))

    this.messageText.current.value = null;

    setTimeout(() => {

      if (document.getElementById('MessagesList')) {
        document.getElementById('MessagesList').scroll({
          top: 9999999999,
          left: 0,
          behavior: 'smooth'
        });
      }

    }, 500)

  }

  /**
     *
     * Shows error if client gets disconnected.
     */
  onClientDisconnected() {

    message.info('Connection Lost from server, please check your connection')
    console.log('[[ Socket.io server disconnected. ]]')
    // NotificationManager.error(
    //   "Connection Lost from server please check your connection.",
    //   "Error!"
    // );
  }

  /**
   *
   * Established new connection if reconnected.
   */
  onReconnection() {
    // message.info('Server re-connected')
    console.log('[[ Socket.io server reconnected. ]]')
    // if (this.state.user) {
    //   // this.socket.emit("sign-in", this.state.user);
    //   // NotificationManager.success("Connection Established.", "Reconnected!");
    // }
  }

  onConnect() {
    console.log(' ', ' ', ' ', ' ')
    console.log('[[ Socket.io server connected. ]]')
    console.log(' ', ' ', ' ', ' ')

    // message.info('Server re-connected')

  }
  /**
   *
   * Setup all listeners
   */

  setupSocketListeners() {
    this.socket.on("connect", this.onConnect)
    this.socket.on("message", this.onMessageRecieved);
    this.socket.on("reconnect", this.onReconnection);
    this.socket.on("disconnect", this.onClientDisconnected);
  }

  /**
   *
   * @param {MessageRecievedFromSocket} message
   *
   * Triggered when message is received.
   * It can be a message from user himself but on different session (Tab).
   * so it decides which is the position of the message "right" or "left".
   *
   * increments unread count and appends in the messages array to maintain Chat History
   */

  onMessageRecieved(message) {
    // console.log('Message', message)

    let comments = this.state.comments;

    comments.push(JSON.parse(message))

    this.setState({ comments: comments })

    //  this.addMessage(message)

  }
  async avatar(item) {

    // let authorId = item.author;
    // return await Fn.fetchAuthor({ self: this, authorId: authorId })

  }
  initSocketConnection() {
    this.socket = io.connect(SOCKET_URI);
  }

  async componentWillReceiveProps() {
    // this.createMessageList()
    // console.log('will receive props', this.props)
    // await Fn.fetchCommentAuthors({ self: this, comments: this.props.project.comments })
  }
  async extractAuthors() {

    let comments = this.props.project.comments;

    let authorIds = new Set();

    for (let item of comments) {
      authorIds.add(item.author)
    }

    let a = Array.from(authorIds)

    this.setState({
      authorIds: a
    })

    await Fn.fetchCommentAuthors({ self: this, authorIds: a })

  }
  componentDidUpdate() {
    // console.log('MessageBox updated', this.props)
  }
  async componentDidMount() {

    this.initSocketConnection()

    this.setupSocketListeners()

    this.extractAuthors()

    // console.log('MessageBox', this.props)

  }
  render() {
    return (
      <div className="flex flex-column relative h-100 w-100 flex-auto ">
        <div className="flex flex-column relative h-100 w-100 flex-auto ">
          {
            this.state.ready ?
              <>

                <div id="" className="flex -absolute -bottom-0 w-100 bb b--black-05">
                  <form onSubmit={this.submitMessage} className="flex flex-row w-100 ma0">
                    <div className="flex flex-column w-80">
                      <input
                        onClick={this.scrollMessageBoxIntoView}
                        required={true}
                        placeholder={'Enter text ...'}
                        ref={this.messageText}
                        className="bn pa3 f4 fw5 black-50"
                        type="text"></input>
                    </div>
                    <div className="flex flex-column w-20 bl b--black-05">
                      <button
                        type={'submit'}
                        className="flex h-100 items-center justify-center f6 bg-white bn">
                        <Icon icon="arrow-right" />
                      </button>
                    </div>
                  </form>
                </div>
                <div className="relative flex flex-auto flex-column w-100 bg-center bg-cover items-start justify-start relative overflow-hidden" >

                  {this.state.comments.length > 0 ?

                    <List
                      ref={this.messagesList}
                      animateOnMount={true}
                      id="MessagesList"
                      className={(this.props.type === "discussion-large" ? " vh64 " : " vh47 ") + (" messages-list mh-150--vh db relative overflow-auto w-100 pa3 ")}>
                      <TransitionItems
                        items={this.props.project.comments}
                        authors={this.state.authors}
                        fetchAuthor={this.fetchAuthor}
                        projectOwnerId={this.props.project.owner}
                        me={this.context.account.user.id}
                      />

                    </List>

                    :
                    <div className="flex flex-column pv3 f6 fw5 black-40 tc w-100">
                      No comments yet
                </div>
                  }
                </div>

              </>
              : <div className="flex flex-column flex-auto h-100 w-100 items-center justify-center">
                <div className="flex flex-column pa5">
                  <Icon type="loading" className="f2 black-20" />
                </div>
              </div>
          }
        </div>
      </div>
    );
  }
}

export default MessageBoxProject;
MessageBoxProject.contextType = AccountContext