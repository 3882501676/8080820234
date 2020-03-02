// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import Filepond from '../../elements/upload/Filepond.js';
import Fn from '../../../utils/fn/Fn.js';

const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

class FormPortfolioProject extends React.Component {
  constructor(props) {

    super(props)

    this.state = {
      hasError: false,
      image: '',
      startDate: '',
      endDate: ''
    }

    this.title = React.createContext()
    this.description = React.createContext()
    this.position = React.createContext()
    // this.image = React.createContext()

    this.submit = this.submit.bind(this)
    this.setImage = this.setImage.bind(this)
    this.handleRangeChange = this.handleRangeChange.bind(this)
  }
  handleRangeChange(e) {
    console.log(e)
    let startDate = e[0].toString()
    let endDate = e[1].toString()
    this.setState({
      startDate, endDate
    })
  }
  setImage(image) {
    this.setState({
      image: image
    })
  }
  async submit() {

    let title = this.title.current.value;
    let description = this.description.current.value;
    let position = this.position.current.value;
    let image = this.state.image;
    let date = {
      startDate: this.state.startDate,
      endDate: this.state.endDate
    }

    let data = {
      title, description, position, image, date
    }
    console.log()
    // this.props.submitPortfolioItem(this.bio.current.value)
    await Fn.submitPortfolioItem({ self: this, data, updateAccount: this.props.updateAccount, closeDialog: this.props.closeDialog })
    // console.log(this.bio.current.value)
  }

  componentDidMount = () => {
    console.log('FormBio mounted');
  }

  static getDerivedStateFromError(error) {
    // getDerivedStateFromError -> Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
  }

  getDerivedStateFromProps = (nextProps, prevState) => {
    console.log('FormBio getDerivedStateFromProps', nextProps, prevState);
  }

  getSnapshotBeforeUpdate = (prevProps, prevState) => {
    console.log('FormBio getSnapshotBeforeUpdate', prevProps, prevState);
  }

  componentDidUpdate = () => {
    console.log('FormBio did update');
  }

  componentWillUnmount = () => {
    console.log('FormBio will unmount');
  }

  render() {

    if (this.state.hasError) {

      return <h1>Something went wrong.</h1>

    }

    return (
      <div className="FormBio-wrapper" className="flex flex-column w-100">

        <div className="flex-column flex w-100 pa4">

          <div className=" flex flex-column w-100">
            <span className="f5 fw5 black-50 pb3 pt3">Project Title</span>
            <input
              type={'text'}
              placeholder={'Some cool project'}
              ref={this.title}
              // defaultValue={this.props.value.name.first}
              className="flex w-100 mb3 bn br1 pa3 black-50 f3 fw5" />

          </div>

          <div className=" flex flex-column w-100">
            <span className="f5 fw5 black-50 pb3 pt3">Project Description</span>
            <textarea
              rows={5}
              type={'textarea'}
              placeholder={'Lorum ipsum dolor sit amet'}
              ref={this.description}
              // defaultValue={this.props.value}
              className="flex w-100 mb3 bn br1 pa3 black-50 f3 fw5" />

          </div>

          <div className=" flex flex-column w-100">
            <span className="f5 fw5 black-50 pb3 pt3">Position Filled</span>
            <input
              type={'text'}
              placeholder={'i.e Videographer'}
              ref={this.position}
              // defaultValue={this.props.value.name.first}
              className="flex w-100 mb3 bn br1 pa3 black-50 f3 fw5" />

          </div>
          <div className="form-row flex flex-column pt4 w-100">
            <label className="f7 fw6 black-90 pb2">Project Date Range</label>



            <RangePicker
              className="bs-a f4 fw5"
              onChange={this.handleRangeChange}
              // defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
              format={dateFormat}
            />
          </div>

          <div className=" flex flex-column w-100">
            <span className="f5 fw5 black-50 pb3 pt3">Image</span>

            <Filepond setImage={this.setImage} type={'WorkPortfolioImage'} closeDialog={this.closeDialog} />

          </div>






        </div>
        <div className="form-row flex w-100 bg-white ph4 pv3">

          <div
            onClick={this.submit}
            className="tc w-100 pointer flex button flex-column ph3 pv2 ba b--black-10 f4 fw6 black-50">
            Submit
  </div>

        </div>

      </div>
    );
  }
}

// FormBio.PropTypes = {

// }

// FormBio.defaultProps = {

// }

export default FormPortfolioProject;