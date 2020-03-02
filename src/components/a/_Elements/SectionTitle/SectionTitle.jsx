// @flow
import React from "react";
import { Icon } from "@blueprintjs/core";
// import PropTypes from 'prop-types';

const SectionTitle = props => (
  <div className="raleway w-100 flex flex-row b-b b--black-10 justify-between bg-white br2 overflow-hidden bs-b">
    <div className="flex flex-auto w--100 flex-row pb0">
      <p className="flex f5 fw6 black mb0 ph3 pv2 items-center justify-center">
        {props.title}
      </p>

      {props.labels &&
        props.labels.map((label, index) => (
          <p className="flex f6 fw5 black-20 mb0 ph3 pv2- items-center justify-center bl b--black-05">
            {label.count} {label.text}
          </p>
        ))}
    </div>

    {props.functionButton && (
      <div className="flex flex-auto- flex-row pb0">
        <button
          onClick={props.functionButton.function}
          id="function-button"
          className="flex flex-column pointer h-100 bl b--black-10 ph0 bg-white"
        >
          <div
            id=""
            className="flex flex-row ph0 pv0 items-center justify-center bg-white h-100"
          >
            <span className="f6 fw4 black-60 ph3">
              {props.functionButton.title}
            </span>

            <div
              className="flex flex-column items-center justify-center ph3 pv2 white h-100"
              style={{ backgroundColor: "rgb(179, 191, 149)" }}
            >
              <Icon
                icon={props.functionButton.icon}
                className="bp3-icon bp3-icon-ring"
              ></Icon>
            </div>
          </div>
        </button>
      </div>
    )}
  </div>
);

export default SectionTitle;
