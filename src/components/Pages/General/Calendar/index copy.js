// @flow
import React, { Component } from "react";
import AccountContext, {
  AccountConsumer
} from "../../../../utils/context/AccountContext.js";
import PageTitle from "../../../elements/layout/PageTitle_B.js";
import { Drawer, Skeleton, Popover } from "antd";
import Fn from "../../../../utils/fn/Fn.js";
import { Icon, Spinner, Dialog } from "@blueprintjs/core";
import moment from "moment";
import "moment-timezone";

import AddEvent from "../../../elements/forms/AddEvent.js";
import ViewEvent from "../../../a/ViewEvent/index.js";
import "./style.css";
import ProjectCalendar from "../../../a/ProjectCalendar/index.js";
import { app } from "../../../../utils/fn/Fn.js";
import EventDiscussion from "../../../a/Discussion/event.js";
var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;

class Calendar_ extends Component {
  constructor(props) {

    super(props)
    
    this.state = {
      hasError: false,
      dialogType: null,
      ready: true,
      events: [],
      activeEvent: {},
      isOpen: false,
      drawerOpen: false,
      insertEventLocation: null,
      x: 0,
      y: 0,
      newEvent: null,
      buttons: [],
      views: [],
      activeButton: null,
      activeView: null,
      userIsAdmin: false
    }

    this.toggleDialog = this.toggleDialog.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.moveEvent = this.moveEvent.bind(this);
    this.newEvent = this.newEvent.bind(this);
    this.setLocation = this.setLocation.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.getProjectEvents = this.getProjectEvents.bind(this);
    this.getOwnEvents = this.getOwnEvents.bind(this);
    this.reload = this.reload.bind(this);
    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.onSelectSlot = this.onSelectSlot.bind(this);
    this.getClickPosition = this.getClickPosition.bind(this);
    this.dateClick = this.dateClick.bind(this);
    this.reload = this.reload.bind(this);
    this.setView = this.setView.bind(this);
    this.setButtons = this.setButtons.bind(this);
    this.checkRoles = this.checkRoles.bind(this);
    this.eventImage = this.eventImage.bind(this);
    this.getDates = this.getDates.bind(this);
    this.setReady = this.setReady.bind(this)

    this.fullCalendar = React.createRef()

  }
  setReady() {
    this.setState({
      ready: true
    })
  }
  eventImage1() {
    let event = this.state.activeEvent.event;

    if (!event.hasOwnProperty("picture")) {
      return null;
    } else {
      return event.picture;
    }
  }
  eventImage(event) {

    if (event.type === "project") {
      // console.log('no picture', project)
      if(event.project.hasOwnProperty('media')) {
        return event.project.media.images[0].url
      }     
      else {
        return null
      }
    }
    if (event.type === "event") {
      // console.log('no picture', project)
      if(event.picture !== null) {
        return event.picture
      }     
      else {
        return null
      }
    }

    // project.picture
  }
  toggleDrawer() {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    });
  }
  checkRoles(project) {
    // const { project } = data
    let user = Fn.get("account").user.id;

    console.log(" ");
    console.log(" ");
    console.log("userid", user);
    console.log(" ");
    console.log("owner", project.owner);
    console.log(" ");
    console.log(" ");
    console.log(" ");

    let admins = project.admins;
    if (project.owner === user) {
      this.setState({
        userIsAdmin: true
      });
    } else {
      if (admins.includes(user)) {
        this.setState({
          userIsAdmin: true
        });
      } else {
        this.setState({
          userIsAdmin: false
        });
      }
    }
  }
  // onSelectSlot() {

  // }
  onSelectEvent(__) {
    const { event, day } = __;

    console.log("select event", __);

    console.log("select event", event.project);

    if (event.project !== null) {
      let project = event.project;

      this.checkRoles(project);
      let conversations = event.project.conversations;
    let activeConversation = conversations.filter(a => a.day === day)[0]
      .conversation;
      this.setState({
        eventType: "project",
        activeConversation: activeConversation
      });
    } else {
      let conversations = event.conversations;
    let activeConversation = conversations.filter(a => a.day === day)[0]
      .conversation;
      this.setState({
        eventType: "custom",
        activeConversation: activeConversation
      });
    }

    

    this.setState({
      activeEvent: __,
      
    });

    this.toggleDrawer();
  }
  setLocation(item) {
    console.log("setLocation", item);
    this.setState({ insertEventLocation: item });
  }

  moveEvent({ event, start, end, isAllDay: droppedOnAllDaySlot }) {
    // const { events } = this.state

    // const idx = events.indexOf(event)
    let allDay = event.allDay;

    // if (!event.allDay && droppedOnAllDaySlot) {
    //   allDay = true
    // } else if (event.allDay && !droppedOnAllDaySlot) {
    //   allDay = false
    // }

    const updatedEvent = { ...event, start, end, allDay };

    // const nextEvents = [...events]
    // nextEvents.splice(idx, 1, updatedEvent)

    // this.setState({
    //   events: nextEvents,
    // })

    alert(`${event.title} was dropped onto ${updatedEvent.start}`);
  }

  resizeEvent = ({ event, start, end }) => {
    // const { events } = this.state

    // const nextEvents = events.map(existingEvent => {
    //   return existingEvent.id == event.id
    //     ? { ...existingEvent, start, end }
    //     : existingEvent
    // })

    // this.setState({
    //   events: nextEvents,
    // })

    alert(`${event.title} was resized to ${start}-${end}`);
  };

  dateClick(e) {
    // console.log(e)
    alert(e);

    let calendarApi = this.fullCalendar.current.getApi();

    // console.log('calendar api', calendarApi)
  }
  newEvent(day) {
    // let idList = this.state.events.map(a => a.id)
    // let newId = Math.max(...idList) + 1
    // let hour = {
    //   id: newId,
    //   title: 'New Event',
    //   allDay: event.slots.length == 1,
    //   start: event.start,
    //   end: event.end,
    // }
    // this.setState({
    //   events: this.state.events.concat([hour]),
    // })

    console.log("new event ", day);

    let event = {
      day: day
    };
    let start = moment(event.start);
    start = start.set({
      hour: "10",
      minute: "00",
      second: "00"
    });
    let end = moment(event.end);
    end = end.set({
      hour: "17",
      minute: "00",
      second: "00"
    });
    // start.setTime() = moment('08:00:00', 'HH:mm:ss');

    // console.log('start', start, end)

    event.start = start;
    event.end = end;

    this.setState({
      newEvent: event,
      dialogType: "addEvent"
    });

    this.toggleDialog();
  }
  toggleDialog() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
      currentDate = moment(currentDate).add(1, "days");
    }
    return dateArray;
  }
  async addEvent(data) {
    let location = this.state.insertEventLocation;
    let title = data.title;
    let start = data.start;
    let end = data.end;
    let user = Fn.get("account").user;
    let days = this.getDates(start, end);
    console.log("days", days);
    let event = {
      title,
      description: "",
      location,
      start,
      end,
      user: user.id,
      conversation: null,
      files: [],
      people: [],
      days: days
    };

    await app.createEvent({ self: this, event }).then(res => {
      // this.context.updateAccount()
      console.log("createEvent res ", res);
      this.setState({ newEvent: null });
      this.reload()
      console.log('context', this.context)
      this.context.reloadCalendar()
      return res
    });

  }
  reload() {
    this.setState({
      ready: false
    })
    setTimeout(() => {
      this.setState({
        ready: true
      })
    },500)
    // this.getProjectEvents()
    // this.getOwnEvents()
  }
  getProjectEvents() {
    // console.log("Calendar mounted");

    let events = [];

    let events_ = Fn.get("subscribedProjects");

    for (let event of events_) {
      let e = {
        id: event.id,
        title: event.title,
        // allDay: true,
        start: moment(event.start_date)
          .tz("Africa/Johannesburg")
          .toDate(),
        end: moment(event.end_date)
          .tz("Africa/Johannesburg")
          .toDate()
      };

      events.push(e);
    }

    this.setState({ events });

    // console.log('events', events)
  }
  getOwnEvents() {
    // console.log("Calendar mounted");

    let events = this.state.events;

    let events_ =
      typeof Fn.get("account").user.profile.events !== "undefined"
        ? Fn.get("account").user.profile.events
        : [];

    for (let event of events_) {
      let e = {
        id: event.title + event.start,
        title: event.title,
        // allDay: true,
        // start: event.start,
        // end: event.end
        start: moment(event.start)
          .tz("Africa/Johannesburg")
          .toDate(),
        end: moment(event.end)
          .tz("Africa/Johannesburg")
          .toDate()
      };

      events.push(e);
    }

    Fn.store({ label: "calendarEvents", value: events });

    this.setState({ events, ready: true });

    console.log("events", events);

    //     this.setState({
    //   ready: true
    // })
  }
  onSelectSlot(slot) {
    console.log("select slot", slot);

    // alert(JSON.stringify(slot));
    // this.setState({
    //   x: slot.box.x,
    //   y: slot.box.y
    // })
  }
  getClickPosition(e) {
    console.log(e);
    // var xPosition = e.clientX;
    // var yPosition = e.clientY;

    // this.setState({
    //   x: e.clientX,
    //   y: e.clientY
    // })
  }

  reload() {
    // this.setState({
    //   ready: false,
    //   events: null
    // })
    // setTimeout(() => {
    //   this.getProjectEvents()
    //   this.getOwnEvents()
    // }, 500)
  }

  componentDidMount = () => {
    // this.reload()
    this.setButtons();

    document.querySelector("body").scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });

    // console.log('ref fullCalendar', this.fullCalendar)

    // let fullCalendar = document.getElementById('fullCalendar')
    // let calendar = new Calendar(this.fullCalendar, {
    //   // dateClick: function (day) {
    //   //   alert('a day has been clicked!', day);
    //   // },
    //   plugins: [dayGridPlugin, timeGridPlugin, listPlugin]
    // });

    // calendar.render()

    // calendar.on('dateClick', function (info) {
    //   console.log('clicked on ' + info.dateStr);
    // });

    // document.getElementById('Calendar').addEventListener("click", this.getClickPosition, false);
  };
  setView(config) {

    const { view, button } = config;

    this.setState({
      view: view,
      activeButton: button
    });

    Fn.store({ label: "projectView", value: view });
    Fn.store({ label: "activeButton", value: button });

    view === "discussion" &&
      setTimeout(
        () =>
          document.querySelector("body").scroll({
            top: 130,
            left: 0,
            behavior: "smooth"
          }),
        1000
      )

  }
  setButtons() {

    const buttons = [
      {
        title: "Overview",
        role: "general",
        function: () => this.setView({ filter: "Overview", button: 0 })
      },

      {
        title: "Discussion",
        role: "general",
        function: () => this.setView({ filter: "Discussion", button: 1 })
      },
      {
        title: "Files",
        role: "general",
        function: () => this.setView({ filter: "Files", button: 2 })
      },     
      {
        title: "People",
        role: "admin",
        function: () => this.setView({ filter: "People", button: 4 })
      },
      {
        title: "Checklist",
        role: "admin",
        function: () => this.setView({ filter: "Checklist", button: 5 })
      },
      // {
      //   title: "Rate Calculator",
      //   role: "admin",
      //   function: () => this.setView({ filter: "Rate Calculator", button: 6 })
      // }
    ];

    // const views = ["overview", "files", "discussion", "settings", "people"];
    const views = [
      {
        title: "Overview",
        role: "general"
      },
      {
        title: "Discussion",
        role: "general"
      },
      {
        title: "Files",
        role: "general"
      },
      {
        title: "People",
        role: "admin"
      },
      {
        title: "Checklist",
        role: "admin"
      }
    ];

    this.setState({
      buttons: buttons,
      activeButton: buttons[0],
      views: views,
      view: views[0]
    })
    
  }
  render() {
    // const Slot = () => (
    //   <div className="bg-red w3 h3">slot</div>
    // )

    // let components = {
    //   slot: Slot,
    //   event: Slot, // used by each view (Month, Day, Week)
    //   // toolbar: MyToolbar,
    //   // agenda: {
    //   //      event: MyAgendaEvent // with the agenda view use a different component to render events
    //   // }
    // }

    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <>
        <section id="Calendar" className={ ( this.props.dashboard ? "  " : " pa4 mt3" ) + (" w-100 mw9 center  pb6 " ) }>
          <section
            //

            id=""
            className="flex flex-column flex-row-ns- justify-between mb4  -ph4 "
          >
            {/* <div
            onClick={this.reload}
            className={(Fn.get('isMobile') ? " top-6vh " : "  ") + (" absolute top-0 right-0 pa4 pointer black-20- hover-black-40 flex flex-row items-center z-9 ")}>
            <span className="mr2 f5 fw4 black-30">{this.state.ready ? "reload" : "loading"}</span> {this.state.ready ? <Icon icon="refresh" iconSize={15} className="black-40" /> : <Spinner size={15} className="black-40" />}
          </div> */}

            <div className={ (this.props.dashboard ? " pt3 " : " ph4 pv4 ") + (" flex flex-row justify-between mb3 mb0-ns pb0 ")}>
              <PageTitle
                title={"Calendar"}
                docs={this.state.events}
                ready={this.state.ready}
              />
              <div className="flex flex-row justify-end w-100 mb0-ns mb3">
                <div
                  id="CreateProject"
                  className="flex flex-column items-start justify-end mb2 w-100-s"
                >
                  <button
                    onClick={() => this.toggleDialog()}
                    className={
                      "br1- round bs-b bg-black-20 ph4 pv2 pointer bn relative w-100-s "
                    }
                  >
                    <span className="f5 fw6 white pv0 flex items-center justify-center w-100-s">
                      {this.state.buttonLoading ? (
                        <Icon
                          icon="loading"
                          className={" absolute right-0 f4 black-60 mr2"}
                        />
                      ) : (
                        <Icon
                          icon={"small-plus"}
                          iconSize={20}
                          className={
                            " f4 black-60- white  absolute right-0 mr2"
                          }
                        />
                      )}{" "}
                      Add Event
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* <section id="ToolbarButtons" className="flex flex-column mb3 ph4">
              
            </section> */}

            <div className={ ( this.props.dashboard ? " " : "  ph0 ph4-ns " ) + (" flex flex-row flex-wrap justify-between br3 overflow-hidden -bg-white-50 " ) }>
              {/* <div className="flex flex-column w-20 bg-white- br b--black-05">
              {this.state.ready &&
                this.state.events.length > 0 &&
                this.state.events.map((item, index) => (
                  <EventItem
                    event={this.state.activeEvent}
                    selectEvent={this.selectEvent}
                    item={item}
                    key={index}
                    selfUserId={this.context.account.user.id}
                  />
                ))}
            </div> */}
              <div className="relative flex flex-column w-100 bg-white- pb5">
                {/* <div
                id="fullCalendar"
                ref={el => this.fullCalendar = el}
                className="flex flex-column "
                style={{ height: '700px' }}
              /> */}

                {/* <FullCalendar
                ref={this.fullCalendar}
                dateClick={this.dateClick}
                defaultView="dayGridMonth"
                plugins={[dayGridPlugin, interactionPlugin]}
                events={[
                  { title: 'event 1', date: '2019-04-01' },
                  { title: 'event 2', date: '2019-04-02' }
                ]}

              /> */}

                {/* {
                this.state.eventsReady &&
                <Calendarr
                  type={"discussion-large"}
                  conversation={this.state.activeConversation}
                  stream={this.state.activeStream}
                  load={this.props.load}
                />
              } */}

                {/* {

                <DragAndDropCalendar

                  selectable
                  localizer={localizer}
                  events={this.state.ready && this.state.events || []}
                  onEventDrop={this.moveEvent}
                  resizable
                  onEventResize={this.resizeEvent}
                  onSelectSlot={this.newEvent}
                  onDragStart={console.log}
                  defaultView={Views.MONTH}
                  defaultDate={moment().tz("Africa/Johannesburg").toDate()}
                  style={{ height: 1000 }}
                  onSelectEvent={this.onSelectEvent}
                />

              } */}


                <ProjectCalendar
                  onSelectEvent={this.onSelectEvent}
                  newEvent={this.newEvent}
                  onSelectSlot={this.onSelectSlot}
                  reload={this.reload}
                  setReady={this.setReady}
                  ready={this.state.ready}
                />

                {/* <div
                style={{ transform: 'translate3d(' + this.state.x + 'px,' + this.state.y + 'px,0)' }}

                className="left-0 top-0 absolute w3 h3 flex flex-column ">
                <Popover content={<div>
                  <p>Content</p>
                  <p>Content</p>
                </div>} title="Title" trigger="click">
                  <button>Click me</button>
                </Popover>

              </div> */}

                {/* <Calendar
                localizer={localizer}
                events={this.state.events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
              /> */}
              </div>
            </div>
          </section>
        </section>

        <Drawer
          title="Basic Drawer"
          placement="right"
          closable={true}
          onClose={this.toggleDrawer}
          visible={this.state.drawerOpen}
          width={"60vw"}
          height={"100vh"}
        >
          {this.state.drawerOpen && (
            <div className="pointer flex flex-column justify-start items-start bg-white h--100">
              <div className="flex flex-row overflow-hidden w-100">
                {this.state.buttons
                  .filter(b => b.role === "general")
                  .map((button, index) => (
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
                        " bl b--black-05 " +
                        (this.state.activeButton.title === button.title
                          ? " bg-black-20 "
                          : " bg-black-30 ") +
                        " flex flex-column pa0 mr3- pointer justify-center items-center flex-auto"
                      }
                    >
                      <div
                        id=""
                        className="flex flex-row ph0 pv0 items-center justify-center"
                      >
                        <span className="f5 fw6 black-40- white ph3 pv4 w-100 tc">
                          {button.title}
                        </span>
                      </div>
                    </button>
                  ))}
                {this.state.eventType === "project" &&
                  this.state.buttons
                    .filter(b => b.role === "admin" && this.state.userIsAdmin)
                    .map((button, index) => (
                      <button
                        title={button.title}
                        onClick={() =>
                          this.setView({
                            view: this.state.views[index + 3],
                            button: button
                          })
                        }
                        id={button.title}
                        className={
                          " bl b--black-05 " +
                          (this.state.activeButton.title === button.title
                            ? " bg-black-20 "
                            : " bg-black-30 ") +
                          " flex flex-column pa0 mr3- pointer justify-center items-center flex-auto"
                        }
                      >
                        <div
                          id=""
                          className="flex flex-row ph0 pv0 items-center justify-center"
                        >
                          <span className="f5 fw6 black-40- white ph3 pv4 w-100 tc ">
                            {button.title}
                          </span>
                        </div>
                      </button>
                    ))}
              </div>
              {this.state.view.title === "Discussion" && (
                <div className="flex flex-column justify-start items-start bg-white h-1-00 w-100 pa5">
                  <EventDiscussion
                    // invited={null}
                    conversation={this.state.activeConversation}
                    loadingAlign={"left"}
                    title={"Discussion"}
                    size={"full"}
                  />
                </div>
              )}

              {this.state.view.title === "Overview" && (
                <>
                  {/* <div
                    style={{
                      backgroundImage:
                        this.eventImage(this.state.activeEvent.event) === null
                          ? GeoPattern.generate(
                              this.state.activeEvent.event.title
                            ).toDataUrl()
                          : 'url("' + this.eventImage(this.state.activeEvent.event) + '")'
                    }}
                    className="flex flex-row overflow-hidden w-100 h5 cover bg-cover bg-center"
                  ></div> */}
                  <div className="flex flex-column justify-start items-start bg-white h-1-00 w-100 pa5">
                    <div className="w-100 flex flex-row justify-between items-center pb4">
                      <span className="flex f2 fw1 black-50">
                        {moment(this.state.activeEvent.day).format("DD MMMM")}
                      </span>
                      <span className="flex f3 fw6 black ml4">
                        {moment(this.state.activeEvent.day).format("YYYY")}
                      </span>
                    </div>
                    <h3 className="f3 fw6 black tc pv2 word-break-all">
                      {this.state.activeEvent.event.title}
                    </h3>
                    <div className="pointer flex flex-row justify-start items-start pv3 bg-white mb2">
                      <div className="flex flex-column f4 fw5 black mb3">
                        <span className="f4 fw3 black-50">Start</span>
                        {moment(this.state.activeEvent.event.start).format(
                          "DD MMMM YYYY"
                        )}
                      </div>

                      <div className="flex flex-column f4 fw5 black ml5">
                        <span className="f4 fw3 black-50">End</span>
                        {moment(this.state.activeEvent.event.end).format(
                          "DD MMMM YYYY"
                        )}
                      </div>
                    </div>{" "}
                  </div>
                </>
              )}
            </div>
          )}
        </Drawer>

        <Dialog
          className={"bp3-light"}
          icon="info-sign"
          onClose={this.toggleDialog}
          title={"Add Event"}
          {...this.state}
        >
          <AddEvent
            addEvent={this.addEvent}
            setLocation={this.setLocation}
            eventData={this.state.newEvent}
            // user={this.context.account.user}
          />
        </Dialog>
      </>
    );
  }
}

export default Calendar_;
Calendar_.contextType = AccountContext;
