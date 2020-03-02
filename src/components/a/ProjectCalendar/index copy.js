// @flow
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import months from '../../../utils/calendar/months.json';
import moment from 'moment';
import './style.css';

import { Fn, app, api, ui } from '../../../utils/fn/Fn.js';

class ProjectCalendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      current: moment(new Date()).format('M'),
      months: [],
      months_: [],
      ready: false,
      projectEvents: null,
      ownEvents: null,
      projects: [],
      events: []

    }
    this.calendarFilter = this.calendarFilter.bind(this)
    this.createCalendar = this.createCalendar.bind(this)
  }
  componentDidMount = () => {
    console.log('ProjectCalendar mounted');
    this.calendarFilter()

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
  async createCalendar(months_) {


    // let projects = Fn.get('subscribedProjects');
    let projects = await app.fetchSubscribedProjects({ self: this, userId: Fn.get('account').user.id}).then(projects => {
      console.log('createCalendar : projects', projects)
      this.setState({
        projects: projects
      })
      return projects
    })
    let ownEvents = Fn.get('account').user.profile.events;
 

    console.log('Projects', projects)
    console.log('ownEvents', ownEvents)

    let projectDates = [];
    let m = []

    // let days_ = new Array(month_.days).fill({});


    let month = [];
    let daysInMonth = moment(new Date()).daysInMonth();
    month.daysList = new Array(daysInMonth).fill({})
    month.days_ = new Array(daysInMonth).fill({})
    month.number = moment(new Date()).format('M')
    // m[monthIndex] = month_;
    // m[monthIndex].daysList = new Array(month_.days).fill({});

    console.log(' ')
    console.log(' ')
    console.log(' ')

    console.log('[[ MONTH ]]', month)
    console.log(' ')
    console.log(' ')
    console.log(' ')
    for (let project of projects) {

      let projectMonth = moment(project.start_date).format('M')
      console.log(' ')
    console.log(' ')
    console.log(' ')

    console.log('[[ PROJECT MONTH ]]', projectMonth)
    console.log(' ')
    console.log(' ')
    console.log(' ')
      let projectStart = parseInt(moment(project.start_date).format('D'));
      console.log(' ')
    console.log(' ')
    console.log(' ')

    console.log('[[ PROJECT START DATE ]]', projectStart)
    console.log(' ')
    console.log(' ')
    console.log(' ')
      let projectEnd = parseInt(moment(project.end_date).format('D'));

      console.log('')
      console.log('project date', projectMonth, projectStart, projectEnd)

      console.log(' ')
      console.log('month.number === projectMonth', month.number, projectMonth, parseInt(month.number) === parseInt(projectMonth))
      let days = [];
      if (parseInt(month.number) === parseInt(projectMonth)) {

        // console.log(' ')
        // console.log('month_.number === projectMonth', month_.number === projectMonth)

        for (let [dayIndex, day_] of month.daysList.entries()) {

          console.log(' ')
          console.log(' ')

          // if(dayIndex )
          let day = {
            day: dayIndex + 1,
            filled: day_.filled,
            month: month.name
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
          // m[monthIndex].daysList[dayIndex] = day;
          // console.log('m[monthIndex].daysList[dayIndex] = day ', m[monthIndex].daysList[dayIndex] = day)
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

    this.setState({
      months_: m,
      ready: true
    })

  }
  calendarFilter() {

    const current = this.state.current;
let months = this.state.months;
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
      <section id="Calendar" className="mt3">

        <div className="flex flex-column mb2 pa0 br1 ">

          <div className="flex flex-row bb b--black-10 justify-between bg-white">

            <div className="flex flex-auto w--100 flex-row pb0">

              <p className="flex f4 fw6 black-60 mb0 ph3 pv2 items-center justify-center">Calendar</p>
              <p className="flex f6 fw4 black-60 mb0 ph3 pv2- items-center justify-center bl b--black-10"> projects</p>

            </div>

          </div>

          <div className="calendar flex flex-row-ns flex-column flex-wrap- justify-between col-3 pt3  ">
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
          </div>
        </div></section>
    );
  }
}

export default ProjectCalendar;