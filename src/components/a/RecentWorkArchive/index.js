// @flow

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@blueprintjs/core";

import { Fn, app } from "../../../utils/fn/Fn.js";
import moment from "moment";

import SectionTitle from "../_Elements/SectionTitle/SectionTitle.jsx";
import AccountContext, { AccountConsumer } from '../../../utils/context/AccountContext.js';
// import PropTypes from 'prop-types';
var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;
class RecentWorkArchive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      completedProjects: null
    };

    this.getCompletedProjects = this.getCompletedProjects.bind(this);
  }

  async getCompletedProjects() {
    
    // let projects = Fn.get("subscribedProjects");
    let userId = this.context.account.user.id;
    await app.fetchSubscribedProjects({ self: this, userId: userId }).then(projects => {
      this.setState({
        projects: projects
      })
      let completed = [];
      for (let project of projects) {
        if (moment(project.end_date).isBefore(moment(new Date()))) {
          completed.push(project);
        }
      }
      this.setState({
        completedProjects: completed
      });
    })

 
  }
  componentDidMount = () => {
    // console.log('RecentWork mounted');
    this.getCompletedProjects();
  };

  static getDerivedStateFromError(error) {
    // getDerivedStateFromError -> Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
  }

  getDerivedStateFromProps = (nextProps, prevState) => {
    // console.log('RecentWork getDerivedStateFromProps', nextProps, prevState);
  };

  getSnapshotBeforeUpdate = (prevProps, prevState) => {
    // console.log('RecentWork getSnapshotBeforeUpdate', prevProps, prevState);
  };

  componentDidUpdate = () => {
    console.log("RecentWork did update");
  };

  componentWillUnmount = () => {
    console.log("RecentWork will unmount");
  };

  render() {
    // const projects = [
    //   {
    //     id: "01",
    //     title: "Project 1",
    //     position: "Videographer",
    //     description: "Lorum ipsum dolor sit amet",
    //     image: "https://www.washingtonpost.com/graphics/2019/entertainment/oscar-nominees-movie-poster-design/img/black-panther-web.jpg"
    //   },
    //   {
    //     id: "02",
    //     title: "Project 1",
    //     position: "Videographer",
    //     description: "Lorum ipsum dolor sit amet",
    //     image: "https://www.washingtonpost.com/graphics/2019/entertainment/oscar-nominees-movie-poster-design/img/black-panther-web.jpg"
    //   },
    //   {
    //     id: "03",
    //     title: "Project 1",
    //     position: "Videographer",
    //     description: "Lorum ipsum dolor sit amet",
    //     image: "https://www.washingtonpost.com/graphics/2019/entertainment/oscar-nominees-movie-poster-design/img/black-panther-web.jpg"
    //   },
    //   {
    //     id: "04",
    //     title: "Project 1",
    //     position: "Videographer",
    //     description: "Lorum ipsum dolor sit amet",
    //     image: "https://www.washingtonpost.com/graphics/2019/entertainment/oscar-nominees-movie-poster-design/img/black-panther-web.jpg"
    //   },
    //   {
    //     id: "05",
    //     title: "Project 1",
    //     position: "Videographer",
    //     description: "Lorum ipsum dolor sit amet",
    //     image: "https://www.washingtonpost.com/graphics/2019/entertainment/oscar-nominees-movie-poster-design/img/black-panther-web.jpg"
    //   }
    // ]

    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <section id="RecentWorkArchive" className="mt3">
        <div className="flex flex-column mb2 pa0 br1 ">
          <SectionTitle
            title={"Recent Work Archive"}
            functionButton={{
              title: "Add Archive Item",
              icon: "ring",
              function: () => this.props.addRecentWorkProject()
            }}
            labels={[
              {
                text: "projects",
                count: this.props.projects.length
              }
            ]}
          />

          {/* <div className="flex flex-row bb b--black-10 justify-between bg-white">

            <div className="flex flex-auto w--100 flex-row pb0">

              <p className="flex f4 fw6 black-60 mb0 ph3 pv2 items-center justify-center">Work Archive</p>
              <p className="flex f6 fw4 black-60 mb0 ph3 pv2- items-center justify-center bl b--black-10">{this.props.projects.length} projects</p>

            </div>

            <div className="flex flex-auto- flex-row pb0">

              <div
                onClick={this.props.addRecentWorkProject}
                id="NetworkSeeAll-button"
                className="flex flex-column pointer h-100 bl b--black-10">

                <div id="" className="flex flex-row ph0 pv0 items-center justify-center bg-white h-100">

                  <span className="f6 fw4 black-60 ph3">Add Archive Item</span>

                  <div
                    style={{ backgroundColor: '#b3bf95' }}
                    className="flex flex-column items-center justify-center ph3 pv2 white h-100">
                    <Icon icon={'ring'} iconSize={15} />
                  </div>

                </div>

              </div>
            </div>

          </div> */}

          <div className="flex flex-column pv3">
            <div className="flex flex-auto flex-column pb0 ">
             {
                  this.props.projects.length === 0 && (
                    <div className="flex flex-column w-100 pv3 items-center justify-center ba- -b--black-05 br2">

                      <div className="raleway flex w-100 pv3- f5 fw6 black-30 tc justify-center">No projects to show</div>

                    </div>
                  )}

              <section className="flex flex-row flex-wrap f4 fw4 black-60 mb0 col-3 justify-between">
                {this.props.projects.map(
                  (item, index) => (
                    console.log("[[ Project item ]]", item),
                    (
                      // <Link
                      //   to={'/user/project/' + item.id}
                      //   className={"    pointer flex flex-column items-center justify-center pr3- mb4 br2 overflow-hidden bs-b"}>
                      //   <div
                      //     style={{ width: '100%', height: '110px', borderRadius: '0', backgroundImage: "url(" + item.image + ")" }}
                      //     className="cover bg-center" ></div>
                      //   <div className={" flex flex-column bg-white w-100 pa3"}>
                      //     <div className={" flex f4 fw6 pb2 black-70"}>
                      //       {item.title}
                      //     </div>
                      //     <div className={" flex f6 fw5 pb3 black-50"}>
                      //       {item.position}
                      //     </div>
                      //     <div className={" flex f5 fw5  black-50"}>
                      //       {item.description}
                      //     </div>
                      //   </div>
                      // </Link>

                      <Link
                        to={"/project/" + item.id}
                        className={
                          "   raleway  pointer flex flex-row flex-auto- items-center justify-center pr3- mb4 br2 overflow-hidden bs-b "
                        }
                      >
                        <div
                          style={{
                            width: "200px",
                            height: "100%",
                            borderRadius: "0",
                            backgroundImage:
                              typeof item.image !== "undefined"
                                ? "url(" + item.image + ")"
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
              </section>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default RecentWorkArchive;
RecentWorkArchive.contextType = AccountContext;
