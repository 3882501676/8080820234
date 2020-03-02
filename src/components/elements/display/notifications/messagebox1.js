// import React, { Component, getGlobal, setGlobal, useGlobal } from "react";
import React from 'react';
import { getGlobal } from "reactn";
import { Icon } from "antd";
import posed, { PoseGroup, Transition } from "react-pose";
import moment from 'moment';
import './style.css';

const ItemC = React.forwardRef((props, ref) => {
  console.log('ItemC', props);
  // diff(b) {
  //   let now = new Date()
  //   let a = moment(now);
  //   let dif = a.diff(b)
  // }
  return (
    <div
      key={props.item.createdAt}
      ref={ref}
      style={props.style}
      className={(props.recipientID !== props.item.author ? "row-reverse justify-start message-list-item " : " message-list-item justify-start ") + (" items-start flex flex-row w-100 pb4")}
    > {console.log('', props.recipientID), console.log('', props.item.author)}
      <div style={{ backgroundImage: `url(` + props.avatarAuthor(props.item) + `)` }}
        className="avatar-s flex flex-column bg-cover bg-center br2" />
      <div className={(props.recipientID !== props.item.author ? "tr" : " tl") + (" flex flex-column w-100 message-text-box ph3 pt3 pb4 br3 mh2 mw5 right bs-b bg-white relative")}>
        {props.item.text}

        <div className="message-sent-time flex flex-column">
          <span className=" fw5 black-30">{moment(props.item.createdAt).fromNow()}</span>
        </div>
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
    y: 0,
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
      props.items.map(item =>
        <Item
          enterAfterExit={true}
          beforeChildren={true}
          animateOnMount={true}
          key={item.createdAt}
          item={item}
          recipientID={props.recipientID}
          avatarAuthor={props.avatarAuthor} />)
    }
  </Transition>
)

class MessageBox1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      doc: {},
      chef: {},
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
    this.insertMessage(message)
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
  avatar() {
    // console.log('avatar doc', this.props)
    let avatar =
      typeof this.state.recipient !== "undefined"
        ? this.state.recipient.picture
        : "http://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914";
    return avatar;
  }
  avatarAuthor(message) {
    const authorID = message.author;
    // console.log('author', id, this.props.chef.recipient._id)
    if (message.author === this.state.recipient.sub) {
      return this.state.recipient.picture
    }
    else {
      return getGlobal().account.picture
    }
  }
  async getRecipientDetail(doc) {
    // let data = { doc, self: this };
    // console.log('docinfo.js getRecipientDetail doc', data)
    // let doc_ = await methods.getRecipientDetail(data);
    // console.log('getRecipientDetail', doc_)
  }

  createNewConversation() {
    const userID = getGlobal().account.sub;
    const recipientID = this.props.chef.sub;
    let conv = {
      "participants": [
        userID, recipientID
      ],
      "messages": []
    }
    // window.db.conversations.insert(conv, (e, r) => {
    //   if (e) {
    //     console.log('Insert Conversation Error', r)
    //   }
    //   else {
    //     console.log('Insert Conversation Response', r)
    //     this.setState({ conversation: r, ready: true })
    //   }
    // })
    let apiurl = "https://homechef-51a6.restdb.io/rest/";
    let collection = 'conversations';

    // let query =  '/?q={"$and":[{"participants":"' + userID + '"},{"participants":"' + recipientID + '"}]}';
    let endpoint = apiurl + collection;
    let config = {
      method: "POST",
      headers: {
        "origin": "localhost",
        "x-apikey": "5dbadbac64e7774913b6e751",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(conv)
    }
    return fetch(endpoint, config).then(res => { return res.json() }).then(res => {

      console.log('new conv', res)
      this.setState({ conversation: res, ready: true })

    })
  }
  async findConversation() {

    const userID = getGlobal().account.sub;
    let chef = this.props.chef;

    this.setState({ chef: chef })
    const recipientID = chef.sub;

    let apiurl = "https://homechef-51a6.restdb.io/rest/";
    let collection = 'conversations';

    let query = '?q={"$and":[{"participants":"' + userID + '"},{"participants":"' + recipientID + '"}]}';
    let endpoint = apiurl + collection + query;

    console.log('[[ Endpoint ]]', endpoint)
    let config = {
      headers: {
        "origin": "localhost:3000",
        "x-apikey": "5dbadbac64e7774913b6e751",
        "Content-Type": "application/json"
      }
    }
    return fetch(endpoint, config).then(res => {

      return res.json()
    }).then(r => {
      console.log('findconversation', r)
      if (r.length === 0) {
        this.createNewConversation()
      } else {
        this.setState({ conversation: r[0] })
        setTimeout(() => {
          this.setState({ ready: true })
        }, 500)
        console.log('[[ findConversation ]]', this.state)
      }
    })
    // return await window.db.conversations.find({
    //   $and: [{ participants: recipientID }, { participants: userID }]
    // }, (e, r) => {
    //   console.log('methods.findConversation', r[0])

    //   if (r.length === 0) {
    //     this.createNewConversation()
    //   } else {
    //     this.setState({ conversation: r[0] })
    //     setTimeout(() => {
    //       this.setState({ ready: true })
    //     }, 500)
    //     console.log('[[ findConversation ]]', this.state)
    //   }
    // })
  }
  insertMessage2(message) {
    const convID = this.state.conversation._id;
    const conv = this.state.conversation;
    conv.messages.unshift(message);

    window.db.conversations.update({ _id: convID }, conv, (e, r) => {
      this.findConversation()
    })

    this.messageText.current.value = null;
  }
  insertMessage(message) {
    const convID = this.state.conversation._id;
    const conv = this.state.conversation;
    conv.messages.unshift(message);
    this.setState({ conv: conv })
    this.messageText.current.value = null;
    let apiurl = "https://homechef-51a6.restdb.io/rest/";
    let collection = 'conversations';

    // let query =  '?q={"$and":[{"participants":"' + userID + '"},{"participants":"' + recipientID + '"}]}';
    let endpoint = apiurl + collection + "/" + convID;

    console.log('[[ Endpoint ]]', endpoint)
    let config = {
      method: "PUT",
      headers: {
        "origin": "localhost:3000",
        "x-apikey": "5dbadbac64e7774913b6e751",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(conv)
    }
    return fetch(endpoint, config).then(res => {

      return res.json()
    }).then(r => {
      console.log('insertMessage', r)
      // return this.findConversation()

    })
}
  showWidget(widget) {
    window.widget.open();
  }
  checkUploadResult(resultEvent) {
    if (resultEvent.event === "success") {
    }
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
        <div className="messageBox flex flex-column relative h-100 flex-auto">
          {this.props.conversationReady && this.state.ready ?
            <>
              <div className="flex flex-auto flex-column relative bg-white">
                <div
                  className=" relative flex flex-auto flex-column w-100 bg-center bg-cover items-start justify-end pa3 relative overflow-hidden"
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
              <div className="flex -absolute -bottom-0 w-100">
                <form onSubmit={this.submitMessage} className="flex flex-row w-100 ma0">
                  <div className="flex flex-column w-80">
                    <input
                      required={true}
                      placeholder={'Enter message ...'}
                      ref={this.messageText}
                      className="bn pa3 f4 fw5 black-60- white bg-black-20"
                      type="text"></input>
                  </div>
                  <div className="flex flex-column w-20 bl b--black-05">

                    <button type={'submit'} className={Fn.get('theme').config.theme.colorScheme.bg + ("- bg-black-20 flex h-100 items-center justify-center f4 bn white")}><Icon type="arrow-right" /></button>
                  </div>
                </form>
              </div>
              <div
                className=" relative flex flex-auto flex-column w-100 bg-center bg-cover items-start justify-end relative overflow-hidden "
              > <List animateOnMount={true} className="messages-list db relative overflow-auto w-100 pa4 ">
                  <TransitionItems
                    items={this.state.conversation.messages}
                    recipientID={this.state.recipient.sub}
                    avatarAuthor={this.avatarAuthor} />
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

export default MessageBox1;
// {this.state.conversation.messages.map((item, index) => (
//   <Item key={item.createdAt} recipientID={this.state.recipient._id} item={item} avatarAuthor={this.avatarAuthor}  />
// ))}</TransitionItems>