import React from "react";
// import OnboardingForm from './OnboardingSteps';
import "./style.css";

// import Filepond from '../../upload/Filepond.js';

import { DatePicker, Steps, Select, Button, message } from "antd";
import { Icon, Spinner } from "@blueprintjs/core";
import moment from "moment";
import LocationSearchBar from "../display/forms/LocationSearchBar.js";
import { Fn, app } from "../../../utils/fn/Fn.js";
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";

var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;

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
class FormInvite extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectType: "",
      startDate: "",
      endDate: "",
      view: "email",
      // inviteBusy: false,
      connections: [],
      connectionsReady: false,
      inviteBusy: []
    };

    this.emailAddress = React.createRef();
    // this.projectName = React.createRef()
    this.searchProjects = this.searchProjects.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRangeChange = this.handleRangeChange.bind(this);
    this.setView = this.setView.bind(this);
    this.inviteByEmail = this.inviteByEmail.bind(this);
    this.addProductionCrewMember = this.addProductionCrewMember.bind(this)
    // this.handleDateChange = this.handleDateChange.bind(this)
    this.inviteByEmailAddress = React.createRef();
    console.log("OnboardingScreen props", props);
  }
  async addProductionCrewMember({ item, index}) {
    let a = this.state.inviteBusy;
    a[index] = true;
    this.setState({
      inviteBusy: a
    })

    setTimeout(() => {
      this.props.addProductionCrewMember(item)
    },600)

  }
  async inviteByEmail() {
    this.setState({ inviteBusy: true });
    console.log("invitebyemail", this.props);
    let projectOwner = this.props.projectOwner;
    let email = this.inviteByEmailAddress.current.value;
    let position = this.props.productionCrew[0].position;
    let link = window.location.href + "?newInvite=true&referrer=email";

    await app.inviteByEmail({
      self: this,
      link,
      position,
      project: this.props.project,
      projectOwner,
      email
    });
  }
  setView(view) {
    this.setState({
      view: view
    });
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

  handleChange(e) {
    console.log(e.target.value);

    this.setState({
      projectType: e.target.value
    });
  }

  searchProjects() {
    // let location = getGlobal().location;
    let location = Fn.get("location");
    let projectType = this.state.projectType;
    let startDate = this.state.startDate;
    let endDate = this.state.endDate;

    let data = { location, projectType, startDate, endDate };
    this.props.searchProjects(data);
  }

  componentDidMount() {
    let connections = Fn.get("connections").data;
    // let inviteBusy = [];
    // for(let item of inviteBusy){
    //   inviteBusy.push()
    // }
    console.log('** connections',connections)
    let inviteBusy = new Array(connections.length).fill(false)
    this.setState({
      connections: connections,
      connectionsReady: true,
      inviteBusy: inviteBusy
    });
  }

  render() {
    // const { current } = this.state;
    return (
      <div id="ProjectSearchForm">
        <div className="flex flex-column ma0" id="">
          <div className="form-row flex flex-column">
            <div className="form-row flex flex-column pa4-">
              <div className="flex flex-row justify-start ph4 pv3 bg-white-40">
                <div
                  onClick={() => this.setView("email")}
                  className={
                    (this.state.view === "email"
                      ? " fw6 black-80 "
                      : " fw5 black-50 ") + " f5 mr3 "
                  }
                >
                  Invite by Email
                </div>
                <div
                  onClick={() => this.setView("network")}
                  className={
                    (this.state.view === "network"
                      ? " fw6 black-80 "
                      : " fw5 black-50 ") + " f5 mr3"
                  }
                >
                  Invite by Network
                </div>
                {/* <div
                  onClick={() => this.setView("search")}
                  className={
                    (this.state.view === "search"
                      ? " fw6 black-80 "
                      : " fw5 black-50 ") + " f5 pb3 p-h3 "
                  }
                >
                  Search Users
                </div> */}
              </div>
              {this.state.view === "email" && (
                <div className="form-row flex flex-column pa3">
                  <label className="f6 fw5 black-50 pb2">Email address</label>

                  <div className="flex flex-row ">
                    <input
                      ref={this.inviteByEmailAddress}
                      type={"text"}
                      placeholder={"Enter email address"}
                      className="flex flex-column ph3 pv3 bn br1 bg-white black-50 f4 fw5 bs-a- w-100"
                    />

                    <div class="flex flex-column w-30 bl b--black-05">
                      <button
                        onClick={this.inviteByEmail}
                        class="pointer flex h-100 items-center justify-center f6 bg-white bn f5 fw6 black-50"
                      >
                        Invite
                        {this.state.inviteBusy ? (
                          <div className="flex flex-column items-start ml2">
                            <Spinner size={15} />
                          </div>
                        ) : (
                          <Icon icon="arrow-right" className="ml2"></Icon>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {this.state.view === "network" && (
                <div className="flex flex-column pt3-0">
                  {/* <div className="form-row flex flex-column">
                    <div className="form-row flex flex-column pb4">
                      <input
                        ref={this.searchTerm}
                        type={"text"}
                        placeholder={"Search by Name"}
                        className="flex flex-column ph3 pv2 bn round bg-white black-50 f5 fw5 bs-a- w-100"
                      />
                    </div>
                  </div> */}
                  <div
                    className="flex flex-column"
                    style={{ maxHeight: "400px", overflow: "auto" }}
                  >
                    {this.state.connectionsReady &&
                      this.state.connections.map((item, index) => (
                        <div className="flex flex-row">
                          <div
                            // to={"/user/" + item.id}
                            onClick={() => this.addProductionCrewMember({ item, index})}
                            className={
                              " trans-a pointer flex flex-row-ns flex-row items-center justify-between  w-100-s bn-ns bb b--black-05 pa3 hover-bg-white-70  w-100"
                            }
                          >
                         <div
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "100px",
                              background: item.profile.picture.length
                                ? "url(" + item.profile.picture + ")"
                                : GeoPattern.generate(
                                  item.profile.picture
                                ).toDataUrl()
                            }}
                            className="cover bg-center"
                          />
                          <div
                            className={
                              " flex flex-row flex-auto -flex-column pt2-ns- pl3  flex f5 fw7 black-70 raleway "
                            }
                          >
                            <div className={"  flex    "}>
                              {item.profile.name.first}
                            </div>
                            <div className={" flex ml1"}>
                              {item.profile.name.last}
                            </div>
                          </div>

                          {this.state.inviteBusy[index] && (
                    <div className="flex flex-column h-100 items-center justify-center w-40">
                      {/* <Spinner size={25} /> */}
                      <div className="sp sp-3balls"></div>
                    </div>
                  )}

                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* <div className="form-row flex flex-column">

                <label className="f6 fw5 black-50 pb2">Project Location (city)</label>

                <LocationSearchBar
                  location={this.state.location}
                  findLocation={this.findLocation}
                  fetchProjects={this.fetchProjects2}
                />

              </div> */}

              {/* <div className="form-row flex flex-column pt4 w-100">
                <label className="f6 fw5 black-50 pb2">Project Type</label>

                <select
                  className="flex flex-column ph3 pv3 bn br1 bg-white black-50 f4 fw5 bs-a w-100"
                  // defaultValue="commercial"                
                  onChange={(e) => this.handleChange(e)}>

                  <option value="">Select</option>
                  <option value="commercial">Commercial</option>
                  <option value="film">Film</option>
                  <option value="film">Documentary</option>

                </select>

              </div> */}

              {/* <div className="form-row flex flex-column pt4 w-100">
                <label className="f6 fw5 black-50 pb2">Availability Date Range</label>

                <RangePicker
                  className="bs-a f4 fw5"
                  onChange={this.handleRangeChange}
                  // defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                  format={dateFormat}
                />
              </div> */}
            </div>
          </div>
        </div>

        {/* <div className="Buttons flex flex-row justify-between center w-100">

          <div className="flex flex-column w-100 pa4 bg-white">

            <button
              onClick={this.searchProjects}
              className={("br1- round bs-b bg-black-20 ph3 pv2 pointer bn relative  ")} >

              <span className="f4 fw5 white pv2 flex items-center justify-center">

                {this.state.buttonLoading
                  ? <Icon icon="loading" className={' absolute right-0 f4 black-60 mr2'} />
                  : <Icon icon="search" iconSize={15} className={(' f4 white mr3')} />} Search</span>
            </button>

          </div>

        </div> */}
      </div>
    );
  }
}
export default FormInvite;
