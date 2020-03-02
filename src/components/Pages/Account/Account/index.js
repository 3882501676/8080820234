import React from 'react';
import { DatePicker, Drawer, message } from 'antd';
import moment from 'moment';
import TransitionLayout from '../../../Layouts/Transition.js';
import AccountContext from '../../../../utils/context/AccountContext.js';
import { Fn, app } from '../../../../utils/fn/Fn.js';
// import LocationSearchBar from '../../elements/display/forms/LocationSearchBar.js';
import PageTitle from '../../../elements/layout/PageTitle_B.js';
// import FormCrew from '../../CrewFinder/Three.js';
// import { Icon } from '@blueprintjs/core';
import { Icon } from '@blueprintjs/core';
import Currencies from '../../../../utils/currencies/worldcurrencies.json';
// import Lightbox from 'react-lightbox-component';
// import Lightbox from 'react-image-lightbox';
// import 'react-image-lightbox/style.css';
// import { TH_LIST } from '@blueprintjs/icons/lib/esm/generated/iconNames';

class Account extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      drawerOpen: false,
      ready: false,
      loading: false,
      lightboxActive: false,
      x: false,
      currencies: []
    }

    // this.toggleDrawer = this.toggleDrawer.bind(this)
    // this.openFilePanel = this.openFilePanel.bind(this)

    this.updateAccount = this.updateAccount.bind(this)
    this.currencyOnChange = this.currencyOnChange.bind(this)

    this.userEmailAddress = React.createRef();
    this.userMobilePhone = React.createRef();
    this.currency = React.createRef()

  }
  async currencyOnChange(e) {
      let value = e.target.value;
      console.log('selected currency ', value)

      let currency = Currencies.filter( a => a.name === value )[0]

      let user = Fn.get('account').user;

      user.currency = currency;

      await app.updateUser({ self: this, user }).then( user => {
        this.context.updateAccount()
      })

  }
  updateAccount() {

  }
  // toggleLightbox() {

  //   alert()

  //   this.setState({
  //     lightboxActive: !this.state.lightboxActive
  //   })
  // }

  componentDidMount = () => {
    this.context.setPage({ title: "Account", subtitle: "..."})
console.log('Account context ',this.context)
let currencies = []
for(let item of Currencies){
  currencies.push(item.name)
}
    this.setState({
      ready: true,
      currencies: currencies
    })

  }



  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <>
        <AccountContext.Consumer>

          {props => {

            return (

              <TransitionLayout>
                {/* {
        !this.state.ready &&
        <Loading />
      } */}

                {/* {
        props.account.user.profile.config.onboardingcomplete === false
        && <OnboardingScreen location={this.state.location} />
      } */}

                <section id="Home" className="w-100 mw9 center pa4 pb6">

                  



                  <div className="w-60-ns w-100 flex flex-row flex-wrap justify-between br3- -overflow-hidden">

                    {
                      this.state.x
                        ? <Icon icon="loading" iconSize="15" className="absolute right-0 f4 black-60 mr3" /> : <Icon icon="swap-right" iconSize="15" className="f4 black-60 -white  absolute right-0 mr3" />
                    }

                    {
                      !this.state.ready && <div className="flex flex-column pv4 items-start">
                        {/* <Spinner size={25} /> */}
                        <div className="sp sp-3balls"></div>
                      </div>
                    }

                    {
                      this.state.ready &&

                      <div id="SettingsForm_General" className="flex flex-column mb6 w-100">

                        <div className="flex flex-column mt0 w-100" id="">

                          <div className="form-row flex flex-column pb3 pt2">

                            <div className="form-row flex flex-column">

                              <div className="form-row flex flex-row pt4 items-center">

                                <label className="f5 fw6 black-20 pb3- tl mr4 w-30">Email Address</label>

                                <input
                                  ref={this.userEmailAddress}
                                  required={true}
                                  type={'text'}
                                  defaultValue={this.context.account.user.email}
                                  className="flex flex-column ph4 pv3 bn br2- round bg-black-05- white- black-50 f4 fw5 bs-a- w-100 bg-white" />

                              </div>

                              <div className="form-row flex flex-row pt4 items-center">

                                <label className="f5 fw6 black-20 pb3- tl mr4 w-30">Mobile Phone</label>

                                <input
                                  ref={this.userMobilePhone}
                                  required={true}
                                  type={'text'}
                                  defaultValue={this.context.account.user.profile.contact.phone}
                                  className="flex flex-column ph4 pv3 bn br2- round bg-black-05- white- black-50 f4 fw5 bs-a- w-100 bg-white" />

                              </div>
                              <div className="form-row flex flex-row pt4 items-center">

                                <label className="f5 fw6 black-20 pb3- tl mr4 w-30">Currency</label>
                                <div className="flex pb3 w-100">
                        <select
                          // required={true}
                          ref={this.currency}
                          onChange={this.currencyOnChange}
                          // value={this.context.currency.name}
                          // type={'text'} 

                          className="w-100 flex flex-row ph4 pv3 bn round -br1 bg-white black-50 f4 fw5 -bs-a"
                        >
                          
                          {
                            this.state.currencies.map( ( item, index) => (
                              <option
                              // onSelect={(item) => this.currencyOnChange(item)}
                              selected={this.context.currency.name === item } 
                              value={item}>{item}</option>
                            ))
                          }

                        </select>
                      </div>

                                {/* <input
                                  ref={this.currency}
                                  required={true}
                                  type={'select'}
                                  defaultValue={this.context.currency.name + " : " + this.context.currency.code}
                                  className="flex flex-column ph4 pv3 bn br2- round bg-black-05- white- black-50 f4 fw5 bs-a- w-100 bg-white" /> */}

                              </div>

            

                            </div>

                          </div>

                        </div>

                        <div className="Buttons flex flex-row justify-between mt4">

                          <div className="flex flex-column -w-100">

                            <button
                              onClick={() => this.updateAccount()}
                              className={("br1- round bs-b bg-black-20 ph5 pv2 pointer bn relative w-100  ")} >

                              <span className="relative f5 fw6 white pv1 flex items-center justify-center w-100">
                                {this.state.loading ? 'Saving' : 'Save'}
                              </span>

                            </button>

                          </div>

                        </div>
                      </div>

                    }

                    {
                      this.context.isAuthenticated &&
                      <div id="SettingsForm_Crew" className="flex flex-column mb6 w-100">

                        {/* <FormCrew
                  project={this.props.project}
                /> */}

                      </div>

                    }

                  </div>

                </section>

                <Drawer
                  title="Basic Drawer"
                  placement="right"
                  closable={true}
                  onClose={this.toggleDrawer}
                  visible={this.state.drawerOpen}
                  width={'60vw'}
                >
                  {
                    this.state.drawerOpen &&
                    <div className="pointer flex flex-column justify-end items-center pa3 bg-white ">
                      <h3 className="f5 fw6 black tc pv2 ph3 word-break-all">{this.state.activeFile.file.originalname}</h3>
                      <div
                        onClick={this.toggleLightbox}
                        className="pointer flex flex-column justify-end items-center pa3 bg-white br2 bs-b mb2 mr2">
                        <div
                          style={{ backgroundImage: 'url("' + this.state.activeFile.url + '")' }}
                          className="h5 file-item bg-cover bg-center cover flex flex-column justify-end items-center pa3 bg-white br2 bs-b mb2 mr2">

                        </div>


                      </div>

                    </div>
                  }

                </Drawer>
              </TransitionLayout>
            )
          }}
        </AccountContext.Consumer>
      </>

    );
  }
}

export default Account;
Account.contextType = AccountContext;