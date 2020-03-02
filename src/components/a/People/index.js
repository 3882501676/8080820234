import React from "react";
import { Link } from "react-router-dom";
import { DatePicker, Drawer, Popconfirm, message, Checkbox } from "antd";
import moment from "moment";
import AccountContext from "../../../utils/context/AccountContext.js";
// import Fn from '../../../utils/fn/Fn.js';
import LocationSearchBar from "../../elements/display/forms/LocationSearchBar.js";
import PageTitle from "../../elements/layout/PageTitle_B.js";
import FormCrew from "../CrewFinder/CrewFinder_People.js";

import { Icon, Dialog, Spinner } from "@blueprintjs/core";

import { TH_LIST } from "@blueprintjs/icons/lib/esm/generated/iconNames";
import FormInvite from "../../elements/forms/Invite.js";
import constants from "../../../utils/constants.js";
import { Fn, app, api } from "../../../utils/fn/Fn.js";
import Loading from "../../elements/Loading.js";

import Bio from "../_Elements/Bio/Bio.jsx";
import Network from "../_Elements/Network/Network.jsx";
import RecentWork from "../RecentWork/index.js";
import Transition from "../../Layouts/Transition.js";
import Person from "../Person";
import UserList from "../UserList";
import UserDetail from "./UserDetail.js";
import UserDetailProject from "./UserDetailProject.js";

var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;

// import { motion, AnimatePresence } from 'framer-motion'
// // import { Motion, Frame, Scroll, useCycle } from "framer"

// const spring = {
//   type: "spring",
//   damping: 20,
//   stiffness: 300
// };

// const container = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: {
//       // delayChildren: 0.5,
//       staggerChildren: 0.5,
//       // delay: 1,
//     x: { type: "spring", stiffness: 100 },
//     default: { duration: 2 },
//     }

//   }
// }

// const item = {
//   hidden: { opacity: 0 },
//   show: { opacity: 1 }
// }

