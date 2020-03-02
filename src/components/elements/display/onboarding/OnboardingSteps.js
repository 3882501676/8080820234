import React from 'react';
import OnboardingForm from './OnboardingSteps';
import './style.css';

import OnboardingAccountType from './__AccountType';
import OnboardingProfileUser from './__ProfileUser';
import Two from './Two';
import One from './One';
import Three from './Three';
import { Steps, Button, message } from 'antd';
// import { useReducer } from "react";

import { Fn } from '../../../../utils/fn/Fn.js';
const { Step } = Steps;



class OnboardingSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      location: Fn.get('location'),
      currency: Fn.get('baseCurrency'),
      grade: 0,
      mobileNumber: '',
      bio: '',
      specialties: [],
      cuisines: [],
      firstname: '',
      lastname: ''
    }

    console.log('OnboardingScreen props', props)

    this.prev = this.prev.bind(this)
    this.next = this.next.bind(this)
    this.saveStep1 = this.saveStep1.bind(this)
    this.saveStep2 = this.saveStep2.bind(this)
    this.saveStep3 = this.saveStep3.bind(this)

  }
  saveStep1(data) {
    const { location } = data;
    this.setState({ location })  
  }
  saveStep2(data) {
    const { mobileNumber, bio, grade, firstname, lastname, dob, gender } = data;
    this.setState({ mobileNumber, bio, grade, firstname, lastname, gender, dob })  
  }
  saveStep3(data) {
    const { role, skills } = data;
    // console.log(data)
    // this.setState({ role, skills })
    return this.props.saveOnboardingData({
      location: this.state.location,      
      mobileNumber: this.state.mobileNumber,
      bio: this.state.bio,
      skills: skills,
      role: role,
      grade: this.state.grade,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      gender: this.state.gender,
      dob: this.state.dob
    })  
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
    console.log('steps', this.props)
  }
  render() {
    let steps;

    const accountTypeIsSet = JSON.parse(localStorage.getItem('accountTypeIsSet'));
    const accountType = JSON.parse(localStorage.getItem('accountType'));

    if (accountType === "crew") {
      steps = [
        {
          title: 'Location',
          content: 'First-content',
        },
        {
          title: 'Personal',
          content: 'Second-content',
        },
        {
          title: 'Skills',
          content: 'Last-content',
        },
      ];
    }
    if (accountType === "production") {
      steps = [
        {
          title: 'Location',
          content: 'First-content',
        },
        {
          title: 'Personal',
          content: 'Second-content',
        },
        {
          title: 'Skills',
          content: 'Last-content',
        },
      ];
    }

    const { current } = this.state;

    

    return (
      <div className="flex flex-column w-100">
        {
          !accountTypeIsSet && (
            <><div className="flex flex-column raleway fw5">
              <h3 className="f5 fw3 black-30 tc pv0">welcome to</h3>
              <div className="flex flex-row flex-auto justify-center">
              <h3 className="tc pv3">
                <span className="flex ph3 ttu pv2 items-center logotext ttu spaced tracked ba b--black bw1 raleway f3 fw6 black">Crew20</span>
                </h3>
              </div>
              <h3 className="f5 fw3 black-30 tc pv4">Please choose your account type</h3>
            </div>
              <div className="flex flex-column br3 overflow-hidden">
                <OnboardingAccountType
                  setAccountType={this.props.setAccountType}
                />
              </div>

            </>
          )
        }
        {

          accountTypeIsSet && (
            <>
            <div className="flex flex-column pb5">
            <p className="f5 fw5 black-50 tc">Please tell us a bit about yourself.</p>
            </div>
              <Steps current={current}>
                {steps.map(item => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
              <div className="steps-content">

                {
                  this.state.current === 0 && (

                    <One
                      prev={this.prev}
                      next={this.next}
                      current={this.state.current}
                      saveStep1={this.saveStep1}
                    />

                  )
                }

                {
                  this.state.current === 1 && (

                    <Two
                      prev={this.prev}
                      next={this.next}
                      current={this.state.current}
                      saveStep2={this.saveStep2}
                    />

                  )
                }
                {
                  this.state.current === 2 && (

                    <Three
                      prev={this.prev}
                      next={this.next}
                      current={this.state.current}
                      saveStep3={this.saveStep3}
                    />

                  )
                }
              </div>

            </>
          )
        }

        {/* {

          accountTypeIsSet && this.props.newAccountType === "producer" && (
            <>
              <Steps current={current}>
                {steps.map(item => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
              <div className="steps-content">{steps[current].content}</div>
              <div className="steps-action">

                {
                  current === steps.length - 1 && (

                    <OnboardingProfileChef />

                  )
                }


                {
                  current > 0 && (

                    <OnboardingProfileChef_Rate />

                  )

                }

              </div>

            </>
          )
        } */}

      </div>
    )
  }
}
export default OnboardingSteps;