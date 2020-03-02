import React, { Component } from "react";

export default class One extends Component {
  state = {
    ready: false
  }
  let self = this;
  setTimout(function(){
    self.setState({
      ready: true
    })
  },1500)
  render() {
    return this.state.ready ? {children} : null
  }
}
