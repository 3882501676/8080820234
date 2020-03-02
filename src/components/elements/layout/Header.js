import React, { useState, getGlobal, setGlobal } from "reactn";
// import { useAuth0 } from "../../../utils/auth/react-auth0-spa";
import { Link } from "react-router-dom";
import moment from "moment";
import { Popover, Avatar, Badge } from "antd";
import { Icon } from "@blueprintjs/core";

// import SelectCurrency from "../display/lists/SelectCurrency";
import AccountContext from "../../../utils/context/AccountContext";
var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;
// const notifications = [
//   {
//     title: "A new viewer",
//     message: "Your project has been viewed by ..",
//     meta: {
//       createdAt:
//         "Fri Aug 16 2019 17:01:39 GMT+0200 (South Africa Standard Time)"
//     }
//   },
//   {
//     title: "A new viewer",
//     message: "Your project has been viewed by ..",
//     meta: {
//       createdAt:
//         "Fri Aug 16 2019 17:01:39 GMT+0200 (South Africa Standard Time)"
//     }
//   }
// ];

// const logoUrl = "/img/icons8-brain-64.png";
const mainMenuListClass =
  "flex flex-auto f6 fw6 black-50 ph3 pv3 bb b--black-05 w5";
const mainMenuListClass2 =
  "flex flex-auto f6 fw6 black-50 ph3 pv3 bb b--black-05 w5 bg-black-05";
const profileMenuListClass =
  "flex flex-auto f6 fw6 black-50 ph2 pv3 bb b--black-05 w5 pointer";
const profileMenuListClass2 =
  "flex flex-auto f6 fw6 bg-black-05 black-30 ph2 pv3 bb b--black-05 w5 pointer";

const menuItemClass = "flex items-center f3 black-20 ";
const menuItemTextClass = "f5 fw6 black ml3";

