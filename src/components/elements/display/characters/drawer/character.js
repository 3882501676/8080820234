import React, { Component } from "react";
import { Drawer, Button, Radio, Icon } from "antd";
// import ItemDetailList from "../ItemDetailList";

const RadioGroup = Radio.Group;

class ItemInfo extends React.Component {
  constructor(props) {
    super(props);
    console.log('Iteminfo PROPS', props)

    this.state = {
      item: this.props.item,
      visible: this.props.visible,
      placement: "right",
      test: this.props.visible,
      buttonLoading: false
    };
    this.showWidget = this.showWidget.bind(this);
    this.avatar = this.avatar.bind(this);
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
  avatar(item) {
    let avatar =
      typeof item.avatar_large !== "undefined"
        ? item.avatar_large
        : "http://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914";
    return avatar;
  }
  showWidget(widget) {
    window.widget.open();
  }
  editProject(project){
    console.log(project)
    this.props.history.push('/')

    // console.log('pushed', this.props)
  }
  componentDidMount() {
    // console.log(this.props)
    // console.log('Mount',this.state)
  }
  componentDidUpdate() {
    // console.log('Update', this.state, this.props.visible)
  }
  render() {
    let widget;
    if (typeof window.cloudinary !== "undefined") {
      widget = window.cloudinary.createUploadWidget(
        {
          cloudName: "doy0ozmqb",
          // uploadPreset: "hj2fahfn"
          uploadPreset: "kmegjnr9"
        },
        (err, res) => {
          console.log(res, err);
          if (res.event === "success") {
            let imageUrl = res.info.secure_url;
            let avatar = res.info.secure_url;
            let info = res.info;
            let media = { info };
            let characterDetail = this.props.item;
            characterDetail.media = media;
            characterDetail.avatar = avatar;
            characterDetail.avatar_large = imageUrl;
            console.log("Character ", characterDetail);
            this.setState({
              item: characterDetail
            });
            this.props.updateCharacter(characterDetail);
          }
        }
      );
    }
    window.widget = widget;
    return (
      <div>
        <Drawer
          title={"Detail"}
          placement={"right"}
          closable={true}
          onClose={this.props.hideDrawer}
          visible={this.props.visible}
          width={500}
          className="CharacterInfo"
        >
          <section className="CharacterInfo flex flex-column pa5">
            <div className="flex flex-row pb4">
              <div className="flex">
                <div
                  onClick={this.showWidget}
                  style={{
                    backgroundImage: "url(" + this.avatar(this.props.item) + ")"
                  }}
                  className="character-avatar w3 h3 br2 bg-cover bg-center relative flex items-center justify-center cursor-pointer"
                >
                  <Icon type="plus" className="f3 white trans-a pa3" />
                </div>
              </div>
              <div className="flex flex-column items-start justify-center pl3">
                <h4 className="f3 fw5 black-80 ma0">
                  {this.props &&
                    this.props.item &&
                    this.props.item.name &&
                    this.props.item.name.first}{" "}
                  {this.props &&
                    this.props.item &&
                    this.props.item.name &&
                    this.props.item.name.last}
                </h4>
              </div>
            </div>

            <div className="flex flex-row pb3">
            <div className="flex flex-column pr4">
              <span className="flex f6 fw5 black-50">Gender</span>
              <span className="flex f4 fw6 c_1 ttc">
              {this.props && this.props.item && this.props.item.gender}
              </span>
            </div>
            <div className="flex flex-column pr4">
              <span className="flex f6 fw5 black-50">Type</span>
              <span className="flex f4 fw6 c_1 ttc">
              {this.props && this.props.item && this.props.item.type}
              </span>
            </div>
            </div>
            <div className="flex flex-column pb3">
              <span className="flex f6 fw5 black-50 pb2">Bio</span>
              <span className="flex f5 fw5 ttc">
              {this.props && this.props.item && this.props.item.bio}
              </span>
            </div>


            {/* <ItemDetailList /> */}
            <div className="dn -form-row -flex -flex-row justify-between flex-wrap w-100 mb3 ttc fw6">
              <a
                onClick={() => this.props.delete(this.props.item)}
                className="flex flex-auto- w-50 ph4 pv3 ba bw1 b--black-05 justify-center fw6 mr2"
                loading={this.state.buttonLoading}
              >
                <span className="flex items-center justify-center f6 fw7 black-50">
                  <Icon type="copy" className="pr2" /> Duplicate
                </span>
              </a>
              <a
                onClick={() => this.props.delete(this.props.item)}
                className="flex flex-auto- w-50 ph4 pv3 ba bw1 b--black-05 justify-center fw6"
                loading={this.state.buttonLoading}
              >
                <span className="flex items-center justify-center f6 fw7 black-50">
                  <Icon type="delete" className="pr2" /> Delete
                </span>
              </a>
              <a
                onClick={() => this.props.delete(this.props.item)}
                className="flex flex-auto w-100 ph4 pv3 ba bw1 b--black-05 justify-center fw6"
                loading={this.state.buttonLoading}
              >
                <span className="flex items-center justify-center f6 fw7 black-50">
                  <Icon type="delete" className="pr2" /> Delete
                </span>
              </a>
            </div>
          </section>
          <div className="ProjectInfo flex flex-colum-n -w-100 ttc fw6">
            <div className="flex flex-auto flex-column relative">
              <div
                style={{
                  backgroundImage:
                    "url(" + this.avatar(this.props.project) + ")"
                }}
                className=" project-cover-image relative h5 flex flex-auto flex-column w-100 bg-center bg-cover items-start justify-end pa5 relative overflow-hidden"
              >
                <h4 className="f4 fw6 black-70- white mb0 rubik">
                  {this.props.project.title}
                </h4>
                <h4 className="f5 fw4 black-50- white-80 mb0">
                  {this.props.project.description}
                </h4>

                <div className="edit-project trans-a absolute bottom-0 right-0 ph3 pv3">
                  <a
                    onClick={() => this.editProject(this.props.project)}
                    className="ph3 pv2 bg-white-20 br1"
                    loading={this.state.buttonLoading}
                  >
                    <span className="f6 fw5 white">
                    Edit Project
                    </span>
                  </a>

                  </div>
              </div>
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default ItemInfo;
