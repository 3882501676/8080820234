import React from "react";
import { Link } from "react-router-dom";
import { DatePicker, Drawer, Popconfirm, message, Checkbox } from "antd";
import moment from "moment";
import AccountContext from "../../../utils/context/AccountContext.js";
// import Fn from '../../../utils/fn/Fn.js';
import LocationSearchBar from "../../elements/display/forms/LocationSearchBar.js";
import PageTitle from "../../elements/layout/PageTitle_B.js";
import FormCrew from "../CrewFinder/CrewFinder_People.js";

import { Icon, Dialog, Spinner } from "@blueprintjs/core";

import { TH_LIST } from "@blueprintjs/icons/lib/esm/generated/iconNames";
import FormInvite from "../../elements/forms/Invite.js";
import constants from "../../../utils/constants.js";
import { Fn, app } from "../../../utils/fn/Fn.js";
import Loading from "../../elements/Loading.js";

import Bio from "../_Elements/Bio/Bio.jsx";
import Network from "../_Elements/Network/Network.jsx";
import RecentWork from "../RecentWork/index.js";
import Transition from "../../Layouts/Transition.js";
import Person from "../Person";
import UserList from "../UserList/forRateSheet";
import UserListMinimal from "../UserList/minimal.js";

import "./style.css";

// import { motion, AnimatePresence } from 'framer-motion'
// // import { Motion, Frame, Scroll, useCycle } from "framer"

// const spring = {
//   type: "spring",
//   damping: 20,
//   stiffness: 300
// };

// const container = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: {
//       // delayChildren: 0.5,
//       staggerChildren: 0.5,
//       // delay: 1,
//     x: { type: "spring", stiffness: 100 },
//     default: { duration: 2 },
//     }

//   }
// }

// const item = {
//   hidden: { opacity: 0 },
//   show: { opacity: 1 }
// }

var saveInterval;

