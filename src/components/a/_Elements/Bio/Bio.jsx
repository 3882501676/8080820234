// @flow
import React from "react";
import { Icon, Spinner, Dialog, NumericInput } from "@blueprintjs/core";

// import PropTypes from 'prop-types';

const Bio = props => (
  console.log("bio", props),
  (
    <section id="Bio" className="mt0-ns">
      <div className="flex flex-column mb2 pa4 br1 bg-white">
        <div className="flex flex-row">
          <div className="flex flex-auto flex-row pb0">
            <p className="f4 fw4 black-60 mb0 flex flex-row flex-auto">
              {props.user.profile.bio.length === 0 && (
                <div
                  onClick={props.createBio}
                  className="pointer flex ph3 pv2 f5 fw5 black-60 ba b--black-10 br1"
                >
                  Bio not available
                </div>
              )}{" "}
              {props.user.profile.bio}{" "}
              {props.canEdit && (
                <Icon
                  onClick={props.editBio}
                  icon={"edit"}
                  iconSize={12}
                  Skills
                  className="pointer black-30 ml2"
                />
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-column pt4">
          <div className=" pt0">
            <h3 className="f5 fw3 black-30 mb3 flex justify-start">Skills</h3>
          </div>

          <div className="flex flex-auto flex-column pb0 ">
            <p className="flex flex-row flex-wrap f4 fw4 black-60 mb0">
              {props.user.profile.additional.skills.map((item, index) => (
                <span className="   pointer flex f5 fw6 black-60 ph3 pv2 round- br2 bs-b mr2-ns bn w-100-s- items-center tc justify-center mb3 mb0-ns bg-black-20 white ts-a- mr2 ">
                  {item}
                </span>
              ))}{" "}
              {props.canEdit && (
                <Icon
                  onClick={props.editSkills}
                  icon={"edit"}
                  iconSize={12}
                  className="pointer black-30 ml2"
                />
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
);

export default Bio;