const mainMenu = props => (
  console.log("mainMenu props", props),
  (
    <div className="flex flex-column ma0 pa0">
      <Link to={"/dashboard"} className={mainMenuListClass}>
        <span className={menuItemClass}>
          <Icon icon="layout-grid" iconSize={15} />
          <span className={menuItemTextClass}>Dashboard</span>
        </span>
      </Link>
      <Link to={"/calendar"} className={mainMenuListClass}>
        <span className={menuItemClass}>
          <Icon icon="numerical" iconSize={15} />{" "}
          <span className={menuItemTextClass}>Calendar</span>
        </span>
      </Link>
      <Link to={"/network"} className={mainMenuListClass}>
        <span className={menuItemClass}>
          <Icon icon="exchange" iconSize={15} />{" "}
          <span className={menuItemTextClass}>Network</span>
        </span>
      </Link>

      <Link to={"/myprojects"} className={mainMenuListClass}>
        <span className={menuItemClass}>
          <Icon icon="grid-view" iconSize={15} />
          <span className={menuItemTextClass}>My Projects</span>
        </span>
      </Link>

      <Link to={"/home"} className={mainMenuListClass}>
        <span className={menuItemClass}>
          <Icon icon="search" iconSize={15} />
          <span className={menuItemTextClass}>Find Projects</span>
        </span>
      </Link>

      <Link to={"/messages"} className={mainMenuListClass}>
        <span className={menuItemClass}>
          <Icon icon="chat" iconSize={15} />
          <span className={menuItemTextClass}>Messages</span>
        </span>
      </Link>
      <Link to={"/notifications"} className={mainMenuListClass}>
        <span className={menuItemClass}>
          <Icon icon="notifications" iconSize={15} />{" "}
          <span className={menuItemTextClass}>Notifications</span>
          <div
            className="  count-badge- f6 br1 -bg-white "
            style={{
              color: "white",
              fontWeight: "bold",
              marginLeft: "1rem",
              background: "rgb(196, 196, 199)",
              padding: "0.1rem 0.4rem"
            }}
          >
            <span className="bg-white-">{props.notifications.length}</span>
          </div>
        </span>
      </Link>

      {/* <Link to={"/settings"} className={mainMenuListClass}>
      <span className="ml2"><Icon type="unordered-list"   /> Settings</span>

    </Link> */}
    </div>
  )
);
const messageMenu = (
  <div className="flex flex-column ma0 pa0">
    {/* 
    <Link to={"/notifications"} className={mainMenuListClass}>
      <span className="ml2"><Icon type="info-circle"   /> Notifications <Badge
        count={<div className={"ant-scroll-number ant-badge-count ml2 f8 exo fw6 bg-black-10 black-30"} >{notifications.length}</div>}
      >

      </Badge></span>
    </Link> */}
    {/* <Link to={"/messages"} className={mainMenuListClass}>
    <span className="ml2"><Icon type="mail"   /> Messages <Badge
        count={<div className={"ant-scroll-number ant-badge-count ml2 f8 exo fw6 bg-black-10 black-30"} >{notifications.length}</div>}
      >

      </Badge></span>

    </Link> */}
  </div>
);
const profileMenu = ({ logout, notifications }) => (
  <div className="flex flex-column ma0 pa0">
    <Link to={"/profile"} className={mainMenuListClass}>
      <span className={menuItemClass}>
        <Icon icon="user" iconSize={15} />
        <span className={menuItemTextClass}>Profile</span>
      </span>
    </Link>
    <Link to={"/account"} className={mainMenuListClass}>
      <span className={menuItemClass}>
        <Icon icon="lock" iconSize={15} />
        <span className={menuItemTextClass}>Account</span>
      </span>
    </Link>

    {/* <Link to={"/settings"} className={profileMenuListClass}>
      <span className="ml2"><Icon type="credit-card"   /> Account</span>
    </Link> */}
    {/* <Link to={"/notifications"} className={profileMenuListClass}>
      <span className="ml2"><Icon type="notification"   /> Notifications</span>
    </Link> */}
    <div onClick={() => logout()} className={mainMenuListClass2}>
      <span className={menuItemClass}>
        <Icon icon="log-out" iconSize={15} />

        <span className={menuItemTextClass}>Logout</span>
      </span>
    </div>

    {/* <div className="dn notifications-list rubik f-lex -flex-column f-lex-auto ma0 pa0">
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
    </div> */}
  </div>
);

