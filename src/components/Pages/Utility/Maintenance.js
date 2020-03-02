import React, { Component } from "react";
import TransitionLayout from "../../Layouts/Transition";

class NotFound extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TransitionLayout>
        <section id="NotFound" className="flex flex-column items-center justify-center w-100 mw7 center pa4">
          <h1 className="f3 fw6 black-50">Sorry, that page does not exist</h1>
        </section>
      </TransitionLayout>
    );
  }
}

export default NotFound;