class People extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      project: this.props.project,
      drawerOpen: false,
      innerDrawerOpen: false,
      ready: false,
      buttonsReady: true,
      view: null,
      views: [],
      activeButton: {},
      buttons: [],
      projectType: this.props.project.type,
      startDate: this.props.project.start_date,
      endDate: this.props.project.end_date,
      location: this.props.project.location,
      loading: false,
      x: false,
      lightboxActive: false,
      productionCrew: [],
      crew: [],
      crew_: [],
      crewReady: false,
      productionCrewReady: false,
      searchLoading: false,
      activeCrewMember: null,
      inviteBusy: false,
      isDeleting: [],
      isDeletingStart: [],
      del: [],
      deleteConfirmation: [],
      drawerType: "search",
      items: [],
      crewProfileType: "production",
      profileDrawerType: "profile",
      permissionTypes: [],
      bulkSearch: false,
      isOpen: false
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.toggleInnerDrawer = this.toggleInnerDrawer.bind(this);
    this.closeInnerDrawer = this.closeInnerDrawer.bind(this);

    this.openFilePanel = this.openFilePanel.bind(this);
    this.setView = this.setView.bind(this);
    this.setButtons = this.setButtons.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleProjectTypeChange = this.handleProjectTypeChange.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.updateProjectLocation = this.updateProjectLocation.bind(this);
    this.openSearchDialog = this.openSearchDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.searchProjects = this.searchProjects.bind(this);
    this.userAvatar = this.userAvatar.bind(this);
    this.search = this.search.bind(this);
    this.bulkSearch = this.bulkSearch.bind(this);
    this.inviteByEmail = this.inviteByEmail.bind(this);
    this.remove = this.remove.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.reloadProject = this.reloadProject.bind(this);
    this.start = this.start.bind(this);
    this.userLocation = this.userLocation.bind(this);
    this.setPanelView = this.setPanelView.bind(this);
    this.setPermissionTypes = this.setPermissionTypes.bind(this);
    this.setPermission = this.setPermission.bind(this);
    this.showUserProfile = this.showUserProfile.bind(this);
    this.addProductionCrewMember = this.addProductionCrewMember.bind(this);
    // this.inviteToProject = this.inviteToProject.bind(this)
    // this.toggleLightbox = this.toggleLightbox.bind(this)

    this.projectTitle = React.createRef();
    this.projectDescription = React.createRef();
    this.inviteByEmailAddress = React.createRef();
    window.self = this;
  }
  async addProductionCrewMember(user) {
    await app
      .addProductionCrewMember({
        self: this,
        userId: user.id,
        project: this.props.project
      })
      .then(response => {
        console.log(response);
        if (response && response.status && response.status === "error") {
          this.setState({ isOpen: false });
        } else {
          this.setState({ isOpen: false });
          this.reloadProject();
        }
      });
  }
  showUserProfile(item) {
    console.log("showUserProfile", item);
    this.setState({
      innerDrawerOpen: true,
      activeCrewMember: item
    });
  }
  async bulkSearch(__) {
    console.log("bulkSearch", __);

    const { positions } = __;

    // this.toggleDrawer();
    this.setState({
      // drawerType: type,
      drawerOpen: !this.state.drawerOpen
      // activeCrewMember: item
    });

    this.setState({
      searchLoading: true,
      drawerType: "search",
      bulkSearch: true
    });

    let a = await Fn.fetchUsers({ self: this, positions });

    console.log("searched crew", a, this.state.crew_);
  }
  async search(data) {
    console.log("search", data);

    const { index, position, type } = data;

    this.toggleDrawer({ item: index, type });

    this.setState({
      searchLoading: true,
      drawerType: type
    });

    let positions = [position];

    let a = await Fn.fetchUsers({ self: this, positions });

    console.log("searched crew", a, this.state.crew);
  }
  setPermission(type) {
    // console.log('setPermission',type)

    let activeUserId = this.state.activeCrewMember.id;
    let project = this.state.project;
    let prodCrew = project.productionCrew;
    let prodCrewItem = prodCrew.filter(a => a.user === activeUserId)[0];
    let permissions = new Set(prodCrewItem.permissions);

    if (permissions.has(type.slug)) {
      console.log("permission exists, deleting");
      permissions.delete(type.slug);
    } else {
      console.log("permission does not exist, inserting");
      permissions.add(type.slug);
    }

    prodCrewItem.permissions = Array.from(permissions);

    let crewItemIndex = prodCrew.indexOf(prodCrewItem);

    prodCrew[crewItemIndex] = prodCrewItem;
    project.productionCrew = prodCrew;

    this.setState({
      project: project
    });

    app.updateProject({ self: this, project: project });
  }
  setPermissionTypes() {
    let permissionTypes = [
      {
        title: "Settings",
        slug: "projectsettings"
      },
      {
        title: "Files",
        slug: "projectfiles"
      },
      {
        title: "People",
        slug: "projectpeople"
      },
      {
        title: "Production Crew",
        slug: "projectprodcrew"
      },
      {
        title: "Production Crew Permissions",
        slug: "projectprodcrewpermissions"
      },
      {
        title: "Checklists",
        slug: "projectchecklists"
      },
      {
        title: "Rate Calculator",
        slug: "projectratecalculator"
      }
    ];
    this.setState({
      permissionTypes: permissionTypes
    });
    // let user = this.state.activeCrewMember;

    // user.permissions =
  }
  setPanelView(type) {
    this.setState({
      profileDrawerType: type
    });
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
  // toggleLightbox() {

  //   alert()

  //   this.setState({
  //     lightboxActive: !this.state.lightboxActive
  //   })
  // }
  //   async inviteToProject(item) {
  //     this.setState({ inviteBusy: true })
  //     console.log(item);
  // let userId = item.id;
  //     let project = this.props.project;
  //     let crew = project.crew;
  //     let position = this.state.crew_[0].position;
  //     let crewItem = {
  //       position: position,
  //       id: userId
  //     }
  //     // let itemIndex = crew.findIndex(a => a.id === userId);
  //     // crew.splice(itemIndex, 1);
  //     crew.push(crewItem)
  //     // this.setState({
  //     //   crew: crew
  //     // })

  //     project.crew = crew;

  //     await app.updateProject({ self: this, project }).then( async res => {
  //       await app.fetchCrew({ self: this, project })
  //       setTimeout(() => {

  //       this.setState({ inviteBusy: false })
  //       },1000)
  //     })

  //   }
  async reloadProject() {
    this.setState({ ready: false });
    console.log("reloadProject");
    let projectId = this.props.project.id;
    let project = await api.fetch("projects", projectId).then(project => {
      if (project) {
        this.setState({
          project: project
          // ready: true
        });
        this.props.updateProjectState(project);
        Fn.set("activeProject", project);
      }
    });
    this.start();
    // this.props.reloadProject()
  }
  confirmDelete({ item, index }) {
    let deleteConfirmation = this.state.deleteConfirmation;
    deleteConfirmation[index] = true;

    this.setState({
      deleteConfirmation: deleteConfirmation
    });
  }
  async remove({ e, item, index }) {
    e.stopPropagation();
    console.log('activeView', this.state.view)
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

      if(this.state.view === "production") {

        let prodCrew = project.productionCrew;
        let crewRoster = project.crewRoster;

        // let crew = project.crew;
  
        let itemIndex = prodCrew.findIndex(a => a.id === userId);
        let rosterItemIndex = crewRoster.findIndex( a => a.user === userId)
        // let invitedItemIndex = invited.findIndex(a => a.id === userId);
  
        prodCrew.splice(itemIndex, 1);
        crewRoster.splice(rosterItemIndex, 1)
        // invited.splice(i/nvitedItemIndex, 1);
  
        // console.log("crew", crew);
        // console.log("crew member to delete", userId);
        // console.log("index of crew member to delete", invitedItemIndex);
        // console.log("update crew list after delete", crew);
  
        project.productionCrew = prodCrew;
        project.crewRoster = crewRoster;
        // project.invited = invited;
  
        await app.updateProject({ self: this, project }).then(async res => {
          await app.fetchInvitedCrew({ self: this, project });
          this.reloadProject();
        });
      }
      if(this.state.view === "crew") {
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
        await app.fetchInvitedCrew({ self: this, project });
        this.reloadProject();
      });
      }
      
    }, 1000);
  }
  async inviteByEmail() {
    this.setState({ inviteBusy: true });
    let projectOwner = this.props.projectOwner;
    let email = this.inviteByEmailAddress.current.value;
    let position = this.state.crew_[0].position;
    let link = window.location.href + "?newInvite=true&referrer=email";
    await app.inviteByEmail({
      self: this,
      link,
      position,
      project: this.props.project,
      projectOwner,
      email
    });
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
    if (type === "crew") {
      this.setState({
        profileDrawerType: "profile"
      });
    }
    this.setState({
      drawerType: type,
      drawerOpen: !this.state.drawerOpen,
      activeCrewMember: item
    });
  }

  userAvatar(item) {
    let avatar =
      typeof item && item.profile && item.profile.picture !== "undefined"
        ? item.profile.picture
        : constants.placeholderImage;
    return avatar;
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

    console.log("search config ", data);

    console.log(this.state.projects);

    let location_;

    if (typeof data.location.County !== "undefined") {
      location_ = data.location.County.toLowerCase();
    } else {
      location_ = data.location.address.county.toLowerCase();
    }

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
  updateProjectLocation(item) {
    console.log("updateProjectLocation", item);
    this.setState({
      location: item
    });
  }
  setButtons() {
    const buttons = [
      {
        title: "Production",
        function: () => this.setView({ filter: "production", button: 0 })
      },

      {
        title: "Crew",
        function: () => this.setView({ filter: "crew", button: 1 })
      }
    ];

    const views = ["production", "crew"];

    this.setState({
      buttons: buttons,
      // activeButton: buttons[0],
      views: views
      // view: views[0]
    });

    if (JSON.parse(localStorage.getItem("projectPeopleActiveView")) !== null) {
      this.setState({
        view: JSON.parse(localStorage.getItem("projectPeopleActiveView"))
      });
    } else {
      this.setState({
        view: views[0]
      });
    }
    if (
      JSON.parse(localStorage.getItem("projectPeopleActiveButton")) !== null
    ) {
      this.setState({
        activeButton: JSON.parse(
          localStorage.getItem("projectPeopleActiveButton")
        )
      });
    } else {
      this.setState({
        activeButton: buttons[0]
      });
    }
  }
  setView(config) {
    const { view, button } = config;
    this.setState({
      ready: false
    });
    this.setState({
      view: view,
      activeButton: button
    });
    setTimeout(() => {
      this.setState({
        ready: true
      });
    }, 1000);

    Fn.store({ label: "projectPeopleActiveView", value: view });
    Fn.store({ label: "projectPeopleActiveButton", value: button });

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
  openFilePanel(file) {
    this.setState({
      activeFile: file
    });
    this.toggleDrawer();
  }

  handleProjectTypeChange = type => {
    this.setState({
      projectType: type
    });
  };
  handleStartDateChange = e => {
    window.log.warn("start date", e.toString());
    this.setState({
      startDate: e.toString()
    });
  };
  handleEndDateChange = e => {
    window.log.warn("end date", e.toString());
    this.setState({
      endDate: e.toString()
    });
  };
  updateProject = async () => {
    message.config({
      top: "40vh"
      // duration: 1000,
      // maxCount: 3,
    });
    message.loading("Saving project..", 0);
    // Dismiss manually and asynchronously
    // setTimeout(hide, 2500);

    this.setState({
      loading: true,
      x: TextTrackCueList
    });
    const project = this.props.project;

    project.start_date = this.state.startDate;
    project.end_date = this.state.endDate;
    project.title = this.projectTitle.current.value;
    project.description = this.projectDescription.current.value;
    project.location = this.state.location;
    project.updatedAt = moment(new Date()).toString();

    console.log("Project update data ", project);

    let url = Fn.api("projects") + project.id;

    let config = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(project)
    };

    await fetch(url, config)
      .then(res => {
        return res.json();
      })
      .then(res => {
        console.log(res);

        this.setState({ project: res });

        Fn.store({ label: "activeProject", value: res });

        setTimeout(() => {
          this.setState({
            loading: false,
            x: false
          });

          document.querySelector("body").scroll({
            top: 0,
            left: 0,
            behavior: "smooth"
          });
          message.destroy();
          message.success("Project Updated", 1000);
          setTimeout(() => {
            message.destroy();
          }, 1000);
        }, 1000);
        // this.props.updateProject({ project: res })
      });
  };
  async start() {
    let connectionIds = Fn.get('account').user.profile.connections;
    await app.fetchConnections({ self: this, connections: connectionIds });
    await app
      .fetchProductionCrew({ self: this, project: this.props.project })
      .then(productionCrew => {
        this.setState({
          productionCrewReady: true,
          productionCrew: productionCrew
        });
      });

    await app
      // .fetchCrew({ self: this, project: this.props.project })
      .fetchInvitedCrew({ self: this, project: this.props.project })
      .then(res => {
        let crew = this.props.project.crew;

        let invited = res;

        app.checkConfirmed({ invited, crew }).then(res => {
          let sorted = res
            .sort(function(a, b) {
              return a.isConfirmed - b.isConfirmed;
            })
            .reverse();

          this.setState({
            invited: sorted,
            items: sorted,
            crewReady: true
          });
        });
      });

    // setTimeout(() => {
    //   this.setState({
    //     view: this.state.views[0],
    //     activeButton: this.state.buttons[0]
    //   });
    // }, 1000);
  }
  componentDidMount = async () => {
    this.start();
    this.setPermissionTypes();
    this.setButtons();

    // if (localStorage.projectSettingsView !== null) {
    //   let view = Fn.get("projectSettingsView");
    //   this.setState({
    //     view: view
    //     // activeButton: activeButton
    //   });
    // } else {
    //   this.setState({
    //     view: "production"
    //   });
    // }
    // if (localStorage.projectSettingsActiveButton !== null) {
    //   let activeButton = Fn.get("projectSettingsActiveButton");
    //   this.setState({
    //     // view: view,
    //     activeButton: activeButton
    //   });
    // } else {
    //   this.setState({
    //     view: "production"
    //   });
    // }
  };

  static getDerivedStateFromError(error) {
    // getDerivedStateFromError -> Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
  }

  getDerivedStateFromProps = (nextProps, prevState) => {};

  getSnapshotBeforeUpdate = (prevProps, prevState) => {};

  componentDidUpdate = () => {};

  componentWillUnmount = () => {};

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    const profileDrawers = ["production", "crew"];

    return (
      <>
        <section id="People" className="flex flex-column w-100 pb4 pt0">
          <div className="flex flex-row pb3">
            <PageTitle
              title={"People"}
              docs={this.state.files}
              ready={this.state.ready}
            />

            {this.state.view === "production" && (
              <div
                id="SearchInvite"
                className="w-100 flex flex-row items-end justify-start justify-end-ns mb2"
              >
                <button
                  onClick={this.openSearchDialog}
                  className={
                    (Fn.get("isMobile") ? " w-100 mt3 " : "  ") +
                    " br1- round bs-b bg-black-20 ph4 pv2 pointer bn relative w-100-    "
                  }
                >
                  <span className="f5 fw6 white pv0 flex items-center justify-center pr2">
                    {this.state.buttonLoading ? (
                      <Icon
                        icon="loading"
                        className={" absolute right-0 f4 black-60 mr2"}
                      />
                    ) : (
                      <Icon
                        icon={"search"}
                        iconSize={12}
                        className={" f4 black-60- white  absolute right-0 mr3"}
                      />
                    )}{" "}
                    Search / Invite
                  </span>
                </button>
              </div>
            )}
          </div>

          {this.state.buttonsReady && (
            <section id="ToolbarButtons" className="flex flex-column mb3 ">
              <div className="flex flex-row justify-between mb3">
                <div className="flex flex-row round">
                  {this.state.buttons.map((button, index) => (
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
                        (index > 0 && " bl b--black-05 ") +
                        (this.state.activeButton.title === button.title
                          ? " bg-white-60 "
                          : " bg-white ") +
                        " flex flex-column pa0 mr3- pointer justify-center flex-auto"
                      }
                    >
                      <div
                        id=""
                        className="flex flex-row ph0 pv0 items-center justify-center"
                      >
                        <span className="f5 fw6 black-40 ph4 pv2">
                          {button.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          <div className="w-100-ns w-100 flex flex-row flex-wrap justify-between br3- -overflow-hidden">
            {this.state.x ? (
              <Icon
                icon="loading"
                iconSize="15"
                className="absolute right-0 f4 black-60 mr3"
              />
            ) : (
              <Icon
                icon="swap-right"
                iconSize="15"
                className="f4 black-60 -white  absolute right-0 mr3"
              />
            )}

            {this.context.isAuthenticated && this.state.view === "production" && (
              <>
                <div
                  id="ProductionCrewList"
                  className="flex flex-column mb3 w-100"
                >
                  <div className="flex flex-row f5 fw5 black-50 pb4 items-center">
                    Assigned Production Crew{" "}
                    <div
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        marginLeft: "1rem",
                        background: "#c4c4c7"
                      }}
                      className={"  count-badge- f7 pv1 ph2 br1 -bg-white "}
                    >
                      <span className={"bg-white-"}>
                        {(this.state.ready &&
                          this.state.productionCrew.length) ||
                          0}
                      </span>
                    </div>
                  </div>

                  {/* <UserList 
                  crew={this.state.productionCrew}
                  userAvatar={this.userAvatar}
                  confirmDelete={this.confirmDelete}
                  remove={this.remove}
                  state={this.state}
                  ready={this.state.ready}
                  toggleDrawer={this.toggleDrawer}
                  /> */}
                  {!this.state.ready && (
                    <div className="flex flex-column pv4 items-start items-center justify-center w-100">
                      {/* <Spinner size={25} /> */}
                      <div className="sp sp-3balls"></div>
                    </div>
                  )}

                  {this.state.productionCrewReady && (
                    <UserList
                      // crew={this.state.productionCrew}
                      items={this.state.productionCrew}
                      invited={this.props.invited}
                      userAvatar={this.userAvatar}
                      confirmDelete={this.confirmDelete}
                      remove={this.remove}
                      state={this.state}
                      ready={this.state.ready}
                      toggleDrawer={this.toggleDrawer}
                      type={"production"}
                      columns={2}
                    />
                  )}

                  {/* <div className="flex flex-column mt0 w-100" id="">
                    {this.state.ready && this.state.productionCrew.map((item, index) => (
                      <Link
                        to={"/user/" + item.id}
                        id="ProjectOwner"
                        className="flex flex-column w-100 pb2"
                      >
                        <div className="flex flex-row-ns flex-column w-100">
                          <div className="flex flex-column w-100=">
                            <div className="round pa1 bg-white center">
                              <div
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  backgroundImage:
                                    "url(" + this.userAvatar(item) + ")"
                                }}
                                className="center pointer round  cover bg-center"
                              ></div>
                            </div>
                          </div>

                          <div className="flex flex-column justify-center w-100 ph4">
                            <div className="f4 flex flex-column items-center w-100 raleway ">
                              <span className="flex flex-row-ns flex-column w-100 black f3 fw6">
                                <span className="flex flex-row items-center justify-start-ns justify-center black-70 f5 fw6">
                                  {item.profile.name.first}{" "}
                                  {item.profile.name.last}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div> */}
                </div>

                <div className="form-row flex flex-column pt4 w-100">
                  <div className="form-row flex flex-column  pa3 br4 ba b--black-05 w-100">
                    <div className="form-row flex flex-row  w-100">
                      <button
                        onClick={this.addSkillInput}
                        className="pointer bn br2 bg-black-05 hover-bg-black-10 f5 fw6 black-50 pv4 ph3 w-100"
                      >
                        Add +
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {this.context.isAuthenticated && this.state.view === "crew" && (
              <>
                <div id="CrewList" className="flex flex-column mb3 w-100">
                  <div className="flex flex-row f5 fw5 black-50 pb4 items-center">
                    Invited Crew{" "}
                    <div
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        marginLeft: "1rem",
                        background: "#c4c4c7"
                      }}
                      className={"  count-badge- f7 pv1 ph2 br1 -bg-white "}
                    >
                      <span className={"bg-white-"}>
                        {(this.state.crewReady && this.state.crew.length) || 0}
                      </span>
                    </div>
                  </div>
                  {!this.state.ready && (
                    <div className="flex flex-column pv4 ph3 items-center justify-center w-100">
                      {/* <Spinner size={25} /> */}
                      <div className="sp sp-3balls"></div>
                    </div>
                  )}

                  {this.state.crewReady && (
                    <UserList
                      crew={this.state.crew}
                      items={this.state.items}
                      invited={this.props.invited}
                      userAvatar={this.userAvatar}
                      confirmDelete={this.confirmDelete}
                      remove={this.remove}
                      state={this.state}
                      ready={this.state.ready}
                      toggleDrawer={this.toggleDrawer}
                      type={"crew"}
                      columns={2}
                    />
                  )}
                </div>
              </>
            )}

            {this.context.isAuthenticated && this.state.view === "crew" && (
              <div
                id="SettingsForm_Crew"
                className="flex flex-column mb3 w-100"
              >
                <div className="flex flex-column w-100 pt4">
                  <div className="flex flex-column f4 fw7 black pb2">
                    Role List
                  </div>
                  <div className="flex flex-column f5 fw5 black-50">
                    Please select a list of crew roles below
                  </div>
                </div>
                <FormCrew
                  project={this.props.project}
                  search={this.search}
                  bulkSearch={this.bulkSearch}
                />
              </div>
            )}
          </div>
        </section>

        <Dialog
          className={"bp3-light"}
          // icon="info-sign"
          onClose={this.closeDialog}
          title={this.state.dialogTitle}
          {...this.state}
        >
          <FormInvite
            inviteBusy={this.state.inviteBusy}
            inviteByEmail={this.inviteByEmail}
            project={this.props.project}
            projectOwner={this.props.projectOwner}
            productionCrew={this.state.productionCrew}
            addProductionCrewMember={this.addProductionCrewMember}
          />
        </Dialog>

        <Drawer
          title={"Crew Search"}
          closable={true}
          onClose={this.toggleDrawer}
          visible={this.state.drawerOpen}
          width={"60vw"}
        >
          <Drawer
            title={"Crew Search"}
            closable={true}
            onClose={this.closeInnerDrawer}
            visible={this.state.innerDrawerOpen}
            width={"40vw"}
          >
            {this.state.innerDrawerOpen && (
              <UserDetail user={this.state.activeCrewMember} />
            )}
          </Drawer>
          <>
            {this.state.drawerOpen && (
              <div className="pointer flex flex-column justify-end items-start pa3- bg-white h-100- ">
                {profileDrawers.includes(this.state.drawerType) && (
                  <>
                    <>
                      {this.state.drawerType === "production" && (
                        <div className="flex flex-row overflow-hidden w-100">
                          <button
                            onClick={() => this.setPanelView("profile")}
                            title="Profile"
                            id="Profile"
                            className={
                              (this.state.profileDrawerType === "profile"
                                ? " bg-black-05 black-50 "
                                : " bg-black-10 black-30 ") +
                              "   flex flex-column pa0 mr3- pointer justify-center items-center flex-auto"
                            }
                          >
                            <div
                              id=""
                              className="flex flex-row ph0 pv0 items-center justify-center"
                            >
                              <span className="f5 fw6 black-40- -white ph3 pv4 w-100 tc">
                                Profile
                              </span>
                            </div>
                          </button>
                          <button
                            onClick={() => this.setPanelView("permissions")}
                            title="Permissions"
                            id="Permissions"
                            className={
                              (this.state.profileDrawerType === "permissions"
                                ? " bg-black-05 black-50 "
                                : " bg-black-10 black-30 ") +
                              "  flex flex-column pa0 mr3- pointer justify-center items-center flex-auto"
                            }
                          >
                            <div
                              id=""
                              className="flex flex-row ph0 pv0 items-center justify-center"
                            >
                              <span className="f5 fw6 black-40- white- ph3 pv4 w-100 tc">
                                Permissions
                              </span>
                            </div>
                          </button>
                          <button
                            onClick={() => this.setPanelView("detail")}
                            title="Detail"
                            id="Detail"
                            className={
                              (this.state.profileDrawerType === "detail"
                                ? " bg-black-05 black-50 "
                                : " bg-black-10 black-30 ") +
                              "  flex flex-column pa0 mr3- pointer justify-center items-center flex-auto"
                            }
                          >
                            <div
                              id=""
                              className="flex flex-row ph0 pv0 items-center justify-center"
                            >
                              <span className="f5 fw6 black-40- white- ph3 pv4 w-100 tc">
                                Detail
                              </span>
                            </div>
                          </button>
                        </div>
                      )}
                    </>
                    {this.state.profileDrawerType === "permissions" && (
                      <div
                        id="Permissions"
                        className="raleway flex flex-column pa5 w-100"
                      >
                        <div className="flex flex-column mt0 w-100" id="">
                          <div className="form-row flex flex-column">
                            <div className="form-row flex flex-row items-center">
                              <span className="f5 fw4 black-50 pb3">
                                Set user permissions
                              </span>
                            </div>
                            <div className="form-row flex flex-row items-center">
                              <span className="f4 fw6 black-80 pb3">
                                User can edit
                              </span>
                            </div>

                            <div className="form-row flex flex-column">
                              {this.state.permissionTypes.map((item, index) => (
                                <div className="form-row flex flex-row pt4 items-center">
                                  <label className="f5 fw6 black-70 pb3- ttc tl mr4 w-30">
                                    {item.title}
                                  </label>

                                  <div
                                    className={
                                      "  checkbox-square  flex flex-row -flex-column pt2-ns pl3 f5 fw6 black ph4  "
                                    }
                                  >
                                    <Checkbox
                                      type={"checkbox"}
                                      onChange={() => this.setPermission(item)}
                                      checked={this.state.project.productionCrew
                                        .filter(
                                          a =>
                                            a.user ===
                                            this.state.activeCrewMember.id
                                        )[0]
                                        .permissions.includes(item.slug)}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.state.profileDrawerType === "profile" && (
                      <UserDetail user={this.state.activeCrewMember} />
                    )}
                    {this.state.profileDrawerType === "detail" && (
                      <UserDetailProject project={this.props.project} user={this.state.activeCrewMember} />
                    )}
                  </>
                )}
                {!this.state.searchLoading &&
                  this.state.drawerType === "search" &&
                  !this.state.bulkSearch && (
                    <Transition>
                      <h3 className="f5 fw4 black-50 tc pv4 ph4 word-break-all flex items-center mb0">
                        <span className="flex flex-row ph2 pv0 round bg-black-20 white mr2 f5 fw6">
                          {!this.state.searchLoading &&
                            this.state.crew_[0] &&
                            this.state.crew_[0].users.length}
                        </span>{" "}
                        Users with role{" "}
                        <span className="fw6 white ml2 ph3 pv1 round bg-black-20">
                          {!this.state.searchLoading &&
                            this.state.crew_[0] &&
                            this.state.crew_[0].position}
                        </span>
                      </h3>
                    </Transition>
                  )}

                <div
                  // onClick={this.toggleLightbox}
                  className="pointer flex flex-column justify-start items-start -pv3- -ph4 bg-white w-100 flex-auto overflow-auto h-100"
                >
                  {/* <Drawer
                    title="Crew Detail"
                    placement="right"
                    closable={true}
                    onClose={this.closeInnerDrawer}
                    visible={this.state.innerDrawerOpen}
                    width={"40vw"}
                  >
                    <div
                      // onClick={this.toggleLightbox}
                      className="pointer flex flex-column justify-end items-start pa0 bg-white w-100 flex-auto"
                    >
                      {this.state.innerDrawerOpen && (
                        <div
                          // onClick={this.toggleLightbox}
                          className="pointer flex flex-column justify-end items-start pa0 bg-white"
                        >
                          {!this.state.searchLoading &&
                            this.state.activeCrewMember !== null && (
                              
                            )}
                        </div>
                      )}
                    </div>
                  </Drawer> */}

                  {this.state.searchLoading && (
                    <div className="flex flex-column items-center justify-center pv4 ph4 w-100">
                      {/* <Spinner size={25} /> */}
                      <div className="sp sp-3balls"></div>
                    </div>
                  )}
                  {/* <div className="flex flex-row-ns flex-column w-100 f5 fw6 black pb3">
                {
                  
                }
                </div> */}
                  {!this.state.searchLoading &&
                    this.state.drawerType === "search" &&
                    !this.state.bulkSearch && (
                      <Transition>
                        {this.state.crew_[0].users.map((item, index) => (
                          // console.log("item", item),
                          <Person
                            projectOwner={this.props.projectOwner}
                            inviteToProject={this.inviteToProject}
                            toggleInnerDrawer={this.toggleInnerDrawer}
                            userAvatar={this.userAvatar}
                            item={item}
                            project={this.props.project}
                            position={item.position}
                            showUserProfile={this.showUserProfile}
                            // positions={t.positions}
                            reloadProject={this.reloadProject}
                          />
                        ))}
                      </Transition>
                    )}

                  {!this.state.searchLoading &&
                    this.state.drawerType === "search" &&
                    this.state.bulkSearch &&
                    this.state.crew_.map((item, index) => (
                      // console.log("bulk search position item", item),
                      <div className="flex flex-column pb3 mb3 bb b--black-05 w-100">
                        <Transition>
                          <h3 className="f5 fw4 black-50 tc pv4 ph4 word-break-all flex items-center mb0">
                            <span className="flex flex-row ph2 pv0 round bg-black-20 white mr2 f5 fw6">
                              {item.users.length}
                            </span>{" "}
                            Users with role{" "}
                            <span className="fw6 white ml2 ph3 pv1 round bg-black-20">
                              {item.position}
                            </span>
                          </h3>
                        </Transition>

                        <Transition>
                          {item.users.map((item_, index_) => (
                            // console.log("bulk search user item", item_),
                            <Person
                              showUserProfile={this.showUserProfile}
                              projectOwner={this.props.projectOwner}
                              inviteToProject={this.inviteToProject}
                              toggleInnerDrawer={this.toggleInnerDrawer}
                              userAvatar={this.userAvatar}
                              item={item_}
                              project={this.props.project}
                              position={item_.position}
                              // positions={this.state.crew_.positions}
                              reloadProject={this.reloadProject}
                              bulkSearch={true}
                            />
                          ))}
                        </Transition>

                        {this.state.drawerType === "search" &&
                          this.state.bulkSearch && (
                            <div className="form-row flex flex-column ph4 pv4 bt bb b--black-05">
                              <div className="form-row flex flex-column">
                                <div className="flex flex-row f5 fw4 black-50 pb3">
                                  Invite user by email for position{" "}
                                  <span className="fw6 black ml2">
                                    {!this.state.searchLoading && item.position}
                                  </span>
                                </div>

                                {/* <label className="f6 fw5 black-50 pb2">Email address</label> */}
                                <div className="flex flex-row ">
                                  <input
                                    ref={this.inviteByEmailAddress}
                                    type={"text"}
                                    placeholder={"Enter email address"}
                                    className="flex flex-column ph3 pv3  br1 bg-white black-50 f4 fw5 ba w-100 b--black-05"
                                  />

                                  <div className="flex flex-column w-20 bl b--black-05">
                                    <button
                                      onClick={this.inviteByEmail}
                                      className="pointer flex h-100 items-center justify-center f6 bg-near-white bn f5 fw6 black-50 "
                                    >
                                      Invite
                                      {this.state.inviteBusy ? (
                                        <div className="flex flex-column items-start ml2">
                                          <Spinner size={15} />
                                        </div>
                                      ) : (
                                        <Icon
                                          icon="arrow-right"
                                          className="ml2"
                                        ></Icon>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    ))}

                  {/* {!this.state.searchLoading &&
                    this.state.drawerType === "search" && this.state.bulkSearch && (
                      <Transition>
                        {this.state.crew_.map(
                          (item, index) => (
                            console.log("item", item),
                            (
                              <Person
                                projectOwner={this.props.projectOwner}
                                inviteToProject={this.inviteToProject}
                                toggleInnerDrawer={this.toggleInnerDrawer}
                                userAvatar={this.userAvatar}
                                item={item}
                                project={this.props.project}
                                position={this.state.crew_[0].position}
                                positions={this.state.crew_.positions}
                                reloadProject={this.reloadProject}
                                bulkSearch={true}
                              />
                            )
                          )
                        )}
                      </Transition>
                    )} */}
                </div>
              </div>
            )}

            {this.state.drawerType === "search" && !this.state.bulkSearch && (
              <div className="form-row flex flex-column ph4 pv4 bt bb b--black-05">
                <div className="form-row flex flex-column">
                  <div className="flex flex-row f5 fw4 black-50 pb3">
                    Invite user by email for position{" "}
                    <span className="fw6 black ml2">
                      {!this.state.searchLoading &&
                        this.state.crew_[0] &&
                        this.state.crew_[0].position}
                    </span>
                  </div>

                  {/* <label className="f6 fw5 black-50 pb2">Email address</label> */}
                  <div className="flex flex-row ">
                    <input
                      ref={this.inviteByEmailAddress}
                      type={"text"}
                      placeholder={"Enter email address"}
                      className="flex flex-column ph3 pv3  br1 bg-white black-50 f4 fw5 ba w-100 b--black-05"
                    />

                    <div className="flex flex-column w-20 bl b--black-05">
                      <button
                        onClick={this.inviteByEmail}
                        className="pointer flex h-100 items-center justify-center f6 bg-near-white bn f5 fw6 black-50 "
                      >
                        Invite
                        {this.state.inviteBusy ? (
                          <div className="flex flex-column items-start ml2">
                            <Spinner size={15} />
                          </div>
                        ) : (
                          <Icon icon="arrow-right" className="ml2"></Icon>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>{" "}
        </Drawer>
      </>
    );
  }
}

export default People;
People.contextType = AccountContext;
