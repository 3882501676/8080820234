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
import ListProjects from '../../elements/display/projects/list/index.js';

import Projects from '../../a/Projects/index.js';
import ProjectCalendar from '../../a/ProjectCalendar/index.js';
// import Fn from '../../../utils/fn/Fn';
import Fn from '../../../utils/fn/Fn.js';

import AccountContext, { AccountConsumer } from "../../../utils/context/AccountContext";
import './style.css';
// import { dilate } from "popmotion/lib/calc";
window.getGlobal = getGlobal;
window.useGlobal = useGlobal;
window.setGlobal = setGlobal;


class MyProjects extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      isOpen: false,
      dialogType: '',
      dialogTitle: '',
      projects: [],
      activeButton: {},
      buttons: [],
      filters: [],
      filter: '',
      ready: false,
      buttonLoading: false
    }

    this.fetchProjects = this.fetchProjects.bind(this)
    this.filterProjects = this.filterProjects.bind(this)
    this.filter = this.filter.bind(this)
    this.toggleDialog = this.toggleDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)

    console.log('[[ Home props ]]', props)

  }
  setButtons() {

    const buttons = [
      {
        title: 'All',
        function: this.filter({ filter: 'all', button: 0 })
      },
      {
        title: 'Completed',
        function: this.filter({ filter: 'completed', button: 1 })
      },
      {
        title: 'Current',
        function: this.filter({ filter: 'current', button: 2 })
      },
      {
        title: 'Pending',
        function: this.filter({ filter: 'pending', button: 3 })
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

    console.log(config)

    this.setState({
      filter: filter,
      activeButton: button
    })

    this.filterProjects(filter)

  }
  fetchProjects() { 
    
    Fn.fetchProjects({ self: this })

  }
  filterProjects(filter) {
    
    let projects = Fn.get('projects')

    // let filter = this.state.filter;

    let today = moment(new Date());


    // alert('filter', filter)
    if(filter === "current") {

      let p = projects.filter(a => moment(a.start_date).isBefore(today) && moment(a.deadline).isAfter(today))

      // alert('updating projects' + filter)
      console.log(' ')
      console.log('filtered projects ', p)
      console.log(' ')
      this.setState({
        projects: p
      })
    }

    if(filter === "pending") {
      let p = projects.filter(a => moment(a.start_date).isAfter(today))
      // alert('updating projects' + filter)
      console.log(' ')
      console.log('filtered projects ', p)
      console.log(' ')
      this.setState({
        projects: p
      })
    }

    if(filter === "completed") {
      let p = projects.filter(a => moment(a.deadline).isBefore(today))
      // alert('updating projects' + filter)
      console.log(' ')
      console.log('filtered projects ', p)
      console.log(' ')
      this.setState({
        projects: p
      })
    }

    if(filter === "all") {
      // let p = projects.filter(a => moment(a.deadline).isBefore(today))
      // // alert('updating projects' + filter)
      // console.log(' ')
      // console.log('filtered projects ', p)
      // console.log(' ')
      this.setState({
        projects: projects
      })
    }

  }
  addRecentWorkProject() {

    this.toggleDialog({ type: 'addPortfolioProject', title: 'Add a Project' })

  }


  toggleDialog(config) {

    const { type, title } = config

    this.setState({
      isOpen: !this.state.isOpen,
      // dialogType: type,
      // dialogTitle: title
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
    const user = data.user

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
    // console.log('[[ Home Updated ]]', this.props)
  }
  async componentDidMount() {
    // this.start()
    this.setButtons()
    this.fetchProjects()
  }
  render() {

    return (

      <AccountConsumer>
        {props => (
          console.log('[[ OwnProfile <AccountContext.Consumer> ]]', props),

          <TransitionLayout>

            <section id="MyProjects" className="w-100 mw9 center pa4 pb6">

              <div onClick={this.refresh} className="absolute top-0 right-0 pa4 pointer black-30">
                <Icon type="sync" className={(this.state.ready ? " inactive " : " active ") + (" loading-icon ")} />
              </div>

              <div className="flex flex-row justify-between">

                <PageTitle
                  title={"Projects"}
                  docs={this.state.projects}
                  showButton={false}
                  ready={this.state.ready}
                />

                <div id="ProjectSearch" className="flex flex-column w-20-ns w-100">



                </div>

              </div>

              <section id="ProfileButtons">

                <div className="flex flex-row justify-between mb2">

                  <div className="flex flex-row">
                    {
                      this.state.buttons.map((button, index) => (
                        <button
                          title={button.title}
                          onClick={() => this.filter({ filter: this.state.filters[index], button: button })}
                          id="CV-button"
                          className={(this.state.activeButton.title === button.title ? " bg-white-60 " : "  ") + (" flex flex-column pa0 mr3 pointer ")}>

                          <div id="" className="flex flex-row ph0 pv0 items-center justify-center">

                            <span className="f5 fw4 black-60 ph3 pv2">{button.title}</span>

                          </div>

                        </button>
                      ))
                    }
                  </div>
                  <div className="flex flex-row">

                    <button
                      onClick={this.toggleDialog}
                      className={("br1 bs-b bg-black ph3 pv2 pointer bn relative w-100  ")} >

                      <span className="f5 fw6 white pv0 flex items-center justify-center">

                        {this.state.buttonLoading ? <Icon type="loading" className={' absolute right-0 f4 black-60 mr2'} /> : <Icon type="small-plus" className={(' f4 black-60 mr2 absolute right-0')} />} Create a Project</span>
                    </button>

                  </div>

                </div>

              </section>
{/* 
              <Projects
                projects={props.account.user.profile.projects}
                addRecentWorkProject={this.addRecentWorkProject}
              /> */}

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
                      <Skeleton active />
                    </div>
                  )}


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
                    this.state.dialogType === "bio" && <FormBio value={props.account.user.profile.bio} submitBio={this.submitBio} />
                  }
                  {
                    this.state.dialogType === "profile" && <FormProfile value={props.account.user.profile} submitProfile={this.submitProfile} />
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
                      skills={props.account.user.profile.additional.skills}
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
                        props.account.user.profile.cv.uploaded === true &&

                        <div className="flex flex-row mb3">
                          <a
                            href={props.account.user.profile.cv.file}
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

            </section>

          </TransitionLayout>

        )}

      </AccountConsumer>
    )
  }
}

export default MyProjects;
MyProjects.contextType = AccountContext.Consumer