import React, { useEffect, getGlobal } from "reactn";
// import { get }
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import AccountContext from './context/AccountContext.js';
// import { useAuth0 } from "./auth/react-auth0-spa";

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  // const { isAuthenticated, loginWithRedirect, loginWithPopup } = useAuth0();
  const isAuthenticated = getGlobal().isAuthenticated
  
  // useEffect(() => {
  //   const fn = async () => {
  //     if (!isAuthenticated) {
  //       await loginWithPopup({
  //         appState: { targetUrl: path }
  //       });
  //     }
  //   };
  //   fn();
  // }, [isAuthenticated, loginWithPopup, path]);

  const render = props =>

    isAuthenticated === true ? <Component {...props} /> : null;

    return <Route path={path} render={render} {...rest} />;

};

// PrivateRoute.propTypes = {
//   component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
//     .isRequired,
//   path: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.arrayOf(PropTypes.string)
//   ]).isRequired
// };

export default PrivateRoute;