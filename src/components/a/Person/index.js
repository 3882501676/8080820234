import React from "react";
import { Icon, Spinner } from "@blueprintjs/core";
import { app, api } from "../../../utils/fn/Fn.js";
import { notification } from "antd";

var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;

export default class Person extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inviteBusy: false
    };
    this.inviteToProject = this.inviteToProject.bind(this);
  }
  async inviteToProject(item) {
    this.setState({ inviteBusy: true });

    // console.log(item);

    let userId = item.id;
    let project = this.props.project;
    let invited = project.invited || [];
    let position = this.props.position;
    let crewItem = {
      position: position,
      id: userId
    };

    invited.push(crewItem);

    project.invited = invited;

    await app.updateProject({ self: this, project }).then(async res => {
      await app.fetchInvitedCrew({ self: this, project }).then(res => {
        this.setState({ inviteBusy: false });
        // notification.open({
        //   message: "Success",
        //   description: "Project Updated"
        // })
      });
    });

    let link = window.location.href;
    let projectOwner = this.props.projectOwner;
    // console.log('person props',this.props)
    let projectOwner_ = {
      id: projectOwner.id,
      picture: projectOwner.profile.picture,
      name: projectOwner.profile.name
    };

    let config = {
      userId: userId,
      title: "You have been invited to crew for a project."
    };

    let user = await api.fetch("users", userId);

    await app.inviteByUser({
      self: this,
      link,
      position,
      project,
      projectOwner: projectOwner_,
      user
    });
    await app.createNotification({
      self: this,
      type: "crewInvite",
      project,
      position,
      project,
      projectOwner: projectOwner_,
      user
    });

    this.props.reloadProject();
  }
  componentDidMount() {}
  render() {
    const item = this.props.item;
    return (
      <div
        // to={"/user/" + item.id}
        onClick={() => this.props.showUserProfile(item)}
        id="Person"
        className="flex flex-column w-100- flex-auto pb2 ph4 -w-100 flex-auto"
      >
        <div className="flex flex-row-ns flex-row -w-100">
          <div
            // onClick={() => this.props.toggleInnerDrawer(item)}
            // onClick={() => this.props.toggleInnerDrawer(item)}
            className="flex flex-column justify-center w-100="
          >
            <div className="round pa1 bg-white center">
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundImage: item.profile.picture.length
                    ? "url(" + item.profile.picture + ")"
                    : GeoPattern.generate(
                        item.profile.name.first + item.profile.name.last
                      ).toDataUrl()
                }}
                className="center pointer round  cover bg-center"
              ></div>
            </div>
          </div>

          <div
            // onClick={() => this.props.toggleInnerDrawer(item)}
            className="flex flex-column justify-center w-100- flex-auto ph3"
          >
            <div className="f4 flex flex-column items-center w-100 raleway ">
              <span className="flex flex-row-ns flex-column w-100 black f3 fw7">
                <span className="flex flex-row items-center justify-start-ns justify-center black f5 fw7">
                  {item.profile.name.first} {item.profile.name.last}
                </span>
              </span>
            </div>
          </div>

          <div
            onClick={() => this.inviteToProject(item)}
            className="flex flex-row-ns flex-column flex-auto -w-100 ph4 pv3"
          >
            <div className="flex flex-column justify-center">
              <span className="flex flex-row items-center justify-center justify-center black-50 f6 fw5 invite-button ph3 pv2 br2">
                {!this.state.inviteBusy && "Add / Invite"}

                {this.state.inviteBusy ? (
                  <div className="sp sp-3balls-small ml2"></div>
                ) : (
                  <Icon
                    icon={"plus"}
                    iconSize={20}
                    className="ml2 black-50 f6"
                  />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// export default Person
