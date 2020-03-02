import React from "react";

import { Icon } from "@blueprintjs/core";

import { motion, AnimatePresence } from "framer-motion";
// import { Motion, Frame, Scroll, useCycle } from "framer"

// import func from "./fn";
var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300
};

const container = {
  hidden: { y: 10, opacity: 0 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      //   delayChildren: 0.2,
      staggerChildren: 0.2,
      // delay: 1,
      // x: { type: "spring", stiffness: 100 },
      y: { type: "spring", stiffness: 100 },
      default: { duration: 0.3 }
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0 },
  transition: {
    //   delayChildren: 0.2,
    staggerChildren: 0.2,
    // delay: 1,
    // x: { type: "spring", stiffness: 100 },
    y: { type: "spring", stiffness: 100 },
    default: { duration: 0.3 }
  }
};

export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crew: [],
      invited: [],
      items: [],
      isConfirmed: false,
      ready: false
    };
  }
  async componentDidMount() {
    console.log("UserList props", this.props);
    // this.setState({
    //   // crew: this.props.crew,
    //   // invited: this.props.invited
    // });
    // i
    // let crew = this.props.crew;
    // let invited = this.props.invited;
    // // let invited_ = [];
    // func.checkConfirmed({ invited, crew }).then(res => {
    //   if (this.props.type === "production") {
    //     this.setState({
    //       invited: res,
    //       items: this.props.crew,
    //       ready: true
    //     });
    //   }
    //   if (this.props.type === "crew") {
    //     this.setState({
    //       invited: res,
    //       items: res,
    //       ready: true
    //     });
    //   }
    // });
  }
  render() {
    // const { isConfirmed } = this.state;
    return (
      <div
        className={
          " flex flex-column mt0 w-100 -pa3 -ba -b--black-05 -br4 -overflow-hidden justify-between"
        }
        id=""
      >
        {this.props.ready && (
          <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className={
              (this.props.columns && " col-" + this.props.columns) +
              (this.props.columns > 1
                ? " flex-row flex-wrap "
                : " flex-column ") +
              " flex justify-between "
            }
          >
            {this.props.items.length > 0 &&
              this.props.items.map((item, index) => (
                <motion.div
                  // onClick={() =>
                  //   this.props.toggleDrawer({ item, type: this.props.type })
                  // }
                  className="pointer"
                  variants={item}
                  key={index}
                  // initial={"hidden"}
                  // animate={"show"}
                  // layoutTransition={spring}
                  //  style={{ transitionDelay: ((index * 0.05) + "s") }}
                  //  initial={{ x: 0, y:50, opacity: 0 }}
                  // animate={"show"}
                  exit={"hidden"}
                  transitionDelay={ index + 0.3 }
                  //   transition={{
                  // delay: 1}}

                  // style={{ background }}
                >
                  {item && (
                    <div
                      // style={{ transitionDelay: ((index * 0.05) + "s") }}
                      id={"user-" + item.id}
                      className={
                        // ( this.state.isDeletingStart[index] ? " opacity-50 blur-grayscale " : "  " )
                        // + ( this.state.isDeleting[index] ? " transform-y-up opacity-0 blur-10" : " transform-y-0 opacity-1  blur-0" )
                        " flex flex-row justify-start w-100 trans-a bg-white-50 hover-bg-white mb3 bs-b br3 overflow-hidden "
                      }
                    >
                      <div
                        className={
                          (this.props.type === "people"
                            ? " w-40 "
                            : " w-100 ") +
                          " flex flex-row-ns flex-column flex-auto-"
                        }
                      >
                        <div className="flex flex-column w-100=">
                          <div className="round- p-a1 bg-white center">
                            <div
                              onClick={() =>
                                this.props.toggleDrawer({
                                  item,
                                  type: this.props.type
                                })
                              }
                              style={{
                                width: "120px",
                                height: "90px",
                                backgroundImage:
                                  item.profile &&
                                  item.profile.picture &&
                                  item.profile.picture.length
                                    ? "url(" + item.profile.picture + ")"
                                    : GeoPattern.generate(
                                        item.profile &&
                                          item.profile.name &&
                                          item.profile.name.first +
                                            item.profile &&
                                          item.profile.name &&
                                          item.profile.name.last
                                      ).toDataUrl()
                              }}
                              className="center pointer round-  cover bg-center"
                            ></div>
                          </div>
                        </div>

                        <div
                          onClick={() =>
                            this.props.toggleDrawer({
                              item,
                              type: this.props.type
                            })
                          }
                          className="flex flex-column justify-center items-start ph4"
                        >
                          <div className="f4 flex flex-column items-start w-100 raleway ">
                            <span className="flex flex-row-ns flex-column -w-100 black f3 fw6">
                              <span
                                className={
                                  "userList-type-" +
                                  this.props.type +
                                  " flex flex-row items-center justify-start-ns justify-center black f5 fw6"
                                }
                              >
                                {item.profile.name.first}{" "}
                                {item.profile.name.last}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {this.props.type === "people" && (
                        <div className="flex flex-row-ns flex-column w-30 ph4 pv3 ">
                          <div className="flex flex-column justify-center">
                            <span className="flex flex-row items-center justify-start-ns justify-start black-40 f6 fw6">
                              {item.position}
                            </span>
                          </div>
                        </div>
                      )}

                      {this.props.type === "crew" && (
                        <div className="flex flex-row-ns flex-column w-30 ph4 pv3 ">
                          <div className="flex flex-column justify-center">
                            <span className="flex flex-row items-center justify-start-ns justify-start black-40 f6 fw6">
                              {item.isConfirmed
                                ? "Confirmed "
                                : "Not Confirmed"}
                              {item.isConfirmed ? (
                                <Icon
                                  icon="endorsed"
                                  iconSize={"20"}
                                  className="f6 green ml2"
                                />
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-row-ns flex-column w-30 ph4 pv3 "></div>

                      {this.props.state.deleteConfirmation[index] === false && (
                        <div
                          onClick={() =>
                            this.props.confirmDelete({ item, index })
                          }
                          className="pointer flex flex-column items-end justify-center w-20 ph4 pv3"
                        >
                          <div className="flex flex-column justify-center">
                            <span className="flex flex-row items-center justify-start-ns justify-center black-30 hover-black-70 f6 fw6">
                              Remove
                              <Icon
                                icon={"delete"}
                                iconSize={20}
                                className="ml2 black-20 f6"
                              />
                            </span>
                          </div>
                        </div>
                      )}

                      {this.props.state.deleteConfirmation[index] === true && (
                        <div
                          onClick={e => this.props.remove({ e, item, index })}
                          className="pointer flex flex-column items-end justify-center w-20 ph4 pv3"
                        >
                          <div className="flex flex-column justify-center">
                            <span className="flex flex-row items-center justify-start-ns justify-center black-30 hover-black-70 f6 fw6">
                              Are you sure?
                              <Icon
                                icon={"delete"}
                                iconSize={20}
                                className="ml2 red f6"
                              />
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
          </motion.section>
        )}

        {this.props.items.length === 0 && this.props.type === "people" && (
          <div className="flex f5 fw5 black-50 pv3">No crew assigned yet.</div>
        )}
        {/* {this.props.items.length === 0 && this.props.type === "network" && (
          <div className="flex f5 fw5 black-50 pv3">No crew assigned yet.</div>
        )} */}
      </div>
    );
  }
}
