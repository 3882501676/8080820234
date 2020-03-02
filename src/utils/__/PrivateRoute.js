import React, { useEffect, getGlobal } from "reactn";
// import { get }
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import AccountContext from './context/AccountContext.js';


const PrivateRoute = ({ component: Component, path, ...rest }) => {
  
  const isAuthenticated = getGlobal().isAuthenticated
  
  const render = props =>

    isAuthenticated === true ? <Component {...props} /> : null;

    return <Route path={path} render={render} {...rest} />;

}

export default PrivateRoute;