import React, { useState, useEffect, useContext } from "react";
import { setGlobal } from 'reactn';
import createAuth0Client from "@auth0/auth0-spa-js";
// import { setGlobalCssModule } from "reactstrap/lib/utils";
import methods from '../methods';
// var db_;
// window.db_ = db_;
// const {
//   Stitch,
//   RemoteMongoClient,
//   AnonymousCredential,
//   UserPasswordCredential,
//   GoogleRedirectCredential
// } = require('mongodb-stitch-browser-sdk');

// const appId = 'homechef-xxfod';
// const client = Stitch.initializeDefaultAppClient('homechef-xxfod')
// window.stitchclient = client;

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (window.location.search.includes("code=")) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  
    if (user) {
      
      console.log(' ');
      console.log('[[ loginWithPopup : User ]]', user)
      console.log(' ');
    //   let credential = new GoogleRedirectCredential()
    //   client.auth.loginWithRedirect(credential)
    //   window.db_ = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('HomeChef');
    // console.log('db',db_)
      // localStorage.setItem('account', JSON.stringify(user));
      // setGlobal({ account: user })
      // const userExtended = { ...user };
      return methods.extendUser({ user })
    }
  }
  // const loginWithPopup = async (params = {}) => {
  //   setPopupOpen(true);
  //   try {
  //     await auth0Client.loginWithPopup(params);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setPopupOpen(false);
  //   }
  //   const user = await auth0Client.getUser();
  //   setUser(user);
  //   setIsAuthenticated(true);
  //   return methods.extendUser({ user })
  // };
  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);


    // const isAuthed = client.auth.isLoggedIn;
    // const credential = new GoogleRedirectCredential();
    // client.auth.loginWithRedirect(credential);
    // window.db_ = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('HomeChef');
    //     console.log('db',db_)
    // if (client.auth.hasRedirectResult()) {
    //   client.auth.handleRedirectResult().then(user => {
    //     this.setState({ isAuthed: this.client.auth.isLoggedIn })
    //     window.db_ = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('HomeChef');
    //     console.log('db',db_)
    //   })
    // }

  }
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => auth0Client.logout(...p)
      }}
    >
      {children}
    </Auth0Context.Provider>
  )
}


