import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

// /import { Container, Header } from 'semantic-ui-react'

// import Login from './Login'
// import UserInfo from './UserInfo'

// import './index.css'
// import 'semantic-ui-css/semantic.min.css'

// import registerServiceWorker from './registerServiceWorker'

import {
  Stitch,
  RemoteMongoClient,
  UserPasswordCredential,
  FacebookRedirectCredential,
  GoogleRedirectCredential
} from 'mongodb-stitch-browser-sdk'
const APP_ID = 'homechef-xxfod';

class StitchLogin extends Component {
  static propTypes = {
    appId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.appId = 'homechef-xxfod';
    this.client = Stitch.initializeDefaultAppClient(this.appId)
    this.db = this.client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('HomeChef');
    window.db_ = this.db;
    window.stitchclient = this.client;
    const isAuthed = this.client.auth.isLoggedIn
    this.state = { isAuthed }
  }

  componentDidMount() {
    if (this.client.auth.hasRedirectResult()) {
      this.client.auth.handleRedirectResult().then(user => {
        this.setState({ isAuthed: this.client.auth.isLoggedIn })
        console.log('[[ client ]]',this.client)
        this.db.collection('conversations').find({}, { limit: 100 }).asArray().then(docs => {
          console.log("Found docs", docs)
    
          console.log("[MongoDB Stitch] Connected to Stitch")
        }).catch(err => {
          console.error(err)
        });
      })
    }
  }

  login = async (type, { email, password } = {}) => {
    const { isAuthed } = this.state
    let credential

    if (isAuthed) {
      return
    }
    credential = new GoogleRedirectCredential()
   this.client.auth.loginWithRedirect(credential).then(user =>
      console.log("Found user", user),
      this.db.collection('conversations').find({}, { limit: 100 }).asArray()
    ).then(docs => {
      console.log("Found docs", docs)
    
      console.log("[MongoDB Stitch] Connected to Stitch")
    }).catch(err => {
      console.error(err)
    });
    // console.log('a',this.client.auth.loginWithRedirect(credential))
    // const db_ = this.client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('HomeChef');
    
    // console.log('[[  db  ]]', db_)
    
    // if (type === 'facebook') {
    //   credential = new FacebookRedirectCredential()
    //   this.client.auth.loginWithRedirect(credential)
    // } else if (type === 'google') {
    //   credential = new GoogleRedirectCredential()
    //   this.client.auth.loginWithRedirect(credential)
    // } else {
    //   credential = new UserPasswordCredential(email, password)
    //   await this.client.auth.loginWithCredential(credential)
    //   this.setState({ isAuthed: true })
    // }
  }

  logout = async () => {
    this.client.auth.logout()
    this.setState({ isAuthed: false })
  }

  render() {
    const { isAuthed } = this.state
    return (
      <div className="z-999 relative">
        <p>
          A MongoDB Stitch example demonstrating authentication using
          Email/Password, Facebook, and Google.
        </p>
        <button onClick={this.login} className="ph3 pv2 f5 fw6 black ">Login</button>
      </div>
    )
  }
}
export default StitchLogin
