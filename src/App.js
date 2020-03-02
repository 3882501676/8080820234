import React from "react";
import { Route, Router, Switch } from "react-router-dom";
// import Maintenance from "./components/Pages/Utility/Maintenance";
// import Profile from "./components/Pages/Account/Profile";
import Home from "./components/Pages/General/Home";
// import Reservations from "./components/Pages/General/Reservations";
// import Messages from "./components/Pages/General/Messages";
import Account from './components/Pages/Account/Account/index.js';
import Network from './components/Pages/General/Network/index.js';
import Messages from './components/Pages/General/Messages/index.js';
import MyProjects from './components/Pages/General/MyProjects.js';
import Notifications from "./components/Pages/General/Notifications/index.js";
import OwnProfile from './components/Pages/General/OwnProfile.js';
import SingleProject from './components/Pages/General/SingleProject.js';
import ViewProfile from './components/Pages/General/ViewProfile.js';
import Welcome from './components/Pages/General/Welcome.js';
import Calendar from './components/Pages/General/Calendar/index.js';
import Dashboard from './components/Pages/General/Dashboard.js';
import ConfirmAccount from './components/Pages/Utility/ConfirmAccount.js';
import ConfirmAccountConfirmed from './components/Pages/Utility/ConfirmAccountConfirmed.js';
import { Helmet } from "react-helmet";
// import PrivateRoute from "./utils/PrivateRoute";
// import Loading from "./components/elements/Loading";
import NotFound from "./components/Pages/Utility/NotFound";
import Fn from './utils/fn/Fn.js';
// import { useAuth0 } from "./utils/auth/react-auth0-spa";
// import AccountContext from './utils/context/AccountContext.js';
import history from "./utils/history";
import { siteMeta } from './utils/config/app.config';
import initialise from "./utils/init.js";
import Wrapper from "./Wrapper";

window.Fn = Fn;
window.logged = []
// let a = 0
initialise.start()

const App = () => {

  // const { loading, isAuthenticated } = useAuth0();

  // if (loading) {
  //   return <Loading />;
  // }

  return (

    <Router history={history}>
      <div
        id="App"
        className={(" flex flex-column h-100")}>
        <Wrapper history={history}>
        <Helmet>
          <meta name="viewport" content="width=device-width,initial-scale=0.7,maximum-scale=1,minimum-scale=0.7" />
          {/* <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=0.7,maximum-scale=1,minimum-scale=0.7,viewport-fit=cover" /> */}
          <meta charSet="utf-8" />
          <title>{siteMeta.title}</title>
          <meta name="description" content={siteMeta.description} />
          <link rel="canonical" href={siteMeta.siteUrl} />
          <link rel="manifest" href="/manifest.json" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/aws-sdk/2.304.0/aws-sdk.min.js"></script>
        </Helmet>

          <Switch>

            <Route exact path="/" component={Welcome} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/network" component={Network} />
            <Route exact path="/project/:id" component={SingleProject} />
            <Route exact path="/myprojects" component={MyProjects} />
            <Route exact path="/messages" component={Messages} />
            <Route exact path="/calendar" component={Calendar} />
            <Route exact path="/notifications" component={Notifications} />
            <Route exact path="/profile" component={OwnProfile} />
            <Route exact path="/account" component={Account} />
            <Route path="/user/:id" component={ViewProfile} />
            <Route path="/confirmaccount" component={ConfirmAccount} />
            <Route path="/confirm" component={ConfirmAccountConfirmed} />

            
            <Route path="*" component={NotFound} />

          </Switch>

        </Wrapper>

      </div>
    </Router>

  )
}

export default App
// App.contextType = AccountContext