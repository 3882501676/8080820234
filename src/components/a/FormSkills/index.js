// @flow
import React, { Component } from "react";
import PropTypes from "prop-types";

class FormSkills extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      skills: [],
      skills_: [{}],
      buttonLoading: false
    };

    this.bio = React.createContext();
    this.submit = this.submit.bind(this);

    this.insertSkill = this.insertSkill.bind(this);
    this.addSkillInput = this.addSkillInput.bind(this);
    this.specOnChange = this.specOnChange.bind(this);
  }

  insertSkill(item) {
    let skills = this.state.skills;
    skills.push(item);
    this.setState({ skills: skills });
  }
  addSkillInput() {
    let skills_ = this.state.skills_;
    skills_.push({});
    this.setState({ skills_: skills_ });
  }
  specOnChange(data) {
    const { e, index } = data;
    let skills = this.state.skills;
    skills[index] = e.target.value;
    this.setState({
      skills
    });
    console.log(this.state);
  }

  submit() {
    this.setState({
      buttonLoading: true
    })
    setTimeout(() => {

      let skills = this.state.skills;
    this.props.updateSkills(skills);
    },1000)

   
    // console.log(this.bio.current.value)
  }

  componentDidMount = () => {
    // console.log("FormBio mounted");
    let skills_ = [];
    for(let item of this.props.skills) {
      skills_.push({})
    }
    this.setState({
      skills: this.props.skills,
      skills_: skills_
    });
  };



  render() {
    // if (this.state.hasError) {
    //   return <h1>Something went wrong.</h1>;
    // }

    return (
      <div className="FormBio-wrapper" className="flex w-100">
        <div className="flex-column flex w-100">
          <div className=" flex w-100 pa4-">
            <div className="form-row flex flex-column pa4 w-100">
              <div className="form-row flex flex-column pb2 w-100">
                <label className="f5 fw5 black-50 pb2">Skills</label>
                <div className="flex flex-column flex-wrap w-100">
                  {this.state.skills_.map((item, index) => (
                    <div className="flex pb2 w-100">
                      <input
                        required={true}
                        onChange={e => this.specOnChange({ e, index })}
                        defaultValue={this.state.skills[index]}
                        type={"text"}
                        className="ttc w-100 flex flex-row ph3 pv3 bn br1 bg-white black-50 f4 fw5 bs-a-"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-row flex flex-row pt2 w-100">
                <button
                  onClick={this.addSkillInput}
                  className="bn br1 bg-black-30 f5 fw5 white pv1 ph2"
                >
                  Add +
                </button>
              </div>
            </div>
          </div>

          <div className="form-row flex w-100 bg-white ph4 pv4 bs-b">
            <div
              onClick={this.submit}
              className="bg-black-20 round tc w-100 pointer flex button flex-column ph3 pv3 ba- -b--black-10 f4 fw6 white -black-50"
            >
              {this.state.buttonLoading && (
                <div className="flex flex-column pv2 items-center justify-center">
                  {/* <Spinner size={25} /> */}
                  <div className="sp sp-3balls"></div>
                </div>
              )}

              {!this.state.buttonLoading && <div>Save</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// FormBio.PropTypes = {

// }

// FormBio.defaultProps = {

// }

export default FormSkills;
