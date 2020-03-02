import React, { getGlobal } from "reactn";
import { Link } from "react-router-dom";
import { Drawer } from "antd";
// import { Tabs } from "antd";
import MessageBox2 from "../messages/messagebox2";
var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;

export default class NotificationDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doc: this.props.doc,
      // conversation: this.props.activeConversation,
      visible: this.props.visible,
      childrenDrawer: false,
      placement: "right",
      test: this.props.visible,
      activeTab: "1",
      characters: [],
      conversationReady: false,
      ready: false
    };

    // console.log("DocInfo", props);

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
    return (
      <div>
        <Drawer
          title={"Notification Detail"}
          placement={"right"}
          closable={true}
          onClose={this.props.close}
          width={500}
          visible={this.props.visible}
          doc={this.props.doc}
          className="Conversation"
        >
          {this.props.visible && (
            <div className="flex flex-auto flex-column relative pa5">
              <div className="flex flex-column mr2 f3 fw6 pb3">
                {this.props.doc.title}
              </div>
              <div className="flex flex-column mr2 f4 fw4 black-50 pb3 -ph4">
                {this.props.doc.content}
              </div>
              <div className="flex flex-column mr2 f5 fw6 pb3 pt3">
                Sender
              </div>
              <div className="flex flex-column mr2 f4 fw4 black-50 pb3 -ph4">
                
                {
                  this.props.doc.data && this.props.doc.data.sender &&
                  <div className="flex flex-row-ns flex-row -w-100">
                  <div
                    // onClick={() => this.props.toggleInnerDrawer(item)}
                    className="flex flex-column w-100="
                  >
                    <div className="round pa1 bg-white center">
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundImage:
                          this.props.doc.data.sender.picture.length
                          ? "url(" + this.props.doc.data.sender.picture + ")"
                          : GeoPattern.generate(this.props.doc.data.sender.name.first + this.props.doc.data.sender.name.last).toDataUrl()
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
                      <span className="flex flex-row-ns flex-column w-100 black f3 fw6">
                        <span className="flex flex-row items-center justify-start-ns justify-center black-70 f5 fw6">
                          {this.props.doc.data.sender.name.first} {this.props.doc.data.sender.name.last}
                        </span>
                      </span>
                    </div>
                  </div>
        
      
                </div>
                }
              </div>
              <div className="flex flex-column mr2 f5 fw6 pb3 pt3">
                Project
              </div>
              <div className="flex flex-column mr2 f4 fw4 black-50 pb3 -ph4">
                {
                  this.props.doc.data && this.props.doc.data.project && this.props.doc.data.project.title.length && 
                  <div className="flex flex-row-ns flex-row -w-100">
                  <div
                    // onClick={() => this.props.toggleInnerDrawer(item)}
                    className="flex flex-column w-100="
                  >
                    <div className="round pa1 bg-white center">
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundImage:
                                                     this.props.doc.data.project.picture
                                                      ? "url(" + this.props.doc.data.project.picture + ")"
                                                      : GeoPattern.generate(this.props.doc.data.project.title).toDataUrl()
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
                      <span className="flex flex-row-ns flex-column w-100 black f3 fw6">
                        <span className="flex flex-row items-center justify-start-ns justify-center black-70 f5 fw6">
                          {this.props.doc.data.project.title}
                        </span>
                      </span>
                    </div>
                  </div>
        
      
                </div>
                }
              </div>
              <div className="flex flex-auto flex-row relative mt3">
                <Link
                  to={"/project/" + this.props.doc.data.project.id}
                  className="round f5 fw5 white bg-black-20 hover-bg-black-30 ph4 pv2 bs-b hover-white"
                >
                  View Project
                </Link>

                {/* {this.props.doc.data.type === "project_invite" &&
                  <Link to={'/project/' + this.props.doc.data.link} className="f6 fw5 black-50">View Project</Link>
                }

                {this.props.doc.data.type === "message_reply" &&
                  <Link to={'/project/' + this.props.doc.data.link} className="f6 fw5 black-50">View Message</Link>
                }
                {this.props.doc.data.type === "application_response" &&
                  <Link to={'/project/' + this.props.doc.data.link} className="f6 fw5 black-50">View Application</Link>
                } */}
              </div>
            </div>
          )}
        </Drawer>
      </div>
    );
  }
}

// export default MessageDrawer;
