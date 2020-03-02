import React from 'react';
import OnboardingForm from "./OnboardingSteps";
import "./style.css";

import { Steps, Button, message } from "antd";
import { Icon } from "@blueprintjs/core";
import { Checkbox } from "antd";
import { Fn, app } from "../../../utils/fn/Fn.js";
const { Step } = Steps;

const steps = [
  {
    title: "First",
    content: "First-content"
  },
  {
    title: "Second",
    content: "Second-content"
  },
  {
    title: "Last",
    content: "Last-content"
  }
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
];

const plainOptions = [
  "Mexican",
  "American",
  "Italian",
  "South African",
  "Greek",
  "Portuguese",
  "Chinese",
  "Turkish",
  "Thai"
];

class CrewFinder_People extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 0,
      cuisines: [],
      cuisines_: [{}],
      role: "",
      skills: [],
      skills_: [],
      value: "",
      crew: []
    };

    console.log("OnboardingScreen props", props);
    this.insertSkill = this.insertSkill.bind(this);
    this.addSkillInput = this.addSkillInput.bind(this);
    this.save = this.save.bind(this);
    this.reset = this.reset.bind(this);
    this.specOnChange = this.specOnChange.bind(this);
    this.search = this.search.bind(this);
    this.bulkSearch = this.bulkSearch.bind(this)
    console.log("FormCrew props", props);

    this.role = React.createRef();
  }
  bulkSearch() {

    let positions = this.state.skills;
    
    this.props.bulkSearch({ positions });

  }
  async search({ index, type }) {
    console.log(index, type);
    let positions = this.state.skills;
    let position = positions[index];
    // let a = await Fn.fetchUsers({ self: this, positions })
    this.props.search({ index, position, type });
  }
  reset() {
    // window.localStorage.clear()
    // this.context.history.push('/')
    // window.location.href = "/"
    this.setState({
      skills_: [],
      skills: []
    });
  }

  save() {
    // let cuisines = this.state.cuisines;
    // let role = this.role.current.value;
    let skills = this.state.skills;
    let data = { positions: skills };
    console.log("save data ", data);
    this.props.save(data);
    // this.props.next()
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
  async insertSkill(item) {
    let skills = this.state.skills;
    skills.push(item);
    this.setState({ skills: skills });
    
  }
  async addSkillInput() {
    let skills_ = this.state.skills_;
    skills_.push({});
    this.setState({ skills_: skills_ });
    // console.log('positions',skills_)
    // let positions = []
    // for(let item of skills_){
    //   let i = {

    //   }
    // }
  }
  async specOnChange(data) {
    const { e, index } = data;
    let skills = this.state.skills;
    skills[index] = e.target.value;
    this.setState({
      skills
    });
    console.log(this.state);
    let project = this.props.project;
    project.positions = skills;
    await app.updateProject({ self: this, project });
    // let
  }

  // onChange = e => {
  //   console.log('radio checked', e.target.value);
  //   this.setState({
  //     value: e.target.value,
  //   });
  // };
  componentDidMount() {
    let positions = this.props.project.positions;
    let p = [];
    let a = [];
    for (let item of positions) {
      p.push(item);
      a.push({});
    }
    console.log(a, p);
    this.setState({
      skills: p,
      skills_: a
    });
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
            <div className="form-row flex flex-column pt4">

              <div className="form-row flex flex-column  pa3 br4 ba b--black-05">
                {/* <label className="f5 fw6 black-50 pb2">Crew Needed</label> */}
                <div className="flex flex-row justify-between flex-wrap  col-3">
                  {this.state.skills_.map((item, index) => (
                    <div className="flex flex-column  w-100- mw6 mb3 ">
                      <div className="flex flex-row  br2 overflow-hidden ">
                        <select
                          // required={true}
                          onChange={e => this.specOnChange({ e, index })}
                          value={this.state.skills[index]}
                          // type={'text'}
                          className="w-100 flex flex-row ph3 pv3 bn br1 bg-white black-60 f4 fw5"
                        >
                          {positions.map((item, index) => (
                            <option value={item.title}>{item.title}</option>
                          ))}
                        </select>
                        <div className="flex flex-row items-center justify-center ph3 pv2 bg-white bl b--black-05">
                          <div className="flex br2 overflow-hidden">
                            <button
                              onClick={() =>
                                this.search({ index, type: "search" })
                              }
                              className="pointer ph3 pv2 bg-black-40 hover-bg-black  white f5 fw6"
                            >
                              <Icon
                                icon={"search"}
                                iconSize={15}
                                className=" white"
                              />
                            </button>
                            <button
                              onClick={() =>
                                this.search({ index, type: "search" })
                              }
                              className="pointer ph3 pv2 bg-black-40 hover-bg-black  white f5 fw6"
                            >
                              <Icon
                                icon={"trash"}
                                iconSize={15}
                                className=" white"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="form-row flex flex-row pt2">
                  <button
                    onClick={this.bulkSearch}
                    className="pointer bn br2 f5 fw6 bg-transparent black-50 pv3 ph3 w-100"
                  >
                    Bulk Search
                  </button>
                </div>

                <div className="form-row flex flex-row pt2">
                  <button
                    onClick={this.addSkillInput}
                    className="pointer bn br2 bg-black-05 hover-bg-black-10 f5 fw6 black-50 pv4 ph3 w-100"
                  >
                    Add +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="Buttons flex flex-row justify-between mt4">

          <div className="flex flex-column w-100-">

            <button
              onClick={this.save}
              className={("br1 bs-b bg-black ph5 pv2 pointer bn relative  ")} >

              <span className="f5 fw5 white pv2 flex items-center justify-center">

                {this.state.buttonLoading ? <Icon type="loading" className={' absolute right-0 f4 black-60 mr2'} /> : <Icon type="swap-right" className={(' f4 black-60 mr2 absolute right-0')} />} Save</span>
            </button>


            <div className="flex flex-row w-100">
              <div
                onClick={this.reset}
                className="pointer f5 fw6 black-50 pv2 mt2 mv4 ba b--black-05 ph3">Reset</div>
            </div>
          </div>

        </div> */}
      </div>
    );
  }
}
export default CrewFinder_People;
