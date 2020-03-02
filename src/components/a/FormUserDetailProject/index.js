// @flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import { app } from "../../../utils/fn/Fn.js";
import { message } from "antd";

export default class FormUserDetailProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      buttonLoading: false,
      address: null,
      phone: null
    };

    this.address = React.createContext();
    this.phone = React.createContext();

    this.submit = this.submit.bind(this);
  }

  async submit() {
    message.config({
      top: "40vh"
      // duration: 1000,
      // maxCount: 3,
    });
    message.loading("Saving user..", 0);

    this.setState({
      buttonLoading: true
    });
    setTimeout(async () => {
      // this.props.submitBio()
      let selectedUserId = this.props.user.id;

      let project = this.props.project;

      let selectedProdCrewMember = project.productionCrew.filter(
        a => a.user === selectedUserId
      )[0];

      console.log("selectedProdCrewMember", selectedProdCrewMember);

      selectedProdCrewMember.projectSpecificDetails = {
        address: this.address.current.value,
        phone: this.phone.current.value
      };

      let userIndex = project.productionCrew.findIndex(
        a => a.user === selectedUserId
      );

      project.productionCrew[userIndex] = selectedProdCrewMember;

      console.log("updated project with production crew detail", project);

      await app.updateProject({ self: this, project }).then(response => {
        this.setState({
          buttonLoading: false
        });
        message.destroy();
        message.success("User Updated", 1000);
        setTimeout(() => {
          message.destroy();
        }, 1000);
      });
    }, 1000);

    // console.log(this.bio.current.value)
  }

  componentDidMount = () => {
    // alert('user detail mounted')
    console.log("FormBio mounted");
    let project = this.props.project;
    let selectedUserId = this.props.user.id;

    let selectedProdCrewMember = project.productionCrew.filter(
      a => a.user === selectedUserId
    )[0];

    this.setState({
      phone: selectedProdCrewMember.projectSpecificDetails.phone,
      address: selectedProdCrewMember.projectSpecificDetails.address
    });
  };

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return (
      <div
        className="FormBio-wrapper"
        className="flex flex-column w-100 h-100 bg-white"
      >
        <div className="flex-column flex w-100 pa4 h-100-">
          <div className=" flex w-100 items-center mb4">
            <label className="f5 fw6 black-20 pb3- tl mr4 w-30">Address</label>
            <input
              type={"text"}
              placeholder={"Enter your address during the project"}
              ref={this.address}
              defaultValue={this.state.address}
              className="flex flex-column ph4 pv3 br2 -round bg-black-05- white- black-50 f4 fw5 bs-a- w-100 bg-white ba b--black-05"
            />
          </div>
          <div className=" flex w-100 items-center mb4">
            <label className="f5 fw6 black-20 pb3- tl mr4 w-30">
              Contact Number
            </label>
            <input
              type={"text"}
              placeholder={"Enter your contact number"}
              ref={this.phone}
              defaultValue={this.state.phone}
              className="flex flex-column ph4 pv3 br2 -round bg-black-05- white- black-50 f4 fw5 bs-a- w-100 bg-white ba b--black-05"
            />
          </div>
        </div>

        <div className="form-row flex w-100 bg-white- ph4 pv4">
          <div
            onClick={this.submit}
            className="bg-black-20 round tc w-100- pointer flex button flex-column ph5 pv2 ba- -b--black-10 f4 fw6 white -black-50"
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
    );
  }
}

// export default FormBio;
