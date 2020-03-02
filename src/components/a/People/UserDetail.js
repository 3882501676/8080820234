import React from 'react';
import moment from "moment";
import Bio from "../_Elements/Bio/Bio.jsx";


var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;
export default class UserDetail extends React.Component {
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
            <div
              // to={"/user/" + item.id}
              // onClick={this.toggleInnerDrawer}
              id="UserDetail"
              className="flex flex-column w-100 pa0"
            >
              <div className="pa4 flex flex-row-ns flex-column w-100">
                <div className="flex flex-column w-100=">
                  <div className="round pa1 bg-white center">
                    <div
                      style={{
                        width: "90px",
                        height: "90px",
                        backgroundImage: user
                          .profile.picture.length
                          ? "url(" +
                            user.profile
                              .picture +
                            ")"
                          : GeoPattern.generate(
                              user.profile
                                .name.first +
                                user.profile
                                  .name.last
                            ).toDataUrl()
                      }}
                      className="center pointer round  cover bg-center"
                    ></div>
                  </div>
                </div>

                <div className="flex flex-column justify-center w-100 ph3">
                  <div className="f4 flex flex-column items-center w-100 raleway ">
                    <span className="flex flex-row-ns flex-column w-100 black f3 fw6">
                      <span className="raleway flex flex-row items-center justify-start-ns justify-center black-70 f4 fw7">
                        {
                          user.profile.name
                            .first
                        }{" "}
                        {
                          user.profile.name
                            .last
                        }
                      </span>
                    </span>
                  </div>

                  <div className="f4 flex flex-column items-center w-100 raleway ">
                    <span className="flex flex-row-ns flex-column w-100 black f3 fw6">
                      <span className="raleway flex flex-row items-center justify-start-ns justify-center black-50 f5 fw5">
                        {user.email}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <section
              id="ProfileButtons"
              className="flex flex-auto- w-100"
            >
              <div className="flex flex-row mb2-ns- w-100 bt b--black-05 ">
                <button
                  title="View or upload CV"
                  id="CV-button"
                  className="db relative w-100 ph4 pv3 br1- bg-white black-50 hover-black pointer"
                >
                  <div id="" className="db relative w-100">
                    <span className="f5 fw6 ph3-">
                      Cirriculum Vitae{" "}
                    </span>
                  </div>
                </button>
                <button
                  title="View or upload CV"
                  id="CV-button"
                  className="db relative w-100 ph4 pv3 br1- bg-white black-50 hover-black pointer"
                  // style={{ background: "#e8e8ec" }}
                >
                  <div id="" className="db relative w-100">
                    <span className="f6 fw6 ">Add to Network</span>
                  </div>
                </button>
                <button
                  title="View or upload CV"
                  id="CV-button"
                  className="db relative w-100 ph4 pv3 br1- bg-white black-50 hover-black pointer"
                  // style={{ background: "#e8e8ec" }}
                >
                  <div id="" className="db relative w-100">
                    <span className="f6 fw6 ">Send Message</span>
                  </div>
                </button>
              </div>
            </section>
            <div className="flex flex-row -nsflex-column w-100 black-60 raleway flex-wrap items-center justify-start-ns justify-between pa4 bt bb b--black-05">
              <div className="flex flex-column w--100 pb1-ns pb2 mr3">
                <span className="flex-column flex f6 fw4 black-40 items-start">
                  <span
                    className="flex 
mb3"
                  >
                    Age
                  </span>
                  <span className="flex items-center justify-center f6 fw6 -ml3-ns black-50- white ph2 pv1 ba b--black-05 br1 -round bw1- bg-white-20- bg-black -ts-a tc ml2-">
                    {moment().diff(
                      user.profile.dob,
                      "years"
                    )}
                  </span>
                </span>
              </div>
              <div className="flex flex-column w--100 pb1-ns pb2 mr3">
                <span className="flex-column flex f6 fw4 black-40 items-start">
                  <span
                    className="flex 
mb3"
                  >
                    Gender
                  </span>
                  <span className="flex items-center justify-center f6 fw6 -ml3-ns black-50- white ph2 pv1 ba b--black-05 br1 -round bw1- bg-white-20- bg-black -ts-a tc ml2-">
                    {(user.profile.gender &&
                      user.profile.gender) ||
                      ""}
                  </span>
                </span>
              </div>
              <div className="flex flex-column w--100 pb1-ns pb2 mr3">
                <span className="flex-column flex f6 fw4 black-40 items-start">
                  <span
                    className="flex 
mb3"
                  >
                    Location
                  </span>
                  <span className="flex items-center justify-center f6 fw6 -ml3-ns black-50- white ph2 pv1 ba b--black-05 br1 -round bw1- bg-white-20- bg-black -ts-a tc ml2-">
                    {this.userLocation()}
                  </span>
                </span>
              </div>
            </div>

            <Bio
              user={user}
              editSkills={null}
              editBio={null}
              canEdit={false}
            />
          </>
        )
    }
}
