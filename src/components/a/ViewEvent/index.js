import React from 'react';
import { Redirect } from 'react-router-dom';
import OnboardingSteps from './OnboardingSteps';

import { Dialog, Icon } from '@blueprintjs/core';
import "@blueprintjs/core/lib/css/blueprint.css";
import './style.css';

import Fn from '../../../utils/fn/Fn.js';
import methods from '../../../utils/methods/index.js'
import moment from 'moment';
import AccountContext, { AccountProvider } from '../../../utils/context/AccountContext.js';
import { timeline } from "popmotion";
import { TH_LIST } from "@blueprintjs/icons/lib/esm/generated/iconNames";

import ListProjects from '../../elements/display/projects/list/index.js';

class ViewEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: true
        }

    }

    render() {
        // if(this.state.redirectProfile) {
        //     return <Redirect to={'/profile'} />
        // }
        return (

            <div id="ViewEvent" className={(Fn.get('isMobile') ? " vh84 " : "  ")
                + (" flex-column flex justify-between ")}>
                <div className="flex flex-column ma0" id="">
                    <div className="form-row flex flex-column">

                        <div className="form-row flex flex-column pa4">

                            <div className="f5 fw6 black-90 pb3 pt5">Event Detail</div>

                            <div className="form-row flex flex-column">

                                <label className="f6 fw5 black-50 pb2">Event Title</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ViewEvent;
ViewEvent.contextType = AccountContext;
