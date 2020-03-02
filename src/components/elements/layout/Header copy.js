import React, { useState, getGlobal, setGlobal } from "reactn";
import { useAuth0 } from "../../../utils/auth/react-auth0-spa";
import { Link } from "react-router-dom";
import moment from "moment";
import { Popover, Icon, Avatar, Badge } from "antd";

import SelectCurrency from '../display/lists/SelectCurrency';
import AccountContext from '../../../utils/context/AccountContext';


const notifications = [
  {
    title: "A new viewer",
    message: "Your project has been viewed by ..",
    meta: {
      createdAt:
        "Fri Aug 16 2019 17:01:39 GMT+0200 (South Africa Standard Time)"
    }
  },
  {
    title: "A new viewer",
    message: "Your project has been viewed by ..",
    meta: {
      createdAt:
        "Fri Aug 16 2019 17:01:39 GMT+0200 (South Africa Standard Time)"
    }
  }
];

const logoUrl = "/img/icons8-brain-64.png";
const mainMenuListClass =
  "flex flex-auto f6 fw6 black-50 ph3 pv3 bb b--black-05 w5";
const profileMenuListClass =
  "flex flex-auto f6 fw6 black-50 ph2 pv3 bb b--black-05 w5 pointer";
const profileMenuListClass2 =
  "flex flex-auto f6 fw6 bg-black-05 black-30 ph2 pv3 bb b--black-05 w5 pointer";
const mainMenu = (
  <div className="flex flex-column ma0 pa0">
    <Link to={"/"} className={mainMenuListClass}>
      <span className="ml2"><Icon type="home" className="f7 black-30 mr2" /> Home</span>
    </Link>
    {/* <Link to={"/settings"} className={mainMenuListClass}>
      <span className="ml2"><Icon type="unordered-list" className="f7 black-30 mr2" /> Settings</span>

    </Link> */}
  </div>
)
const messageMenu = (
  <div className="flex flex-column ma0 pa0">
{/* 
    <Link to={"/notifications"} className={mainMenuListClass}>
      <span className="ml2"><Icon type="info-circle" className="f7 black-30 mr2" /> Notifications <Badge
        count={<div className={"ant-scroll-number ant-badge-count ml2 f8 exo fw6 bg-black-10 black-30"} >{notifications.length}</div>}
      >

      </Badge></span>
    </Link> */}
    {/* <Link to={"/messages"} className={mainMenuListClass}>
    <span className="ml2"><Icon type="mail" className="f7 black-30 mr2" /> Messages <Badge
        count={<div className={"ant-scroll-number ant-badge-count ml2 f8 exo fw6 bg-black-10 black-30"} >{notifications.length}</div>}
      >

      </Badge></span>

    </Link> */}
  </div>
)
const profileMenu = (logoutWithRedirect) => (
  <div className="flex flex-column ma0 pa0">
    <Link to={"/profile"} className={profileMenuListClass}>
      <span className="ml2"> <Icon type="user" className="f7 black-30 mr2" /> Profile</span>
    </Link>
    {/* <Link to={"/settings"} className={profileMenuListClass}>
      <span className="ml2"><Icon type="credit-card" className="f7 black-30 mr2" /> Account</span>
    </Link> */}
    {/* <Link to={"/notifications"} className={profileMenuListClass}>
      <span className="ml2"><Icon type="notification" className="f7 black-30 mr2" /> Notifications</span>
    </Link> */}
    <div onClick={() => logoutWithRedirect()} className={profileMenuListClass2}>
      <span className="ml2"><Icon type="logout" className="f7 black-30 mr2" /> Logout</span>
    </div>

    <div className="dn notifications-list rubik f-lex -flex-column f-lex-auto ma0 pa0">
      {notifications.map((item, index) => (
        <div
          id={index}
          key={index}
          className="notification-item cursor-pointer flex flex-column flex-auto  "
        >
          <span className="notification-title f6 fw5 black-60 ph2 pt2 pb0">
            {item.title}
          </span>
          <span className="notification-message fw4 black-50 ph2">
            {item.message}
          </span>
          <span className="notification-date f7 fw1 black-40 tl ph2 pb1">
            {moment(item.meta.createdAt)
              .startOf("hour")
              .fromNow()}
          </span>
        </div>
      ))}
    </div>
  </div>
)

