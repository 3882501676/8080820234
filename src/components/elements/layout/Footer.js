import React from "react";
import { Link } from "react-router-dom";
import { Popover, Icon } from "antd";

import themeColors from "../../../utils/themes";

const itemClasses = "flex pl2 pt2 pb2 cursor-pointer trans-a";
const themeMenu = props => (
  (
    <div className="flex flex-column">
      <div className="flex flex-row bb b--black-05">
        <div
          onClick={() =>
            props.switchTheme({ main: "light", colorScheme: props.theme.colorScheme })
          }
          className="theme-selection-dl flex flex-auto cursor-pointer"
        >
          <span className="f7 fw6 black-70 pa1 tc w-100">light</span>
        </div>
        <div
          onClick={() =>
            props.switchTheme({ main: "dark", colorScheme: props.theme.colorScheme })
          }
          className="theme-selection-dl flex flex-auto bg-black-70 cursor-pointer"
        >
          <span className="f7 fw6 white-70 pa1 tc w-100">dark</span>
        </div>
      </div>
      <div className="flex flex-row ma0 pa0 pr2">
        {themeColors().map((item, index) => (
          <div
            key={index}
            onClick={() =>
              props.switchTheme({ main: props.theme.main, colorScheme: item })
            }
            className={itemClasses}
          >
            <span className="ml2-">
              <div className={"theme-selection-icon  " + item.bg} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
)

const Footer = props => {
  return (
    <footer className="vh-10 fixed bottom-0 left-0 w-100 bg-white z-9 bt b--black-05">
      <div className="flex flex-row flex-auto">
        <div className="flex flex-column flex-auto w-100 black-80 fw7">
          <span className="copyright f7 fw1 black-40 ph3 pv3">
            &copy; 2019 Crew20.com. All Rights Reserved.
          </span>
        </div>
        <div className="flex flex-column flex-auto w-100 black-80 fw7">
          <nav className="flex flex-row flex-auto items-center justify-end w-100">
            {/* <div className="nav-item flex ph3 pv3">
              <Popover
                content={themeMenu(props)}
                placement="top"
                trigger="click"
                className="flex flex-column items-center"
              >
                <span
                  className="black-40 f7 flex flex-row"
                >
                  <Icon type="eye" />
                  <span className="pl2">Switch Theme</span>
                </span>
              </Popover>
            </div> */}
            <div className="nav-item flex ph3 pv3">
              <Link className="black-40 f7" to="/privacy-policy">
                Privacy Policy
              </Link>
            </div>
            <div className="nav-item flex ph3 pv3">
              <Link className="black-40 f7" to="/contact">
                Contact Us
              </Link>
            </div>
            <div className="nav-item flex ph3 pv3">
              <Link className="black-40 f7" to="/help">
                Help
              </Link>
            </div>
            <div className="nav-item flex ph3 pv3">
              <Link className="black-40 f7" to="/settings">
                Settings
              </Link>
            </div>
            <div className="nav-item flex ph3 pv3">
              <Link className="black-40 f7" to="/settings">
                Sign In
              </Link>
            </div>

          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
