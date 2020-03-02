import React, { Component, getGlobal } from 'reactn';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
const PrivateRoute = ({ component: Component, ...props }) => {
  return (
    <Route
      {...props}
      render={innerProps =>
        getGlobal() && getGlobal().user && getGlobal().user.isLoggedIn ?
            <Component {...innerProps} />
            :
            <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
