import React from "reactn";
import ListItem from './listItem';
import posed from "react-pose";
import './style.css';

const List = posed.section({
  open: {
    x: "0%",
    delayChildren: 200,
    staggerChildren: 100
  },
  closed: { x: "0", delay: 300 }
});

const Item = posed.div({
  open: { y: 0, opacity: 1 },
  closed: { y: 50, opacity: 0 }
});

// let loader = (
//   <div className="lds-ripple">
//     <div />
//     <div />
//   </div>
// );
class ListNotifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      loading: false,
      ready: true,
      conversations: this.props.conversations
    };
    console.log('Notifications List', props)
    this.toggle = this.toggle.bind(this);
  }
  toggle = () => this.setState({ isOpen: !this.state.isOpen });
  componentDidMount() {
    setTimeout(this.toggle, 100)
  }
  render() {
    const { isOpen } = this.state;
    // console.log(this.props.conversations)
    return (
      <List
        pose={isOpen ? "open" : "closed"}
        id="List_A"
        className="list array flex flex-column justify-between flex-auto flex-wrap w-100 pb4 pt2- ph0 bg-transparent"
      >

        {this.state.ready && this.props.notifications.map((item, index) => (
          <Item key={index} className="relative mb2">

            <ListItem
              showDrawer={this.props.showDrawer}
              // activeConversation={this.props.activeConversation}
              notification={item}
            />

          </Item>
        ))}

      </List>

    );
  }
}
export default ListNotifications;
