import React from "react";
import { getGlobal } from "reactn";
import io from "socket.io-client";

import { app, Fn, ui, api } from "../../../../utils/fn/Fn";

import AccountContext, {
  AccountConsumer
} from "../../../../utils/context/AccountContext.js";

import { Icon, message, Skeleton, Empty } from "antd";
import posed, { PoseGroup, Transition } from "react-pose";
import CommentListItem from "./CommentListItem.js";
// import { InView } from 'react-intersection-observer'

// const Component = () => (
//   <InView as="div" onChange={(inView, entry) => console.log('Inview:', inView)}>
//     <h2>Plain children are always rendered. Use onChange to monitor state.</h2>
//   </InView>
// )

// export default Component
var socket;
// const ItemC = React.forwardRef((props, ref) => {
//   return <InView as="div" onChange={(inView, entry) => console.log('Inview:', inView)}>
//  <CommentListItem {...props} ref={ref} />
// </InView>;
// });
const ItemC = React.forwardRef((props, ref) => {
  return <CommentListItem {...props} ref={ref} />;
});
const Item = posed(ItemC)({
  enter: {
    y: 0,
    opacity: 1,
    delay: 0,
    transition: {
      y: { type: "spring", stiffness: 1000, damping: 100 },
      default: { duration: 300 }
    }
  },
  exit: {
    y: -50,
    opacity: 1,
    delay: 300,
    transition: {
      y: { type: "spring", stiffness: 1000, damping: 100 },
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
      y: { type: "spring", ease: "easeInOut", stiffness: 1000, damping: 100 },
      default: { duration: 300 }
    }
  },
  exit: {
    y: 500,
    opacity: 0,
    delay: 0,
    transition: {
      y: {
        type: "spring",
        stiffness: 1000,
        damping: 100,
        restDelta: 0.5,
        restSpeed: 10
      },
      default: { duration: 300 }
    }
  }
});
const TransitionItems = props => (
  <Transition animateOnMount={true}>
    {props.items.map((item, index) => (
      <CommentListItem
        enterAfterExit={true}
        beforeChildren={true}
        animateOnMount={true}
        key={index}
        item={item}
        index={index}
        {...props}
      />
    ))}
  </Transition>
);

// const SOCKET_URI = 'http://localhost:8002';
// const SOCKET_URI = "http://3.135.242.213:8002"
const SOCKET_URI = "https://socketio.quantacom.co";

class MBox extends React.Component {
  socket = null;

  constructor(props) {
    super(props);
    this.state = {
      ready: true,
      messages: this.props.conversation.messages,
      conversation: this.props.conversation,
      stream: this.props.stream,
      authors: []
    };

    // console.log('Messagebox', props)
    this.avatar = this.avatar.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.initSocketConnection = this.initSocketConnection.bind(this);
    this.onClientDisconnected = this.onClientDisconnected.bind(this);
    this.onReconnection = this.onReconnection.bind(this);
    this.setupSocketListeners = this.setupSocketListeners.bind(this);
    this.onMessageRecieved = this.onMessageRecieved.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.scrollMessageBoxIntoView = this.scrollMessageBoxIntoView.bind(this);
    this.getAuthors = this.getAuthors.bind(this);
    this.markAsSeen = this.markAsSeen.bind(this)
    // this.extractAuthors = this.extractAuthors.bind(this)

    this.messageText = React.createRef();
    this.messagesList = React.createRef();
  }
  markAsSeen = async (item) => {
    // console.log('mark as seen => item',item)
    let conversation = this.props.conversation;
    // let messages = this.props.conversation.messages;
    let index = conversation.messages.findIndex(a => a.id === item.id);

    let seen = new Set()

    seen.add(this.props.selfUserId)

    conversation.messages[index].seen = [...seen]
    // console.log('updated message ',conversation.messages[index])

    await app.updateConversation({ self: this, conversation, updateTimestamp: false })

  }
  async extractAuthors() {
    let messages = this.props.conversation.messages;

    let authorIds = new Set();

    for (let item of messages) {
      authorIds.add(item.author);
    }

    let a = Array.from(authorIds);

    this.setState({
      authorIds: a
    });

    await Fn.fetchCommentAuthors({ self: this, authorIds: a });
  }
  async getAuthors() {
    // conversation.authors = [];
    let conversation = this.props.conversation;
    let authors = [];

    let participants = conversation.participants;

    for (let author of participants) {
      //   console.log(" ");
      //   console.log(" ");
      //   console.log(" ");
      //   console.log("[[ conv participant ]] ", author);
      //   console.log(" ");
      //   console.log(" ");
      //   console.log(" ");

      let author_ = await fetch(Fn.api("users") + author)
        .then(res => {
          return res.json();
        })
        .then(res => {
          return res;
        });

      // console.log(" ");
      // console.log(" ");
      // console.log(" ");
      // console.log("[[ author_ ]] ", author_);
      // console.log(" ");
      // console.log(" ");
      // console.log(" ");

      // console.log(" ");
      // console.log(" ");
      // console.log(" ");
      // console.log("[[ authors ]] ", conversation.authors);
      // console.log(" ");
      // console.log(" ");
      // console.log(" ");

      authors.push(author_);
    }
    this.setState({
      authors: authors,
      ready: true
    });
  }
  scrollMessageBoxIntoView() {
    if (this.props.dashboard) {
      !Fn.get("isMobile") &&
        document.querySelector("body").scroll({
          top: 475,
          left: 0,
          behavior: "smooth"
        });
    } else {
      !Fn.get("isMobile") &&
        document.querySelector("body").scroll({
          top: 90,
          left: 0,
          behavior: "smooth"
        });
    }
  }
  addMessage = message =>
    this.setState(state => ({ comments: [message, ...state.comments] }));

