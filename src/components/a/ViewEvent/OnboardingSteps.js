import React from 'react';
import OnboardingForm from './OnboardingSteps';
import './style.css';
import { Fn } from '../../../utils/fn/Fn';
// import OnboardingAccountType from './__AccountType';
// import OnboardingProfileUser from './__ProfileUser';
import Two from './Two';
import One from './One';
import Three from './Three';
import { Steps, Button, message } from 'antd';
// import { useReducer } from "react";

const { Step } = Steps;



class OnboardingSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // current: 0,
      // location: getGlobal().location,
      // currency: getGlobal().baseCurrency,
      // grade: 0,
      // mobileNumber: '',
      // bio: '',
      // specialties: [],
      // cuisines: [],
      // firstname: '',
      // lastname: '',
      // positions: []
    }

    console.log('OnboardingScreen props', props)

    // this.prev = this.prev.bind(this)
    // this.next = this.next.bind(this)
    // this.saveStep1 = this.saveStep1.bind(this)
    // this.saveStep2 = this.saveStep2.bind(this)
    // this.saveStep3 = this.saveStep3.bind(this)

  }
  // saveStep1(data) {
  //   const { location, projectType, projectDate, projectName } = data;
  //   this.setState({ location, projectType, projectDate, projectName })  
  // }
  // saveStep2(data) {
  //   const { mobileNumber, bio, grade, firstname, lastname, dob, gender } = data;
  //   this.setState({ mobileNumber, bio, grade, firstname, lastname, gender, dob }) 
    
  //   return this.props.saveOnboardingData({
  //     location: this.state.location,      
  //     mobileNumber: this.state.mobileNumber,
  //     bio: this.state.bio,
  //     positions: this.state.positions,
  //     // role: role,
  //     grade: this.state.grade,
  //     firstname: this.state.firstname,
  //     lastname: this.state.lastname,
  //     gender: this.state.gender,
  //     dob: this.state.dob
  //   })  

  // }
  // saveStep3(data) {
  //   const { positions } = data;
  //   // console.log(data)
  //   this.setState({ positions: positions })

  //   return this.props.saveOnboardingData({
  //     location: this.state.location,      
  //     projectName: this.state.projectName,
  //     projectDate: this.state.projectDate,
  //     projectType: this.state.projectType,
  //     positions: positions
  //   })
  // }
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
  
    // const { current } = this.state;

    return (

      <div>
     
        {         
            <>
              
              <div className="steps-content pb4">

                    <One
                      searchProjects={this.props.searchProjects}
                    />  

              </div>

            </>          
        }       

      </div>

    )
  }
}
export default OnboardingSteps;