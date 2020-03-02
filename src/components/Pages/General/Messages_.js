import React from "reactn";
import { getGlobal, setGlobal, useGlobal } from "reactn";
import { Empty, Skeleton, notification, message } from "antd";
import { Icon, Spinner } from '@blueprintjs/core';
import Fn from '../../../utils/fn/Fn.js';
// import AccountContext, { AccountConsumer } from '../../../utils/context/AccountContext.js';
import TransitionLayout from "../../Layouts/Transition";
import ListConversations from "../../elements/display/messages";
import PageTitle from "../../elements/layout/PageTitle_B";
import ConversationItem from '../../a/Conversations/ConversationItem/index.js';
import Conversation from '../../a/Conversations/Conversation/index.js';

import MessageDrawer from '../../elements/display/drawers/messageDrawer';
import AccountContext, { AccountConsumer } from "../../../utils/context/AccountContext.js";


window.getGlobal = getGlobal;
window.useGlobal = useGlobal;
window.setGlobal = setGlobal;

class Messages extends React.Component {
  constructor(props) {
    super(props);
    // console.log('PROPS', props)
    this.state = {
      docs: [],
      ready: false,
      insertModalVisible: false,
      docInfoVisible: false,
      activeConversation: {},
      loading: false,
      theme: Fn.get('theme').config.theme,
      drawerReady: true,
      conversations: [],
      activeConversation: {},
      // activeConversationData: {},
      conversationReady: false,
      messageSearchActive: false
    }

    this.fetchConversations = this.fetchConversations.bind(this);
    this.findActiveConversation = this.findActiveConversations.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.hideDrawer = this.hideDrawer.bind(this);
    this.refresh = this.refresh.bind(this);
    this.setReady = this.setReady.bind(this);
    this.selectConversation = this.selectConversation.bind(this)
    this.updateActiveConversation = this.updateActiveConversation.bind(this)
    this.setActiveConversation = this.setActiveConversation.bind(this)
    this.updateConversations = this.updateConversations.bind(this)
    this.activateSearch = this.activateSearch.bind(this)
  }
  activateSearch() {
    this.setState({
      messageSearchActive: true
    })
  }
  updateConversations(data) {

    const { } = data;


  }

  updateActiveConversation(data) {

    const { conversations, activeConversation } = data

    this.setState({
      activeConversation: activeConversation,
      conversations: conversations
    })


  }
  async selectConversation(data) {

    const { activeConversation } = data

    this.setState({
      conversationReady: false
    })

    console.log('select conversation', data)

    this.setState({
      activeConversation: activeConversation
    })

    Fn.store({ label: 'activeConversation', value: activeConversation })

    setTimeout(() => {

      this.setState({
        conversationReady: true
      })

    }, 500)

  }
  setReady() {
    this.setState({ ready: true })
  }
  async findActiveConversations(conversations) {
    // return await _fn.findActiveConversations({ conversations, self: this })

  }
  async fetchConversations() {

    const userId = this.context.account.user.id;

    console.log('User ID for conversations ', userId)

    if(userId){

      await Fn.fetchConversations({ userId, self: this })

    }

  }

