import React from "react";
import { Link } from 'react-router-dom';
import TransitionLayout from "../../Layouts/Transition";
import { Icon } from '@blueprintjs/core';
// import AccountContext from '../../../utils/context/AccountContext';
// const queryString = require('query-string');

export default class ConfirmAccount extends React.Component {
  constructor(props) {
    super(props);
  }
async componentDidMount() {
  // console.log('query string', window.location.search);
  //   const parsed = queryString.parse(window.location.search);
  //   console.log('parsed', parsed);

    // console.log('parsed type', typeof parsed)

    // await app.confirmAccount({ self: this, userId: parsed.user, email: parsed.email})

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
        <section id="ConfirmAccount" className="raleway flex flex-column items-center justify-center h-100 w-100 pt5 mw7 center pa4">
          {/* <div style={{ backgroundImage: "url(https://cdn1.vectorstock.com/i/1000x1000/25/15/telescope-searching-404-banner-vector-13702515.jpg)" }} className="NotFound-bg"></div> */}
         <Icon icon={'inbox-search'} iconSize={50} className="black-60 pb3 pt4" />
          <h1 className="f3 fw5 black-70">Please confirm your email address.</h1>
          <div id="CreateProject" className="flex flex-row items-end justify-end mb2">
          <h1 className="f3 fw3 black-30 tc mw6">Please check your inbox (and spam) for your account confirmation email.</h1>
          </div>
        </section>
      </TransitionLayout>
    );
  }
}
// ConfirmAccount.contextType = AccountContext;

// export default NotFound;
