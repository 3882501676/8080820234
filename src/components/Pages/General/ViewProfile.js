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

import Loading from "../../elements/Loading.js";
import RecentWork from "../../a/RecentWork/index.js";
import RecentWorkArchive from "../../a/RecentWorkArchive/index.js";
import ProjectCalendar from "../../a/ProjectCalendar/index.js";
import ProjectCalendar2 from "../../a/ProjectCalendar2/index.js";
// import Bio from '../../a/_Elements/Bio/Bio.jsx';
// import Network from '../../a/_Elements/Network/Network.jsx';
import { Bio, Network } from "../../a/_Elements";
// import Fn from '../../../utils/fn/Fn';
import { Fn, api, ui, app } from "../../../utils/fn/Fn.js";
import SectionTitle from "../../a/_Elements/SectionTitle/SectionTitle.jsx";

import AccountContext, {
  AccountConsumer
} from "../../../utils/context/AccountContext";
import "./style.css";
// import { dilate } from "popmotion/lib/calc";
// window.getGlobal = getGlobal;
// window.useGlobal = useGlobal;
// window.setGlobal = setGlobal;

class ViewProfile extends React.Component {
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
      // account: Fn.get("account"),
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

    // this.reserve = this.reserve.bind(this);
    // this.sendMessage = this.sendMessage.bind(this);
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

