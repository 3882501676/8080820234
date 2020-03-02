// @flow
import React, { Component } from "react";
import AccountContext, {
  AccountConsumer
} from "../../../../utils/context/AccountContext.js";

import PageTitle from "../../../elements/layout/PageTitle_B.js";
import { Drawer, Skeleton, Popover, Checkbox } from "antd";
import Fn from "../../../../utils/fn/Fn.js";
import { Icon, Spinner, Dialog } from "@blueprintjs/core";
import { TimePicker } from "@blueprintjs/datetime";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import moment from "moment";
import "moment-timezone";

import AddEvent from "../../../elements/forms/AddEvent.js";
import ViewEvent from "../../../a/ViewEvent/index.js";
import "./style.css";
import ProjectCalendar from "../../../a/ProjectCalendar/index.js";
import { app, ui } from "../../../../utils/fn/Fn.js";
import EventDiscussion from "../../../a/Discussion/event.js";
import Files from "../../../a/Files/index.js";
import Schedule from "../../../a/Schedule/index.js";
import Loading from '../../../elements/Loading.js';
// import __ from '../../../../../../../../NPM/util/__';

var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;

class Calendar_ extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      dialogType: null,
      ready: false,
      events: [],
      activeEvent: {
        day: new Date()
      },
      isOpen: false,
      drawerOpen: false,
      innerDrawerOpen: false,
      innerDrawerOpen2: false,
      insertEventLocation: null,
      x: 0,
      y: 0,
      newEvent: null,
      buttons: [],
      views: [],
      activeButton: null,
      activeView: null,
      userIsAdmin: false,
      checked: [],
      connections: [],
      group: [],
      startTime: null,
      endTime: null,
      buttonLoading: false,
      calendarReady: true,
      activeConversationId: null,
      calendarRefresh: false
    };

    this.toggleDialog = this.toggleDialog.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.toggleInnerDrawer = this.toggleInnerDrawer.bind(this);
    this.moveEvent = this.moveEvent.bind(this);
    this.newEvent = this.newEvent.bind(this);
    this.setLocation = this.setLocation.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.getProjectEvents = this.getProjectEvents.bind(this);
    this.getOwnEvents = this.getOwnEvents.bind(this);
    this.reload = this.reload.bind(this);
    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.onSelectEvent2 = this.onSelectEvent2.bind(this);
    this.onSelectSlot = this.onSelectSlot.bind(this);
    this.getClickPosition = this.getClickPosition.bind(this);
    this.dateClick = this.dateClick.bind(this);
    this.reload = this.reload.bind(this);
    this.setView = this.setView.bind(this);
    this.setButtons = this.setButtons.bind(this);
    this.checkRoles = this.checkRoles.bind(this);
    this.eventImage = this.eventImage.bind(this);
    this.getDates = this.getDates.bind(this);
    this.setReady = this.setReady.bind(this);
    this.timeOnChange = this.timeOnChange.bind(this);
    this.insertScheduleItem = this.insertScheduleItem.bind(this);
    this.addUserToEvent = this.addUserToEvent.bind(this);
    this.fetchConnections = this.fetchConnections.bind(this);
    this.insertScheduleItem = this.insertScheduleItem.bind(this);
    this.insertScheduleItem2 = this.insertScheduleItem2.bind(this);
    this.setDrawerData = this.setDrawerData.bind(this);
    this.projectImage = this.projectImage.bind(this);

    this.fullCalendar = React.createRef();
    this.scheduleTitle = React.createRef();
    this.scheduleDescription = React.createRef();
    this.scheduleLocation = React.createRef();
    this.scheduleForm = React.createRef();
    this.projectCalendar = React.createRef()

  }
  setDrawerData(__) {
    const { day, events } = __;
    console.log("events per day", day, events);
    this.setState({
      drawerType: "allevents",
      allevents: events,
      day: day
    });
    this.toggleDrawer();
  }
  projectImage(event) {
    if (event.type === "project") {
      // console.log('no picture', project)
      if (event.project.hasOwnProperty("media")) {
        return event.project.media.images[0].url;
      } else {
        return null;
      }
    }
    if (event.type === "event") {
      // console.log('no picture', project)
      if (event.picture !== null) {
        return event.picture;
      } else {
        return null;
      }
    }

    // project.picture
  }
  async fetchConnections() {
    let connections = Fn.get("account").user.profile.connections;
    await Fn.fetchConnections({ self: this, connections });
  }
  async insertScheduleItem2() {
    console.log("insert schedule item");

    this.setState({
      buttonLoading: true
    });

    console.log("form", this.scheduleForm);

    console.log("Event type", this.state.activeEvent);

    let type = this.state.activeEvent.event.type;

    let scheduleItem = {
      day: this.state.activeEvent.day,
      time: {
        start: this.state.startTime,
        end: this.state.endTime
      },
      title: this.scheduleTitle.current.value,
      description: this.scheduleDescription.current.value,
      location: this.scheduleLocation.current.value,
      people: this.state.group.map(a => a.id)
    };

    console.log("schedule item", scheduleItem);

    if (type === "event") {
      let event = this.state.activeEvent.event;

      if (!event.hasOwnProperty("schedule")) {
        event.schedule = [];
      }
      if (event.schedule === "undefined") {
        event.schedule = [];
      }

      event.schedule.push(scheduleItem);

      await app.updateEvent({ self: this, event }).then(event => {
        this.reload();
        this.setState({
          buttonLoading: false,
          innerDrawerOpen: false
        });
      });
    }

    if (type === "project") {
      let project = this.state.activeEvent.event.project;

      if (!project.hasOwnProperty("schedule")) {
        project.schedule = [];
      }

      project.schedule.push(scheduleItem);

      await app.updateProject({ self: this, project }).then(project => {
        this.reload();
        this.setState({
          buttonLoading: false,
          innerDrawerOpen: false
        });
      });
    }
  }
  addUserToEvent(config) {
    const { user, index } = config;
    let checked = this.state.checked;
    checked[index] = !this.state.checked[index];
    let group = this.state.group;
    group.push(user);
    this.setState({
      checked: checked,
      group: group
    });
  }
  async insertScheduleItem() {
    // let event = /
    // this.toggleInnerDrawer()
    // this.scheduleForm.submit(0)
  }
  timeOnChange(e) {
    // if()
    console.log("time", moment(e.e).format("HH:mm"));

    if (e.type === "start") {
      this.setState({
        startTime: e.e
      });
    }
    if (e.type === "end") {
      this.setState({
        endTime: e.e
      });
    }
  }
  setReady() {
    this.setState({
      ready: true
    });
  }
  insertScheduleItem() {}
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
      if (event.project.hasOwnProperty("media")) {
        return event.project.media.images[0].url;
      } else {
        return null;
      }
    }
    if (event.type === "event") {
      // console.log('no picture', project)
      if (event.picture !== null) {
        return event.picture;
      } else {
        return null;
      }
    }

    // project.picture
  }
  toggleDrawer() {
    this.setState({
      buttonLoading: false,
      drawerOpen: !this.state.drawerOpen
    });
  }
  toggleInnerDrawer() {
    this.setState({
      innerDrawerOpen: !this.state.innerDrawerOpen
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

    console.log("onSelectEvent", __);

    const { e, data } = __;
    const { event, day } = data;

    e.stopPropagation();

    // console.log("select event", __);

    console.log("select event", event);
    this.setState({
      drawerType: "event"
    });

    // if (event.project !== null) {
    if (event.type === "project" ) {
      let project = event.project;

      this.checkRoles(project);
      let conversations = event.project.conversations;
      let activeConversationId = conversations.filter(a => a.day === day)[0]
        .conversation;
      this.setState({
        eventType: "project",
        activeConversationId: activeConversationId
      });
    } 
    
    if (event.type === "event" ) {

      let conversations = event.conversations;

      // let activeConversationId = conversations.filter(a => a.day === day)[0]
      //   .conversation;
        let activeConversationId = event.conversationId;

      this.setState({
        eventType: "custom",
        activeConversationId: activeConversationId
      });

    }
    
    // else {
    //   let conversations = event.conversations;
    //   let activeConversationId = conversations.filter(a => a.day === day)[0]
    //     .conversation;
    //   this.setState({
    //     eventType: "custom",
    //     activeConversationId: activeConversationId
    //   });
    // }

    this.setState({
      activeEvent: data
    });

    this.toggleDrawer();
  }
  onSelectEvent2(__) {
    // const { e, data } = __;
    console.log("onSelectEvent", __);
    const { item, index, day } = __;
    const event = item;
    // e.stopPropagation();

    // console.log("select event", __);

    // console.log("select event", event);
    this.setState({
      drawerType: "event"
    });

    if (event.type === "project") {
      let project = event.project;

      this.checkRoles(project);
      let conversations = event.project.conversations;
      let activeConversationId = conversations.filter(a => a.day === day)[0]
        .conversationId;
      this.setState({
        eventType: "project",
        activeConversationId: activeConversationId
      });
    } else {
      let conversations = event.conversations;
      let activeConversationId = conversations.filter(a => a.day === day)[0]
        .conversationId;
      this.setState({
        eventType: "custom",
        activeConversationId: activeConversationId
      });
    }

    this.setState({
      activeEvent: { event: event, day: day }
    });

    // this.toggleDrawer();
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
      conversationId: null,
      files: [],
      people: [],
      days: days
    };

    await app.createEvent({ self: this, event }).then(res => {
      // this.context.updateAccount()
      console.log("createEvent res ", res);

      this.setState({ newEvent: null });
      // this.reload();
      console.log("context", this.context);
      this.projectCalendar.current.start()
      // this.setState({
      //   calendarReady: false
      // });
      // setTimeout(() => {
      //   this.setState({
      //     calendarReady: true
      //   });
      // }, 200);
      console.log('calendar context ',this.context)
      // this.context.reloadCalendar();
      // this.reload()
      // this.refreshCalendar()
      // this.setState({
      //   calendarRefresh: true
      // })
      // setTimeout(() => {
      //   this.setState({
      //     calendarRefresh: false
      //   })
      // }, 500)

      return res;
    });
  }
  reload() {
    this.setState({
      ready: false
    });
    setTimeout(() => {
      this.setState({
        ready: true
      });
    }, 500);
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
    // console.log('hisotry ** ',this.props.history)
    if(this.props.history && this.props.history.location && this.props.history.location.pathname && this.props.history.location.pathname === "/calendar") {

const buttons = [
  {
    label: 'Add Event',
    action: () => this.toggleDialog()
  },
]

    this.context.setPage({ title: "Calendar", subtitle: "...", buttons: buttons })

    }


    this.setButtons();

    document.querySelector("body").scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
    this.fetchConnections();
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
      );
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
      }
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
    });
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
        <section
          id="Calendar"
          className={
            (this.props.dashboard
              ? "  "
              : this.props.profile
              ? " mt3- "
              : " pa4- -mt3") + " w-100 mw9- -center  pb6 "
          }
        >
          <section
            id=""
            className="flex flex-column flex-row-ns- justify-between mb4  -ph4 "
          >
            {/* <div
            onClick={this.reload}
            className={(Fn.get('isMobile') ? " top-6vh " : "  ") + (" absolute top-0 right-0 pa4 pointer black-20- hover-black-40 flex flex-row items-center z-9 ")}>
            <span className="mr2 f5 fw4 black-30">{this.state.ready ? "reload" : "loading"}</span> {this.state.ready ? <Icon icon="refresh" iconSize={15} className="black-40" /> : <Spinner size={15} className="black-40" />}
          </div> */}

            {/* <div
              className={
                (this.props.dashboard
                  ? " pt3 "
                  : this.props.profile
                  ? " pt0 "
                  : " ph-4 pv4 ") +
                " flex flex-row justify-between mb3 mb0-ns pb0 "
              }
            > */}
              {/* <PageTitle
                title={"Calendar"}
                // docs={this.state.events}
                // ready={this.state.ready}
              /> */}
              
              {/* {this.props.profile && (
              )} */}
              {/* <div className="flex flex-row justify-end w-100 mb0-ns mb3">
                <div
                  id="CreateProject"
                  className="flex flex-column items-start justify-end mb2 w-100-s"
                >
                  <button
                    onClick={() => this.toggleDialog()}
                    className={
                      "br1- round bs-b bg-black-20 hover-bg-black-10 ph4 pv2 pointer bn relative w-100-s "
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
              </div> */}
            {/* </div> */}

            <div
              className={
                (this.props.dashboard
                  ? " "
                  : this.props.profile
                  ? ""
                  : "  ph0 ph-4-ns ") +
                " flex flex-row flex-wrap justify-between br3- overflow-hidden -bg-white-50 "
              }
            >
              <div className="relative flex flex-column w-100 bg-white- pb5">
                {/* {this.state.calendarReady && ( */}
                  <ProjectCalendar
                  ref={this.projectCalendar}
                    onSelectEvent={this.onSelectEvent}
                    newEvent={this.newEvent}
                    onSelectSlot={this.onSelectSlot}
                    reload={this.reload}
                    setReady={this.setReady}
                    ready={this.state.calendarReady}
                    user={Fn.get("account").user}
                    setDrawerData={this.setDrawerData}
                    profile={this.props.profile}
                    // calendarRefresh={this.state.calendarRefresh}
                  />
               {/* )} */}
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

        <Drawer
          title="Basic Drawer"
          placement="right"
          // closable={true}
          onClose={() => this.setState({ innerDrawerOpen2: false })}
          visible={this.state.innerDrawerOpen2}
          width={"30vw"}
          height={"100vh"}
        >

 {  this.state.innerDrawerOpen2 && 
            <div className="pointer flex flex-column justify-start items-start bg-black-05 h-100">
              <div className="flex flex-column w-100">
                <div className="f4 fw4 black-60 ph4 pt4 w-100 pb4">
                  
                  <span className="fw6 black-80">
                    Something
                  </span>

                </div>
              </div>
              </div>
              
              }

        </Drawer>

          {this.state.drawerOpen && this.state.drawerType === "allevents" && (
            <div className="pointer flex flex-column justify-start items-start bg-black-05 h-100">
              <div className="flex flex-column w-100">
                <div className="f4 fw4 black-60 ph4 pt4 w-100 pb4">
                  Events for{" "}
                  <span className="fw6 black-80">
                    {moment(this.state.day).format("Do MMMM YYYY")}
                  </span>
                </div>
              </div>

              <div className="flex flex-column w-100 ph4 pb4">
                {this.state.allevents.map((item, index) => (
                  <div
                    onClick={e =>
                      this.onSelectEvent2({ item, index, day: this.state.day })
                    }
                    className="flex flex-row items-center w-100 mb3"
                  >
                    <div
                      style={{
                        backgroundImage:
                          this.projectImage(item) === null
                            ? GeoPattern.generate(item.title).toDataUrl()
                            : 'url("' + this.projectImage(item) + '")'
                      }}
                      className="flex w3 h3 ml2- hover-slide-up trans-b bg-cover bg-center br2 -round -bg-green mb2-"
                    ></div>
                    <div className="flex">
                      <h3 className="ttc f4 fw5 black-60 tc word-break-all mb0 ml3">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {this.state.drawerOpen && this.state.drawerType === "event" && (
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
                    conversationId={this.state.activeConversationId}
                    loadingAlign={"left"}
                    title={"Discussion"}
                    size={"full"}
                  />

                  {/* <MBox
                        type={"discussion-large"}
                        conversation={this.state.activeConversation}
                        conversations={[this.state.activeConversation]}
                        activeConversationIndex={0}
                        conversationReady={this.state.conversationReady}
                        // conversations={this.state.conversations}
                        stream={this.state.activeStream}
                        updateActiveConversation={this.updateActiveConversation}
                      // load={this.props.load}
                      /> */}
                </div>
              )}

              {this.state.view.title === "Overview" && this.state.activeEvent && (
                <>
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
                  </div>
                  <Schedule
                    event={this.state.activeEvent}
                    user={Fn.get("account").user}
                    toggleInnerDrawer={this.toggleInnerDrawer}
                  />
                </>
              )}
              {this.state.view.title === "Files" && this.state.activeEvent && (
                <>
                  <div className="flex flex-column justify-start items-start bg-white h-1-00 w-100 pa5">
                    <Files type={"calendar"} event={this.state.activeEvent} />
                  </div>
                </>
              )}
            </div>
          )}

          <Drawer
            // title="Basic Drawer"/
            placement="right"
            closable={true}
            onClose={this.toggleInnerDrawer}
            visible={this.state.innerDrawerOpen}
            width={ui.mobile() ? "100vw" : "50vw"}
            height={"100vh"}
          >
            {this.state.innerDrawerOpen && (
              <div className="pointer flex flex-column justify-start items-start bg-black-05 h--100">
                <div
                  // ref={this.scheduleForm}
                  // onSubmit={this.insertScheduleItem}
                  className="flex flex-column w-100"
                >
                  <div className="f4 fw6 black-90 ph4 pt4 w-100 pb4">
                    Add Schedule Item
                  </div>

                  <div className="flex flex-column overflow-hidden w-100 ph4 pb3 pt3">
                    <div className="form-row flex flex-row items-center mb4">
                      <label className="f4 fw5 black-50 pb2- w-30 pr3">
                        Title
                      </label>
                      <input
                        ref={this.scheduleTitle}
                        type="text"
                        required={true}
                        className="flex flex-column ph4 pv3 bn br1- round bg-white black-50 f4 fw5 bs-a- w-100"
                      />
                    </div>
                    <div className="form-row flex flex-row items-center mb4">
                      <label className="f4 fw5 black-50 pb2- w-30 pr3">
                        Description
                      </label>
                      <input
                        ref={this.scheduleDescription}
                        type="text"
                        required={true}
                        className="flex flex-column ph4 pv3 bn br1- round bg-white black-50 f4 fw5 bs-a- w-100"
                      />
                    </div>
                    <div className="form-row flex flex-row items-center mb4">
                      <label className="f4 fw5 black-50 pb2- w-30 pr3">
                        Location
                      </label>
                      <input
                        ref={this.scheduleLocation}
                        type="text"
                        required={true}
                        className="flex flex-column ph4 pv3 bn br1- round bg-white black-50 f4 fw5 bs-a- w-100"
                      />
                    </div>

                    <div className="flex flex-row overflow-hidden w-100 ml6 pl3">
                      <div className="flex flex-column overflow-hidden w-100 pa3">
                        <label className="f4 fw5 black-50 pb2- w-30 pr3">
                          Start
                        </label>
                        <TimePicker
                          // defaultValue={moment(new Date().setHours('09'))}
                          className="-bp3-dark"
                          onChange={e =>
                            this.timeOnChange({ e, type: "start" })
                          }
                          selectAllOnFocus={false}
                          showArrowButtons={true}
                          useAmPm={true}
                          required={true}
                        />
                      </div>
                      <div className="flex flex-column w-100 pa3">
                        <label className="f4 fw5 black-50 pb2- w-30 pr3">
                          End
                        </label>
                        <TimePicker
                          // defaultValue={moment(new Date().setHours('10'))}
                          className="bp3-dark-"
                          onChange={e => this.timeOnChange({ e, type: "end" })}
                          selectAllOnFocus={false}
                          showArrowButtons={true}
                          useAmPm={true}
                          required={true}
                        />
                      </div>
                    </div>

                    <div className="form-column flex flex-row items-start w-100 mb4 pt4">
                      <label className="f4 fw5 black-50 pb2- w-30 pr3">
                        People <button onClick={ () => this.setState({ innerDrawerOpen2: true }) } className="flex pv2 ph4 f5 fw5 black"  />
                      </label>
                      <div
                        style={{ maxHeight: "300px" }}
                        className="overflow-auto flex flex-column items-start w-100 mb4-"
                      >
                        {this.state.connections.map((item, index) => (
                          //  console.log('user',item),
                          <div
                            // onClick={
                            //   this.state.dialogType === "single" &&
                            //   this.newConversation(item)
                            // }
                            className="flex flex-row justify-between w-100"
                          >
                            <div
                              // to={"/user/" + item.id}
                              className={
                                "    pointer flex flex-row-ns flex-row items-center justify-start  w-100-s bn-ns bb b--black-05 pb4"
                              }
                            >
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "100px",
                                  backgroundImage:
                                    "url(" + item.profile.picture + ")"
                                }}
                                className="cover bg-center"
                              />
                              <div
                                className={
                                  "    flex flex-row -flex-column pt2-ns- pl3 f5 fw6 black  "
                                }
                              >
                                <div className={" flex  "}>
                                  {item.profile.name.first}
                                </div>
                                <div className={" flex ml1"}>
                                  {item.profile.name.last}
                                </div>
                              </div>
                            </div>
                            <div
                              className={
                                "  checkbox-square  flex flex-row -flex-column pt2-ns pl3 f5 fw6 black ph4  "
                              }
                            >
                              <Checkbox
                                type={"checkbox"}
                                onChange={() =>
                                  this.addUserToEvent({ user: item, index })
                                }
                                checked={this.state.checked[index]}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="Buttons flex flex-row justify-between center w-100">
                    <div className="flex flex-column w-100 pa4 bg-white">
                      <button
                        // type='submit'
                        onClick={this.insertScheduleItem2}
                        className="br1- round bs-b bg-black-20 ph3 pv2 pointer bn relative  "
                      >
                        {this.state.buttonLoading && (
                          <div className="flex flex-column pv3 items-center">
                            <div className="sp sp-3balls"></div>
                          </div>
                        )}
                        {!this.state.buttonLoading && (
                          <span className="f4 fw6 white pv2 flex items-center justify-center">
                            Save
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Drawer>
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
