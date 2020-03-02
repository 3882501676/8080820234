import React, { getGlobal } from "reactn";
// import { Link } from "react-router-dom";
import { Drawer } from "antd";
// import { Tabs } from "antd";
import MessageBox2 from '../messages/messagebox2';

class MessageDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doc: this.props.doc,
      conversation: this.props.activeConversation,
      visible: this.props.visible,
      childrenDrawer: false,
      placement: "right",
      test: this.props.visible,
      activeTab: "1",
      characters: [],
      conversationReady: false,
      ready: false
    };

    // console.log('DocInfo', props);

    this.showWidget = this.showWidget.bind(this);
    this.checkUploadResult = this.checkUploadResult.bind(this);

  }

  showWidget(widget) {
    window.widget.open();
  }
  checkUploadResult(resultEvent) {
    if (resultEvent.event === "success") {

    }
  }
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
            // let format = _.format;
            let projectDetail = this.props.doc;
            // let audio_url = _.is_audio ? _.secure_url : projectDetail.audio;
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

            if (projectDetail.is_audio) {
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
          title={"Conversation"}
          placement={"right"}
          closable={true}
          onClose={this.props.hideDrawer}
          width={500}
          visible={this.props.visible}
          doc={this.props.doc}
          className="Conversation"
        >

          <div className="flex flex-auto flex-column relative">
            {
              this.props.conversationReady
                ? <MessageBox2
                  type={"info"}
                  chef={this.props.chef}
                  conversation={this.props.conversation}
                  theme={Fn.get('theme').config.theme}
                  conversationReady={this.props.conversationReady}
                />
                : null
            }

          </div>
        </Drawer>
      </div>
    );
  }
}

export default MessageDrawer;
