import React from "react";
// import React, { getGlobal, setGlobal, useGlobal } from "reactn";
import { Redirect, Link } from "react-router-dom";
import moment, { fn, HTML5_FMT } from 'moment';
import { Popover, Empty, Skeleton, Rate, Tooltip, message } from "antd";

import TransitionLayout from "../../Layouts/Transition";
// import ListChefs from "../../elements/display/chefs/list";
import PageTitle from "../../elements/layout/PageTitle_B";
// import ChefInfo from "../../elements/display/drawers/ProjectInfo";
import LocationSearchFormWrapper from '../../elements/display/forms/LocationSearchFormWrapper';
import OnboardingScreen from '../../elements/display/onboarding/OnboardingScreen';
import LocationSearchBar from '../../elements/display/forms/LocationSearchBar';
import { Icon, Spinner, Dialog, NumericInput } from '@blueprintjs/core';
// import 
import Filepond from '../../elements/upload/Filepond.js';

import ListProjects from '../../elements/display/projects/list/index.js';

import Projects from '../../a/Projects/index.js';
import ProjectCalendar from '../../a/ProjectCalendar/index.js';

import AccountContext, { AccountConsumer } from "../../../utils/context/AccountContext";
import './style.css';
import FormCreateProject from "../../a/FormCreateProject";
import CrewFinder from '../../a/CrewFinder/index.js'
import Refresh from '../../a/Refresh/index.js';

import { Fn, app } from '../../../utils/fn/Fn.js';

// import { dilate } from "popmotion/lib/calc";
// window.getGlobal = getGlobal;
// window.useGlobal = useGlobal;
// window.setGlobal = setGlobal;

