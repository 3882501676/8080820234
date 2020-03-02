import React, { getGlobal, setGlobal, useGlobal } from "reactn";
import { Redirect } from "react-router-dom";
import moment, { fn } from 'moment';
import { Popover, Empty, Skeleton, Rate } from "antd";

import TransitionLayout from "../../Layouts/Transition";
import ListChefs from "../../elements/display/chefs/list";
import PageTitle from "../../elements/layout/PageTitle_B";
import ChefInfo from "../../elements/display/drawers/ChefInfo";
import LocationSearchFormWrapper from '../../elements/display/forms/LocationSearchFormWrapper';
import OnboardingScreen from '../../elements/display/onboarding/OnboardingScreen';
import LocationSearchBar from '../../elements/display/forms/LocationSearchBar';
import { Icon, Spinner, Dialog, NumericInput } from '@blueprintjs/core';


import FormBio from "../../a/FormBio/index.js";

// import Fn from '../../../utils/fn/Fn';
import Fn from '../../../utils/fn/Fn.js';

import CurrencyContext from "../../../utils/context/CurrencyContext";
import './style.css';
// import { dilate } from "popmotion/lib/calc";
window.getGlobal = getGlobal;
window.useGlobal = useGlobal;
window.setGlobal = setGlobal;


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dialogType: '',
      dialogTitle: '',
      profiles: [],
      activeProfile: getGlobal().activeProfile,
      ready: false,
      insertModalVisible: false,
      profileInfoVisible: false,
      loading: false,
      theme: Fn.get('theme').config.theme,
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
      user: getGlobal().account,
      searchCity: ''
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
    this.setFilter = this.setFilter.bind(this)
    this.toggleDialog = this.toggleDialog.bind(this)

    this.addToNetwork = this.addToNetwork.bind(this)
    this.addToProject = this.addToProject.bind(this)
    this.cv = this.cv.bind(this)
    this.networkSeeAll = this.networkSeeAll.bind(this)
    this.editBio = this.editBio.bind(this)
    this.submitBio = this.submitBio.bind(this)
    this.editSkills = this.editSkills.bind(this)
    this.editRole = this.editRole.bind(this)

    console.log('[[ Home props ]]', props)

  }

  async submitBio(data) {
    // this.props.submitBio
    console.log(data)
    await Fn.submitBio({ self: this, data: data })
  }

  toggleDialog(config) {
    
    const { type, title } = config

    this.setState({
      isOpen: !this.state.isOpen,
      dialogType: type,
      dialogTitle: title
    })

  }
  editBio() {
    this.toggleDialog({type: 'bio', title: 'Edit your bio'})
  }
  editSkills() {
    this.toggleDialog({type: 'skills', title: 'Edit your skills'})
  }
  editRole() {
    this.toggleDialog({type: 'role', title: 'Edit role'})
  }
  networkSeeAll() {
    this.toggleDialog({type: 'bio', title: 'Edit your bio'})
  }
  
  addToNetwork() {
    // alert()
    this.toggleDialog({type: 'addToNetwork', title: 'Edit your bio'})
  }

  addToProject() {
    this.toggleDialog({type: 'addToProject', title: 'Edit your bio'})
  }
  cv() {
    this.toggleDialog({type: 'cv', title: 'Edit your bio'})
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
  async setFilter(data) {
    this.setState({ ready: false })

    console.log('filter', data.data.label)
    const url = "http://3.135.242.213:8010/nedb/users";
    // let operator;
    let query;
    if (data.type === "rep") {
      query = '?q={"$and":[{"extended.profile.additional.rating.avg":' + data.data.filter.min + '},{"extended.config.onboardingcomplete":true}]}';
    }
    if (data.type === "price") {
      query = '?q={"$and":[{"extended.rate":{"$bt":[' + data.data.filter.min + ',' + data.data.filter.max + ']}},{"extended.config.onboardingcomplete":true}]}';
    }
    if (data.type === "diet") {
      query = '?q={"$and":[{"extended.profile.additional.diets":"' + data.data.label + '"},{"extended.config.onboardingcomplete":true}]}';
    }

    // const query = '?q={ "$and":[{ "extended.rate": { "$and": [{"$gte": '+ type.filter.min +' },{"$lte": '+ type.filter.max +' }] }}, {"extended.config.onboardingcomplete": true}] }';
    // const query = '?q={ "$and":[{ "extended.rate": {"$lte" : ' + filterValue + '}}, {"extended.config.onboardingcomplete": true}]}';
    const endpoint = url + query;
    // console.log('### endpoint',endpoint)
    const config = {
      method: "GET",
      headers: {
        "origin": "localhost:3000",
        // "x-apikey": "5dbadbac64e7774913b6e751",
        "Content-Type": "application/json"
      }
    }
    // console.log('query',query)
    return await fetch(endpoint, config)
      .then(res => { return res.json() })
      .then(users_ => {
        console.log(' ')
        console.log('[[ filtered users ]]', users_)
        console.log(' ')
        this.setState({ chefs: users_, ready: true })
      })
  }
  componentWillUnmount() {
  }
  componentDidUpdate() {
    console.log('[[ Home Updated ]]', this.props)
  }
  async componentDidMount() {
    // this.start()
  }
  render() {
    const skills = ["photography", "videography", "video editing"]
    const connections = [{
      name: { first: "Name", last: "Surname" },
      image: "/img/placeholder.png"
    }, {
      name: { first: "Name", last: "Surname" },
      image: "/img/placeholder.png"
    }, {
      name: { first: "Name", last: "Surname" },
      image: "/img/placeholder.png"
    }, {
      name: { first: "Name", last: "Surname" },
      image: "/img/placeholder.png"
    }, {
      name: { first: "Name", last: "Surname" },
      image: "/img/placeholder.png"
    }, {
      name: { first: "Name", last: "Surname" },
      image: "/img/placeholder.png"
    },]
    const account = JSON.parse(localStorage.getItem('account'))

    console.log('[[ Account ]]', account, account.extended);

    return (
      <CurrencyContext.Consumer>
        {props => {
          console.log('[[ <CurrencyContext.Consumer> ]]', props);
          return (
            <TransitionLayout>
              {/* {console.log('[[[[[ account', account),
                account
                && account.extended
                && account.extended.config
                && account.extended.config.onboardingcomplete === false
                && <OnboardingScreen location={this.state.location} />
              } */}
              <section id="Home" className="w-100 mw8 center pa4 pb6">
                <div onClick={this.refresh} className="absolute top-0 right-0 pa4 pointer black-30">
                  <Icon type="sync" className={(this.state.ready ? " inactive " : " active ") + (" loading-icon ")} />
                </div>

                <section id="Profile" className="flex flex-column w-100 pb4 pt6">
                  <div className="flex flex-row w-100">

                    <div className="flex flex-column w-100=">
                      <div
                        style={{ backgroundImage: 'url(' + this.state.activeProfile.auth0.picture + ')' }}
                        className="avatar-m round  cover bg-center"></div>
                    </div>

                    <div className="flex flex-column justify-center w-100 ph4">

                      <div className="f4 flex flex-row w-100">
                        <span className="fw6">{console.log('account auth0',this.state.activeProfile.auth0)}{this.state.activeProfile.auth0.given_name} {this.state.activeProfile.auth0.family_name}</span>
                        <span className="flex items-start fw3 ml2">| {this.state.activeProfile.profile.role || 'Sound Editor'} <Icon onClick={this.editRole}  icon={'edit'} iconSize={12} className="pointer black-30 ml2" /></span>
                      </div>

                      <div className="flex flex-column w-100 pt3 black-60">

                        <div className="flex flex-column w-100">
                          <span className="f6 fw1">Age: {moment().diff('09-Feb-1983', 'years')}</span>
                        </div>

                        <div className="flex flex-column w-100">
                          <span className="f6 fw1">Gender: {this.state.activeProfile.profile.dob && this.state.activeProfile.profile.dob || ""}</span>
                        </div>

                        <div className="flex flex-column w-100">
                          <span className="f6 fw1">Location: {this.state.activeProfile.profile.location && this.state.activeProfile.profile.location.County || ""}</span>
                        </div>

                      </div>

                    </div>

                  </div>
                </section>


                <section id="ProfileButtons">

                  <div className="flex flex-row mb2">

                    <div
                      onClick={this.cv}
                      id="CV-button"
                      className="flex flex-column pr3 pointer">

                      <div id="" className="flex flex-row ph0 pv0 items-center justify-center bg-white">

                        <span className="f6 fw4 black-60 ph3">Cirriculum Vitae</span>

                        <div
                          style={{ backgroundColor: '#b3bf95' }}
                          className="flex flex-column ph3 pv2 white">
                          +
                          </div>

                      </div>

                    </div>

                    <div
                      onClick={this.addToNetwork}
                      id="AddToNetwork-button"
                      className="flex flex-column pr3 pointer">

                      <div id="" className="flex flex-row ph0 pv0 items-center justify-center bg-white">

                        <span className="f6 fw4 black-60 ph3">Add To Network</span>

                        <div
                          style={{ backgroundColor: '#b3bf95' }}
                          className="flex flex-column ph3 pv2 white">
                          +
                          </div>

                      </div>

                    </div>

                    <div
                      onClick={this.addToProject}
                      id="AddToProject-button"
                      className="flex flex-column pr3 pointer">

                      <div id="" className="flex flex-row ph0 pv0 items-center justify-center bg-white">

                        <span className="f6 fw4 black-60 ph3">Add To Project</span>

                        <div
                          style={{ backgroundColor: '#b3bf95' }}
                          className="flex flex-column ph3 pv2 white">
                          +
                          </div>

                      </div>

                    </div>

                  </div>

                </section>

                <section id="Bio" className="mt3">
                  <div className="flex flex-column mb2 pa4 br1 bg-white">
                    <div className="flex flex-row">


                      <div className="flex flex-auto flex-row pb0">
                        <p className="f4 fw4 black-60 mb0 flex flex-row flex-auto">
                        {console.log('bio',this.state.activeProfile.profile.bio)}{this.state.activeProfile.profile.bio.length === 0 && <div onClick={this.createBio} className="pointer flex ph3 pv2 f5 fw5 black-60 ba b--black-10 br1">Enter your bio</div>} {this.state.activeProfile.profile.bio} <Icon onClick={this.editBio}  icon={'edit'} iconSize={12} className="pointer black-30 ml2" /></p>
                        
                        

                      </div>
                    </div>
                    <div className="flex flex-row pt4">
                      <div className=" pt0">
                        <h3 className="f6 fw3 black-30 mb3 flex justify-center">Skills</h3>
                      </div>

                      <div className="flex flex-auto flex-column pb0 ml2">
                        <p className="flex flex-row flex-wrap f4 fw4 black-60 mb0">{skills.map((item, index) => (
                          <span className={(" pointer flex f7 fw6 black-60 ph2 pv1 br1 bs-d mr2 ")}> {item}</span>
                        ))} <Icon onClick={this.editSkills}  icon={'edit'} iconSize={12} className="pointer black-30 ml2" /></p>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="Network" className="mt3">
                  <div className="flex flex-column mb2 pa0 br1 bg-white">

                    <div className="flex flex-row bb b--black-10 justify-between">
                      <div className="flex flex-auto w--100 flex-row pb0">
                        <p className="flex f4 fw6 black-60 mb0 ph3 pv2 items-center justify-center">Network</p>
                        <p className="flex f6 fw4 black-60 mb0 ph3 pv2- items-center justify-center bl b--black-10">38 connections</p>
                        <p className="flex f6 fw4 black-60 mb0 ph3 pv2- items-center justify-center bl b--black-10">2 pending</p>
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

                        <div className="flex flex-row flex-wrap f4 fw4 black-60 mb0">{connections.map((item, index) => (
                          <div className={" flex flex-column pa3 items-center justify-center"}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '100px', backgroundImage: "url(" + item.image + ")" }} className="cover bg-center" />
                            <div className={" flex flex-row pt2 "}>
                              <div className={" flex f6 fw5 "}>
                                {item.name.first}
                              </div>
                              <div className={" flex f6 fw5 ml2"}>
                                {item.name.first}
                              </div>
                            </div>
                          </div>
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

                  <div className="flex flex-column ph4 pt4 pb2">
                          {
                            this.state.dialogType === "bio" && <FormBio value={this.state.activeProfile.profile.bio} submitBio={this.submitBio}/>
                          }
                          {
                            this.state.dialogType === "cv" && <FormBio />
                          }
                          {
                            this.state.dialogType === "addToNetwork" && <FormBio />
                          }
                          {
                            this.state.dialogType === "addToProject" && <FormBio />
                          }
                  </div>

                </Dialog>

                {
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
                    />)}

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
                  fetchChefs={this.fetchChefs}
                />
              } */}

            </TransitionLayout>
          )
        }}

      </CurrencyContext.Consumer>
    );
  }
}

export default Home;
