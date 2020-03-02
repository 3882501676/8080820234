import React from 'react';
import OnboardingForm from './OnboardingSteps';
import './style.css';

// import Filepond from '../../upload/Filepond.js';

import { DatePicker, Steps, Icon, Select, Button, message } from 'antd';
// import { DateRangeInput } from "@blueprintjs/datetime";
import moment from 'moment';
import LocationSearchBar from '../../elements/display/forms/LocationSearchBar.js';
import { Fn } from '../../../utils/fn/Fn.js';
import AccountContext, { AccountConsumer } from '../../../utils/context/AccountContext.js';
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';




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
class One extends React.Component {
  constructor(props) {

    super(props)

    this.state = {
      projectType: '',
      startDate: '',
      endDate: ''
    }

    // this.rate = React.createRef();
    // this.projectName = React.createRef()
    this.searchProjects = this.searchProjects.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleRangeChange = this.handleRangeChange.bind(this)
    // this.handleDateChange = this.handleDateChange.bind(this)

    console.log('OnboardingScreen props', props)
    this.reset = this.reset.bind(this)

  }
  reset(){
    window.localStorage.clear()
    this.context.history.push('/')
    window.location.reload()
  }
  handleRangeChange(e) {
    console.log(e)
    let startDate = e[0].toString()
    let endDate = e[1].toString()
    this.setState({
      startDate, endDate
    })
  }
  handleDateChange(e) {

    console.log(e)

    this.setState({ projectDate: e.toString() })

  }

  handleChange(e) {
    console.log(e.target.value);

    this.setState({
      projectType: e.target.value
    })

  }

  searchProjects() {

    let location = Fn.get('location')
    let projectType = this.state.projectType;
    let startDate = this.state.startDate;
    let endDate = this.state.endDate;

    let data = { location, projectType, startDate, endDate };
    this.props.searchProjects(data);

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

                <label className="f5 fw6 black-50 pb2">Project Location (city)</label>

                <LocationSearchBar
                  location={this.state.location}
                  findLocation={this.findLocation}
                  fetchProjects={this.fetchProjects2}
                />

              </div>

              <div className="form-row flex flex-column pt4 w-100">
                <label className="f5 fw6 black-50 pb2">Project Type</label>

                <select
                  required={true}
                  className="flex flex-column ph3 pv3 bn br1 bg-white black-50 f4 fw5 bs-a w-100"
                  // defaultValue="commercial"                
                  onChange={(e) => this.handleChange(e)}>

                  <option value="">Select</option>
                  <option value="commercial">Commercial</option>
                  <option value="film">Film</option>
                  <option value="film">Documentary</option>

                </select>

              </div>

              <div className="form-row flex flex-column pt4 w-100">
                <label className="f5 fw6 black-50 pb2">Availability Date Range</label>

          

                <RangePicker
                  required={true}
                  className="bs-a f4 fw5"
                  onChange={this.handleRangeChange}
                  // defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                  format={dateFormat}
                />
              </div>









            </div>

          </div>

        </div>

        <div className="Buttons flex flex-row justify-between mt4 center w-100 mb4">

          <div className="flex flex-column w-100">

            <button
              onClick={this.searchProjects}
              className={("br1 bs-b bg-black ph3 pv2 pointer bn relative  ")} >

              <span className="f5 fw5 white pv2 flex items-center justify-center">

                {this.state.buttonLoading ? <Icon type="loading" className={' absolute right-0 f4 black-60 mr2'} /> : <Icon type="swap-right" className={(' f4 black-60 mr2 absolute right-0')} />} Search</span>
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
        <div className="flex flex-row w-100">
          <div 
          onClick={this.reset}
          className="f5 fw6 black-50 pv2 mt2 mv4 ba b--black-05 ph3">Reset</div>
        </div>
      </div>
    )
  }
}
export default One;
One.contextType = AccountContext;