  async submitMessage(e) {
    e.preventDefault();

    this.setState({
      isSendingMessage: true
    });

    setTimeout(() => {
      if (document.getElementById("MessagesList")) {
        document.getElementById("MessagesList").scroll({
          top: document.getElementById("MessagesList").scrollHeight,
          left: 0,
          behavior: "smooth"
        });
      }
    }, 500);

    // on submitting the ChatInput form, send the message, add it to the list and reset the input
    // const message = { author: this.state.name, message: messageString }

    let authorId = this.context.account.user.id;
    let randomId =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);
    let message = {
      author: authorId,
      text: this.messageText.current.value,
      createdAt: new Date(),
      messageId: randomId,
      conversationId: this.props.conversation.id,
      seen: []
    };

    console.log("message ]]", message);

    if (!this.props.conversation.hasOwnProperty("participants")) {
      this.props.conversation.participants = [Fn.get("account").user.id];
    }
    let authorIds = this.props.conversation.participants;

    if (!authorIds.includes(authorId)) {
      // this.setState(this.state => ({ authorIds: [authorId, ...this.state.authorIds] }))

      let authorIds = this.state.authorIds;

      let a = new Set(authorIds);

      a.add(authorId);

      let b = Array.from(a);

      this.setState({ authorIds: b });

      await Fn.fetchCommentAuthor({ self: this, authorId: authorId });
    }

    this.socket.emit("message", JSON.stringify(message));

    this.messageText.current.value = null;

    // setTimeout(() => {

    //   if (document.getElementById('MessagesList')) {
    //     document.getElementById('MessagesList').scroll({
    //       top: 999999999999,
    //       left: 0,
    //       behavior: 'smooth'
    //     });
    //   }

