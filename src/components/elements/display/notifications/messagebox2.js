import React from 'react';
import { getGlobal } from "reactn";

// import { Link } from "react-router-dom";
import { Icon } from "antd";

// import methods from '../../../../utils/methods';

import posed, { PoseGroup, Transition } from "react-pose";

const ItemC = React.forwardRef((props, ref) => {
  console.log('ItemC', props);
  return (
    <div
    key={props.item.createdAt}
     ref={ref} 
     style={props.style}
     className={(props.recipientID !== props.item.author ? "row-reverse justify-end message-list-item " : " message-list-item justify-start ") + (" items-start flex flex-row w-100 pb3")}
     >
      <div style={{ backgroundImage: `url(` + props.avatarAuthor(props.item) + `)` }}
        className="avatar-s flex flex-column bg-cover bg-center br2" />
      <div className={(props.recipientID !== props.item.author ? "tr" : " tl") + (" flex flex-column ph3 w-100")}>
        {props.item.text}
      </div>
    </div>
  );
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
  // enter: { opacity: 1, y: 0 },
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
      y: { type: 'spring', stiffness: 1000, damping: 100,restDelta: 0.5,
      restSpeed: 10 },
      default: { duration: 300 }
    }
  }
});
const TransitionItems = (props) => (
  <Transition animateOnMount={true}  >
{
    props.items.map(item => <Item enterAfterExit={true} beforeChildren={true}  animateOnMount={true} key={item.createdAt} item={item} recipientID={props.recipientID} avatarAuthor={props.avatarAuthor} />)
}
</Transition>
)


