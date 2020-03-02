// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { DatePicker } from '@blueprintjs/core'

import { DatePicker, TimePrecision } from "@blueprintjs/datetime";

class FormCreateProject extends React.Component {
  constructor(props) {

    super(props)

    this.state = {
      hasError: false,
      dob: ''
    }

    this.title = React.createContext()
    this.description = React.createContext()
    // this. = React.createContext()
    // this.dob = React.createContext()
    // this.gender = React.createContext()
    // this.location = React.createContext()


    this.submit = this.submit.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
  }

  handleDateChange(e) {
    console.log(e)
    this.setState({ dob: e.toString() })
  }

  submit() {

    const data = {
      title: this.firstname.current.value,
      description: this.lastname.current.value,
      location: this.role.current.value,
      start_date: this.state.dob,
      end_date: this.gender.current.value,
      
    }

    this.props.submitProfile(data)
    // console.log(this.bio.current.value)
  }

  componentDidMount = () => {
    console.log('FormBio mounted');
  }

  static getDerivedStateFromError(error) {
    // getDerivedStateFromError -> Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
  }

  getDerivedStateFromProps = (nextProps, prevState) => {
    console.log('FormBio getDerivedStateFromProps', nextProps, prevState);
  }

  getSnapshotBeforeUpdate = (prevProps, prevState) => {
    console.log('FormBio getSnapshotBeforeUpdate', prevProps, prevState);
  }

  componentDidUpdate = () => {
    console.log('FormBio did update');
  }

  componentWillUnmount = () => {
    console.log('FormBio will unmount');
  }

  render() {

    if (this.state.hasError) {

      return <h1>Something went wrong.</h1>

    }

    return (
      <div className="FormBio-wrapper" className="flex flex-column w-100">

        <div className="flex-column flex w-100 mh-400 overflow-auto pa4">

          <div className=" flex flex-column w-100">
            <span className="f5 fw5 black-50 pb3">First Name</span>
            <input
              type={'text'}
              placeholder={'Your first name'}
              ref={this.firstname}
              defaultValue={this.props.value.name.first}
              className="flex w-100 mb3 bn br1 pa3 black-50 f3 fw5" />

          </div>
          <div className=" flex flex-column w-100">
            <span className="f5 fw5 black-50 pb3 pt3">Last Name</span>
            <input
              type={'text'}
              placeholder={'Your first name'}
              ref={this.lastname}
              defaultValue={this.props.value.name.last}
              className="flex w-100 mb3 bn br1 pa3 black-50 f3 fw5" />

          </div>
          <div className=" flex flex-column w-100">
            <span className="f5 fw5 black-50 pb3 pt3">Gender</span>

            <input
              type={'text'}
              placeholder={'Your gender'}
              ref={this.gender}
              defaultValue={this.props.value.gender}
              className="flex w-100 mb3 bn br1 pa3 black-50 f3 fw5" />

          </div>
          <div className=" flex flex-column w-100">
            <span className="f5 fw5 black-50 pb3 pt3">Role</span>

            <input
              type={'text'}
              placeholder={'Your professional role'}
              ref={this.role}
              defaultValue={this.props.value.additional.role}
              className="flex w-100 mb3 bn br1 pa3 black-50 f3 fw5" />

          </div>

          <div className=" flex flex-column w-100 mb3">

            <span className="f5 fw5 black-50 pb3 pt3">Your Date of Birth</span>

            <DatePicker
              minDate={new Date('01/01/1940')}
              defaultValue={typeof this.props.value.dob !== "undefined" && this.props.value.dob.length > 0 ? new Date(this.props.value.dob) : null} className={''} onChange={this.handleDateChange} />

          </div>

        </div>

        <div className="form-row flex w-100 bg-white ph4 pv3">

          <div
            onClick={this.submit}
            className="tc w-100 pointer flex button flex-column ph3 pv2 ba b--black-10 f4 fw6 black-50">
            Submit
            </div>

        </div>

      </div>
    );
  }
}


export default FormCreateProject;