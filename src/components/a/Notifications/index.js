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

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      // project: this.props.project,
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
      
          {!this.state.ready && (
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
         
<div className="flex flex-column"></div>

        </section>

       
      </>
    );
  }
}

export default Notifications;
Notifications.contextType = AccountContext;
