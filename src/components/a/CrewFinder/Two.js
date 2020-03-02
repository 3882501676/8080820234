import React from 'react';
import OnboardingForm from './OnboardingSteps';
import './style.css';

import { Steps, Icon, Button, message } from 'antd';
import { DatePicker, TimePrecision } from "@blueprintjs/datetime";
import { Fn } from '../../../utils/fn/Fn.js';
const { Step } = Steps;

const steps = [
  {
    title: 'First',
    content: 'First-content',
  },
  {
    title: 'Second',
    content: 'Second-content',
  },
  {
    title: 'Last',
    content: 'Last-content',
  },
];
class Two extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      dob: ''
    };

    console.log('OnboardingScreen props', props)
    this.mobileNumber = React.createRef()
    this.bio = React.createRef()
    this.grade = React.createRef()
    this.firstname = React.createRef()
    this.lastname = React.createRef()
    this.gender = React.createRef()

    
    this.saveStep2 = this.saveStep2.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    console.log('OnboardingScreen props', props)
    this.reset = this.reset.bind(this)

  }
    handleDateChange(e) {
    console.log(e)
    this.setState({dob: e.toString()})
  }
  reset(){
    window.localStorage.clear()
    // this.context.history.push('/')
    window.location.href = "/"
  }
  saveStep2() {

    let mobileNumber = this.mobileNumber.current.value;
    let bio = this.bio.current.value;
    let grade = this.grade.current.value;
    let firstname = this.firstname.current.value;
    let lastname = this.lastname.current.value;
    let gender = this.gender.current.value;
    let dob = this.state.dob;

    let data = { mobileNumber, bio, grade, gender, firstname, lastname, dob };
    this.props.saveStep2(data);
    this.props.next()

  }
  componentDidMount() {
  }
  render() {
    // const { current } = this.state;
    return (
      <div id="StepsForm">
        <div className="flex flex-column ma0" id="">
          <div className="form-row flex flex-column pb3 pt2">
          <div className="form-row flex flex-column">
              <div className="form-row flex flex-column pt4">
                <label className="f7 fw6 black-90 pb2">First Name</label>
                <input 
                required={true}
                ref={this.firstname}
                type={'text'} className="flex flex-column ph3 pv3 bn br1 bg-white black-50 f4 fw5 bs-a" />
              </div>
              <div className="form-row flex flex-column pt4">
                <label className="f7 fw6 black-90 pb2">Last Name</label>
                <input mobileNumber
                required={true}
                ref={this.lastname}
                type={'text'} className="flex flex-column ph3 pv3 bn br1 bg-white black-50 f4 fw5 bs-a" />
              </div>

            </div>
            
            <div className="form-row flex flex-column">
              <div className="form-row flex flex-column pt4">
                <label className="f7 fw6 black-90 pb2">Mobile Phone</label>
                <input 
                required={true}
                ref={this.mobileNumber}
                type={'number'} className="flex flex-column ph3 pv3 bn br1 bg-white black-50 f4 fw5 bs-a" />
              </div>

            </div>
            <div className="form-row flex flex-column">
              <div className="form-row flex flex-column pt4">
                <label className="f7 fw6 black-90 pb2">Gender</label>
                <input 
                required={true}
                ref={this.gender}
                type={'text'} className="flex flex-column ph3 pv3 bn br1 bg-white black-50 f4 fw5 bs-a" />
              </div>

            </div>
            <div className="form-row flex flex-column">
              <div className="form-row flex flex-column pt4">
                <label className="f7 fw6 black-90 pb2">Enter your grade</label>
                <input 
                required={true}
                ref={this.grade}
                type={'number'} className="flex flex-column ph3 pv3 bn br1 bg-white black-50 f4 fw5 bs-a" />
              </div>

            </div>
            <div className="form-row flex flex-column">
              <div className="form-row flex flex-column pt4">
                <label className="f7 fw6 black-90 pb2">Bio</label>
                <textarea
                required={true}
                ref={this.bio}
                rows={4} 
                type={'text'}
                className="flex flex-column ph3 pv3 bn br1 bg-white black-50 f4 fw5 bs-a" />
              </div>
            </div>

            {/* <div className=" flex flex-column w-100 mb3">

                <span className="flex flex-column f6 fw5 black-60 pb3 pt3">Your Date of Birth</span>

                <DatePicker
                  minDate={new Date('01/01/1940')}
                  // defaultValue={typeof this.props.value.dob !== "undefined" && this.props.value.dob.length > 0 ? new Date(this.props.value.dob) : null} className={''} 
                  onChange={this.handleDateChange} 
                  />

            </div> */}

          </div>
          
        </div>
        <div className="Buttons flex flex-row justify-between mt4 mw5 center w-100">

          <div className="flex flex-column w-100">
          <button
              onClick={this.saveStep2}
              className={(" br1 bs-b bg-white ph3 pv1 pointer bn relative  ")} >
              <span className="f5 fw5 black-30 pv2 flex items-center justify-center">
                {this.state.buttonLoading ? <Icon type="loading" className={' absolute right-0 f4 black-60 mr2'} /> : <Icon type="swap-right" className={Fn.get('theme').config.theme.colorScheme.color + (' f4 black-60 mr2 absolute right-0')} />} Next</span>
            </button>

            {
              this.props.current > 0 && <div className="flex flex-column w-100 ">
                <span onClick={this.props.prev} className="f6 fw5 black-30 pv2 flex items-center justify-center">
                  go back to previous step
                          </span>

              </div>
            }
            <div className="flex flex-row w-100">
          <div 
          onClick={this.reset}
          className="pointer f5 fw6 black-50 pv2 mt2 mv4 ba b--black-05 ph3">Reset</div>
        </div>
          </div>

        </div>
      </div>
    )
  }
}
export default Two;