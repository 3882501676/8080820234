import React, { getGlobal, setGlobal, useGlobal } from "reactn";
import { Redirect } from "react-router-dom";
import { Popover, Icon, Empty, Skeleton, Rate } from "antd";

import TransitionLayout from "../../Layouts/Transition";
import ListChefs from "../../elements/display/chefs/list";
import PageTitle from "../../elements/layout/PageTitle_B";
import ChefInfo from "../../elements/display/drawers/ChefInfo";
import LocationSearchFormWrapper from '../../elements/display/forms/LocationSearchFormWrapper';
import OnboardingScreen from '../../elements/display/onboarding/OnboardingScreen';
import LocationSearchBar from '../../elements/display/forms/LocationSearchBar';

import methods from '../../../utils/methods';
import _fn from './_fn';

import CurrencyContext from "../../../utils/context/CurrencyContext";
import './style.css';
// import { dilate } from "popmotion/lib/calc";
window.getGlobal = getGlobal;
window.useGlobal = useGlobal;
window.setGlobal = setGlobal;

let rateReady;

// const content = (props) => (
//   <div className={props.bg + (" flex flex-column f7 fw5 exo br3")}>
//     <span className="trans-a list-actions-item pointer pv2 ph2 flex bb b--black-05 white-80"><Icon className="f5 fw6 white mr2" type="container" /> Add to shortlist</span>
//     <span className="trans-a list-actions-item pointer pv2 ph2 flex bb b--black-05 white-80"><Icon className="f5 fw6 white mr2" type="message" /> Send Message</span>
//   </div>
// );
const diets = [
  { label: 'raw' },
  { label: 'vegetarian' },
  { label: 'meat' },
];
const rates = [
  { label: "< R300", filter: { min: 0, max: 300 }},
  { label: "R300 - R800", filter: { min: 300, max: 800 } },
  { label: "R800 - R1600", filter: { min: 800, max: 1600 } },
  { label: "R1600+", filter: { min: 1600, max: -1 } }
]
const reps =[
  { label: 1, filter: { min: 1, max: -1 }},
  { label: 2, filter: { min: 2, max: -1 } },
  { label: 3, filter: { min: 3, max: -1 } },
  { label: 4, filter: { min: 4, max: -1 } },
  { label: 5, filter: { min: 5, max: -1 } }
]
const filterPrice = ({ type, options, setFilter }) => (
  <div className={(" filterActions flex flex-column f7 fw5 exo br3")}>
    {console.log('options', options)}
    {
      options.map((item, index) => 
        <span
          onClick={() => setFilter({ data: item, type })}
          className="trans-a list-actions-item pointer pv2 ph3 flex bb b--black-05 black-60 -white-80">
         
          {item.label}
        </span>
      )
    }

  </div>
);
const filterRep = ({ type, options, setFilter }) => (
  <div className={(" filterActions flex flex-column f7 fw5 exo br3")}>
    {console.log('options', options)}
    {
      options.map((item, index) => (
        <span
          onClick={() => setFilter({ data: item, type })}
          className="trans-a list-actions-item pointer pv2 ph3 flex bb b--black-05 black-60 -white-80">
         
         <Rate
                  disabled
                  allowHalf
                  defaultValue={item.filter.min}
                  className={" f6 "}
                />
        </span>
      ))
    }

  </div>
);

