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
import { Fn, app } from "../../../utils/fn/Fn.js";
import Loading from "../../elements/Loading.js";

import Bio from "../_Elements/Bio/Bio.jsx";
import Network from "../_Elements/Network/Network.jsx";
import RecentWork from "../RecentWork/index.js";
import Transition from "../../Layouts/Transition.js";
import Person from "../Person";
import UserList from "../UserList";
import "./style.css";
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

export default class Checklist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      project: this.props.project,
      drawerOpen: false,
      innerDrawerOpen: false,
      ready: false,
      checklistsReady: true,
      checklists: [],
      activeChecklist: {},
      checkListItemLabelInputError: false,
      view: null,
      views: [],
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
      searchLoading: false,
      activeCrewMember: null,
      inviteBusy: false,
      isDeleting: [],
      isDeletingStart: [],
      del: [],
      deleteConfirmation: [],
      drawerType: "search"
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.toggleInnerDrawer = this.toggleInnerDrawer.bind(this);
    this.closeInnerDrawer = this.closeInnerDrawer.bind(this);

    this.openFilePanel = this.openFilePanel.bind(this);
    this.setView = this.setView.bind(this);
    this.setChecklist = this.setChecklist.bind(this);
    // this.setButtons = this.setButtons.bind(this);
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
    this.inviteByEmail = this.inviteByEmail.bind(this);
    this.remove = this.remove.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.addChecklist = this.addChecklist.bind(this);
    this.addChecklistItem = this.addChecklistItem.bind(this);
    this.updateChecklistTitle = this.updateChecklistTitle.bind(this);
    this.checkItem = this.checkItem.bind(this);
    // this.inviteToProject = this.inviteToProject.bind(this)
    // this.toggleLightbox = this.toggleLightbox.bind(this)

    this.projectTitle = React.createRef();
    this.projectDescription = React.createRef();
    this.inviteByEmailAddress = React.createRef();
    this.checklistTitle = React.createRef();
    this.checklistItemLabel = React.createRef();
    // this.c/
    window.self = this;
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
  async checkItem(index) {
    let checklists = this.state.checklists;
    let checklist = checklists[this.state.activeChecklist];

    if (checklist.checked[index] === true) {
      checklist.checked[index] = false;
    } else {
      checklist.checked[index] = true;
    }

    checklists[this.state.activeChecklist] = checklist;
    this.setState({
      checklists: checklists
    });

    let project = this.props.project;

    project.checklists = checklists;

    await app.updateProject({self:this, project})

  }
  async addChecklistItem() {
    if (this.checklistItemLabel.current.value === "") {
      this.setState({
        checkListItemLabelInputError: true
      });
    } else {
      let item = {
        label: this.checklistItemLabel.current.value
      };

      console.log("new checklist item ", item);
      let checklists = this.state.checklists;
      let checklist = checklists[this.state.activeChecklist];

      checklist.items.push(item);
      checklist.checked.push(false);

      checklists[this.state.activeChecklist] = checklist;

      this.setState({
        checklists: checklists
      });
      this.setState({
        checkListItemLabelInputError: false
      });
      this.checklistItemLabel.current.value = null;

      let project = this.props.project;

    project.checklists = checklists;

    await app.updateProject({self:this, project})

    }

    

  }
  async updateChecklistTitle() {
    let title = this.checklistTitle.current.value;
    let activeChecklist = this.state.activeChecklist;
    let checklists = this.state.checklists;
    let checklist = checklists[activeChecklist];
    checklist.title = title;
    checklists[activeChecklist] = checklist;
    this.setState({
      checklists: checklists
    });

    let project = this.props.project;

    project.checklists = checklists;

    await app.updateProject({self:this, project})

  }

  async addChecklist() {

    let checklists = this.state.checklists;
    // let checklistLabel = this.checklistLabel.current.value;

    let newChecklist = {
      title: "Untitled",
      items: [],
      checked: []
    }

    checklists.push(newChecklist)

    this.setState({
      checklists: checklists,
      activeChecklist: this.state.checklists.length - 1
    })
    
    let project = this.props.project;

    project.checklists = checklists;

    await app.updateProject({self:this, project})


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
      let crew = project.crew;

      let itemIndex = crew.findIndex(a => a.id === userId);
      crew.splice(itemIndex, 1);

      project.crew = crew;

      await app.updateProject({ self: this, project }).then(async res => {
        await app.fetchCrew({ self: this, project });
      });
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
    this.setState({
      drawerType: type,
      drawerOpen: !this.state.drawerOpen
      // activeCrewMember: item
    });
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
  // setButtons() {

  //   this.setState({
  //     buttons: buttons,
  //     activeButton: buttons[0],
  //     views: views,
  //     view: views[0]
  //   });
  // }
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

    Fn.store({ label: "projectSettingsView", value: view });
    Fn.store({ label: "projectSettingsActiveButton", value: button });

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
  setChecklist(index) {
    this.setState({
      // view: view,
      activeChecklist: index
    });
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
      loading: true
      // x: TextTrackCueList
    });
    const project = this.props.project;

    // let checklists = project.checklists;
    let checklists = this.state.checklists;
    project.checklists = checklists;

    // project.start_date = this.state.startDate;
    // project.end_date = this.state.endDate;
    // project.title = this.projectTitle.current.value;
    // project.description = this.projectDescription.current.value;
    // project.location = this.state.location;
    // project.updatedAt = moment(new Date()).toString();

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
  componentDidMount = async () => {
    console.log('project',this.props.project)
    if(this.props.project.hasOwnProperty('checklists')){
      this.setState({
        checklists: this.props.project.checklists,
        activeChecklist: this.props.project.checklists[0],
        checklistsReady: true
      })
    }
    else {
      this.setState({
        checklists: [],
        activeChecklist: null,
        checklistsReady: true
      })
    }

    // this.setButtons();
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
    // await app.fetchProductionCrew({ self: this, project: this.props.project });
    // await app.fetchCrew({ self: this, project: this.props.project });
    // setTimeout(() => {
    //   this.setState({
    //     view: this.state.views[0],
    //     activeButton: this.state.buttons[0]
    //   })
    // },1000)
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
    return (
      <>
        <section id="People" className="flex flex-column w-100 pb4 pt0">
          <div className="flex flex-row mb4 ">
            <PageTitle
              title={"Checklist"}
              docs={this.state.checklists}
              ready={this.state.ready}
            />
          </div>

          <section id="CheckListBar" className="flex flex-column mb3 ">
            <div className="flex flex-row justify-between mb3">
              <div className="flex flex-row round">
                <button
                  title={"Add checklist"}
                  onClick={this.addChecklist}
                  // id={}
                  className={
                    " bg-black-20 flex flex-column pa0 mr3- pointer justify-center flex-auto"
                  }
                >
                  <div
                    id=""
                    className="flex flex-row ph0 pv0 items-center justify-center"
                  >
                    <span className="f5 fw6 white ph4 pv2">
                      Add Checklist
                      <Icon icon="plus" />
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </section>

          {this.state.checklistsReady && (
            <section id="CheckListBar" className="flex flex-column mb3 ">
              <div className="flex flex-row justify-between mb3">
                <div className="flex flex-row round">
                  {this.state.checklists.map((checklist, index) => (
                    <button
                      title={checklist.title}
                      onClick={() => {
                        this.setState({ activeChecklist: index });
                      }}
                      id={checklist.title}
                      className={
                        (index > 0 && " bl b--black-05 ") +
                        (this.state.activeChecklist === index
                          ? " bg-white-60 "
                          : " bg-white ") +
                        " flex flex-column pa0 mr3- pointer justify-center flex-auto"
                      }
                    >
                      <div
                        id=""
                        className="flex flex-row ph0 pv0 items-center justify-center ph4 "
                      >
                        <span
                         className="f5 fw6 black-70 pv2">
                          {checklist.title}
                        </span>
                        <span
                         className="f6 fw5 black-40 pv2 ml2">
                          {checklist.checked.filter(a => a === true).length} / {checklist.items.length} 
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

                  <UserList
                    crew={this.state.productionCrew}
                    invited={this.props.invited}
                    userAvatar={this.userAvatar}
                    confirmDelete={this.confirmDelete}
                    remove={this.remove}
                    state={this.state}
                    ready={this.state.ready}
                    toggleDrawer={this.toggleDrawer}
                    type={"production"}
                  />
                </div>
              </>
            )}

            {this.state.checklists.length > 0 && (
              <div
                id="Checklist_form"
                className="flex flex-column mb3 w-100 mw6 left"
              >
                <div className="flex flex-column w-100 pt4">
                  <div className="flex flex-column f4 fw7 black pb2">
                    <input
                      ref={this.checklistTitle}
                      className="checklist-title f4 fw6 black pv2 bn bg-transparent mb3"
                      type={"text"}
                      onChange={this.updateChecklistTitle}
                      value={
                        this.state.checklists[this.state.activeChecklist] &&
                        this.state.checklists[this.state.activeChecklist].title
                      }
                    />
                  </div>
                  <div className="flex flex-column f5 fw5 black-50 pv3">
                    Add checklist item
                  </div>

                  {/* {
                    this.state.checkListItemLabelInputError && 
                    <div className="flex flex-column f6 fw5 red ">Enter a label</div>
                  } */}
                </div>
                <div className="checklist-items flex flex-column flex-auto mw6 left mt3">
                  {this.state.checklists[this.state.activeChecklist] && this.state.checklists[this.state.activeChecklist].items.map(
                    (item, index) => (
                      <div
                        onClick={() => this.checkItem(index)}
                        className="checklist-item justify-between flex flex-row flex-auto ba mb3 br2 b--black-05"
                      >
                        <span className="flex flex-column f4 fw6 black-70 pv3 ph4">
                          {item.label}
                        </span>

                        <div
                          className={
                            (this.state.checklists[this.state.activeChecklist]
                              .checked[index]
                              ? " bg-blue "
                              : " bg-white-50 ") +
                            " flex flex-column items-center justify-center ph4 pv3 w3"
                          }
                        >
                          {this.state.checklists[this.state.activeChecklist]
                            .checked[index] ? (
                            <Icon icon={"tick"} className="white f4 fw6 " />
                          ) : (
                            <Icon icon={"ring"} className="black-20 f4 fw6 " />
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div
                  className={
                    (this.state.checkListItemLabelInputError
                      ? "  ba- b--re-d -bw2 "
                      : " ") + " flex flex-row f5 fw5 black-50 "
                  }
                >
                  <input
                    ref={this.checklistItemLabel}
                    className={
                      (this.state.checkListItemLabelInputError
                        ? " red "
                        : "  black-40 ") +
                      " checklist-item-title f5 fw6 ph3 pv3 bn w-100 "
                    }
                    placeholder={
                      this.state.checkListItemLabelInputError
                        ? "Enter a label"
                        : ""
                    }
                    type={"text"}
                    required={true}
                  />
                  <button
                    title={"Add checklist"}
                    onClick={this.addChecklistItem}
                    // id={}
                    className={" addChecklistButton ph0"}
                  >
                    <div
                      className={
                        " flex flex-column items-center justify-center ph4 pv3 w3 bg-black-20"
                      }
                    >
                      <Icon icon={"plus"} className="white f4 fw6 " />
                    </div>
                  </button>
                </div>
                {/* <FormCrew project={this.props.project} search={this.search} /> */}
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
          />
        </Dialog>

        <Drawer
          title={"Crew Search"}
          closable={true}
          onClose={this.toggleDrawer}
          visible={this.state.drawerOpen}
          width={"60vw"}
        >
          <>
            {this.state.drawerOpen && (
              <div className="pointer flex flex-column justify-end items-start pa3 bg-white ">
                {!this.state.searchLoading &&
                  this.state.drawerType === "search" && (
                    <Transition>
                      <h3 className="f5 fw4 black-50 tc pv2 ph3 word-break-all flex items-center">
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
                  className="pointer flex flex-column justify-end items-start pa3 bg-white w-100 flex-auto"
                >
                  <Drawer
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
                                            backgroundImage:
                                              "url(" +
                                              this.userAvatar(
                                                this.state.activeCrewMember
                                              ) +
                                              ")"
                                          }}
                                          className="center pointer round  cover bg-center"
                                        ></div>
                                      </div>
                                    </div>

                                    <div className="flex flex-column justify-center w-100 ph3">
                                      <div className="f4 flex flex-column items-center w-100 raleway ">
                                        <span className="flex flex-row-ns flex-column w-100 black f3 fw6">
                                          <span className="flex flex-row items-center justify-start-ns justify-center black-70 f5 fw6">
                                            {
                                              this.state.activeCrewMember
                                                .profile.name.first
                                            }{" "}
                                            {
                                              this.state.activeCrewMember
                                                .profile.name.last
                                            }
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <section id="ProfileButtons">
                                  <div className="flex flex-row mb2-ns w-100 bt b--black-05 ">
                                    <button
                                      title="View or upload CV"
                                      id="CV-button"
                                      className="db relative w-100 pa3 ph4 pv3 br1- bg-white bg-green-"
                                    >
                                      <div id="" className="db relative w-100">
                                        <span className="f5 fw6 black-60 -white ph3-">
                                          Cirriculum Vitae{" "}
                                        </span>
                                      </div>
                                    </button>
                                    <button
                                      title="View or upload CV"
                                      id="CV-button"
                                      className="db relative w-100 pa3 ph4 pv3 br1- bg-white "
                                      // style={{ background: "#e8e8ec" }}
                                    >
                                      <div id="" className="db relative w-100">
                                        <span className="f6 fw6 black-60 -white ph3-">
                                          Add to Network
                                        </span>
                                      </div>
                                    </button>
                                    <button
                                      title="View or upload CV"
                                      id="CV-button"
                                      className="db relative w-100 pa3 ph4 pv3 br1- bg-white bl b--white-20 bw1"
                                      // style={{ background: "#e8e8ec" }}
                                    >
                                      <div id="" className="db relative w-100">
                                        <span className="f6 fw6 black-60 -white ph3-">
                                          Send Message
                                        </span>
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
                                          this.state.activeCrewMember.profile
                                            .dob,
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
                                        {/* {this.userLocation()} */}
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
                                <RecentWork
                                  type={"user"}
                                  user={this.state.activeCrewMember}
                                  // projects={this.state.user.profile.projects}
                                  // addRecentWorkProject={this.addRecentWorkProject}
                                />
                              </>
                            )}
                        </div>
                      )}
                    </div>
                  </Drawer>

                  {this.state.searchLoading && (
                    <div className="flex flex-column pv3">
                      {/* <Spinner size={25} /> */}
                      <div className="sp sp-3balls"></div>
                    </div>
                  )}
                  {/* <div className="flex flex-row-ns flex-column w-100 f5 fw6 black pb3">
                {
                  
                }
                </div> */}
                  {!this.state.searchLoading &&
                    this.state.drawerType === "search" && (
                      <Transition>
                        {this.state.crew_[0].users.map(
                          (item, index) => (
                            console.log("item", item),
                            (
                              <Person
                                inviteToProject={this.inviteToProject}
                                toggleInnerDrawer={this.toggleInnerDrawer}
                                userAvatar={this.userAvatar}
                                item={item}
                                project={this.props.project}
                                position={this.state.crew_[0].position}
                              />
                            )
                          )
                        )}
                      </Transition>
                    )}
                </div>
              </div>
            )}

            {this.state.drawerType === "search" && (
              <div className="form-row flex flex-column ph3 pv3 bb b--black-05">
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
                      className="flex flex-column ph3 pv3 bn br1 bg-white black-50 f4 fw5 bs-a w-100"
                    />

                    <div class="flex flex-column w-20 bl b--black-05">
                      <button
                        onClick={this.inviteByEmail}
                        class="pointer flex h-100 items-center justify-center f6 bg-white bn f5 fw6 black-50 "
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

// export default People;
Checklist.contextType = AccountContext;
