import React, { useState, getGlobal } from "reactn";
import { Link } from "react-router-dom";
import { useAuth0 } from "../../../react-auth0-spa";
import moment from "moment";

import { Popover, Button, Slider, Icon } from "antd";
import { Avatar, Badge } from "antd";
import MaterialIcon, { colorPalette } from "material-icons-react";

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
  "flex flex-auto f6 fw6 black-50 ph2 pv2 bb b--black-05 w5";
const mainMenu = (
  <div className="flex flex-column ma0 pa0">
    <Link to={"/"} className={mainMenuListClass}>
      <MaterialIcon icon="home" theme={"outlined"} size={18} color="#c5c5c5" />
      <span className="ml2">Home</span>
    </Link>
    <Link to={"/scenes"} className={mainMenuListClass}>
      Scenes
    </Link>
    <Link to={"/characters"} className={mainMenuListClass}>
      Characters
    </Link>
    <Link to={"/dialogues"} className={mainMenuListClass}>
      Dialogues
    </Link>
    <Link to={"/sequencer"} className={mainMenuListClass}>
      Sequencer
    </Link>
    <Link to={"/medialibrary"} className={mainMenuListClass}>
      Media Library
    </Link>
  </div>
);
const profileMenu = (
  <div className="flex flex-column ma0 pa0">
    <Link to={"/account/profile"} className={profileMenuListClass}>
      <span className="ml2">Profile</span>
    </Link>
    <Link to={"/account/settings"} className={profileMenuListClass}>
      <span className="ml2">Account</span>
    </Link>
    <Link to={"/notifications"} className={profileMenuListClass}>
      <span className="ml2">Notifications</span>
    </Link>
    <div className="notifications-list rubik flex flex-column flex-auto ma0 pa0">
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
);

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: props.isPlaying || false,
      isPaused: props.isPaused || false,
      popoverVisible: false
    };
  }
  popoverHide = () => {
    this.setState({
      popoverVisible: false
    });
  };

  popoverHandleVisibleChange = popoverVisible => {
    this.setState({ popoverVisible });
  };

  render() {
    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin
    });

    return (
      <header
        className={
          (this.props.theme.main === "dark" ? " " : " bg-white ") +
          " fixed top-0 left-0 w-100 z-999 " +
          this.props.theme.main
        }
      >
        <div className="flex flex-row flex-auto justify-between">
          <div className="flex flex-row flex-auto ph0 pv0 black-80 fw7 items-center">
            <span className="dn logo2 varela -montserrat br0 w3 h3 mr3 pa2">
              <img src={logoUrl} />
            </span>
            <span
              className={
                (this.props.theme.main === "dark" ? " white " : " black-90 ") +
                "flex ph3 pv3 items-center logotext ttu spaced tracked varela"
              }
            >
              imaginIQ
            </span>
          </div>
          {!isAuthenticated && (
            <div className="flex flex-column">
              <button onClick={() => loginWithRedirect({})}>Login</button>
            </div>
          )}
          {isAuthenticated && (
            <div className="flex flex-column">
              <button onClick={() => logoutWithRedirect({})}>Logout</button>
            </div>
          )}
          {isAuthenticated && (
            <div className="flex flex-column">
              <span className="user-info">
                <img
                  src={user.picture}
                  alt="Profile"
                  className="nav-user-profile d-inline-block rounded-circle mr-3"
                  width="50"
                />
                <h6 className="d-inline-block">{user.name}</h6>
              </span>
            </div>
          )}

          {getGlobal() && getGlobal().user && getGlobal().user.isLoggedIn ? (
            <div className="flex flex-column  f6 fw7 ">
              <nav className="flex flex-row flex-auto flex-wrap w-100">
                <section
                  id="nav"
                  className={
                    " flex flex-auto flex-column items-end justify-center raleway bl- b--black-05 -br pa3 w5 f3 w3-"
                  }
                >
                  <Popover
                    content={mainMenu}
                    placement="bottomRight"
                    trigger="hover"
                    // visible={this.state.popoverVisible}
                    // onVisibleChange={this.popoverHandleVisibleChange}
                    className="flex flex-column items-center"
                  >
                    <span
                      className="flex items-center justify-center"
                      style={{ fontSize: "22px" }}
                    >
                      <Icon
                        type="menu"
                        className={this.props.theme.colorScheme.accent.light}
                      />
                    </span>
                    <span className="dn f7 fw5 black-30">Menu</span>
                  </Popover>
                </section>
                <section className="profile-button flex flex-column flex-auto- items-center justify-center pv3 pl4 pr3 ">
                  <span
                    className="flex items-center justify-center"
                    style={{ fontSize: "22px" }}
                  >
                    <Icon
                      type="message"
                      className={this.props.theme.colorScheme.accent.light}
                    />
                  </span>
                </section>

                <section className="profile-button flex flex-column flex-auto- items-center justify-center pv3 pl4 pr3 w33">
                  <span
                    className="flex items-center justify-center"
                    style={{ marginRight: 24 }}
                  >
                    <Popover
                      content={profileMenu}
                      placement="bottomRight"
                      trigger="hover"
                      // visible={this.state.popoverVisible}
                      // onVisibleChange={this.popoverHandleVisibleChange}
                      className="flex flex-column items-center"
                    >
                      <Badge count={1}>
                        <Avatar size="small" shape="square" icon="user" />
                      </Badge>
                    </Popover>
                  </span>
                </section>
              </nav>
            </div>
          ) : null}
        </div>
      </header>
    )
  }
}

export default Header;
