// @flow
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import months from '../../../utils/calendar/months.json';
import moment from 'moment';
import './style.css';

import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { Fn } from '../../../utils/fn/Fn.js';
import { Icon } from "@blueprintjs/core";
import AccountContext, { AccountConsumer } from '../../../utils/context/AccountContext.js';

import SectionTitle from '../_Elements/SectionTitle/SectionTitle.jsx';
const DragAndDropCalendar = withDragAndDrop(Calendar)
const localizer = momentLocalizer(moment);
class ProjectCalendar2 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      current: 12,
      months: [],
      ready: false,
      projectEvents: null,
      ownEvents: null,
      events: null

    }
    this.calendarFilter = this.calendarFilter.bind(this)
    this.createCalendar = this.createCalendar.bind(this)
    this.getOwnEvents = this.getOwnEvents.bind(this)
    this.getProjectEvents = this.getProjectEvents.bind(this)
    this.reload = this.reload.bind(this)
  }
  getProjectEvents() {
    // console.log("Calendar mounted");

    let events = []

    let events_ = Fn.get('subscribedProjects');

    for (let event of events_) {

      let e = {
        id: event.id,
        title: event.title,
        // allDay: true,
        start: moment(event.start_date).tz("Africa/Johannesburg").toDate(),
        end: moment(event.end_date).tz("Africa/Johannesburg").toDate()
      }

      events.push(e)

    }

    this.setState({ events })

    console.log('events', events)
  }
  getOwnEvents() {

    // console.log("Calendar mounted");

    let events = this.state.events;

    let events_ = Fn.get('account').user.profile.events;
    let profile = Fn.get('account').user.profile;
    if (!profile.hasOwnProperty('events')) {
      profile.events = []
    }

    for (let event of profile.events) {

      let e = {
        id: event.title + event.start,
        title: event.title,
        // allDay: true,
        // start: event.start,
        // end: event.end
        start: moment(event.start).tz("Africa/Johannesburg").toDate(),
        end: moment(event.end).tz("Africa/Johannesburg").toDate()
      }

      events.push(e)

    }

    Fn.store({ label: 'calendarEvents', value: events })

    this.setState({ events, ready: true })

    console.log('events', events)

    //     this.setState({
    //   ready: true
    // })

  }
  reload() {
    this.setState({
      ready: false,
      events: null
    })
    setTimeout(() => {
      this.getProjectEvents()
      this.getOwnEvents()
    }, 500)

  }
  componentDidMount = () => {

    console.log('ProjectCalendar mounted');

    this.setState({
      projectEvents: this.props.projects,
      ownEvents: this.props.ownEvents
    })
    this.reload()

  }

  static getDerivedStateFromError(error) {
    // getDerivedStateFromError -> Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
  }

  getDerivedStateFromProps = (nextProps, prevState) => {
    // console.log('ProjectCalendar getDerivedStateFromProps', nextProps, prevState);
  }

  getSnapshotBeforeUpdate = (prevProps, prevState) => {
    // console.log('ProjectCalendar getSnapshotBeforeUpdate', prevProps, prevState);
  }

  componentDidUpdate = () => {
    // console.log('ProjectCalendar did update');
  }

  componentWillUnmount = () => {
    // console.log('ProjectCalendar will unmount');
  }
  createCalendar2(months_) {

    let projects = this.props.projects;
    console.log('Projects', projects)
    let projectDates = [];
    let m = []
    for (let project of projects) {

      let projectMonth = moment(project.date.startDate).format('MM')
      let projectStart = parseInt(moment(project.date.startDate).format('DD'));
      let projectEnd = parseInt(moment(project.date.endDate).format('DD'));

      console.log('project date', projectMonth, projectStart, projectEnd)

      for (let month_ of months_) {
        // item_
        let days_ = new Array(month_.days).fill({});

        month_.days_ = days_;

        // console.log('days_', item_)

        console.log('month item ', month_)
        console.log('month_.number', month_.number)
        console.log('projectMonth', projectMonth)

        if (month_.number === projectMonth) {

          let days = [];

          for (let day_ of month_.days_) {

            let day = {};

            day.day = days_.indexOf(day_) + 1;

            console.log('day_ item', day)

            if (day.day > projectStart && day.day < projectEnd) {
              day.filled = true
            }
            else {
              day.filled = false
            }

            days.push(day)

            console.log('days', days)
          }

          month_.days__ = days;

          console.log('month_.days__', month_)

        }

        m.push(month_)

      }
    }

    this.setState({
      months_: m,
      ready: true
    })

  }
  createCalendar(months_) {

    // let day = parseInt(moment(a).format('DD'))

    // let m = this.state.months;
    // console.log('m', m)

    let projects = this.props.projects;
    let ownEvents = this.props.ownEvents;

    console.log('Projects', projects)
    console.log('ownEvents', ownEvents)

    let projectDates = [];
    let m = []

    for (let [monthIndex, month_] of months_.entries()) {

      let days_ = new Array(month_.days).fill({});

      // for()

      m[monthIndex] = month_;
      m[monthIndex].daysList = new Array(month_.days).fill({});

      // m[monthIndex].days__ = []
      // m[monthIndex].days_ = days_;

      // month_.days_ = days_;
      // month_.days__ = [];
      console.log('')
      console.log('month_', month_)

      for (let project of projects) {

        let projectMonth = moment(project.date.startDate).format('MM')
        let projectStart = parseInt(moment(project.date.startDate).format('DD'));
        let projectEnd = parseInt(moment(project.date.endDate).format('DD'));

        console.log('')
        console.log('project date', projectMonth, projectStart, projectEnd)

        console.log(' ')
        console.log('month_.number === projectMonth', month_.number, projectMonth, parseInt(month_.number) === parseInt(projectMonth))
        let days = [];
        if (parseInt(month_.number) === parseInt(projectMonth)) {

          // console.log(' ')
          // console.log('month_.number === projectMonth', month_.number === projectMonth)

          for (let [dayIndex, day_] of month_.daysList.entries()) {

            console.log(' ')
            console.log(' ')

            // if(dayIndex )
            let day = {
              day: dayIndex + 1,
              filled: day_.filled,
              month: month_.name
            };

            console.log(' ')
            console.log('[[ day ]]', day.day, projectStart, projectEnd)

            if (day.day >= projectStart && day.day <= projectEnd) {
              day.filled = true
            }
            // else {
            //   day.filled = false
            // }

            console.log(' ')
            console.log('day', day, day.day, day.filled)

            // month_.days__.push(day)
            // m[monthIndex].days__[dayIndex] = day;
            m[monthIndex].daysList[dayIndex] = day;
            console.log('m[monthIndex].daysList[dayIndex] = day ', m[monthIndex].daysList[dayIndex] = day)
            // days.push(day)

            // console.log('days',days)
          }

          // let d = [...month_.days__, ...days ]
          // month_.days__ = days;

          console.log('month_.days__', m)

        }
        else {

          // let days = [];

          // for (let [dayIndex, day_] of month_.days_.entries()) {

          //   let day = {
          //     day: dayIndex + 1,
          //     filled: false,
          //     month: month_.name
          //   }

          //   m[monthIndex].days__[dayIndex] = day;
          //   m[monthIndex].daysList[dayIndex] = day;

          // }

          // month_.days__ = days;

        }

      }

      // m.push(month_)

    }

    this.setState({
      months_: m,
      ready: true
    })

  }
  calendarFilter() {

    const current = this.state.current;

    let months_ = [];
    console.log('months', months)
    if (current === 12) {
      months_[0] = months[current - 2];
      months_[1] = months[current - 1];
      months_[2] = months[current - 12];
    }

    else {
      months_[0] = months[current - 2];
      months_[1] = months[current - 1];
      months_[2] = months[current];
    }
    console.log('months ', months_)
    // this.setState({
    //   months: months_,
    //   // ready: true
    // })

    this.createCalendar(months_)
    // sreturn months_

  }
  render() {

    // const current = 12;

    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      this.state.ready &&
      <section id="ProfileCalendar" className="mt3">

        <div className="flex flex-column mb2 pa0 br1 ">

          <SectionTitle
            title={"Calendar"}
            functionButton={{
              title: "View All",
              icon: "ring",
              function: () => this.context.history.push('/calendar')
            }}
            labels={[
              {
                text: "projects",
                count: 0
              },
            ]}
          />

          {/* <div className="flex flex-row bb b--black-10 justify-between bg-white">

            <div className="flex flex-auto w--100 flex-row pb0">

              <p className="flex f4 fw6 black-60 mb0 ph3 pv2 items-center justify-center">Calendar</p>
              <p className="flex f6 fw4 black-60 mb0 ph3 pv2- items-center justify-center bl b--black-10"> projects</p>

            </div>

            <div className="flex flex-auto- flex-row pb0">
              <div
                onClick={() => this.context.history.push('/calendar')}
                id="NetworkSeeAll-button"
                className="flex flex-column pointer h-100 bl b--black-10"
              >
                <div
                  id=""
                  className="flex flex-row ph0 pv0 items-center justify-center bg-white h-100"
                >
                  <span className="f6 fw4 black-60 ph3">See All</span>

                  <div
                    style={{ backgroundColor: "#b3bf95" }}
                    className="flex flex-column items-center justify-center ph3 pv2 white h-100"
                  >
                    <Icon icon={"ring"} iconSize={15} />
                  </div>
                </div>
              </div>
            </div>

          </div> */}

          {/* <div className="calendar flex flex-row-ns flex-column flex-wrap- justify-between col-3 pt3  ">
            {
              this.state.months_.map((item, index) => (
                <div
                  key={index}
                  id={item.name}
                  className="calendar-month flex flex-column flex-wrap flex--auto ">

                  <div className="flex flex-column flex-wrap bb b--black-05 bg-white pa3 f4 fw6 black-70">
                    {item.name}
                  </div>

                  <div className="calendar-days-list bg-near-white flex flex-row col-7 flex-wrap bl bt b--black-05">
                    {item.daysList.map((day, index_) => (
                      // console.log('day',day),
                      <div
                        key={index_}
                        className={(day.filled ? " filled bg-green " : " ") + (" calendar-day flex flex-column flex-wrap pa3 bb br b--black-05")}>
                        {index_ + 1}
                      </div>
                    ))}
                  </div>

                </div>
              ))
            }
          </div> */}

          <div className="calendar pb5 flex flex-row-ns flex-column flex-wrap- justify-between col-3 pt3  ">

            <div
              // key={index}
              // id={item.name}
              className="calendar-month flex flex-column flex-wrap flex--auto ">

              <div className="flex flex-column flex-wrap bb b--black-05 bg-white pa3 f4 fw6 black-70">
                {moment(new Date()).subtract(1, 'M').format('MMMM YYYY').toString()}
              </div>

              <div className="flex flex-column">
                <DragAndDropCalendar

                  // selectable
                  localizer={localizer}
                  events={this.state.ready && this.state.events || []}
                  // onEventDrop={this.moveEvent}
                  // resizable
                  // onEventResize={this.resizeEvent}
                  // onSelectSlot={this.newEvent}
                  // onDragStart={console.log}
                  defaultView={Views.MONTH}
                  defaultDate={moment(new Date()).subtract(1, 'M').tz("Africa/Johannesburg").toDate()}
                  style={{ height: 400 }}
                  // onSelectEvent={this.onSelectEvent}
                  toolbar={false}
                />
              </div>
            </div>

            <div
              // key={index}
              // id={item.name}
              className="calendar-month flex flex-column flex-wrap flex--auto ">

              <div className="flex flex-column flex-wrap bb b--black-05 bg-white pa3 f4 fw6 black-70">
                {moment(new Date()).format('MMMM YYYY').toString()}
              </div>
              <div className="flex flex-column">

                <DragAndDropCalendar

                  selectable
                  localizer={localizer}
                  events={this.state.ready && this.state.events || []}
                  onEventDrop={this.moveEvent}
                  // resizable
                  // onEventResize={this.resizeEvent}
                  // onSelectSlot={this.newEvent}
                  // onDragStart={console.log}
                  defaultView={Views.MONTH}
                  defaultDate={moment(new Date()).tz("Africa/Johannesburg").toDate()}
                  style={{ height: 400 }}
                  // onSelectEvent={this.onSelectEvent}
                  toolbar={false}
                />
              </div>

            </div>

            <div
              // key={index}
              // id={item.name}
              className="calendar-month flex flex-column flex-wrap flex--auto ">

              <div className="flex flex-column flex-wrap bb b--black-05 bg-white pa3 f4 fw6 black-70">
                {moment(new Date()).add(1, 'M').format('MMMM YYYY').toString()}
              </div>

              <div className="flex flex-column">
                <DragAndDropCalendar

                  selectable
                  localizer={localizer}
                  events={this.state.ready && this.state.events || []}
                  // onEventDrop={this.moveEvent}
                  // resizable
                  // onEventResize={this.resizeEvent}
                  // onSelectSlot={this.newEvent}
                  // onDragStart={console.log}
                  defaultView={Views.MONTH}
                  defaultDate={moment(new Date()).add(1, 'M').tz("Africa/Johannesburg").toDate()}
                  style={{ height: 400 }}
                  // onSelectEvent={this.onSelectEvent}
                  toolbar={false}
                />
              </div>

            </div>

          </div>

        </div></section>
    );
  }
}

export default ProjectCalendar2;
ProjectCalendar2.contextType = AccountContext