class MessageBox2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      doc: {},
      cjef: {},
      visible: this.props.visible,
      placement: "right",
      test: this.props.visible,
      activeTab: "1",
      characters: [],
      conversation: {
        messages: [],
        participants: []
      },
      recipient: this.props.chef
    };

    console.log('Messagebox1', props)

    this.showWidget = this.showWidget.bind(this);
    this.checkUploadResult = this.checkUploadResult.bind(this);
    this.avatar = this.avatar.bind(this);
    this.avatarAuthor = this.avatarAuthor.bind(this);
    this.goToTab1 = this.goToTab1.bind(this);
    this.tabOnChange = this.tabOnChange.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.getRecipientDetail = this.getRecipientDetail.bind(this);
    this.createNewConversation = this.createNewConversation.bind(this);
    this.insertMessage = this.insertMessage.bind(this)
    this.findConversation = this.findConversation.bind(this)
    this.messageText = React.createRef()

  }

  submitMessage(e) {
    e.preventDefault();
    let text = this.messageText.current.value;
    let message = {
      author: JSON.parse(localStorage.getItem('account')).sub,
      text: text,
      createdAt: new Date()
    }
    this.insertMessage(message);

  }
  insertMessage(message) {
    const convID = this.state.conversation._id;
    const conv = this.state.conversation;
    conv.messages.unshift(message);

    window.db.conversations.update({ _id: convID }, conv, (e, r) => {
      this.findConversation()
    })
    this.messageText.current.value = null;
  }
  avatar() {
    console.log('avatar doc', this.props)
    let avatar =
      typeof this.state.recipient !== "undefined"
        ? this.state.recipient.picture
        : "http://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914";
    return avatar;
  }
  avatarAuthor(message) {
    const authorID = message.author;
    console.log('author', message, this.state)
    if (message.author === this.state.recipient._id) {
      return this.state.recipient.avatar
    }
    else {
      return getGlobal().account.picture
    }
  }
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };
  onClose = () => {
    this.setState({
      visible: false
    });
  };
  onChange = e => {
    this.setState({
      placement: e.target.value
    });
  };
  tabOnChange(e) {
    console.log(e);
    this.setState({
      activeTab: e
    });
  }
  goToTab1() {
    this.setState({ activeTab: "1" });
  }
  
  async getRecipientDetail(doc) {
    // let data = { doc, self: this };
    // console.log('docinfo.js getRecipientDetail doc', data)
    // let doc_ = await methods.getRecipientDetail(data);
    // console.log('getRecipientDetail', doc_)
  }

  createNewConversation() {
    const userID = getGlobal().account.sub;
    const recipientID = this.props.chef._id;
    let conv = {
      "participants": [
        userID, recipientID
      ],
      "messages": []
    }
    window.db.conversations.insert(conv, (e, r) => {
      if (e) {
        console.log('Insert Conversation Error', r)
      }
      else {
        console.log('Insert Conversation Response', r)
        this.setState({ conversation: r, ready: true })
      }
    })
  }
  async findConversation() {
    const userID = getGlobal().account.sub;
    let chef = this.props.chef;
    this.setState({ chef: chef })
    const recipientID = chef._id;

    return await window.db.conversations.find({
      $and: [{ participants: recipientID }, { participants: userID }]
    }, (e, r) => {
      console.log('methods.findConversation', r[0])
      if (r.length === 0) {
        this.createNewConversation()
      } else {
        this.setState({ conversation: r[0] })
        setTimeout(() => {
          this.setState({ ready: true })
        },500)
        console.log('state', this.state)
      }
    })
  }
  
  showWidget(widget) {
    window.widget.open();
  }
  checkUploadResult(resultEvent) {
    if (resultEvent.event === "success") {
    }
  }
  getRecipient() {
    
  }
  componentDidUpdate() {
  }
  componentDidMount() {
    // this.setState({ ready: true });
    this.findConversation()
  }
  render() {
    return (
      <div>
        <div className="flex flex-column relative h-100 flex-auto ">
          { this.props.conversationReady && this.state.ready ?
            <>
              <div className="flex flex-auto flex-column relative">
                <div
                  className=" relative flex flex-auto flex-column w-100 bg-center bg-cover items-start justify-end pa3 relative overflow-hidden bb b--black-05"
                >
                  <div
                    className={
                      (this.props.theme.main === "dark" ? " " : " ")
                      + ("List_A_item cursor-pointer sans-serif flex flex-row flex-auto w-100  items-center justify-start pa0 mb4- br2 overflow-hidden relative ")}
                  >
                    <div
                      style={{ backgroundImage: `url(` + this.avatar(this.props.chef) + `)` }}
                      className="avatar flex flex-column bg-cover bg-center br2"
                    />                 <div className="flex flex-column pa3 w-100">
                      <div className="flex flex-row w-100">
                        <div className={
                          (this.props.theme.main === "dark" ? " white " : " black-70 ")
                          + ("flex flex-column mr2 f5 fw6 ")}>
                          {this.props.chef.given_name}
                        </div>
                        <div className={
                          (this.props.theme.main === "dark" ? " white-50 " : " black-50 ")
                          + ("flex flex-column flex-auto fw4 f5 black-50 ")}>
                          {this.props.chef.family_name}
                        </div>
                      </div>
                    </div></div>
                </div>
              </div>
              <div className="flex -absolute -bottom-0 w-100 bb b--black-05">
                <form onSubmit={this.submitMessage} className="flex flex-row w-100 ma0">
                  <div className="flex flex-column w-80">
                    <input required={true} placeholder={'Enter message ...'} ref={this.messageText} className="bn pa3 f4 fw5 black-60" type="text"></input>
                  </div>
                  <div className="flex flex-column w-20 bl b--black-05">

                    <button type={'submit'} className="flex h-100 items-center justify-center f4 bg-black-10 bn"><Icon type="arrow-right" /></button>
                  </div>
                </form>
              </div>
              <div
                className=" relative flex flex-auto flex-column w-100 bg-center bg-cover items-start justify-end relative overflow-hidden "
              > <List animateOnMount={true} className="messages-list db relative overflow-auto w-100 pa4 ">
              <TransitionItems items={this.state.conversation.messages} recipientID={this.state.recipient._id} avatarAuthor={this.avatarAuthor} />
            </List>
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

export default MessageBox2;
