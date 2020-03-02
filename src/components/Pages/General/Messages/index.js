// @flow
import React, { Component } from "react";
import AccountContext, {
  AccountConsumer
} from "../../../../utils/context/AccountContext.js";
import PageTitle from "../../../elements/layout/PageTitle_B.js";
import FilePond from "../../../elements/upload/Filepond.js";
import { Drawer, Skeleton, Checkbox } from "antd";
import { SearchBar } from "antd-mobile";
import { Icon, Spinner, Dialog } from "@blueprintjs/core";
import MBox from "../../../elements/display/messages/MBox.js";
import { Fn, app } from "../../../../utils/fn/Fn.js";
import ConversationItem from "../../../a/Conversations/ConversationItem/index.js";
import "./style.css";
import Transition from "../../../Layouts/Transition.js";
import moment from 'moment';
import Loading from '../../../elements/Loading.js';


var GeoPattern = require("geopattern")
window.GeoPattern = GeoPattern

class Messages extends React.Component {
  
  constructor(props) {
    
    super(props)

    this.state = {
      hasError: false,
      drawerOpen: false,
      activeFile: {},
      ready: false,
      conversationReady: false,
      activeStream: {},
      streams: [],
      activeConversation: [],
      activeConversationIndex: 0,
      conversations: [],
      connections: [],
      connectionsReady: false,
      isOpen: false,
      checked: [],
      group: [],
      buttonLoading: false,
      isSendingMessage: false
      // isMobil
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
    this.openFilePanel = this.openFilePanel.bind(this);
    this.fetchConnections = this.fetchConnections.bind(this);

    this.selectConversation = this.selectConversation.bind(this);
    this.updateActiveConversation = this.updateActiveConversation.bind(this);
    this.setActiveConversation = this.setActiveConversation.bind(this);
    // this.updateConversations = this.updateConversations.bind(this)
    this.activateSearch = this.activateSearch.bind(this);
    this.extractAuthors = this.extractAuthors.bind(this);
    this.reload = this.reload.bind(this);
    this.start = this.start.bind(this);
    this.newConveration = this.newConversation.bind(this);
    this.groupChat = this.groupChat.bind(this);
    this.newChat = this.newChat.bind(this);
    this.addUserToGroupChat = this.addUserToGroupChat.bind(this);
    this.startGroupChat = this.startGroupChat.bind(this);
    this.messageFullScreen = this.messageFullScreen.bind(this);
    this.markAllAsSeen = this.markAllAsSeen.bind(this)

    this.chatGroupName = React.createRef()

  }
  // newCo3nversation(user) {
  //   let
  // }
  markAllAsSeen = async(conversation) => {


    let currentUserId = Fn.get('account').user.id;

    for(let item of conversation.messages) {
      item.seen.push(currentUserId)
    }

    await app.updateConversation({ self: this, conversation, updateTimestamp: false })


  }
  componentWillReceiveProps() {
    // let conversations = this.state.conversations;
    // let sorted = conversations.sort((a, b) => b.updatedAt.unix() - a.updatedAt.unix())
    // this.setState({
    //   conversations: conversations
    // })
  }
  messageFullScreen() {

    var elem = document.getElementById("MessageBox")

    if (document.webkitFullscreenElement) {
      document.webkitCancelFullScreen();
    } else {
      elem.webkitRequestFullScreen();
    }

  }
  async startGroupChat() {
    this.setState({
      buttonLoading: true
    });

    let groupName = this.chatGroupName.current.value;
    let author = Fn.get('account').user;

    let users = this.state.group;
    let users_ = new Set();
    users_.add(author)
    // console.log("users_ Set", users_);
    for (let user of users) {
      users_.add(user);
      // console.log("user", user);
    }
    let type = "main";
    // console.log("users_ Set", users_);
    let u = Array.from(users_);
    await Fn.createGroupConversation({ self: this, users: u, type, name: groupName });
  }
  addUserToGroupChat(config) {
    const { user, index } = config;
    let checked = this.state.checked;
    checked[index] = !this.state.checked[index];
    let group = this.state.group;
    group.push(user);
    this.setState({
      checked: checked,
      group: group
    });
  }
  newChat() {
    this.setState({
      dialogType: "single"
    });
    this.toggleDialog();
  }
  async groupChat() {
    this.setState({
      dialogType: "multi"
    });
    this.toggleDialog();

    let connections = Fn.get("account").user.profile.connections;
    let checked = new Array(connections.length).fill(false);
    await app
      .fetchConnections({ self: this, connections: connections })
      .then(connections_ => {
        this.setState({
          connections: connections_,
          connectionsReady: true,
          checked: checked
        });
      });
  }
  async newConversation(user) {
    // console.log("doc", data);

    let selfUserId = this.context.account.user.id;

    let recipientId = user.id;
    let type = "main";

    // let participants = [selfUserId, recipientId];

    const conversationExists = await Fn.checkConversationExists({
      self: this,
      selfUserId,
      recipientId
    });

    if (!conversationExists.exists) {
      // console.log('participants',participants)

      await Fn.createNewConversation({
        self: this,
        selfUserId,
        recipientId,
        type
      });
      this.toggleDialog()
      this.reload();
      // this.props.history.push("/messages");
    } else {
      // Fn.getConversationData({})
      Fn.store({
        label: "activeConversation",
        value: conversationExists.conversation
      });
      this.toggleDialog()
      this.reload();
      // this.props.history.push("/messages");
    }

    // return await Fn.sendMessage({ doc, self: this })
  }
  toggleDialog() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  async reload() {
    this.setState({ ready: false });
    setTimeout(() => {
      this.start();
    }, 500);
  }
  async fetchConnections() {


    let connections = Fn.get("account").user.profile.connections;
    // let checked = new Array(connections.length).fill(false);
    await app
      .fetchConnections({ self: this, connections: connections })
      .then(connections_ => {
        this.setState({
          connections: connections_,
          connectionsReady: true
          // checked: checked
        });
      });


  }
  async start() {
    let self = this;
    let type =
      typeof this.props.type !== "undefined" ? this.props.type : "main";

    await this.fetchConnections();

    await app.fetchConversations({
      self: this,
      userId: this.context.account.user.id,
      type: 'private'
    }).then(async conversations => {

      // console.log("fetchConversations response ", conversations);

      for (let conversation of conversations) {

        conversation.authors = []

        let participants = conversation.participants;

        for (let author of participants) {

          // console.log(" ");
          // console.log(" ");
          // console.log(" ");
          // console.log("[[ conv participant ]] ", author);
          // console.log(" ");
          // console.log(" ");
          // console.log(" ");

          // let author_ = await fetch(Fn.api("users") + author)
          //   .then(res => {
          //     return res.json();
          //   })
          //   .then(res => {
          //     return res;
          //   });

          let author_ = await Fn.fetchUser({ self: this, userId: author }).then(user => {
            return user
          })

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

          conversation.authors.push(author_);

        }
      }

      // self.setState({
      //   conversations: res,
      //   activeConversation: res[0]
      // });

      // console.log(" ");
      // console.log(" ");
      // console.log(" ");
      // console.log("[[ updated conversations ]] ", conversations);
      // console.log(" ");
      // console.log(" ");
      // console.log(" ");

      self.setState({
        conversations: conversations,
        activeConversation: conversations[0],
        ready: true,
        conversationReady: true
      });

      setTimeout(() => {
        if (document.getElementById("MessagesList")) {
          document.getElementById("MessagesList").scroll({
            top: 999999999999,
            left: 0,
            behavior: "smooth"
          });
        }
      }, 500);
    });

    if (localStorage.getItem("activeConversation") !== null) {
      // console.log("activeConversation", Fn.get("activeConversation"));

      // console.log("history", this.props.history);

      this.setActiveConversation();
    }

    // console.log("Messages mounted : props", this.props);

    // console.log("Messages mounted : state", this.state);
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

  activateSearch() {
    this.setState({
      messageSearchActive: true
    });
  }

  updateActiveConversation(data) {

    const { conversations, activeConversation } = data;

    this.setState({
      activeConversation: activeConversation,
      conversations: conversations
    });
  }
  async selectConversation(data) {

    const { conversation } = data;

    this.setState({
      conversationReady: false,
      activeConversation: conversation
    });

    // console.log("select conversation", data);

    // this.setState({
    //   activeConversation: conversation
    // });

    Fn.set("activeConversation", conversation)

    setTimeout(() => {

      this.setState({
        conversationReady: true
      })

    }, 100)

    // setTimeout(() => {
    // }, 500);

    Fn.get("isMobile") && this.setState({ drawerOpen: false });

    setTimeout(() => {
      if (document.getElementById("MessagesList")) {
        document.getElementById("MessagesList").scroll({
          top: 999999999999,
          left: 0,
          behavior: "smooth"
        });
      }
    }, 500);
  }
  setActiveConversation() {
    let a = setInterval(() => {
      if (localStorage.getItem("activeConversation") !== null) {
        if (
          this.state.ready &&
          Fn.get("activeConversation") !== null &&
          Fn.get("activeConversation") !== {}
        ) {
          let active = Fn.get("activeConversation").id;

          let conversations = this.state.conversations;

          // console.log("Conversations to filter ", conversations);

          let filtered = conversations.filter(c => c.id === active);

          // console.log("filtered ", filtered);

          if (filtered.length > 0) {
            this.setState({ activeConversation: filtered[0] });
          } else {
            this.setState({ activeConversation: conversations[0] });
          }

          this.markAllAsSeen(conversations[0])

          clearInterval(a);
        }
      }
    }, 200);
  }

  openFilePanel(file) {
    this.setState({
      activeFile: file
    });
    this.toggleDrawer();
  }

  toggleDrawer() {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    });
  }
  closeDialog() {
    this.setState({
      isOpen: false
    });
  }
  componentDidMount = async () => {
    this.start();
    // let connections = Fn.get("account").user.profile.connections;
    // let connections = Fn.get("connections");
    // let checked = new Array(connections.length).fill(false);

    this.setState({
      // connections: connections,
      // connectionsReady: false,
      // checked: checked
    });

    this.context.setPage({ title: "Messages", subtitle: "..."})


  };
  render() {
    const dialogTypes = ["single", "multi"]
    const emptyArray = []
    const selfUserId = Fn.get('account').user.id;
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <>
        {!this.state.ready && !this.props.dashboard && <Loading />}
        <section
          id="Messages"
          className={
            (this.props.padding !== false ? "  pa4-ns " : "  ") +
            " flex flex-column w-100 mw8 center pv4- ph0 pb6- mt3- "
          }
        >


          <div className="flex flex-row justify-between bs-b bs-none-ns">
            {/* <div className="flex flex-column ph4 ph0-ns mb3 mt3- -mt3-ns mb4-ns">
              <PageTitle
                title={"Messaging"}
                docs={this.state.conversations}
                ready={this.state.ready}
              />
            </div> */}
            {
              <div className="flex flex-row ph4 ph0-ns mb3 mt3- -mt3-ns mb4-ns">
                <button
                  className="br1- round bs-b bg-black-20 ph3 pv2 pointer bn relative "
                  onClick={this.newChat}
                >
                  <span className="f5 fw6 white pv0 flex items-center justify-center">
                    New Message
                  </span>
                </button>
                <button
                  className="br1- round bs-b bg-black-20 ph3 pv2 pointer bn relative ml3 "
                  onClick={this.groupChat}
                >
                  <span className="f5 fw6 white pv0 flex items-center justify-center">
                    Group Chat
                  </span>
                </button>

                <button
                  className="bg-transparent ph3 pv2 pointer bn relative ml3 "
                  onClick={this.messageFullScreen}
                >
                  <Icon
                    icon={"fullscreen"}
                    iconSize={15}
                    className="black-30"
                  />
                </button>
              </div>
            }

            {/* {!this.props.dashboard && (
              <div
                onClick={this.reload}
                className={
                  (Fn.get("isMobile") ? " -top-6vh " : " top-6vh ") +
                  " absolute top-0 right-0 pa4 pointer black-20- hover-black-40 flex flex-row items-center z-9 "
                }
              >
                <span className="mr2 f5 fw4 black-30">
                  {this.state.ready ? "reload" : "loading"}
                </span>{" "}
                {this.state.ready ? (
                  <Icon icon="refresh" iconSize={15} className="black-40" />
                ) : (
                  <Spinner size={15} className="black-40" />
                )}
              </div>
            )} */}

            {Fn.get("isMobile") && (
              <div
                className={
                  "  recipientList flex flex-row bg-transparent ph4 bt b--black-05 pv3 "
                }
              >
                <div
                  onClick={this.toggleDrawer}
                  className="pointer flex flex-row ph0 pv2 f5 fw6 white-80 -black-50 w-100 justify-center items-center ba- bg-black-20 b--black-05- ph4 tc round bs-a"
                >
                  <span className="flex">Select recipient</span>
                  <Icon
                    icon="follower"
                    iconSize={15}
                    className="white-40 -black-20 ml3"
                  />
                </div>
              </div>
            )}
          </div>

          {this.state.ready && this.state.conversations.length === 0 && (
            <div
              className="flex flex-row ph0 pb3 items-center justify-start"
              id=""
            >
              <span className="f6 fw5 black-50 pv2 ph3 ba b--black-05">
                You have not started any conversations yet
              </span>
            </div>
          )}

          <div
            id="MessageBox"
            className={
              (Fn.get("isMobile") ? " flex-column " : " flex-row br4 ") +
              "  flex-row br4- flex flex-wrap justify-between overflow-hidden bg-white mb5  bs-b "
            }
          >
            {!Fn.get("isMobile") && (
              <div
                className={
                  (this.props.dashboard === true ? " w-30 " : " w-30 ") +
                  (Fn.get("isMobile") ? " w-100  " : "  ") +
                  " recipientList flex flex-column bg-white br b--black-05"
                }
              >
                {/* <div
                  className="flex ph3 pv3 bb bt br b--black-05"
                  style={{ background: "#fdfdfd" }}
                >
                  <div
                    id=""
                    className=" bs-b br3 -round overflow-hidden  isNotMobile bb b--black-05  message-input-wrapper flex -absolute -bottom-0 w-100 "
                  >
                    <form className="flex flex-row w-100 ma0">
                      <div className="flex flex-column w-80">
                        <input
                          required=""
                          placeholder="Search users"
                          className="bn pv3 ph4 f4 fw5 black-30"
                          type="text"
                        />
                      </div>
                      <div className="flex flex-column w-20 bl b--black-05">
                        <button
                          type="submit"
                          className="flex h-100 items-center justify-center f6 bg-white bn"
                        >
                          +
                        </button>
                      </div>
                    </form>
                  </div>
                </div> */}
                {/* const myData = [].concat */}

                {this.state.ready &&
                  this.state.conversations.length > 0 &&
                  this.state.conversations.sort((a, b) => moment(b.updatedAt) - moment(a.updatedAt)).map((item, index) => (
                    <Transition>
               
                    <div
                      onClick={() => {
                        this.selectConversation({
                          conversation: item,
                          // activeConversation: item
                        })
                      }
                      }
                      id={item.id}
                      className={
                        (item.id === this.state.activeConversation.id ? " bg-light-blue " : " bg-white ") +
                        " pointer conversation-item flex flex-column w-100"
                      }
                    >

                      {!item.group && (
                        <div
                          className={
                            (item.id === this.state.activeConversation.id ? "  " : " bb b--black-05 ") +
                            " flex flex-row items-center pv3 ph4 "
                          }
                        >
                          <div className="conversation-recipient-avatar flex flex-row">
                            <div className=" pointer flex flex-column pv2 pr3 items-center justify-center">
                              <div
                                className="cover bg-center"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "100px",
                                  boxShadow: "0 0px 0px 6px #ffffff9e",
                                  background:
                                    item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0].profile.picture.length
                                      ? "url('" + item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0].profile.picture + "')"
                                      : GeoPattern.generate((item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0] && item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0].profile && item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0].profile.name.first) + (item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0] && item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0].profile && item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0].profile.name.last)).toDataUrl()
                                }}
                              />
                            </div>
                          </div>

                          <div className=" flex flex-column items-start justify-center">
                            <div className=" raleway -raleway flex flex-row  fw6">
                              <div className=" flex f5 fw5- black-70 ">
                                {item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0] && item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0].profile && item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0].profile.name.first}
                              </div>
                              <div className=" flex f5 fw5- ml1 black-70">
                                {item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0] && item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0].profile && item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0].profile.name.last}
                              </div>
                            </div>

                            <div className=" flex flex-row pt1">
                              <div className=" raleway flex f6 fw5 black-20 ">
                                {item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0] && item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0].profile && item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0].profile && item.authors.filter(a => a.id !== item.participants.filter(a => a.id !== selfUserId)[0])[0].profile.additional.role}
                              </div>
                            </div>
                          </div>

                          <div className=" flex flex-row w-100"></div>
                        </div>
                      )}

                      {item.group && (
                        <div
                          className={
                            (this.isActive() ? "  " : " bb b--black-05 ") +
                            " flex flex-row items-center pv3 ph4 "
                          }
                        >
                          <div className="conversation-recipient-avatar flex flex-row justify-between w-100">
                            <div className=" pointer flex flex-row pv2 pr3 items-center justify-start">

                              <div
                                className="cover bg-center mh2- "
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "100px",
                                  boxShadow: "0 0px 0px 6px #ffffff9e",
                                  background:
                                    GeoPattern.generate(item.name).toDataUrl()
                                }}
                              />

                            </div>
                            <div className=" flex flex-column w-100 items-start justify-center">
                              <div className=" raleway -raleway flex flex-row  fw6">
                                <div className=" flex f5 fw5- black-70 ">
                                  {item.name}
                                </div>

                              </div>
                            </div>

                            <div className="flex w-40 flex-row items-center">
                              {item.authors && item.authors.length && item.authors
                                .filter(a => a.id !== item.author)
                                .map((item, index) => (
                                  <div
                                    className="cover bg-center mh2"
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      borderRadius: "100px",
                                      backgroundImage:
                                        'url("' + item.profile.picture + '")',
                                      boxShadow: "0 0px 0px 6px #ffffff9e"
                                    }}
                                  />
                                ))}
                            </div>

                          </div>
                        </div>
                      )}
                    </div>
                    </Transition>
                  ))}

                {!this.state.ready && (
                  <div className="pa3-">
                    <div className="flex items-center justify-center rans-a ph4- -ph0-ns bg-light-blue pulse h4">
                      {/* <Skeleton active />
                      <Skeleton active /> */}
                      <span className="flex f5 fw5 black-30">Loading</span>

                    </div>
                  </div>
                )}
              </div>
            )}

            <div
              className={
                (Fn.get("isMobile")
                  ? " w-100 "
                  : this.props.dashboard === true
                    ? " w-70 "
                    : "  w-70 bg-white ") + " flex flex-column"
              }
            >
              {this.state.conversations.length > 0 && (
                <MBox
                  conversationReady={this.state.conversationReady}
                  type={"discussion-large"}
                  conversation={this.state.activeConversation}
                  // conversations={this.sta}
                  // activeConversationIndex={this.state.activeConversationIndex}
                  conversations={this.state.conversations}
                  stream={this.state.activeStream}
                  updateActiveConversation={this.updateActiveConversation}
                  isSendingMessage={this.state.isSendingMessage}
                  dashboard={this.props.dashboard}
                  ready={this.state.conversationReady}
                  selfUserId={selfUserId}
                // load={this.props.load}
                />
              )}
            </div>
          </div>
        </section>

        <Dialog
          className={"bp3-light"}
          onClose={this.toggleDialog}
          // title={this.state.dialogTitle}
          // onValueChange={this.onValueChange}
          {...this.state}
        >

          {dialogTypes.includes(this.state.dialogType) && (
            <div className="flex flex-column ph4- pt4- pb2-">

              <div className="flex flex-column pt3-">
                {/* <div className="form-row flex flex-column">

                    <div className="form-row flex flex-column pb4">
                      <input
                        ref={this.searchTerm}
                        type={"text"}
                        placeholder={"Search by Name"}
                        className="flex flex-column ph3 pv2 bn round bg-white black-50 f5 fw5 bs-a- w-100"
                      />
                    </div>
                  </div> */}

                <div
                  className="flex flex-column"
                  style={{ maxHeight: "400px", overflow: "auto" }}
                >
                  <div className="mb0 mt0 raleway f5 fw5  mb-0 flex flex-row items-center justify-start black-50 pa3 bg-white-40">
                    <span>Your Network Connections</span>
                    <div className="pv1 ph2 br1 black fw6 bg-white ml3">
                      <span class="">
                        {this.state.connections.length}
                      </span>
                    </div>
                  </div>

                  {!this.state.connectionsReady && (
                    <div className="flex mr3 pv4 items-center justify-center">
                      <div className="sp sp-3balls-small"></div>
                    </div>
                  )}


                  {this.state.connectionsReady &&
                    this.state.connections.map((item, index) => (
                      <div
                        onClick={
                          this.state.dialogType === "single" &&
                          (() => this.newConversation(item))
                        }
                        className="flex flex-row justify-between"
                      >
                        <div
                          // to={"/user/" + item.id}
                          className={
                            "    trans-a pointer flex flex-row-ns flex-row items-center justify-between  w-100-s bn-ns bb b--black-05 pa3 hover-bg-white-70 w-100"
                          }
                        >

                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "100px",
                              background: item.profile.picture.length
                                ? "url(" + item.profile.picture + ")"
                                : GeoPattern.generate(
                                  item.profile.picture
                                ).toDataUrl()
                            }}
                            className="cover bg-center"
                          />
                          <div
                            className={
                              " flex flex-row flex-auto -flex-column pt2-ns- pl3  flex f5 fw6 black-70 raleway "
                            }
                          >
                            <div className={"  flex    "}>
                              {item.profile.name.first}
                            </div>
                            <div className={" flex ml1"}>
                              {item.profile.name.last}
                            </div>
                          </div>

                          {this.state.dialogType === "multi" && (
                            <div
                              className={
                                "  checkbox-square  flex flex-row -flex-column pt2-ns pl3 f5 fw6 black ph4  "
                              }
                            >
                              <Checkbox
                                type={"checkbox"}
                                onChange={() =>
                                  this.addUserToGroupChat({ user: item, index })
                                }
                                checked={this.state.checked[index]}
                              />
                            </div>
                          )}

                        </div>

                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
          {this.state.dialogType === "multi" && (
            <div
              className={
                "  flex flex-row justify-end -flex-column pv3 f5 fw6 black ph4 bt b--black-05  "
              }
            >
              <input
                ref={this.chatGroupName}
                type={"text"}
                placeholder={"Chat group name"}
                className="f5 fw5 br2 bg-white ph4 pv3 pointer bn relative w-100 "
              >

              </input>
            </div>
          )}
          {this.state.dialogType === "multi" && (
            <div
              className={
                "  flex flex-row justify-end -flex-column pv3 f5 fw6 black ph4 bt b--black-05  "
              }
            >
              <button
                onClick={this.startGroupChat}
                className="br0- round bs-b bg-black-20 ph5 pv3 pointer bn relative w-100 "
              >
                {this.state.buttonLoading && (
                  <div className="flex items-center justify-center mr3 pv2">
                    <div className="sp sp-3balls-small"></div>
                  </div>
                )}
                {!this.state.buttonLoading && (
                  <span className="f5 fw6 white pv0 flex items-center justify-center">
                    Start Group Chat
                  </span>
                )}
              </button>
            </div>
          )}
        </Dialog>

        <Drawer
          title="Recipient List"
          placement="right"
          closable={true}
          onClose={this.toggleDrawer}
          visible={this.state.drawerOpen}
          width={"80vw"}
        >
          {this.state.drawerOpen && (
            <div className="pointer flex flex-column justify-end items-center bg-white w-100 h-100">
              <div className="pointer flex flex-column justify-end items-center bg-white w-100 h-100">
                {/* <div
                  className={
                    " w-100 recipientList flex flex-column bg-white relative  h-100"
                  }
                >
                  {this.state.ready &&
                    this.state.conversations.length > 0 &&
                    this.state.conversations.map((item, index) => (
                      <ConversationItem
                        conversation={this.state.activeConversation}
                        selectConversation={this.selectConversation}
                        item={item}
                        key={index}
                        selfUserId={this.context.account.user.id}
                      />
                    ))}
                </div> */}
                <SearchBar
                  value={this.state.value}
                  placeholder="Search"
                  onSubmit={value => console.log(value, "onSubmit")}
                  onClear={value => console.log(value, "onClear")}
                  onFocus={() => console.log("onFocus")}
                  onBlur={() => console.log("onBlur")}
                  onCancel={() => console.log("onCancel")}
                  showCancelButton
                  onChange={this.onChange}
                />
              </div>
            </div>
          )}
        </Drawer>
      </>
    );
  }
}

export default Messages;
Messages.contextType = AccountContext;
