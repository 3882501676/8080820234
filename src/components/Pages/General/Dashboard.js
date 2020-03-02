import React from "react";
// import React, { getGlobal, setGlobal, useGlobal } from "reactn";
import { Redirect } from "react-router-dom";
import { Popover, Empty, Skeleton, Rate } from "antd";

import TransitionLayout from "../../Layouts/Transition";
import ListProjects from "../../elements/display/projects/list";
import PageTitle from "../../elements/layout/PageTitle_B";
import ProjectInfo from "../../elements/display/drawers/ProjectInfo";
import LocationSearchFormWrapper from "../../elements/display/forms/LocationSearchFormWrapper";
import OnboardingScreen from "../../elements/display/onboarding/OnboardingScreen";
import LocationSearchBar from "../../elements/display/forms/LocationSearchBar";
import FormProjectSearch from "../../elements/forms/ProjectSearch.js";

import Stats from "../../a/Stats/index.js";
import NetworkActivity from "../../a/NetworkActivity/index.js";
// import NewMessages from '../../a/NewMessages/index.js';
// import Notifications from '../../a/Notifications/index.js';
import Notifications from "./Notifications/index.js";
import Messages from "./Messages/index.js";
// import Messages from './Messages/index.js';
import MyProjects from "./MyProjects.js";
import Calendar from "./Calendar";
import UnreadMessages from './Messages/UnreadMessages.js';
// import Messages_ from './Messages/index.js';

import Loading from "../../elements/Loading.js";

import { Dialog, Icon, Spinner } from "@blueprintjs/core";
import moment from "moment";
import methods from "../../../utils/methods";
import { Fn, app, ui, api } from "../../../utils/fn/Fn.js";


import AccountContext, {
  AccountConsumer
} from "../../../utils/context/AccountContext";
import "./style.css";
// import { dilate } from "popmotion/lib/calc";
// window.getGlobal = getGlobal;
// window.useGlobal = useGlobal;
// window.setGlobal = setGlobal;



const welcomeText = { 
  heading: "Welcome to Crew20", 
  subheading: "Use the boxes above or menu icon in the top right corner to navigate around the platform.", 
  subheading2: "Use the calendar below to view your project schedule.",
  content: "" } 

const Welcome = () => (
  <div className="flex flex-column f5 fw5 black-30 ls-copy raleway pa4 bs-b- mb4">
    <span className="fw5 f4 black-50 pb3">Welcome to <span className="fw6 black">Crew20</span></span>
    <span className="flex flex-column pb2">{welcomeText.subheading}</span>
    <span className="flex flex-column">{welcomeText.subheading2}</span>
  </div>
)



