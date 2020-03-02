import React from "react";
import { Redirect } from "react-router-dom";
import OnboardingSteps from "./OnboardingSteps";

import { Spinner, Dialog, Icon } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "./style.css";

import Fn from "../../../utils/fn/Fn.js";
import methods from "../../../utils/methods/index.js";
import moment from "moment";
import AccountContext, {
  AccountProvider
} from "../../../utils/context/AccountContext.js";
import { timeline } from "popmotion";
import { TH_LIST } from "@blueprintjs/icons/lib/esm/generated/iconNames";

export default class CrewFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: true,
      newAccountType: "",
      accountTypeIsSet: false,
      lat: "",
      long: "",
      city: "",
      location: {},
      country: "",
      countrySet: false,
      redirectProfile: false,
      crew: [],
      crew_: [],
      users: [],
      isOpen: false,
      activeUser: {},
      dialogTitle: "",
      drawerVisible: false,
      searchLoading: false
    };
    this.setAccountType = this.setAccountType.bind(this);

    this.saveOnboardingData = this.saveOnboardingData.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.avatar = this.avatar.bind(this);

    console.log("OnboardingScreen props", props);
  }

  openDialog(item) {
    console.log(item);
    let user = item.item;
    this.setState({
      isOpen: true,
      activeUser: user,
      dialogTitle: user.profile.name.first + " " + user.profile.name.last
    });
  }

  closeDialog() {
    this.setState({
      isOpen: false
    });
  }
  reset() {
    window.localStorage.clear();
    this.context.history.push("/");
    window.location.reload();
  }
  avatar(user) {
    // console.log('avatar ', user)
    // const user = data.user

    if (user && user.profile && user.profile.picture.length > 0) {
      return user.profile.picture;
    } else {
      return "/img/placeholder.png";
    }
  }

  async saveOnboardingData(data) {
    this.setState({
      searchLoading: true
    });
    console.log("saveOnboardingData data", data);

    const {
      location,
      projectName,
      projectDate,
      projectEndDate,
      projectType,
      positions
    } = data;

    data.hasBeenUploaded = false;

    localStorage.setItem("crewBuilder", JSON.stringify(data));

    let a = await Fn.fetchUsers({ self: this, positions });
  }

  setAccountType(data) {
    const { type } = data;

    console.log("setAccountType", data);

    this.setState({
      newAccountType: type,
      accountTypeIsSet: true
    });
  }

  async componentDidMount() {
    console.log("[[ OnboardingScreen props ]]", this.props);

    await Fn.getGeoLocation({ self: this });
  }

  render() {
    // if(this.state.redirectProfile) {
    //     return <Redirect to={'/profile'} />
    // }
    return (
      <div className="flex flex-column ma0 w-100 z-99 relative" id="">
        <div className="CrewFinder flex flex-row justify-between "></div>

        <div
          id="OnboardingScreen"
          className="fixed top-10vh left-0 flex flex-column pa4 bg-near-white vh-100 w-100 overflow-scroll"
        >
          <div className="flex flex-column items-center justify-start pt0 w-100 h-100">
            <div className="flex flex-column w-100" id="">
              <div className="form-row flex flex-column pb3 w-100">
                <div className="flex flex-column mw7 center w-100">
                  <div
                    id="SectionTitle"
                    className="flex flex-column ma0 w-100"
                    id=""
                  >
                    <div className="flex flex-column justify-center items-center pb4">
                      <h1 className="  f3 fw6 black-80 mt5 mb2 tc">
                        {this.props.type === "createProject"
                          ? "Create a Project"
                          : "Find Crew"}
                      </h1>
                      <h1 className=" f4 fw4 black-50 tc raleway">
                        Complete the wizard below to create a project and build
                        a crew list
                      </h1>
                    </div>

                    {this.props.type === "createProject" && (
                      <div className="flex flex-row items-center justify-center pb3 w-100">
                        <div
                          onClick={this.props.toggleCreateProject}
                          className="pointer f5 fw6 black-50 pv2 ba b--black-05 ph3"
                        >
                          Go back to projects
                        </div>
                      </div>
                    )}
                  </div>

                  <OnboardingSteps
                    type={this.props.type}
                    newAccountType={this.state.newAccountType}
                    accountTypeIsSet={this.state.accountTypeIsSet}
                    setAccountType={this.setAccountType}
                    saveOnboardingData={this.saveOnboardingData}
                  />

                  {this.state.searchLoading && (
                    <div className="flex flex-column pv5 ph3 items-center">
                      {/* <Spinner size={25} /> */}
                      <div className="sp sp-3balls"></div>
                    </div>
                  )}
                  <div className="crew-list flex flex-column mt3">
                    {!this.state.searchLoading &&
                      this.state.crew_.length === 0 && (
                        <>
                          <div
                            id=""
                            className="flex flex-row ph0 pb3 items-center justify-center"
                          >
                            <span className="f6 fw5 black-50 pv2 ph3 mv4 ba b--black-05">
                              There are no users that match your search
                            </span>
                          </div>
                          <div></div>
                        </>
                      )}
                    {!this.state.searchLoading &&
                      this.state.crew_.map((item, index) => (
                        <div className="flex flex-column pt3 pb4 bb b--black-05 bw1 mb2">
                          <div className="flex flex-row f5 fw5 black-40 pb3">
                            {item.position}{" "}
                            <span className="bg-black-10 white f7 fw6 br1 ph2 pv1 mb0 ml2">
                              {item.users.length}
                            </span>
                          </div>

                          <div className="flex flex-row">
                            {item.users.map((item_, index_) => (
                              <div
                                onClick={() =>
                                  this.props.openDialog({ item: item_ })
                                }
                                className={
                                  " pointer flex flex-column pv2 pr3 items-center justify-center"
                                }
                              >
                                <div
                                  style={{
                                    width: "100px",
                                    height: "120px",
                                    borderRadius: "5px",
                                    backgroundImage:
                                      "url(" + item_.profile.picture + ")"
                                  }}
                                  className="cover bg-center"
                                />

                                <div className={" flex flex-row pt2 black-60"}>
                                  <div className={" flex f6 fw6 "}>
                                    {item_.profile.name.first}
                                  </div>

                                  <div className={" flex f6 fw6 ml1"}>
                                    {item_.profile.name.last}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* {this.state.crew_.length > 0 && ( */}
                    <div className="crew-list-save flex flex-column mt2">
                      <div className="flex flex-row justify-center w-100">
                        <button
                          onClick={this.props.saveAndCreateAccount}
                          id="saveAndCreateAccount"
                          className="round -br1 bs-b bg-black-10 ph3 pv3 pointer bn relative w-100  "
                        >
                          <span className="f4 fw6 black-30- white -white pv2 flex items-center justify-center">
                            {!this.props.saveAndCreateAccountButtonLoading && (
                              <>
                                {this.props.type === "crewBuilder"
                                  ? "Save & Create Account "
                                  : "Create Project"}
                              </>
                            )}
                            {
                            this.props.saveAndCreateAccountButtonLoading &&
                            <div>
                                <div className="sp sp-3balls"></div>
                              </div>
  }
                          </span>
                        </button>
                      </div>
                    </div>
                  {/* )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// export default CrewFinder;
CrewFinder.contextType = AccountContext;