class MyProjects extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      ready: false,
      subscribedProjectsReady: false,
      ownProjectsReady: false,
      isOpen: false,
      dialogType: '',
      dialogTitle: '',
      subscribedProjects: [],
      projects: [],
      ownProjects: [],
      activeButton: {},
      buttons: [],
      filters: [],
      filter: '',
      buttonLoading: false,
      favourites: [],
      crew: [],
      addToCrewButtonLoading: false,
      addToFavButtonLoading: false,
      saveAndCreateAccountButtonLoading: false,
      activeUser: {},
      createProject: false
    }

    this.fetchProjects = this.fetchProjects.bind(this)
    this.filterProjects = this.filterProjects.bind(this)
    this.filter = this.filter.bind(this)
    this.openDialog = this.openDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.refresh = this.refresh.bind(this)
    this.submitProject = this.submitProject.bind(this)

    this.saveAndCreateAccount = this.saveAndCreateAccount.bind(this)
    this.addToCrew = this.addToCrew.bind(this)
    this.addToFavourites = this.addToFavourites.bind(this)
    this.toggleCreateProject = this.toggleCreateProject.bind(this)

    console.log('[[ Home props ]]', props)

  }
  toggleCreateProject() {
    this.setState({
      createProject: !this.state.createProject
    })
  }
  addToCrew(item) {
    this.setState({
      addToCrewButtonLoading: true
    })
    console.log(item)
    let crew = new Set(this.state.crew);
    crew.add({ id: item.id, position: item.position })
    let c = Array.from(crew)
    console.log('Crew', c)

    // crew.push(item)
    this.setState({
      crew: c
    })
    setTimeout(() => {
      this.setState({
        addToCrewButtonLoading: false,
        isOpen: false
      })

    }, 1000)

  }

  addToFavourites(item) {
    this.setState({
      addToFavButtonLoading: true
    })
    console.log(item)
    let favourites = new Set(this.state.favourite);
    favourites.add({ id: item.id, position: item.position })
    let s = Array.from(favourites)
    // crew.push(item)
    console.log('ShortList', s)

    this.setState({
      favourites: s
    })
    setTimeout(() => {
      this.setState({
        addToFavButtonLoading: false
      })

    }, 1000)
  }
  async saveAndCreateAccount() {

    this.setState({
      saveAndCreateAccountButtonLoading: true
    })

    // message.config({
    //   top: 250,
    //   // duration: 2,
    //   maxCount: 3,
    // });
    // message.loading('Action in progress..');
    // Dismiss manually and asynchronously


    let shortlist = this.state.favourites;
    let invited = this.state.crew;
    let project = JSON.parse(localStorage.getItem('crewBuilder'))
    project.shortlist = shortlist;
    project.invited = invited;
    project.accepted = [];

    // let accountType = 'production';

    let onboardingProfile = { shortlist, invited, project }

    localStorage.setItem('crewBuilder', JSON.stringify(project))
    localStorage.setItem('onboardingProfile', JSON.stringify(onboardingProfile))

    // this.context.register()

    // setTimeout(() => {
    //   this.setState({
    //     saveAndCreateAccountButtonLoading: false
    //   })



    // }, 1000)

    // await Fn.createProject({ self: this, project, refresh: this.refresh, message: message })

    await app.createProject({ self: this, project, refresh: this.refresh, message: message }).then(project => {
      // this.setState({
      // })
      let crewBuilder = Fn.get("crewBuilder");
      
      crewBuilder.hasBeenUploaded = true;
      
      Fn.store({ label: "crewBuilder", value: crewBuilder });
      
      this.setState({
        saveAndCreateAccountButtonLoading: false,
            createProject: false
          });
  
          this.refresh();
  
          message.destroy();

    })

  }
  async submitProject(data) {

    const { project } = data

    await Fn.submitProject({ self: this, project })

  }
  refresh() {
    this.setState({ ready: false })
    this.fetchProjects()
  }
  setButtons() {

    const buttons = [
      {
        title: 'All',
        function: () => this.filter({ filter: 'all', button: 0 })
      },
      {
        title: 'Completed',
        function: () => this.filter({ filter: 'completed', button: 1 })
      },
      {
        title: 'Current',
        function: () => this.filter({ filter: 'current', button: 2 })
      },
      {
        title: 'Pending',
        function: () => this.filter({ filter: 'pending', button: 3 })
      },
    ]

    const filters = ['all', 'completed', 'current', 'pending']

    this.setState({
      buttons: buttons,
      activeButton: buttons[0],
      filters: filters,
      filter: filters[0]
    })

  }

  filter(config) {

    const { filter, button } = config

    console.log('filter ', config)

    this.setState({
      filter: filter,
      activeButton: button
    })

    this.filterProjects(filter)

  }
  async fetchProjects() {

    await Fn.fetchSubscribedProjects({ self: this, userId: Fn.get('account').user.id })
      .then(async res => {

        this.setState({
          subscribedProjectsReady: true,
          subscribedProjects: res
        })

        return await Fn.fetchOwnProjects({ self: this })

      })
      .then(ownprojects => {

        this.setState({
          ownProjectsReady: true,
          ownProjects: ownprojects,
          activeProject: ownprojects[0],
          ready: true
        })

      })

  }
  filterProjects(filter) {
    // let projects
    console.log(' ')
    console.log('filter', filter)
    console.log(' ')

    let ownProjects = typeof localStorage.getItem('ownProjects') !== null && JSON.parse(localStorage.getItem('ownProjects')) || [];
    let subscribedProjects = typeof localStorage.getItem('subscribedProjects') !== null && JSON.parse(localStorage.getItem('subscribedProjects')) || [];
    let projects = typeof localStorage.getItem('rojects') !== null && JSON.parse(localStorage.getItem('projects')) || [];

    // let filter = this.state.filter;

    let today = moment(new Date());

    this.setState({ ready: false })

    // alert('filter', filter)
    if (filter === "current") {

      let p = projects.filter(a => moment(a.start_date).isBefore(today) && moment(a.deadline).isAfter(today))
      let pOwn = ownProjects.filter(a => moment(a.start_date).isBefore(today) && moment(a.deadline).isAfter(today))
      let pSub = subscribedProjects.filter(a => moment(a.start_date).isBefore(today) && moment(a.deadline).isAfter(today))

      // alert('updating projects' + filter)
      console.log(' ')
      console.log('filtered projects ', p)
      console.log(' ')
      this.setState({
        projects: p,
        ownProjects: pOwn,
        subscribedProjects: pSub,
        ready: true,
        subscribedProjectsReady: true,
        ownProjectsReady: true,
      })
    }

    if (filter === "pending") {

      let p = projects.filter(a => moment(a.start_date).isAfter(today))
      let pOwn = ownProjects.filter(a => moment(a.start_date).isAfter(today))
      let pSub = subscribedProjects.filter(a => moment(a.start_date).isAfter(today))

      // alert('updating projects' + filter)
      console.log(' ')
      console.log('filtered projects ', pSub)
      console.log(' ')
      this.setState({
        projects: p,
        ownProjects: pOwn,
        subscribedProjects: pSub,
        ready: true,
        subscribedProjectsReady: true,
        ownProjectsReady: true,
      })
    }

    if (filter === "completed") {

      let p = projects.filter(a => moment(a.deadline).isBefore(today))
      let pOwn = ownProjects.filter(a => moment(a.deadline).isBefore(today))
      let pSub = subscribedProjects.filter(a => moment(a.deadline).isBefore(today))

      // alert('updating projects' + filter)
      console.log(' ')
      console.log('filtered projects ', p)
      console.log(' ')
      this.setState({
        projects: p,
        ownProjects: pOwn,
        subscribedProjects: pSub,
        ready: true,
        subscribedProjectsReady: true,
        ownProjectsReady: true,
      })
    }

    if (filter === "all") {
      // let p = projects.filter(a => moment(a.deadline).isBefore(today))
      // // alert('updating projects' + filter)
      // console.log(' ')
      // console.log('filtered projects ', p)
      // console.log(' ')
      this.setState({
        projects: projects,
        ownProjects: ownProjects,
        subscribedProjects: subscribedProjects,
        ready: true,
        subscribedProjectsReady: true,
        ownProjectsReady: true,
      })
    }

  }
  addRecentWorkProject() {

    this.toggleDialog({ type: 'addPortfolioProject', title: 'Add a Project' })

  }

  openDialog(item) {

    // const { type, title } = config
    let user = item.item;
    console.log('active user', user)
    this.setState({
      isOpen: !this.state.isOpen,
      dialogType: "createProject",
      // dialogTitle: "Create a Project",
      activeUser: user,
      dialogTitle: user.profile.name.first + " " + user.profile.name.last
    })

  }
  closeDialog() {
    this.setState({
      isOpen: false
    })
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

  avatar(data) {
    console.log('avatar ', data)
    const user = data

    if (user && user.profile && user.profile.picture.length) {
      return user.profile.picture
    }
    else {
      return '/img/placeholder.png';
    }
  }
  componentWillUnmount() {
  }
  componentDidUpdate() {
    // console.log('[[ Home Updated ]]', this.props)
  }
  async componentDidMount() {

    // this.start()
    this.context.setPage({ title: "My Projects", subtitle: "..."})

    this.setButtons()

    this.fetchProjects()

    document.querySelector("body").scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    })

  }
  render() {

    return (

      <AccountConsumer>
        {props => (
          console.log('[[ OwnProfile <AccountContext.Consumer> ]]', props),

          <TransitionLayout>

            <section id="MyProjects" className={(this.props.dashboard ? "  " : " pa4 pb6 ") + (" w-100 mw8 center mt3-  ")}>
              {/* <Refresh
                ready={this.state.ready}
                dashboard={this.props.dashboard}
                refresh={this.refresh} /> */}
              {/* <div
                onClick={this.refresh}
                className={(this.props.dashboard  ? " top12vh" : Fn.get('isMobile') ? " top-6vh " : "  ") + (" absolute top-0 right-0 pa4 pointer black-20- hover-black-40 flex flex-row items-center z-99 ")}>
                <span className="mr2 f5 fw4 black-30">{this.state.ready ? "reload" : "loading"}</span> {this.state.ready ? <Icon icon="refresh" iconSize={15} className="black-40" /> : <Spinner size={15} className="black-40" />}
              </div> */}

              <div className="flex flex-column flex-row-ns justify-between mb4 mt3-">

                {/* <PageTitle
                  title={"My Projects"}
                  docs={this.state.ready && [...this.state.ownProjects, ...this.state.subscribedProjects]}
                  showButton={false}
                  ready={this.state.ready}
                /> */}

                {Fn.get('isMobile') &&
                  <div id="CreateProject" className="flex flex-column w-20-ns w-100 items-end justify-end mb2 mt3">
                    <button
                      onClick={() => this.toggleCreateProject()}
                      className={("br1- round bs-b bg-black-20 ph3 pv2 pointer bn relative w-100  ")} >

                      <span className="f5 fw6 white pv1 flex items-center justify-center raleway">

                        {
                          this.state.buttonLoading
                            ? <Icon icon="loading" className={' absolute right-0 f4 black-60 mr2'} />
                            : <Icon icon={"small-plus"} iconSize={20} className={(' f4 black-60- white  absolute right-0 mr3')} />
                        } Create a Project</span>

                    </button>
                  </div>
                }

              </div>

              {!Fn.get('isMobile') && (
                <section
                  id="ToolbarButtons"
                  className="flex flex-column mb3"
                >
                  <div className="flex flex-row justify-between mb3">
                    <div className="flex flex-row flex-auto mw6 br2 overflow-hidden">
                      {this.state.buttons.map((button, index) => (
                        <button
                          title={button.title}
                          onClick={() =>
                            this.filter({
                              filter: this.state.filters[index],
                              button: button
                            })
                          }
                          id={button.title}
                          className={
                            (index > 0 && " bl b--black-05 ") +
                            (this.state.activeButton.title ===
                              button.title
                              ? " bg-white-60 "
                              : " bg-white ") +
                            " flex flex-column pa0 mr3- pointer justify-center items-center flex-auto"
                          }
                        >
                          <div
                            id=""
                            className="flex flex-row ph0 pv0 items-center justify-center"
                          >
                            <span className="f5 fw6 black-40 ph3 pv2">
                              {button.title}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div id="CreateProject" className="flex flex-column w-20-ns w-100 items-end justify-end mb2">
                      <button
                        onClick={() => this.toggleCreateProject()}
                        className={("br1- round bs-b bg-black-20 ph3 pv2 pointer bn relative w-100  ")} >

                        <span className="f5 fw6 white pv1 flex items-center justify-center raleway">

                          {
                            this.state.buttonLoading
                              ? <Icon icon="loading" className={' absolute right-0 f4 black-60 mr2'} />
                              : <Icon icon={"small-plus"} iconSize={20} className={(' f4 black-60- white  absolute right-0 mr3')} />
                          } Create a Project</span>

                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* {!Fn.get('isMobile') &&
                <section id="ToolbarButtons" className="flex flex-column mb3">

                  <div className="flex flex-row justify-between mb3">

                    <div className="flex flex-row">
                      {
                        this.state.buttons.map((button, index) => (
                          <button
                            title={button.title}
                            onClick={() => this.filter({ filter: this.state.filters[index], button: button })}
                            id="CV-button"
                            className={(this.state.activeButton.title === button.title ? " bg-white-60 " : "  ") + (" flex flex-column pa0 mr3 pointer justify-center ")}>

                            <div id="" className="flex flex-row ph0 pv0 items-center justify-center">

                              <span className="f5 fw4 black-60 ph3 pv2">{button.title}</span>

                            </div>

                          </button>
                        ))
                      }
                    </div>
                    <div id="CreateProject" className="flex flex-column w-20-ns w-100 items-end justify-end mb2">
                      <button
                        onClick={() => this.toggleCreateProject()}
                        className={("br1- round bs-b bg-black-20 ph3 pv2 pointer bn relative w-100  ")} >

                        <span className="f5 fw6 white pv0 flex items-center justify-center">

                          {
                            this.state.buttonLoading
                              ? <Icon icon="loading" className={' absolute right-0 f4 black-60 mr2'} />
                              : <Icon icon={"small-plus"} iconSize={20} className={(' f4 black-60- white  absolute right-0 mr3')} />
                          } Create a Project</span>

                      </button>
                    </div>

                  </div>

                </section>
              } */}
              {/* 
              <Projects
                projects={props.account.user.profile.projects}
                addRecentWorkProject={this.addRecentWorkProject}
              /> */}
              <div className="flex flex-column flex-row-ns col-2 justify-between">
               

                <div className="flex flex-column mt4- w-50">

                  <div id="" className="flex flex-column flex-row-ns ph0 pb3 items-start items-center-ns justify-start">

                    <span className="f5 fw6 black-50 pv2">Created Projects</span>
                    <span className="f6 fw5 black-30 pv0 pv2-ns flex items-center ml3-ns"><Icon icon={'info-sign'} iconSize={15} className="black-20 mr2" /> Projects you own</span>

                  </div>
                  {
                    this.state.ready && this.state.ownProjectsReady ? (
                      this.state.ownProjects.length > 0 ? (
                        <ListProjects
                          projects={this.state.ownProjects}
                          activeProject={this.state.activeProject}
                          className="trans-a"
                          showDrawer={this.showDrawer}
                          hideDrawer={this.hideDrawer}
                          theme={props.theme}
                          activeCurrency={props.activeCurrency}
                          exchangeRate={props.exchangeRate}
                        />
                      ) : (
                          <div id="" className="flex flex-row ph0 mv4 items-center justify-start">

                            <span className="f6 fw5 black-50 pv2 ph3 ba b--black-05">No projects to show</span>

                          </div>
                        )
                    ) : (
                        <div className="trans-a">
                          <Skeleton active />
                        </div>
                      )
                  }

                </div> 
                <div className="flex flex-column">
                  <div id="" className="flex flex-column flex-row-ns ph0 pb3 items-start items-center-ns justify-start">

                    <span className="f5 fw6 black-50 pv2">Subscribed Projects</span>
                    <span className="f6 fw5 black-30 pv0 pv2-ns flex items-center ml3-ns"><Icon icon={'info-sign'} iconSize={15} className="black-20 mr2" /> Projects you crew for</span>

                  </div>

                  {
                    this.state.ready && this.state.subscribedProjectsReady ? (
                      this.state.subscribedProjects.length > 0 ? (
                        <ListProjects
                          projects={this.state.subscribedProjects}
                          activeProject={this.state.activeProject}
                          className="trans-a"
                          showDrawer={this.showDrawer}
                          hideDrawer={this.hideDrawer}
                          theme={props.theme}
                          activeCurrency={props.activeCurrency}
                          exchangeRate={props.exchangeRate}
                        />
                      ) : (
                          <div id="" className="flex flex-row ph0 pb3 items-center justify-start">

                            <span className="f6 fw5 black-50 pv2 ph3 mv4 ba b--black-05">No projects to show</span>

                          </div>
                        )
                    ) : (
                        <div className="trans-a">
                          <Skeleton active />
                        </div>
                      )
                  }
                </div>
                
                </div>

              {Fn.get('isMobile') &&
                <div className="bg-white fixed bottom-7vh left-0 w-100 flex flex-row bs-b bb b--black-05">
                  {
                    this.state.buttons.map((button, index) => (
                      <button
                        title={button.title}
                        onClick={() => this.filter({ filter: this.state.filters[index], button: button })}
                        id="CV-button"
                        className={(this.state.activeButton.title === button.title ? " bg-black-05 fw6" : " bg-white fw5 ") + (" flex flex-column pa0 pointer justify-center flex-auto bl b--black-05")}>

                        <div id="" className="flex flex-row ph0 pv0 items-center justify-center">

                          <span className="f5 -fw6 black ph3 pv3">{button.title}</span>

                        </div>

                      </button>
                    ))
                  }
                </div>}

              {
                this.state.createProject &&
                <CrewFinder
                  toggleCreateProject={this.toggleCreateProject}
                  type={'createProject'}
                  addToCrew={this.addToCrew}
                  addToFavourites={this.addToFavourites}
                  openDialog={this.openDialog}
                  closeDialog={this.closeDialog}
                  saveAndCreateAccount={this.saveAndCreateAccount}
                  saveAndCreateAccountButtonLoading={this.state.saveAndCreateAccountButtonLoading}
                />
              }

              <Dialog
                className={'bp3-light'}
                // icon="info-sign"
                onClose={this.toggleDialog}
                title={this.state.dialogTitle}
                onValueChange={this.onValueChange}
                {...this.state}
              >
                {
                  this.state.isOpen &&

                  <div className="flex flex-column pa4-">

                    <div className="flex flex-column">

                      <div className="flex flex-row">

                        <section id="Profile" className="flex flex-column w-100 ">

                          <div className="flex flex-row w-100">

                            <div className="flex flex-column w-100=">

                              <div

                                style={{ width: '160px', backgroundImage: 'url(' + this.avatar(this.state.activeUser) + ')' }}
                                className="pointer h-100   cover bg-center"></div>

                            </div>

                            <div className="flex flex-column justify-center w-100">

                              <div className="flex flex-column justify-center w-100 pa4">

                                <div className="f4 flex flex-column w-100">
                                  <span className="fw6 black-80">{this.state.activeUser.profile.name && this.state.activeUser.profile.name.first} {this.state.activeUser.profile.name && this.state.activeUser.profile.name.last}</span>
                                  <span className="flex items-start fw4 ml0 mt2 f5 black-50">{this.state.activeUser.position}</span>
                                </div>

                                <div className="flex flex-row flex-wrap w-100 pt3 black-60">

                                  <div className="flex flex-column mr3 mb1">
                                    <span className="f6 fw4 black-40">Age<span className="fw6 ml2 black-60">{moment().diff(this.state.activeUser.profile.dob, 'years')}</span></span>
                                  </div>

                                  <div className="flex flex-column mr3 mb1">
                                    <span className="f6 fw4 black-40">Gender<span className="fw6 ml2 black-60">{this.state.activeUser.profile.gender && this.state.activeUser.profile.gender || ""}</span></span>
                                  </div>

                                  <div className="flex flex-column mr3 mb1">
                                    <span className="f6 fw4 black-40">Location<span className="fw6 ml2 black-60">{this.state.activeUser.profile.location && this.state.activeUser.profile.location.County || ""}</span></span>
                                  </div>

                                </div>

                              </div>

                              <div className="flex flex-row justify-center w-100">
                                <button
                                  onClick={() => this.addToNetwork(this.state.activeUser)}
                                  className="pointer pv3 flex-auto flex flex-row justify-center pa0 ma0 bg-white">
                                  <span className="f5 fw6 black-40 mr2">Add to Network</span>

                                  {
                                    this.state.addToNetworkButtonLoading ?
                                      <Spinner size={15} /> :
                                      <Icon icon={'small-plus'} iconSize={15} className="black-50" />
                                  }

                                </button>
                                <button
                                  onClick={() => this.addToCrew(this.state.activeUser)}
                                  className="pointer pv3 flex-auto flex flex-row justify-center pa0 ma0 bg-white bl b--black-10">
                                  <span className="f5 fw6 black-40 mr2 ">Invite to Crew</span>
                                  {
                                    this.state.addToCrewButtonLoading ?
                                      <Spinner size={15} /> :
                                      <Icon icon={'small-plus'} iconSize={15} className="black-50" />
                                  }

                                </button>
                              </div>

                            </div>

                          </div>

                        </section>

                      </div>

                    </div>

                  </div>
                }
              </Dialog>

            </section>

          </TransitionLayout>

        )}

      </AccountConsumer>
    )
  }
}

export default MyProjects;
MyProjects.contextType = AccountContext.Consumer