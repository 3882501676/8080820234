import React from "react";
import { Redirect } from "react-router-dom";
import OnboardingSteps from "./OnboardingSteps";

import { Dialog, Icon } from "@blueprintjs/core";
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

import ListProjects from "../../elements/display/projects/list/index.js";

class ProjectFinder extends React.Component {
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
            users: [],
            isOpen: false,
            activeUser: {},
            dialogTitle: "",
            drawerVisible: false
        };
        this.setAccountType = this.setAccountType.bind(this);

        this.saveOnboardingData = this.saveOnboardingData.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.avatar = this.avatar.bind(this);
        this.reset = this.reset.bind(this);
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
        // console.log("saveOnboardingData data", data);

        // const { location, projectName, projectDate, projectType, positions } = data;

        // localStorage.setItem("crewBuilder", JSON.stringify(data));

        // let a = await Fn.fetchUsers({ self: this, positions });

        // let account = Fn.get('account')

        // let userId = account.user.id;

        // let profile = account.user.profile;

        // profile.config = {
        //     type: this.state.newAccountType,
        //     onboardingcomplete: true
        // }
        // profile.contact = {
        //     mobile: mobileNumber
        // }

        // profile.bio = bio

        // profile.additional = {
        //     skills: skills,
        //     role: role,
        //     grade: grade
        // }
        // profile.name = {
        //     first: firstname,
        //     last: lastname
        // }
        // profile.location = location;
        // profile.gender = gender;
        // profile.dob = dob;

        // let user = account.user

        // console.log('saveOnboardingData profile', user)
        // let apiUrl = 'https://api.crew20.devcolab.site/v1/users/' + userId

        // console.log('[[ Endpoint ]]', apiUrl)
        // let config = {
        //     method: "PATCH",
        //     headers: {
        //         "origin": "localhost:3000",
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(user)
        // }
        // return fetch(apiUrl, config).then(res => {

        //     return res.json()
        // }).then(async res => {
        //     console.log('insertUser', res)
        //     // if (err) { console.error(err) }

        //     console.log(' ')
        //     console.log('[[ User Updated ]]', JSON.stringify(res))
        //     console.log(' ')
        //     let account = Fn.get('account')
        //     account.user = res
        //     await methods.store({ type: 'account', data: account })

        //     console.log(' [[ onboarding context ]]',this.context)
        //     this.context.history.push('/profile')
        //     this.context.updateAccount()

        //     // this.setState({ redirectProfile: true })

        //     // window.location.href = "/profile"

        // })
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

        // alert('ProjectFinder')
        await Fn.getGeoLocation({ self: this });
    }

    render() {
        // if(this.state.redirectProfile) {
        //     return <Redirect to={'/profile'} />
        // }
        return (
            <div className="flex flex-column ma0 w-100 h-100" id="">
                <div className="ProjectFinder flex flex-row justify-between "></div>

                <div
                    id="OnboardingScreen"
                    className="flex flex-column pa4 bg-near-white h-100 w-100"
                >
                    <div className="flex flex-column items-center justify-start pt4 w-100 h-100">
                        <div className="flex flex-column w-100" id="">
                            <div className="form-row flex flex-column pb3 w-100">
                                <div className="flex flex-column mw7 center w-100">
                                    <div
                                        id="SectionTitle"
                                        className="flex flex-column ma0 w-100"
                                        id=""
                                    >
                                        <div className="flex flex-column justify-center items-center pb3">
                                            <h1 className="  f3 fw6 black-80 mt4 mb2 tc">
                                                Find A Project
                      </h1>
                                            <h1 className=" f5 fw4 black-50 tc raleway">
                                                Complete the wizard below to find a project to crew for.
                      </h1>
                                        </div>


                                    </div>

                                    {!this.props.projectsReady && !this.props.searchLoading && (
                                        <OnboardingSteps
                                            searchProjects={this.props.searchProjects}
                                        // newAccountType={this.state.newAccountType}
                                        // accountTypeIsSet={this.state.accountTypeIsSet}
                                        // setAccountType={this.setAccountType}
                                        // saveOnboardingData={this.saveOnboardingData}
                                        />
                                    )}

                                    {/* {

                                        this.state.crew.length > 0 &&
                                        <div className="crew-list-save flex flex-column mt2">
                                            <div className="flex flex-row justify-center w-100">
                                                <button className="pointer pv3 flex-auto flex flex-row justify-center pa0 ma0 bg-white bs-a">
                                                    <span className="flex items-center f5 fw6 black-40 ">Save & Create Account <Icon icon={'follower'} iconSize={15} className="ml2 black-40" /> </span>
                                                </button>
                                            </div>
                                        </div>
                                    } */}
                                </div>
                                {
                                    this.props.searchLoading &&
                                    <div className="w-100 flex items-center justify-center pv4 pr4">
                                        <div className="sp sp-3balls"></div>
                                    </div>

                                }
                                <div className="flex flex-column mw9 center w-100">
                                    {this.props.projectsReady && !this.props.searchLoading  && this.props.projects.length > 0 && (
                                        <div className="crew-list- flex flex-column mt3">
                                            <div className="flex flex-column ma0 w-100" id="">
                                                <div className="ListProjects flex flex-row justify-between ">
                                                    <ListProjects projects={this.props.projects} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-row w-100 items-center justify-start">
                                    <div
                                        onClick={this.reset}
                                        className="f5 fw6 black-50- white bg-black-10 pv2 mt2 mv4 bn b--black-05 ph3"
                                    >
                                        Reset
                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default ProjectFinder;
ProjectFinder.contextType = AccountContext;
