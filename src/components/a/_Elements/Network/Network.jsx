// @flow
import React from "react";
import SectionTitle from "../SectionTitle/SectionTitle.jsx";
import { Popover, Empty, Skeleton, Rate, Tooltip } from "antd";
import { Icon } from "@blueprintjs/core";

import { Link } from "react-router-dom";
// import PropTypes from 'prop-types';
var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;
const Network = props => (
  <section id="Network" className="flex mt4 w-100">
    <div className="flex flex-column mb2 pa0 br1 bg--white w-100">
      {/* <div className="flex flex-row bb b--black-10 justify-between">
      <div className="flex flex-auto w--100 flex-row pb0">
        <p className="flex f4 fw6 black-60 mb0 ph3 pv2 items-center justify-center">
          Network
        </p>
        <p className="flex f6 fw4 black-60 mb0 ph3 pv2- items-center justify-center bl b--black-10">
          {this.state.user.profile.connections.length}{" "}
          connections
        </p>
        <p className="flex f6 fw4 black-60 mb0 ph3 pv2- items-center justify-center bl b--black-10">
          0 pending
        </p>
      </div>
      <div className="flex flex-auto- flex-row pb0">
        <div
          // onClick={this.networkSeeAll}
          id="NetworkSeeAll-button"
          className="flex flex-column pointer h-100 bl b--black-10"
        >
          <div
            id=""
            className="flex flex-row ph0 pv0 items-center justify-center bg-white h-100"
          >
            <span className="f6 fw4 black-60 ph3">See All</span>

            <div
              style={{ backgroundColor: "#b3bf95" }}
              className="flex flex-column items-center justify-center ph3 pv2 white h-100"
            >
              <Icon icon={"ring"} iconSize={15} />
            </div>
          </div>
        </div>
      </div>
    </div> */}
      <SectionTitle
        title={"Network"}
        functionButton={{
          title: "View All",
          icon: "ring",
          function: () => props.addToNetwork()
        }}
        labels={[
          {
            text: "connections",
            count: props.connections.length
          },
          {
            text: "pending",
            count: props.user.networkPending || 0
          }
        ]}
      />

      <div className="flex flex-row w-100">
        <div className="flex flex-auto flex-column pb0 ">
          <div className="flex flex-row flex-wrap f4 fw4 black-60 mb0 pt3 pb3">
            {props.connections.map((item, index) => (
              // console.log('[[ Connection item ]]', item),
              <Popover
                content={
                  <div className="flex flex-column">
                    <div
                      onClick={() => props.navigateToUser({ id: item.id })}
                      className="pointer flex f6 fw5 black-60 ph3 pv2 hover-black bb b--black-05"
                    >
                      View Profile
                    </div>

                    <div
                      onClick={() => props.addToNetwork(item)}
                      className="pointer flex f6 fw5 black-60 ph3 pv2 hover-black bb b--black-05"
                    >
                      Add to network
                    </div>

                    <div
                      onClick={() => props.sendMessage(item)}
                      className="pointer flex f6 fw5 black-60 ph3 pv2 hover-black"
                    >
                      Send Message
                    </div>
                  </div>
                }
                trigger="hover"
              >
                
                <div
                  // to={"/user/" + item.id}
                  onClick={ () => { props.isCurrentUser ? props.history.push(
                      "/user/" + item.id
                    ) : props.navigateToUser({ id: item.id }) }}
                  className={
                    "  pointer flex flex-column-ns flex-row pa3-ns pa4 items-center justify-start  w-100-s bn-ns bb b--black-05"
                  }
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "100px",
                      backgroundImage:
                                                      item.profile.picture.length  
                                                      ? "url(" + item.profile.picture + ")"
                                                      : GeoPattern.generate(item.profile.name.first + item.profile.name.last).toDataUrl()
                    }}
                    className="cover bg-center"
                  />
                  <div
                    className={
                      "    flex flex-row -flex-column pt2-ns pl3 f5 fw6 black  "
                    }
                  >
                    <div className={" flex  "}>{item.profile.name.first}</div>
                    <div className={" flex ml1"}>{item.profile.name.last}</div>
                  </div>
                </div>
              </Popover>
            ))}

{ 
                  props.connections.length === 0 && (
                    <div className="flex flex-column w-100 pv3 items-center justify-center ba- -b--black-05 br2">

                      <div className="raleway flex w-100 pv3- f5 fw6 black-30 tc justify-center">You do not have any network connections yet.</div>

                    </div>
                  )}

          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Network;
