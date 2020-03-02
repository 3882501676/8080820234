import React, { Component, getGlobal, setGlobal, useGlobal } from "reactn";

import { Link } from "react-router-dom";
import { Drawer, Button, Radio } from "antd";
import { Tabs, Icon } from "antd";
import EditProject from "../../../forms/project/edit";
import AddAssets from "../../../media/list/Assets";

const { TabPane } = Tabs;
const RadioGroup = Radio.Group;

class ProjectInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doc: this.props.doc,
      visible: this.props.visible,
      placement: "right",
      test: this.props.visible,
      activeTab: "1",
      characters: []
    };
    this.showWidget = this.showWidget.bind(this);
    this.checkUploadResult = this.checkUploadResult.bind(this);
    this.avatar = this.avatar.bind(this);
    this.goToTab1 = this.goToTab1.bind(this);
    this.tabOnChange = this.tabOnChange.bind(this);
  }
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };
  onClose = () => {
    this.setState({
      visible: false
    });
  };
  onChange = e => {
    this.setState({
      placement: e.target.value
    });
  };
  tabOnChange(e) {
    console.log(e);
    this.setState({
      activeTab: e
    });
  }
  goToTab1() {
    this.setState({ activeTab: "1" });
  }
  avatar(item) {
    let avatar =
      typeof item.avatar_large !== "undefined"
        ? item.avatar_large
        : "http://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914";
    return avatar;
  }
  componentDidMount() {
    // console.log(this.props)
    // console.log("Mount", this.state, this.props);
  }
  componentDidUpdate() {
    // console.log("Update", this.state, this.props.visible);
  }
  showWidget(widget) {
    window.widget.open();
  }
  checkUploadResult(resultEvent) {
    if (resultEvent.event === "success") {
      // console.log(this.props.currentUser.id)
    }
  }

  // postUpdatedProject() {}
  render() {
    let widget;
    if (typeof window.cloudinary !== "undefined") {
      widget = window.cloudinary.createUploadWidget(
        {
          cloudName: "doy0ozmqb",
          uploadPreset: "kmegjnr9"
          // uploadPreset: "hj2fahfn"
        },
        (err, res) => {
          // console.log(res, err);
          if (res.event === "success") {
            let _ = res.info;
            console.log("############", res);
            let format = _.format;
            let projectDetail = this.props.doc;
            let audio_url = _.is_audio ? _.secure_url : projectDetail.audio;
            let avatar = _.is_audio ? projectDetail.avatar : _.secure_url;
            let media_ = [];
            media_.push(_);
            media_.push(projectDetail.media);
            // let audio

            // let imageUrl = _.is_audio ? projectDetail.avatar : null;
            // let info = _.info;

            projectDetail.media = media_
            projectDetail.avatar = avatar
            projectDetail.avatar_large = avatar
            projectDetail.is_audio = _.is_audio

            window.audio = projectDetail.audio
            // console.log(projectDetail.audio)

            if(projectDetail.is_audio){
              projectDetail.audio.push(_.secure_url)
            }

            console.log("Project ", projectDetail)
            this.setState({
              item: projectDetail
            })
            this.props.updateProject(projectDetail)
          }
        }
      );
    }
    window.widget = widget;
    return (
      <div>
        <Drawer
          title={"Chef Detail"}
          placement={"right"}
          closable={true}
          onClose={this.props.hideDrawer}
          width={500}
          visible={this.props.visible}
          doc={this.props.doc}
          className="ChefDetail"
        >
          <Tabs
            onChange={this.tabOnChange}
            defaultActiveKey="1"
            activeKey={this.state.activeTab}
          >
            <TabPane tab={<span>View </span>} key="1">
              <div className="flex flex-auto flex-column relative">
                <div
                  style={{
                    backgroundImage: "url(" + this.avatar(this.props.doc) + ")"
                  }}
                  className=" project-cover-image relative h5 flex flex-auto flex-column w-100 bg-center bg-cover items-start justify-end pa5 relative overflow-hidden"
                >
                  <h4 className="f4 fw6 black-70- white mb0 rubik">
                    {this.props.doc.title}
                  </h4>
                  <h4 className="f5 fw4 black-50- white-80 mb0">
                    {this.props.doc.description}
                  </h4>

                  <div className="absolute bottom-0 right-0 flex flex-auto flex-column pa3">
                    <button
                      className="addCoverPhoto -pulse flex flex-auto items-center justify-center ph3 pv2 bn br2 -c_1_bg white f6 fw6 bg-transparent relative"
                      onClick={this.showWidget}
                    >
                      <Icon type="file" className="slide-fwd-center " />
                    </button>
                  </div>
                </div>
              </div>
              <div className="ph5 pb5">
                <section id="ProjectScenes">
                  <div className="ProjectScenesHeading pt4">
                    <h3 className="f5 fw6 black-70">Scenes</h3>
                  </div>
                  {this.props.doc.scenes &&
                  this.props.doc.scenes.length > 0 ? (
                    this.props.doc.scenes.map((item, index) => (
                      <div className="scene flex flex-column " />
                    ))
                  ) : (
                    <div className="ProjectScenesHeading ">
                      <h3 className="f5 fw1 black-30 pb3">
                        No Scenes Added Yet
                      </h3>
                      <div className="flex flex-auto flex-row pb3">
                        <Link
                          to={"/scenes"}
                          className={(
                            this.props.theme.main === "dark" ? " bg-black-50 " : " bg-black-10 ")
                          + ( " hover-"+ this.props.theme.colorScheme.color)
                          + ( "  bn flex flex-row justify-center items-center ph3 pv2 br2 bs-a relative white f6 fw6 add-a-scene")}
                        >
                          Add a Scene
                        </Link>
                      </div>

                    </div>
                  )}
                </section>
                <section id="ProjectScenes">
                  <div className="ProjectScenesHeading pt4">
                    <h3 className="f5 fw6 black-70">Project Synopsis</h3>
                  </div>
                  <div className="flex flex-auto flex-column pb3">
                    <p className="f5 fw5 black-60">
                      {this.props.doc.synopsis}
                    </p>
                  </div>
                  
                </section>

                <section id="ProjectCharacters">
                  <div className="ProjectScenesHeading pt4">
                    <h3 className="f5 fw6 black-70">Characters</h3>
                  </div>
                  <div className="flex flex-auto flex-column pb3">
                    {this.state.characters.map((item, index) => (
                      <div className="flex " />
                    ))}
                    <p className="f5 fw5 black-60" />
                  </div>
                </section>
              </div>
            </TabPane>
            <TabPane tab={<span>Edit</span>} key="2">
              <EditProject
                updateProject={this.props.updateProject}
                goToTab1={this.goToTab1}
                refresh={this.props.refresh}
                close={this.props.hideDrawer}
                item={this.props.doc}
              />
            </TabPane>
            <TabPane tab={<span>Assets</span>} key="3">
              <div className="pa4">
              <AddAssets
                updateProject={this.props.updateProject}
                goToTab1={this.goToTab1}
                refresh={this.props.refresh}
                close={this.props.hideDrawer}
                item={this.props.doc}
                play={this.props.play}
              />
              </div>
            </TabPane>
          </Tabs>
        </Drawer>
      </div>
    );
  }
}

export default ProjectInfo;
