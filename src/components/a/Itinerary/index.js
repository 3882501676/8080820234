import React from "react";
import { Link } from "react-router-dom";
import { DatePicker, Drawer, Popconfirm, message, Checkbox } from "antd";
import Moment from "moment";
import { extendMoment } from 'moment-range';
 
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
import AddItineraryItem from '../../elements/forms/AddItineraryItem.js';
import "./style.css";
const moment = extendMoment(Moment);

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

export default class Itinerary extends React.Component {
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
      delaySaves: [],
      items: [{},{},{}],
      timeSlots: [],
      isOpen: false
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
    this.handleDoubleClick = this.handleDoubleClick.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.setLocation = this.setLocation.bind(this)
    // this.inviteToProject = this.inviteToProject.bind(this)
    // this.toggleLightbox = this.toggleLightbox.bind(this)

    this.projectTitle = React.createRef();
    this.projectDescription = React.createRef();
    this.inviteByEmailAddress = React.createRef();
    window.self = this;
  } 
  setLocation(item) {
    console.log("setLocation", item);
    this.setState({ insertEventLocation: item });
  }
  handleDoubleClick(__) {
    const { monthIndex,itenIndex,slotIndex} = __

    // let monthIndex = m.monthIndex;
    // let itineraryIndex = i.itenIndex;
    // let slotIndex = s.slotIndex;

    let months = this.state.months;
    months[monthIndex].itinerary[itenIndex].slots[slotIndex] = true;
    
    this.setState({
      months: months
    })

  }
  handleClick(__) {
    const { monthIndex,itenIndex,slotIndex} = __

    // let monthIndex = m.monthIndex;
    // let itineraryIndex = i.itenIndex;
    // let slotIndex = s.slotIndex;
    let timeSlot = this.state.timeSlots[slotIndex];
    let timeSlot_ = moment(timeSlot).format('HH:mm:ss')
    let months = this.state.months;
    months[monthIndex].itinerary[itenIndex].slots[slotIndex] = true;
    months[monthIndex].itinerary[itenIndex].items.push(timeSlot)

    console.log('timeSlot',timeSlot_)

    this.setState({
      months: months,
      isOpen: true,
      selectedTime: timeSlot_
    })
  }
createTimeSlots() {
  var range = moment.range(new Date().setHours(4,0,0,0), new Date().setHours(28,0,0,0));
 
var hours = Array.from(range.by('hour', { excludeEnd: true }));
// hours.length == 5 // true
// let slots = hours.map(m => m.format('HH:mm'))
this.setState({
  timeSlots: hours
})



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
this.createTimeSlots()
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
              title={this.props.title}
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

          
          {!this.state.ready && (
            <div className="flex flex-column pv4 items-center justify-center w-100">
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

           
          </div>
        </section>
        {this.state.ready && (
        <section id="People" className="flex flex-column w-100 pb4 pt0">
         
          <div 
        
          className="flex flex-column pv3 ">


            {this.state.months.map((month, monthIndex) => (
              <>
                <div className="flex flex-row pv3 bb b--black-05 f4 fw7 black pr3 br bg-white ph4 mt4 br2">
                  {month && month.name}
                </div>
                <div 
                //  style={{ width: '2000px'}} 
                className="flex flex-column overflow-auto">
                <div 
                style={{ width: "2000px"}}
                className="flex flex-row bb b--black-05">
                  <div className="flex " style={{ width: '80px' }} />
                {this.state.timeSlots.map((slot, slotIndex) => (
                   <div 
                   style={{ width: '80px'}}
                   className="width3- flex flex-column pv3 f5 fw7 black ph3 bl b--black-05 flex-aut-o">
                   {moment(slot).format("hh:mm")}
                   </div>
                ))}
                </div>

                <div className="flex flex-row overflow-auto">
                  <div
                    style={{
                      // width:
                      //   "calc( 200px + calc(60px * " + month.days.length + "))"
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
                      className="flex flex-column bb b--black-05 f5 fw6 black pr3- br- bb bg-white-50"
                    >


                
                      {month &&
                        month.itinerary.map((iten, itenIndex) => (
                          <div className="flex flex-row">
                          <div 
                          style={{width: "80px"}}
                          className="width3- flex flex-column pv3 f5 fw7 black ph3 bl b--black-05 flex-aut-o tc bb">
                            {moment(iten.day).format("Do")}

                            
</div>
<div 
                // style={{ width: "2000px"}}
                className="flex flex-row bb b--black-05">
                  {/* <div className="flex " style={{ width: '80px' }} /> */}
                {iten.slots && iten.slots.map((slot, slotIndex) => (
                   <div 
                  //  onDoubleClick={ () => this.handleDoubleClick({ monthIndex, itenIndex, slotIndex }) }
                   onClick={ () => this.handleClick({ monthIndex, itenIndex, slotIndex }) }
                   style={{ width: '80px'}}
                   className={ ( this.state.months[monthIndex].itinerary[itenIndex].slots[slotIndex] ? " bg-light-blue " : " -bg-light-blue " ) + (" hover-bg-blue pointer width3- flex flex-column pv3 f5 fw7 black ph3 bl b--black-05 flex-aut-o " )}>
                   {/* {moment(slot).format("hh:mm")} */}
                   { this.state.months[monthIndex].itinerary[itenIndex].slots[slotIndex] && moment(iten.items[slotIndex]).format('HH') }
                   </div>
                ))}
                </div>
                            {/* <div className="flex flex-row">
                            
                            {
                          iten.items.map((item, index) => (
                            <div className="width3 flex flex-column pv3 f5 fw7 black ph3 bl b--black-05 flex-aut-o">
                              { item && moment(item).format('HH')}                            
                          </div>
                          )) 
                        }
                            </div> */}
                          </div>
                        ))}

                        
                    </div>

                    
                  </div>
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
          onClose={() => { this.setState({ isOpen: false})}}
          title={this.state.dialogTitle}
          {...this.state}
        >
          <AddItineraryItem
           addEvent={this.addEvent}
           setLocation={this.setLocation}
           eventData={this.state.newEvent}
           startTime={this.state.selectedTime}
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
                          
                        </div>
                      )}
                    </div>
                  </Drawer>

                  {this.state.searchLoading && (
                    <div className="flex flex-column pv3 items-center justify-center w-100">
                      {/* <Spinner size={25} /> */}
                      <div className="sp sp-3balls"></div>
                    </div>
                  )}
                  {/* <div className="flex flex-row-ns flex-column w-100 f5 fw6 black pb3">
                {
                  
                }
                </div> */}
                  
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
Itinerary.contextType = AccountContext;
