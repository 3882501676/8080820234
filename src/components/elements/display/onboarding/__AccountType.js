import React, { getGlobal } from "reactn";
import { Icon } from 'antd';
import './style.css';
// import mobiscroll from '@mobiscroll/react';
// import '@mobiscroll/react/dist/css/mobiscroll.min.css';
// mobiscroll.settings = {
//     theme: 'ios'
// };
import { DatePicker, TimePicker } from "@blueprintjs/datetime";
// import DatePicker_ from './DatePicker';
import moment from 'moment';
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";

class OnboardingAccountType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        
        }

    }


    componentDidMount() {

    }
    render() {
        return (
            <div className="flex flex-column bg-near-white h-100 raleway fw5">
                <div                    
                    className="flex flex-column ma0" id="">
                    
                    <div className="Buttons flex flex-row justify-between round">

                        <div className="flex flex-column w-100 mr1">
                            <button
                                onClick={() => this.props.setAccountType({type: 'crew'})}
                                className={(" button-account bg-white -bs-a -c_1_bg ph3 pv2 pointer bn    ")} >
                                <span className="f5 fw6 white- black-70 pv3 flex items-center justify-center">
                                  Crew
                                </span>
                            </button>
                        </div>

                        <div className="flex flex-column w-100">
                            <button
                                onClick={() => this.props.setAccountType({type: 'producer'})}
                                className={(" button-account bg-white -bs-a -c_1_bg ph3 pv2 pointer bn    ")} >
                                <span className="f5 fw6 white- black-70 pv3 flex items-center justify-center">
                                  Producer
                                </span>
                            </button>
                        </div> 

                    </div>
                </div>
            </div>
        )
    }
}
export default OnboardingAccountType;

