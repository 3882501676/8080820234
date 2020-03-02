import React from "react";
// import { getGlobal, setGlobal, useGlobal } from "reactn";
// import methods from '../../../utils/methods';
import { Empty, Skeleton } from "antd";
import { Fn, app } from "../../../../utils/fn/Fn.js";
import { Spinner, Icon } from "@blueprintjs/core";
import { DatePicker, Drawer, Popconfirm, message } from "antd";
// import { RingSpinner } from "react-spinners-kit";
import TransitionLayout from "../../../Layouts/Transition";
// import InsertModal from "../../elements/forms/project/modal/insert";
import ListNotifications from "../../../elements/display/notifications";
import PageTitle from "../../../elements/layout/PageTitle_B";
import UserList from "../../../a/UserList/index.js";
import Bio from "../../../a/_Elements/Bio/Bio.jsx";
import NotificationDrawer from "../../../elements/display/drawers/notificationDrawer";
// import fn from '../../../../../../../UNIT/client/src/utils/fn/fn'
import AccountContext, {
  AccountConsumer
} from "../../../../utils/context/AccountContext.js";
import Loading from "../../../elements/Loading.js";
// import notificationTypes
// import { notificationTypes } from "./types";

import moment from "moment";
var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;
class Network extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      connections: [],
      activeUser: null,
      filter: "active",
      isDeleting: [],
      isDeletingStart: [],
      del: [],
      deleteConfirmation: []
    };

    this.start = this.start.bind(this);
    this.reload = this.reload.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    // this.handleOk = this.handleOk.bind(this);
    this.hideDrawer = this.hideDrawer.bind(this);
    this.filter = this.filter.bind(this);
    this.remove = this.remove.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.userLocation = this.userLocation.bind(this);
  }
  userLocation() {
    let user = this.state.activeCrewMember;
    let location;
    if (
      user.profile.location &&
      typeof user.profile.location.County !== "undefined"
    ) {
      location = user.profile.location.County;
    } else if (
      user.profile.location &&
      typeof user.profile.location.address.county !== "undefined"
    ) {
      location = user.profile.location.address.county;
    } else {
      location = "";
    }
    return location;
    // props.account.user.profile.location && props.account.user.profile.location.address.county || ""
  }
  filter(type) {
    this.setState({
      filter: type
    });
  }
  confirmDelete({ item, index }) {
    let deleteConfirmation = this.state.deleteConfirmation;
    deleteConfirmation[index] = true;

    this.setState({
      deleteConfirmation: deleteConfirmation
    });
  }
  async remove({ item, index }) {
    let isDeleting = this.state.isDeleting;
    let isDeletingStart = this.state.isDeletingStart;

    isDeletingStart[index] = true;

    this.setState({
      isDeletingStart: isDeletingStart
    });

    setTimeout(async () => {
      isDeleting[index] = true;
      isDeletingStart[index] = false;
      this.setState({
        isDeleting: isDeleting,
        isDeletingStart: isDeletingStart
      });

      let userId = item.id;
      let project = this.props.project;
      let invited = project.invited;
      let crew = project.crew;

      let crewItemIndex = crew.findIndex(a => a.id === userId);
      let invitedItemIndex = invited.findIndex(a => a.id === userId);

      crew.splice(crewItemIndex, 1);
      invited.splice(invitedItemIndex, 1);

      console.log("crew", crew);
      console.log("crew member to delete", userId);
      console.log("index of crew member to delete", invitedItemIndex);
      console.log("update crew list after delete", crew);

      project.crew = crew;
      project.invited = invited;

      await app.updateProject({ self: this, project }).then(async res => {
        await app.fetchCrew({ self: this, project });
        this.reloadProject();
      });
    }, 1000);
  }
  async refresh() {
    this.setState({
      ready: false
    });

    setTimeout(async () => {
      return await this.fetchNotifications();
    }, 1000);

    // this.fetchCollection()
  }
  closeInnerDrawer() {
    this.setState({
      innerDrawerOpen: false
    });
  }
  toggleInnerDrawer(item) {
    this.setState({
      innerDrawerOpen: true,
      activeCrewMember: item
    });
    // this.state.activeCrewMember
  }
  toggleDrawer({ item, type }) {
    console.log(item);
    this.setState({
      drawerType: type,
      drawerOpen: !this.state.drawerOpen,
      activeCrewMember: item
    });
  }
  // async showDrawer(data) {

  //   const { notification } = data;

  //   console.log("show drawer ", notification);

  //   this.setState({
  //     drawerReady: true,
  //     docInfoVisible: true,
  //     activeNotification: notification
  //   });

  //   // let notification =
  //   notification.read = true;

  //   await app.updateNotification({ self: this, notification });

  //   // setGlobal({ activeConversation: conversation, activeChef: chef })
  // }

  hideDrawer(doc) {
    this.setState({
      drawerReady: false,
      docInfoVisible: false
    });
  }
  reload() {
    this.setState({
      ready: false
    });
    this.start();
  }
  start = async () => {
    let connections = this.context.account.user.profile.connections;

    console.log("connections", connections);

    await app
      .fetchConnections({ self: this, connections })
      .then(connections => {
        console.log("connections", connections);

        setTimeout(() => {
          this.setState({
            connections: connections,
            ready: true
          });
        }, 1000);
      });
  }

  componentWillUnmount() {}

  async componentDidMount() {

    this.context.setPage({ title: "Network", subtitle: "..."})
  
    this.start();
  
  }
  render() {
    return (
      <AccountContext.Consumer>
        {props => (
          <TransitionLayout>
            {!this.state.ready && <Loading />}

            <section
              id="Notifications"
              className={
                (this.props.padding !== false ? " pa4 " : "  ") +
                " w-100 mw8 center mt3- "
              }
            >
              {/* <div onClick={this.refresh} className="absolute top-0 right-0 pa4">
            <Icon type="sync" />
          </div> */}

              {/* <PageTitle
                title={"Network"}
                ready={this.state.ready}
                // theme={props.theme}
                // showInsertForm={this.showModal}
                docs={this.state.connections}
                // activeDoc={this.state.activeProject}
                // updateActiveDoc={this.updateActiveDoc}
                showButton={false}
              /> */}

              <div className={" flex flex-row mt3 "}>
                <div className="flex flex-row">
                  <div
                    onClick={() => this.filter("active")}
                    className={
                      (this.state.filter === "active" ? " fw6 " : " fw5 ") +
                      " pointer flex flex-column pv2 f5 black-30 mr2 "
                    }
                  >
                    Active
                  </div>
                  <div
                    onClick={() => this.filter("pending")}
                    className={
                      (this.state.filter === "pending" ? " fw6 " : " fw5 ") +
                      " pointer flex flex-column pv2 f5 black-30 mr2 "
                    }
                  >
                    Pending
                  </div>
                </div>
              </div>

              <div className="h2"></div>

              {this.state.ready && this.state.connections.length === 0 && (
                <div
                  className="flex flex-row ph0 pb3 items-center justify-start"
                  id=""
                >
                  <span className="f6 fw5 black-50 pv2 ph3 ba b--black-05">
                    You do not have any connections
                  </span>
                </div>
              )}

              <UserList
                // crew={this.state.productionCrew}
                items={this.state.connections}
                invited={this.props.invited}
                userAvatar={this.userAvatar}
                confirmDelete={this.confirmDelete}
                remove={this.remove}
                state={this.state}
                ready={this.state.ready}
                toggleDrawer={this.toggleDrawer}
                type={"production"}
                columns={3}
                type={"network"}
              />

              {/* {this.state.ready && (
                this.state.notifications.length > 0 && (
                  <ListNotifications
                    notifications={this.state.connections}
                    // activeNotification={this.state.activeNotification}
                    showDrawer={this.showDrawer}
                    // theme={Fn.get('theme').config.theme}
                    // setReady={this.setReady}
                    // filter={}
                  />
                )
              )} */}
              {!this.state.ready && (
                <div className="trans-a">
                  <Skeleton active />
                  <Skeleton active />
                </div>
              )}

              {/* {this.state.ready ? (
                <NotificationDrawer
                  type={"info"}
                  notification={this.state.notification}
                  doc={this.state.activeNotification}
                  // chef={this.state.activeChef}/
                  // updateDoc={this.updateDoc}
                  visible={this.state.docInfoVisible}
                  hideDrawer={this.hideDrawer}
                  className="NotificationDetail"
                  close={this.hideDrawer}
                  refresh={this.refresh}

                  // theme={/Fn.get('theme').config.theme}
                  // reserve={this.reserve}
                  // sendMessage={this.sendMessage}
                  // conversationReady={this.state.drawerReady}
                />
              ) : null} */}

              <Drawer
                title={"Crew Search"}
                closable={true}
                onClose={this.toggleDrawer}
                visible={this.state.drawerOpen}
                width={"60vw"}
              >
                <>
                  {this.state.drawerOpen && (
                    <div className="pointer flex flex-column justify-end items-start pa3- bg-white ">
                      {this.state.drawerType === "crewprofile" && (
                        <>
                          <div
                            // to={"/user/" + item.id}
                            // onClick={this.toggleInnerDrawer}
                            id="ProjectOwner"
                            className="flex flex-column w-100 pa0"
                          >
                            <div className="pa4 flex flex-row-ns flex-column w-100">
                              <div className="flex flex-column w-100=">
                                <div className="round pa1 bg-white center">
                                  <div
                                    style={{
                                      width: "90px",
                                      height: "90px",
                                      backgroundImage: this.state
                                        .activeCrewMember.profile.picture.length
                                        ? "url(" +
                                          this.state.activeCrewMember.profile
                                            .picture +
                                          ")"
                                        : GeoPattern.generate(
                                            this.state.activeCrewMember.profile
                                              .name.first +
                                              this.state.activeCrewMember
                                                .profile.name.last
                                          ).toDataUrl()
                                    }}
                                    className="center pointer round  cover bg-center"
                                  ></div>
                                </div>
                              </div>

                              <div className="flex flex-column justify-center w-100 ph3">
                                <div className="f4 flex flex-column items-center w-100 raleway ">
                                  <span className="flex flex-row-ns flex-column w-100 black f3 fw6">
                                    <span className="flex flex-row items-center justify-start-ns justify-center black-70 f4 fw6">
                                      {
                                        this.state.activeCrewMember.profile.name
                                          .first
                                      }{" "}
                                      {
                                        this.state.activeCrewMember.profile.name
                                          .last
                                      }
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <section
                            id="ProfileButtons"
                            className="flex flex-auto w-100"
                          >
                            <div className="flex flex-row mb2-ns- w-100 bt b--black-05 ">
                              <button
                                title="View or upload CV"
                                id="CV-button"
                                className="db relative w-100 ph4 pv3 br1- bg-white black-50 hover-black pointer"
                              >
                                <div id="" className="db relative w-100">
                                  <span className="f5 fw6 ph3-">
                                    Cirriculum Vitae{" "}
                                  </span>
                                </div>
                              </button>
                              <button
                                title="View or upload CV"
                                id="CV-button"
                                className="db relative w-100 ph4 pv3 br1- bg-white black-50 hover-black pointer"
                                // style={{ background: "#e8e8ec" }}
                              >
                                <div id="" className="db relative w-100">
                                  <span className="f6 fw6 ">
                                    Add to Network
                                  </span>
                                </div>
                              </button>
                              <button
                                title="View or upload CV"
                                id="CV-button"
                                className="db relative w-100 ph4 pv3 br1- bg-white black-50 hover-black pointer"
                                // style={{ background: "#e8e8ec" }}
                              >
                                <div id="" className="db relative w-100">
                                  <span className="f6 fw6 ">Send Message</span>
                                </div>
                              </button>
                            </div>
                          </section>
                          <div className="flex flex-row -nsflex-column w-100 black-60 raleway flex-wrap items-center justify-start-ns justify-between pa4 bt b--black-05">
                            <div className="flex flex-column w--100 pb1-ns pb2 mr3">
                              <span className="flex-column flex f6 fw4 black-40 items-start">
                                <span
                                  className="flex 
 mb3"
                                >
                                  Age
                                </span>
                                <span className="flex items-center justify-center f6 fw6 -ml3-ns black-50- white ph2 pv1 ba b--black-05 br1 -round bw1- bg-white-20- bg-black -ts-a tc ml2-">
                                  {moment().diff(
                                    this.state.activeCrewMember.profile.dob,
                                    "years"
                                  )}
                                </span>
                              </span>
                            </div>
                            <div className="flex flex-column w--100 pb1-ns pb2 mr3">
                              <span className="flex-column flex f6 fw4 black-40 items-start">
                                <span
                                  className="flex 
 mb3"
                                >
                                  Gender
                                </span>
                                <span className="flex items-center justify-center f6 fw6 -ml3-ns black-50- white ph2 pv1 ba b--black-05 br1 -round bw1- bg-white-20- bg-black -ts-a tc ml2-">
                                  {(this.state.activeCrewMember.profile
                                    .gender &&
                                    this.state.activeCrewMember.profile
                                      .gender) ||
                                    ""}
                                </span>
                              </span>
                            </div>
                            <div className="flex flex-column w--100 pb1-ns pb2 mr3">
                              <span className="flex-column flex f6 fw4 black-40 items-start">
                                <span
                                  className="flex 
 mb3"
                                >
                                  Location
                                </span>
                                <span className="flex items-center justify-center f6 fw6 -ml3-ns black-50- white ph2 pv1 ba b--black-05 br1 -round bw1- bg-white-20- bg-black -ts-a tc ml2-">
                                  {this.userLocation()}
                                </span>
                              </span>
                            </div>
                          </div>

                          <Bio
                            user={this.state.activeCrewMember}
                            editSkills={null}
                            editBio={null}
                            canEdit={false}
                          />
                        </>
                      )}
                    </div>
                  )}{" "}
                </>
              </Drawer>

              {/* {!this.props.dashboard && (
                <div
                  onClick={this.reload}
                  className={
                    (Fn.get("isMobile") ? " top-6vh " : "  ") +
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
            </section>
          </TransitionLayout>
        )}
      </AccountContext.Consumer>
    );
  }
}

export default Network;
Network.contextType = AccountContext;