  async refresh() {
    this.setState({
      ready: false,
      messageSearchActive: false
    });
    setTimeout(async () => {
      return await this.fetchConversations()
    }, 1000)

  }
  showDrawer(data) {
    const { conversation, chef } = data;
    this.setState({
      drawerReady: true,
      docInfoVisible: true,
      activeConversation: conversation,
      activeChef: chef
    });
    setGlobal({ activeConversation: conversation, activeChef: chef })
  }
  updateActiveDoc(data) {
  }
  hideDrawer(doc) {
    this.setState({
      drawerReady: false,
      docInfoVisible: false
    });
  }
  showModal = () => {
    this.setState({
      insertModalVisible: true
    });
  }
  handleOk = e => {
    // console.log(e);
    this.setState({
      insertModalVisible: false
    });
  }
  handleCancel = e => {
    // console.log(e);
    this.setState({
      insertModalVisible: false
    });
  }
  setActiveConversation() {

    let a = setInterval(() => {

      if (localStorage.getItem('activeConversation') !== null) {
        if (this.state.ready && Fn.get('activeConversation') !== {}) {

          let active = Fn.get('activeConversation').id;

          let conversations = this.state.conversations;

          console.log('Conversations to filter ', conversations)

          let filtered = conversations.filter(c => c.id === active);

          console.log('filtered ', filtered)


          if (filtered.length > 0) {
            this.setState({ activeConversation: filtered[0] })
          }
          else {
            this.setState({ activeConversation: conversations[0] })
          }

          clearInterval(a)

        }
      }

    }, 200)


  }
  componentWillUnmount() {
    // Fn.store({ label: 'activeConversation', value: null })
  }
  async componentDidMount() {

    console.log(' ')
    console.log(' ')
    console.log(' ')


    this.fetchConversations()

    if(localStorage.getItem('activeConversation') !== null) {
      console.log('activeConversation', Fn.get('activeConversation'))

      console.log('history', this.props.history)
  
      this.setActiveConversation()
    }
    

  }
  render() {
    return (
      <TransitionLayout>

        <section id="Home" className="w-100 mw9 center pa4">

          <div
            onClick={this.refresh}
            className="absolute top-0 right-0 pa4 pointer black-20 hover-black-40 flex flex-row items-center">
            <span className="mr2 f5 fw4">refresh</span> {this.state.ready ? <Icon icon="refresh" iconSize={15} /> : <Spinner size={15} />}
          </div>

          <div className="flex flex-row justify-between mb4 mt3">

            <PageTitle
              title={"Messages"}
              ready={this.state.ready}
              // theme={props.theme}
              // showInsertForm={this.showModal}
              docs={this.state.conversations}
            // activeDoc={this.state.activeProject}
            // updateActiveDoc={this.updateActiveDoc}
            // showButton={false}
            />

            <div id="ProjectSearch" className="flex flex-column w-20-ns w-100 items-end justify-end mb2">
              {!this.state.messageSearchActive && <button
                onClick={this.activateSearch}
                className={("br1- round bs-b bg-black-20 ph3 pv2 pointer bn relative w-100  ")} >

                <span className="f5 fw6 white pv0 flex items-center justify-center">

                  {this.state.buttonLoading
                    ? <Icon icon="loading" className={' absolute right-0 f4 black-60 mr2'} />
                    : <Icon icon={"search"} iconSize={12} className={(' f4 black-60- white  absolute right-0 mr3')} />} Search Messages</span>
              </button>}

              {this.state.messageSearchActive &&
                <button
                  // onClick={() => { message.info('Message search function coming soon ... ') }}
                  className={("br1- flex items-center justify-center relative round bs-b bg-black-20 ph3 pv2 pointer bn relative w-100 w5 pr4")} >

                  <input
                    placeholder={'Enter search term'}
                    className="f5 fw5 white bn bg-transparent pv0 flex items-center justify-center"
                  >

                  </input>

                  <Icon icon={"close"} iconSize={12} className={(' f4 black-60- white  absolute right-0 mr3')} />


                </button>}
            </div>
            {/* {this.state.locationIsSet &&
  <LocationSearchBar
    location={this.state.location}
    findLocation={this.findLocation}
    fetchProjects={this.fetchProjects2}

  />} */}

          </div>

          {this.state.ready &&

            <div className="flex flex-row h-100">

              <div id="Conversations_List" className="flex flex-row w-20 h-100">

                <div className="flex flex-column w-100 h-100 br b--black-10 bw1">
                  {
                    this.state.conversations.length > 0 && this.state.conversations.map((item, index) => (

                      <ConversationItem
                        activeConversation={this.state.activeConversation}
                        selectConversation={this.selectConversation}
                        item={item}
                        key={index}
                        selfUserId={this.context.account.user.id}
                      />

                    ))
                  }
                  {
                    this.state.conversations.length === 0 &&
                    <div className="flex flex-column w-100 pv4 pr3">
                      <div className="flex flex-column f5 fw6 black-70">
                        No messages yet
                        </div>
                      <div className="flex flex-column f6 fw5 black-50 pt2">
                        Connect to network members to start a conversation.
                        </div>
                    </div>
                  }
                </div>

              </div>

              <div className="flex flex-row w-60">

                <div className="flex flex-row w-100">
                  {this.state.conversations.length > 0 &&
                    <Conversation
                      ready={this.state.conversationReady}
                      activeConversation={this.state.activeConversation}
                      updateConversations={this.updateConversations}
                      conversations={this.state.conversations}
                      // activeConversationData={this.state.activeConversationData}
                      updateActiveConversation={this.updateActiveConversation}
                    />
                  }


                </div>

              </div>

              <div className="flex flex-row w-20">

                <div className="flex flex-row w-100">

                </div>

              </div>

            </div>
          }
        </section>

      </TransitionLayout>
    );
  }
}

export default Messages;
Messages.contextType = AccountContext
