// @flow
import React, { Component } from "react";
import AccountContext, {
  AccountConsumer
} from "../../../utils/context/AccountContext.js";

import PageTitle from "../../elements/layout/PageTitle_B.js";
import FilePond from "../../elements/upload/Filepond.js";

// import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

import { Drawer } from "antd";
import MessageBoxProject from "../../elements/display/messages/messageboxProject.js";
import MBox from "../../elements/display/messages/MBox.js";

import { Fn, ui, api } from "../../../utils/fn/Fn.js";
import Transition from "../../Layouts/Transition";
import posed from "react-pose";

const Box = posed.div({
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
});

class NetworkActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      project: this.props.project,
      // : this.props.project.discussion || null,
      // files: this.props.project.files || [],
      drawerOpen: false,
      activeFile: {},
      ready: true,
      activeConversation: null,
      conversations: null,
      activeStream: null,
      isVisible: false
    };

   
  }
  

  render() {
    const isVisible = this.state.isVisible;

    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <>
        <section id="Discussion" className="flex flex-column w-100 pb4 pt0">
          {this.props.title !== null && (
            <PageTitle
              title={"Discussion"}
              docs={
                (this.state.activeConversation &&
                  this.state.activeConversation.messages) ||
                []
              }
              ready={this.state.conversationReady}
            />
          )}

          {/* <div className="file-dropzone flex flex-row flex-wrap ">
            <FilePond
              type="files"
              project={this.props.project}
              self={this}
            />
          </div> */}
          {!this.state.conversationReady && (
            <div
              className={
                (this.props.loadingAlign === "center"
                  ? " items-center justify-center "
                  : " items-center justify-start ") +
                " items-center justify-center  flex flex-row pv5 pr4"
              }
            >
              <div className="sp sp-3balls"></div>
            </div>
          )}
          {this.state.conversationReady && (
            <div
              className={
                " flex flex-column flex-auto box w-100 trans-o-fast trans-y-fast " +
                (this.state.isVisible
                  ? " opacity-1 transform-y-0 "
                  : " opacity-0 transform-y-50 ")
              }
            >
              <div style={{ height: ui.mobile() ? "54vh" : "auto" }}>
                <MBox
                  type={"discussion-large"}
                  conversation={this.state.activeConversation}
                  conversations={[this.state.activeConversation]}
                  activeConversationIndex={0}
                  // conversations={this.state.conversations}
                  stream={this.state.activeStream}
                  updateActiveConversation={this.updateActiveConversation}
                  size={this.props.size}
                  // load={this.props.load}
                />
              </div>
            </div>
          )}
          {/* </div> */}
        </section>

        <Drawer
          title="Basic Drawer"
          placement="right"
          closable={true}
          onClose={this.toggleDrawer}
          visible={this.state.drawerOpen}
          width={"60vw"}
        >
          {this.state.drawerOpen && (
            <div className="pointer flex flex-column justify-end items-center pa3 bg-white ">
              <h3 className="f5 fw6 black tc pv2 ph3 word-break-all">
                {this.state.activeFile.file.originalname}
              </h3>
              <div className="pointer flex flex-column justify-end items-center pa3 bg-white br2 bs-b mb2 mr2">
                <div
                  style={{
                    backgroundImage: 'url("' + this.state.activeFile.url + '")'
                  }}
                  className="h5 file-item bg-cover bg-center cover flex flex-column justify-end items-center pa3 bg-white br2 bs-b mb2 mr2"
                ></div>
              </div>
            </div>
          )}
        </Drawer>
      </>
    );
  }
}

export default NetworkActivity;
NetworkActivity.contextType = AccountContext;
