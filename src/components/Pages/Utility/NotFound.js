import React from "react";
import { Link } from 'react-router-dom';
import TransitionLayout from "../../Layouts/Transition";
import { Icon } from '@blueprintjs/core';

class NotFound extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <TransitionLayout>
        <section id="NotFound" className="flex flex-column items-center justify-center h-100 w-100 pt7 mw7 center pa4">
          {/* <div style={{ backgroundImage: "url(https://cdn1.vectorstock.com/i/1000x1000/25/15/telescope-searching-404-banner-vector-13702515.jpg)" }} className="NotFound-bg"></div> */}
          <h1 className="f3 fw1 black-30">Sorry, that page does not exist</h1>
          <div id="CreateProject" className="flex flex-row items-end justify-end mb2">
                            <Link
                              to={'/myprojects'}
                              className={("br1- round bs-b bg-black-20 ph5 pv2 pointer bn relative w-100  ")} >

                              <span className="f5 fw6 white pv0 flex items-center justify-center">                                
                                Back to My Projects <Icon icon={"arrow-right"} iconSize={20} className={(' f4 black-60- white  absolute right-0 ml3 mr3')} /></span>

                            </Link>
                          </div>
        </section>
      </TransitionLayout>
    );
  }
}

export default NotFound;