    console.log("[[ ViewProfile.js props ]]", props);
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
    let user = this.state.user;
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
    // this.state.user.profile.location && this.state.user.profile.location.address.county || ""
  }
  // async sendMessage(item) {

  //   console.log('[[ SendMessage ]]', item)

  //   let selfUserId = this.context.account.user.id;

  //   // let recipientId =
  //   // const conversationExists = await Fn.checkConversationExists({ self: this,  })
  //   // await Fn.
  // }
  async fetchConnections() {
    let connections = this.state.user.profile.connections;
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
  // reserve(doc) {
  //   console.log(doc);
  //   this.setState({ activeDoc: doc });
  //   // setGlobal({ reserve: true, recipient: doc });
  // }
  // async sendMessage(data) {
  //   console.log("doc", data);

  //   let selfUserId = this.context.account.user.id;

  //   let recipientId = data.id;

  //   // let participants = [selfUserId, recipientId];

  //   const conversationExists = await Fn.checkConversationExists({
  //     self: this,
  //     selfUserId,
  //     recipientId: data.id
  //   });

  //   if (!conversationExists.exists) {
  //     // console.log('participants',participants)

  //     await Fn.createNewConversation({ self: this, selfUserId, recipientId });
  //     this.props.history.push("/messages");
  //   } else {
  //     // Fn.getConversationData({})
  //     Fn.store({
  //       label: "activeConversation",
  //       value: conversationExists.conversation
  //     });
  //     this.props.history.push("/messages");
  //   }

  //   // return await Fn.sendMessage({ doc, self: this })
  // }
  // async fetchChefs2(city) {
  //   this.setState({ ready: false, searchCity: city });
  //   setTimeout(() => {
  //     console.log("[[ fetchChefs2 city ]]", city);
  //     return Fn.fetchChefs2({ city, self: this });
  //   }, 1000);
  // }
  // async fetchChefs(city) {
  //   this.setState({ ready: false, searchCity: city });
  //   return await Fn.fetchChefs({ city, self: this });
  // }
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
    // return await Fn.setLocation({ self: this });
  }
  avatar(data) {
    console.log("avatar ", data);
    const user = data;

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
  async componentDidMount() {
    console.log(" ");
    console.log(" ");
    console.log("[[ ViewProfile.js Mounted ]]");
    console.log(" ");
    console.log(" ");

    console.log("viewprofile props", this.props);
    let userId = this.props.match.params.id;

    let projects = await app
      .fetchSubscribedProjects({ self: this, userId })
      .then(async projects => {
        this.setState({
          projects: projects,
          subscribedProjectsReady: true
        });
      });


    let user = await api.fetch("users", userId).then(async user => {
      this.setState({ user: user });
      await Fn.fetchConnections({
        self: this,
        connections: user.profile.connections
      });
      // Fn
      Fn.set("activeUser", user);

      console.log("user", user);

      this.setState({
        user: user,
        ready: true
      });

      document.querySelector("body").scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    });
    //

    // if (user) {

    // }
  }

  // if (localStorage.getItem("crewBuilder") !== null) {
  //   if (!Fn.get("crewBuilder").hasBeenUploaded) {
  //     let project = Fn.get("crewBuilder");
  //     await Fn.createProject({ self: this, project });
  //   }
  // }

  // if(localStorage.getItem('accountType') !== null && JSON.parse(localStorage.getItem('accountType')) === "production") {
  //   if(!Fn.get('crewBuilder').hasBeenUploaded) {
  //     let project = Fn.get('crewBuilder');
  //     await Fn.createProject({ self: this, project })
  //   }
  // }

  render() {
    return !this.state.ready ? (
      <Loading />
    ) : (
      <TransitionLayout>
        <section
          id="ViewProfile"
          className={" w-100 mw9 center pa4-ns pa0 pb6 h-100 overflow-auto"}
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

          <section id="Profile" className="flex flex-column w-100 pb5 pt5">
            <div className="flex flex-row-ns flex-column w-100 justify-center items-center">
              <div className="flex flex-column w-100=">
                <Tooltip placement="top" title={"Update your avatar"}>
                  <div className="round pa1 bg-white">
                    <div
                      style={{
                        width: "150px",
                        height: "150px",
                        backgroundImage:
                          "url(" + this.avatar(this.state.user) + ")"
                      }}
                      className="pointer round  cover bg-center"
                    ></div>
                  </div>
                </Tooltip>
              </div>

              <div className="flex flex-column justify-center w-100 ph4-ns ph0">
                <div className="f4 flex flex-row-ns flex-column items-center-ns items-center w-100 raleway">
                  <span className="f3 fw6 mv0-ns mv4">
                    {this.state.user.profile.name &&
                      this.state.user.profile.name.first}{" "}
                    {this.state.user.profile.name &&
                      this.state.user.profile.name.last}
                  </span>
                  <span className="flex items-start f6 fw6 ml3-ns whi-te ph3 pv2 ba b--black-05 br1 bg-white black -ts-a">
                    {this.state.user.position}{" "}
                  </span>
                </div>

                <div className="flex flex-row -nsflex-column w--100 black-60 raleway flex-wrap items-center justify-start-ns justify-between ph4 ph0-ns pt3 pb3 bt b--black-05 mt4 mt3-ns">
                  <div className="flex flex-column w--100 pb1-ns pb2 mr3">
                    <span className="flex-column flex f6 fw4 black-40 items-start">
                      <span
                        className="flex 
 mb3"
                      >
                        Age
                      </span>
                      <span className="flex items-center justify-center f6 fw6 -ml3-ns black-50- white ph2 pv1 ba b--black-05 br1 -round bw1- bg-white-20- bg-black -ts-a tc ml2-">
                        {moment().diff(this.state.user.profile.dob, "years")}
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
                        {(this.state.user.profile.gender &&
                          this.state.user.profile.gender) ||
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
                                this.state.user.profile.dob,
                                "years"
                              )}
                            </span>
                          </span>
                        </div>

                        <div className="flex flex-column w--100 pb1-ns pb2 mr3">
                          <span className="flex f6 fw4 black-40 items-center">
                            <span className="flex ">Gender</span>
                            <span className="fw6 ml2 pv1 ph2 ba b--black-05 br1">
                              {(this.state.user.profile.gender &&
                                this.state.user.profile.gender) ||
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

          {ui.mobile() && (
            <section id="ProfileButtons">
              <div className="flex flex-row mb2-ns w-100 bt b--black-05 ph4 pv4 bg-black-05">
                <a
                  href={this.state.user.profile.cv.file}
                  target="_blank"
                  title="View or upload CV"
                  id="CV-button"
                  className="db relative w-100 pa3 ph4 pv3 br1 bg-black- bg-green round"
                >
                  <div id="" className="db relative w-100">
                    <span className="f5 fw6 black-60- white ph3-">
                      Cirriculum Vitae{" "}
                    </span>
                  </div>
                </a>
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

          {!ui.mobile() && (
            <section id="ProfileButtons">
              <div className="flex flex-row mb0-ns w-100 bt b--black-05 ph4 ph0-ns pv3">
                <a 
                target="_blank"
                href={this.state.user.profile.cv.file}
                  title={"View or upload CV"}
                  // onClick={this.cv}
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
                      <Icon icon={"document-open"} iconSize={15} className="" />
                    </div>
                  </div>
                </a>

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
          {this.state.ready && (
            <Bio
              user={this.state.user}
              editSkills={null}
              editBio={null}
              canEdit={false}
            />
          )}
          {this.state.ready && this.state.connectionsReady && (
            <>
              <Network
              history={this.context.history}
              isCurrentUser={false}
                canEdit={false}
                user={this.state.user}
                addToNetwork={this.addToNetwork}
                connections={this.state.connections}
                navigateToUser={this.navigateToUser}
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
            <ProjectCalendar2
              projects={Fn.get("subscribedProjects")}
              ownEvents={Fn.get("account").user.profile.events}
            />
          )} */}

          {this.state.subscribedProjectsReady && (
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
          )}

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
                  value={this.state.user.profile.bio}
                  submitBio={this.submitBio}
                />
              )}
              {this.state.dialogType === "profile" && (
                <FormProfile
                  value={this.state.user.profile}
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
                  skills={this.state.user.profile.additional.skills}
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
                  {this.state.user.profile.cv.uploaded === true && (
                    <div className="flex flex-row mb3">
                      <a
                        href={this.state.user.profile.cv.file}
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
        </section>
      </TransitionLayout>
    );
  }
}

export default ViewProfile;
ViewProfile.contextType = AccountContext.Consumer;
