// @flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import { formClassnames } from '../../../utils/ui/classses.js';


// bg-white bs-b hover-bg-black-10 br3 -round tc w-100 pointer flex button flex-column ph3 pv3 ba- -b--black-10 f4 fw6 white- black -black-50 hover-scale-1 trans-a

class FormLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      demoUser: {
        email: "demo@example.com",
        password: "password1"
      },
      buttonLoading: false
    };

    this.email = React.createContext();
    this.password = React.createContext();

    this.submit = this.submit.bind(this);
  }

  submit() {

    this.setState({
      buttonLoading: true
    })
    
    console.log(
      "[[ Login values ]]",
      this.password.current.value,
      this.email.current.value
    )

    this.props.submitLoginForm({
      type: this.props.type,
      email: this.email.current.value,
      password: this.password.current.value
    })
    

    // this.props.submitLogin()
    // console.log(this.bio.current.value)
  }

  componentDidMount = () => {
    console.log(" ");
    console.log(" ");
    console.log("Login Form mounted", this.props);
    console.log(" ");
  };

  static getDerivedStateFromError(error) {
    // getDerivedStateFromError -> Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
  }

  getDerivedStateFromProps = (nextProps, prevState) => {
    // console.log('FormBio getDerivedStateFromProps', nextProps, prevState);
  };

  getSnapshotBeforeUpdate = (prevProps, prevState) => {
    // console.log('FormBio getSnapshotBeforeUpdate', prevProps, prevState);
  };

  componentDidUpdate = () => {
    // console.log('FormBio did update');
  };

  componentWillUnmount = () => {
    // console.log('FormBio will unmount');
  };

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return (
      <div id="form-login-wrapper" className="flex flex-column w-100 mw5-">
        <div className="flex-column flex w-100 ph5 pt5 pb4">
          <div className=" flex flex-row items-center w-100 mb4">
            <label className="f5 fw5 black-30 pb2- w-30 pr3 ">Email</label>

            <input
              type={"email"}
              // placeholder={''}
              ref={this.email}
              defaultValue={this.state.demoUser.email}
              className={ formClassnames.inputSquare() }
            />
          </div>

          <div className=" flex flex-row items-center w-100 mb4 ">
            <label className="f5 fw5 black-30 pb2- w-30 pr3 ">Password</label>

            <input
              type={"password"}
              // placeholder={''}
              ref={this.password}
              defaultValue={this.state.demoUser.password}
              className={ formClassnames.inputSquare() }
            />
          </div>

          
        </div>
        <div className=" flex w-100 bt b--black-05">
            {this.props.dialogType === "login" && (
              <div
                onClick={this.props.setDialogToRegister}
                className="pointer flex flex-row black-40 f5 fw4 pt3 ph5 pv3 justify-center tc items-center w-100"
              >
                Don't have an account?{" "}
                <span className="black-40 fw6 ml2">Register</span>
              </div>
            )}

            {this.props.dialogType === "register" && (
              <div
                onClick={this.props.setDialogToLogin}
                className="pointer flex flex-row black-40 f5 fw4 pt3 ph5 pv3 justify-center tc items-center w-100"
              >
                Already have an account?{" "}
                <span className="black-40 fw6 ml2">Sign In</span>
              </div>
            )}
          </div>
        <div className={"form-row ttc flex w-100 bg-white ph4 pv4 bs-b " + formClassnames.loginv2()}>
          <div
            onClick={this.submit}
            className={ "" }
            // className="bg-black-20 hover-bg-black-10 round tc w-100 pointer flex button flex-column ph3 pv3 ba- -b--black-10 f4 fw6 white -black-50"
          >
            {this.state.buttonLoading && (
              <div className="flex flex-column justify-center items-center pv2 ph4">
                {/* <Spinner size={25} /> */}
                <div className="sp sp-3balls"></div>
              </div>
            )}

            {!this.state.buttonLoading && this.props.dialogType}
          </div>
        </div>

        {/* <div className="form-row flex w-100 bg-white ph4 pv4 bs-b">
          <div
            onClick={this.submit}
            className="bg-black round tc w-100 pointer flex button flex-column ph3 pv3 ba- -b--black-10 f4 fw6 white -black-50"
          >
            Submit
          </div>
        </div> */}
      </div>
    );
  }
}

export default FormLogin;