export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      ready: false,
      insertModalVisible: false,
      projectInfoVisible: false,
      loading: false,
      toMessages: false,
      conversationReady: false,
      activeTab: "1",
      drawerReady: false,
      progressBarPercent: 0,
      progressBarActive: false,
      showLocationForm: false,
      showOnboardingScreen: false,
      account: Fn.get("account"),
      searchCity: null,
      isOpen: false,
      userIsOwner: false,
      buttons: [],
      activeButton: null,
      views: [],
      activeView: null,
      viewsReady: false,
      shouldCompleteProfile: false
    };

    this.fetchProjects = this.fetchProjects.bind(this);
    this.fetchProjects2 = this.fetchProjects2.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.hideDrawer = this.hideDrawer.bind(this);
    this.refresh = this.refresh.bind(this);
    this.setLocation = this.setLocation.bind(this);
    this.start = this.start.bind(this);
    this.focusLocationSearch = this.focusLocationSearch.bind(this);

    this.reserve = this.reserve.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.openSearchDialog = this.openSearchDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.searchProjects = this.searchProjects.bind(this);

    console.log("[[ Dashboard props ]]", props);
  }
  setView(config) {
    const { view, button } = config;
    this.setState({
      activeView: view,
      activeButton: button
    });

    Fn.store({ label: "activeView", value: view });
    Fn.store({ label: "activeButton", value: button });

    view === "discussion" &&
      setTimeout(
        () =>
          document.querySelector("body").scroll({
            top: 130,
            left: 0,
            behavior: "smooth"
          }),
        1000
      )
  }
  setButtons() {
    const buttons = [
      {
        title: "Overview",
        role: "general",
        function: () => this.setView({ filter: "Overview", button: 0 })
      },

      {
        title: "Projects",
        role: "general",
        function: () => this.setView({ filter: "Discussion", button: 1 })
      },
      {
        title: "Messages",
        role: "general",
        function: () => this.setView({ filter: "Files", button: 2 })
      },
      // {
      //   title: "Timeline",
      //   function: () => this.setView({ filter: "timeline", button: 3 })
      // },
      {
        title: "Calendar",
        role: "general",
        function: () => this.setView({ filter: "Settings", button: 3 })
      },
      {
        title: "Notifications",
        role: "general",
        function: () => this.setView({ filter: "People", button: 4 })
      },
      {
        title: "Network",
        role: "general",
        function: () => this.setView({ filter: "Checklist", button: 5 })
      },
      {
        title: "Files",
        role: "general",
        function: () => this.setView({ filter: "Rate Calculator", button: 6 })
      }
    ];

    // const views = ["overview", "files", "discussion", "settings", "people"];
    const views = [
      {
        title: "Overview",
        role: "general"
      },
      {
        title: "Projects",
        role: "general"
      },
      {
        title: "Messages",
        role: "general"
      },
      {
        title: "Calendar",
        role: "general"
      },
      {
        title: "Notifications",
        role: "general"
      },
      {
        title: "Network",
        role: "general"
      },
      {
        title: "Files",
        role: "general"
      }
    ];

    this.setState({
      viewsReady: true,
      buttons: buttons,
      activeButton: buttons[0],
      views: views,
      activeView: views[0]
    });
  }
  closeDialog() {
    this.setState({
      isOpen: false
    });
  }
  searchProjects(data) {
    const { location, projectType, startDate, endDate } = data;

    this.setState({
      ready: false
    });
    // alert()

    console.log("search config ", data);

    console.log(this.state.projects);

    let location_;

    if (typeof data.location.County !== "undefined") {
      location_ = data.location.County.toLowerCase();
    } else {
      location_ = data.location.address.county.toLowerCase();
    }

    // let type = data.projectType;
    let projects = this.state.projects;

    console.log("location", location_);

    let filtered = projects.filter(
      p => p.location.toLowerCase() === location_ && p.type === projectType
    );
    let filteredDateRange = filtered.filter(p =>
      moment(p.start_date).isBetween(data.startDate, data.endDate)
    );

    console.log("filtered", filtered);
    console.log("filteredDateRange", filteredDateRange);

    this.setState({
      projects: filteredDateRange,
      ready: true,
      isOpen: false
    });
  }
  openSearchDialog() {
    this.setState({ isOpen: true });
  }
  focusLocationSearch() {}
  reserve(doc) {
    console.log(doc);
    this.setState({ activeDoc: doc });
    // setGlobal({ "reserve": true, recipient: doc })
  }
  async sendMessage(doc) {
    return await Fn.sendMessage({ doc, self: this });
  }
  async fetchProjects2(city) {
    this.setState({ ready: false, searchCity: city });
    setTimeout(() => {
      console.log("[[ fetchProjects2 city ]]", city);
      return Fn.fetchProjects2({ city, self: this });
    }, 1000);
  }
  async fetchProjects(city) {
    this.setState({ ready: false, searchCity: city });
    return await Fn.fetchProjects({ city, self: this });
  }
  async refresh() {
    return await Fn.refresh({ self: this });
  }
  async showDrawer(project) {
    return await Fn.showDrawer({ project, self: this });
  }
  async hideDrawer() {
    return await Fn.hideDrawer({ self: this });
  }
  showModal = () => {
    this.setState({
      insertModalVisible: true
    });
  };
  handleOk = e => {
    console.log(e);
    this.setState({
      insertModalVisible: false
    });
  };
  handleCancel = e => {
    console.log(e);
    this.setState({
      insertModalVisible: false
    });
  };

  async setLocation() {
    return await Fn.setLocation({ self: this });
  }
  async start() {
    // find location by browser geolocation,
    // then query Here maps api for location data using reverse geolocation.
    // Fn.fetchProjects({ self: this })
    // return await Fn.setLocation({ self: this })
  }
