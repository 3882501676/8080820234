import React from "react";
import { Dialog, Icon, Spinner } from "@blueprintjs/core";
import { Result, Drawer, message, Popover } from "antd";
import moment from "moment";
import { Link } from "react-router-dom";
// import React, { getGlobal, setGlobal, useGlobal } from "reactn";
import AccountContext from "../../../utils/context/AccountContext";
import { Fn, api, ui, app } from "../../../utils/fn/Fn.js";

import Discussion from "../../a/Discussion/index.js";
import Files from "../../a/Files/index.js";
import FormBio from "../../a/FormBio/index.js";
import Settings from "../../a/Settings/index.js";
import People from "../../a/People/index.js";
import RateCalculator from "../../a/RateCalculator/index.js";
import Checklist from "../../a/Checklist/index.js";
import Itinerary from '../../a/Itinerary/index.js';

import MessageBoxProject from "../../elements/display/messages/messageboxProject.js";
import PageTitle from "../../elements/layout/PageTitle_B";
import Filepond from "../../elements/upload/Filepond.js";
import TransitionLayout from "../../Layouts/Transition";
import Loading from "../../elements/Loading.js";
import "./style.css";
// import { placeholderImage } from "../../../utils/constants.js";
import constants from "../../../utils/constants.js";
// import PropTypes from 'prop-types';
var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;
// window.getGlobal = getGlobal;
// window.useGlobal = useGlobal;
// window.setGlobal = setGlobal;

class SingleProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dialogType: "",
      dialogTitle: "",
      ready: false,
      projectId: this.props.match.params.id,
      project: {},
      drawerVisible: false,
      crew: [],
      drawerItem: {},
      userIsOwner: false,
      applications: [],
      projectOwner: {},
      buttons: [],
      activeButton: {},
      filters: [],
      filter: {},
      view: "overview",
      invited: [],
      acceptingInvitation: false,
      invitationAccepted: false,
      isProjectOwner: false,
      currentUserPermissions: []
    };

    this.load = this.load.bind(this);
    this.fetchProjectData = this.fetchProjectData.bind(this);
    this.fetchCrew = this.fetchCrew.bind(this);
    this.applyForPosition = this.applyForPosition.bind(this);
    this.addToNetwork = this.addToNetwork.bind(this);
    this.avatar = this.avatar.bind(this);
    this.userAvatar = this.userAvatar.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
    this.crewPositionProfile = this.crewPositionProfile.bind(this);
    this.checkIsOwner = this.checkIsOwner.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.fetchInvitedUsers = this.fetchInvitedUsers.bind(this);
    this.userLocation = this.userLocation.bind(this);
    this.setButtons = this.setButtons.bind(this);
    this.filterProjects = this.filterProjects.bind(this);
    this.filter = this.filter.bind(this);
    this.setView = this.setView.bind(this);
    this.openFileUploadDialog = this.openFileUploadDialog.bind(this);
    this.acceptInvitation = this.acceptInvitation.bind(this);
    this.reloadProject = this.reloadProject.bind(this);
    this.updateProjectState = this.updateProjectState.bind(this);
    this.setFullScreen = this.setFullScreen.bind(this);
    this.checkUserPermissions = this.checkUserPermissions.bind(this);
    // this.hideOverlay = this.hideOverlay.bind(tj)

    console.log("ui.mobile()", ui.mobile());
  }
  setFullScreen() {
    var elem = document.getElementById("projectScreen");
    if (document.webkitFullscreenElement) {
      document.webkitCancelFullScreen();
    } else {
      elem.webkitRequestFullScreen();
    }
  }
  async updateProjectState(project) {
    console.log("updateProjectstate", project);
    let crew = await Fn.fetchCrew({ self: this, project });

    let applications = await Fn.fetchApplications({ self: this, project });

    let invited = await Fn.fetchInvitedUsers({ self: this, project });
    this.setState({
      project: project
    });
  }
  async reloadProject() {
    this.setState({ ready: false });
    this.load();
    // console.log('reloadProject')
    // let projectId = this.props.match.params.id
    // let project = await api.fetch('projects', projectId).then(project => {
    //   if(project) {
    //     this.setState({
    //       project: project
    //     })
    //   }
    // })
    // let project = Fn.get('activeProject')
  }
  async acceptInvitation() {
    this.setState({
      acceptingInvitation: true
    });

    let project = this.state.project;
    let currentUserId = Fn.get("account").user.id;

    // project.accepted.push(Fn.get('account').user.id)
    let position = project.invited.filter(a => a.id === currentUserId)[0];
    // let crewMember = {
    //   position: position.position,
    //   id: currentUserId
    // };

    setTimeout( async () => {

      project.crew.push(position);
  
      await app.updateProject({ self: this, project }).then(async project => {
        
        this.setState({
          project: project
        })

        setTimeout( async () => {
          this.setState({
            acceptingInvitation: false,
            invitationAccepted: true
          });
          this.reloadProject();
        }, 2000);
  
        await app.createProjectRoster({ self: this, project }).then( project => {
          console.log('Updated project roster ',project)
        })
  
      })

    },1000)

    // setTimeout(() => {
    //   this.setState({
    //     acceptingInvitation: false,
    //     invitationAccepted: false
    //   })

    // },10000)
  }
  toggleDialog(test, test12) {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  openFileUploadDialog() {
    this.setState({
      dialogType: "projectAvatarUpload",
      dialogTitle: "Update Project Image",
      isOpen: true
    });
  }
  filterProjects(filter) {
    let ownProjects =
      (typeof localStorage.getItem("ownProjects") !== null &&
        JSON.parse(localStorage.getItem("ownProjects"))) ||
      [];
    let subscribedProjects =
      (typeof localStorage.getItem("subscribedProjects") !== null &&
        JSON.parse(localStorage.getItem("subscribedProjects"))) ||
      [];
    let projects =
      (typeof localStorage.getItem("rojects") !== null &&
        JSON.parse(localStorage.getItem("projects"))) ||
      [];

    let today = moment(new Date());

    this.setState({ ready: false });

    if (filter === "current") {
      let p = projects.filter(
        a =>
          moment(a.start_date).isBefore(today) &&
          moment(a.deadline).isAfter(today)
      );
      let pOwn = ownProjects.filter(
        a =>
          moment(a.start_date).isBefore(today) &&
          moment(a.deadline).isAfter(today)
      );
      let pSub = subscribedProjects.filter(
        a =>
          moment(a.start_date).isBefore(today) &&
          moment(a.deadline).isAfter(today)
      );

      this.setState({
        projects: p,
        ownProjects: pOwn,
        subscribedProjects: pSub,
        ready: true
      });
    }

    if (filter === "pending") {
      let p = projects.filter(a => moment(a.start_date).isAfter(today));
      let pOwn = ownProjects.filter(a => moment(a.start_date).isAfter(today));
      let pSub = subscribedProjects.filter(a =>
        moment(a.start_date).isAfter(today)
      );

      this.setState({
        projects: p,
        ownProjects: pOwn,
        subscribedProjects: pSub,
        ready: true
      });
    }

    if (filter === "completed") {
      let p = projects.filter(a => moment(a.deadline).isBefore(today));
      let pOwn = ownProjects.filter(a => moment(a.deadline).isBefore(today));
      let pSub = subscribedProjects.filter(a =>
        moment(a.deadline).isBefore(today)
      );

      this.setState({
        projects: p,
        ownProjects: pOwn,
        subscribedProjects: pSub,
        ready: true
      });
    }

    if (filter === "all") {
      this.setState({
        projects: projects,
        ownProjects: ownProjects,
        subscribedProjects: subscribedProjects,
        ready: true
      });
    }
  }
  setView(config) {
    const { view, button } = config;
    this.setState({
      view: view,
      activeButton: button
    });

    Fn.store({ label: "projectView", value: view });
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
      );
  }

  filter(config) {
    const { filter, button } = config;

    this.setState({
      filter: filter,
      activeButton: button
    });
  }
  setButtons() {
    const buttons = [
      {
        title: "Overview",
        role: "general",
        backoffice: false,
        // permission: "",
        function: () => this.setView({ filter: "Overview", button: 0 })
      },
      {
        title: "Itinerary",
        role: "general",
        backoffice: false,
        // permission: "",
        function: () => this.setView({ filter: "Itinerary", button: 1 })
      },

      {
        title: "Discussion",
        role: "general",
        backoffice: false,
        function: () => this.setView({ filter: "Discussion", button: 2 })
      },
      {
        title: "Files",
        role: "general",
        backoffice: false,
        permission: "projectfiles",
        function: () => this.setView({ filter: "Files", button: 3 })
      },
      // {
      //   title: "Timeline",
      //   function: () => this.setView({ filter: "timeline", button: 3 })
      // },
      {
        title: "Settings",
        role: "admin",
        backoffice: true,
        permission: "projectsettings",
        function: () => this.setView({ filter: "Settings", button: 4 })
      },
      {
        title: "People",
        role: "admin",
        backoffice: true,
        permission: "projectpeople",
        function: () => this.setView({ filter: "People", button: 5 })
      },
      {
        title: "Checklist",
        role: "admin",
        backoffice: true,
        permission: "projectchecklist",
        function: () => this.setView({ filter: "Checklist", button: 6 })
      },
      {
        title: "Rate Calculator",
        role: "admin",
        backoffice: true,
        permission: "projectratecalculators",
        function: () => this.setView({ filter: "Rate Calculator", button: 7 })
      }
    ];

    // const views = ["overview", "files", "discussion", "settings", "people"];
    const views = [
      {
        title: "Overview",
        role: "general"
      },
      {
        title: "Itinerary",
        role: "general"
      },
      {
        title: "Discussion",
        role: "general"
      },
      {
        title: "Files",
        role: "general"
      },
      {
        title: "Settings",
        role: "admin"
      },
      {
        title: "People",
        role: "admin"
      },
      {
        title: "Checklist",
        role: "admin"
      },
      {
        title: "Rate Calculator",
        role: "admin"
      }
    ];

    this.setState({
      buttons: buttons,
      activeButton: buttons[0],
      views: views,
      view: views[0]
    });
  }
  userLocation(user) {
    let location;
    if (
      user &&
      user.profile &&
      user.profile.location &&
      typeof user.profile.location.County !== "undefined"
    ) {
      location = user.profile.location.County;
    } else if (
      user &&
      user.profile &&
      user.profile.location &&
      typeof user.profile.location.address.county !== "undefined"
    ) {
      location = user.profile.location.address.county;
    } else {
      location = "";
    }
    return location;
  }
  async fetchInvitedUsers() {}
  async fetchShortlist() {}
  async sendMessage(data) {
    let selfUserId = this.context.account.user.id;

    let recipientId = data.id;

    const conversationExists = await Fn.checkConversationExists({
      self: this,
      selfUserId,
      recipientId: data.id
    });

    if (!conversationExists.exists) {
      await Fn.createNewConversation({ self: this, selfUserId, recipientId });
      this.props.history.push("/messages");
    } else {
      Fn.store({
        label: "activeConversation",
        value: conversationExists.conversation
      });
      this.props.history.push("/messages");
    }
  }
  crewPositionProfile() {
    let crewMemberId = this.state.project.crew.filter(
      a => a.position === this.state.drawerItem.title
    )[0].id;

    return this.state.crew.filter(a => a.id === crewMemberId)[0];
  }

  checkIsOwner() {}
  async addToNetwork(item) {
    this.context.isAuthenticated &&
      (await Fn.addToNetwork({ self: this, item: item }));

    !this.context.isAuthenticated &&
      message.warning("Please login to use network functions.");
  }
  async applyForPosition() {
    const account = Fn.get("account");

    this.setState({
      buttonLoading: true
    });

    const application = {
      position: this.state.drawerItem,
      project: this.state.project.id,
      applicant: account.user.id
    };

    await Fn.applyForPosition({ self: this, application }).then(result => {
      setTimeout(() => {
        this.reloadProject();
      }, 1000);
    });
  }

  toggleDrawer(config) {
    const { type, item } = config;

    this.setState({
      drawerItem: item,
      drawerType: type,
      drawerVisible: !this.state.drawerVisible
    });
  }

  async fetchCrew() {}
  avatar(item) {
    window.log.info("constants", constants);
    let avatar =
      typeof item.media !== "undefined" &&
      typeof item.media.images !== "undefined"
        ? item.media.images[0].url
        : constants.placeholderImage;
    return avatar;
  }
  userAvatar(item) {
    let user = this.state.projectOwner;
    window.log.info(user);
    let avatar =
      typeof user && user.profile && user.profile.picture !== "undefined"
        ? user.profile.picture
        : constants.placeholderImage;
    return avatar;
  }
  fetchProjectData = async () => {
    // await Fn.fetchProject({
    //   self: this,
    //   projectId: this.state.projectId,
    //   // next: [Fn.fetchCrew]
    // });
  };
  load = async () => {
    let self = this;

    let project = await Fn.fetchProject({
      self: this,
      projectId: this.state.projectId
    }).then(async project => {
      self.setState({ project });

      this.checkUserPermissions();

      Fn.set("activeProject", project);

      if (project) {
        // alert()
        console.log("project ]]]", project);
        let projectOwner = await Fn.fetchProjectOwner({ self, project });

        console.log("projectOwner", projectOwner);

        let crew = await Fn.fetchCrew({ self, project });

        let applications = await Fn.fetchApplications({ self, project });

        let invited = await Fn.fetchInvitedUsers({ self, project });

        let ownerId = project.owner;
        let account = Fn.get("account");
        if (account && account.hasOwnProperty("user")) {
          let currentUserId = account.user.id;
          if (ownerId === currentUserId) {
            this.setState({
              userIsOwner: true
            });
          }
        }

        this.setButtons();
        this.setState({ ready: true });
      }
    });
  };
  checkUserPermissions() {
    let productionCrew = this.state.project.productionCrew;
    let currentUserId = Fn.get("account").user.id;

    let isProdCrew = productionCrew.filter(a => a.user === currentUserId);

    console.log(" ");
    console.log("isProdCrew", isProdCrew.length > 0);
    console.log("permissions", isProdCrew[0] && isProdCrew[0].permissions);

    console.log(" ");
    if(isProdCrew.length){
      this.setState({
        currentUserPermissions: isProdCrew[0] && isProdCrew[0].permissions
      });

    }
  }
  componentWillUnmount() {}
  componentDidUpdate() {}
  componentWillUnmount() {
    this.context.toggleIsProject(false)
  }
  async componentDidMount() {
    this.load();
    this.context.toggleIsProject(true)
    // app.checkUserIsOwner(this)

    if (localStorage.getItem("projectView") !== null) {
      let view = Fn.get("projectView");

      this.setState({
        view: view
      });
      view === "discussion" &&
        setTimeout(
          () =>
            document.querySelector("body").scroll({
              top: 130,
              left: 0,
              behavior: "smooth"
            }),
          1000
        );
    }
    if (localStorage.getItem("activeButton") !== null) {

      let activeButton = Fn.get("activeButton");

      this.setState({
        activeButton: activeButton
      })

    }

    document.querySelector("body").scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    })

    setTimeout(() => {
      if (document.getElementById("MessagesList")) {
        document.getElementById("MessagesList").scroll({
          top: document.getElementById("MessagesList").scrollHeight,
          left: 0,
          behavior: "smooth"
        });
      }
    }, 500);
  }
  render() {
    const currentUserId = Fn.get("account").user.id;

    return (
      <AccountContext.Consumer>
        {props => {
          return (
            <TransitionLayout>
              {!this.state.ready && <Loading />}

              {Fn.get("isAuthenticated") && (
                <>
                  {this.state.ready && !ui.mobile() && (
                    <section 
                    style={{ background: 'rgb(103, 103, 103)', top: '12vh', width: '100%', left: '0', zIndex: '4' }}
                    id="ToolbarButtons" 
                    className="flex flex-column fixed ">
                      <div className="flex flex-row justify-between ">
                        <div className="flex flex-row flex-auto overflow-hidden">
                          {this.state.buttons
                            .filter(b => b.backoffice === this.context.backOffice)
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
                                  (this.state.activeButton.title ===
                                  button.title
                                    ? " bg-black-20 "
                                    : " bg-black-30 ") +
                                  " trans-a flex flex-column pa0 mr3- pointer justify-center items-center flex-auto"
                                }
                                style={{  minWidth: 'calc(100% /' + this.state.buttons.length + ')' }}
                              >
                                <div
                                  id=""
                                  className="flex flex-row ph0 pv0 items-center justify-center"
                                >
                                  <span className="flex f5 fw6 black-40- white ph3 pv4 w-100 tc">
                                    {button.title}
                                  </span>
                                </div>
                              </button>
                            ))}
                          {/* {this.state.buttons
                            .filter(b => b.role === "admin")
                            .map((button, index) => (
                              <button
                                // disabled={!this.state.currentUserPermissions.includes(button.permission) }
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
                                  (this.state.activeButton.title ===
                                  button.title
                                    ? " bg-black-20 "
                                    : " bg-black-30 ") +
                                  " flex flex-column pa0 mr3- pointer justify-center items-center flex-auto"
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
                            ))} */}
                        </div>
                      </div>
                    </section>
                  )}
                </>
              )}

              { this.state.ready && (
                <section
                  id="SingleProject"
                  className="w-100 top-10vh relative"
                >
                  {/* <div
                    onClick={this.refresh}
                    className="absolute top-0 right-0 pa4 pointer black-30"
                  >
                    <Icon
                      type="sync"
                      className={
                        (this.state.ready ? " inactive " : " active ") +
                        " loading-icon "
                      }
                    />
                  </div> */}
<div className=" flex flex-column ph5 ">
                  <section
                    ref={this.mainColumn}
                    id="MainColumn"
                    className="flex flex-column w-100 pb4"
                  >
                    <>
                    {this.state.view.title === "Itinerary" && (
                        <Itinerary
                          invited={this.state.invited}
                          project={this.state.project}
                          loadingAlign={"center"}
                          title={"Itinerary"}
                          size={"full"}
                          type={"itinerary"}
                        />
                      )}

                      {this.state.view.title === "Files" &&
                        this.state.currentUserPermissions.includes(
                          "projectfiles"
                        ) && (
                          <Files
                            invited={this.state.invited}
                            project={this.state.project}
                          />
                        )}

                      {this.state.view.title === "Discussion" && (
                        <Discussion
                          invited={this.state.invited}
                          project={this.state.project}
                          loadingAlign={"left"}
                          title={"Discussion"}
                          size={"full"}
                          type={"project-discussion"}
                        />
                      )}

                      {this.state.view.title === "Settings" && (
                        <>
                          {this.state.currentUserPermissions.includes(
                            "projectsettings"
                          ) && (
                            <Settings
                              invited={this.state.invited}
                              project={this.state.project}
                            />
                          )}
                          {!this.state.currentUserPermissions.includes(
                            "projectsettings"
                          ) && <NoPermissions />}
                        </>
                      )}
                      {this.state.view.title === "People" && (
                        <>
                          {this.state.currentUserPermissions.includes(
                            "projectpeople"
                          ) && (
                            <People
                              invited={this.state.invited}
                              project={this.state.project}
                              projectOwner={this.state.projectOwner}
                              reloadProject={this.reloadProject}
                              updateProjectState={this.updateProjectState}
                            />
                          )}
                          {!this.state.currentUserPermissions.includes(
                            "projectpeople"
                          ) && <NoPermissions />}
                        </>
                      )}

                      {this.state.view.title === "Checklist" && (
                        <>
                          {this.state.currentUserPermissions.includes(
                            "projectchecklists"
                          ) && (
                            <Checklist
                              invited={this.state.invited}
                              project={this.state.project}
                              projectOwner={this.state.projectOwner}
                            />
                          )}
                          {!this.state.currentUserPermissions.includes(
                            "projectchecklists"
                          ) && <NoPermissions />}
                        </>
                      )}

                      {this.state.view.title === "Rate Calculator" && (
                        <>
                          {this.state.currentUserPermissions.includes(
                            "projectratecalculator"
                          ) && (
                            <RateCalculator
                              invited={this.state.invited}
                              project={this.state.project}
                              projectOwner={this.state.projectOwner}
                            />
                          )}
                          {!this.state.currentUserPermissions.includes(
                            "projectratecalculator"
                          ) && <NoPermissions />}
                        </>
                      )}
                    </>

                    {this.state.view.title === "Overview" && (
                      <div className="flex flex-column w-100">
                        {/* <div className="flex pb3">
                          <PageTitle title={"Overview"} />
                        </div> */}
                        <div
                          id="Overview"
                          className="flex flex-row-ns flex-column w-100"
                        >
                          <div className="flex flex-column w-100-ns w-100">

                            <div
                              id="SingleProjectHeader"
                              className={
                                " trans-a relative raleway Project_list_item -sans-serif flex flex-column flex--auto w-100  items-center justify-start pa0 bs-b mb4 br2 overflow-hidden relative "
                              }
                            >
                              <div
                                onClick={
                                  this.state.userIsOwner &&
                                  this.openFileUploadDialog
                                }
                                className="pointer avatar-l- flex flex-column bg-cover bg-center br4-"
                                style={{
                                  height: '48vh', 
                                  width: '100%',
                                  background:
                                    this.state.project.media &&
                                    this.state.project.media.images &&
                                    this.state.project.media.images.length &&
                                    this.state.project.media.images[0].url
                                      ? "url(" +
                                        this.state.project.media.images[0].url +
                                        ")"
                                      : GeoPattern.generate(
                                          this.state.project.title
                                        ).toDataUrl()
                                }}
                              />

                                <div className="flex flex-column  w-100 relative bg-white raleway">
                                <div className="flex flex-row w-100">
                                  <div className="flex flex-column w-100 ">
                                    <div
                                      className={
                                        "flex flex-column pa3 bb b--black-10 "
                                      }
                                    >
                                      <h4 className="f5 flex flex-column mb0">
                                        <span className="f3 fw7 black pv2 ph3">
                                          {this.state.project.title}
                                        </span>
                                        <span className="f4 fw4 black-40 pb2 ph3">
                                          {this.state.project.description}
                                        </span>
                                      </h4>
                                    </div>
                                    <div className={"flex flex-row "}>
                                      <div className="flex flex-row-ns flex-column mb0 flex-auto">
                                        <span className="f6 fw7 black-70 ph4 pv3 ttc br b--black-05">
                                          <span className="fw4 black-40 mr1 ttc">
                                            Type
                                          </span>{" "}
                                          {this.state.project.type}
                                        </span>
                                        <span className="f6 fw7 black-70 ph4 pv3 br b--black-05">
                                          <span className="fw4 black-40 mr1">
                                            Location
                                          </span>{" "}
                                          {typeof this.state.project.location
                                            .address !== "undefined"
                                            ? this.state.project.location
                                                .address.county +
                                              ", " +
                                              this.state.project.location
                                                .address.country
                                            : this.state.project.location}
                                        </span>
                                        <span className="f6 fw7 black-70  ph4 pv3 br b--black-05">
                                          <span className="fw4 black-40 mr1">
                                            Start
                                          </span>{" "}
                                          {moment(
                                            this.state.project.start_date
                                          ).format("DD MMMM YYYY")}
                                        </span>
                                        <span className="f6 fw7 black-70  ph4 pv3">
                                          <span className="fw4 black-40 mr1">
                                            End
                                          </span>{" "}
                                          {moment(
                                            this.state.project.end_date
                                          ).format("DD MMMM YYYY")}
                                        </span>
                                      </div>

                                      {/* <div
                                        style={{
                                          top: "2vh",
                                          right: "1vw",
                                          boxShadow: "0px 0px 0px 3px #dcdcdc"
                                        }}
                                        className="top-0 right-0 absolute flex flex-column items-center justify-center round w4 h4 bg-white"
                                      >
                                        <span className="flex f5 fw5 black tc items-center justify-center pb1">
                                          {moment(
                                            this.state.project.start_date
                                          ).diff(new Date(), "days")}{" "}
                                          days
                                        </span>

                                        <span className="flex f5 fw5 black tc items-center justify-center pb1">
                                          {moment()
                                            .endOf("day")
                                            .diff(
                                              new Date().getTime(),
                                              "hours"
                                            )}{" "}
                                          hours
                                        </span>

                                        <span className="flex ttu f6 fw3 black-60 tc">
                                          to start
                                        </span>
                                      </div> */}
                                    </div>

                                    {/* {this.state.project &&
                                      this.state.project.invited &&
                                      this.state.project.invited.length &&
                                      this.state.project.invited.length > 0 &&
                                      this.state.project.invited.filter(
                                        a => a.id === currentUserId
                                      ).length > 0 &&
                                      !this.state.project.crew.filter(
                                        a => a.id === currentUserId
                                      ).length > 0 && (
                                        <div className="flex flex-row-ns flex-column mb0 flex-auto">
                                          <button
                                            onClick={this.acceptInvitation}
                                            className="flex ph3 pv2 f5 fw6 white bg-black w-100 pv3 items-center justify-center hover-bg-green pointer trans-a"
                                          >
                                            {!this.state.acceptingInvitation &&
                                              "Accept Invitation"}
                                            {this.state.acceptingInvitation && (
                                              <div className="pv2">
                                                <div className="sp sp-3balls"></div>
                                              </div>
                                            )}
                                          </button>
                                        </div>
                                      )} */}
                                  </div>
                                </div>
                              </div>

                              {/* <div
                                className={
                                  " exo flex flex-row justify-between  w-100"
                                }
                              >
                                <div
                                  style={{ background: "rgb(120, 150, 120)" }}
                                  className=" bg-black-05-  flex flex-row justify-between w-100"
                                >
                                  <div
                                    className={
                                      " flex flex-row w-100 justify-between"
                                    }
                                  >
                                    <div
                                      onClick={() =>
                                        this.toggleDrawer({
                                          type: "crewList",
                                          item: null
                                        })
                                      }
                                      className="flex flex-row  mb0 flex-auto items-center justify-center bl b--white-30 bg-black-40 "
                                    >
                                      <span
                                        className={
                                          "flex f7 fw3 white items-center justify-center  pa2"
                                        }
                                      >
                                        view all crew{" "}
                                        <Icon
                                          icon={"arrow-right"}
                                          iconSize={14}
                                          className="ml1"
                                        />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div> */}
                            </div>

                            {Fn.get("isAuthenticated") && (
                              <>
                                <Link
                                  to={"/user/" + this.state.project.owner}
                                  id="ProjectOwner"
                                  className="flex flex-column w-100 pt3 pb5 bb b--black-05"
                                >
                                  <div className="flex flex-row-ns flex-column w-100">
                                    <div className="flex flex-column w-100=">
                                      <div className="round pa1 bg-white center">
                                        <div
                                          style={{
                                            width: "150px",
                                            height: "150px",
                                            backgroundImage: this.state
                                              .projectOwner.profile.picture
                                              .length
                                              ? "url(" +
                                                this.state.projectOwner.profile
                                                  .picture +
                                                ")"
                                              : GeoPattern.generate(
                                                  this.state.projectOwner
                                                    .profile.name.first +
                                                    this.state.projectOwner
                                                      .profile.name.last
                                                ).toDataUrl()
                                          }}
                                          className="center pointer round  cover bg-center"
                                        ></div>
                                      </div>
                                    </div>

                                    <div className="flex flex-column justify-center w-100 ph4">
                                      <div className="f4 flex flex-column items-center w-100 raleway ">
                                        <div className="flex flex-row-ns flex-column items-center w-100 pv3">
                                          <span className="f5 fw3 black-50">
                                            Project Owner
                                          </span>
                                        </div>
                                        <span className="flex flex-row-ns flex-column w-100 black f3 fw6">
                                          <span className="flex flex-row items-center justify-start-ns justify-center black f3 fw6">
                                            {this.state.projectOwner &&
                                              this.state.projectOwner.profile &&
                                              this.state.projectOwner.profile
                                                .name.first}{" "}
                                            {this.state.projectOwner &&
                                              this.state.projectOwner.profile &&
                                              this.state.projectOwner.profile
                                                .name.last}
                                          </span>
                                          <span className="flex flex-row justify-center items-center f7 fw6 ml3-ns black-50- white-ns black bg-black-ns  ph3 pv1 ba-b--black-05 br1 -round bw1- bg-white tc">
                                            {this.state.projectOwner.position}{" "}
                                          </span>
                                        </span>
                                      </div>

                                      <div className="flex flex-row-ns flex-column w--100 pt3 black-60- raleway">
                                        <div className="flex flex-column w--100 pb1 mr3">
                                          <span className="flex flex-row-ns flex-column f6 fw4 black-40 items-center">
                                            <span className="flex">
                                              Location
                                            </span>
                                            <span className="f7 fw6 ml2-ns pv1 ph2 b-a white bg-black b--black-05 br1 mt0-ns mt3">
                                              {this.userLocation(
                                                this.state.projectOwner
                                              )}
                                            </span>
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Link>

{ Fn.get("isAuthenticated") &&
                                <div className="flex flex-row mt5 pb5   bb b--black-05">
                                  <div className="flex flex-auto flex-column pb0 ">
                                    <div className="flex flex-row items-center w-100 pb3">
                                      <span className="f5 fw3 black">
                                        Positions
                                      </span>
                                      <span className="f7 fw3 black-50 ml2">
                                        click a position to apply
                                      </span>
                                    </div>

                                    <div className="flex flex-row flex-wrap f4 fw4 black-60 mb0">
                                      {this.state.project &&
                                        this.state.project.positions &&
                                        this.state.project.positions.length >
                                          0 &&
                                        this.state.project.positions.map(
                                          (item, index) => (
                                            <div
                                              onClick={() =>
                                                // this.toggleDrawer({
                                                //   type: "crewPositionDetail",
                                                //   item: item
                                                // })
                                                this.setState({
                                                  drawerItem: item,
                                                  drawerType:
                                                    "crewPositionDetail",
                                                  drawerTitle: item,
                                                  drawerVisible: !this.state
                                                    .drawerVisible
                                                })
                                              }
                                              className={
                                                "crew-position-item pointer flex flex-column pb2 pr3 items-center justify-center"
                                              }
                                            >
                                              {/* {{/* <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "100px",
                backgroundImage:
                  "url(" + item.auth0.picture + ")"
              }}
              className="cover bg-center"
            /> */}
                                              <div
                                                className={
                                                  " flex flex-row pt2 relative"
                                                }
                                              >
                                                <div className="position-filled-label absolute right-0 top-0">
                                                  {this.state.project.crew.filter(
                                                    a => a.position === item
                                                  ).length > 0 && (
                                                    <div className="ph1 pv0 br1 bg-green">
                                                      <span className="f7 fw6 white-60">
                                                        Filled
                                                      </span>
                                                    </div>
                                                  )}
                                                </div>
                                                <div
                                                  className={
                                                    "  flex f6 fw5  ph3 pv2 bg-white br1 "
                                                  }
                                                >
                                                  {item}
                                                </div>
                                              </div>
                                            </div>
                                          )
                                        )}
                                    </div>
                                  </div>
                                </div>
        }

                                {/* <div className="flex flex-row mt5 pb5   bb b--black-05">
                                  <div className="flex flex-auto flex-column pb0 ">
                                    <div className="flex flex-row w-100 pb3">
                                      <span className="f5 fw3 black">
                                        Assigned Crew
                                      </span>
                                      <span className="round f7 fw6 black-70 ph2 pv1 bg-white ml2">
                                        {this.state.project.crew.length}
                                      </span>
                                    </div>

                                    <div className="flex flex-row flex-wrap f4 fw4 black-60 mb0">
                                      {this.state.crew.length > 0 &&
                                        this.state.crew
                                          .filter((item, index) => index < 5)
                                          .map((item, index) => (
                                            <Popover
                                              content={
                                                <div className="flex flex-column">
                                                  <div
                                                    onClick={() => {
                                                      this.context.history.push(
                                                        "/user/" + item.id
                                                      );
                                                    }}
                                                    className="pointer flex f6 fw5 black-60 ph3 pv2 hover-black bb b--black-05"
                                                  >
                                                    View Profile
                                                  </div>

                                                  <div
                                                    onClick={() =>
                                                      this.addToNetwork(item)
                                                    }
                                                    className="pointer flex f6 fw5 black-60 ph3 pv2 hover-black bb b--black-05"
                                                  >
                                                    Add to network
                                                  </div>

                                                  <div
                                                    onClick={() =>
                                                      this.sendMessage(item)
                                                    }
                                                    className="pointer flex f6 fw5 black-60 ph3 pv2 hover-black"
                                                  >
                                                    Send Message
                                                  </div>
                                                </div>
                                              }
                                              trigger="hover"
                                            >
                                              <Link
                                                to={"/user/" + item.id}
                                                className={
                                                  " pointer flex flex-column f-lex-auto pv2 pr3 items-center justify-center"
                                                }
                                              >
                                                <div
                                                  style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    borderRadius: "100px",
                                                    backgroundImage: item
                                                      .profile.picture.length
                                                      ? "url(" +
                                                        item.profile.picture +
                                                        ")"
                                                      : GeoPattern.generate(
                                                          item.profile.name
                                                            .first +
                                                            item.profile.name
                                                              .last
                                                        ).toDataUrl()
                                                  }}
                                                  className="cover bg-center"
                                                />
                                                <div
                                                  className={
                                                    " flex flex-row pt2 "
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      " flex f6 fw6 black-70 "
                                                    }
                                                  >
                                                    {item.profile.name.first}
                                                  </div>
                                                  <div
                                                    className={
                                                      " flex f6 fw6 ml1 black-70"
                                                    }
                                                  >
                                                    {item.profile.name.last}
                                                  </div>
                                                </div>
                                              </Link>
                                            </Popover>
                                          ))}

                                      {this.state.project.crew.length - 5 >
                                        0 && (
                                        <div
                                          className={
                                            " flex flex-column pa2 items-start justify-start"
                                          }
                                        >
                                          <div
                                            style={{
                                              width: "50px",
                                              height: "50px",
                                              borderRadius: "100px"
                                            }}
                                            onClick={() =>
                                              this.toggleDrawer({
                                                type: "crewList",
                                                item: null
                                              })
                                            }
                                            className="pointer flex flex-column items-center justify-center cover bg-center bg-black"
                                          >
                                            <span className="flex f7 fw6 white tc">
                                              +
                                              {this.state.project.crew.length -
                                                5}
                                            </span>
                                            <span className="flex f7 fw6 white tc">
                                              more
                                            </span>
                                          </div>
                                        </div>
                                      )}

                                      {this.state.project.crew.length === 0 && (
                                        <span className="flex f6 fw5 black-50 tc">
                                          No crew assigned yet
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>  */}

                                {/* <div className="flex flex-row mt5 pb5   bb b--black-05">
                                  <div className="flex flex-auto flex-column pb0 ">
                                    <div className="flex flex-row w-100 pb3">
                                      <span className="f5 fw3 black">
                                        Invited Crew
                                      </span>
                                      <span className="round f7 fw6 black-70 ph2 pv1 bg-white ml2">
                                        {(this.state.project &&
                                          this.state.project.invited &&
                                          this.state.project.invited.length) ||
                                          0}
                                      </span>
                                    </div>

                                    <div className="flex flex-row flex-wrap f4 fw4 black-60 mb0">
                                      {this.state.invited.length > 0 &&
                                        this.state.invited.map(
                                          (item, index) => (
                                            <Popover
                                              content={
                                                <div className="flex flex-column">
                                                  <div
                                                    onClick={() => {
                                                      this.context.history.push(
                                                        "/user/" + item.id
                                                      );
                                                    }}
                                                    className="pointer flex f6 fw5 black-60 ph3 pv2 hover-black bb b--black-05"
                                                  >
                                                    View Profile
                                                  </div>

                                                  <div
                                                    onClick={() =>
                                                      this.addToNetwork(item)
                                                    }
                                                    className="pointer flex f6 fw5 black-60 ph3 pv2 hover-black bb b--black-05"
                                                  >
                                                    Add to network
                                                  </div>

                                                  <div
                                                    onClick={() =>
                                                      this.sendMessage(item)
                                                    }
                                                    className="pointer flex f6 fw5 black-60 ph3 pv2 hover-black"
                                                  >
                                                    Send Message
                                                  </div>
                                                </div>
                                              }
                                              trigger="hover"
                                            >
                                              <Link
                                                to={"/user/" + item.id}
                                                className={
                                                  " pointer flex flex-column flex-au-to pv2 pr3 items-center justify-center"
                                                }
                                              >
                                                <div
                                                  style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    borderRadius: "100px",
                                                    backgroundImage: item
                                                      .profile.picture.length
                                                      ? "url(" +
                                                        item.profile.picture +
                                                        ")"
                                                      : GeoPattern.generate(
                                                          item.profile.name
                                                            .first +
                                                            item.profile.name
                                                              .last
                                                        ).toDataUrl()
                                                  }}
                                                  className="cover bg-center"
                                                />
                                                <div
                                                  className={
                                                    " flex flex-row pt2 "
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      " flex f6 fw6 black-70 "
                                                    }
                                                  >
                                                    {item.profile.name.first}
                                                  </div>
                                                  <div
                                                    className={
                                                      " flex f6 fw6 ml1 black-70"
                                                    }
                                                  >
                                                    {item.profile.name.last}
                                                  </div>
                                                </div>
                                              </Link>
                                            </Popover>
                                          )
                                        )}

                                      {this.state.project &&
                                        this.state.project.invited &&
                                        this.state.project.invited.length ===
                                          0 && (
                                          <span className="flex f6 fw5 black-50 tc">
                                            No crew invited yet
                                          </span>
                                        )}
                                    </div>
                                  </div>
                                </div> */}

                              </>
                            )}
                          </div>

                        </div>
                      </div>
                    )}

                    { Fn.get("isAuthenticated") && ui.mobile() && (
                      <div
                        style={{ width: "100vw" }}
                        className="bg-white fixed bottom-7vh left-0 w-100- flex flex-row bs-b bb b--black-05 overflow-scroll"
                      >
                        <div className="w-100- flex flex-row">
                          {this.state.buttons.map((button, index) => (
                            <button
                              title={button.title}
                              onClick={() =>
                                this.setView({
                                  view: this.state.views[index],
                                  button: button
                                })
                              }
                              id="CV-button"
                              className={
                                (this.state.activeButton.title === button.title
                                  ? " bg-black-05 fw6"
                                  : " bg-white fw5 ") +
                                " hover-bg-white-10 flex flex-column pa0 pointer justify-center flex-auto bl b--black-05"
                              }
                            >
                              <div
                                id=""
                                className="flex flex-row ph0 pv0 items-center justify-center"
                              >
                                <span className="f5 -fw6 black ph3 pv3">
                                  {button.title}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                  </div>

                  <Dialog
                    className={"bp3-light"}
                    onClose={this.toggleDialog}
                    title={this.state.dialogTitle}
                    onValueChange={this.onValueChange}
                    {...this.state}
                  >
                    <div className="flex flex-column ph4 pt4 pb2">
                      {this.state.dialogType === "bio" && (
                        <FormBio
                          value={props.account.user.profile.bio}
                          submitBio={this.submitBio}
                        />
                      )}
                      {this.state.dialogType === "cv" && <FormBio />}
                      {this.state.dialogType === "addToNetwork" && <FormBio />}
                      {this.state.dialogType === "addToProject" && <FormBio />}
                      {this.state.dialogType === "projectAvatarUpload" && (
                        <Filepond
                          self={this}
                          project={this.state.project}
                          type={"projectAvatarUpload"}
                        />
                      )}
                    </div>
                  </Dialog>

                  {this.state && this.state.ready && (
                    <Drawer
                      title={"Crew List"}
                      placement={"right"}
                      closable={true}
                      onClose={this.toggleDrawer}
                      width={500}
                      visible={this.state.drawerVisible}
                      doc={this.props.project}
                      className={"CrewList -bg-near-white"}
                    >
                      <div className="flex flex-column mb2 pa4-  ">
                        {/* <div className="ProjectScenesHeading pt0">
                            <h3 className="f6 fw3 black-30 mb3">Crew List</h3>
                          </div> */}

                        <div className="flex flex-auto flex-column pb0 ">
                          <div className="flex flex-row flex-wrap f4 fw4 black-60 mb0">
                            {this.state.drawerType === "crewList" &&
                              this.state.crew.map((item, index) => (
                                <Popover
                                  content={
                                    <div
                                      onClick={() => this.addToNetwork(item)}
                                      className="pointer flex f6 fw5 black-60 ph2 pv2 hover-black"
                                    >
                                      Add to network
                                    </div>
                                  }
                                  trigger="hover"
                                >
                                  <Link
                                    to={"/user/" + item.id}
                                    className={
                                      " pointer flex flex-column pv2 pr4 items-start justify-center"
                                    }
                                  >
                                    <div
                                      style={{
                                        width: "100px",
                                        height: "120px",
                                        borderRadius: "5px",
                                        backgroundImage:
                                          "url(" + item.profile.picture + ")"
                                      }}
                                      className="cover bg-center"
                                    />
                                    <div className={" flex flex-row pt2 "}>
                                      <div className={" flex f7 fw6 "}>
                                        {item.profile.name.first}
                                      </div>
                                      <div className={" flex f7 fw6 ml1"}>
                                        {item.profile.name.last}
                                      </div>
                                    </div>
                                  </Link>
                                </Popover>
                              ))}

                            {this.state.drawerType === "crewPositionDetail" && (
                              <div className="flex flex-auto flex-column pb0">
                                <div className="flex flex-column bb b--black-10 ">
                                  <h4 className="f5 flex flex-column mb0">
                                    <span className="f4 fw6 black-80 pv3 ph4">
                                      {this.state.drawerItem}
                                    </span>
                                    {/* <span className="f5 fw3 black-40">
                                      {this.state.drawerItem.description}
                                    </span> */}
                                  </h4>
                                </div>

                                {this.state.project.crew.filter(
                                  a =>
                                    a.position &&
                                    a.position.position &&
                                    a.position.position ===
                                      this.state.drawerItem.title
                                ).length > 0 && (
                                  <div className="flex flex-column  pb3 ">
                                    <h4 className="f5 flex flex-column mb0 pv3 ph4">
                                      <span className="f5 fw5 black-30 pb2 pt3">
                                        Position filled
                                      </span>
                                      {/* <span className="f5 fw3 black-40">{"..."}</span> */}
                                      <Popover
                                        content={
                                          <div
                                            onClick={() =>
                                              this.addToNetwork(
                                                this.crewPositionProfile()
                                              )
                                            }
                                            className="pointer flex f6 fw5 black-60 ph2 pv2 hover-black"
                                          >
                                            Add to network
                                          </div>
                                        }
                                        trigger="hover"
                                      >
                                        <Link
                                          to={
                                            "/user/" +
                                            this.crewPositionProfile().id
                                          }
                                          className={
                                            " pointer flex flex-column pv2 pr4 items-start justify-center"
                                          }
                                        >
                                          <div
                                            style={{
                                              width: "100px",
                                              height: "120px",
                                              borderRadius: "5px",
                                              backgroundImage:
                                                "url(" +
                                                this.crewPositionProfile()
                                                  .profile.picture +
                                                ")"
                                            }}
                                            className="cover bg-center"
                                          />
                                          <div
                                            className={
                                              " flex flex-row pt2 black"
                                            }
                                          >
                                            <div className={" flex f5 fw6 "}>
                                              {
                                                this.crewPositionProfile()
                                                  .profile.name.first
                                              }
                                            </div>
                                            <div className={" flex f5 fw6 ml1"}>
                                              {
                                                this.crewPositionProfile()
                                                  .profile.name.last
                                              }
                                            </div>
                                          </div>
                                        </Link>
                                      </Popover>
                                    </h4>
                                  </div>
                                )}

                                {props.isAuthenticated && (
                                  <div className="flex flex-column pa4 bt bb b--black-10">
                                    <button
                                      disabled={
                                        this.state.project.crew.filter(
                                          a =>
                                            a.position &&
                                            a.position.position &&
                                            a.position.position ===
                                              this.state.drawerItem.title
                                        ).length > 0
                                      }
                                      onClick={this.applyForPosition}
                                      className="pointer flex flex-row justify-center flex-auto items-center mb0 ph4 pv3 bg-black-05 hover-bg-black-10 bn br1"
                                    >
                                      <span className="f5 fw6 black-40 hover-black-70">
                                        Apply for Position{" "}
                                        {this.state.project.crew.filter(
                                          a =>
                                            a.position === this.state.drawerItem
                                        ).length > 0 && "[ Filled ]"}
                                      </span>
                                      <div className="flex flex-row justify-between items-center">
                                        {this.state.buttonLoading && (
                                          <Spinner size={20} />
                                        )}
                                      </div>
                                    </button>
                                  </div>
                                )}

                                {!props.isAuthenticated && (
                                  <div className="flex flex-column pt3 ">
                                    <button
                                      disabled
                                      onClick={this.applyForPosition}
                                      className="pointer flex flex-row justify-center flex-auto items-center mb0 ph4 pv3 bg-black-05 hover-bg-black-10 bn br1"
                                    >
                                      <span className="f5 fw6 black-40 hover-black-70">
                                        Login to Apply for Position
                                      </span>
                                      <div className="flex flex-row justify-between items-center">
                                        {this.state.buttonLoading && (
                                          <Spinner size={20} />
                                        )}
                                      </div>
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Drawer>
                  )}
                </section>
              )}

              {this.state.invitationAccepted && (
                <div className="fixed top-0 left-0 w-100 h-100 bg-black-90 flex items-center justify-center">
                  <div className="flex flex-column items-center justify-center">
                    <div className="flex pv4">
                      <Icon
                        icon={"endorsed"}
                        iconSize={"100"}
                        className="white"
                      />
                    </div>
                    <div className="flex flex-row items-center justify-center white f3 fw5 pb3">
                      You successfully accepted your role as{" "}
                      <span className="fw6 mh1">
                        {Fn.get("account").user.position}
                      </span>{" "}
                      for this project.
                    </div>
                    <div className="flex flex-row items-center justify-center f5 fw5 white-60 pb3">
                      You will receive a project sheet via email within the next
                      few minutes.
                    </div>
                    <div className="flex flex-row items-center justify-center mt4">
                      <button
                        onClick={() => {
                          this.setState({ invitationAccepted: false });
                        }}
                        className="pointer flex ph4 pv2 f6 fw6 white- black bg-white hover-bg-white-50 round ttc"
                      >
                        close{" "}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </TransitionLayout>
          );
        }}
      </AccountContext.Consumer>
    );
  }
}

export default SingleProject;
SingleProject.contextType = AccountContext;

const NoPermissions = () => (
  <div className="tc flex flex-column pv3 ph4 f4 fw5 black-50">
    You do not have permission to view this content
  </div>
);
