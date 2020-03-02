import React from 'react';
import OnboardingForm from './OnboardingSteps';
import './style.css';

import { Steps, Icon, Button, message } from 'antd';
import { Checkbox } from 'antd';
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
const plainOptions = ['Mexican', 'American', 'Italian', 'South African', 'Greek', 'Portuguese', 'Chinese', 'Turkish', 'Thai'];
class OnboardingProfileChef_Extended extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      cuisines: [],
      cuisines_: [{}],
      role: "",
      skills: [],
      skills_: [{}],
      value: ''
    };

    console.log('OnboardingScreen props', props)
    
    this.insertSkill = this.insertSkill.bind(this)
    this.addSkillInput = this.addSkillInput.bind(this)
    this.saveStep3 = this.saveStep3.bind(this)
    this.specOnChange = this.specOnChange.bind(this)

    this.role = React.createRef()

  }
  saveStep3() {
    
    let role = this.role.current.value;
    let skills = this.state.skills;
    let data = { role, skills };
    console.log('saveStep3 data ',data)
    this.props.saveStep3(data);
    this.props.next()
  }
  
  insertSkill(item) {
    let skills = this.state.skills;
    skills.push(item)
    this.setState({ skills: skills })
  }
  addSkillInput() {
    let skills_ = this.state.skills_;
    skills_.push({});
    this.setState({ skills_: skills_ })
  }
  specOnChange(data) {
    const {e, index} = data;
    let skills = this.state.skills;
    skills[index] = e.target.value;
    this.setState({
      skills
    })
    console.log(this.state);
    
  }
  
  componentDidMount() {
  }
  render() {
    
    return (
      <div id="StepsForm">
        <div className="flex flex-column ma0" id="">
          <div className="form-row flex flex-column pb3 pt2">
            <div className="form-row flex flex-column">
              <div className="form-row flex flex-column pt4">
                <label className="f7 fw6 black-90 pb2">Your Preferred Role</label>
                <input 
                required={true}
                ref={this.role}
                type={'text'} className="flex flex-column ph3 pv3 bn br1 bg-white black-50 f4 fw5 bs-a" />
                {/* <Checkbox.Group required={true} options={plainOptions} onChange={this.onChange} /> */}
              </div>

            </div>
            <div className="form-row flex flex-column">
              <div className="form-row flex flex-column pt4">
                <label className="f7 fw6 black-90 pb2">Skills</label>
                <div className="flex flex-column flex-wrap">
                {
                  this.state.skills_.map((item, index) => (
                    <div className="flex pb2 w-100">
                      <input
                      required={true}
                        onChange={(e) => this.specOnChange({ e, index})}
                        defaultValue={this.state.skills[index]}
                        type={'text'} className="w-100 flex flex-row ph3 pv2 bn br1 bg-white black-50 f4 fw5 bs-a" />
                    </div>
                  ))
                }
                </div>
              </div>
              <div className="form-row flex flex-row pt2">
                <button onClick={this.addSkillInput} 
                className="bn br1 bg-black-30 f7 fw5 white pv1 ph2">Add +</button>
              </div>
            </div>

          </div>

        </div>

        <div className="Buttons flex flex-row justify-between mt4 mw5 center w-100">

<div className="flex flex-column w-100">
  <button
    onClick={this.saveStep3}
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
export default OnboardingProfileChef_Extended;