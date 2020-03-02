import React, { setGlobal } from "reactn";
// import { Statistic, Icon, Rate, notification, Checkbox, Tabs } from 'antd';
// import ReservationConfirmationScreen from '../data/ReservationConfirmation';
// import mail from '../../../../utils/methods/mail';
import LocationSearchForm from './LocationSearchForm';
import './style.css';
import _fn from './_fn';

class LocationSearchFormWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: "",
            long: "",
            city: "",
            location: {},
            country: "",
            countrySet: false,
            searchFormReady: false,            
            
        }

        // this.addFormData = this.addFormData.bind(this)

        // this.reservationDate = React.createRef();
        // this.reservationTime = React.createRef();
        // this.reservationHours = React.createRef();
        // this.daysCount = React.createRef();
        this.getGeolocation = this.getGeolocation.bind(this);
        this.findCity = this.findCity.bind(this);
        this.findLocation = this.findLocation.bind(this);
        this.findCurrency = this.findCurrency.bind(this);

        console.log('Location Search Form Wrapper', props)
    }
    async getGeolocation() {
        return await _fn.getGeoLocation({ self: this })
    }
    async findLocation(searchTerm) {
        return await _fn.findLocation({ searchTerm, self: this })
    }
    async findCity() {

        return await _fn.reverseGeocodeCity({ self: this });

        // let url = "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=" + this.state.lat + "," + this.state.long + ",250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=ZZN2MPuexLyuz3VR0KDD&app_code=TnEsVJR8k3zxGMiAkbP_EQ";
        // fetch(url, (e, r) => {
        //     return r
        // })
        //     .then(res => { return res.json() })
        //     .then(res => {
        //         console.log('reverse geocode res', res)
        //         let data = res.Response.View[0].Result[0].Location.Address.AdditionalData;
        //         for (let item of data) {
        //             if (item.key === "CountryName") {
        //                 let country = item.value;
        //                 console.log('country', country);
        //                 this.setState({ country: country, countrySet: true })
        //             }
        //         }
        //         this.setState({
        //             city: res.Response.View[0].Result[0].Location.Address.County,
        //             suburb: res.Response.View[0].Result[0].Location.Address.District,
        //             province: res.Response.View[0].Result[0].Location.Address.State,
        //             searchFormReady: true,
        //             location: res.Response.View[0].Result[0].Location.Address
        //         })
        //         this.findCurrency()
        //     })

    }
    async findCurrency() {
        console.log('findCurrency location', this.state.location.AdditionalData);
        // let data = this.state.location.AdditionalData;
        // for(let item of data) {
        //     if(item.key === "CountryName"){
        //         let country = item.value;
        //         console.log('country',country);
        //         this.setState({country: country, countrySet: true})
        //     }            
        // }
        return await _fn.findCurrency()
    }

    componentDidMount() {
        // setTimeout(this.toggle, 100);
        this.getGeolocation()
    }
    render() {

        return (

            <div className="fixed top-0 left-0 flex flex-column pa4 bg-near-white vh-100 w-100">
                <div className="flex flex-column items-center justify-center w-100 h-100">

                    <div
                        // onSubmit={this.showReservationConfirmationScreen}
                        className="flex flex-column w-100" id="">
                        <div className="form-row flex flex-column pb3 w-100">
                            <div className="flex flex-column w-100">

                            </div>
                            {
                                this.state.searchFormReady
                                    ? <LocationSearchForm
                                        showReservationConfirmationScreen={this.showReservationConfirmationScreen}
                                        type={'single'}
                                        addFormData={this.addFormData}
                                        location={this.state.location}
                                        findLocation={this.findLocation}
                                        fetchChefs={this.props.fetchChefs}
                                        progressBarPercent={this.props.progressBarPercent}
                                        progressBarActive={this.props.progressBarActive}
                                    />
                                    : null
                            }


                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default LocationSearchFormWrapper;

