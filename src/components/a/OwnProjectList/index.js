// @flow
import React, { Component } from 'react';
import Fn from '../../../utils/fn/Fn.js';
// import PropTypes from 'prop-types';
import { Icon, Spinner, Dialog, NumericInput } from '@blueprintjs/core';
import './style.css';

class OwnProjectList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      projects: [],
      addToProjectButtonLoading: false

    }
  }

  async addToProject(item) {
    console.log(item)
    this.setState({ addToProjectButtonLoading: true })
   
    let userId = this.props.userId;

    await Fn.addUserToProject({ self: this, project: item, userId: userId, closeDialog: this.props.closeDialog })

    setTimeout(() => {
      this.setState({ addToProjectButtonLoading: false })
    },1000)

  }

  async componentDidMount() {
    console.log('OwnProjectList mounted');
    await Fn.fetchOwnProjects({ self: this })

  }

  static getDerivedStateFromError(error) {
    // getDerivedStateFromError -> Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
  }

  getDerivedStateFromProps = (nextProps, prevState) => {
    console.log('OwnProjectList getDerivedStateFromProps', nextProps, prevState);
  }

  getSnapshotBeforeUpdate = (prevProps, prevState) => {
    console.log('OwnProjectList getSnapshotBeforeUpdate', prevProps, prevState);
  }

  componentDidUpdate = () => {
    console.log('OwnProjectList did update');
  }

  componentWillUnmount = () => {
    console.log('OwnProjectList will unmount');
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <div className="OwnProjectList-wrapper">
        {
          this.state.ready && this.state.projects.map((item, index) => (
          <div 
          onClick={() => this.addToProject(item)}
          className="own-project-item flex flex-column pa2 br3">
              <div className=" pointer flex flex-row  items-center justify-start">
                <div
                  className="cover bg-center"
                  style={{ width: '50px', height: '50px', borderRadius: '5px', backgroundImage: 'url("' + item.media.images[0].url + '")' }}>
                </div>
                <div className=" flex flex-row ml3 mr3 ">
                  <div className=" flex f6 fw5 black-70">{item.title}</div>
                </div>

              {
                this.state.addToProjectButtonLoading  && <Spinner size={15} />              }
                

              </div>
            </div>
          ))
        }
        {
          !this.state.ready && <Spinner size={15} />
        }
      </div>
    );
  }
}

// OwnProjectList.PropTypes = {

// }

// OwnProjectList.defaulsProps = {

// }

export default OwnProjectList;