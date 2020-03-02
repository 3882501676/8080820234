import 'react-app-polyfill/ie11';
import React from "react";
// import React, { getGlobal } from "reactn";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
// import { Auth0Provider } from "./utils/auth/react-auth0-spa";
import authConfig from "./utils/config/auth_config.json";
import history from "./utils/history";
import './utils/stylesheets'
import App from "./App";
import Fn from './utils/fn/Fn.js'
// import ulog from 'ulog';
// window.log = ulog;
window.Fn = Fn;

// const onRedirectCallback = appState => {
//   console.log('appState', appState)
//   history.push(
//     appState && appState.targetUrl
//       ? appState.targetUrl
//       : window.location.pathname
//   );
// }

// ReactDOM.render(
//   <App />,
//   document.getElementById("root")
// );

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
serviceWorker.unregister();
