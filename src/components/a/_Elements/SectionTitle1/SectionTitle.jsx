// @flow
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';

class SectionTitle extends PureComponent { 
  state = {
    hasError: false,
  }

  componentDidMount = () => {
    console.log('SectionTitle mounted');
  }

  static getDerivedStateFromError(error) {
    // getDerivedStateFromError -> Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
  }

  getDerivedStateFromProps = (nextProps, prevState) => {
    console.log('SectionTitle getDerivedStateFromProps', nextProps, prevState);
  }

  getSnapshotBeforeUpdate = (prevProps, prevState) => {
    console.log('SectionTitle getSnapshotBeforeUpdate', prevProps, prevState);
  }

  componentDidUpdate = () => {
    console.log('SectionTitle did update');
  }

  componentWillUnmount = () => {
    console.log('SectionTitle will unmount');
  }

  render () {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <div className="SectionTitle-wrapper">
        Test content
      </div>
    );
  }
}

SectionTitle.PropTypes = {

}

SectionTitle.defaulsProps = {

}

export default SectionTitle;