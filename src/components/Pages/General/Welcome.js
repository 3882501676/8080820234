
import React from "react";
// import React, { getGlobal, setGlobal, useGlobal } from "reactn";

import WelcomeScreen from '../../elements/layout/WelcomeScreen.js';
import { Icon, Spinner, Dialog, NumericInput } from '@blueprintjs/core';
import { Drawer } from 'antd';
import moment from 'moment';
import AccountContext, { AccountConsumer } from '../../../utils/context/AccountContext.js';

// import FormLogin from '../../a/FormLogin/index.js';
// import ListProjects from '../../elements/display/projects/list/index.js';
import CrewFinder from '../../a/CrewFinder/index.js';
import ProjectFinder from '../../a/ProjectFinder/index.js';
import './style.css';
import Fn from "../../../utils/fn/Fn.js";

// window.getGlobal = getGlobal;
// window.useGlobal = useGlobal;
// window.setGlobal = setGlobal;


class Welcome extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      isOpen: false,
      dialogType: 'login',
      type: '',
      typeSelected: false,
      projects: [],
      filteredProjects: [],
      projectsReady: false,
      drawerVisible: false,
      favourites: [],
      crew: [],
      crew_: [],
      drawerType: 'crew',
      drawerTitle: 'Your Crew List',
      isOpen: false,
      activeUser: {},
      dialogTitle: '',
      addToCrewButtonLoading: false,
      addToFavButtonLoading: false,
      saveAndCreateAccountButtonLoading: false,
      searchLoading: false

    }
    console.log('Welcome', props)

    this.selectType = this.selectType.bind(this)
    this.fetchProjects = this.fetchProjects.bind(this)
    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.openDrawer = this.openDrawer.bind(this)
    this.addToCrew = this.addToCrew.bind(this)
    this.addToFavourites = this.addToFavourites.bind(this)

    this.openDialog = this.openDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.avatar = this.avatar.bind(this)
    this.searchProjects = this.searchProjects.bind(this)
    this.saveAndCreateAccount = this.saveAndCreateAccount.bind(this)

    console.log('OnboardingScreen props', props)

  }
  saveAndCreateAccount() {
    
    this.setState({
      saveAndCreateAccountButtonLoading: true
    })
    
    let fav = this.state.favourites;
    let crew = this.state.crew;
    let crew_ = this.state.crew_;
    let project = JSON.parse(localStorage.getItem('crewBuilder')) 
    project.invited = crew_;
    project.shortlist = fav;

    localStorage.setItem('crewBuilder', JSON.stringify(project) )

    // let accountType = 'production';

    let onboardingProfile = { fav, crew, project }

    localStorage.setItem('onboardingProfile', JSON.stringify(onboardingProfile))

    this.context.register()

    setTimeout(() => {
      this.setState({
        saveAndCreateAccountButtonLoading: false
      })
    },1000)

  }
  searchProjects(data) {

    console.log(data)

    this.setState({
      searchLoading: true
    })

    console.log(this.state.projects)

    let location; 

    if( typeof data.location.County !== "undefined") {
      location = data.location.County.toUpperCase()
    }
    else {
      location = data.location.address.county.toUpperCase()
    }

    let type = data.projectType;
    let projects = this.state.projects;
    
    console.log('location',location)

    let filtered = projects.filter( p => p.location.toUpperCase() === location && p.type === type )
    let filteredDateRange = filtered.filter( p => moment(p.start_date).isBetween(data.startDate,data.endDate))
    
    console.log('filtered',filtered)

    setTimeout(() => {

      this.setState({
        filteredProjects: filteredDateRange,
        projectsReady: true,
        searchLoading: false
      })
    },1000)

    

  }

  avatar(user) {
    // console.log('avatar ', user)
    // const user = data.user

    if (user && user.profile && user.profile.picture.length > 0) {
      return user.profile.picture
    }
    else {
      return '/img/placeholder.png';
    }
  }

  openDialog(item) {
    console.log(item)
    let user = item.item;
    this.setState({
      isOpen: true,
      activeUser: user,
      dialogTitle: user.profile.name.first + " " + user.profile.name.last
    })
  }

  closeDialog() {
    this.setState({
      isOpen: false
    })
  }

  toggleDrawer({ type }) {

    this.setState({
      drawerVisible: !this.state.drawerVisible,
      drawerType: type,
      drawerTitle: type === "crew" ? "Your crew list" : "Your favourites list"
    })
  }

  openDrawer({ type }) {
    this.toggleDrawer({ type })
  }

  addToCrew(item) {
    this.setState({
      addToCrewButtonLoading: true
    })
    console.log(item)
    let crew = new Set(this.state.crew);
    let crew_ = new Set(this.state.crew_);

    crew.add(item)
    crew_.add({ id: item.id, position: item.position })
    let c = Array.from(crew)
    let c_ = Array.from(crew_)
    console.log('Crew', c)
    console.log('Crew_', c_)

    // crew.push(item)
    this.setState({
      crew: c,
      crew_: c_
    })
    
    setTimeout(() => {

      this.setState({
        addToCrewButtonLoading: false,
        isOpen: false
      })

    },1000)
    
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

    },1000)
  }

  async fetchProjects() {
    await Fn.fetchProjects({ self: this })
  }

  toggleDialog() {

  }

  selectType(type) {
    // alert(type)
    this.setState({
      type: type,
      typeSelected: true
    })

    if (type === "project-finder") {
      this.fetchProjects()
      Fn.store({ label: 'accountType', value: 'crew'})
      Fn.store({ label: 'accountTypeIsSet', value: true})
    }
    if (type === "crew-builder") {
      // this.fetchProjects()
      Fn.store({ label: 'accountType', value: 'production'})
      Fn.store({ label: 'accountTypeIsSet', value: true})
    }
    
  }

  login() {
    this.openDialog()
    // alert()

  }

  logout() {
    this.setState({ isAuthenticated: false })
    Fn.store({ label: 'isAuthenticated', value: false })
    this.props.history.push('/')
  }

  async componentDidMount() {
    if(Fn.get('isAuthenticated')){
      this.props.history.push('/dashboard')
    }
  }

  render() {

    return (

      <>
        {
          !this.state.typeSelected &&

          <WelcomeScreen
            projects={this.state.projects}
            type={this.state.type}
            selectType={this.selectType}
            typeSelected={this.state.typeSelected} />
        }

        <Dialog
          className={'bp3-light'}
          // icon="info-sign"
          onClose={this.closeDialog}
          // title={this.state.dialogTitle}
          {...this.state}
        >

          {
            this.state.isOpen &&

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
                        {/* <button
                          onClick={() => this.addToFavourites(this.state.activeUser)}
                          className="pointer pv3 flex-auto flex flex-row justify-center pa0 ma0 bg-white">
                          <span className="f5 fw6 black-40 mr2">Add to Favourites</span>

                          {
                              this.state.addToFavButtonLoading ? 
                              <Spinner size={15} /> : 
                              <Icon icon={'small-plus'} iconSize={15} className="black-50"/>
                            }

                        </button> */}
                        <button
                          onClick={() => this.addToCrew(this.state.activeUser)}
                          className="pointer pv3 flex-auto flex flex-row justify-center pa0 ma0 bg-white bl b--black-10">
                          <span className="f5 fw6 black-40 mr2 ">Invite to Crew</span>
                          {
                              this.state.addToCrewButtonLoading ? 
                              <Spinner size={15} /> : 
                              <Icon icon={'small-plus'} iconSize={15} className="black-50"/>
                            }

                        </button>
                      </div>

                    </div>

                  </div>

                </section>

              </div>

            </div>
          }

        </Dialog>

        {/* {
          this.state.typeSelected && this.state.type === 'project-finder' &&

          <div className="flex flex-column items-center justify-start  h-100 raleway fw5 mw8 center w-100 pt4">

            <div className="flex flex-column ma0 w-100" id="">

              <div className="Buttons flex flex-row justify-center items-center pv4 ">

                <h1 className=" f3 fw4 black mv0 tc">Find a Project</h1>

              </div>

            </div>

            <div className="flex flex-column ma0 w-100" id="">

              <div className="Buttons flex flex-row justify-between ">

                {
                  this.state.projects.length > 0 && <ListProjects projects={this.state.projects} />
                }


              </div>

            </div>

          </div>
        } */}

        {
          this.state.typeSelected && this.state.type === 'crew-builder' &&
          <div id="CrewBuilder" className="relative flex flex-column items-center justify-start  h-100 raleway fw5 w-100 pt4">

            <div id="OnboardingStatus" className="absolute flex flex-column right-0 top-0 z-99">

              <div className="flex flex-column mv4  mh5 bs-b round overflow-hidden">

                <div className="flex flex-row justify-center w-100">
                  <button onClick={() => this.openDrawer({ type: 'crew' })} className="pointer pv2 ph4 flex-auto flex flex-row justify-center pa0 ma0 bg-white hover-bg-black-05 hover-black -bs-a">
                    <span className="flex items-center f5 fw6 black-40 ">View Crew <Icon icon={'follower'} iconSize={15} className="ml2 black-40" /> </span>
                  </button>
                </div>
{/* 
                <div className="flex flex-row justify-center w-100 bt b--black-05">
                  <button onClick={() => this.openDrawer({ type: 'favourites' })} className="pointer pv3 ph4 flex-auto flex flex-row justify-center pa0 ma0 bg-white hover-bg-black-05 hover-black -bs-a">
                    <span className="flex items-center f5 fw6 black-40 ">View Shortlist <Icon icon={'follower'} iconSize={15} className="ml2 black-40" /> </span>
                  </button>
                </div> */}

              </div>

            </div>
            

            <Drawer
              title={false}
              placement={'bottom'}
              closable={true}
              onClose={this.toggleDrawer}
              visible={this.state.drawerVisible}
              height={'36vh'}
            >

              <div className="flex flex-column">

                <div className="flex flex-column pa4">

                  <div className="flex flex-row">

                    {
                      this.state[this.state.drawerType] && this.state[this.state.drawerType].map((item, index) => (
                       
                       <div className="flex flex-column mb2">

                          <div className="flex flex-row">

                            <div
                              onClick={() => this.openDialog({ item })}
                              className={
                                " pointer flex flex-column pv2 pr3 items-center justify-center"
                              }
                            >

                              <div
                                style={{
                                  width: "160px",
                                  height: "100px",
                                  borderRadius: "5px",
                                  backgroundImage:
                                    "url(" + item.profile.picture + ")"
                                }}
                                className="cover bg-center"
                              />

                              <div className={" flex flex-row pt2 black"}>

                                <div className={" flex f5 fw6 "}>
                                  {item.profile.name.first}
                                </div>

                                <div className={" flex f5 fw6 ml1"}>
                                  {item.profile.name.last}
                                </div>

                              </div>

                            </div>
                            
                          </div>

                          <div className="justify-center flex flex-row f6 fw4 black-40 pb3 w-100 tc">{item.position} </div>

                        </div>
                      ))}

                  </div>

                </div>                
                
              </div>

            </Drawer>

            <CrewFinder
             type={'crewBuilder'}
              addToCrew={this.addToCrew}
              addToFavourites={this.addToFavourites}
              openDialog={this.openDialog}
              closeDialog={this.closeDialog}
              saveAndCreateAccount={this.saveAndCreateAccount}
              saveAndCreateAccountButtonLoading={this.state.saveAndCreateAccountButtonLoading}
            />

          </div>
        }


{
          this.state.typeSelected && this.state.type === 'project-finder' &&
          <div id="CrewBuilder" className="relative flex flex-column items-center justify-start  h-100 raleway fw5 w-100 ">

            {/* <div id="OnboardingStatus" className="absolute flex flex-column right-0 top-0 z-99">

              <div className="flex flex-column pa4">

                <div className="flex flex-row justify-center w-100">
                  <button onClick={() => this.openDrawer({ type: 'crew' })} className="pointer pv3 ph4 flex-auto flex flex-row justify-center pa0 ma0 bg-white bs-a">
                    <span className="flex items-center f5 fw6 black-40 ">View Crew <Icon icon={'follower'} iconSize={15} className="ml2 black-40" /> </span>
                  </button>
                </div>

                <div className="flex flex-row justify-center w-100 mt2">
                  <button onClick={() => this.openDrawer({ type: 'shortList' })} className="pointer pv3 ph4 flex-auto flex flex-row justify-center pa0 ma0 bg-white bs-a">
                    <span className="flex items-center f5 fw6 black-40 ">View Shortlist <Icon icon={'follower'} iconSize={15} className="ml2 black-40" /> </span>
                  </button>
                </div>

              </div>

            </div> */}

            <Drawer
              title={false}
              placement={'bottom'}
              closable={true}
              onClose={this.toggleDrawer}
              visible={this.state.drawerVisible}
              height={'36vh'}
            >

              <div className="flex flex-column">

                <div className="flex flex-column pa4">

                  <div className="flex flex-row">

                    {
                      this.state[this.state.drawerType] && this.state[this.state.drawerType].map((item, index) => (
                       
                       <div className="flex flex-column mb2">

                          <div className="flex flex-row">

                            <div
                              onClick={() => this.openDialog({ item })}
                              className={
                                " pointer flex flex-column pv2 pr3 items-center justify-center"
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

                              <div className={" flex flex-row pt3 black-60"}>

                                <div className={" flex f6 fw6 "}>
                                  {item.profile.name.first}
                                </div>

                                <div className={" flex f6 fw6 ml1"}>
                                  {item.profile.name.last}
                                </div>

                              </div>

                            </div>
                            
                          </div>

                          <div className="flex flex-row f6 fw4 black-40 pb3 w4">{item.position} </div>

                        </div>
                      ))}

                  </div>

                </div>                
                
              </div>

            </Drawer>

            <ProjectFinder
              projects={this.state.filteredProjects}
              searchProjects={this.searchProjects}
              projectsReady={this.state.projectsReady}
              // addToCrew={this.addToCrew}
              // addToShortList={this.addToShortList}
              openDialog={this.openDialog}
              closeDialog={this.closeDialog}
              searchLoading={this.state.searchLoading}
            />



          </div>
        }

      </>
    )
  }
}

export default Welcome;
Welcome.contextType = AccountContext;