// @flow
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@blueprintjs/core";

import { Fn, app } from "../../../utils/fn/Fn.js";
import moment from "moment";

import SectionTitle from "../_Elements/SectionTitle/SectionTitle.jsx";

var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;

// import PropTypes from 'prop-types';

class RecentWork extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      completedProjects: [],
      archive: this.props.projects || [],
      ready: false
    };

    this.getCompletedProjects = this.getCompletedProjects.bind(this);
  }

  async getCompletedProjects() {
    // let projects = await Fn.get('subscribedProjects');
    let projects = await app
      .fetchSubscribedProjects({
        self: this,
        userId: this.props.user.id
      })
      .then(projects => {
        console.log(" ");
        console.log(" ");
        console.log("subscribed projects", projects);
        console.log(" ");
        console.log(" ");

        let completed = [];

        for (let project of projects) {
          console.log(" ");
          console.log(" ");
          console.log("project", project);
          console.log(" ");
          console.log(" ");

          if (
            project.hasOwnProperty("end_date") &&
            moment(project.end_date).isBefore(moment(new Date()))
          ) {
            completed.push(project);
          }
        }
        this.setState({
          completedProjects: completed,
          ready: true
        });
        console.log(" ");
        console.log(" ");
        console.log("completed Projects", completed);
        console.log(" ");
        console.log(" ");
      });
  }

  componentDidMount = () => {
    // console.log('RecentWork mounted');
    this.getCompletedProjects();
  };
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <section id="RecentWork" className="flex w-100 mt4">
        <div className="flex flex-column mb2 pa0 br1 w-100">
          <SectionTitle
            title={"Recent Work"}
            functionButton={null}
            labels={[
              {
                text: "projects",
                count: this.state.completedProjects.length
              }
            ]}
          />

          <div className="flex flex-column pv3">
            <div className="flex flex-auto flex-column pb0 ">
              <div className="flex flex-row flex-wrap f4 fw4 black-60 mb0 col-3 justify-between">
                {this.state.ready &&
                  this.state.completedProjects.map(
                    (item, index) => (
                      console.log("[[ Project item ]]", item),
                      (
                        <Link
                          to={"/project/" + item.id}
                          className={
                            "   raleway  pointer flex flex-row items-center justify-center pr3- mb4 br2 overflow-hidden bs-b "
                          }
                        >
                          <div
                            style={{
                              width: "200px",
                              height: "100%",
                              borderRadius: "0",
                              backgroundImage:
                                typeof item.media !== "undefined" &&
                                item.media.images.length > 0
                                  ? "url(" + item.media.images[0].url + ")"
                                  : GeoPattern.generate(item.title).toDataUrl()
                            }}
                            className="cover bg-center w-30"
                          />

                          <div
                            className={
                              " flex flex-column bg-white w-100 pa3- h-100"
                            }
                          >
                            <div className=" flex flex-column bg-white w-100 pa3 h-100">
                              <div className=" flex f4 fw6 pb2 black w-100">
                                {item.title}
                              </div>
                              <div className=" flex flex-row w-100 justify-between pb2">
                                <div className=" items-center ttc flex f6 fw6 black-40">
                                  {item.type}
                                </div>
                                <div className="w-60 flex f6 fw5 pb2- black-20 items-center justify-end">
                                  {moment(item.start_date).format("MMMM YYYY")}
                                </div>
                              </div>
                              <div className=" flex f5 fw5 pb0 black-50">
                                {item.description.substr(0, 60) + " ..."}
                              </div>
              
                            </div>
                          </div>
                        </Link>
                      )
                    )
                  )}


              </div>
              {this.state.ready &&
                  this.state.completedProjects.length === 0 && (
                    <div className="flex flex-column w-100 pv3 items-center justify-center ba- -b--black-05 br2">

                      <div className="raleway flex w-100 pv3- f5 fw6 black-30 tc justify-center">No projects to show</div>

                    </div>
                  )}

            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default RecentWork;