const filterDiet = ({ type, options, setFilter }) => (
  <div className={(" filterActions flex flex-column f7 fw5 exo br3")}>
    {console.log('options', options)}
    {
      options.map((item, index) => (
        <span
          onClick={() => setFilter({ data: item, type })}
          className="trans-a list-actions-item pointer pv2 ph3 flex bb b--black-05 black-60 -white-80">
         
          {item.label}
        </span>
      ))
    }

  </div>
);


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chefs: [],
      activeChef: getGlobal().activeChef,
      ready: false,
      insertModalVisible: false,
      chefInfoVisible: false,
      loading: false,
      theme: Fn.get('theme').config.theme,
      toMessages: false,
      conversationReady: false,
      activeTab: "1",
      drawerReady: false,
      locationIsSet: getGlobal().locationIsSet,
      progressBarPercent: 0,
      progressBarActive: false,
      showLocationForm: false,
      showOnboardingScreen: false,
      location: getGlobal().location,
      activeCurrency: getGlobal().activeCurrency,
      user: getGlobal().account,
      searchCity: ''
    }

    this.fetchChefs = this.fetchChefs.bind(this);
    this.fetchChefs2 = this.fetchChefs2.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.hideDrawer = this.hideDrawer.bind(this);
    this.refresh = this.refresh.bind(this);
    // this.updateActiveDoc = this.updateActiveDoc.bind(this);
    this.setLocation = this.setLocation.bind(this)
    this.start = this.start.bind(this)
    this.focusLocationSearch = this.focusLocationSearch.bind(this)

    this.reserve = this.reserve.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.submitReservationRequest = this.submitReservationRequest.bind(this)
    this.setFilter = this.setFilter.bind(this)

    console.log('[[ Home props ]]', props)
  }
  focusLocationSearch() {

  }
  reserve(doc) {
    console.log(doc)
    this.setState({ activeDoc: doc })
    setGlobal({ "reserve": true, recipient: doc })
  }
  async sendMessage(doc) {
    return await _fn.sendMessage({ doc, self: this })
  }
  async fetchChefs2(city) {
    this.setState({ ready: false, searchCity: city })
    setTimeout(() => {
      console.log('[[ fetchChefs2 city ]]', city)
      return _fn.fetchChefs2({ city, self: this })
    }, 1000)

  }
  async fetchChefs(city) {
    this.setState({ ready: false, searchCity: city })
    return await _fn.fetchChefs({ city, self: this })
  }
  async refresh() {
    return await _fn.refresh({ self: this })
  }
  async showDrawer(chef) {
    return await _fn.showDrawer({ chef, self: this })
  }
  async hideDrawer() {
    return await _fn.hideDrawer({ self: this })
  }
  showModal = () => {
    this.setState({
      insertModalVisible: true
    });
  }
  handleOk = e => {
    console.log(e);
    this.setState({
      insertModalVisible: false
    });
  }
  handleCancel = e => {
    console.log(e);
    this.setState({
      insertModalVisible: false
    });
  }
  async submitReservationRequest(data) {
    return await _fn.submitReservationRequest({ data, self: this })
  }
  async setLocation() {
    return await _fn.setLocation({ self: this })
  }
  async start() {
    // find location by browser geolocation, 
    // then query Here maps api for location data using reverse geolocation.
    return await _fn.setLocation({ self: this })
  }
  async setFilter(data) {
    this.setState({ ready: false })
    
    console.log('filter',data.data.label)
    const url = "https://homechef-51a6.restdb.io/rest/appusers";
    // let operator;
    let query;
    if(data.type === "rep"){
      query = '?q={"$and":[{"extended.profile.additional.rating.avg":'+ data.data.filter.min +'},{"extended.config.onboardingcomplete":true}]}';
    }
    if(data.type === "price"){
      query = '?q={"$and":[{"extended.rate":{"$bt":['+ data.data.filter.min +','+ data.data.filter.max +']}},{"extended.config.onboardingcomplete":true}]}';
    }
    if(data.type === "diet"){
      query = '?q={"$and":[{"extended.profile.additional.diets":"' + data.data.label + '"},{"extended.config.onboardingcomplete":true}]}';
    }
    
    // const query = '?q={ "$and":[{ "extended.rate": { "$and": [{"$gte": '+ type.filter.min +' },{"$lte": '+ type.filter.max +' }] }}, {"extended.config.onboardingcomplete": true}] }';
    // const query = '?q={ "$and":[{ "extended.rate": {"$lte" : ' + filterValue + '}}, {"extended.config.onboardingcomplete": true}]}';
    const endpoint = url + query;
    // console.log('### endpoint',endpoint)
    const config = {
      method: "GET",
      headers: {
        "origin": "localhost:3000",
        "x-apikey": "5dbadbac64e7774913b6e751",
        "Content-Type": "application/json"
      }
    }
    // console.log('query',query)
    return await fetch(endpoint, config)
      .then(res => { return res.json() })
      .then(users_ => {
        console.log(' ')
        console.log('[[ filtered users ]]', users_)
        console.log(' ')
        this.setState({ chefs: users_, ready: true })
      })
  }
  componentWillUnmount() {
  }
  componentDidUpdate() {
    console.log('[[ Home Updated ]]', this.props)
  }
  async componentDidMount() {
    this.start()
  }
  render() {
    const account = JSON.parse(localStorage.getItem('account'));
    console.log('[[ Account ]]', account, account.extended);
    return (
      <CurrencyContext.Consumer>
        {props => {
          console.log('[[ <CurrencyContext.Consumer> ]]', props);
          return (
            <TransitionLayout>
              {console.log('[[[[[ account', account),
                account
                && account.extended
                && account.extended.config
                && account.extended.config.onboardingcomplete === false
                && <OnboardingScreen location={this.state.location} />
              }
              <section id="Home" className="w-100 mw7 center pa4">
                <div onClick={this.refresh} className="absolute top-0 right-0 pa4 pointer black-30">
                  <Icon type="sync" />
                </div>
                <div className="flex flex-row justify-between">

                  {this.state.locationIsSet &&
                    <PageTitle
                      title={"Chefs for Hire"}
                      ready={this.state.ready}
                      theme={props.theme}
                      showInsertForm={this.showModal}
                      docs={this.state.chefs}
                      activeDoc={this.state.activeChef}
                      updateActiveDoc={this.updateActiveDoc}
                      showButton={false}
                    />}
                  {this.state.locationIsSet &&
                    <LocationSearchBar
                      location={this.state.location}
                      findLocation={this.findLocation}
                      fetchChefs={this.fetchChefs2}

                    />}

                </div>
                <div className="flex flex-row justify-between pb3">
                  <h4 className="f7 fw5 black-30">Showing results for <span onClick={this.focusLocationSearch} className="ph2 pv1 br1 fw6 black-40 bg-black-10 white">{this.state.searchCity}</span></h4>
                </div>

                {this.state.ready ? (
                  this.state.chefs.length > 0 ? (
                    <ListChefs
                      chefs={this.state.chefs}
                      activeChef={this.state.activeChef}
                      className="trans-a"
                      showDrawer={this.showDrawer}
                      hideDrawer={this.hideDrawer}
                      theme={props.theme}
                      activeCurrency={props.activeCurrency}
                      exchangeRate={props.exchangeRate}
                    />
                  ) : (
                      <Empty
                        className="trans-a flex flex-column justify-center items-start"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    )
                ) : (
                    <div className="trans-a">
                      <Skeleton active />
                      <Skeleton active />
                    </div>
                  )}
                {
                  this.state
                  && this.state.locationIsSet
                  && this.state.ready
                  && this.state.drawerReady
                  && (this.state.activeChef
                    && this.state.activeChef.hasOwnProperty('extended'))
                  && (
                    <ChefInfo
                      type={"info"}
                      chef={this.state.activeChef}
                      updateDoc={this.updateDoc}
                      visible={this.state.chefInfoVisible}
                      hideDrawer={this.hideDrawer}
                      close={this.props.handleOk}
                      refresh={this.refresh}
                      theme={props.theme}
                      reserve={this.reserve}
                      sendMessage={this.sendMessage}
                      conversationReady={this.state.conversationReady}
                      submitReservationRequest={this.submitReservationRequest}
                      activeTab={this.state.activeTab}
                      activeCurrency={props.activeCurrency}
                      exchangeRate={props.exchangeRate}
                    />)}

              </section>
              {
                account
                && account.extended
                && account.extended.config
                && account.extended.config.type === "user"
                && this.state.showLocationForm
                && <LocationSearchFormWrapper
                  progressBarActive={this.state.progressBarActive}
                  progressBarPercent={this.state.progressBarPercent}
                  fetchChefs={this.fetchChefs}
                />
              }
              <section
                className="fixed exo bg-white br3 bs-b"
                id="filterActions">
                <div className="flex flex-column pa3 bb b--black-05">
                  <span className="f7 fw6 black-20 tc">Filters</span>
                </div>
                <div className="flex flex-column">
                  <div className="flex flex-column">
                    <Popover
                      placement="right"
                      content={filterDiet({ type: 'diet', setFilter: this.setFilter, options: [ ...diets ] })}
                      trigger="hover">
                      <div
                        className="  pointer pv3 pr3 pl2 f7 fw7 black-70 bb b--black-05  " >
                        <span className="flex items-start justify-center w-100 h-100 tc">Diet</span>
                      </div>
                    </Popover>
                  </div>
                  <div className="flex flex-column">
                    <Popover
                      placement="right"
                      content={filterRep({ type: 'rep', setFilter: this.setFilter, options: [ ...reps ] })}
                      trigger="hover">
                      <div className={("  pointer pv3 pr3 pl2 f7 fw7 black-70 bb b--black-05  ")}>
                        <span className="flex items-start justify-center w-100 h-100 tc">Reputation</span
                        ></div>
                    </Popover>
                  </div>
                  <div className="flex flex-column">
                    <Popover
                      placement="right"
                      content={filterPrice({ type: 'price', setFilter: this.setFilter, options: [ ...rates ] })}
                      trigger="hover">
                      <div className={("  pointer pv3 pr3 pl2 f7 fw7 black-70 bb b--black-05  ")}>
                        <span className="flex items-start justify-center w-100 h-100 tc">Hourly Rate</span>
                      </div>
                    </Popover>
                  </div>
                </div>
              </section>
            </TransitionLayout>
          )
        }}

      </CurrencyContext.Consumer>
    );
  }
}

export default Home;
