import React from 'react';
import moment from "moment";
import FormUserDetailProject from "../FormUserDetailProject/index.js";


var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;

export default class UserDetailProject extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.userLocation = this.userLocation.bind(this);
    }
    userLocation() {
      let user = this.props.user;
      let location;
      if (
        user.profile.location &&
        typeof user.profile.location.County !== "undefined"
      ) {
        location = user.profile.location.County;
      } else if (
        user.profile.location &&
        typeof user.profile.location.address.county !== "undefined"
      ) {
        location = user.profile.location.address.county;
      } else {
        location = "";
      }
      return location;
      // props.account.user.profile.location && props.account.user.profile.location.address.county || ""
    }
    componentDidMount() {}
    render() {
        const user = this.props.user;
        return(
            <>           
     
            <FormUserDetailProject project={this.props.project} user={this.props.user} />
          </>
        )
    }
}
