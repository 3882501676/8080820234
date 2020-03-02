import React from "react";
// import React, { getGlobal, setGlobal, useGlobal } from "reactn";
import { Redirect, Link } from "react-router-dom";
import moment, { fn } from "moment";
import { Popover, Empty, Skeleton, Rate, Tooltip } from "antd";

import TransitionLayout from "../../Layouts/Transition";
// import ListChefs from "../../elements/display/chefs/list";
import PageTitle from "../../elements/layout/PageTitle_B";
// import ChefInfo from "../../elements/display/drawers/ProjectInfo";
import LocationSearchFormWrapper from "../../elements/display/forms/LocationSearchFormWrapper";
import OnboardingScreen from "../../elements/display/onboarding/OnboardingScreen";
import LocationSearchBar from "../../elements/display/forms/LocationSearchBar";
import { Icon, Spinner, Dialog, NumericInput } from "@blueprintjs/core";

import Filepond from "../../elements/upload/Filepond.js";

import FormBio from "../../a/FormBio/index.js";
import FormProfile from "../../a/FormProfile/index.js";
import FormPortfolioProject from "../../a/FormPortfolioProject/index.js";
import FormSkills from "../../a/FormSkills/index.js";

import RecentWork from "../../a/RecentWork/index.js";
import RecentWorkArchive from "../../a/RecentWorkArchive/index.js";
import ProjectCalendar from "../../a/ProjectCalendar/index.js";
import ProjectCalendar2 from "../../a/ProjectCalendar2/index.js";
import Calendar from "./Calendar/index.js";
import SectionTitle from "../../a/_Elements/SectionTitle/SectionTitle.jsx";
// import Fn from '../../../utils/fn/Fn';
import { Fn, app, api } from "../../../utils/fn/Fn.js";
import { Bio, Network } from "../../a/_Elements";

import AccountContext, {
  AccountConsumer
} from "../../../utils/context/AccountContext";
import "./style.css";

var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;
// import { dilate } from "popmotion/lib/calc";
// window.getGlobal = getGlobal;
// window.useGlobal = useGlobal;
// window.setGlobal = setGlobal;

class OwnProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dialogType: "",
      dialogTitle: "",
      // chefs: [],
      // activeChef: getGlobal().activeChef,
      ready: false,
      insertModalVisible: false,
      chefInfoVisible: false,
      loading: false,
      // theme: Fn.get('theme').config.theme,
      toMessages: false,
      conversationReady: false,
      activeTab: "1",
      drawerReady: false,
      // locationIsSet: getGlobal().locationIsSet,
      progressBarPercent: 0,
      progressBarActive: false,
      showLocationForm: false,
      showOnboardingScreen: false,
      // location: getGlobal().location,
      // activeCurrency: getGlobal().activeCurrency,
      account: null,
      searchCity: "",
      uploadType: "profileImage",
      connections: [],
      connectionsReady: false,
      AddToNetworkButtonLoading: false,
      AddToProjectButtonLoading: false,
      recentWorkProjects: [],
      subscribedProjectsReady: false,
      user: null
    };

    // this.fetchChefs = this.fetchChefs.bind(this);
    // this.fetchChefs2 = this.fetchChefs2.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.hideDrawer = this.hideDrawer.bind(this);
    this.refresh = this.refresh.bind(this);
    // this.updateActiveDoc = this.updateActiveDoc.bind(this);
    this.setLocation = this.setLocation.bind(this);
    this.start = this.start.bind(this);
    this.focusLocationSearch = this.focusLocationSearch.bind(this);

    this.reserve = this.reserve.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    // this.submitReservationRequest = this.submitReservationRequest.bind(this);
    // this.setFilter = this.setFilter.bind(this)
    this.toggleDialog = this.toggleDialog.bind(this);

    this.addToNetwork = this.addToNetwork.bind(this);
    this.addToProject = this.addToProject.bind(this);
    this.cv = this.cv.bind(this);
    this.networkSeeAll = this.networkSeeAll.bind(this);
    this.editBio = this.editBio.bind(this);
    this.submitBio = this.submitBio.bind(this);
    this.submitProfile = this.submitProfile.bind(this);
    this.editSkills = this.editSkills.bind(this);
    this.updateSkills = this.updateSkills.bind(this);
    this.editProfile = this.editProfile.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.avatar = this.avatar.bind(this);
    this.fetchConnections = this.fetchConnections.bind(this);
    // this.sendMessage = this.sendMessage.bind(this);
    this.userLocation = this.userLocation.bind(this);
    this.addRecentWorkProject = this.addRecentWorkProject.bind(this);
    this.navigateToUser = this.navigateToUser.bind(this);

    console.log("[[ OwnProfile props ]]", props);
  }
  navigateToUser(config) {
    const { id } = config;

    this.setState({
      ready: false,
      userId: null,
      user: null,
      connections: [],
      projects: [],
      events: [],
      subscribedProjectsReady: false
    });

    setTimeout(() => {
      this.props.history.push("/null");
      this.props.history.push("/user/" + id);
    }, 300);
  }
  addRecentWorkProject() {
    this.toggleDialog({ type: "addPortfolioProject", title: "Add a Project" });
  }
  userLocation() {
    let user = this.context.account.user;
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
  // async sendMessage(item) {

  //   console.log('[[ SendMessage ]]', item)

  //   let selfUserId = this.context.account.user.id;

  //   // let recipientId =
  //   // const conversationExists = await Fn.checkConversationExists({ self: this,  })
  //   // await Fn.
  // }
  async fetchConnections() {
    let connections = this.context.account.user.profile.connections;
    await Fn.fetchConnections({ self: this, connections });
  }
  async submitBio(data) {
    // this.props.submitBio
    console.log(data);
    await Fn.submitBio({ self: this, data: data });
  }
  async updateSkills(skills) {
    await Fn.updateSkills({ self: this, skills });
  }
  async submitProfile(data) {
    // this.props.submitBio
    console.log(data);
    await Fn.submitProfile({ self: this, data: data });
  }

  toggleDialog(config) {
    const { type, title } = config;

    this.setState({
      isOpen: !this.state.isOpen,
      dialogType: type,
      dialogTitle: title
    });

    // if(type === "profileImage"){
    //   this.setState({
    //     uploadType: 'profileImage'
    //   })
    // }
  }
  closeDialog() {
    this.setState({
      isOpen: false
    });
  }
  editBio() {
    this.toggleDialog({ type: "bio", title: "Edit your bio" });
  }
  editSkills() {
    this.toggleDialog({ type: "editSkills", title: "Edit your skills" });
  }
  editProfile() {
    this.toggleDialog({ type: "profile", title: "Edit your profile" });
  }
  networkSeeAll() {
    this.toggleDialog({ type: "bio", title: "Edit your bio" });
  }

  async addToNetwork() {
    // alert()
    // this.toggleDialog({type: 'addToNetwork', title: 'Edit your bio'})
    this.setState({
      AddToNetworkButtonLoading: true
    });

    let item = this.state.user;

    await Fn.addToNetwork({ self: this, item: item });
  }

  addToProject() {
    // this.toggleDialog({type: 'addToProject', title: 'Edit your bio'})
  }
  cv() {
    this.toggleDialog({ type: "cv", title: "Upload your CV" });
  }
  focusLocationSearch() {}
  reserve(doc) {
    console.log(doc);
    this.setState({ activeDoc: doc });
    // setGlobal({ reserve: true, recipient: doc });
  }
  async sendMessage(data) {

    console.log("doc", data);

    let selfUserId = this.context.account.user.id;

    let recipientId = data.id;

    // let participants = [selfUserId, recipientId];

    await app.checkConversationExists({
      self: this,
      selfUserId,
      recipientId: data.id
    }).then( async response => {
      console.log('checkConversationExists response', response)

      if(!response.exists) {

        await app.createNewConversation({ self: this, selfUserId, recipientId }).then( async conversation => {

          console.log('newly created conversation ', conversation)
          Fn.set('activeConversation', conversation)
          this.props.history.push("/messages")
          
        })

      }
      else {

        Fn.set("activeConversation", response.conversation)

        this.props.history.push("/messages")

      }
      
    })

    // if (!conversationExists.exists) {
    //   // console.log('participants',participants)

    //   await Fn.createNewConversation({ self: this, selfUserId, recipientId });
    //   this.props.history.push("/messages");
    // } else {
    //   // Fn.getConversationData({})
    //   Fn.store({
    //     label: "activeConversation",
    //     value: conversationExists.conversation
    //   });
    //   this.props.history.push("/messages");
    // }

    // return await Fn.sendMessage({ doc, self: this })
  }

  async refresh() {
    return await Fn.refresh({ self: this });
  }
  async showDrawer(chef) {
    return await Fn.showDrawer({ chef, self: this });
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
  async submitReservationRequest(data) {
    return await Fn.submitReservationRequest({ data, self: this });
  }
  async setLocation() {
    return await Fn.setLocation({ self: this });
  }

  async start() {
    // find location by browser geolocation,
    // then query Here maps api for location data using reverse geolocation.
    return await Fn.setLocation({ self: this });
  }
  avatar(data) {
    console.log("avatar ", data);
    const user = data.user;

    if (user && user.profile && user.profile.picture.length > 0) {
      return user.profile.picture;
    } else {
      return "/img/placeholder.png";
    }
  }
  componentWillUnmount() {}
  componentDidUpdate() {
    console.log("[[ Home Updated ]]", this.props);
  }
  componentWillMount() {
    app.checkAuth(this).then(async result => {
      console.log('Check Authorization Status', result)
      if(result === false) {
        return
      }
    })

  }
  async componentDidMount() {

    this.context.setPage({ title: "Profile", subtitle: "..."})

    // console.log()
    // app.checkAuth(this).then(async result => {
    //   console.log('Check Authorization Status', result)
    //   if(result === false) {
    //     return
    //   }
     
    // });
    if(this.context.account && this.context.account.user) {
      const user = this.context.account.user;
      if (
        this.context.account &&
        this.context.account.user &&
        this.context.account.user.profile &&
        this.context.account.user.profile.name.first.length === 0
      ) {
        this.editProfile();
      }

      // let user = this.context.account && this.context.account.user || {};
    let userId = user && user.id;

    this.setState({
      user: user
    });

    // console.log(" ");
    // console.log(" ");
    // console.log("[[ ViewProfile.js Mounted ]]");
    // console.log(" ");
    // console.log(" ");

    // console.log("viewprofile props", this.props);
    // let userId = this.props.match.params.id;

    let projects = await app
      .fetchSubscribedProjects({ self: this, userId })
      .then(async projects => {
        this.setState({
          projects: projects,
          subscribedProjectsReady: true,
          ready: true
        });
      });

    await Fn.fetchConnections({
      self: this,
      connections: user.profile.connections
    }).then(connections => {
      this.setState({
        connectionsReady: true
      });
      Fn.set('connections', connections)
    });

    }
   

    
    // Fn
    // Fn.set("activeUser", user);

    // console.log("user", user);

    // this.setState({
    //   user: user,
    //   ready: true
    // });

    document.querySelector("body").scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });

    // Fn.fetchSubscribedProjects({ self: this, userId });

    // this.fetchConnections();

    // if (localStorage.getItem("crewBuilder") !== null) {

    //   if (!Fn.get("crewBuilder").hasBeenUploaded) {
    //     let project = Fn.get("crewBuilder");
    //     await Fn.createProject({ self: this, project });
    //   }

    // }

    // document.querySelector("body").scroll({
    //   top: 0,
    //   left: 0,
    //   behavior: "smooth"
    // });

    // if(localStorage.getItem('accountType') !== null && JSON.parse(localStorage.getItem('accountType')) === "production") {
    //   if(!Fn.get('crewBuilder').hasBeenUploaded) {
    //     let project = Fn.get('crewBuilder');
    //     await Fn.createProject({ self: this, project })
    //   }
    // }
    
  }
  render() {
    return (
      <AccountConsumer>
        {props => (
          // console.log("[[ OwnProfile <AccountContext.Consumer> ]]", props),
          (
            this.state.ready && 
            <TransitionLayout>
              {/* {console.log('[[[[[ user', user),
                user
                && user.extended
                && user.extended.config
                && user.extended.config.onboardingcomplete === false
                && <OnboardingScreen location={this.state.location} />
              } */}
              <section
                id="Home"
                className={" w-100 mw8 center pa4-ns pa0 pb6 "}
              >
                <div
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
                </div>

                <section
                  id="Profile"
                  className="flex flex-column w-100 pb3 pt3"
                >
                  <div className="flex flex-row-ns flex-column w-100 justify-center items-center">
                    <div className="flex flex-column w-100=">
                      <Tooltip placement="top" title={"Update your avatar"}>
                        <div className="round pa1 bg-white">
                          <div
                            onClick={() =>
                              this.toggleDialog({
                                type: "profileImage",
                                title: "Image Upload"
                              })
                            }
                            style={{
                              width: "150px",
                              height: "150px",
                              backgroundImage: props.account.user.profile
                                .picture.length
                                ? "url(" +
                                  props.account.user.profile.picture +
                                  ")"
                                : GeoPattern.generate(
                                    props.account.user.profile.name.first +
                                      props.account.user.profile.name.last
                                  ).toDataUrl()
                            }}
                            className="pointer round  cover bg-center"
                          ></div>
                        </div>
                      </Tooltip>
                    </div>

                    <div className="flex flex-column justify-center w-100 ph4-ns ph0">
                      <div className="f4 flex flex-row-ns flex-column items-center-ns items-center w-100 raleway">
                        <span className="f3 fw6 mv0-ns mv4">
                          {props.account.user.profile.name &&
                            props.account.user.profile.name.first}{" "}
                          {props.account.user.profile.name &&
                            props.account.user.profile.name.last}
                        </span>
                        <span className="flex items-start f6 fw6 ml3-ns whi-te ph3 pv2 ba b--black-05 br1 bg-white black -ts-a">
                          {props.account.user.position}{" "}
                        </span>
                        <Icon
                          onClick={this.editProfile}
                          icon={"edit"}
                          iconSize={12}
                          className="pointer black-30 ml2"
                        />
                      </div>

                      <div className="flex flex-row -nsflex-column w--100 black-60 raleway flex-wrap items-center justify-start-ns justify-between ph4 ph0-ns pt3 pb3 bt b--black-05 mt4 mt3-ns">
                        <div className="flex flex-column w--100 pb1-ns pb2 mr3">
                          <span className="flex-column flex f6 fw4 black-40 items-start">
                            <span className="flex mb3">Age</span>
                            <span className="flex items-center justify-center f6 fw6 -ml3-ns black-50- white ph2 pv1 ba b--black-05 br1 -round bw1- bg-white-20- bg-black -ts-a tc ml2-">
                              {moment().diff(
                                props.account.user.profile.dob,
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
                            <span className="ttc flex items-center justify-center f6 fw6 -ml3-ns black-50- white ph2 pv1 ba b--black-05 br1 -round bw1- bg-white-20- bg-black -ts-a tc ml2-">
                              {(props.account.user.profile.gender &&
                                props.account.user.profile.gender) ||
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

                      {/* <div className="flex flex-row -nsflex-column w--100 pt3 black-60 raleway flex-wrap items-center justify-start-ns justify-center">
                        <div className="flex flex-column w--100 pb1-ns pb2 mr3">
                          <span className="flex f6 fw4 black-40 items-center">
                            <span className="flex ">Age</span>

                            <span className="fw6 ml2 pv1 ph2 ba b--black-05 br1">
                              {moment().diff(
                                props.account.user.profile.dob,
                                "years"
                              )}
                            </span>
                          </span>
                        </div>

                        <div className="flex flex-column w--100 pb1-ns pb2 mr3">
                          <span className="flex f6 fw4 black-40 items-center">
                            <span className="flex ">Gender</span>
                            <span className="fw6 ml2 pv1 ph2 ba b--black-05 br1">
                              {(props.account.user.profile.gender &&
                                props.account.user.profile.gender) ||
                                ""}
                            </span>
                          </span>
                        </div>

                        <div className="flex flex-column w--100 pb1-ns pb2 mr3">
                          <span className="flex f6 fw4 black-40 items-center">
                            <span className="flex">Location</span>
                            <span className="fw6 ml2 pv1 ph2 ba b--black-05 br1">
                              {this.userLocation()}
                            </span>
                          </span>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </section>

                {Fn.get("isMobile") && (
                  <section id="ProfileButtons">
                    <div className="flex flex-row mb2-ns w-100 bt b--black-05 ph4 pv4 bg-black-05">
                      <button
                        title="View or upload CV"
                        id="CV-button"
                        className="db relative w-100 pa3 ph4 pv3 br1 bg-black- bg-green round"
                      >
                        <div id="" className="db relative w-100">
                          <span className="f5 fw6 black-60- white ph3-">
                            Cirriculum Vitae{" "}
                          </span>
                        </div>
                      </button>
                    </div>
                    <div className="flex flex-row mb2-ns w-100 bt b--black-05 ">
                      <button
                        title="View or upload CV"
                        id="CV-button"
                        className="db relative w-100 pa3 ph4 pv3 br1- bg-black-30- bg-green-"
                        style={{ background: "#e8e8ec" }}
                      >
                        <div id="" className="db relative w-100">
                          <span className="f6 fw6 black-50 -white ph3-">
                            Add to Network
                          </span>
                        </div>
                      </button>
                      <button
                        title="View or upload CV"
                        id="CV-button"
                        className="db relative w-100 pa3 ph4 pv3 br1- bg-black-30- bg-gree-n bl b--white-20 bw1"
                        style={{ background: "#e8e8ec" }}
                      >
                        <div id="" className="db relative w-100">
                          <span className="f6 fw6 black-50 -white ph3-">
                            Send Message
                          </span>
                        </div>
                      </button>
                    </div>
                  </section>
                )}

                {!Fn.get("isMobile") && (
                  <section id="ProfileButtons">
                    <div className="flex flex-row mb0-ns w-100 bt b--black-05 ph4 ph0-ns pv3">
                      <button
                        title={"View or upload CV"}
                        onClick={this.cv}
                        id="CV-button"
                        className="flex flex-column pa0 mr3 pointer bs-b bg-black-20"
                      >
                        <div
                          id=""
                          className="flex flex-row ph0 pv0 items-center justify-center bg-white br1"
                        >
                          <span className="f6 fw4 black-60 ph3">
                            Cirriculum Vitae
                          </span>

                          <div
                            // style={{ backgroundColor: '#b3bf95' }}
                            className="flex flex-column ph3 pv2 white bg-green"
                          >
                            <Icon
                              icon={"document-open"}
                              iconSize={15}
                              className=""
                            />
                          </div>
                        </div>
                      </button>

                      {/* <div
                        onClick={this.addToNetwork}
                        id="AddToNetwork-button"
                        className="flex flex-column pr3 pointer">

                        <div id="" className="flex flex-row ph0 pv0 items-center justify-center bg-white br1">

                          <span className="f6 fw4 black-60 ph3">Add To Network</span>

                          <div
                            style={{ backgroundColor: '#b3bf95' }}
                            className="flex flex-column ph3 pv2 white">
                            
                            {
                              this.state.AddToNetworkButtonLoading ? 
                              <Spinner size={15} /> : 
                              <Icon icon={'exchange'} iconSize={15} className=""/>
                            }
                          </div>

                        </div>

                      </div> */}

                      {/* <div
                        onClick={this.addToProject}
                        id="AddToProject-button"
                        className="flex flex-column pr3 pointer">

                        <div id="" className="flex flex-row ph0 pv0 items-center justify-center bg-white br1">

                          <span className="f6 fw4 black-60 ph3">Add To Project</span>

                          <div
                            style={{ backgroundColor: '#b3bf95' }}
                            className="flex flex-column ph3 pv2 white">
                           {
                              this.state.AddToProjectButtonLoading ? 
                              <Spinner size={15} /> : 
                              <Icon icon={'new-link'} iconSize={15} className=""/>
                            }
                          </div>

                        </div>

                      </div> */}
                    </div>
                  </section>
                )}

                <section id="Bio" className="mt0-ns">
                  <div className="flex flex-column mb2 pa4 br1 bg-white">
                    <div className="flex flex-row">
                      <div className="flex flex-auto flex-row pb0">
                        <p className="f4 fw4 black-60 mb0 flex flex-row flex-auto">
                          {props.account.user.profile.bio.length === 0 && (
                            <div
                              onClick={this.createBio}
                              className="pointer flex ph3 pv2 f5 fw5 black-60 ba b--black-10 br1"
                            >
                              Enter your bio
                            </div>
                          )}{" "}
                          {props.account.user.profile.bio}{" "}
                          <Icon
                            onClick={this.editBio}
                            icon={"edit"}
                            iconSize={12}
                            className="pointer black-30 ml2"
                          />
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-column pt4">
                      <div className=" pt0">
                        <h3 className="f5 fw3 black-30 mb3 flex justify-start">
                          Skills
                        </h3>
                      </div>

                      <div className="flex flex-auto flex-column pb0 ">
                        <p className="flex flex-row flex-wrap f4 fw4 black-60 mb0">
                          {props.account.user.profile.additional.skills.map(
                            (item, index) => (
                              <span className="   pointer flex f5 fw6 black-60 ph3 pv2 round- br2 bs-b mr2-ns bn w-100-s- items-center tc justify-center mb3 mb0-ns bg-black-20 white ts-a- mr2 ">
                                {item}
                              </span>
                            )
                          )}{" "}
                          {props.account.user.profile.additional.skills
                            .length === 0 && (
                            <div
                              onClick={this.editSkills}
                              className="pointer flex flex-row ph0 pb3 items-center justify-start"
                              id=""
                            >
                              <span className="f6 fw5 black-50 pv2 ph3 ba b--black-05">
                                Add skills
                              </span>
                            </div>
                          )}
                          <Icon
                            onClick={this.editSkills}
                            icon={"edit"}
                            iconSize={12}
                            className="pointer black-30 ml2"
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* <section id="Network" className="mt3">
                  <div className="flex flex-column mb2 pa0 br1 bg-white">
                    <div className="flex flex-row bb b--black-10 justify-between">
                      <div className="flex flex-auto w--100 flex-row pb0">
                        <p className="flex f4 fw6 black-60 mb0 ph3 pv2 items-center justify-center">
                          Network
                        </p>
                        <p className="flex f6 fw4 black-60 mb0 ph3 pv2- items-center justify-center bl b--black-10">
                          {props.account.user.profile.connections.length}{" "}
                          connections
                        </p>
                        <p className="dn flex f6 fw4 black-60 mb0 ph3 pv2- items-center justify-center bl b--black-10">
                          0 pending
                        </p>
                      </div>
                      <div className="dn f-lex -flex-auto- f-lex-row pb0">
                        <div
                          // onClick={this.networkSeeAll}
                          id="NetworkSeeAll-button"
                          className="flex flex-column pointer h-100 bl b--black-10"
                        >
                          <div
                            id=""
                            className="flex flex-row ph0 pv0 items-center justify-center bg-white h-100"
                          >
                            <span className="f6 fw4 black-60 ph3">See All</span>

                            <div
                              style={{ backgroundColor: "#b3bf95" }}
                              className="flex flex-column items-center justify-center ph3 pv2 white h-100"
                            >
                              <Icon icon={"ring"} iconSize={15} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row ">
                      <div className="flex flex-auto flex-column pb0 ">
                        <div className="flex flex-row flex-wrap f4 fw4 black-60 mb0">
                          {this.state.connections.map((item, index) => (
                            // console.log('[[ Connection item ]]', item),
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
                                    onClick={() => this.addToNetwork(item)}
                                    className="pointer flex f6 fw5 black-60 ph3 pv2 hover-black bb b--black-05"
                                  >
                                    Add to network
                                  </div>

                                  <div
                                    onClick={() => this.sendMessage(item)}
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
                                  "  pointer flex flex-column-ns flex-row pa3-ns pa4 items-center justify-start  w-100-s bn-ns bb b--black-05"
                                }
                              >
                                <div
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "100px",
                                    backgroundImage:
                                      "url(" + item.profile.picture + ")"
                                  }}
                                  className="cover bg-center"
                                />
                                <div
                                  className={
                                    "    flex flex-row -flex-column pt2-ns pl3 f5 fw6 black  "
                                  }
                                >
                                  <div className={" flex  "}>
                                    {item.profile.name.first}
                                  </div>
                                  <div className={" flex ml1"}>
                                    {item.profile.name.last}
                                  </div>
                                </div>
                              </Link>
                            </Popover>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section> */}

                {this.state.ready && this.state.connectionsReady && (
                  <>
                    <Network
                      history={this.context.history}
                      canEdit={false}
                      user={this.state.user}
                      isCurrentUser={true}
                      addToNetwork={this.addToNetwork}
                      connections={this.state.connections}
                      navigateToUser={this.navigateToUser}
                      sendMessage={this.sendMessage}
                    />
                  </>
                )}

                <RecentWork
                  type={"user"}
                  user={this.state.user}
                  // projects={this.state.user.profile.projects}
                  // addRecentWorkProject={this.addRecentWorkProject}
                />
                <RecentWorkArchive
                  projects={this.state.user.profile.projects}
                  addRecentWorkProject={this.addRecentWorkProject}
                />

                {/* {
                this.state.subscribedProjectsReady && 
                <ProjectCalendar
                  projects={Fn.get('subscribedProjects')}
                  ownEventss={Fn.get('account').user.profile.events}
                />
              } */}

                {/* {this.state.subscribedProjectsReady && (
            <div className="flex flex-column flex-auto w-100">
              <SectionTitle
                title={"Calendar"}
                // functionButton={{
                //   title: "Add Archive Item",
                //   icon: "ring",
                //   function: () => this.props.addRecentWorkProject()
                // }}
                // labels={[
                //   {
                //     text: "projects",
                //     count: this.props.projects.length
                //   },
                // ]}
              />
              <ProjectCalendar
                // current={1}
                user={this.state.user}
                headerType={'square-slim'}
                // projects={this.state.projects}
                // ownEvents={this.state.user.profile.events}
              />
            </div>
          )} */}

                <Calendar profile={true} />

                <Dialog
                  className={"bp3-light"}
                  // icon="info-sign"
                  onClose={this.toggleDialog}
                  title={this.state.dialogTitle}
                  onValueChange={this.onValueChange}
                  {...this.state}
                >
                  <div className="flex flex-column pa4-">
                    {this.state.dialogType === "bio" && (
                      <FormBio
                        value={props.account.user.profile.bio}
                        submitBio={this.submitBio}
                      />
                    )}
                    {this.state.dialogType === "profile" && (
                      <FormProfile
                        role={props.account.user.position}
                        value={props.account.user.profile}
                        submitProfile={this.submitProfile}
                      />
                    )}
                    {this.state.dialogType === "profileImage" && (
                      <Filepond
                        type={this.state.dialogType}
                        closeDialog={this.closeDialog}
                      />
                    )}
                    {this.state.dialogType === "addToNetwork" && <FormBio />}
                    {this.state.dialogType === "addToProject" && <FormBio />}
                    {this.state.dialogType === "editSkills" && (
                      <FormSkills
                        updateSkills={this.updateSkills}
                        skills={props.account.user.profile.additional.skills}
                      />
                    )}
                    {this.state.dialogType === "addPortfolioProject" && (
                      <FormPortfolioProject
                        closeDialog={this.closeDialog}
                        updateAccount={this.context.updateAccount}
                      />
                    )}
                    {this.state.dialogType === "cv" && (
                      <>
                        {props.account.user.profile.cv.uploaded === true && (
                          <div className="flex flex-row mb3">
                            <a
                              href={props.account.user.profile.cv.file}
                              target="_blank"
                              className="flex flex-row ph3 pv3 tc br1 f5 fw6 white- black-50 bg-green items-center justify-center w-100"
                            >
                              <Icon
                                icon={"document-open"}
                                iconSize={15}
                                className="mr2 white- black-50"
                              ></Icon>
                              View uploaded CV
                            </a>
                          </div>
                        )}
                        <Filepond
                          type={this.state.dialogType}
                          closeDialog={this.closeDialog}
                        />
                      </>
                    )}
                  </div>
                </Dialog>

                {/* {
                  this.state
                  && this.state.locationIsSet
                  && this.state.ready
                  && this.state.drawerReady
                  && (this.state.activeChef
                    && this.state.activeChef.hasOwnProperty('extended'))
                  && (
                    <ChefInfo
                      type={"info"}
                      chef={this.state.activeChef}
                      updateDoc={this.updateDoc}
                      visible={this.state.chefInfoVisible}
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
                    />)} */}
              </section>
              {/* {
                user
                && user.extended
                && user.extended.config
                && user.extended.config.type === "user"
                && this.state.showLocationForm
                && <LocationSearchFormWrapper
                  progressBarActive={this.state.progressBarActive}
                  progressBarPercent={this.state.progressBarPercent}
                  fetchChefs={this.fetchChefs}
                />
              } */}
            </TransitionLayout>
          )
        )}
      </AccountConsumer>
    );
  }
}

export default OwnProfile;
OwnProfile.contextType = AccountContext;
