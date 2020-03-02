import React from "react";
// import React, { getGlobal, setGlobal, useGlobal } from "reactn";
import { Redirect } from "react-router-dom";
import { Popover, Empty, Skeleton, Rate } from "antd";

import TransitionLayout from "../../Layouts/Transition";
import ListProjects from "../../elements/display/projects/list";
import PageTitle from "../../elements/layout/PageTitle_B";
import ProjectInfo from "../../elements/display/drawers/ProjectInfo";
import LocationSearchFormWrapper from '../../elements/display/forms/LocationSearchFormWrapper';
import OnboardingScreen from '../../elements/display/onboarding/OnboardingScreen';
import LocationSearchBar from '../../elements/display/forms/LocationSearchBar';
import FormProjectSearch from '../../elements/forms/ProjectSearch.js';
import Loading from '../../elements/Loading.js';

import { Dialog, Icon, Spinner } from '@blueprintjs/core';
import moment from 'moment';
import methods from '../../../utils/methods';
import Fn from '../../../utils/fn/Fn.js';

import AccountContext, { AccountConsumer } from "../../../utils/context/AccountContext";
import './style.css';
// import { dilate } from "popmotion/lib/calc";
// window.getGlobal = getGlobal;
// window.useGlobal = useGlobal;
// window.setGlobal = setGlobal;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      // projects: [],
      // activeProject: getGlobal().activeProject,
      ready: false,
      insertModalVisible: false,
      projectInfoVisible: false,
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
      account: Fn.get('account'),
      searchCity: '',
      isOpen: false
    }

    this.fetchProjects = this.fetchProjects.bind(this);
    this.fetchProjects2 = this.fetchProjects2.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.hideDrawer = this.hideDrawer.bind(this);
    this.refresh = this.refresh.bind(this);
    // this.updateActiveDoc = this.updateActiveDoc.bind(this);
    this.setLocation = this.setLocation.bind(this)
    this.start = this.start.bind(this)
    this.focusLocationSearch = this.focusLocationSearch.bind(this)

    this.reserve = this.reserve.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.openSearchDialog = this.openSearchDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.searchProjects = this.searchProjects.bind(this)

    // this.submitReservationRequest = this.submitReservationRequest.bind(this)
    // this.setFilter = this.setFilter.bind(this)

    console.log('[[ Home props ]]', props)
  }
  closeDialog() {
    this.setState({
      isOpen: false
    })
  }
  searchProjects(data) {

    const { location, projectType, startDate, endDate } = data;

    this.setState({
      ready: false
    })
    // alert()

    console.log('search config ', data)

    console.log(this.state.projects)

    let location_;

    if (typeof data.location.County !== "undefined") {
      location_ = data.location.County.toLowerCase()
    }
    else {
      location_ = data.location.address.county.toLowerCase()
    }

    // let type = data.projectType;
    let projects = this.state.projects;

    console.log('location', location_)

    let filterByLocation = projects.filter(p => p.location.toLowerCase() === location_)
    console.log('Results filtered by Location', filterByLocation)
    let filterByType = filterByLocation.filter(p => p.type === projectType)
    console.log('Results filtered by Project Type', filterByType)
    let filterByDateRange = filterByType.filter(p => moment(p.start_date).isBetween(data.startDate, data.endDate))
    console.log('Results filtered by Date Range', filterByDateRange)

    // console.log('filtered', filtered)
    // console.log('filteredDateRange', filteredDateRange)

    this.setState({
      projects: filterByDateRange,
      ready: true,
      isOpen: false
    })

  }
  openSearchDialog() {
    this.setState({ isOpen: true })
  }
  focusLocationSearch() {

  }
  reserve(doc) {
    console.log(doc)
    this.setState({ activeDoc: doc })
    // setGlobal({ "reserve": true, recipient: doc })
  }
  async sendMessage(doc) {
    return await Fn.sendMessage({ doc, self: this })
  }
  async fetchProjects2(city) {
    this.setState({ ready: false, searchCity: city })
    setTimeout(() => {
      console.log('[[ fetchProjects2 city ]]', city)
      return Fn.fetchProjects2({ city, self: this })
    }, 1000)

  }
  async fetchProjects(city) {
    this.setState({ ready: false, searchCity: city })
    return await Fn.fetchProjects({ city, self: this })
  }
  async refresh() {
    return await Fn.refresh({ self: this })
  }
  async showDrawer(project) {
    return await Fn.showDrawer({ project, self: this })
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

  async setLocation() {
    return await Fn.setLocation({ self: this })
  }
  async start() {
    // find location by browser geolocation, 
    // then query Here maps api for location data using reverse geolocation.
    // Fn.fetchProjects({ self: this })
    // return await Fn.setLocation({ self: this })
  }

  componentWillUnmount() {
  }
  componentDidUpdate() {
    console.log('[[ Home Updated ]]', this.props)
  }
  async componentDidMount() {

    const buttons = [
      { 
        label: "Find a Project",
        action: this.openSearchDialog
      }
    ]
    this.context.setPage({ title: "Find a Project", subtitle: "...", buttons: buttons })

    Fn.fetchProjects({ self: this })

    document.querySelector("body").scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    })

    if(localStorage.getItem('crewBuilder') !== null){
      let crewBuilder = Fn.get('crewBuilder');
      if(!crewBuilder.hasBeenUploaded) {

        await Fn.createProject({self:this, project: crewBuilder })
       
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
              {
                !this.state.ready &&
                <Loading />
              }

              {/* {
                props.account.user.profile.config.onboardingcomplete === false
                && <OnboardingScreen location={this.state.location} />
              } */}

              <section id="Home" className="w-100 mw9 center pa4 pb6">

                {/* <div className="flex flex-column flex-row-ns justify-between mb4 mt3"> */}

                  {/* <PageTitle
                    title={"Find a Project"}
                    ready={this.state.ready}
                    theme={props.theme}
                    showInsertForm={this.showModal}
                    docs={this.state.projects}
                    activeDoc={this.state.activeProject}
                    updateActiveDoc={this.updateActiveDoc}
                    showButton={false}
                  /> */}

                  <div
                    id="ProjectSearch"
                    className="w-100 flex flex-row items-end justify-start justify-end-ns mb2">
                    <button
                      onClick={this.openSearchDialog}
                      className={(Fn.get('isMobile') ? " w-100 mt3 " : "  ") + (" br1- round bs-b bg-black-20 ph4 pv2 pointer bn relative w-100-    ")} >

                      <span className="f5 fw6 white pv1 flex items-center justify-center pr2 raleway">

                        {this.state.buttonLoading ? <Icon icon="loading" className={' absolute right-0 f4 black-60 mr2'} /> : <Icon icon={"search"} iconSize={12} className={(' f4 black-60- white  absolute right-0 mr3')} />} Find a Project</span>
                    </button>
                  </div>
                  {/* {this.state.locationIsSet &&
                    <LocationSearchBar
                      location={this.state.location}
                      findLocation={this.findLocation}
                      fetchProjects={this.fetchProjects2}

                    />} */}

                {/* </div> */}
                {/* <div className="flex flex-row justify-between pb3">
                  <h4 className="f7 fw5 black-30">Showing results for <span onClick={this.focusLocationSearch} className="ph2 pv1 br1 fw6 black-40 bg-black-10 white">{this.state.searchCity}</span></h4>
                </div> */}

                {this.state.ready ? (
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
                      col={3}
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
                  )}
                {
                  this.state
                  && this.state.locationIsSet
                  && this.state.ready
                  && this.state.drawerReady
                  &&
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
                }

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
                  + (" absolute top-0 right-0 pa3 pointer black-20- hover-black-40 flex flex-row items-center z-9 ")}>
                <span className="mr2 f5 fw4 black-30">{this.state.ready ? "reload" : "loading"}</span> {this.state.ready ? <Icon icon="refresh" iconSize={15} className="black-40" /> : <Spinner size={15} className="black-40" />}
              </div> */}
              <Dialog
                className={'bp3-light'}

                // icon="info-sign"
                onClose={this.closeDialog}
                title={this.state.dialogTitle}
                {...this.state}
              >
                <FormProjectSearch
                  searchProjects={this.searchProjects}
                />

              </Dialog>

            </TransitionLayout>

          )
        }}

      </AccountContext.Consumer>
    );
  }
}

export default Home;
Home.contextType = AccountContext