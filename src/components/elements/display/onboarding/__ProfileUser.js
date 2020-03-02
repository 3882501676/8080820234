import React, { getGlobal } from "reactn";
import { Icon } from 'antd';
import './style.css';
import { Fn } from '../../../../utils/fn/Fn.js';
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

class OnboardingProfileUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            buttonLoading: false,
            reservationData: {},
            formData: {},
            startTime: '',
            endTime: '',
            selectedDate: new Date(),
            timeRounded: ''
        }

        this.saveFormData = this.saveFormData.bind(this)
        this.submit = this.submit.bind(this)
        this.timeOnChangeEnd = this.timeOnChangeEnd.bind(this)
        this.timeOnChangeStart = this.timeOnChangeStart.bind(this)
        this.dateOnChange = this.dateOnChange.bind(this)

        console.log('ReservationForm', props)
    }
    saveFormData() {
        this.setState({ buttonLoading: true })
    }
    timeOnChangeStart(value) {
        console.log(value)
        this.setState({ startTime: value })
    }
    timeOnChangeEnd(value) {
        console.log(value)
        this.setState({ endTime: value })
    }
    dateOnChange(value) {
        console.log(value)
        this.setState({ selectedDate: value })
    }
    submit(e) {
        e.preventDefault();
        e.stopPropagation();
        let start = this.state.startTime;
        let end = this.state.endTime;
        let start_ = moment(start);
        let end_ = moment(end);
        let hours = end_.diff(start_, 'hours', true);
        const data = {
            date: this.state.selectedDate,
            timeStart: this.state.startTime,
            timeEnd: this.state.endTime,
            hours: hours
        }
        this.props.showReservationConfirmationScreen(data);
    }
    componentDidMount() {
        let date = new Date(2011, 1, 1, 4, 55); // 4:55
        let timeRounded = roundMinutes(date); // 5:00
        this.setState({
            defaultTime: timeRounded
        })
        function roundMinutes(date) {
            date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
            date.setMinutes(0);
            return date;
        }
    }
    render() {
        return (
            <div className="flex flex-column bg-near-white h-100">
                <form
                    onSubmit={this.props.type === "single" ? this.submit : this.saveFormData}
                    className="flex flex-column ma0" id="">
                    <div className="form-row flex flex-column pb3">
                        <>
                           
                            <div className="flex flex-row justify-between w-100 pa4">
                                <div className="form-row flex flex-column pb3">
                                    <label className="f7 fw6 black-90 pb2">Start Time</label>
                                    
                                </div>
                                
                            </div>
                        </>
                    </div>
                    <div className="Buttons flex flex-row justify-between pa4-">

                        <div className="flex flex-column w-100 mr1">
                            <button
                                className={(" bg-white -bs-a -c_1_bg ph3 pv2 pointer bn    ")} >
                                <span className="f6 fw5 white- black-30 pv3 flex items-center justify-center">
                                    {this.state.buttonLoading ? <Icon type="loading" className={' f4 black-60 mr2'} /> : <Icon type="check-circle" className={ Fn.get('theme').config.theme.colorScheme.color + (' f4 black-60 mr2')} />} Request Reservation</span>
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        )
    }
}
export default OnboardingProfileUser;

