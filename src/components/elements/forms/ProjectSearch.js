import React from 'react';
// import OnboardingForm from './OnboardingSteps';
import './style.css';

// import Filepond from '../../upload/Filepond.js';
import { Fn } from '../../../utils/fn/Fn.js';
import { DatePicker, Steps, Select, Button, message } from 'antd';
import { Icon } from "@blueprintjs/core";
import moment from 'moment';
import LocationSearchBar from '../../elements/display/forms/LocationSearchBar.js';
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
class FormProjectSearch extends React.Component {
  constructor(props) {

    super(props)

    this.state = {
      projectType: '',
      startDate: '',
      endDate: '',
      buttonLoading: false
    }

    // this.rate = React.createRef();
    // this.projectName = React.createRef()
    this.searchProjects = this.searchProjects.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleRangeChange = this.handleRangeChange.bind(this)
    // this.handleDateChange = this.handleDateChange.bind(this)

    console.log('OnboardingScreen props', props)

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

    this.setState({
      buttonLoading: true })

      let location = Fn.get('location');
      let projectType = this.state.projectType;
      let startDate = this.state.startDate;
      let endDate = this.state.endDate;
  
      let data = { location, projectType, startDate, endDate };
  
      setTimeout(() => {
        this.props.searchProjects(data);

      },1000)

  }

  componentDidMount() {
  }

  render() {
    // const { current } = this.state;
    return (
      <div id="ProjectSearchForm">
        <div className="flex flex-column ma0" id="">
          <div className="form-row flex flex-column">

            <div className="form-row flex flex-column pa4">

            <div className="f4 fw6 black-90 pb3">Project Search</div>

              <div className="form-row flex flex-row items-center">

                <label className="f4 fw4 black-20 pb3- tl mr4 w-30">Location (City)</label>

                <LocationSearchBar
                  location={this.state.location}
                  findLocation={this.findLocation}
                  fetchProjects={this.fetchProjects2}
                />

              </div>

              <div className="form-row flex flex-row items-center pt4 w-100">
                <label className="f4 fw4 black-20 pb3- tl mr4 w-30">Project Type</label>

                <select
                  className="flex flex-column ph4 pv3 bn br2- round bg-black-05- white- black-50 f4 fw5 bs-a- w-100 bg-white"
                  // defaultValue="commercial"                
                  onChange={(e) => this.handleChange(e)}>

                  <option value="">Select</option>
                  <option value="commercial">Commercial</option>
                  <option value="film">Film</option>
                  <option value="documentary">Documentary</option>

                </select>

              </div>

              <div className="form-row flex flex-row items-center pt4 w-100">
                <label className="f4 fw4 black-20 pb3- tl mr4 w-30">Date Range</label>

          

                <RangePicker
                  className="bs-a f4 fw5"
                  onChange={this.handleRangeChange}
                  // defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                  format={dateFormat}
                  className="flex flex-column ph4 pv3- bn br2- round bg-black-05- white- black-50 f4 fw5 bs-a- w-100 bg-white"
                />
              </div>









            </div>

          </div>

        </div>

        <div className="Buttons flex flex-row justify-between center w-100">

          <div className="flex flex-column w-100 pa4 bg-white">

            <button
              onClick={this.searchProjects}
              className={("br1- round bs-b bg-black-20 ph3 pv2 pointer bn relative  ")} >

              <span className="f4 fw5 white pv2 flex items-center justify-center">

              {this.state.buttonLoading && (
                    <div className="flex flex-column pv2 mr3 items-center">
                      {/* <Spinner size={25} /> */}
                      <div className="sp sp-3balls"></div>
                    </div>
                  )}
                  {
                    !this.state.buttonLoading && (
                      <>
                    <Icon icon="search" iconSize={15} className={(' f4 white mr3')} /> Search
                    </>
                    )
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
      </div>
    )
  }
}
export default FormProjectSearch;