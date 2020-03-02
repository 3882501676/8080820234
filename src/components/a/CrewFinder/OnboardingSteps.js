import React from "react";
import OnboardingForm from "./OnboardingSteps";
import "./style.css";
import { Fn } from "../../../utils/fn/Fn";
// import OnboardingAccountType from './__AccountType';
// import OnboardingProfileUser from './__ProfileUser';
import Two from "./Two";
import One from "./One";
import Three from "./Three";
import { Steps, Button, message } from "antd";
// import { useReducer } from "react";

const { Step } = Steps;

class OnboardingSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      location: Fn.get("location"),
      currency: Fn.get("baseCurrency"),
      grade: 0,
      mobileNumber: "",
      bio: "",
      specialties: [],
      cuisines: [],
      firstname: "",
      lastname: "",
      positions: []
    };

    console.log("OnboardingScreen props", props);

    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.saveStep1 = this.saveStep1.bind(this);
    this.saveStep2 = this.saveStep2.bind(this);
    this.saveStep3 = this.saveStep3.bind(this);
  }
  saveStep1(data) {
    const {
      location,
      projectType,
      projectDate,
      projectEndDate,
      projectName
    } = data;
    this.setState({
      location,
      projectType,
      projectDate,
      projectEndDate,
      projectName
    });
    document.querySelector("body").scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
    document.querySelector("#OnboardingScreen").scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }
  saveStep2(data) {
    const { mobileNumber, bio, grade, firstname, lastname, dob, gender } = data;
    this.setState({
      mobileNumber,
      bio,
      grade,
      firstname,
      lastname,
      gender,
      dob
    });

    return this.props.saveOnboardingData({
      location: this.state.location,
      mobileNumber: this.state.mobileNumber,
      bio: this.state.bio,
      positions: this.state.positions,
      // role: role,
      grade: this.state.grade,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      gender: this.state.gender,
      dob: this.state.dob
    });
  }
  saveStep3(data) {
    const { positions } = data;
    // console.log(data)
    this.setState({ positions: positions });

    return this.props.saveOnboardingData({
      location: this.state.location,
      projectName: this.state.projectName,
      projectDate: this.state.projectDate,
      projectEndDate: this.state.projectEndDate,
      projectType: this.state.projectType,
      positions: positions
    });
  }
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  componentDidMount() {
    console.log("steps", this.props);
  }
  render() {
    let steps;

    steps = [
      {
        title: "Project Info",
        content: "First-content"
      },
      {
        title: "Crew",
        content: "Second-content"
      }
      // {
      //   title: 'Skills',
      //   content: 'Last-content',
      // },
    ];

    const { current } = this.state;
    return (
      <div className="flex flex-column flex-auto overflow-visible">
        {
          <>
            <Steps current={current}>
              {steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            <div className="steps-content">
              {this.state.current === 0 && (
                <One
                  type={this.props.type}
                  prev={this.prev}
                  next={this.next}
                  current={this.state.current}
                  saveStep1={this.saveStep1}
                />
              )}

              {this.state.current === 1 && (
                <Three
                  type={this.props.type}
                  prev={this.prev}
                  next={this.next}
                  current={this.state.current}
                  saveStep3={this.saveStep3}
                />
              )}

              {this.state.current === 2 && (
                <div className="flex flex-column w-100 ">
                  <span
                    onClick={this.prev}
                    className="f6 fw5 black-30 pt3 ttu flex items-center justify-center"
                  >
                    go back to previous step
                  </span>
                </div>
              )}

              {/* {
                  this.state.current === 2 && (

                    <Two
                      prev={this.prev}
                      next={this.next}
                      current={this.state.current}
                      saveStep2={this.saveStep2}
                    />                   

                  ) 
                } */}
            </div>
          </>
        }
      </div>
    );
  }
}
export default OnboardingSteps;