checkProfileStatus() {
  if (
    this.context.account &&
    this.context.account.user &&
    this.context.account.user.profile &&
    this.context.account.user.profile.name.first.length === 0
  ) {
    this.setState({
      shouldCompleteProfile: true
    });
  }
}
  componentWillUnmount() {}
  componentDidUpdate() {
    // console.log("[[ Home Updated ]]", this.props);
  }
  async componentDidMount() {

    this.context.setPage({ title: "Dashboard", subtitle: "..."})
    
    this.checkProfileStatus()
    this.setButtons();
    
    Fn.fetchProjects({ self: this });

    document.querySelector("body").scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });

    if (localStorage.getItem("crewBuilder") !== null) {
      let crewBuilder = Fn.get("crewBuilder");
      if (!crewBuilder.hasBeenUploaded) {
        await Fn.createProject({ self: this, project: crewBuilder });
      }
    }

    // this.start()
  }
  render() {
    return (
      <AccountContext.Consumer>
        {props => {
          return (
            <TransitionLayout>
              {!this.state.ready && <Loading />}

              {/* {this.state.ready && (
                <section id="ToolbarButtons" className="flex flex-column w-100 overflow-hidden">
                  <div className="flex flex-row justify-between w-100 vw100 overflow-auto">
                    <div className="toolbar-buttons-wrapper flex flex-row flex-auto- w-100">
                      {this.state.buttons
                        .filter(b => b.role === "general")
                        .map((button, index) => (
                          <button
                            title={button.title}
                            onClick={() =>
                              this.setView({
                                view: this.state.views[index],
                                button: button
                              })
                            }
                            id={button.title}
                            className={
                              " bl b--black-05 " +
                              (this.state.activeButton.title === button.title
                                ? " bg-black-20 "
                                : " bg-black-30 ") +
                              " toolbar-button pointer flex flex-column pa0 mr3- pointer justify-center items-center flex-auto"
                            }
                          >
                            <div
                              id=""
                              className="flex flex-row ph0 pv0 items-center justify-center"
                            >
                              <span className="f5 fw6 black-40- white ph3 pv4 w-100 tc">
                                {button.title}
                              </span>
                            </div>
                          </button>
                        ))}
                      {this.state.buttons
                        .filter(
                          b => b.role === "admin" && this.state.userIsOwner
                        )
                        .map((button, index) => (
                          <button
                            title={button.title}
                            onClick={() =>
                              this.setView({
                                view: this.state.views[index + 3],
                                button: button
                              })
                            }
                            id={button.title}
                            className={
                              " bl b--black-05 " +
                              (this.state.activeButton.title === button.title
                                ? " bg-black-20 "
                                : " bg-black-30 ") +
                              " flex flex-column pa0 mr3- pointer justify-center items-center flex-aut-o"
                            }
                          >
                            <div
                              id=""
                              className="flex flex-row ph0 pv0 items-center justify-center"
                            >
                              <span className="f5 fw6 black-40- white ph3 pv4 w-100 tc ">
                                {button.title}
                              </span>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                </section>
              )} */}

              {/* {
                props.account.user.profile.config.onboardingcomplete === false
                && <OnboardingScreen location={this.state.location} />
              } */}

              <section id="Home" className="w-100 mw8 center pa4 pb6">
                {/* {this.state.viewsReady &&
                  this.state.activeView.title === "Overview" && (
                    <div className="flex flex-column flex-row-ns justify-between mb4 mt3">
                      <PageTitle
                        title={"Dashboard"}
                        ready={this.state.ready}
                        theme={props.theme}
                        showInsertForm={this.showModal}
                        docs={false}
                        activeDoc={this.state.activeProject}
                        updateActiveDoc={this.updateActiveDoc}
                        showButton={false}
                      />
                    </div>
                  )} */}

                {/* <div
                    id="ProjectSearch"
                    className="w-100 flex flex-row items-end justify-start justify-end-ns mb2">
                    <button
                      onClick={this.openSearchDialog}
                      className={(Fn.get('isMobile') ? " w-100 mt3 " : "  ") + (" br1- round bs-b bg-black-20 ph4 pv2 pointer bn relative w-100-    ")} >

                      <span className="f5 fw6 white pv0 flex items-center justify-center pr2">

                  
                  
                      {this.state.buttonLoading ? <Icon icon="loading" className={' absolute right-0 f4 black-60 mr2'} /> : <Icon icon={"search"} iconSize={12} className={(' f4 black-60- white  absolute right-0 mr3')} />} Find a Project
                        </span>
                    </button>
                  </div> */}
                {/* {this.state.locationIsSet &&
                    <LocationSearchBar
                      location={this.state.location}
                      findLocation={this.findLocation}
                      fetchProjects={this.fetchProjects2}

                    />} */}

                {/* <div className="flex flex-row justify-between pb3">
                  <h4 className="f7 fw5 black-30">Showing results for <span onClick={this.focusLocationSearch} className="ph2 pv1 br1 fw6 black-40 bg-black-10 white">{this.state.searchCity}</span></h4>
                </div> */}
                {/* {!this.state.ready && (
                  <div>
                    <div className="sp sp-3balls"></div>
                  </div>
                )} */}

                {
                  this.state.shouldCompleteProfile && 
                  <div 
                  onClick={() => this.props.history.push('/profile')}
                  className="flex flex-column pv3">
                  <div className="flex flex-column ph4 pv3 br2 bg-yellow black-30 f5 fw6">
                      <span className="">Hi, it looks like you're new around here. Please complete your profile by clicking this link.</span>
                    
                    </div>  
                  </div>
                }
                {this.state.viewsReady &&
                  this.state.activeView.title === "Overview" && (
                    <>
                      
                        <Stats 
                          setView={this.setView} 
                          projects={this.state.projects} 
                        />

                        <Welcome hide={ () => { this.setState({ showWelcome: false }) } } />

                        <Calendar dashboard={true} />


                      {/* <div className="flex flex-row w-100 ">
                        
                      <div className="flex pr3-ns w-100 w-50-ns flex-auto -h96vh">
                          <UnreadMessages 
                          history={this.props.history}
                          dashboard={true} padding={false} />
                        </div>

                        <div className="flex pl3-ns flex-auto w-100 w-50-ns -h96vh">
                          <Notifications
                            dashboard={true}
                            padding={false}
                            showButtons={false}
                          />
                        </div>

                        

                      </div> */}
                      {/* <NetworkActivity /> */}
                    </>
                  )}

                {this.state.viewsReady &&
                  this.state.activeView.title === "Projects" && (
                    <MyProjects dashboard={true} />
                  )}
                {this.state.viewsReady &&
                  this.state.activeView.title === "Calendar" && (
                    <Calendar dashboard={true} />
                  )}

                {this.state.viewsReady &&
                  this.state.activeView.title === "Messages" && (
                    <Messages type={"main"} dashboard={true} padding={false} />
                  )}

                {this.state.viewsReady &&
                  this.state.activeView.title === "Notifications" && (
                    <Notifications dashboard={true} padding={false} />
                  )}

                {/* {
                this.state.viewsReady && this.state.activeView.title === "Overview" && this.state.ready ? (
                  this.state.projects.length > 0 ? (
                    <ListProjects
                      projects={this.state.projects}
                      activeProject={this.state.activeProject}
                      className="trans-a"
                      showDrawer={this.showDrawer}
                      hideDrawer={this.hideDrawer}
                      theme={props.theme}
                      activeCurrency={props.activeCurrency}
                      exchangeRate={props.exchangeRate}
                    />
                  ) : (
                    <Empty
                      className="trans-a flex flex-column justify-center items-start"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )
                ) : (
                  <div className="trans-a">
                    <Skeleton active />
                  </div>
                )} */}
                {/* {this.state &&
                  this.state.locationIsSet &&
                  this.state.ready &&
                  this.state.drawerReady && (
                    <ProjectInfo
                      type={"info"}
                      project={this.state.activeProject}
                      updateDoc={this.updateDoc}
                      visible={this.state.projectInfoVisible}
                      hideDrawer={this.hideDrawer}
                      close={this.props.handleOk}
                      refresh={this.refresh}
                      theme={props.theme}
                      reserve={this.reserve}
                      sendMessage={this.sendMessage}
                      conversationReady={this.state.conversationReady}
                      submitReservationRequest={this.submitReservationRequest}
                      activeTab={this.state.activeTab}
                      activeCurrency={props.activeCurrency}
                      exchangeRate={props.exchangeRate}
                    />
                  )} */}
              </section>
              {/* {
                account
                && account.extended
                && account.extended.config
                && account.extended.config.type === "user"
                && this.state.showLocationForm
                && <LocationSearchFormWrapper
                  progressBarActive={this.state.progressBarActive}
                  progressBarPercent={this.state.progressBarPercent}
                  fetchProjects={this.fetchProjects}
                />
              } */}
              {/* <div
                onClick={this.refresh}
                className={(Fn.get('isMobile') ? " top-6vh " : "  ")
                  + (" absolute top-0 right-0 pa4 pointer black-20- hover-black-40 flex flex-row items-center z-9 ")}>
                <span className="mr2 f5 fw4 black-30">{this.state.ready ? "reload" : "loading"}</span> {this.state.ready ? <Icon icon="refresh" iconSize={15} className="black-40" /> : <Spinner size={15} className="black-40" />}
              </div> */}
              {/* <Dialog
                className={"bp3-light"}
                // icon="info-sign"
                onClose={this.closeDialog}
                title={this.state.dialogTitle}
                {...this.state}
              >
                <FormProjectSearch searchProjects={this.searchProjects} />
              </Dialog> */}
            </TransitionLayout>
          );
        }}
      </AccountContext.Consumer>
    );
  }
}

// export default Home;
Dashboard.contextType = AccountContext;
