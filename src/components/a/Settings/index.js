import React from 'react';
import { DatePicker, Drawer, message } from 'antd';
import moment from 'moment';
import AccountContext from '../../../utils/context/AccountContext.js';
import { app, Fn } from '../../../utils/fn/Fn.js';
import LocationSearchBar from '../../elements/display/forms/LocationSearchBar.js';
import PageTitle from '../../elements/layout/PageTitle_B.js';
import FormCrew from '../CrewFinder/Three.js';
// import { Icon } from '@blueprintjs/core';
import { Icon } from '@blueprintjs/core';
// import Lightbox from 'react-lightbox-component';
// import Lightbox from 'react-image-lightbox';
// import 'react-image-lightbox/style.css';
import { TH_LIST } from '@blueprintjs/icons/lib/esm/generated/iconNames';

class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      project: this.props.project,
      drawerOpen: false,
      ready: false,
      view: 'general',
      views: [],
      activeButton: {},
      buttons: [],
      projectType: this.props.project.type,
      startDate: this.props.project.start_date,
      endDate: this.props.project.end_date,
      location: this.props.project.location,
      loading: false,
      x: false,
      lightboxActive: false
    }

    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.openFilePanel = this.openFilePanel.bind(this)
    this.setView = this.setView.bind(this)
    this.setButtons = this.setButtons.bind(this)
    this.handleStartDateChange = this.handleStartDateChange.bind(this)
    this.handleEndDateChange = this.handleEndDateChange.bind(this)
    this.handleProjectTypeChange = this.handleProjectTypeChange.bind(this)
    this.updateProject = this.updateProject.bind(this)
    this.updateProjectLocation = this.updateProjectLocation.bind(this)
    // this.toggleLightbox = this.toggleLightbox.bind(this)

    this.projectTitle = React.createRef();
    this.projectDescription = React.createRef();

  }
  // toggleLightbox() {

  //   alert()

  //   this.setState({
  //     lightboxActive: !this.state.lightboxActive
  //   })
  // }
  updateProjectLocation(item) {
    console.log('updateProjectLocation', item)
    this.setState({
      location: item
    })
  }
  setButtons() {

    const buttons = [
      {
        title: 'General',
        function: () => this.setView({ filter: 'general', button: 0 })
      },
      {
        title: 'Archive',
        function: () => this.setView({ filter: 'archive', button: 0 })
      },

      // {
      //   title: 'Crew',
      //   function: () => this.setView({ filter: 'crew', button: 1 })
      // }
    ]

    const views = ['general', 'archive']

    this.setState({
      buttons: buttons,
      activeButton: buttons[0],
      views: views,
      view: views[0]
    })

  }
  setView(config) {

    const { view, button } = config;

    this.setState({
      view: view,
      activeButton: button
    })

    Fn.store({ label: 'projectSettingsView', value: view })
    Fn.store({ label: 'projectSettingsActiveButton', value: button })

    view === "discussion" && setTimeout(() => (
      document.querySelector('body').scroll({
        top: 130,
        left: 0,
        behavior: 'smooth'
      })
    ), 1000)

  }
  openFilePanel(file) {
    this.setState({
      activeFile: file
    })
    this.toggleDrawer()
  }

  toggleDrawer() {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    })
  }
  handleProjectTypeChange = (type) => {

    this.setState({
      projectType: type
    })
  }
  handleStartDateChange = (e) => {
    window.log.warn('start date', e.toString())
    this.setState({
      startDate: e.toString()
    })
  }
  handleEndDateChange = (e) => {
    window.log.warn('end date', e.toString())
    this.setState({
      endDate: e.toString()
    })
  }
  updateProject = async () => {
    message.config({
      top: '40vh',
      // duration: 1000,
      // maxCount: 3,
    });
    message.loading('Saving project..', 0);
    
    // Dismiss manually and asynchronously
    // setTimeout(hide, 2500);

    this.setState({
      loading: true,
      x: TextTrackCueList
    })
    const project = this.props.project;

    project.start_date = this.state.startDate;
    project.end_date = this.state.endDate;
    project.title = this.projectTitle.current.value;
    project.description = this.projectDescription.current.value;
    project.location = this.state.location;
    project.updatedAt = moment(new Date()).toString()


    let start = project.start_date;
    let end = project.end_date;
    let days = await Fn.getDates(start, end)
    project.days = days;

    console.log('days',days)


    console.log('Project update data ', project)

    let url = Fn.api('projects') + project.id;

    let config = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(project)
    }

    await fetch(url, config).then(res => {
      return res.json()
    }).then(async res => {

      console.log(res)

      await app.createProjectCalendar({ self: this, project }).then( async project => {
        await app.updateProjectConversations({ self: this, project }).then( async project => {
          this.setState({ project: res })

          Fn.store({ label: 'activeProject', value: res })
    
          setTimeout(() => {
    
            this.setState({
              loading: false,
              x: false
            })
    
            document.querySelector("body").scroll({
              top: 0,
              left: 0,
              behavior: "smooth"
            })
            message.destroy()
            message.success('Project Updated', 1000)
            setTimeout(() => {
              message.destroy()
            }, 1000)
    
          }, 1000)

        })
      })

      
      // this.props.updateProject({ project: res })
    })

  }
  componentDidMount = () => {

    this.setButtons()

    if (localStorage.projectSettingsView !== null) {
      let view = Fn.get('projectSettingsView');
      this.setState({
        view: view,
        // activeButton: activeButton
      })
    }
    if (localStorage.projectSettingsActiveButton !== null) {
      let activeButton = Fn.get('projectSettingsActiveButton');
      this.setState({
        // view: view,
        activeButton: activeButton
      })
    }

    setTimeout(() => {
      this.setState({
        ready: true,
        view: "general"
      })
    },1000)

  }

  static getDerivedStateFromError(error) {
    // getDerivedStateFromError -> Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
  }

  getDerivedStateFromProps = (nextProps, prevState) => {
  }

  getSnapshotBeforeUpdate = (prevProps, prevState) => {
  }

  componentDidUpdate = () => {
  }

  componentWillUnmount = () => {
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <>
        <section id="Discussion" className="flex flex-column w-100 pb4 pt0">
        <div className="flex flex-row mb4 ">
          <PageTitle
            title={"Settings"}
            docs={this.state.files}
            ready={this.state.ready}
          />
          </div>

          {this.state.ready &&

            <section id="ToolbarButtons" className="flex flex-column mb3">

              <div className="flex flex-row justify-between mb3">

                <div className="flex flex-row">

                  {
                    this.state.buttons.map((button, index) => (

                      <button
                        title={button.title}
                        onClick={() =>
                          this.setView({
                            view: this.state.views[index],
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
                          " flex flex-column pa0 mr3- pointer justify-center flex-auto"
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

                    ))
                  }

                </div>

              </div>

            </section>

          }

          <div className="w-60-ns- w-100 flex flex-row flex-wrap justify-between br3- -overflow-hidden">

            {
              this.state.x
                ? <Icon icon="loading" iconSize="15" className="absolute right-0 f4 black-60 mr3" /> : <Icon icon="swap-right" iconSize="15" className="f4 black-60 -white  absolute right-0 mr3" />
            }

{
  !this.state.ready && <div className="flex flex-column items-center justify-center pv4 w-100">
                      {/* <Spinner size={25} /> */}
                      <div className="sp sp-3balls"></div>
                    </div>
}
{
              this.state.ready && this.state.view === "archive" &&
              
              <div id="SettingsForm_General" className="flex flex-column mb6 w-100">

                <div className="flex flex-column mt0 w-100" id="">

                  <div className="form-row flex flex-column pb3 pt2">

                    <div className="form-row flex flex-column">

                      <div className="form-row flex flex-row pt4 items-center">

                        <label className="f5 fw6 black-20 pb3- tl mr4 w-30">Archive Project</label>

                        <input
                          ref={this.archived}
                          required={true}
                          type={'text'}
                          defaultValue={this.props.project.title}
                          className="flex flex-column ph4 pv3 bn br2 -round bg-black-05- white- black-50 f4 fw5 bs-a- w-100 bg-white" />

                      </div>
                      </div>
                      </div>
                      </div>
                      </div>
}
            {
              this.state.ready && this.state.view === "general" &&
              
              <div id="SettingsForm_General" className="flex flex-column mb6 w-100">

                <div className="flex flex-column mt0 w-100" id="">

                  <div className="form-row flex flex-column pb3 pt2">

                    <div className="form-row flex flex-column">

                      <div className="form-row flex flex-row pt4 items-center">

                        <label className="f5 fw6 black-20 pb3- tl mr4 w-30">Project Name</label>

                        <input
                          ref={this.projectTitle}
                          required={true}
                          type={'text'}
                          defaultValue={this.props.project.title}
                          className="flex flex-column ph4 pv3 bn br2 -round bg-black-05- white- black-50 f4 fw5 bs-a- w-100 bg-white" />

                      </div>

                      <div className="form-row flex flex-row pt4 items-center">

                        <label className="f5 fw6 black-20 pb3- tl mr4 w-30">Project Description</label>

                        <textarea
                          ref={this.projectDescription}
                          required={true}
                          type={'textarea'}
                          defaultValue={this.props.project.description}
                          rows={5}
                          className="flex flex-column ph4 pv3 bn br2 -round- bg-black-05- white- black-50 f4 fw5 bs-a- w-100 bg-white" />

                      </div>

                      <div className="form-row flex flex-row pt4 items-center">

                        <label className="f5 fw6 black-20 pb3- tl mr4 w-30">Project Location</label>

                        <LocationSearchBar
                          updateProjectLocation={this.updateProjectLocation}
                          location={this.state.location}
                          findLocation={this.findLocation}
                          fetchProjects={this.fetchProjects2}
                          defaultValue={typeof this.state.location.address !== "undefined" ? this.state.location.address.county + ", " + this.state.location.address.country : this.state.location}
                        />

                        {/* <input
                                            required={true}
                                            defaultValue={getGlobal().location.County}
                                            type={'text'} 
                                            className="flex flex-column ph3 pv3 bn br1 bg-white black-50 f4 fw5 bs-a" /> */}
                      </div>

                      <div className="form-row flex flex-row pt4 items-center">

                        <label className="f5 fw6 black-20 pb3- tl mr4 w-30">Project Type</label>

                        <select
                          className="flex flex-column ph4 pv3 bn br2 -round bg-black-05- white- black-50 f4 fw5 bs-a- w-100 bg-white"
                          // defaultValue="commercial"      
                          defaultValue={this.props.project.type}
                          onChange={(e) => this.handleProjectTypeChange(e)}>

                          <option value="" className="flex flex-column ph3 pv3 ">Select</option>
                          <option value="commercial" className="flex flex-column ph3 pv3 ">Commercial</option>
                          <option value="film" className="flex flex-column ph3 pv3 ">Film</option>
                          <option value="documentary" className="flex flex-column ph3 pv3 ">Documentary</option>

                        </select>

                      </div>

                      <div className="form-row flex flex-row justify-between w-100">

                        <div className=" form-row flex flex-column pt4 w-100 mr2">

                          <span className="f5 fw6 black-20 pb3">Start Date</span>

                          <DatePicker
                            minDate={new Date('01/01/1940')}
                            maxDate={new Date('01/01/2030')}
                            defaultValue={moment(this.props.project.start_date)}

                            onChange={this.handleStartDateChange}
                            className="flex flex-column ph4 pv0 bn br2 -round bg-black-05- white- black-50 f4 fw5 bs-a- w-100 bg-white "
                          />

                        </div>

                        <div className=" form-row flex flex-column pt4 w-100 ml2">

                          <span className="f5 fw6 black-20 pb3">Completion Date</span>

                          <DatePicker
                            minDate={new Date('01/01/1940')}
                            maxDate={new Date('01/01/2030')}
                            defaultValue={moment(this.props.project.end_date || 'Dec 31 2020')}
                            // defaultValue={typeof this.props.value.dob !== "undefined" && this.props.value.dob.length > 0 ? new Date(this.props.value.dob) : null} className={''} 
                            onChange={this.handleEndDateChange}
                            className="flex flex-column ph4 pv0 bn br2 -round bg-black-05- white- black-50 f4 fw5 bs-a- w-100 bg-white "
                          />

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                <div className="Buttons flex flex-row justify-between mt4">

                  <div className="flex flex-column -w-100">

                    <button
                      onClick={() => this.updateProject()}
                      className={("br1- round bs-b bg-black-20 ph5 pv2 pointer bn relative w-100  ")} >

                      <span className="relative f5 fw6 white pv1 flex items-center justify-center w-100">
                        {this.state.loading ? 'Saving' : 'Save'}
                      </span>

                    </button>

                  </div>

                </div>
              </div>

            }

            {
              this.context.isAuthenticated && this.state.view === "crew" &&
              <div id="SettingsForm_Crew" className="flex flex-column mb6 w-100">

                <FormCrew
                  project={this.props.project}
                />

              </div>

            }

          </div>

        </section>

        <Drawer
          title="Basic Drawer"
          placement="right"
          closable={true}
          onClose={this.toggleDrawer}
          visible={this.state.drawerOpen}
          width={'60vw'}
        >
          {
            this.state.drawerOpen &&
            <div className="pointer flex flex-column justify-end items-center pa3 bg-white ">
              <h3 className="f5 fw6 black tc pv2 ph3 word-break-all">{this.state.activeFile.file.originalname}</h3>
              <div
                onClick={this.toggleLightbox}
                className="pointer flex flex-column justify-end items-center pa3 bg-white br2 bs-b mb2 mr2">
                <div
                  style={{ backgroundImage: 'url("' + this.state.activeFile.url + '")' }}
                  className="h5 file-item bg-cover bg-center cover flex flex-column justify-end items-center pa3 bg-white br2 bs-b mb2 mr2">

                </div>
         

              </div>

            </div>
          }

        </Drawer>
      </>

    );
  }
}

export default Settings;
Settings.contextType = AccountContext;