import React from 'react';
import { Redirect } from 'react-router-dom';
import OnboardingSteps from './OnboardingSteps';
import './style.css';
import { Fn } from '../../../../utils/fn/Fn.js';
import methods from '../../../../utils/methods'

import AccountContext, { AccountProvider } from '../../../../utils/context/AccountContext.js';

class OnboardingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            newAccountType: "",
            accountTypeIsSet: false,
            lat: "",
            long: "",
            city: "",
            location: {},
            country: "",
            countrySet: false,
            redirectProfile: false
        }
        this.setAccountType = this.setAccountType.bind(this)

        this.saveOnboardingData = this.saveOnboardingData.bind(this)

        console.log('OnboardingScreen props', props)

    }
    async saveOnboardingData(data) {

        console.log('saveOnboardingData data', data)

        const { gender, dob, grade, role, bio, mobileNumber, skills, firstname, lastname, location } = data;

        let account = Fn.get('account')
        let userId = account.user.id;

        let profile = account.user.profile;
        account.user.position = role;
        profile.config = {
            type: this.state.newAccountType,
            onboardingcomplete: true
        }
        profile.contact = {
            mobile: mobileNumber
        }

        profile.bio = bio
        
        profile.additional = {
            skills: skills,
            role: role,
            grade: grade
        }
        profile.name = {
            first: firstname,
            last: lastname
        }
        profile.location = location;
        profile.gender = gender;
        profile.dob = dob;
     
        let user = account.user

        console.log('saveOnboardingData profile', user)
        // let apiUrl = 'https://api.crew20.devcolab.site/v1/users/' + userId
        let apiUrl = 'https://dev.iim.technology/v1/users/' + userId

        

        console.log('[[ Endpoint ]]', apiUrl)
        let config = {
            method: "PATCH",
            headers: {
                "origin": "localhost:3000",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }
        return fetch(apiUrl, config).then(res => {

            return res.json()
        }).then(async res => {
            console.log('insertUser', res)
            // if (err) { console.error(err) }

            console.log(' ')
            console.log('[[ User Updated ]]', JSON.stringify(res))
            console.log(' ')
            let account = Fn.get('account')
            account.user = res
            await methods.store({ type: 'account', data: account })

            console.log(' [[ onboarding context ]]',this.context)
            this.context.history.push('/profile')
            this.context.updateAccount()

            // this.setState({ redirectProfile: true })

            // window.location.href = "/profile"

        })

    }
    setAccountType(data) {
        const { type } = data;
        console.log('setAccountType', data)
        this.setState({
            newAccountType: type,
            accountTypeIsSet: true
        })

        Fn.store({ label: 'accountType', value: type })
        Fn.store({ label: 'accountTypeIsSet', value: true })

    }
    async componentDidMount() {
        console.log('[[ OnboardingScreen props ]]', this.props)
        await Fn.getGeoLocation({ self: this })
    }
    render() {
        // if(this.state.redirectProfile) {
        //     return <Redirect to={'/profile'} />
        // }
        return (
            <div id="OnboardingScreen" className="fixed top-0 left-0 flex flex-column pa4 bg-near-white vh-100 w-100">
                <div className="flex flex-column items-center justify-center w-100 h-100">
                    <div
                        className="flex flex-column w-100 overflow-auto" id="">
                        <div className="form-row flex flex-column pb3 w-100">

                            <div className="flex flex-column mw6 center w-100">
                                <OnboardingSteps
                                    newAccountType={this.state.newAccountType}
                                    accountTypeIsSet={this.state.accountTypeIsSet}
                                    setAccountType={this.setAccountType}
                                    saveOnboardingData={this.saveOnboardingData}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default OnboardingScreen;
OnboardingScreen.contextType = AccountContext;