    // }, 500)
  }

  /**
   *
   * Shows error if client gets disconnected.
   */
  onClientDisconnected() {
    // message.info('Connection Lost from server, please check your connection')
    console.log("[[ Socket.io server disconnected. ]]");
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
    console.log("[[ Socket.io server reconnected. ]]");
    // if (this.state.user) {
    //   // this.socket.emit("sign-in", this.state.user);
    //   // NotificationManager.success("Connection Established.", "Reconnected!");
    // }
  }

  onConnect() {
    console.log(" ", " ", " ", " ");
    console.log("[[ Socket.io server connected. ]]");
    console.log(" ", " ", " ", " ");

    // message.info('Server re-connected')
  }
  /**
   *
   * Setup all listeners
   */

  setupSocketListeners() {
    this.socket.on("ping", () => console.log("ping"));
    this.socket.on("connect", this.onConnect);
    this.socket.on("message", this.onMessageRecieved);
    this.socket.on("reconnect", this.onReconnection);
    this.socket.on("disconnect", this.onClientDisconnected);

    this.socket.emit("register", this.props.conversation.id);

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

  async onMessageRecieved(message) {

    // console.log(' ')
    // console.log('Message Received', message)
    // console.log(' ')

    // let messages = this.state.messages
    // let messages  = this.props.conversation.messages;

    // Fn.get("activeConversation");

    // messages.push(JSON.parse(message))

    // this.setState({ messages })

    // let conversation = Fn.get("activeConversation")
    let conversation = this.props.conversation;

    // conversation.messages = messages
    conversation.messages.push(JSON.parse(message))
    // console.log("onMessageReceived Mbox props", this.props);

    this.setState({
      isSendingMessage: false
    });

    await app.updateConversation({ self: this, conversation }).then(conversation => {

      // console.log('added message to conversation', conversation)

      if (document.getElementById("MessagesList")) {
        document.getElementById("MessagesList").scroll({
          top: document.getElementById("MessagesList").scrollHeight,
          left: 0,
          behavior: "smooth"
        });
      }
      // setTimeout(() => {

      // }, 500);
    })




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
  componentDidUpdate() {
    // console.log('MessageBox updated', this.props)
  }
  // componentWillReceiveProps() {
  //   this.setState({
  //     messages: [],
  //     conversation: null
  //   })
  // }
  async componentDidMount() {
    document.querySelector("body").scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });

    let scrollMessages = setInterval(() => {
      if (document.getElementById("MessagesList") !== null) {
        document.getElementById("MessagesList").scroll({
          top: document.getElementById("MessagesList").scrollHeight,
          left: 0,
          behavior: "smooth"
        });
        clearInterval(scrollMessages);
      }
    }, 250);

    // let targetIndex = userChatData.findIndex(u => u.id === targetId);

    // this.getAuthors();

    this.initSocketConnection();

    this.setupSocketListeners();



    // this.socket.emit("register", this.props.conversation.id);

    // this.extractAuthors()
    // console.log(" ");
    // console.log(" ");
    // console.log(" ");
    // console.log("MBox", this.props);
    // console.log(" ");
    // console.log(" ");
    // console.log(" ");

    setTimeout(() => {
      if (document.getElementById("MessagesList")) {
        document.getElementById("MessagesList").scroll({
          top: document.getElementById("MessagesList").scrollHeight,
          left: 0,
          behavior: "smooth"
        });
      }
    }, 500);
  }
  render() {

    // console.log('Mbox => Conversation ', this.props.conversation)
    return (
<>
      <div
            id="messageInput"
            style={{ background: "#fdfdfd" }}
            className={
              (this.props.inputPosition === "fixed-bottom" ? " fixed bottom-0 left-0  " : "")
              + (this.props.inputPosition === "standard" ? "   " : "")
              + (" w-100 z-999-0 flex ph3 pv3 bb bt br b--black-05 ")}
          >
            <div
              id=""
              className={
                (this.props.size === "small"
                  ? ""
                  : " bs-b br3- - round overflow-hidden ") +
                (Fn.get("isMobile")
                  ? "  isMobile bt- b--black-05 bs-a "
                  : " isNotMobile bb b--black-05 ") +
                " message-input-wrapper flex -absolute -bottom-0 w-100 mw9 center"
              }
            >
              <form
                onSubmit={this.submitMessage}
                className="flex flex-row w-100 ma0"
              >
                <div className="flex flex-column w-80">
                  <input
                    onClick={this.scrollMessageBoxIntoView}
                    required={true}
                    placeholder={"Enter text ..."}
                    ref={this.messageText}
                    className="bn pv3 ph4 f4 fw5 black-30"
                    type="text"
                  ></input>
                </div>
                <div className="flex flex-column w-20 bl b--black-05">
                  <button
                    type={"submit"}
                    className="flex h-100 items-center justify-center f6 bg-white bn"
                  >
                    <Icon type="arrow-right" />
                  </button>
                </div>
              </form>
            </div>
          </div>

      <div
        className={
          (ui.mobile() ? " bt- b--black-05 " : "  ") +
          " flex flex-column relative h-100 w-100 flex-auto "
        }
      >
        <div
          className={
            (ui.mobile() ? " column-reverse " : "  ") +
            " flex flex-column relative h-100 w-100 flex-auto "
          }
        >
          
          {/* {
                !this.state.ready &&

                <div className="trans-a ph4">
                  <Skeleton active />
                  <Skeleton active />
                </div>

              } */}

          {!this.state.ready && (
            <div className="pa3">
              <div className="trans-a ph4 ph0-ns bg-light-blue pulse">
                {/* <Skeleton active />
                <Skeleton active /> */}
              </div>
            </div>
          )}

          {this.state.ready && this.props.conversationReady && (
            <>
              <div
                style={{ background: "#fdfdfd" }}
                className={
                  (ui.mobile() ? " mh-74vh overflow-scroll " : "  ") +
                  " mh-75vh relative flex flex-auto flex-column w-100 bg-center bg-cover items-start justify-start relative overflow-hidden "
                }
              >
                {this.props.conversation.messages.length > 0 ? (

                  <List
                    ref={this.messagesList}
                    animateOnMount={true}
                    id="MessagesList"
                    className={
                      (this.props.type === "discussion-large" ? " vh64 " : "") +
                      (this.props.type === "project-overview" ? " vh50 " : "") +
                      (this.props.type === "calendar-event" ? " vh64 " : "") +
                      " vh47- messages-list mh-150--vh db relative overflow-auto w-100 pa3 "
                    }
                  >
                    {
                      this.props.ready &&
                      <TransitionItems
                        items={this.props.conversation.messages}
                        authors={this.props.conversation.authors}
                        fetchAuthor={this.fetchAuthor}
                        markAsSeen={this.markAsSeen}
                        // projectOwnerId={this.props.project.owner}
                        me={this.context.account.user.id}
                        isSendingMessage={this.state.isSendingMessage}


                      />
                    }

                    {this.state.isSendingMessage && (
                      <div className="ph3 pv2 flex flex-row items-end justify-end">
                        <div className="pulsating-dot small mr3"></div>
                      </div>
                    )}
                  </List>
                ) : (
                    <div className="flex flex-column pv3 f6 fw5 black-40 tc w-100">
                      No messages yet
                  </div>
                  )}
              </div>
            </>
          )
            // : <div className="flex flex-column flex-auto h-100 w-100 items-center justify-center">
            //   <div className="trans-a ph4">
            //     <Skeleton active />
            //     <Skeleton active />
            //   </div>
            // </div>
          }
        </div>
      </div>
      </>
    );
  }
}

export default MBox;
MBox.contextType = AccountContext;
