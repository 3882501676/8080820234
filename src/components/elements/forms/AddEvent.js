import React from "react";
// import OnboardingForm from './OnboardingSteps';
import "./style.css";

// import Filepond from '../../upload/Filepond.js';

import { DatePicker, Steps, Select, Button, message } from "antd";
import { Icon } from "@blueprintjs/core";
import moment from "moment";
import LocationSearchBar from "../display/forms/LocationSearchBar2.js";
import Fn from "../../../utils/fn/Fn.js";

const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";

// import { DatePicker, TimePrecision } from "@blueprintjs/datetime";
// const { Step } = Steps;
// const { Option } = Select;

// const steps = [
//   {
//     title: 'First',
//     content: 'First-content',
//   },
//   {
//     title: 'Second',
//     content: 'Second-content',
//   },
//   {
//     title: 'Last',
//     content: 'Last-content',
//   },
// ];
class AddEvent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // projectType: '',
      startDate: this.props.eventData && this.props.eventData.start,
      endDate: this.props.eventData && this.props.eventData.end,
      buttonLoading: false
    };

    // this.rate = React.createRef();
    // this.projectName = React.createRef()
    this.addEvent = this.addEvent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRangeChange = this.handleRangeChange.bind(this);
    // this.setLocation = this.setLocation.bind(this)
    // this.handleDateChange = this.handleDateChange.bind(this)
    this.disabledRangeTime = this.disabledRangeTime.bind(this);
    this.range = this.range.bind(this);

    this.eventTitle = React.createRef();
this.eventForm = React.createRef()
    console.log("OnboardingScreen props", props);
  }
  handleRangeChange(e) {
    console.log(e);
    let startDate = e[0].toString();
    let endDate = e[1].toString();
    this.setState({
      startDate,
      endDate
    });
  }
  handleDateChange(e) {
    console.log(e);

    this.setState({ projectDate: e.toString() });
  }
  range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  disabledRangeTime(_, type) {
    if (type === "start") {
      return {
        disabledHours: () => this.range(0, 60).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56]
      };
    }
    return {
      disabledHours: () => this.range(0, 60).splice(20, 4),
      disabledMinutes: () => this.range(0, 31),
      disabledSeconds: () => [55, 56]
    };
  }
  handleChange(e) {
    console.log(e.target.value);

    this.setState({
      projectType: e.target.value
    });
  }

  addEvent(e) {
e.preventDefault()
    // this.eventForm.submit(e => {
    //   e.preventDefault()
    // })
    this.setState({
      buttonLoading: true
    });
    let title = this.eventTitle.current.value;
    let start = this.state.startDate;
    let end = this.state.endDate;

    let data = { title, start, end };

    this.props.addEvent(data);
  }

  componentDidMount() {}

  render() {
    // const { current } = this.state;
    return (
      <form
      ref={this.eventForm}
        id="ProjectSearchForm"
        className={
          (Fn.get("isMobile") ? " vh84 " : "  ") +
          " flex-column flex justify-between mb0"
        }
      >
        <div className="flex flex-column ma0" id="">
          <div className="form-row flex flex-column">
            <div className="form-row flex flex-column pa5">
              <div className="f4 fw6 black-90 pb4">Add an Event</div>

              <div className="form-row flex flex-row items-center">
                <label className="f4 fw5 black-50 pb2- w-30 pr3">
                  Event Title
                </label>

                <input
                  ref={this.eventTitle}
                  type="text"
                  required={true}
                  className="flex flex-column ph4 pv3 bn br1- round bg-white black-50 f4 fw5 bs-a- w-100"
                />
              </div>

              <div className="form-row flex flex-row items-center pt4">
                <label className="f4 fw5 black-50 pb2- w-30 pr3">
                  Event Location
                </label>

                <LocationSearchBar
                  // location={this.state.location}
                  // findLocation={this.findLocation}
                  setLocation={this.props.setLocation}
                  type={"event"}
                  // fetchProjects={this.fetchProjects2}
                />
              </div>

              <div className="form-row flex flex-row items-center pt4 w-100">
                <label className="f4 fw5 black-50 pb2- w-30 pr3">
                  Event Dates
                </label>

                <RangePicker
                  className="flex flex-column flex-auto ph4 pv0 bn br1- round bg-white black-50 f4 fw5 bs-a- w-100"
                  onChange={this.handleRangeChange}
                  required={true}
                  // disabledTime={this.disabledRangeTime}
                  style={{ width: "100%" }}
                  showTime={{
                    defaultValue: [
                      moment("08:00:00", "HH:mm:ss"),
                      moment("17:00:00", "HH:mm:ss")
                    ]
                  }}
                  defaultValue={
                    this.props.eventData && [
                      moment(this.props.eventData.start, dateFormat).tz(
                        "Africa/Johannesburg"
                      ),
                      moment(this.props.eventData.end, dateFormat).tz(
                        "Africa/Johannesburg"
                      )
                    ]
                  }
                  format={dateFormat}
                />
              </div>

              {/* <div className="form-row flex flex-column pt4 w-100">
                <label className="f6 fw5 black-50 pb2">Event Type</label>

                <select
                  className="flex flex-column ph3 pv3 bn br1 bg-white black-50 f4 fw5 bs-a w-100"
                  // defaultValue="commercial"                this.props.eventData
                  onChange={(e) => this.handleChange(e)}>

                  <option value="">Select</option>
                  <option value="commercial">General</option>
                  <option value="film">Meeting</option>
                  <option value="film">Documentary</option>

                </select>

              </div> */}
            </div>
          </div>
        </div>

        <div className="Buttons flex flex-row justify-between center w-100">
          <div className="flex flex-column w-100 pa4 bg-white">
            <button
              onClick={this.addEvent}
              className={
                "br1- round bs-b bg-black-20 ph3 pv2 pointer bn relative  "
              }
            >
              <span className="f4 fw6 white pv2 flex items-center justify-center">
                {this.state.buttonLoading && (
                  <div className="flex mr3 pv2">
                    <div className="sp sp-3balls"></div>
                  </div>
                )}
                {!this.state.buttonLoading &&
                  "Create Event"
                 
                }
              </span>
              
            </button>

            {/* {
              this.props.current > 0 && <div className="flex flex-column w-100 ">
                <span onClick={this.props.prev} className="f6 fw5 black-30 pv2 flex items-center justify-center">
                  go back to previous step
                          </span>

              </div>
            } */}
          </div>
        </div>
      </form>
    );
  }
}
export default AddEvent;