export default class RateCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      project: this.props.project,
      drawerOpen: false,
      innerDrawerOpen: false,
      ready: false,
      buttonsReady: true,
      view: null,
      views: [],
      activeButton: {},
      buttons: [],
      projectType: this.props.project.type,
      startDate: this.props.project.start_date,
      endDate: this.props.project.end_date,
      location: this.props.project.location,
      loading: false,
      x: false,
      lightboxActive: false,
      productionCrew: [],
      crew: [],
      crew_: [],
      searchLoading: false,
      activeCrewMember: null,
      inviteBusy: false,
      isDeleting: [],
      isDeletingStart: [],
      del: [],
      deleteConfirmation: [],
      drawerType: "search",
      days: 0,
      total: 0,
      months: [],
      crewDays_: [],
      crewRoster: [],
      delaySaveActive: false,
      delaySaves: []
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.toggleInnerDrawer = this.toggleInnerDrawer.bind(this);
    this.closeInnerDrawer = this.closeInnerDrawer.bind(this);
    this.userAvatar = this.userAvatar.bind(this);
    this.setRate = this.setRate.bind(this);
    this.setDays = this.setDays.bind(this);
    this.updateTotal = this.updateTotal.bind(this);
    this.checkDay = this.checkDay.bind(this)
    this.delaySave = this.delaySave.bind(this)
    this.calculateTotal = this.calculateTotal.bind(this)
    // this.inviteToProject = this.inviteToProject.bind(this)
    // this.toggleLightbox = this.toggleLightbox.bind(this)

    this.projectTitle = React.createRef();
    this.projectDescription = React.createRef();
    this.inviteByEmailAddress = React.createRef();
    window.self = this;
  } 

  async delaySave() {

    this.setState({
      delaySaveActive: true
    })

    
  }
  checkDay(__) {

    const { person, day, index_ } = __
  
    console.log('checkDay', __)

    let crewRoster = this.state.crewRoster;

    let index = crewRoster.findIndex(a => a.user === person );

    let item = crewRoster[index];
    
    let dayIndex = item.days.findIndex( a => a.day === day);

    item.days[dayIndex].selected = !item.days[dayIndex].selected;

    this.setState({
      crewRoster: crewRoster
    })

    // this.delaySave()
    this.setState({
      delaySaveActive: true
    })

    this.calculateTotal()
    // let days = item.days.filter(a => a.day === day)[0]

  }
  updateTotal() {
    let crew = this.state.crew;
    let total = 0;
    for (let item of crew) {
      let cost = item.rate * item.days;
      total = total + cost;
    }
    this.setState({
      total: total
    });
  }
  async setRate({ index, rate, user }) {
    console.log("set rate", rate);
    let crew = this.state.crew;
    crew[index].rate = rate;
    this.setState({
      crew: crew
    });
    console.log("updated crew", crew);
    
    this.state.crewRoster.filter(a => a.user === user)[0].rate = rate;
    
    let project = this.state.project;
    project.crewRoster = this.state.crewRoster;
    await app.updateProject({ self: this, project }).then(project => {

      // this.updateTotal();
      this.calculateTotal()

    })    
    


  }
  setDays({ index, days }) {
    // console.log("set days", days);

    // let crew = this.state.crew;

    // crew[index].days = days;

    // this.setState({
    //   crew: crew
    // });

    // console.log("updated crew", crew);
  }
  userAvatar(item) {
    let avatar =
      typeof item && item.profile && item.profile.picture !== "undefined"
        ? item.profile.picture
        : constants.placeholderImage;
    return avatar;
  }
  closeInnerDrawer() {
    this.setState({
      innerDrawerOpen: false
    });
  }
  toggleInnerDrawer(item) {
    this.setState({
      innerDrawerOpen: true,
      activeCrewMember: item
    });
    // this.state.activeCrewMember
  }
  toggleDrawer({ item, type }) {
    this.setState({
      drawerType: type,
      drawerOpen: !this.state.drawerOpen
      // activeCrewMember: item
    });
  }
  calculateTotal() {
    
    let total = 0;

    for(let item of this.state.crewRoster){
      let days = item.days.filter(a => a.selected).length;
      let rate = item.rate;
      let subtotal = ( days * rate );
      total = total + subtotal
    }
    this.setState({
      total: total
    })
  }
  componentWillUnmount() {
    clearInterval(saveInterval)
  }
  componentDidMount = async () => {
    // await app.fetchProductionCrew({ self: this, project: this.props.project });
    // let project = this.props.project;
    let project = Fn.get('activeProject');
    console.log("project", project);
    // let start = moment(project.start_date);
    // let end = moment(project.end_date);
    // let days = end.diff(start, "days", false);
    // let months_ = start.diff(end, "months", false);
    // // console.log("diff days", days);
    // // console.log("diff months", months_);

    // this.setState({
    //   days: days
    // });

    let crew = await app.fetchConfirmedCrew({ self: null, project: project });

    this.setState({
      crew: crew
    })
    // if (crew) {
    //   let crewWithRates = [];
    //   for (let item of crew) {
    //     // let rate = 0;/
    //     item.rate = 0;
    //     item.days = project.crewRoster.filter(a => a.user === item.id)[0].days.filter(a => a.selected).length;
    //     crewWithRates.push(item);
    //   }
    //   this.setState({
    //     crew: crew
    //   });
    // }

    this.setState({
      crewRoster: this.props.project.crewRoster,
      months: this.props.project.calendar,
      ready: true
    })

this.calculateTotal()
   
    setInterval(async() => {

      if(this.state.delaySaveActive) {

        let project = this.state.project;

        project.crewRoster = this.state.crewRoster;

        await app.updateProject({ self: this, project }).then( project => {

          message.loading("Saving");

          // console.log('saved')

          this.setState({

            delaySaveActive: false

          })

          this.setState({
            project: Fn.get('activeProject')
          })

        })

      }

    },4000)


  };

  static getDerivedStateFromError(error) {
    // getDerivedStateFromError -> Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
  }

  getDerivedStateFromProps = (nextProps, prevState) => {};

  getSnapshotBeforeUpdate = (prevProps, prevState) => {};

  componentDidUpdate = () => {};

  componentWillUnmount = () => {};

  render() {
    const { total } = this.state;

    // const

    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <>
        <section id="People" className="flex flex-column w-100 pb4 pt0">
          <div className="flex flex-row pv3 ">
            <PageTitle
              title={"Rate Calculator"}
              // docs={this.state.files}
              // ready={this.state.ready}
            />

            <div
              id="SearchInvite"
              className="w-100 flex flex-row items-end justify-start justify-end-ns"
            >
              <button
                onClick={this.openSearchDialog}
                className={
                  (Fn.get("isMobile") ? " w-100 mt3 " : "  ") +
                  " br1- round bs-b bg-black-20 ph4 pv2 pointer bn relative w-100-    "
                }
              >
                <span className="f5 fw6 white pv0 flex items-center justify-center pr2">
                  {this.state.buttonLoading ? (
                    <Icon
                      icon="loading"
                      className={" absolute right-0 f4 black-60 mr2"}
                    />
                  ) : (
                    <Icon
                      icon={"plus"}
                      iconSize={12}
                      className={" f4 black-60- white  absolute right-0 mr3"}
                    />
                  )}{" "}
                  Add Sheet
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-row pt3 bt b--black-05">
            <section id="" className="flex flex-column relative pb4">
              <h1 className="ma0 raleway f3 fw6  mb-0 flex flex-row items-center justify-start black">
                <span>Total</span>
              </h1>
            </section>

            <section id="" className="flex flex-column relative pb4 ml2">
              <h1 className="ma0 raleway f3 fw4  mb-0 flex flex-row items-center justify-start black">
                <span>{this.context.account.user.currency && this.context.account.user.currency.symbol}</span>
                <span>{total}</span>
              </h1>
            </section>
          </div>
          {!this.state.ready && (
            <div className="flex flex-column pv4 items-start">
              {/* <Spinner size={25} /> */}
              <div className="sp sp-3balls"></div>
            </div>
          )}
          <div className="w-100-ns w-100 flex flex-row flex-wrap justify-between br3- -overflow-hidden">
            {this.state.x ? (
              <Icon
                icon="loading"
                iconSize="15"
                className="absolute right-0 f4 black-60 mr3"
              />
            ) : (
              <Icon
                icon="swap-right"
                iconSize="15"
                className="f4 black-60 -white  absolute right-0 mr3"
              />
            )}

            {this.state.ready && (
              <>
                <div
                  id="ProductionCrewList"
                  className="flex flex-column mb3 w-100"
                >
                  <div className="flex flex-row f5 fw5 black-50 pb4 items-center">
                    Assigned Crew Members{" "}
                  </div>

                  <UserList
                    crew={this.state.crew}
                    items={this.state.crew}
                    invited={this.props.invited}
                    userAvatar={this.userAvatar}
                    confirmDelete={this.confirmDelete}
                    remove={this.remove}
                    state={this.state}
                    ready={this.state.ready}
                    toggleDrawer={this.toggleDrawer}
                    type={"production"}
                    setRate={this.setRate}
                    setDays={this.setDays}
                    days={this.state.days}
                    updateTotal={this.updateTotal}
                    context={this.context}
                  />
                </div>
              </>
            )}
          </div>
        </section>
        {this.state.ready && (
        <section id="People" className="flex flex-column w-100 pb4 pt0">
          <div className="flex flex-column pv3 ">
            {/* {
                this.props.project.days.map((day, index) => (

                  <div className="flex flex-row pv3- bb b--black-05 f5 fw7 black pr3 br">
                      {moment(day).format('Do')}
                  </div>
                ))
            
            } */}

            {this.state.months.map((month, index) => (
              <>
                <div className="flex flex-row pv3 bb b--black-05 f4 fw7 black pr3 br bg-white ph4 mt4 br2">
                  {month && month.name}
                </div>

                <div className="flex flex-row overflow-auto">
                  <div
                    style={{
                      width:
                        "calc( 200px + calc(60px * " + month.days.length + "))"
                    }}
                    className="flex flex-column br bl b--black-05"
                  >
                    {/* <UserListMinimal
                      crew={this.state.crew}
                      items={this.state.crew}
                      invited={this.props.invited}
                      userAvatar={this.userAvatar}
                      confirmDelete={this.confirmDelete}
                      remove={this.remove}
                      state={this.state}
                      ready={this.state.ready}
                      toggleDrawer={this.toggleDrawer}
                      type={"production"}
                      setRate={this.setRate}
                      setDays={this.setDays}
                      days={this.state.days}
                      updateTotal={this.updateTotal}
                    /> */}
                    <div
                      style={{}}
                      className="flex flex-row bb b--black-05 f5 fw6 black pr3- br- bb bg-white-50"
                    >
                      <div className="flex width5"></div>
                      {month &&
                        month.days.map((day, index_) => (
                          <div className="width3 flex flex-column pv3 f5 fw7 black ph3 bl b--black-05 flex-aut-o">
                            {moment(day).format("Do")}
                          </div>
                        ))}
                    </div>

                    {this.state.crew.map((person, index) => (
                      console.log('crewRoster filter ',this.state.crewRoster),
                      console.log('crewRoster filter ', person.id),
                      console.log('crewRoster filter ',this.state.crewRoster.filter(a => a.user === person.id)),
                      <div
                        className={
                          "  flex flex-row-ns flex-column flex-auto- bb b--black-05"
                        }
                      >
                        <div className="flex w5- width5 pl3 pv2">
                          <div
                            onClick={() =>
                              this.props.toggleDrawer({ item: person, type: "user" })
                            }
                            className="flex flex-column w-100= justify-center"
                          >
                            <div className="round p-a1 bg-white center">
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundImage:
                                    "url(" + this.userAvatar(person) + ")"
                                }}
                                className="center pointer round-  cover bg-center"
                              ></div>
                            </div>
                          </div>

                          <div
                            onClick={() =>
                              this.props.toggleDrawer({ item: person, type: "user" })
                            }
                            className="flex flex-column justify-center items-start pl2"
                          >
                            <div className="f4 flex flex-column items-start w-100 raleway ">
                              <span className="flex flex-row-ns flex-column -w-100 black f3 fw6">
                                <span className="flex flex-row items-center justify-start-ns justify-center black f5 fw6">
                                  {person.profile.name.first}{" "}
                                  {person.profile.name.last}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row">
                          {month &&
                            month.days.map((day, index_) => (
                              // console.log()
                              <div className="w3- width3 flex flex-column pv4- f5 fw7 black ph3- bl b--black-05 flex-auto-">
                                <div className="checklist-items flex flex-column flex-auto ">
                            
                                      <div
                                        onClick={() => this.checkDay({ person: person.id, day, index_ })}
                                        
                                        className={ (this.state.crewRoster.filter(a => a.user === person.id)[0].days.filter( a => a.day === day)[0].selected
                                        ? " bg-blue hover-lighten-10"
                                        : " bg-white-50 ") + (" trans-a pointer checklist-item justify-center items-center flex flex-row flex-auto ") }
                                      >
                                        {/* <span className="flex flex-column f4 fw6 black-70 pv3 ph4">
                                          {item.label}
                                        </span> */}

                                        <div
                                          className={
                                           
                                            " flex flex-column items-center justify-center ph3- pv3- w3-"
                                          }
                                        >
                                          {this.state.crewRoster.filter(a => a.user === person.id)[0].days.filter( a => a.day === day)[0].selected ? (
                                            <Icon
                                              icon={"tick"}
                                              className="white f4 fw6 "
                                            />
                                          ) : (
                                            <Icon
                                              icon={"ring"}
                                              className="black-20 f4 fw6 "
                                            />
                                          )}
                                        </div>
                                      </div>

                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ))}
          </div>
        </section>
        )}

        <Dialog
          className={"bp3-light"}
          // icon="info-sign"
          onClose={this.closeDialog}
          title={this.state.dialogTitle}
          {...this.state}
        >
          <FormInvite
            inviteBusy={this.state.inviteBusy}
            inviteByEmail={this.inviteByEmail}
            project={this.props.project}
            projectOwner={this.props.projectOwner}
            productionCrew={this.state.productionCrew}
          />
        </Dialog>

        <Drawer
          title={"Crew Search"}
          closable={true}
          onClose={this.toggleDrawer}
          visible={this.state.drawerOpen}
          width={"60vw"}
        >
          <>
            {this.state.drawerOpen && (
              <div className="pointer flex flex-column justify-end items-start pa3 bg-white ">
                {!this.state.searchLoading &&
                  this.state.drawerType === "search" && (
                    <Transition>
                      <h3 className="f5 fw4 black-50 tc pv2 ph3 word-break-all flex items-center">
                        <span className="flex flex-row ph2 pv0 round bg-black-20 white mr2 f5 fw6">
                          {!this.state.searchLoading &&
                            this.state.crew_[0] &&
                            this.state.crew_[0].users.length}
                        </span>{" "}
                        Users with role{" "}
                        <span className="fw6 white ml2 ph3 pv1 round bg-black-20">
                          {!this.state.searchLoading &&
                            this.state.crew_[0] &&
                            this.state.crew_[0].position}
                        </span>
                      </h3>
                    </Transition>
                  )}
                <div
                  // onClick={this.toggleLightbox}
                  className="pointer flex flex-column justify-end items-start pa3 bg-white w-100 flex-auto"
                >
                  <Drawer
                    title="Crew Detail"
                    placement="right"
                    closable={true}
                    onClose={this.closeInnerDrawer}
                    visible={this.state.innerDrawerOpen}
                    width={"40vw"}
                  >
                    <div
                      // onClick={this.toggleLightbox}
                      className="pointer flex flex-column justify-end items-start pa0 bg-white w-100 flex-auto"
                    >
                      {this.state.innerDrawerOpen && (
                        <div
                          // onClick={this.toggleLightbox}
                          className="pointer flex flex-column justify-end items-start pa0 bg-white"
                        >
                          {!this.state.searchLoading &&
                            this.state.activeCrewMember !== null && (
                              <>
                                <div
                                  // to={"/user/" + item.id}
                                  // onClick={this.toggleInnerDrawer}
                                  id="ProjectOwner"
                                  className="flex flex-column w-100 pa0"
                                >
                                  <div className="pa4 flex flex-row-ns flex-column w-100">
                                    <div className="flex flex-column w-100=">
                                      <div className="round pa1 bg-white center">
                                        <div
                                          style={{
                                            width: "90px",
                                            height: "90px",
                                            backgroundImage:
                                              "url(" +
                                              this.userAvatar(
                                                this.state.activeCrewMember
                                              ) +
                                              ")"
                                          }}
                                          className="center pointer round  cover bg-center"
                                        ></div>
                                      </div>
                                    </div>

                                    <div className="flex flex-column justify-center w-100 ph3">
                                      <div className="f4 flex flex-column items-center w-100 raleway ">
                                        <span className="flex flex-row-ns flex-column w-100 black f3 fw6">
                                          <span className="flex flex-row items-center justify-start-ns justify-center black-70 f5 fw6">
                                            {
                                              this.state.activeCrewMember
                                                .profile.name.first
                                            }{" "}
                                            {
                                              this.state.activeCrewMember
                                                .profile.name.last
                                            }
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <section id="ProfileButtons">
                                  <div className="flex flex-row mb2-ns w-100 bt b--black-05 ">
                                    <button
                                      title="View or upload CV"
                                      id="CV-button"
                                      className="db relative w-100 pa3 ph4 pv3 br1- bg-white bg-green-"
                                    >
                                      <div id="" className="db relative w-100">
                                        <span className="f5 fw6 black-60 -white ph3-">
                                          Cirriculum Vitae{" "}
                                        </span>
                                      </div>
                                    </button>
                                    <button
                                      title="View or upload CV"
                                      id="CV-button"
                                      className="db relative w-100 pa3 ph4 pv3 br1- bg-white "
                                      // style={{ background: "#e8e8ec" }}
                                    >
                                      <div id="" className="db relative w-100">
                                        <span className="f6 fw6 black-60 -white ph3-">
                                          Add to Network
                                        </span>
                                      </div>
                                    </button>
                                    <button
                                      title="View or upload CV"
                                      id="CV-button"
                                      className="db relative w-100 pa3 ph4 pv3 br1- bg-white bl b--white-20 bw1"
                                      // style={{ background: "#e8e8ec" }}
                                    >
                                      <div id="" className="db relative w-100">
                                        <span className="f6 fw6 black-60 -white ph3-">
                                          Send Message
                                        </span>
                                      </div>
                                    </button>
                                  </div>
                                </section>
                                <div className="flex flex-row -nsflex-column w-100 black-60 raleway flex-wrap items-center justify-start-ns justify-between pa4 bt b--black-05">
                                  <div className="flex flex-column w--100 pb1-ns pb2 mr3">
                                    <span className="flex-column flex f6 fw4 black-40 items-start">
                                      <span
                                        className="flex 
 mb3"
                                      >
                                        Age
                                      </span>
                                      <span className="flex items-center justify-center f6 fw6 -ml3-ns black-50- white ph2 pv1 ba b--black-05 br1 -round bw1- bg-white-20- bg-black -ts-a tc ml2-">
                                        {moment().diff(
                                          this.state.activeCrewMember.profile
                                            .dob,
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
                                      <span className="flex items-center justify-center f6 fw6 -ml3-ns black-50- white ph2 pv1 ba b--black-05 br1 -round bw1- bg-white-20- bg-black -ts-a tc ml2-">
                                        {(this.state.activeCrewMember.profile
                                          .gender &&
                                          this.state.activeCrewMember.profile
                                            .gender) ||
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
                                        {/* {this.userLocation()} */}
                                      </span>
                                    </span>
                                  </div>
                                </div>

                                <Bio
                                  user={this.state.activeCrewMember}
                                  editSkills={null}
                                  editBio={null}
                                  canEdit={false}
                                />
                                <RecentWork
                                  type={"user"}
                                  user={this.state.activeCrewMember}
                                  // projects={this.state.user.profile.projects}
                                  // addRecentWorkProject={this.addRecentWorkProject}
                                />
                              </>
                            )}
                        </div>
                      )}
                    </div>
                  </Drawer>

                  {this.state.searchLoading && (
                    <div className="flex flex-column pv3">
                      {/* <Spinner size={25} /> */}
                      <div className="sp sp-3balls"></div>
                    </div>
                  )}
                  {/* <div className="flex flex-row-ns flex-column w-100 f5 fw6 black pb3">
                {
                  
                }
                </div> */}
                  {!this.state.searchLoading &&
                    this.state.drawerType === "search" && (
                      <Transition>
                        {this.state.crew_[0].users.map(
                          (item, index) => (
                            console.log("item", item),
                            (
                              <Person
                                inviteToProject={this.inviteToProject}
                                toggleInnerDrawer={this.toggleInnerDrawer}
                                userAvatar={this.userAvatar}
                                item={item}
                                project={this.props.project}
                                position={this.state.crew_[0].position}
                              />
                            )
                          )
                        )}
                      </Transition>
                    )}
                </div>
              </div>
            )}

            {this.state.drawerType === "search" && (
              <div className="form-row flex flex-column ph3 pv3 bb b--black-05">
                <div className="form-row flex flex-column">
                  <div className="flex flex-row f5 fw4 black-50 pb3">
                    Invite user by email for position{" "}
                    <span className="fw6 black ml2">
                      {!this.state.searchLoading &&
                        this.state.crew_[0] &&
                        this.state.crew_[0].position}
                    </span>
                  </div>

                  {/* <label className="f6 fw5 black-50 pb2">Email address</label> */}
                  <div className="flex flex-row ">
                    <input
                      ref={this.inviteByEmailAddress}
                      type={"text"}
                      placeholder={"Enter email address"}
                      className="flex flex-column ph3 pv3 bn br1 bg-white black-50 f4 fw5 bs-a w-100"
                    />

                    <div class="flex flex-column w-20 bl b--black-05">
                      <button
                        onClick={this.inviteByEmail}
                        class="pointer flex h-100 items-center justify-center f6 bg-white bn f5 fw6 black-50 "
                      >
                        Invite
                        {this.state.inviteBusy ? (
                          <div className="flex flex-column items-start ml2">
                            <Spinner size={15} />
                          </div>
                        ) : (
                          <Icon icon="arrow-right" className="ml2"></Icon>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>{" "}
        </Drawer>
      </>
    );
  }
}

// export default People;
RateCalculator.contextType = AccountContext;
