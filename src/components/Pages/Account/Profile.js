import React, { getGlobal, useState } from "reactn";
import Loading from "../../elements/Loading";
import { useAuth0 } from "../../../utils/auth/react-auth0-spa";
import AccountContext, { AccountConsumer } from '../../../utils/context/AccountContext'
import TransitionLayout from '../../Layouts/Transition';
import { Tabs, Rate, Icon } from 'antd'
import moment from "moment";
const { TabPane } = Tabs;

const cardDetails = [
  {
    title: "Country",
    value: "South Africa"
  }, {
    title: "Bank Name",
    value: "First National Bank"
  },
  {
    title: "Card Number",
    value: "004...987"
  },
]

const cuisines = []
class Profile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'profile'
    }
    this.tabOnChange = this.tabOnChange.bind(this)
    console.log(props)
  }
  tabOnChange(e) {
    this.setState({
      activeTab: e
    })
  }
  componentDidMount() {
    this.setState({ account: getGlobal().account })
    console.log(this.state)
  }

  // const { loading, user } = useAuth/0();
  // const [activeTab, tabOnChange] = useState(0)
  // const [activeTab, tabOnChange] = useState('profile')

  // if (loading || !user) {
  //   return <Loading />;
  // }
  render() {
    const history = new Array(3).fill({ date: new Date().toString(), amount: 2000 })
    return (
      <AccountContext.Consumer>
        {props => (
          console.log('Profile', props),
          <TransitionLayout>

            <section id="Profile" className="pt6 w-100 mw8 center pa4 flex flex-row exo">

              <div className="w-25 flex flex-column items-start justify-start -align-items-center -profile-header mb-5 text-center text-md-left pv3 ph4">

                <div className="w-100 flex flex-column items-start justify-start">

                  <div
                    style={{ backgroundImage: 'url(' + props.account.picture + ')' }}
                    className="flex pa4 bg-cover cover bg-center br2 bs-b w-100 h5 mb4"
                  >

                  </div>

                  <div className="ProjectScenesHeading pt0">

                    <h3 className="f6 fw3 black-30 mb2">Email Address</h3>

                  </div>

                  <div className="flex flex-auto flex-column pb3">

                    <p className={Fn.get('theme').config.theme.colorScheme.color + ("- f5 fw5 black-60")}>
                      {props.account.email}
                    </p>


                  </div>

                </div>

              </div>



              <div className="ph4 w-100 flex flex-column mw6 items-start justify-start ">

                <section id="ActionButtons" className="flex flex-column w-100 ">

                  <div className="Buttons flex flex-row justify-between">

                    <div className="items-start flex flex-column w-100 ">

                      <button className={("- bg-white- -bs-a -c_1_bg ph-3 pv2 pointer bn ")} onClick={() => this.tabOnChange('profile')}>
                        <span className={(this.state.activeTab === 'profile' && " active ") + (" exo c_5- f6 fw5 white- black-30 pv3 flex items-center justify-center ")}>
                          <Icon type="calendar" className={(" f4 black-60 mr2")} /> Profile</span>
                      </button>

                    </div>

                    <div className="items-start flex flex-column w-100 ">

                      <button className={("- bg-white- -bs-a -c_1_bg ph-3 pv2 pointer bn")} onClick={() => this.tabOnChange('account')}><span className={(this.state.activeTab === 'account' && " active ") + (" exo c_5- f6 fw5 white- black-30 pv3 flex items-center justify-center ")}><Icon type="message" className={(Fn.get('theme').config.theme.colorScheme.color) + (" f4 black-60 mr2")} /> Account</span></button>

                    </div>

                  </div>

                </section>
                {

                  this.state.activeTab === 'profile' &&

                  <div className="flex flex-column items-start justify-start pt4 pv3">

                    <div classNames="flex flex-column mb2 ph4- pb4 br4 bg-white-">

                      <div className="pa-4 bg-white-60- exo ">

                        <div className="flex flex-column mb2 ">

                          <div className="flex flex-row justify-between">

                            <section id="Reputation" className="flex flex-column -ph4 pb4">

                              <div className="flex pb3">

                                <h3 className="f6 fw3 black-30 mb2">Name</h3>

                              </div>

                              <div className="flex flex-auto flex-column pb4 ">

                                <p className={(" f3 fw4 black-60 mb0")}>
                                  {props.account.name}
                                </p>


                              </div>

                              <section id="Rate" className="flex flex-column pb3">

                                <div className="ProjectScenesHeading pt0">

                                  <h3 className="f6 fw3 black-30 mb3">Reputation</h3>

                                </div>

                                <div className="flex flex-auto flex-column">

                                  <Rate
                                    disabled
                                    allowHalf
                                    className={Fn.get('theme').config.theme.colorScheme.color}
                                    defaultValue={4} />

                                </div>

                              </section>

                              <div className="flex flex-column pb3 pt2">

                                <div className="ProjectScenesHeading pt0">

                                  <h3 className="f6 fw3 black-30 mb2">Bio</h3>

                                </div>

                                <div className="flex flex-auto flex-column pb0">

                                  <p className="f4 fw4 black-60 mb0">{props.account.extended.profile.bio}</p>

                                </div>

                              </div>

                            </section>

                          </div>

                        </div>


                      </div>
                    </div>

                  </div>
                }
                {
                  this.state.activeTab === 'account' &&
                  <div className="flex flex-column items-start justify-start  pv3">

                    <div classNames="flex flex-column mb2 p-h4 pb4 br4 bg-white-">

                      <div className="pa-4  exo ">
                        <div className="flex flex-column mb2 ">
                          <div className="flex flex-row justify-between">
                            <section id="Reputation" className="flex flex-column p-h4 pb4">



                              <div className="flex pb3">

                                <h3 className="f6 fw3 black-30 mb3">Acount Details</h3>

                              </div>

                              <div className="flex flex-auto flex-column -mb3">

                                <p className={(" f3 fw4 black-60 mb0")}>
                                  {
                                    cardDetails.map((item, index) => (
                                      <div className="flex flex-auto flex-row mb2 f4 fw5 black-60">
                                        <div className="flex flex-auto- flex-column mb3 f6 fw4 black-30 justify-center">
                                          {item.title}
                                        </div>

                                        <div className={(" flex flex-auto- flex-column mb3 f4 fw5 black-60 ph3 justify-center ")} >
                                          {item.value}</div>

                                      </div>
                                    ))
                                  }
                                </p>


                              </div>


                              <div className="flex pb3 mt4">

                                <h3 className="f6 fw3 black-30 mb3">Payment History</h3>

                              </div>

                              <div className="flex flex-auto flex-column -mb3">

                                <p className={(" f3 fw4 black-60 mb0")}>
                                  {
                                    history.map((item, index) => (
                                      <div className="flex flex-auto flex-row mb2 f4 fw5 black-60">
                                        <div className="flex flex-auto- flex-column mb3 f6 fw4 black-60 justify-center">{moment(item.date).format('MMM D YYYY')}</div>

                                        <div className={Fn.get('theme').config.theme.colorScheme.color + (" flex flex-auto- flex-column mb3 f4 fw5 black-60 ph3 justify-center ")} >{getGlobal().activeCurrency.symbol}{item.amount}.00</div>

                                      </div>
                                    ))
                                  }
                                </p>


                              </div>


                            </section>


                          </div>

                        </div>

                        

                      </div>

                    </div>

                  </div>
                }
              </div>

            </section>
          </TransitionLayout>
        )
        }

      </AccountContext.Consumer >
    )
  }
};

export default Profile;