const Header = () => {
  // console.log("[[ AccountContext ]]", AccountContext);

  return (
    <AccountContext.Consumer>
      {props => (
        console.log("AccountContext header ", props),
        console.log("isAuthenticated ", props.isAuthenticated),
        (
          <header
            className={
              " fixed top-0 left-0 w-100 z-101 bg-black -bg-pink vh12 flex items-center "
            }
          >
            <div className="flex flex-row flex-auto justify-between">
              {!props.isAuthenticated && (
                <div className="bb- b--white bw1 flex flex-row flex-auto justify-between vh-50- h-100 ph3">
                  <div className="flex flex-row  flex-auto ph3 pv3 black-80 fw7 items-center justify-start">
                    <Link
                      to={"/"}
                      className={
                        "white flex ph3 ttu pv2 items-center logotext ttu spaced tracked raleway f5 fw8 ba b--white bw1"
                      }
                    >
                      Crew20
                    </Link>
                  </div>

                 
                  <div className="flex flex-column items-center justify-center ph3 pv2">
                    <button
                      onClick={props.login}
                      className={
                        "br1 bg-black primary pointer trans-a bn flex flex-row items-center ph3 pv2 relative "
                      }
                    >
                      <span className="ttu f6 fw6 white raleway tracked-03 pv1 ">
                        Sign In
                      </span>
                    </button>
                  </div>

                  <div className="flex flex-column items-center justify-center ph3 pv2">
                    <button
                      onClick={props.register}
                      className={
                        "br1 bg-white primary pointer trans-a bn flex flex-row items-center ph3 pv2 relative "
                      }
                    >
                      <span className="ttu f6 fw6 black raleway tracked-03 pv1 ">
                        Register
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {props.isAuthenticated && (
                <>
                  <div className="flex flex-row  flex-auto ph3 pv3 black-80 fw7 items-center justify-start">
                    <Link
                      to={"/home"}
                      className={
                        "white flex ph3 ttu pv2 items-center logotext ttu spaced tracked raleway  f4 fw8 ba b--white bw1"
                      }
                    >
                      Crew20
                    </Link>
                  </div>


                  {!props.account && props.account.user && props.account.user.profile && props.account.user.profile.confirmed && (
                    <div className="flex flex-column items-center justify-center ph3 pv2">
                      <button
                        onClick={props.logout}
                        className="br1 bg-black primary pointer trans-a bn flex flex-row items-center ph3 pv2 relative "
                      >
                        <span className="ttu f6 fw6 white raleway tracked-03 pv1 ">
                          Logout
                        </span>
                      </button>
                    </div>
                  )}

                  {props.account.user.profile.confirmed && (
                    <div className="flex flex-column  f6 fw7 ">
                      <nav className="flex flex-row flex-auto flex-wrap w-100">

                      { props.isProject && <div className="flex flex-column items-center justify-center ph3 pv2">
                    <button
                      onClick={props.toggleBackoffice}
                      className={
                        "br1 bg-black primary pointer trans-a bn flex flex-row items-center ph3 pv2 relative "
                      }
                    >
                      <span className="ttu f6 fw6 white raleway tracked-03 pv1 ">
                        Backoffice
                      </span>
                    </button>
                  </div>
              }
              
                        <section className="profile-button flex flex-column flex-auto- items-center justify-center pv3 pl0-ns pr0-ns pr0">
                          <span
                            className="profile-widget flex items-center justify-center"
                            // style={{ marginRight: 24 }}
                          >
                            <Popover
                              content={profileMenu({
                                logout: props.logout,
                                notifications: props.notifications || []
                              })}
                              placement="bottomRight"
                              trigger="hover"
                              className="flex flex-row items-center pointer"
                            >
                              <div className="flex">
                                <span className="f5 fw6 white mr3 visible-ns hidden-sm">
                                  {props.account.user.profile &&
                                    props.account.user.profile.name.first}{" "}
                                  {props.account.user.profile &&
                                    props.account.user.profile.name.last}
                                </span>
                                <Avatar
                                  size="large"
                                  shape="round"
                                  className={"bg-center bg-cover "}
                                  style={{
                                    color: "white",
                                    backgroundImage: props.account.user.profile
                                      .picture.length
                                      ? "url(" +
                                        props.account.user.profile.picture +
                                        ")"
                                      : GeoPattern.generate(
                                          props.account.user.profile.name
                                            .first +
                                            props.account.user.profile.name.last
                                        ).toDataUrl()
                                  }}
                                />
                              </div>
                            </Popover>
                          </span>
                        </section>
                        <section
                          id="nav"
                          className={
                            " flex flex-auto- flex-column items-end justify-center raleway pv3 pl3 pr4 pl4-ns pr4-ns f3"
                          }
                        >
                          <Popover
                            content={mainMenu({
                              logout: props.logout,
                              notifications: props.notifications || []
                            })}
                            placement="bottomLeft"
                            trigger="hover"
                            className="flex flex-column items-center"
                          >
                            <span
                              className="flex items-center justify-center"
                              style={{ fontSize: "20px" }}
                            >
                              <Icon
                                icon="ring"
                                iconSize={20}
                                className={" white pointer"}
                              />
                            </span>
                            <span className="dn f7 fw5 black-30- white pointer">
                              Menu
                            </span>
                          </Popover>
                        </section>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          </header>
        )
      )}
    </AccountContext.Consumer>
  );
};

export default Header;
// Header.contextType = AccountContext;
