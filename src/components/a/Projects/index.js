// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';

import Fn from '../../../utils/fn/Fn.js';

class Projects extends Component {

  constructor(props) {

    super(props)

    this.state = {
      hasError: false,
      projects: []
    }

    this.fetchProjects = this.fetchProjects.bind(this)

  }
  async fetchProjects() {

    await Fn.fetchProjects({self:this})
    

  }

  componentDidMount = () => {
    // console.log('RecentWork mounted');
  }

  static getDerivedStateFromError(error) {
    // getDerivedStateFromError -> Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
  }

  getDerivedStateFromProps = (nextProps, prevState) => {
    // console.log('RecentWork getDerivedStateFromProps', nextProps, prevState);
  }

  getSnapshotBeforeUpdate = (prevProps, prevState) => {
    // console.log('RecentWork getSnapshotBeforeUpdate', prevProps, prevState);
  }

  componentDidUpdate = () => {
    console.log('RecentWork did update');
  }

  componentWillUnmount = () => {
    console.log('RecentWork will unmount');
  }

  render() {

    

    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <section id="RecentWork" className="mt3">

        <div className="flex flex-column mb2 pa0 br1 ">

          

            <div className="flex flex-row pv3">

              <div className="flex flex-auto flex-column pb0 ">

                <div className="flex flex-row flex-wrap f4 fw4 black-60 mb0 col-2 justify-between">
                  {this.state.projects.map((item, index) => (
                    console.log('[[ Project item ]]', item),

                    <Link
                      to={'/projects/' + item.id}
                      className={"  pointer flex flex-column items-center justify-center pr3- mb4"}>
                      <div
                        style={{ width: '100%', height: '270px', borderRadius: '0', backgroundImage: "url(" + item.image + ")" }}
                        className="cover bg-center" />
                      <div className={" flex flex-column bg-white w-100 pa3"}>
                        <div className={" flex f4 fw6 pb2 black-70"}>
                          {item.title}
                        </div>
                        <div className={" flex f6 fw5 pb3 black-50"}>
                          {item.position}
                        </div>
                        <div className={" flex f5 fw5  black-50"}>
                          {item.description}
                        </div>
                      </div>
                    </Link>

                  ))}
                </div>

              </div>

            </div>

          </div>

      </section>
        );
      }
    }
    
    
    
export default Projects;