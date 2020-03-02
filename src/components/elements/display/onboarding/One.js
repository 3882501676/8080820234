import React from 'react';
import OnboardingForm from './OnboardingSteps';
import './style.css';

// import Filepond from '../../upload/Filepond.js';

import { Steps, Icon, Button, message } from 'antd';
import { DatePicker, TimePrecision } from "@blueprintjs/datetime";
import LocationSearchBar from '../forms/LocationSearchBar.js';
import { Fn } from '../../../../utils/fn/Fn.js';
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
class OnboardingProfileChef_Rate extends React.Component {
  constructor(props) {
    
    super(props)

    this.state = {
      current: 0,
      dob: ''
    }

    this.rate = React.createRef();
    this.saveStep1 = this.saveStep1.bind(this)
    // this.handleDateChange = this.handleDateChange.bind(this)
    console.log('OnboardingScreen props', props)

    // this.firstname = React.createContext()
    // this.lastname = React.createContext()
    // this.role = React.createContext()
    // this.dob = React.createContext()
    // this.gender = React.createContext()
    // this.location = React.createContext()

  }
  // handleDateChange(e) {
  //   console.log(e)
  //   this.setState({dob: e.toString()})
  // }
  saveStep1() {
    let location = Fn.get('location');
    // let currency = getGlobal().baseCurrency;
    // let rate = parseInt(this.rate.current.value);
    let data = { location };
    this.props.saveStep1(data);
    this.props.next()
  }
  componentDidMount() {
  }
  render() {
    let location = Fn.get('location');
    let city;
    if(typeof location.County !== "undefined") {
      city = location.County
    }
    else if(typeof location.address.County !== "undefined") {
      city = location.address.County
    }
    else {
      city = ''
    }

    // const { current } = this.state;
    return (
      <div id="StepsForm">

        
        <div className="flex flex-column ma0 h5" id="">
          <div className="form-row flex flex-column pb3 pt2">
            <div className="form-row flex flex-column">       


              <div className="form-row flex flex-column pt4">
                <label className="f7 fw6 black-90 pb2">Your Home City</label>
                <LocationSearchBar 
                location={city}
                />
                {/* <input
                  required={true}
                  defaultValue={getGlobal().location.County}
                  type={'text'} className="flex flex-column ph3 pv3 bn br1 bg-white black-50 f4 fw5 bs-a" /> */}
              </div>


            </div>
            
          </div>

        </div>
        <div className="Buttons flex flex-row justify-between mt4 mw5 center w-100">

          <div className="flex flex-column w-100">
            <button
              onClick={this.saveStep1}
              className={(" br1 bs-b bg-black ph3 pv2 pointer bn relative    ")} >
              <span className="f5 fw5 white pv2 flex items-center justify-center">
                {this.state.buttonLoading ? <Icon type="loading" className={' absolute right-0 f4 black-60 mr2'} /> : <Icon type="swap-right" className={(' f4 black-60 mr2 absolute right-0')} />} Next</span>
            </button>

            {
              this.props.current > 0 && <div className="flex flex-column w-100 ">
                <span onClick={this.props.prev} className="pointer f6 fw5 black-30 pv2 flex items-center justify-center">
                  go back to previous step
                          </span>

              </div>
            }
          </div>

        </div>
      </div>
    )
  }
}
export default OnboardingProfileChef_Rate;