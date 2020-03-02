// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FormBio extends React.Component {
  constructor(props) {

    super(props)

    this.state = {
      hasError: false,
      buttonLoading: false
    }

    this.bio = React.createContext()
    this.submit = this.submit.bind(this)
  }

  submit() {
    this.setState({
      buttonLoading: true
    })
    setTimeout(() => {

      this.props.submitBio(this.bio.current.value)
    },1000)
    // console.log(this.bio.current.value)
  }

  componentDidMount = () => {
    console.log('FormBio mounted');
  }

  render() {

    if (this.state.hasError) {

      return <h1>Something went wrong.</h1>

    }

    return (
      <div className="FormBio-wrapper" className="flex flex-column w-100">

        <div className="flex-column flex w-100 pa4">

          <div className=" flex w-100">

            <textarea
              rows={5}
              type={'textarea'}
              placeholder={'Enter your bio'}
              ref={this.bio}
              defaultValue={this.props.value}
              className="flex -round bn w-100 mb0 bn br1 pv3 ph4 black-50 f3 fw5" />

          </div>



        </div>

        <div className="form-row flex w-100 bg-white ph4 pv4 bs-b">

          <div
            onClick={this.submit}
            className="bg-black-20 round tc w-100 pointer flex button flex-column ph3 pv3 ba- -b--black-10 f4 fw6 white -black-50">

{this.state.buttonLoading && (
                    <div className="flex flex-column pv2 items-center justify-center">
                      {/* <Spinner size={25} /> */}
                      <div className="sp sp-3balls"></div>
                    </div>
                  )}

{!this.state.buttonLoading && (
                    <div>Save</div>
                  )}

            
          </div>

        </div>

        </div>
        )
      }
    }
    
    
    
export default FormBio;