import React from "react";

import { Icon } from "@blueprintjs/core";

import { motion, AnimatePresence } from "framer-motion";
// import { Motion, Frame, Scroll, useCycle } from "framer"

// import func from "./fn";

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

export default class UserListMinimal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crew: [],
      invited: [],
      items: [],
      isConfirmed: false,
      ready: false,
      days: this.props.days
    };

    this.rate = React.createRef()

    this.setRate = this.setRate.bind(this)
  }
setRate({index,value}) {
  // let rate = parseInt(this.rate.current.value)
  console.log('set rate 1', value)
  this.props.setRate({ index, rate: parseInt(value) })
}
setDays({index,value}) {
  // let days = parseInt(this.rate.current.value)
  console.log('set rate 1', value)
  // this.setState({
  //   days: value
  // })
  this.props.setDays({ index, days: parseInt(value) })
  // this.props.setRate({ index, rate: parseInt(value) })
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
    console.log('user props ',this.props)
    return (
      <div
        className="flex flex-column mt0 mr4"
        id=""
      >
        
        {this.props.ready  && (
          <motion.section variants={container} initial="hidden" animate="show">
            {this.props.items.length > 0 &&
              this.props.items.map((item, index) => (
                <motion.div
                  variants={item}
                  key={index}
                  // initial={"hidden"}
                  // animate={"show"}
                  // layoutTransition={spring}
                  //  style={{ transitionDelay: ((index * 0.05) + "s") }}
                  //  initial={{ x: 0, y:50, opacity: 0 }}
                  // animate={"show"}
                  exit={"hidden"}
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
                        " flex flex-row justify-start w-100 trans-a mb2"
                      }
                    >
                      <div
                        className={
                          "  flex flex-row-ns flex-column flex-auto w-30 "
                        }
                      >
                        <div 
                        onClick={() =>
                          this.props.toggleDrawer({ item, type: "user" })
                        }
                        className="flex flex-column w-100=">
                          <div className="round p-a1 bg-white center">
                            <div
                              style={{
                                width: "50px",
                                height: "50px",
                                backgroundImage:
                                  "url(" + this.props.userAvatar(item) + ")"
                              }}
                              className="center pointer round-  cover bg-center"
                            ></div>
                          </div>
                        </div>

                        <div 
                        onClick={() =>
                          this.props.toggleDrawer({ item, type: "user" })
                        }
                        className="flex flex-column justify-center items-start pl2">
                          <div className="f4 flex flex-column items-start w-100 raleway ">
                            <span className="flex flex-row-ns flex-column -w-100 black f3 fw6">
                              <span className="flex flex-row items-center justify-start-ns justify-center black f5 fw6">
                                {item.profile.name.first}{" "}
                                {item.profile.name.last}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

         



               
                    </div>
                  )}
                </motion.div>
              ))}
          </motion.section>
        )}

        {this.props.items.length === 0 && (
          <div className="flex f5 fw5 black-50 pv3">No crew assigned yet.</div>
        )}
      </div>
    );
  }
}
