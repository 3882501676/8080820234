// @flow
import React, { Component } from "react";
import { Icon } from '@blueprintjs/core';
import { Fn } from "../../../utils/fn/Fn";
// import MessageBox from "../../../elements/display/messages/messagebox.js";

// import PropTypes from 'prop-types';

export default class Refresh extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
   
    return (
      <div
        onClick={this.props.refresh}
        className={
          (this.props.dashboard
            ? " top12vh-"
            : Fn.get("isMobile")
            ? " top-6vh- "
            : "  ") +
          " absolute top-0 right-0 pointer black-20- hover-black-40 flex flex-row items-center z-99 justify-center h-100 ph3 "
        }
      >
        <span className="mr2 f5 fw6 black-20 raleway">
          {this.props.ready ? "reload" : " " }
        </span>
        
        {" "}

        { this.props.ready ? (
          <Icon icon="refresh" iconSize={15} className="black-20" />
        ) : (
          <div>
            <div className="mt2 mr4 sp sp-3balls-small"></div>
          </div>
        ) }
      </div>
    );
  }
}

// export default Refresh;
