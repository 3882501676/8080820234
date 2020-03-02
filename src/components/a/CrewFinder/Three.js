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
const positions = [
  {
    title: "Select"
  },
  {
    title: "Unit Production Manager"
  },
  {
    title: "Line Producer"
  },
  {
    title: "Production Manager"
  },
  {
    title: "Director"
  },
  {
    title: "Assistant Director"
  },
  {
    title: "2nd Assistant Director"
  },
  {
    title: "Continuity Person"
  },
  {
    title: "Cinematographer"
  },
  {
    title: "Gaffer"
  },
  {
    title: "Camera Operator"
  },
  {
    title: "Assistant Cameraman"
  },
  {
    title: "Film Loader"
  },
  {
    title: "Steadycam Operator"
  },
  {
    title: "Production Sound Mixer"
  },
  {
    title: "Boom Operator"
  },
  {
    title: "Key Grip"
  },
  {
    title: "Dolly Grip"
  },
  {
    title: "Best Boy"
  },
  {
    title: "Visual Effects Director"
  },
  {
    title: "FX Coordinator"
  },
  {
    title: "Property Master"
  },
  {
    title: "Leadman"
  },
  {
    title: "Set Dresser"
  },
  {
    title: "Costumer"
  },
  {
    title: "Make-up Artist"
  },
  {
    title: "Body Make-up Artist"
  },
  {
    title: "Hairdresser"
  },
  {
    title: "Production Assistant"
  },
  {
    title: "Production Office Coordinator"
  },
  {
    title: "Unit Publicist"
  },
  {
    title: "Second Unit Director"
  },
  {
    title: "Production Caterer"
  },
  {
    title: "Craft Services"
  },
  {
    title: "Transportation Coordinator"
  },
  {
    title: "Day Player"
  }
]
const plainOptions = ['Mexican', 'American', 'Italian', 'South African', 'Greek', 'Portuguese', 'Chinese', 'Turkish', 'Thai'];

class Three extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      cuisines: [],
      cuisines_: [{}],
      role: "",
      skills: [],
      skills_: [],
      value: '',
      buttonLoading: false,
      submitLoading: false
    };

    console.log('OnboardingScreen props', props)
    // this.insertCuisine = this.insertCuisine.bind(this)
    // this.onChange = this.onChange.bind(this)
    this.insertSkill = this.insertSkill.bind(this)
    this.addSkillInput = this.addSkillInput.bind(this)
    // this.rate = React.createRef();
    this.saveStep3 = this.saveStep3.bind(this)
    this.specOnChange = this.specOnChange.bind(this)
    console.log('OnboardingScreen props', props)
    this.reset = this.reset.bind(this)
    this.role = React.createRef()

  }
  
  reset() {
    window.localStorage.clear()
    // this.context.history.push('/')
    window.location.href = "/"
  }
  saveStep3() {
    // let cuisines = this.state.cuisines;
    // let role = this.role.current.value;
    this.setState({
      buttonLoading: true
    })
    
    let skills = this.state.skills;
    let data = { positions: skills };
    console.log('saveStep3 data ', data)

    setTimeout(() => {
      this.props.saveStep3(data);
      this.props.next()
      this.setState({
        buttonLoading: true
      })

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
    },1000)
  }
  // onChange(checkedValues) {
  //   console.log('checked = ', checkedValues);
  //   this.setState({cuisines: checkedValues})
  // }
  // role()/
  // insertCuisine(cuisine) {
  //   let cuisines = this.state.cuisines;
  //   cuisines.push(cuisine)
  // }
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
    const { e, index } = data;
    let skills = this.state.skills;
    skills[index] = e.target.value;
    this.setState({
      skills
    })
    console.log(this.state);

    // let 
  }

  // onChange = e => {
  //   console.log('radio checked', e.target.value);
  //   this.setState({
  //     value: e.target.value,
  //   });
  // };
  componentDidMount() {

    // new Array(this.props.project.positions.length).fill({})
    if(this.props.project && this.props.project.hasOwnProperty('positions')) {
      let positions = this.props.project.positions;
      let p = []
      let a = []
      for(let item of positions){
        p.push(item.title)
        a.push({})
      }
      console.log(a,p)
      this.setState({
        skills: p,
        skills_: a
      })
    }
    
  }
  render() {
    // const { current } = this.state;
    return (
      <div id="StepsForm">
        <div className="flex flex-column ma0" id="">
          <div className="form-row flex flex-column pb3 pt2">
            {/* <div className="form-row flex flex-column">
              <div className="form-row flex flex-column pt4">
                <label className="f7 fw6 black-90 pb2">Your Crew Role</label>
                <input 
                required={true}
                ref={this.role}
                type={'text'} className="flex flex-column ph3 pv3 bn br1 bg-white black-50 f4 fw5 bs-a" />
                <Checkbox.Group required={true} options={plainOptions} onChange={this.onChange} />
              </div>

            </div> */}
            <div className="form-row flex flex-column">
              <div className="form-row flex flex-row items-end pt4">
                <label className="f5 fw6 black-50 tl mr4 pb4 w-30">Crew Needed</label>
                <div className="flex flex-column flex-wrap w-100">
                  {
                    this.state.skills_.map((item, index) => (
                      <div className="flex pb3 w-100">
                        <select
                          // required={true}
                          onChange={(e) => this.specOnChange({ e, index })}
                          value={this.state.skills[index]}
                          // type={'text'} 
                          className="w-100 flex flex-row ph4 pv3 bn round -br1 bg-white black-50 f4 fw5 -bs-a"
                        >
                          
                          {
                            positions.map((item, index) => (
                              <option value={item.title}>{item.title}</option>
                            ))
                          }

                        </select>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className="form-row flex flex-row pt2">
                <button onClick={this.addSkillInput}
                  className="pointer ba b--black-05 br1- round -bg-black-10- bg-transparent f5 fw6 white- black-60 pv3 ph3 w-100">Add +</button>
              </div>
            </div>

          </div>

        </div>

        <div className="Buttons flex flex-row justify-center mt4">

          <div className="flex flex-column w-100">

            <button
              onClick={this.saveStep3}
              className={" round -br1 bs-b bg-black-10 ph3 pv3 pointer bn relative w-100   "} >

              <span className="f4 fw6 black-30- white -white pv2 flex items-center justify-center">

                { !this.state.buttonLoading && "Next" }
              
                { this.state.buttonLoading && 
                  <div className="flex mr3 pv2">
                    <div className="sp sp-3balls"></div>
                  </div>
                }
                </span>

            </button>

            {
              this.props.current > 0 && <div className="flex flex-column w-100 ">
                <span onClick={this.props.prev} className="f6 fw5 black-30 pt3 ttu flex items-center justify-center">
                  go back to previous step
                </span>

              </div>
            }

            <div className="flex flex-row items-center justify-center w-100">
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
export default Three;