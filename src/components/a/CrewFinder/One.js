import React from "react";
import OnboardingForm from "./OnboardingSteps";
import "./style.css";

// import Filepond from '../../upload/Filepond.js';

import { DatePicker, Steps, Icon, Select, Button, message } from "antd";

import LocationSearchBar from "../../elements/display/forms/LocationSearchBar.js";
import { TimePrecision } from "@blueprintjs/datetime";
import { Fn } from "../../../utils/fn/Fn.js";
import moment from "moment";
const { Step } = Steps;
const { Option } = Select;

const steps = [
  {
    title: "First",
    content: "First-content"
  },
  {
    title: "Second",
    content: "Second-content"
  },
  {
    title: "Last",
    content: "Last-content"
  }
];
class One extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      projectType: "",
      // projectName: '',
      projectDate: new Date(),
      projectEndDate: new Date(),
      formData: null,
      ready: false,
      submitLoading: false
    };
    this.rate = React.createRef();
    this.projectName = React.createRef();
    this.saveStep1 = this.saveStep1.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);

    this.reset = this.reset.bind(this);
    console.log("OnboardingScreen props", props);
  }
  handleStartDateChange = e => {
    window.log.warn("start date", e.toString());
    this.setState({
      projectDate: e.toString()
    });
  };
  handleEndDateChange = e => {
    window.log.warn("end date", e.toString());
    this.setState({
      projectEndDate: e.toString()
    });
  };
  reset() {
    window.localStorage.clear();
    // this.context.history.push('/')
    window.location.href = "/";
  }
  handleDateChange(e) {
    console.log(e);
    this.setState({ projectDate: e.toString() });
  }
  handleChange(e) {
    console.log(e.target.value);
    this.setState({
      projectType: e.target.value
    });
  }

  saveStep1(e) {
    e.preventDefault()
    this.setState({
      submitLoading: true
    });
    let location = Fn.get("location");
    let projectType = this.state.projectType;
    let projectName = this.projectName.current.value;
    let projectDate = this.state.projectDate;
    let projectEndDate = this.state.projectEndDate;

    let data = {
      location,
      projectType,
      projectName,
      projectDate,
      projectEndDate
    };
    Fn.set("step1Data", data);
    setTimeout(() => {
      this.props.saveStep1(data);
      this.props.next();
      this.setState({
        submitLoading: false
      });
    }, 1000);
  }

  componentDidMount() {
    this.setState({
      formData: Fn.get("step1Data"),
      ready: true
    });
  }

  render() {
    // const { current } = this.state;
    return (
      <form
      onSubmit={this.saveStep1}
      >
        <div id="StepsFormProduction" className="flex flex-column mb3">
          <div className="flex flex-column mt0" id="">
            <div className="form-row flex flex-column pb3 pt4">
              {this.state.ready && (
                <div className="form-row flex flex-column">
                  <div className="form-row flex flex-row pt4 items-center">
                    <label className="f5 fw6 black-20 pb3- tl mr4 w-30">
                      Project Name
                    </label>

                    <input
                      ref={this.projectName}
                      required={true}
                      type={"text"}
                      defultValue={this.state.formData.projectName}
                      className="flex flex-column ph4 pv3 bn br2 -round bg-black-05- white- black-50 f4 fw5 bs-a- w-100 bg-white"
                    />
                  </div>
                  <div className="form-row flex flex-row pt4 items-center">
                    <label className="w-30 f5 fw6 black-20 pb3- tl mr4 w-">
                      Project Location
                    </label>

                    <LocationSearchBar
                      location={this.state.location}
                      findLocation={this.findLocation}
                      fetchProjects={this.fetchProjects2}
                      defultValue={this.state.formData.location}
                    />

                    {/* <input
                  required={true}
                  defaultValue={getGlobal().location.County}
                  type={'text'} 
                  className="flex flex-column ph4 pv3 bn br2 -round bg-black-05 -white black-50 f4 fw5 bs-a-" /> */}
                  </div>

                  <div className="form-row flex flex-row pt4 items-center">
                    <label className="w-30 f5 fw6 black-20 pb3- tl mr4 w-">
                      Project Type
                    </label>

                    <select
                      className="flex flex-column ph4 pv3 bn br2 -round bg-white white- black-50 f4 fw5 bs-a- w-100"
                      required={true}
                      // defaultValue="commercial"
                      defultValue={this.state.formData.projectType}
                      onChange={e => this.handleChange(e)}
                    >
                      <option value="">Select</option>
                      <option value="commercial">Commercial</option>
                      <option value="film">Film</option>
                      <option value="documentary">Documentary</option>
                    </select>
                  </div>

                  <div className="form-row flex flex-column justify-between w-100">
                    <div className=" form-row flex flex-row pt4 items-center mr2-">
                      <span className="w-30 f5 fw6 black-20 pb3- tl mr4 w-">
                        Start Date
                      </span>

                      <DatePicker
                        required={true}
                        minDate={new Date("01/01/1940")}
                        maxDate={new Date("01/01/2030")}
                        // defaultValue={moment(new Date())}
                        defultValue={this.state.formData.projectDate}
                        onChange={this.handleStartDateChange}
                        className="flex flex-column ph4 pv3- bn br2 -round bg-black-05- white- black-50 f4 fw5 bs-a- w-100 bg-white"
                        // defaultValue="commercial""
                      />
                    </div>

                    <div className=" form-row flex flex-row pt4 items-center ml2-">
                      <span className="w-30 f5 fw6 black-20 pb3- tl mr4 w-">
                        Completion Date
                      </span>

                      <DatePicker
                        required={true}
                        minDate={new Date("01/01/1940")}
                        maxDate={new Date("01/01/2030")}
                        defaultValue={moment(new Date())}
                        defultValue={this.state.formData.projectEndDate}
                        // defaultValue={typeof this.props.value.dob !== "undefined" && this.props.value.dob.length > 0 ? new Date(this.props.value.dob) : null} className={''}
                        onChange={this.handleEndDateChange}
                        className="flex flex-column ph4 pv3- bn br2 -round bg-black-05- white- black-50 f4 fw5 bs-a- w-100 bg-white"
                        // defaultValue="commercial""
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="Buttons flex flex-row justify-between mt4 mw5- center w-100">
          <div className="flex flex-column w-100">
            <button
              type={'submit'}
              
              className={
                "br1- round bs-b bg-black-10 ph3 pv3 pointer bn relative w-100  "
              }
            >
              <span className="f4 fw6 black-30- white -white pv2 flex items-center justify-center">
                {this.state.submitLoading && (
                  <div className="pv2">
                    <div className="sp sp-3balls"></div>
                  </div>
                )}
                {!this.state.submitLoading && "Next"}
              </span>
            </button>

            {this.props.current > 0 && (
              <div className="flex flex-column w-100 ">
                <span
                  onClick={this.props.prev}
                  className="f6 fw5 black-30 pv2 flex items-center justify-center"
                >
                  go back to previous step
                </span>
              </div>
            )}

            <div className="flex flex-row w-100">
              <div
                onClick={this.reset}
                className="pointer f5 fw6 black-50 pv2 mt2 mv4 ba b--black-05 ph3"
              >
                Reset
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
export default One;
