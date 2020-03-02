import React from "reactn";
// import methods from '../../../../utils/methods';
// import { Link } from "react-router-dom";
import { Drawer } from "antd";

// const { TabPane } = Tabs;
// const RadioGroup = Radio.Group;

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

    console.log('MessageDrawer ', props);

   
  } 

  render() {
    return (
      <div>
        <Drawer
          title={"Reservation Detail"}
          placement={"right"}
          closable={true}
          onClose={this.props.hideDrawer}
          width={500}
          visible={this.props.visible}
          doc={this.props.doc}
          className="Reservation"
        >
    
            <div className="flex flex-auto flex-column relative">
              {
                this.props.ready
                  ? <></>
                  : null
              }
            </div>
        </Drawer>
      </div>
    );
  }
}

export default MessageDrawer;
