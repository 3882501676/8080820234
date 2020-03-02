import React, { getGlobal } from "reactn";
import { notification, Checkbox, Tabs } from 'antd';
import ReservationConfirmationScreen from '../data/ReservationConfirmation';
import mail from '../../../../utils/methods/mail';
import ReservationForm from './ReservationForm';
import './style.css';
const { TabPane } = Tabs


class ReservationFormWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            loading: false,
            buttonLoading: false,
            showConfirmationScreen: false,
            reservationData: {},
            checkMultipleDays: false,
            daysCount: ["1","2"],
            formData: []
        };
        this.submitReservationRequest = this.submitReservationRequest.bind(this)
        this.openNotification = this.openNotification.bind(this)
        this.clearReservationForm = this.clearReservationForm.bind(this)
        this.showReservationConfirmationScreen = this.showReservationConfirmationScreen.bind(this)
        this.sendChefReservationConfirmationEmail = this.sendChefReservationConfirmationEmail.bind(this)
        this.sendUserReservationConfirmationEmail = this.sendUserReservationConfirmationEmail.bind(this)
        this.closeReservationScreen = this.closeReservationScreen.bind(this)
        this.checkMultipleDays = this.checkMultipleDays.bind(this)
        this.setDaysCount = this.setDaysCount.bind(this)
        this.addFormData = this.addFormData.bind(this)

        this.reservationDate = React.createRef();
        this.reservationTime = React.createRef();
        this.reservationHours = React.createRef();
        this.daysCount = React.createRef();

        console.log('ReservationForm', props)
    }
    checkMultipleDays(e) {
        console.log(`checked = ${e.target.checked}`);
        this.setState({
            checkMultipleDays: e.target.checked
        })
    }
    setDaysCount(e) {   
        let count = e.target.value;
        console.log('count',count)
        let days = Array.from(Array(parseInt(count)).keys())
        console.log('count',count, days)
        this.setState({ daysCount: days })
    }
    
    closeReservationScreen() {
        this.setState({ showConfirmationScreen: false })
    }
    clearReservationForm() {
        this.reservationHours.current.value = null;
        this.reservationDate.current.value = null;
    }
    addFormData(data) {
        let formData = this.state.formData;
        formData.push(data)
    }
    async sendUserReservationConfirmationEmail() {
        const data = this.state.reservationData;
        // console.log('sendReservationConfirmationEmail', data)
        return await mail.UserReservationRequestNotification(data);
        // return await mail.ReservationRequestUser(data);
    }
    async sendChefReservationConfirmationEmail() {
        const data = this.state.reservationData;
        // console.log('sendReservationConfirmationEmail', data)
        return await mail.ChefReservationRequestNotification(data);
    }
    
    async submitReservationRequest(reservationData) {
        console.log('submitReservationRequest props',this.props)
        console.log('reservationdata', reservationData)
        let currency = this.props.activeCurrency;
        let exchangeRate = this.props.exchangeRate;

        this.setState({ reservationData: reservationData })
        window.db.reservations.insert(reservationData, (err, res) => {
            if (err) {
                console.error(err)
                this.openNotification({ type: "reservation", title: "Error", message: "There was an error making your reservation, our team has been notitifed and will get back to you shortly." })
            }
            else {
                console.log('[[ db.reservations.insert response ]]',res)
                setTimeout(() => {

                    this.openNotification({ type: "reservation", title: "Success", message: "Your reservation request has been sent." });
                    this.setState({ buttonLoading: false })

                    let reservationData = this.state.reservationData;

                    reservationData.reservationID = res._id;
                    reservationData.currency = currency;

                    this.setState({ reservationData: reservationData });

                    this.sendUserReservationConfirmationEmail()
                    this.sendChefReservationConfirmationEmail()

                    this.props.hideInnerDrawer()
                    this.props.hideDrawer()
                    
                }, 1000)
            }
        })
    }   
    showReservationConfirmationScreen = (data) => {
        console.log('showReservationConfirmationScreen', this.props, data)
        const chef = this.props.chef;
        const user = getGlobal().account;
        // const currency = getGlobal().activeCurrency.symbol;
        const reservationCost = chef.extended.rate * data.hours;
        // const reservationCostString = reservationCost;
        const additionalCharges = 0;
        const totalCost = ( reservationCost + additionalCharges );
        const location = "233 Jan Smuts Avenue, Rosebank, Johannesburg";
        let currency = this.props.currency;
        let exchangeRate = this.props.exchangeRate;

        let reservationData = { 
            chef: this.props.chef,
            user,
            location, 
            totalCost: currency.symbol + ( Math.round(totalCost * exchangeRate)), 
            additionalCharges: currency.symbol + ( Math.round(additionalCharges * exchangeRate)), 
            cost: currency.symbol + ( Math.round(reservationCost * exchangeRate)), 
            hours: data.hours, 
            timeStart: data.timeStart.toString(), 
            timeEnd: data.timeEnd.toString(), 
            date: data.date.toString(),
            currency: currency            
        }
        console.log('reservationData', reservationData)
        this.setState({ showConfirmationScreen: true, reservationData: reservationData })
    }
    openNotification = (data) => {
        const { title, message } = data;

        notification.open({
            message: title,
            description:
                message,
            onClick: () => {
            }
        })
    }
    componentDidMount() {
        setTimeout(this.toggle, 100);
    }
    render() {
        // const { isOpen } = this.state;
        console.log('chefs list props', this.props)
        return (
            this.state.showConfirmationScreen ?
                <ReservationConfirmationScreen
                    submitReservationRequest={this.submitReservationRequest}
                    reservationData={this.state.reservationData}
                    closeReservationScreen={this.closeReservationScreen}
                    exchangeRate={this.props.exchangeRate}
                    currency={this.props.currency}
                />
                :
                <div className="flex flex-column -bg-near-white h-100 exo">
                    <section id="Rate" className="ma4 flex flex-column pa3 ba b--black-05 bg-white- bs-b-">
                        <div className="ProjectScenesHeading pt0">
                            <h3 className="f7 fw5 black-30 pb2">Hourly Rate</h3>
                        </div>
                        <div className="flex flex-auto flex-column pb3">
                            <p className="f3 fw5 black-60 mb0">{this.props.currency.symbol}{Math.round(this.props.chef.extended.rate * this.props.exchangeRate)}</p>
                        </div>
                    </section>
                    <div
                        // onSubmit={this.showReservationConfirmationScreen}
                        className="flex flex-column" id="">
                        <div className="form-row flex flex-column">
                            <Checkbox 
                            className=" flex ph4 " 
                            onChange={this.checkMultipleDays}>Reserve Multiple days</Checkbox>
                            {
                                this.state.checkMultipleDays ?
                                <>
                                <div className="flex flex-column ph4">
                                    <label className="f7 fw6 black-90 pb2">Number of days</label>
                                    <input
                                        required={false}
                                        ref={this.daysCount}
                                        className="ph3 pv3 br1 bn bs-a f4 fw5 black-80 h-100"
                                        type={"number"} 
                                        onChange={this.setDaysCount} 
                                        value={this.state.daysCount.length}
                                        />
                                </div>
                                <div className="flex flex-column daysCount-tabs pv3">
                                <Tabs 
                                size={'small'} 
                                defaultActiveKey="0" 
                                tabPosition={"top"} 
                                className="daysCount-tabs">
                                    {this.state.daysCount.map((item, index) => (
                                        <TabPane tab={`Day ${index + 1}`} key={index}>
                                            <div className="flex flex-column pv3 ph4-">
                                                <ReservationForm 
                                                showReservationConfirmationScreen={this.showReservationConfirmationScreen}
                                                type={'multi'} 
                                                addFormData={this.addFormData} />
                                            </div>
                                        </TabPane>
                                    ))}
                                </Tabs>
                                </div>
                                </>
                                : 
                                <ReservationForm 
                                showReservationConfirmationScreen={this.showReservationConfirmationScreen} 
                                type={'single'} 
                                addFormData={this.addFormData} />
                            }
                        </div>
                        
                        
                    </div>

                </div>

        )
    }
}
export default ReservationFormWrapper;

