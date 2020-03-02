import React from "react";
import { Link } from 'react-router-dom';
import TransitionLayout from "../../Layouts/Transition";
import { Icon } from '@blueprintjs/core';
import AccountContext from '../../../utils/context/AccountContext';
import { app } from '../../../utils/fn/Fn.js';

const queryString = require('query-string');

export default class ConfirmAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmed: false
    }
    
    this.setConfirmed = this.setConfirmed.bind(this)
  }
  setConfirmed() {
    this.setState({
      confirmed: true
    })

    setTimeout(() => {
      this.context.login()

    },3000)
  }
async componentDidMount() {
  console.log('query string', window.location.search);
    const parsed = queryString.parse(window.location.search);
    console.log('parsed', parsed);

    console.log('parsed type', typeof parsed)

    await app.confirmAccount({ self: this, userId: parsed.user, email: parsed.email})

    // let urlParseComplete;

    // if (typeof parsed.email !== "undefined") {
    //   // Fn.set('newinvite', JSON.parse(parsed.newinvite))
    //   // localStorage.setItem('newinvite', JSON.parse(parsed.newinvite))
    // }
    // if (typeof parsed.referrer !== "undefined") {

    //   // Fn.set('referrer', parsed.referrer)
    //   // localStoragae.setItem('referrer', parsed.referrer)
    // }
}
  render() {
    return (
      <TransitionLayout>
        <section id="ConfirmAccountConfirmed" className="flex flex-column items-center justify-center h-100 w-100 pt5 mw7 center pa4">
          {/* <div style={{ backgroundImage: "url(https://cdn1.vectorstock.com/i/1000x1000/25/15/telescope-searching-404-banner-vector-13702515.jpg)" }} className="NotFound-bg"></div> */}
          
    { !this.state.confirmed && <h1 className="f3 fw1 black-30">Confirming your account.</h1> }
          <div id="CreateProject" className="flex flex-column items-center justify-center mb2">
            {
              this.state.confirmed && 
              <>
              <Icon icon={'endorsed'} iconSize={60} className="mt4 mb2 blue" />
              <h1 className="f3 fw1 black-50">Confirmed</h1> 
              <div
              className={
                " items-center justify-center  flex flex-row pv3 mr3"
              }
            >
              <div className="sp sp-3balls"></div>
            </div>
              </>
            }
          {
            !this.state.confirmed && 
            <div
              className={
                " items-center justify-center  flex flex-row pv3"
              }
            >
              <div className="sp sp-3balls"></div>
            </div>
          }
          
          </div>
        </section>
      </TransitionLayout>
    );
  }
}
ConfirmAccount.contextType = AccountContext;

// export default NotFound;
