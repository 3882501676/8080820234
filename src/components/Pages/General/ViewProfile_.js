import React, { getGlobal, setGlobal, useGlobal } from "reactn";
import { Redirect, Link } from "react-router-dom";
import moment, { fn } from 'moment';
import { Popover, Empty, Skeleton, Rate, Tooltip } from "antd";

import TransitionLayout from "../../Layouts/Transition";
// import ListChefs from "../../elements/display/chefs/list";
import PageTitle from "../../elements/layout/PageTitle_B";
// import ChefInfo from "../../elements/display/drawers/ProjectInfo";
import LocationSearchFormWrapper from '../../elements/display/forms/LocationSearchFormWrapper';
import OnboardingScreen from '../../elements/display/onboarding/OnboardingScreen';
import LocationSearchBar from '../../elements/display/forms/LocationSearchBar';
import { Icon, Spinner, Dialog, NumericInput } from '@blueprintjs/core';

import Filepond from '../../elements/upload/Filepond.js';

import FormBio from "../../a/FormBio/index.js";
import FormProfile from '../../a/FormProfile/index.js';
import FormPortfolioProject from '../../a/FormPortfolioProject/index.js';
import FormSkills from '../../a/FormSkills/index.js';

import RecentWork from '../../a/RecentWork/index.js';
import ProjectCalendar from '../../a/ProjectCalendar/index.js';
// import Fn from '../../../utils/fn/Fn';
import Fn from '../../../utils/fn/Fn.js';

import AccountContext, { AccountConsumer } from "../../../utils/context/AccountContext";
import './style.css';
// import { dilate } from "popmotion/lib/calc";
window.getGlobal = getGlobal;
window.useGlobal = useGlobal;
window.setGlobal = setGlobal;

class ViewProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      userid: props.match.params.id,
      isOpen: false,
      dialogType: '',
      dialogTitle: '',
      chefs: [],
      ready: false,
      insertModalVisible: false,
      chefInfoVisible: false,
      loading: false,
      // theme: Fn.get('theme').config.theme,
      toMessages: false,
      conversationReady: false,
      activeTab: "1",
      drawerReady: false,
      locationIsSet: getGlobal().locationIsSet,
      progressBarPercent: 0,
      progressBarActive: false,
      showLocationForm: false,
      showOnboardingScreen: false,
      location: getGlobal().location,
      activeCurrency: getGlobal().activeCurrency,
      account: Fn.get('account'),
      searchCity: '',
      uploadType: 'profileImage',
      connections: [],
      connectionsReady: false,
      AddToNetworkButtonLoading: false,
      AddToProjectButtonLoading: false,
      recentWorkProjects: []
    }

    this.fetchChefs = this.fetchChefs.bind(this);
    this.fetchChefs2 = this.fetchChefs2.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.hideDrawer = this.hideDrawer.bind(this);
    this.refresh = this.refresh.bind(this);
    // this.updateActiveDoc = this.updateActiveDoc.bind(this);
    this.setLocation = this.setLocation.bind(this)
    this.start = this.start.bind(this)
    this.focusLocationSearch = this.focusLocationSearch.bind(this)

    this.reserve = this.reserve.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.submitReservationRequest = this.submitReservationRequest.bind(this)
    // this.setFilter = this.setFilter.bind(this)
    this.toggleDialog = this.toggleDialog.bind(this)

    this.addToNetwork = this.addToNetwork.bind(this)
    this.addToProject = this.addToProject.bind(this)
    this.cv = this.cv.bind(this)
    this.networkSeeAll = this.networkSeeAll.bind(this)
    this.editBio = this.editBio.bind(this)
    this.submitBio = this.submitBio.bind(this)
    this.submitProfile = this.submitProfile.bind(this)
    this.editSkills = this.editSkills.bind(this)
    this.updateSkills = this.updateSkills.bind(this)
    this.editProfile = this.editProfile.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.avatar = this.avatar.bind(this)
    this.fetchConnections = this.fetchConnections.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.userLocation = this.userLocation.bind(this)
    this.addRecentWorkProject = this.addRecentWorkProject.bind(this)
    this.navigateToUser = this.navigateToUser.bind(this)

    console.log('[[ Home props ]]', props)

  }
  navigateToUser(config) {

    const { id } = config

    this.setState({
      ready: false,
      userId: null,
      user: null,
      connections: []
    })

    setTimeout(() => {
      this.props.history.push('/null')
      this.props.history.push('/user/' + id)
    }, 300)

  }
  addRecentWorkProject() {

    this.toggleDialog({ type: 'addPortfolioProject', title: 'Add a Project' })

  }
  userLocation() {
    let user = this.context.account.user;
    let location;
    if (user.profile.location && typeof user.profile.location.County !== "undefined") {
      location = user.profile.location.County
    }
    else if (user.profile.location && typeof user.profile.location.address.county !== "undefined") {
      location = user.profile.location.address.county
    }
    else {
      location = ""
    }
    return location
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
    let connections = this.context.account.user.profile.connections;
    await Fn.fetchConnections({ self: this, connections })
  }
  async submitBio(data) {
    // this.props.submitBio
    console.log(data)
    await Fn.submitBio({ self: this, data: data })
  }
  async updateSkills(skills) {
    await Fn.updateSkills({ self: this, skills })
  }
  async submitProfile(data) {
    // this.props.submitBio
    console.log(data)
    await Fn.submitProfile({ self: this, data: data })
  }

  toggleDialog(config) {

    const { type, title } = config

    this.setState({
      isOpen: !this.state.isOpen,
      dialogType: type,
      dialogTitle: title
    })

    // if(type === "profileImage"){
    //   this.setState({
    //     uploadType: 'profileImage'
    //   })
    // }

  }
  closeDialog() {
    this.setState({
      isOpen: false
    })
  }
  editBio() {
    this.toggleDialog({ type: 'bio', title: 'Edit your bio' })
  }
  editSkills() {
    this.toggleDialog({ type: 'editSkills', title: 'Edit your skills' })
  }
  editProfile() {
    this.toggleDialog({ type: 'profile', title: 'Edit your profile' })
  }
  networkSeeAll() {
    this.toggleDialog({ type: 'bio', title: 'Edit your bio' })
  }

  async addToNetwork() {
    // alert()
    // this.toggleDialog({type: 'addToNetwork', title: 'Edit your bio'})
    this.setState({
      AddToNetworkButtonLoading: true
    })

    let item = this.state.user;

    await Fn.addToNetwork({ self: this, item: item })

  }

  addToProject() {
    // this.toggleDialog({type: 'addToProject', title: 'Edit your bio'})
  }
  cv() {
    this.toggleDialog({ type: 'cv', title: 'Upload your CV' })
  }
  focusLocationSearch() {

  }
  reserve(doc) {
    console.log(doc)
    this.setState({ activeDoc: doc })
    setGlobal({ "reserve": true, recipient: doc })
  }
  async sendMessage(data) {

    console.log('doc', data)

    let selfUserId = this.context.account.user.id;

    let recipientId = data.id;

    // let participants = [selfUserId, recipientId];

    const conversationExists = await Fn.checkConversationExists({ self: this, selfUserId, recipientId: data.id })

    if (!conversationExists.exists) {

      // console.log('participants',participants)

      await Fn.createNewConversation({ self: this, selfUserId, recipientId })
      this.props.history.push('/messages')
    }
    else {
      // Fn.getConversationData({})
      Fn.store({ label: 'activeConversation', value: conversationExists.conversation })
      this.props.history.push('/messages')
    }

    // return await Fn.sendMessage({ doc, self: this })

  }
  async fetchChefs2(city) {
    this.setState({ ready: false, searchCity: city })
    setTimeout(() => {
      console.log('[[ fetchChefs2 city ]]', city)
      return Fn.fetchChefs2({ city, self: this })
    }, 1000)

  }
  async fetchChefs(city) {
    this.setState({ ready: false, searchCity: city })
    return await Fn.fetchChefs({ city, self: this })
  }
  async refresh() {
    return await Fn.refresh({ self: this })
  }
  async showDrawer(chef) {
    return await Fn.showDrawer({ chef, self: this })
  }
  async hideDrawer() {
    return await Fn.hideDrawer({ self: this })
  }
  showModal = () => {
    this.setState({
      insertModalVisible: true
    });
  }
  handleOk = e => {
    console.log(e);
    this.setState({
      insertModalVisible: false
    });
  }
  handleCancel = e => {
    console.log(e);
    this.setState({
      insertModalVisible: false
    });
  }
  async submitReservationRequest(data) {
    return await Fn.submitReservationRequest({ data, self: this })
  }
  async setLocation() {
    return await Fn.setLocation({ self: this })
  }

  async start() {
    // find location by browser geolocation, 
    // then query Here maps api for location data using reverse geolocation.
    return await Fn.setLocation({ self: this })
  }
  avatar(user) {
    console.log('avatar ', user)
    // const user = data.u

    if (user && user.profile && user.profile.picture.length > 0) {
      return user.profile.picture
    }
    else {
      return '/img/placeholder.png';
    }
  }
  componentWillUnmount() {
  }
  componentDidUpdate() {
    console.log('[[ Home Updated ]]', this.props)
  }
  async componentDidMount() {
    // this.start()
    let userId = this.props.match.params.id
    await Fn.fetchUser({ self: this, userId })

    document.querySelector("body").scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    })

    // this.fetchConnections()

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

          <TransitionLayout>
            {/* {console.log('[[[[[ user', user),
                user
                && user.extended
                && user.extended.config
                && user.extended.config.onboardingcomplete === false
                && <OnboardingScreen location={this.state.location} />
              } */}
            <section id="Home" className="w-100 mw9 center pa4 pb6">
              <div onClick={this.refresh} className="absolute top-0 right-0 pa4 pointer black-30">
                <Icon type="sync" className={(this.state.ready ? " inactive " : " active ") + (" loading-icon ")} />
              </div>

              <section className="flex flex-column w-100 pb4 pt2">
                <div className="flex flex-row w-100">
                  <span onClick={() => { this.props.history.goBack() }}
                    class="flex items-start f6 fw6 ml3 black-50 ph3 pv2 ba pointer b--black-05 br1 -round bw1- bg-white-20- -ts-a"><Icon icon={'arrow-left'} iconSize={15} className=" mr3" />Go Back</span>
                </div>
              </section>

              {this.state.ready &&
                <>
                  <section id="Profile" className="flex flex-column w-100 pb5 pt5">
                    <div className="flex flex-row w-100">

                      <div className="flex flex-column w-100=">
                        <Tooltip placement="top" title={'Update your avatar'}>
                          <div className="round pa1 bg-white">
                            <div
                              onClick={() => this.toggleDialog({ type: 'profileImage', title: "Image Upload" })}
                              style={{ width: '150px', height: '150px', backgroundImage: 'url(' + this.avatar(this.state.user) + ')' }}
                              className="pointer round  cover bg-center"></div>
                          </div>
                        </Tooltip>

                      </div>

                      <div className="flex flex-column justify-center w-100 ph4">

                        <div className="f4 flex flex-row items-center w-100 raleway">
                          <span className="f3 fw6">{this.state.user.profile.name.first} {this.state.user.profile.name.last}</span>
                          <span className="flex items-start f6 fw6 ml3 black-50 ph3 pv2 ba b--black-05 br1 -round bw1- bg-white-20- -ts-a">{this.state.user.position} </span> <Icon onClick={this.editProfile} icon={'edit'} iconSize={12} className="pointer black-30 ml2" />
                        </div>

                        <div className="flex flex-row w--100 pt3 black-60 raleway">

                          <div className="flex flex-column w--100 pb1 mr3">
                            <span className="flex f6 fw4 black-40 items-center">
                              <span className="flex ">Age</span>
                              <span className="fw6 ml2 pv1 ph2 ba b--black-05 br1">{moment().diff(this.state.user.profile.dob, 'years')}</span>
                            </span>
                          </div>

                          <div className="flex flex-column w--100 pb1 mr3">
                            <span className="flex f6 fw4 black-40 items-center">
                              <span className="flex ">Gender</span>
                              <span className="fw6 ml2 pv1 ph2 ba b--black-05 br1">{this.state.user.profile.gender && this.state.user.profile.gender || ""}</span>
                            </span>
                          </div>

                          <div className="flex flex-column w--100 pb1 mr3">
                            <span className="flex f6 fw4 black-40 items-center">
                              <span className="flex">Location</span>
                              <span className="fw6 ml2 pv1 ph2 ba b--black-05 br1">{this.userLocation()}</span>
                            </span>
                          </div>

                        </div>

                      </div>

                    </div>
                  </section>

                  <section id="ProfileButtons" className="flex flex-row">

                    <div className="flex flex-row mb2">

                      <button
                        title={'View or upload CV'}
                        onClick={this.cv}
                        id="CV-button"
                        className="flex flex-column pa0 mr3 pointer">

                        <div id="" className="flex flex-row ph0 pv0 items-center justify-center bg-white br1">

                          <span className="f6 fw4 black-60 ph3">Cirriculum Vitae</span>

                          <div className="flex flex-column ph3 pv2 white bg-green">
                            <Icon icon={'document-open'} iconSize={15} className="" />
                          </div>

                        </div>

                      </button>

                    </div>

                  </section>

                  <section id="Bio" className="mt3">
                    <div className="flex flex-column mb2 pa4 br1 bg-white">
                      <div className="flex flex-row">

                        <div className="flex flex-auto flex-row pb0">
                          <p className="f4 fw4 black-60 mb0 flex flex-row flex-auto">
                            {this.state.user.profile.bio.length === 0 && <div onClick={this.createBio} className="pointer flex ph3 pv2 f5 fw5 black-60 ba b--black-10 br1">Enter your bio</div>} {this.state.user.profile.bio} <Icon onClick={this.editBio} icon={'edit'} iconSize={12} className="pointer black-30 ml2" /></p>

                        </div>
                      </div>
                      <div className="flex flex-column pt4">
                        <div className=" pt0">
                          <h3 className="f5 fw3 black-30 mb3 flex justify-start">Skills</h3>
                        </div>

                        <div className="flex flex-auto flex-column pb0 ">
                          <p className="flex flex-row flex-wrap f4 fw4 black-60 mb0">{this.state.user.profile.additional.skills.map((item, index) => (
                            <span className={(" pointer flex f6 fw6 black-60 ph3 pv2 br1 bs-d mr2 ")}>{item}</span>
                          ))} <Icon onClick={this.editSkills} icon={'edit'} iconSize={12} className="pointer black-30 ml2" /></p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section id="Network" className="mt3">
                    <div className="flex flex-column mb2 pa0 br1 bg-white">

                      <div className="flex flex-row bb b--black-10 justify-between">
                        <div className="flex flex-auto w--100 flex-row pb0">
                          <p className="flex f4 fw6 black-60 mb0 ph3 pv2 items-center justify-center">Network</p>
                          <p className="flex f6 fw4 black-60 mb0 ph3 pv2- items-center justify-center bl b--black-10">{this.state.user.profile.connections.length} connections</p>
                          <p className="flex f6 fw4 black-60 mb0 ph3 pv2- items-center justify-center bl b--black-10">0 pending</p>
                        </div>
                        <div className="flex flex-auto- flex-row pb0">
                          <div
                            // onClick={this.networkSeeAll}
                            id="NetworkSeeAll-button"
                            className="flex flex-column pointer h-100 bl b--black-10">

                            <div id="" className="flex flex-row ph0 pv0 items-center justify-center bg-white h-100">

                              <span className="f6 fw4 black-60 ph3">See All</span>

                              <div
                                style={{ backgroundColor: '#b3bf95' }}
                                className="flex flex-column items-center justify-center ph3 pv2 white h-100">
                                <Icon icon={'ring'} iconSize={15} />
                              </div>

                            </div>

                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row ">

                        <div className="flex flex-auto flex-column pb0 ">

                          <div className="flex flex-row flex-wrap f4 fw4 black-60 mb0">{this.state.connections.map((item, index) => (
                            console.log('[[ Connection item ]]', item),
                            <Popover content={<div className="flex flex-column">

                              <div
                                onClick={() => this.navigateToUser({ id: item.id })}
                                className="pointer flex f6 fw5 black-60 ph3 pv2 hover-black bb b--black-05">View Profile
                                                            </div>

                              <div
                                onClick={() => this.addToNetwork(item)}
                                className="pointer flex f6 fw5 black-60 ph3 pv2 hover-black bb b--black-05">Add to network</div>

                              <div
                                onClick={() => this.sendMessage(item)}
                                className="pointer flex f6 fw5 black-60 ph3 pv2 hover-black">Send Message</div>

                            </div>} trigger="hover">
                              <Link
                                to={'/user/' + item.id}
                                className={" pointer flex flex-column pa3 items-center justify-center"}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '100px', backgroundImage: "url(" + item.profile.picture + ")" }} className="cover bg-center" />
                                <div className={" flex flex-row pt2 "}>
                                  <div className={" flex f6 fw6 "}>
                                    {item.profile.name.first}
                                  </div>
                                  <div className={" flex f6 fw6 ml2"}>
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
                  </section>

                  <RecentWork
                    projects={this.state.user.profile.projects}
                    addRecentWorkProject={this.addRecentWorkProject}
                  />

                  <ProjectCalendar
                    projects={this.state.user.profile.projects}
                  />

                  <Dialog
                    className={'bp3-light'}
                    // icon="info-sign"
                    onClose={this.toggleDialog}
                    title={this.state.dialogTitle}
                    onValueChange={this.onValueChange}
                    {...this.state}
                  >

                    <div className="flex flex-column pa4-">
                      {
                        this.state.dialogType === "bio" && <FormBio value={this.state.user.profile.bio} submitBio={this.submitBio} />
                      }
                      {
                        this.state.dialogType === "profile" && <FormProfile value={this.state.user.profile} submitProfile={this.submitProfile} />
                      }
                      {
                        this.state.dialogType === "profileImage" && <Filepond type={this.state.dialogType} closeDialog={this.closeDialog} />
                      }
                      {
                        this.state.dialogType === "addToNetwork" && <FormBio />
                      }
                      {
                        this.state.dialogType === "addToProject" && <FormBio />
                      }
                      {
                        this.state.dialogType === "editSkills" &&
                        <FormSkills
                          updateSkills={this.updateSkills}
                          skills={this.state.user.profile.additional.skills}
                        />
                      }
                      {
                        this.state.dialogType === "addPortfolioProject" &&
                        <FormPortfolioProject
                          closeDialog={this.closeDialog}
                          updateAccount={this.context.updateAccount} />
                      }
                      {
                        this.state.dialogType === "cv" && <>
                          {
                            this.state.user.profile.cv.uploaded === true &&

                            <div className="flex flex-row mb3">
                              <a
                                href={this.state.user.profile.cv.file}
                                target="_blank"
                                className="flex flex-row ph3 pv3 tc br1 f5 fw6 white- black-50 bg-green items-center justify-center w-100">
                                <Icon icon={'document-open'} iconSize={15} className="mr2 white- black-50"></Icon>
                                View uploaded CV
                                </a>
                            </div>
                          }
                          <Filepond type={this.state.dialogType} closeDialog={this.closeDialog} /></>
                      }
                    </div>

                  </Dialog>

                </>}

            </section>

          </TransitionLayout>

        )}

      </AccountConsumer>
    )
  }
}

export default ViewProfile;
ViewProfile.contextType = AccountContext