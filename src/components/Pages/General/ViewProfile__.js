import React, { getGlobal, setGlobal, useGlobal } from "reactn";
import { Redirect, Link } from "react-router-dom";
import moment, { fn } from 'moment';
import { Popover, message, Empty, Skeleton, Rate, Tooltip } from "antd";

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
import OwnProjectList from '../../a/OwnProjectList/index.js';
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
      activeChef: getGlobal().activeChef,
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
      AddToProjectButtonLoading: false
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
    this.editProfile = this.editProfile.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.avatar = this.avatar.bind(this)
    this.fetchConnections = this.fetchConnections.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.fetchUser = this.fetchUser.bind(this)
    this.refresh = this.refresh.bind(this)
    this.addToChat = this.addToChat.bind(this)
    this.navigateToUser = this.navigateToUser.bind(this)
    this.isNotInNetwork = this.isNotInNetwork.bind(this)
    this.cvExists = this.cvExists.bind(this)
    this.cvButtonTitle = this.cvButtonTitle.bind(this)
    this.cvButtonStatus = this.cvButtonStatus.bind(this)

    console.log('[[ View Profile props ]]', props, this.state)

  }
  cvButtonTitle() {
    if(!this.context.isAuthenticated){
      return 'Login to view user CV'
    }
    if(this.cvExists()) {
      return 'View CV'
    }
    else {
      return 'CV not available'
    }
  }
  cvButtonStatus() {
    let profile = this.state.user.profile;
    console.log('User CV', profile)
  
    if(!this.context.isAuthenticated) {
        return true
    }
    if(typeof profile.cv !== "undefined" && profile.cv.length > 0) {
      return false
    }
    else {
      return true
    }
  }
  cvExists() {
    // alert(profile.cv)
    let profile = this.state.user.profile;
    console.log('User CV', profile)
    if(typeof profile.cv !== "undefined" && profile.cv.length > 0) {
      return true
    }
    else {
      return false
    }
  }
  addToChat() {
    this.context.isAuthenticated && message.success('Chat function coming soon')
    !this.context.isAuthenticated && message.warning('Please login to use network functions.')
  }
  isNotInNetwork(connections) {

    let connectionId = this.state.user.id;
    return connections.includes(connectionId)

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
  fetchUser() {
    // this.setState({
    //   // ready: false,
    //   userId: null,
    //   user: null,
    //   connections: []
    // })

    let userid = this.state.userid;
    Fn.fetchUser({ self: this, userid })
  }
  async sendMessage(item) {
    console.log(' ', '[[ SendMessage ]]', item, ' ')
  }
  async fetchConnections() {

    let connections = this.state.user.profile.connections;

    alert(connections)

    await Fn.fetchConnections({ self: this, connections })

  }
  async submitBio(data) {
    // this.props.submitBio
    console.log(data)
    await Fn.submitBio({ self: this, data: data })
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
    this.toggleDialog({ type: 'skills', title: 'Edit your skills' })
  }
  editProfile() {
    this.toggleDialog({ type: 'profile', title: 'Edit your profile' })
  }
  networkSeeAll() {
    // this.toggleDialog({ type: 'bio', title: 'Edit your bio' })
    this.context.isAuthenticated && message.warning('Coming soon.')
    !this.context.isAuthenticated && message.warning('Please login to use network functions.')
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

  async addToProject() {
    // this.toggleDialog({type: 'addToProject', title: 'Edit your bio'})

    this.setState({
      AddToProjectButtonLoading: true
    })

    setTimeout(() => {
      this.setState({
        AddToProjectButtonLoading: false
      })
    }, 1000)

    this.toggleDialog({
      type: "addToProject",
      title: "Add To Project"
    })
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
  async sendMessage(doc) {
    return await Fn.sendMessage({ doc, self: this })
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
    // const user = data.user

    if (user && user.profile && user.profile.picture.length > 0) {
      return user.profile.picture
    }
    else {
      return '/img/placeholder.png';
    }
  }
  componentWillUnmount() {
  }
  componentWillUpdate() {
    // // alert()
    // if(this.state.ready){
    //   this.setState({ ready: false })
    // }

    // this.refresh()

  }
  refresh() {
    let userid = this.props.match.params.id
    Fn.fetchUser({ self: this, userid })
  }
  async componentWillReceiveProps() {
    // console.log('[[ View Profile Updated ]]', this.props)
    let userid = this.props.match.params.id

    Fn.fetchUser({ self: this, userid })

  }
  async componentDidMount() {
    // this.start()
    // this.fetchUser()
    let userId = this.props.match.params.id
    await Fn.fetchUser({ self: this, userId })

    // setTimeout(() => {
    //   if(this.state.user.id !== this.props.match.params.id) {
    //     alert()
    //     this.refresh()
    //   }
    // },500)

    this.fetchConnections()
  }
  render() {

    const skills = ["photography", "videography", "video editing"]

    return (

      this.state.ready &&
      <AccountConsumer>
        {props => (
          console.log('[[ OwnProfile <AccountContext.Consumer> ]]', props),

          <TransitionLayout>

            <section id="Home" className="w-100 mw8 center pa4 pb6">
              <div onClick={this.refresh} className="absolute top-0 right-0 pa4 pointer black-30">
                <Icon type="sync" className={(this.state.ready ? " inactive " : " active ") + (" loading-icon ")} />
              </div>

              <section id="Profile" className="flex flex-column w-100 pb5 pt5">
                <div className="flex flex-row w-100">

                  <div className="flex flex-column w-100=">

                    <div className="round pa1 bg-white">
                    <div

                      style={{ backgroundImage: 'url(' + this.avatar(this.state.user) + ')' }}
                      className="pointer avatar-m round  cover bg-center"></div>

</div>
                  </div>

                  <div className="flex flex-column justify-center w-100 ph4">

                    <div className="f4 flex flex-row w-100">
                      <span className="fw6">{this.state.user.profile.name && this.state.user.profile.name.first} {this.state.user.profile.name && this.state.user.profile.name.last}</span>
                      <span className="flex items-start fw3 ml2">| {this.state.user.position}</span>
                    </div>

                    <div className="flex flex-column w-100 pt3 black-60">

                      <div className="flex flex-column w-100">
                        <span className="f6 fw1">Age: <span className="fw6">{moment().diff(this.state.user.profile.dob, 'years')}</span></span>
                      </div>

                      <div className="flex flex-column w-100">
                        <span className="f6 fw1">Gender: <span className="fw6">{this.state.user.profile.gender && this.state.user.profile.gender || ""}</span></span>
                      </div>

                      <div className="flex flex-column w-100">
                        <span className="f6 fw1">Location: <span className="fw6">{this.state.user.profile.location && this.state.user.profile.location.County || ""}</span></span>
                      </div>

                    </div>

                  </div>

                </div>
              </section>

              <section id="ProfileButtons">

                <div className="flex flex-row mb2">

                  <button
                    title={this.cvButtonTitle()}
                    disabled={this.cvButtonStatus()}
                    onClick={this.cv}
                    id="CV-button"
                    className="flex flex-column pointer pa0 mr3">

                    <div id="" className="flex flex-row ph0 pv0 items-center justify-center bg-white br1">

                      <span className="f6 fw4 black-60 ph3">Cirriculum Vitae</span>

                      <div
                        style={{ backgroundColor: '#b3bf95' }}
                        className="flex flex-column ph3 pv2 white">
                        <Icon icon={'document-open'} iconSize={15} className="" />
                      </div>

                    </div>

                  </button>

                  {
                    this.props.match.params.id !== props.account.user.id && !this.isNotInNetwork(props.account.user.profile.connections) &&
                    <button
                      title={!props.isAuthenticated && "Login to use network functions"}
                      disabled={!props.isAuthenticated}
                      onClick={this.addToNetwork}
                      id="AddToNetwork-button"
                      className="flex flex-column pointer mr3 pa0">

                      <div id="" className="flex flex-row ph0 pv0 items-center justify-center bg-white br1">

                        <span className="f6 fw4 black-60 ph3">Add To Network</span>

                        <div
                          style={{ backgroundColor: '#b3bf95' }}
                          className="flex flex-column ph3 pv2 white">

                          {
                            this.state.AddToNetworkButtonLoading ?
                              <Spinner size={15} /> :
                              <Icon icon={'exchange'} iconSize={15} className="" />
                          }
                        </div>

                      </div>

                    </button>
                  }

                  <button
                    title={!props.isAuthenticated && "Login to use network functions"}
                    disabled={!props.isAuthenticated}
                    onClick={this.addToProject}
                    id="AddToProject-button"
                    className="flex flex-column pointer pa0 mr3">

                    <div id="" className="flex flex-row ph0 pv0 items-center justify-center bg-white br1">

                      <span className="f6 fw4 black-60 ph3">Add To Project</span>

                      <div
                        style={{ backgroundColor: '#b3bf95' }}
                        className="flex flex-column ph3 pv2 white">
                        {
                          this.state.AddToProjectButtonLoading ?
                            <Spinner size={15} /> :
                            <Icon icon={'new-link'} iconSize={15} className="" />
                        }
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
                        {this.state.user.profile.bio.length === 0 && <div onClick={this.createBio} className="pointer flex ph3 pv2 f5 fw5 black-60 ba b--black-10 br1">Enter your bio</div>} {this.state.user.profile.bio} </p>
                    </div>
                  </div>
                  <div className="flex flex-column pt4">
                    <div className=" flex pt0">
                      <h3 className="f6 fw3 black-30 mb3 flex justify-center">Skills</h3>
                    </div>

                    <div className="flex flex-auto flex-column pb0">
                      <p className="flex flex-row flex-wrap f4 fw4 black-60 mb0">{skills.map((item, index) => (
                        <span className={(" pointer flex f7 fw6 black-60 ph2 pv1 br1 bs-d mr2 ")}> {item}</span>
                      ))} </p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="Network" className="mt3">
                <div className="flex flex-column mb2 pa0 br1 bg-white">

                  <div className="flex flex-row bb b--black-10 justify-between">
                    <div className="flex flex-auto w--100 flex-row pb0">
                      <p className="flex f4 fw6 black-60 mb0 ph3 pv2 items-center justify-center">Network</p>
                      <p className="flex f6 fw4 black-60 mb0 ph3 pv2- items-center justify-center bl b--black-10">{this.state.ready && this.state.connections.length} connections</p>

                    </div>
                    <div className="flex flex-auto- flex-row pb0">
                      <div
                        onClick={this.networkSeeAll}
                        id="NetworkSeeAll-button"
                        className="flex flex-column pointer h-100 bl b--black-10">

                        <div id="" className="flex flex-row ph0 pv0 items-center justify-center bg-white h-100">

                          <span className="f6 fw4 black-60 ph3">See All</span>

                          <div
                            style={{ backgroundColor: '#b3bf95' }}
                            className="flex flex-column ph3 pv2 white h-100">
                            +
                          </div>

                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row ">

                    <div className="flex flex-auto flex-column pb0 ">

                      <div className="flex flex-row flex-wrap f4 fw4 black-60 mb0">{this.state.connectionsReady && this.state.connections.map((item, index) => (
                        console.log('[[ Connection item ]]', item),
                        <Popover content={<div
                          onClick={() => this.addToChat(item)}
                          className="pointer flex f6 fw5 black-60 ph2 pv2 hover-black">Send Message</div>} trigger="hover">
                          <div onClick={() => this.navigateToUser({ id: item.id })} className={" pointer flex flex-column pa3 items-center justify-center"}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '100px', backgroundImage: "url(" + item.profile.picture + ")" }} className="cover bg-center" />
                            <div className={" flex flex-row pt2 "}>
                              <div className={" flex f6 fw6 "}>
                                {item.profile.name.first}
                              </div>
                              <div className={" flex f6 fw6 ml2"}>
                                {item.profile.name.last}
                              </div>
                            </div>
                          </div>
                        </Popover>
                      ))}
                      </div>

                    </div>

                  </div>
                </div>
              </section>

              <Dialog
                className={'bp3-light'}
                // icon="info-sign"
                onClose={this.toggleDialog}
                title={this.state.dialogTitle}
                onValueChange={this.onValueChange}
                {...this.state}
              >

                <div className="flex flex-column pa3">
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
                    this.state.dialogType === "addToProject" && <OwnProjectList closeDialog={this.closeDialog} userId={this.props.match.params.id} />
                  }
                  {
                    this.state.dialogType === "cv" && <>
                      <div className="flex flex-row mb3">
                        <a
                          href={this.state.user.profile.cv}
                          target="_blank"
                          className="flex flex-row ph3 pv2 br1 f5 fw6 white bg-green items-center">
                          <Icon icon={'document-open'} iconSize={15} className="mr2 white"></Icon>
                          View uploaded CV
                                </a>
                      </div>
                      <Filepond type={this.state.dialogType} closeDialog={this.closeDialog} /></>
                  }
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

        )}

      </AccountConsumer>

    )

  }
}

export default ViewProfile;
ViewProfile.contextType = AccountContext.Consumer