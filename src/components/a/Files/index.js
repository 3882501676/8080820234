import React, { Component } from 'react';
import AccountContext, { AccountConsumer } from '../../../utils/context/AccountContext.js';

import PageTitle from '../../elements/layout/PageTitle_B.js'
import FilePond from '../../elements/upload/Filepond.js';
import { Drawer } from 'antd';
// import Lightbox from 'react-lightbox-component';
import Lightbox from 'react-image-lightbox';

import 'react-image-lightbox/style.css';
import MBox from '../../elements/display/messages/MBox.js';

import { Fn, api, ui } from '../../../utils/fn/Fn.js';
import log from 'loglevel';
import './style.css';
window.log = log;

class Files extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      project: this.props.project,
      files: [],
      drawerOpen: false,
      innerDrawerOpen: false,
      activeFile: null,
      ready: true,
      lightboxActive: false,
      conversation: null,
      activeConversation: null,
      activeStream: null,
      conversationReady: false,
      mboxActive: false
    }

    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.toggleInnerDrawer = this.toggleInnerDrawer.bind(this)
    this.openFilePanel = this.openFilePanel.bind(this)
    this.toggleLightbox = this.toggleLightbox.bind(this)
    this.updateActiveConversation = this.updateActiveConversation.bind(this)

  }
  toggleInnerDrawer() {
    this.setState({
      innerDrawerOpen: !this.state.innerDrawerOpen
    })
  }
  toggleLightbox() {

    // alert()

    this.setState({
      lightboxActive: !this.state.lightboxActive,
      mboxActive: false
    })
  }
  async openFilePanel(file) {

    console.log('open file panel', file)
    this.setState({
      activeFile: file
    })
    this.toggleDrawer()

    await api.fetch('conversations', file.conversation).then(async conversation => {

      if (conversation) {
        Fn.set('activeConversation', conversation)
        console.log('conversation', conversation)
        console.log('!conversation.hasOwnProperty(messages)', !conversation.hasOwnProperty('messages'), conversation)
        if (!conversation.hasOwnProperty('messages')) {
          conversation.messages = []
        }
        if (!conversation.hasOwnProperty('authors')) {
          conversation.authors = []
        }
        if (!conversation.hasOwnProperty('participants')) {
          // conversation.participants = []
          conversation.participants = []
        }

        let participants = new Set(conversation.participants);
        participants.add(this.context.account.user.id)
        let p = Array.from(participants)

        conversation.participants = p;

        console.log('fetching authors', conversation.participants)

        let authors = await Fn.fetchAuthors({
          self: this, authorIds: conversation.participants
        })

        if (authors) {
          conversation.authors = authors;

          this.setState({
            activeConversation: conversation,
            conversationReady: true
          })

          console.log(' updated conversation ', conversation)
        }

      }

    })

  }

  toggleDrawer() {
    this.setState({
      drawerOpen: !this.state.drawerOpen,
      mboxActive: false
    })

    // let file 
  }

  componentDidMount = () => {

    console.log('Files mounted', this.props);
    if(this.props.type === "calendar") {
      let files = this.props.event.event.files;
      this.setState({
        files: files
      })
    }
    else {
      let files = this.props.project && this.props.project.files && this.props.project.files.reverse() || [];
      this.setState({
        files: files
      })
    }

  }
  updateActiveConversation(data) {

    const { conversations, activeConversation } = data

    this.setState({
      activeConversation: activeConversation,
      conversations: conversations
    })

  }



  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <>
        <section id="Files" className="flex flex-column w-100 pb4 pt0">
        <div className="flex flex-row mb4 ">
          <PageTitle
            title={"Files"}
            docs={this.state.files}
            ready={this.state.ready}
          />
          </div>

          <div className="file-dropzone flex flex-row flex-wrap mb3 ">
            <FilePond
              type={"files"}
              // type={this.props.type}
              project={this.props.type === "calendar" ? this.props.event : this.props.project}
              self={this}
            />
          </div>
          
          <div className="flex flex-row flex-wrap justify-between col-4">
            {
              this.state.files.map((file, index) => (
                <div
                  onClick={() => this.openFilePanel(file)}
                  className="pointer flex flex-column justify-between items-center  bg-white br2 bs-b- mb3">
                  <div className=" flex flex-column justify-start items-center ph4 pt4 w-100">
                    {
                      file.fileType === "application/pdf" &&
                      <>
                        <div
                          style={{ backgroundSize: '60%', backgroundImage: 'url("/icons/pdf2.png")' }}
                          className="w-100 h5 file-item bg-center flex flex-column justify-end items-center pa3 bg-white br4 bs-b- mb3-">

                        </div>

                        <h3 className="f6 fw5 white- black-30 tc pv3 ph3 word-break-all">{file.title}</h3></>

                    }

                    {
                      file.fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
                      <>
                        <div
                          style={{ backgroundSize: '60%', backgroundImage: 'url("/icons/docx.png")' }}
                          className="w-100 h5 file-item bg-center flex flex-column justify-end items-center pa3 bg-white br4 bs-b-mb3">

                        </div>

                        <h3 className="f6 fw5 white- black-30 tc pv3 ph3 word-break-all">{file.title}</h3></>

                    }

                    {
                      file.fileType === "image/png" &&

                      <> <div
                        style={{ backgroundImage: 'url("' + file.url + '")' }}
                        className="w-100 h5 file-item bg-cover bg-center cover flex flex-column justify-end items-center pa3 bg-white br4 bs-b-mb3">
                        {/* <h3 className="f5 fw6 white tc pv2 ph3 word-break-all">{file.title}</h3> */}
                      </div>

                        <h3 className="f6 fw5 white- black-30 tc pv3 ph3 word-break-all">{file.title}</h3></>

                    }

                    {
                      file.fileType === "image/jpg" || file.fileType === "image/jpeg" &&

                      <> <div
                        style={{ backgroundImage: 'url("' + file.url + '")' }}
                        className="w-100 h5 file-item bg-cover bg-center cover flex flex-column justify-end items-center pa3 bg-white br4 bs-b-mb3">
                        {/* <h3 className="f5 fw6 white tc pv2 ph3 word-break-all">{file.title}</h3> */}
                      </div>

                        <h3 className="f6 fw5 white- black-30 tc pv3 ph3 word-break-all">{file.title}</h3></>

                    }

                  </div>
                  {/* <div className="  flex flex-column justify-start items-center pa0 w-100 bt b--black-05">

                    <div className="flex flex-row justify-start w-100 pa2">

                      {this.props.invited.map((item, index) => (

                        <div className="flex flex-column pa1 ">

                          <div
                            style={{ width: '35px', height: '35px', backgroundImage: 'url("' + item.profile.picture + '")' }}
                            className="br1- round bg-cover bg-center" />

                        </div>

                      ))}
                      {
                        this.props.invited.length === 0 &&
                        <div className="flex flex-column pa1 ">

                          <span className="f5 fw5 black-50">No linked users</span>

                        </div>
                      }

                    </div>
                  </div> */}

                </div>
              ))
            }
          </div>

        </section>

        <Drawer
          title="Basic Drawer"
          placement={ui.mobile() ? "bottom" : "right"}
          closable={true}
          onClose={this.toggleDrawer}
          visible={this.state.drawerOpen}
          width={ui.mobile() ? "100vw" : "50vw"}
          height={ui.mobile() ? "90vh" : "100vh"}
          className={" child-bg-white "}
        >
          {
            this.state.drawerOpen &&
            <div className={(this.state.mboxActive ? " active " : " inactive ") + (" trans-a drawer-inner pointer flex flex-column justify-start items-center pa3 bg-white h-100")}>
              <h3 className="f5 fw6 black tc pv2 ph3 word-break-all">{this.state.activeFile.title && this.state.activeFile.title || ""}</h3>
              <div
                onClick={this.toggleLightbox}

                className="image-preview-wrapper pointer flex flex-column justify-end items-center bg-white br2 bs-b">
                <img

                  src={this.state.activeFile.url}
                  // style={{ backgroundImage: 'url("' + this.state.activeFile.url + '")' }}
                  className=" image-preview-wrapper w-auto h-auto file-item bg-cover bg-center cover flex flex-column justify-end items-center bg-white br3"

                />

              </div>

              <button
                onClick={this.toggleInnerDrawer}
                className="raleway flex flex-row items-center justify-center f5 fw6 black-50 ba bw1 b--black-05 bs-b- mt4 ph4 pv3 br2 w-100 tc mw5 hover-bg-near-white bg-white pointer trans-a ">Open discussion</button>
              {/* <Lightbox images={
                [
                  {
                    src: this.state.activeFile.url,
                    title: this.state.activeFile.title,
                    description: this.state.activeFile.description
                  }
                ]
              } /> */}
              <Drawer
                title="Basic Drawer"
                placement={ui.mobile() ? "bottom" : "right"}
                closable={true}
                onClose={this.toggleInnerDrawer}
                visible={this.state.innerDrawerOpen}
                width={ui.mobile() ? "100vw" : "50vw"}
                height={ui.mobile() ? "90vh" : "100vh"}
                className={" child-bg-white "}
              >{
                  this.state.conversationReady &&
                  <div
                    onClick={() => { this.setState({ mboxActive: true }) }}
                    className={(Fn.get('isMobile') ? " w-100 " : "  w-100 bg-white ")
                      + ("   mbox-wrapper pv4 ph5 flex flex-column ")}>
                    {
                      this.state.conversationReady &&
                      <MBox
                        type={"discussion-large"}
                        conversation={this.state.activeConversation}
                        conversations={[this.state.activeConversation]}
                        activeConversationIndex={0}
                        conversationReady={this.state.conversationReady}
                        // conversations={this.state.conversations}
                        stream={this.state.activeStream}
                        updateActiveConversation={this.updateActiveConversation}
                      // load={this.props.load}
                      />
                    }

                  </div>
                }</Drawer>

              {
                this.state.lightboxActive &&
                <Lightbox
                  mainSrc={this.state.activeFile.url}
                  nextSrc={this.state.activeFile.url}
                  prevSrc={this.state.activeFile.url}
                  onCloseRequest={() => this.setState({ lightboxActive: false })}

                />}
            </div>
          }

        </Drawer>
      </>

    );
  }
}

export default Files;
Files.contextType = AccountContext;