const Header = ({ theme, activeCurrency, activeCurrencyIsSet, setCurrency }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, loginWithRedirect, loginWithPopup, logout } = useAuth0();

  const logoutWithRedirect = () => {
    // setGlobal({ account: {} })
    logout({
      returnTo: window.location.origin
    })
  }

  // const toggle = () => setIsOpen(!isOpen);

  // console.log('isAuthenticated', isAuthenticated)
  const styles = {
    badgeNotification: {
      background: Fn.get('theme').config.theme.colorScheme.bg
    }
  }
  return (
    <header
      className={
      
        " fixed top-0 left-0 w-100 z-999 bg-black"
      }
    >
      <div className="flex flex-row flex-auto justify-between">

        {!isAuthenticated && (
          <div className="bb b--white bw1 flex flex-row flex-auto justify-between vh-50- h-100">
           
            <div className="flex flex-row  flex-auto ph3 pv3 black-80 fw7 items-center justify-start">
              
              <span
                className={
                 
                  "white flex ph3 ttu pv2 items-center logotext ttu spaced tracked raleway fw6 ba b--white bw1"
                }
              >
                 Crew20
              </span>

            </div>

            <div className="flex flex-column items-center justify-center ph3 pv2">
              <button onClick={() => loginWithPopup({})} className={"primary pointer trans-a bn flex flex-row items-center ph3 pv2 relative "}>
                <span className="ttu f6 fw6 white varela tracked-03 ">
                  Sign In
                </span>
              </button>
            </div>

          </div>
        )}

        {isAuthenticated && user && (
          <>
          <div className="flex flex-row  flex-auto ph3 pv3 black-80 fw7 items-center justify-start">
              
              <Link to={"/"}
                className={
                 
                  "white flex ph3 ttu pv2 items-center logotext ttu spaced tracked raleway fw6 ba b--white bw1"
                }
              >
                 Crew20
              </Link>

            </div>

            <div className="flex flex-column  f6 fw7 ">
              <nav className="flex flex-row flex-auto flex-wrap w-100">
              <section className="profile-button flex flex-column flex-auto- items-center justify-center pv3 pl4 pr3 w33">
                  <span
                    className="profile-widget flex items-center justify-center"
                    style={{ marginRight: 24 }}
                  >

                    <Popover
                      content={profileMenu(logoutWithRedirect)}
                      placement="bottomRight"
                      trigger="hover"
                      // visible={this.state.popoverVisible}
                      // onVisibleChange={this.popoverHandleVisibleChange}
                      className="flex flex-row items-center pointer"
                    >

                      <Badge
                        count={<div className={"ant-scroll-number ant-badge-count " + Fn.get('theme').config.theme.colorScheme.bg} >{notifications.length}</div>}
                      >
                        <AccountContext.Consumer>
                          {props => (
                            <>
                            <span className="f5 fw6 white mr3">{props.account.auth0.given_name}{" "}{props.account.auth0.family_name}</span>
                            <Avatar
                              size="large"
                              shape="round"
                              className={"bg-center bg-cover " + Fn.get('theme').config.theme.colorScheme.bg}
                              style={{ backgroundImage: "url(" + props.account.auth0.picture + ")" }} />
                              </>
                          )}
                        </AccountContext.Consumer>
                      </Badge>

                    </Popover>
                  </span>
                </section>
                <section
                  id="nav"
                  className={
                    " flex flex-auto- flex-column items-end justify-center raleway bl- b--black-05 -br pv3 ph4 -w5 f3 w3-"
                  }
                >
                  <Popover
                    content={mainMenu}
                    placement="bottomLeft"
                    trigger="hover"
                    className="flex flex-column items-center"
                  >
                    <span
                      className="flex items-center justify-center"
                      style={{ fontSize: "20px" }}
                    >
                      <Icon
                        type="menu"
                        className={" white pointer"}
                      />
                    </span>
                    <span className="dn f7 fw5 black-30- white pointer">Menu</span>
                  </Popover>
                </section>


                {/* <section className="profile-button flex flex-column flex-auto- items-center justify-center pv3 pl4 pr3 ">
                  <span
                    className="flex items-center justify-center"
                    style={{ fontSize: "20px" }}
                  >
                    <Popover
                      content={messageMenu}
                      placement="bottom"
                      trigger="hover"
                      className="flex flex-column items-center"
                    >
                      <span
                        className="flex items-center justify-center"
                        style={{ fontSize: "20px" }}
                      >
                        <Icon
                          type="message"
                          className={theme.colorScheme.accent.light + " pointer"}
                        />

                      </span>
                      <span className="dn f7 fw5 black-30 pointer">Menu</span>
                    </Popover>
                  </span>
                </section> */}
                {/* <section
                  id="currencies"
                  className={
                    " currencies-button flex flex-column flex-auto- items-center justify-center pv3 pl4 pr3 "
                  }
                > {
                    activeCurrencyIsSet &&
                    <SelectCurrency
                      setCurrency={setCurrency}
                      activeCurrency={activeCurrency} />
                  }

                </section> */}

                


              </nav>
            </div></>
        )}
      </div>
    </header>
  )
}

export default Header;
