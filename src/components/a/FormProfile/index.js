// @flow
import React, { Component } from "react";
import PropTypes from "prop-types";

import { Radio, RadioGroup } from "@blueprintjs/core";

import { DatePicker, TimePrecision } from "@blueprintjs/datetime";
import LocationSearchBar from "../../elements/display/forms/LocationSearchBar.js";

import "./style.css";

class FormProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      dob: this.props.value.dob,
      gender: this.props.value.gender,
      location: this.props.value.location
    };

    this.firstname = React.createContext();
    this.lastname = React.createContext();
    this.role = React.createContext();
    this.dob = React.createContext();
    this.gender = React.createContext();
    this.location = React.createContext();

    this.submit = this.submit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.setLocation = this.setLocation.bind(this);
  }
  setLocation(data) {
    console.log("location", data);
    this.setState({
      location: data
    });
  }
  handleRadioChange(e) {
    console.log(e.target.value);
    this.setState({ gender: e.target.value });
  }
  handleDateChange(e) {
    console.log(e);
    this.setState({ dob: e.toString() });
  }

  submit() {
    const data = {
      firstname: this.firstname.current.value,
      lastname: this.lastname.current.value,
      role: this.role.current.value,
      dob: this.state.dob,
      gender: this.state.gender,
      location: this.state.location
    };

    this.props.submitProfile(data);
    // console.log(this.bio.current.value)
  }

  componentDidMount = () => {
    console.log("FormBio mounted");
  };

  static getDerivedStateFromError(error) {
    // getDerivedStateFromError -> Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
  }

  getDerivedStateFromProps = (nextProps, prevState) => {
    console.log("FormBio getDerivedStateFromProps", nextProps, prevState);
  };

  getSnapshotBeforeUpdate = (prevProps, prevState) => {
    console.log("FormBio getSnapshotBeforeUpdate", prevProps, prevState);
  };

  componentDidUpdate = () => {
    console.log("FormBio did update");
  };

  componentWillUnmount = () => {
    console.log("FormBio will unmount");
  };

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return (
      <div id="FormProfile" className="flex flex-column items-center w-100">
        <div className="flex-column flex w-100 mh-400 overflow-auto pa5">
          <div className=" flex flex-row flex flex-row items-center w-100 mb4 items-center w-100 mb">
            <span className="f5 fw5 black-50 w-30 pr3">First Name</span>
            <input
              type={"text"}
              placeholder={"Your first name"}
              ref={this.firstname}
              defaultValue={this.props.value.name.first}
              className="flex round bn w-100 mb0 bn br1 pv3 ph4 black-50 f3 fw5"
            />
          </div>
          <div className=" flex flex-row flex flex-row items-center w-100 mb4 items-center w-100 mb">
            <span className="f5 fw5 black-50 w-30 pr3">Last Name</span>
            <input
              type={"text"}
              placeholder={"Your first name"}
              ref={this.lastname}
              defaultValue={this.props.value.name.last}
              className="flex round bn w-100 mb0 bn br1 pv3 ph4 black-50 f3 fw5"
            />
          </div>
          <div className=" flex flex-row flex flex-row items-center w-100 mb4 items-center w-100 mb">
            <span className="f5 fw5 black-50 w-30 pr3">Gender</span>

            {/* <input
              type={'text'}
              placeholder={'Your gender'}
              ref={this.gender}
              defaultValue={this.props.value.gender}
              className="flex round bn w-100 mb0 bn br1 pv3 ph4 black-50 f3 fw5" /> */}

            <RadioGroup
              inline={true}
              // label="Gender"
              name="group"
              onChange={this.handleRadioChange}
              selectedValue={this.state.gender}
              large={true}
            >
              <Radio large label="Male" value="male" />
              <Radio large label="Female" value="female" />
            </RadioGroup>
          </div>
          <div className=" flex flex-row flex flex-row items-center w-100 mb4 items-center w-100 mb">
            <span className="f5 fw5 black-50 w-30 pr3">Role</span>

            <input
              type={"text"}
              placeholder={"Your professional role"}
              ref={this.role}
              defaultValue={this.props.role}
              className="flex round bn w-100 mb0 bn br1 pv3 ph4 black-50 f3 fw5"
            />
          </div>

          <div className=" flex flex-row flex flex-row items-center w-100 mb4 items-center w-100 mb">
            <span className="f5 fw5 black-50 w-30 pr3 pb3 pt3">Location</span>

            <LocationSearchBar
              type={"profile"}
              setLocation={this.setLocation}
            />
          </div>
          <div className=" flex flex-row flex flex-row items-center w-100 mb4 items-center w-100 mb mb3">
            <span className="f5 fw5 black-50 w-30 pr3 pb3 pt3">
              Your Date of Birth
            </span>
            <div className="flex bn w-100 mb0 bn br1 pa3 black-50 f4 fw5">
              <DatePicker
                minDate={new Date("01/01/1940")}
                defaultValue={
                  typeof this.props.value.dob !== "undefined" &&
                  this.props.value.dob.length > 0
                    ? new Date(this.props.value.dob)
                    : null
                }
                className={""}
                onChange={this.handleDateChange}
              />
            </div>
          </div>
        </div>

        <div className="form-row flex w-100 bg-white ph4 pv4 bs-b">
          <div
            onClick={this.submit}
            className="bg-black round tc w-100 pointer flex button flex-column ph3 pv3 ba- -b--black-10 f4 fw6 white -black-50"
          >
            Submit
          </div>
        </div>
      </div>
    );
  }
}

export default FormProfile;
