import React, { useState, getGlobal, setGlobal } from "reactn";

import AccountContext from "../../../utils/context/AccountContext.js";

const WelcomeScreen = ({ selectType, type, typeSelected }) => {

  return (
    <AccountContext.Consumer>
      {props => (
        !props.isAuthenticated &&

        <div
          className="vh-100 pt5 bg-black h-100 flex flex-column flex-auto justify-start"
          style={{ backgroundRepeat: 'no-repeat', backgroundPosition: '0px 20vh', backgroundImage: 'url("/img/filmset.jpg")' }}
        >

          <div className="raleway pt6 ph3 flex flex-column flex-auto justify-center -h-100">

            <h1 className="f2 fw4 white mv0 tc">Crew management,</h1>

            <h1 className="f2 fw4 white mv0 tc">Made easier</h1>

          </div>          

          {
            !typeSelected &&
            <div className="flex flex-column items-center justify-start  h-100 raleway fw5 mw6 center w-100 pt5">
              <div className="flex flex-column ma0 w-100" id="">
                <div className="Buttons flex flex-row justify-between round-">
                  <div className="flex flex-column w-100 br b--black-05">
                    <button
                      onClick={() => selectType('project-finder')}
                      className=" items-center flex flex-column bg-gray ph4 pv2 pointer bn br2 mr1  ">
                      <span className="ph2 f4 fw6 white -black-70 pt2 flex items-center justify-center">
                        CREW
                  </span>
                      <span className="ph2 f5 fw6 white-50 -black-70 pb2 pt1 flex items-center justify-center">
                        Project Finder
                  </span>
                    </button>
                  </div>
                  <div className="flex flex-column w-100">
                    <button
                      onClick={() => selectType('crew-builder')}
                      className=" flex flex-column items-center bg-gray ph4 pv2 pointer bn br2 ml1   ">
                      <span className="ph2 f4 fw6 white -black-70 pt2 flex items-center justify-center">
                        PRODUCTION
                  </span>
                      <span className="ph2 f5 fw6 white-50 -black-70 pb2 pt1 flex items-center justify-center">
                        Crew Builder
                  </span>
                    </button>
                  </div>

                </div>

              </div>

            </div>
          }

        </div>
      )}

    </AccountContext.Consumer>

  )
};

export default WelcomeScreen;
