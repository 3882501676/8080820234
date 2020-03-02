import React from 'react';
import { getGlobal } from "reactn";


// import { Link } from "react-router-dom";
import { Icon } from "antd";
import AccountContext, { AccountConsumer } from '../../../../utils/context/AccountContext.js'
// import methods from '../../../../utils/methods';

import posed, { PoseGroup, Transition } from "react-pose";
import Fn from '../../../../utils/fn/Fn';
import MessageListItem from './MessageListItem.js';

const ItemC = React.forwardRef((props, ref) => {
  console.log('ItemC', props);
  return (
    <MessageListItem
      {...props}
      ref={ref}
      item={props.item}
      authorData={props.authorData}
      recipientData={props.recipientData} />
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
      y: {
        type: 'spring', stiffness: 1000, damping: 100, restDelta: 0.5,
        restSpeed: 10
      },
      default: { duration: 300 }
    }
  }
});
const TransitionItems = (props) => (
  console.log('TransitionItems', props),
  <Transition animateOnMount={true}  >
    {
      props.items.map((item, index) => (<MessageListItem
        enterAfterExit={true}
        beforeChildren={true}
        animateOnMount={true}
        key={index}
        item={item}
        authorData={props.authorData}
        recipientData={props.recipientData}
      />
      ))
    }
  </Transition>
)


class MessageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: true,
      // messages: []
    }

    console.log('Messagebox', props)


    this.avatar = this.avatar.bind(this);

    this.submitMessage = this.submitMessage.bind(this);

    // this.createNewConversation = this.createNewConversation.bind(this);
    this.fetchAuthor = this.fetchAuthor.bind(this)
    this.messageText = React.createRef()

  }

  submitMessage(e) {
    e.preventDefault();
    let text = this.messageText.current.value;
    let message = {
      author: this.context.account.user.id,
      text: text,
      createdAt: new Date().toString()
    }
    console.log(' ')
    console.log('Message to insert ', message)
    console.log(' ')
    this.insertMessage(message);

  }
  async fetchAuthor(item) {
    console.log('fetch author', item)

    await Fn.fetchAuthor({ self: this, authorId: item })


  }
  async insertMessage(message) {
    console.log('insertMessage', this.props)
    let messages = this.props.activeConversation.messages;
    let conversation = this.props.activeConversation;

    messages.unshift(message)
    // comments.push(comment)
    conversation.messages = messages;
    // window.project = project
    this.setState({
      messages
    })
    await Fn.updateConversationMessages({ self: this, conversation: conversation })


    this.messageText.current.value = null;
  }
  async avatar(item) {
    // console.log('avatar doc', item)
    let authorId = item.author;
    return await Fn.fetchAuthor({ self: this, authorId: authorId })
    // console.log('picture',picture)
    // if(picture) {
    //   return picture
    // }
    // return picture
    // let avatar =

    // return avatar;
  }


  // createNewConversation() {
  //   const userID = getGlobal().account.sub;
  //   const recipientID = this.props.chef._id;
  //   let conv = {
  //     "participants": [
  //       userID, recipientID
  //     ],
  //     "messages": []
  //   }
  //   window.db.conversations.insert(conv, (e, r) => {
  //     if (e) {
  //       console.log('Insert Conversation Error', r)
  //     }
  //     else {
  //       console.log('Insert Conversation Response', r)
  //       this.setState({ conversation: r, ready: true })
  //     }
  //   })
  // }
  // async findConversation() {
  //   const userID = getGlobal().account.sub;
  //   let chef = this.props.chef;
  //   this.setState({ chef: chef })
  //   const recipientID = chef._id;

  //   return await window.db.conversations.find({
  //     $and: [{ participants: recipientID }, { participants: userID }]
  //   }, (e, r) => {
  //     console.log('methods.findConversation', r[0])
  //     if (r.length === 0) {
  //       this.createNewConversation()
  //     } else {
  //       this.setState({ conversation: r[0] })
  //       setTimeout(() => {
  //         this.setState({ ready: true })
  //       }, 500)
  //       console.log('state', this.state)
  //     }
  //   })
  // }
  //   async createMessageList() {
  // this.setState({ ready: false })
  //     let comments = this.props.project.comments;
  //     let comments_ = []
  //     for(let item of comments) {
  //       let comment = {}
  //       let author = await Fn.fetchAuthor({ self: this, authorId: item.author });
  //       comment.text = item.text;
  //       comment.createdAt = item.createdAt;
  //       comment.author_ = author;
  //       comment.author = item.author;
  //       comments_.push(comment)
  //     }
  // console.log('comments',comments_)
  //     this.setState({
  //       comments: comments_,
  //       ready: true
  //     })
  //   }
  componentWillReceiveProps() {
    // this.createMessageList()
  }
  componentDidUpdate() {

    console.log(' ')
    console.log(' ')
    console.log(' ')

    console.log('MessageBox Conversation', this.props.conversation)

    console.log(' ')
    console.log(' ')
    console.log(' ')

  }
  componentDidMount() {

    // console.log('MessageBox props',this.props)
    // this.setState({ ready: true });
    // this.findConversation()
    // this.createMessageList()
    // console.log('MessageBox',this.props)
    // this.setState({
    //  messages: this.props.conversation.messages
    // })
  }
  render() {
    return (
      <div>
        <div className="flex flex-column relative h-100 flex-auto ">
          {this.state.ready && this.props.ready ?
            <>

              <div className="flex -absolute -bottom-0 w-100 bb b--black-05">
                <form onSubmit={this.submitMessage} className="flex flex-row w-100 ma0">
                  <div className="flex flex-column w-80">
                    <input
                      required={true}
                      placeholder={'Enter message ...'}
                      ref={this.messageText}
                      className="bn pa3 f6 fw5 black-60"
                      type="text"></input>
                  </div>
                  <div className="flex flex-column w-20 bl b--black-05">
                    <button
                      type={'submit'}
                      className="flex h-100 items-center justify-center f6 bg-black-10 bn">
                      <Icon type="arrow-right" />
                    </button>
                  </div>
                </form>
              </div>
              <div
                className="relative flex flex-auto flex-column w-100 bg-center bg-cover items-start justify-end relative overflow-hidden "
              >
                <List
                  animateOnMount={true}
                  className="messages-list db relative overflow-auto w-100 pb3 ">
                  <TransitionItems
                    items={this.props.activeConversation.messages}
                    authorData={this.props.activeConversation.authorData}
                    recipientData={this.props.activeConversation.recipientData}
                  // fetchAuthor={this.fetchAuthor}
                  // recipientID={this.state.recipient._id} 
                  // avatar={this.avatar} 
                  />
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

export default MessageBox;
MessageBox.contextType = AccountContext