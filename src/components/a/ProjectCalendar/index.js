// @flow
import React, { Component } from "react";
// import PropTypes from 'prop-types';
import months from "../../../utils/calendar/months.json";
import moment from "moment";
import "./style.css";
import { Tooltip, Popover, Skeleton, notification } from "antd";
import { Icon } from "@blueprintjs/core";
import { Fn, app, api, ui } from "../../../utils/fn/Fn.js";
import AccountContext, { AccountProvider, AccountConsumer }  from "../../../utils/context/AccountContext";
// import Login from '../../../../../../../___/recipes3/src/pages/Login/index';
import Loading from '../../elements/Loading.js';
var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;



class ProjectCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      current: parseInt(moment(new Date()).format("M")),
      currentMonthString: moment(new Date()).format("MMMM"),
      currentMonth: moment(new Date()),
      year: moment(new Date()).format("YYYY"),
      months: [],
      months_: [],
      ready: false,
      projectEvents: [],
      ownEvents: [],
      projects: [],
      events: [],
      projectsWithDates: [],
      style: "two",
      contextMenuOpen: 0,
      eventsReady: false,
      projectsReady: false,
      calendarDataReady: this.props.calendarRefresh,
      existingEntries: []
    };
    // this.calendarFilter = this.calendarFilter.bind(this)

    // this.createCalendar = this.createCalendar.bind(this)
    this.start = this.start.bind(this);
    this.getDates = this.getDates.bind(this);
    this.createDays = this.createDays.bind(this);
    this.getMonthDateRange = this.getMonthDateRange.bind(this);
    this.projectImage = this.projectImage.bind(this);
    this.toggleStyle = this.toggleStyle.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.reload = this.reload.bind(this)
    this.onSelectSlot = this.onSelectSlot.bind(this)
    this.checkForNewEntry = this.checkForNewEntry.bind(this)
  }
  checkForNewEntry(itemId) {

    let entries = this.state.existingEntries;

    return !entries.includes(itemId)

    // if(!entries.includes(itemId)){
    //   // existingEntries.push(item.id)
    //   return true
    // }
    // else {
      
    //   return false
      
    // }
    // setTimeout(() => {
    //   entries.push(item.id)
    // },3000
    
  }
  onSelectSlot(__) {

    const { day, index } = __

    // console.log('select slot',__)

    const projectsWithDates = this.state.projectsWithDates;

    const data = projectsWithDates[index];

    // console.log('data',data)

    let filter = (___) => {
      // console.log('filter',___, ___.days)
      if(___.dates) {
        return ___.dates.includes(day)
      }
    }

    let allEventsForDay = projectsWithDates.filter(a => filter(a));

    this.props.setDrawerData({ day: day, events: allEventsForDay })

    // console.log('allEventsForDay',allEventsForDay)

  }
  reload() {
    this.start().then(res => {
      this.createDays();
    });
    // this.props.setReady()
  }
  next() {
    // let current = this.state.current;
    // let next = ++current;
    this.setState({
      ready: false,
      current: parseInt(moment(this.state.currentMonth).add(1,'month').format('M')),
      currentMonthString: moment(this.state.currentMonth).add(1,'month').format('MMMM'),
      currentMonth: moment(this.state.currentMonth).add(1,'month'),
      year: moment(this.state.currentMonth).add(1,'month').format('YYYY')
    });
    this.start().then(res => {
      this.createDays();
    });
    // setTimeout(() => {
      
    // },300)
    
  }
  prev() {
    // let current = this.state.current;
    // let next = --current;
    this.setState({
      ready: false,
      current: parseInt(moment(this.state.currentMonth).subtract(1,'month').format('M')),
      currentMonth: moment(this.state.currentMonth).subtract(1,'month'),
      currentMonthString: moment(this.state.currentMonth).subtract(1,'month').format('MMMM'),
      year: moment(this.state.currentMonth).subtract(1,'month').format('YYYY')
    });
    this.start().then(res => {
      this.createDays();
    });
  }
  toggleStyle(style) {
    // let style= this.state.style;
    // if(style === "one") {
    //   this.setState({ style: "two"})
    // }
    // else {
    // }
    this.setState({ style: style });
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
  
  async start() {
    this.setState({ calendarDataReady: false })
    return new Promise(async resolve => {

      let projects = await app
        .fetchSubscribedProjects({
          self: this,
          // userId: Fn.get("account").user.id
          userId: this.props.user.id
        })
        .then(projects => {
          // console.log("createCalendar : projects", projects);
          this.setState({
            projects: projects,
            projectsReady: true
          });
          return projects;
        });
      
        let events = [];

      events = await app
        .fetchEvents({
          self: this,
          // userId: Fn.get("account").user.id,
          userId: this.props.user.id
        })
        .then(events => {
          // console.log("createCalendar : events", events);
          if(events.code === 401) {
            // console.log('unauthorized', events)
            app.refreshTokens()
            this.setState({
              events: []
            });
            return [];
          }
          else {

            this.setState({
              events: events,
              eventsReady: true
            });
            return events;
          }

          
        });

      // let ownEvents = Fn.get("account").user.profile.events;

      // console.log("Projects", projects);
      // console.log("ownEvents", events);

      if (events.code === 401) {
        // notification.open({
        //   message: "Unauthorized",
        //   description: "Please log in again."
        // });
        this.context.refreshTokens();
        // return false;
      }

      let dates = [];

      // console.log('events is not iterable', events)

      if(this.state.eventsReady && this.state.projectsReady) {
        for (let item of events) {
          // console.log(" ");
          // console.log(" ");
          // console.log(" ");
          // // console.log("[[ Calendar : Project Item ]]", item);
          // console.log(" ");
          // console.log(" ");
          // console.log(" ");
  
          let start = item.start;
          let end = item.end;
          let dates_ = this.getDates(start, end);
          let item_ = {
            id: item.id,
            type: "event",
            title: item.title,
            conversations: item.conversations,
            conversationId: item.conversationId,
            schedule: item.schedule || [],
            files: item.files || [],
            days: item.days,
            project: null,
            start: moment(start).tz("Africa/Johannesburg")
            .toDate(),
            end: moment(end).tz("Africa/Johannesburg")
            .toDate(),
            dates: dates_,
            picture:
              (item &&
                item.media &&
                item.media.images &&
                item.media.images.length > 0 &&
                item.media.images[0].url) ||
              null
            // GeoPattern.generate(item.title).toBase64()
          };
  
          dates.push(item_);
        }
        for (let item of projects) {

          // let existingEntries = [];
          

          // console.log(" ");
          // console.log(" ");
          // console.log(" ");
          // // console.log("[[ Calendar : Project Item ]]", item);
          // console.log(" ");
          // console.log(" ");
          // console.log(" ");
  
          let start = item.start_date;
          let end = item.end_date;
  
          let item_ = {
            id: item.id,
            type: "project",
            title: item.title,
            schedule: item.schedule || [],
            files: item.files || [],
            project: item,
            start: moment(start).tz("Africa/Johannesburg")
            .toDate(),
            end: moment(end).tz("Africa/Johannesburg")
            .toDate(),
            dates: item.days,
            picture:
              (item &&
                item.media &&
                item.media.images &&
                item.media.images.length > 0 &&
                item.media.images[0].url) ||
              GeoPattern.generate(item.title).toBase64()
          };
          dates.push(item_);
        }

  
        // console.log('event dates', dates)
        // for(let item of dates){

        //   // let entries = this.state.existingEntries;
        //   //   entries.push(item.id)
        //   //   this.setState({
        //   //     existingEntries: entries
        //   //   })

        //   if(this.state.existingEntries.length === 0) {
        //     let entries = this.state.existingEntries;
        //     entries.push(item.id)
        //     this.setState({
        //       existingEntries: entries
        //     })
        // }
        // }
        this.setState({
          projectsWithDates: dates,
          calendarDataReady: true
        })
  
        resolve(dates);
      }
      
      
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
  getMonthDateRange(year, month) {
    // var moment = require("moment");

    // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
    // array is 'year', 'month', 'day', etc
    var startDate = moment([year, month - 1]);

    // Clone the value before .endOf()
    var endDate = moment(startDate).endOf("month");

    // just for demonstration:
    // console.log(startDate.toDate());
    // console.log(endDate.toDate());

    // make sure to call toDate() for plain JavaScript date type
    return { start: startDate, end: endDate };
  }
  createDays() {
    let current = this.state.current;
    // alert('current',this.state.current)
    let year_ = parseInt(moment(new Date()).format("Y"));
    let date = current + "/01/" + year_;
    let currentMonth = parseInt(moment(new Date(date)).format("M"));
    let daysInMonth = moment(new Date(date)).daysInMonth();
    // let days = new Array(daysInMonth).fill({})
    let year = parseInt(moment(new Date(date)).format("Y"));
    let month = parseInt(moment(new Date(date)).format("M"));
    let dateRange = this.getMonthDateRange(year, month);

    // console.log("#####");
    // console.log(" ");
    // console.log("dateRange", dateRange);
    // console.log(" ");
    // console.log(" ");
    // console.log(" ");

    let start = dateRange.start;
    let end = dateRange.end;
    let days = this.getDates(start, end);

    let months = [];

    let month_ = {
      name: moment(new Date(date)).format("MMMM"),
      days: days
    };

    // console.log("#####");
    // console.log(" ");
    // console.log("month_", month_);
    // console.log(" ");
    // console.log(" ");

    months.push(month_);

    this.setState({
      months: months,
      ready: true
    });
  }
  componentDidMount = async () => {

    console.log("ProjectCalendar mounted");
    // this.calendarFilter()

    this.start().then(res => {
      this.createDays()
    })

  }
  render() {

    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
     <>
      {/* {!this.state.ready && <Loading />} */}

      <section id="Calendar" className="flex -mt3">
        <div className="flex flex-column mb2 pa0 br1 ">
          <div className="calendar flex flex-row-ns flex-column flex-wrap- justify-between col--3 pt3  ">
            {this.state.months.map((item, index) => (
              <div
                key={index}
                id={item.name}
                className="calendar-month flex flex-column flex-wrap flex--auto w-100 "
              >
                <div
                  id="Calendar-header"
                  className={
                    ( this.props.profile ? " br2 " : " round- br3 ") 
                    + ( this.props.headerType === "square-slim" ? " w-100 flex flex-row b-b b--black-10 justify-between bg-white- br2- overflow-hidden bs-b " : " -round flex flex-row justify-between bb b--black-05 bg-white- mb4 " ) }>
                 
                 <div className="vh10 flex flex-row justify-between flex-wrap w-100 ph4- pv2- f4 fw6 black-70">
                    <div
                      onClick={this.prev}
                      className="w-40 pointer flex flex-row items-center justify-start pv2 pl2 pr3 pv0 f5 fw6 black-20 hover-black-50"
                    >
                      <div className="flex items-center justify-center w2 h2 mr2 br3 bg-black-05 -hover-bg-black-10 overflow-hidden">
                        <Icon
                          icon={"chevron-left"}
                          iconSize={15}
                          className="white pa2 hover-black-"
                        />
                      </div>
                      <span>prev</span>
                    </div>

                     <div className="w-20 flex flex-row flex-wrap pv0 ph3 f5 fw6 black items-center justify-center">
                   
                    <span className="black-30 fw5">
                      {moment(new Date()).format('Do')}
                    </span>

                    <span className=" black fw6 f3 ph3">
                    {this.state.currentMonthString}
                     </span>   

                  
                    <span className=" black-30 fw5">
                      {this.state.year}
                    </span>
                    {/* <span className={ ( this.state.calendarDataReady ? " black-40 " : " black-20 " ) + ("  pointer fw5 pl4 " )}>
                    
<Icon onClick={() => this.start()} icon={"refresh"} iconSize={10} />
                    </span> */}



                  </div>

                    <div
                      onClick={this.next}
                      className="w-40 pointer flex flex-row items-center justify-end pv2 pl2 pr3 pv0 f5 fw6 black-20  hover-black-50"
                    >
                      <span>next</span>

                      <div className="flex items-center justify-center w2 h2 ml2 br3 bg-black-05 -hover-bg-black-10 overflow-hidden">
                        <Icon
                          icon={"chevron-right"}
                          iconSize={15}
                          className="white pa2 hover-black-"
                        />
                      </div>
                    </div>
                  </div>
                 
                 
                  {/* <div className="flex flex-row justify-between flex-wrap pr3 pl4 pv0 f4 fw6 black-70 bl b--black-05">
                    <div
                      onClick={() => this.toggleStyle("one")}
                      className="pointer flex flex-row items-center justify-center ph3 pv0 f5 fw6 black-40 hover-black-50"
                    >
                      <div className="flex items-center justify-center w2 h2 mr2 br3 bg-black-05 overflow-hidden">
                        <div
                          className={
                            (this.state.style === "one"
                              ? " opacity-1 "
                              : " opacity-0") +
                            " w1 h1 bg-white-70 trans-a br2 "
                          }
                        ></div>
                      </div>
                      <span>sm</span>
                    </div>
                    <div
                      onClick={() => this.toggleStyle("two")}
                      className="pointer flex flex-row items-center justify-center ph3 pv0 f5 fw6 black-40 hover-black-50"
                    >
                      <div className="flex items-center justify-center w2 h2 mr2 round- br3 bg-black-05 overflow-hidden">
                        <div
                          className={
                            (this.state.style === "two"
                              ? " opacity-1 "
                              : " opacity-0") +
                            " w1- h1- calendar-event-block bg-white-70 trans-a br2 "
                          }
                        ></div>
                      </div>
                      <span>lg</span>
                    </div>
                    {/* <div
                      onClick={() => this.toggleStyle("three")}
                      className="pointer flex flex-row items-center justify-center ph3 pv2 f5 fw6 black-40 hover-black-50"
                    >
                      <div className="flex items-center justify-center w2 h2 mr2 round- br3 bg-black-05 overflow-hidden">
                        <div
                          className={
                            (this.state.style === "three"
                              ? " opacity-1 "
                              : " opacity-0") +
                            " w1 h1 bg-white-70 trans-a br2 "
                          }
                        ></div>
                      </div>
                      <span>three</span>
                    </div> */}
                  {/* </div>  */}
                </div>

                {/* {!this.state.ready && (

                  <div className="trans-a pv3 ph1">
                    <Skeleton active />
                    <Skeleton active />
                  </div>
                
                )} */}


                  <div className="calendar-days-list flex flex-row col-7 flex-wrap -bl -bt -b--black-05">
                    {item.days.map((day, index_) => (
                      // console.log("day", day),
                      // console.log('isToday', new Date(moment(new Date())).toLocaleDateString() === new Date(moment(day)).toLocaleDateString()),
                      <div
                        onClick={() => this.onSelectSlot({day,index})}
                        className={ ( " pr3 pl3 pv3 pt3 " + " flex flex-column " )}
                      >
                        <div
                        style={ ui.mobile() ? { height: "200px" } : { height: "200px" }}
                          onMouseEnter={() => {
                            this.setState({
                              contextMenuOpen: index_
                            });
                          }}
                          key={index_}
                          className={
                            ( new Date().toLocaleDateString() === new Date(moment(day)).toLocaleDateString() ? " ba bw2 b--black-05 " : "  " ) 
                            + (day.filled ? " filled bg-green " : " ") +
                            "   calendar-day flex flex-column flex-wrap -ba round- br3 pa3 -b--black-05 h4-  relative hover-bg-white-50 hover-scale-up -hover-scale-down-slide-up pointer hover-black black-20 trans-a justify-end items-end overflow-hidden"
                          }
                        >
                          <span className="calendar-day-label trans-s pa3 absolute top-0 right-0 f3 fw3 black-20- raleway relative">
                            {index_ + 1}
                          </span>

                          <div className="calendar-day-buttons absolute top-0 left-0  flex flex-row ph2 pv2">
                            <div
                              onClick={() => this.props.onSelectSlot(day)}
                              className="flex -insert-event-button -trans-a -pa3"
                            >
                              {/* 
                          <Icon
                            icon={"plus"}
                            iconSize={20}
                            className="bg-white-50 hover-bg-white round- black-20 pa2 hover-black -bb -br b--black-05 bbrr-3"
                          /> */}
                              {/* <Icon
                                icon={"ring"}
                                iconSize={15}
                                className=" black-20 pa2 hover-black-30 hover-green"
                              /> */}

                              {/* <div className={ (" trans-a transform-origin-left-top day-context-menu flex absolute top-0 left-0 bg-white -br3 bs-b " ) }>
                        <div className="flex flex-column f5 fw5 black-50 w-100"> 
<p className="flex ma0 pv2 ph2 bb b--black-05 w-100 "><Icon icon={'selection'} iconSize={15} className="mr3 black-20"></Icon> Highlight</p>
<p className="flex ma0 pv2 ph2 bb b--black-05 w-100 "><Icon icon={'small-plus'} iconSize={15} className="mr3 black-20"></Icon>  Add Event</p>
</div>
                        </div> */}
                            </div>
{/* 
                            <div
                              onClick={() => this.props.onSelectSlot({day,index})}
                              className="flex -insert-event-button -trans-a -absolute -top-0 -left-0 -pa3"
                            >
                              <Icon
                                icon={"star"}
                                iconSize={15}
                                className="black-20 pa2 hover-black-30 hover-yellow"
                              />
                            </div> */}
                          </div>

                          <div
                            className={
                              (this.state.style === "one"
                                ? " flex-row "
                                : this.state.style === "two"
                                ? " flex-row "
                                : " flex-column w-100 flex-wrap ") +
                              " flex items-end justify-end flex-wrap trans-a "
                            }
                          >               
                           {/* {this.state.ready && ()} */}
                            { this.props.ready && this.state.projectsWithDates.map(
                              (project, index__) =>
                                project.dates.filter(a => a === day).length >
                                  0 && (
                                  <Tooltip
                                    placement={"topLeft"}
                                    title={project.title}
                                  >
                                    <div
                                      onClick={(e) =>
                                        this.props.onSelectEvent({ e, data: {
                                          event: project,
                                          day
                                        } })
                                      }
                                      style={{
                                        backgroundImage:
                                          this.projectImage(project) === null
                                            ? GeoPattern.generate(
                                                project.title
                                              ).toDataUrl()
                                            : 'url("' +
                                              this.projectImage(project) +
                                              '")'
                                      }}
                                      className={
                                        (this.state.style === "one"
                                          ? " calendar-event-block mh1 w1- h1- ml2- -w1 -h3 -ml2 "
                                          : this.state.style === "two"
                                          ? " calendar-event-block lg w2- h2- mh1 "
                                          : " h1- w-100 ") +
                                        " hover-slide-up trans-b bg-cover bg-center br2 -round -bg-green mt2"
                                      }
                                    >{ this.checkForNewEntry(project.id) ? <div className="-scale-up-center -calendar-event-block-new-entry "></div> : null }<></></div>
                                  </Tooltip>
                                )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                
              </div>
            ))}
          </div>
        </div>
      </section>
      </>
    );
  }
}

export default ProjectCalendar;
ProjectCalendar.contextType = AccountContext;
