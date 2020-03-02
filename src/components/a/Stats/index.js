// @flow
import React, { Component } from "react";
import { Link } from 'react-router-dom';
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


class Stats extends React.Component {
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
      isVisible: false,
      stats: [],
      projects: []
    };
  }
  async componentDidMount() {
    await Fn.fetchProjects({ self: this })
    let stats = [
      {
        title: 'Active Projects',
        number: ( this.context.subscribedProjects.length ),
        link: "/myprojects"
      },
      {
        title: 'Messages',
        number: this.context.allUnread.length,
        link: "/messages"
      },
      {
        title: 'Notifications',
        number: this.context.notifications.filter(a => a.read === false ).length,
        link: "/notifications"
      },
      {
        title: 'Days to Next Launch',
        number: 0,
        link: "/project/5e4bd087382acb44a1002282"      },
      {
        title: 'Days to Next Job',
        number: 0,
        link: "/project/5e4bd087382acb44a1002282"
      },
      
      // {
      //   title: 'Your Network',
      //   number: this.context.account.user.profile.connections.length
      // },
      // {
      //   title: 'Network Requests',
      //   number: this.context.account.user.profile.network.pending.length
      // }
    ]

    this.setState({
      stats: stats
    })
  }

  render() {
    const isVisible = this.state.isVisible;

    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <>
        <section id="Discussion" className="flex flex-column w-100 pb4 pt0">
          {/* {!this.state.ready && (
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
          )} */}

          <div className="flex flex-column flex-row-ns justify-between">
            {this.state.stats.map((item, index) => (
              <Link 
              to={item.link}
              className={("hover-slide-up trans-a flex flex-column justify-between flex-auto w-100 pv3 pointer ") + (index === 0 ? " pr3-ns " : "  ") + (index === 4 ? " pl3-ns " : " ") + (index !== 4  && index !== 0 ? " ph3-ns " : " ") }>
                <div className=" br3 overflow-hidden flex flex-auto flex-column bg-white pa4 bs-b items-start justify-between">
                  <span className="f2 fw6 black mb2">{item.number}</span>
                  <span className="f4 f5-ns fw5 black-40">{item.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </>
    );
  }
}

export default Stats;
Stats.contextType = AccountContext;
