import React, { getGlobal } from "reactn";
import { Icon } from 'antd';
import moment from "moment";
import CurrencyContext from '../../../../CurrencyContext';
import { Fn } from '../../../../utils/fn/Fn.js';
class ReservationConfirmationScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            loading: false,
            buttonLoading: false
        }
        this.confirm = this.confirm.bind(this)
        this.cancel = this.cancel.bind(this)
    }
    confirm() {
        this.setState({ buttonLoading: true })
        this.props.submitReservationRequest(this.props.reservationData)
    }
    cancel() {
        this.props.closeReservationScreen()
    }
    componentDidMount() {
        console.log('ReservationConfirmationScreen props',this.props.reservationData.chef.rate)
    }
    componentDidUpdate() {
        console.log('ReservationConfirmationScreen props',this.props)
    }
    render() {
        return (<>
            <CurrencyContext.Consumer>
                  {props => {
                    console.log('[[ currency context ]]', props);
                    return <div className="flex flex-column  bg-near-white h-100 exo">
                    <section id="" className="flex flex-column ph4 pt4 h-100">
    
                        <div className="flex flex-column mb2 bb b--black-05 pa4 ba b--black-05 bg-white bs-b">
                            <div className="ProjectScenesHeading pt0">
                                <h3 className="f7 fw3 black-30 mb2">Location</h3>
                            </div>
                            <div className="flex flex-auto flex-column pb0">
                                <p className="f4 fw4 black-60 mb0">{this.props.reservationData.location}</p>
                            </div>
    
                        </div>
                        <div className="flex flex-column mb2 pa4 ba b--black-05 bg-white bs-a">
                            <div className="ProjectScenesHeading pt0">
                                <h3 className="f7 fw3 black-30 mb2">Date</h3>
                            </div>
                            <div className="flex flex-auto flex-column pb0">
                                <p className="f4 fw4 black-60 mb0">{moment(this.props.reservationData.date).format('MMMM Do YYYY')}</p>
                            </div>
    
                        </div>
    
                        <div className="flex flex-row justify-between mb2 pa4 ba b--black-05 bg-white bs-a">
                            <div className="flex flex-column">
                                <div className="ProjectScenesHeading pt0">
                                    <h3 className="f7 fw3 black-30 mb2">Start Time</h3>
                                </div>
                                <div className="flex flex-auto flex-column pb0">
                                    <p className="f4 fw4 black-60 mb0">{moment(this.props.reservationData.timeStart).format('LT')}</p>
                                </div>
                            </div>
                            <div className="flex flex-column">
                                <div className="ProjectScenesHeading pt0">
                                    <h3 className="f7 fw3 black-30 mb2">End Time</h3>
                                </div>
                                <div className="flex flex-auto flex-column pb0">
                                    <p className="f4 fw4 black-60 mb0">{moment(this.props.reservationData.timeEnd).format('LT')}</p>
                                </div>
                            </div>
                        </div>
    
                        <div className="flex flex-column mb2 pa4 ba b--black-05 bg-white bs-a">
                            <div className="ProjectScenesHeading pt0">
                                <h3 className="f7 fw3 black-30 mb2">Hourly Rate</h3>
                            </div>
                            <div className="flex flex-auto flex-column pb0">
                                <p className="f4 fw4 black-60 mb0">{this.props.currency.symbol}{Math.round(parseInt(this.props.reservationData.chef.extended.rate) * this.props.exchangeRate)}</p>
                            </div>                        
                        </div>
     
    
                        <div className="flex flex-column mb2 pa4 ba b--black-05 bg-white bs-a">
                            <div className="ProjectScenesHeading pt0">
                                <h3 className="f7 fw3 black-30 mb2">Cost</h3>
                            </div>
                            <div className="flex flex-auto flex-column pb0">
                                <p className="f4 fw4 black-60 mb0">{this.props.reservationData.cost}.00</p>
                            </div>
    
                        </div>
    
                        <div className="flex flex-column mb2 pa4 ba b--black-05 bg-white bs-a">
                            <div className="ProjectScenesHeading pt0">
                                <h3 className="f7 fw3 black-30 mb2">Additional Charges</h3>
                            </div>
                            <div className="flex flex-auto flex-column pb0">
                                <p className="f4 fw4 black-60 mb0">{this.props.reservationData.additionalCharges}.00</p>
                            </div>
    
                        </div>
                        <div className="flex flex-column  mb2 pa4 ba b--black-05 bg-white bs-a mb6">
                            <div className="ProjectScenesHeading pt0">
                                <h3 className="f7 fw3 black-30 mb2">Total Cost</h3>
                            </div>
                            <div className="flex flex-auto flex-column">
                                <p className={(Fn.get('theme').config.theme.colorScheme.color) + (" f1 fw4 black-60 mb0")}>{this.props.reservationData.totalCost}.00</p>
                            </div>
                            <div className="ProjectScenesHeading pt0">
                                <h3 className="f7 fw5 black-30 mb0">{this.props.reservationData.currency.name}</h3>
                            </div>    
                        </div>
                    </section>
                    <section id="ActionButtons" className="absolute bottom-0 w-100 flex flex-column bs-b">
                        <div className="Buttons flex flex-row justify-between">
                            <div className="flex flex-column w-100 ">
                                <button
                                    className={(Fn.get('theme').config.theme.colorScheme.bg) + (" -bg-white -bs-a -c_1_bg ph3 pv3 pointer bn  ")}
                                    onClick={this.confirm} >
                                    <span className="f4 fw6 white -black-30 pv2 flex items-center justify-center">
                                        {/* <Icon type="calendar" className={(" whtie f4 black-60 mr2 ")} />  */}
                                        Confirm  </span>
                                </button>
                            </div>
                            {/* <div className="flex flex-column w-100 ">
                                <button
                                    className={(Fn.get('theme').config.theme.colorScheme.bg) + ("- bg-white -bs-a -c_1_bg ph3 pv3 pointer bn")}
                                    onClick={this.cancel}>
                                    <span className="f7 fw5 white- black-30 pv2 flex items-center justify-center">
                                        <Icon type="close" className={(Fn.get('theme').config.theme.colorScheme.color) + (" f4 black-60 mr2")} /> Cancel
                                            </span>
                                </button>
                            </div> */}
                        </div>
    
                    </section>
    
                </div>
                  }}
                </CurrencyContext.Consumer>
            </>
        )
    }
}
export default ReservationConfirmationScreen;

