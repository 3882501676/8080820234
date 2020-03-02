import React, { Component } from "react";
import { Statistic, Icon } from "antd";
import posed from "react-pose";

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

class List_A extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.avatar = this.avatar.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  toggle = () => this.setState({ isOpen: !this.state.isOpen });
  componentDidMount() {
    console.log("List_A mounted", this.props);
    setTimeout(this.toggle, 100);
  }
  avatar(item) {
    let avatar =
      (item && item.avatar) ||
      "http://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914";
    return avatar;
  }
  render() {
    const { isOpen } = this.state;
    return (
      <List
        pose={isOpen ? "open" : "closed"}
        id="List_A"
        className="list array flex flex-column flex-auto w-100 pb4 pt2 ph0 bg-transparent"
      >
        {this.props.items.map((item, index) => (
          <Item>
            <div
              onClick={() => this.props.showDrawer(item)}
              className="List_A_item sans-serif bg-white flex flex-row flex-auto w-100  items-center justify-start pa0 bs-a mb3 br3 overflow-hidden"
            >
              <div
                style={{ backgroundImage: `url(` + this.avatar(item) + `)` }}
                className="avatar-l flex flex-column flex-auto- mr3 bg-cover bg-center"
              />

              <div className="flex flex-row w-40">
                <div className="flex flex-column flex-auto- mr2 f6 fw6 black-50">
                  {item && item.name && item.name.first}
                </div>
                <div className="flex flex-column flex-auto fw6 f6 black-50">
                  {item && item.name && item.name.last}
                </div>
              </div>
              <div className="flex flex-column w-40">
                <div className="flex flex-column flex-auto fw7 f5 black-60">
                  ...
                </div>
              </div>
              <div
                className="flex flex-row pr3 w-40 justify-end"
                // style={{ background: '#ECECEC', padding: '30px' }}
              >
                <div className="flex flex-column pr4">
                  <span className="flex f7 fw5 black-50">Gender</span>
                  <span className="flex f4 fw5 c_1 ttc">{item.gender}</span>
                </div>

                <div className="flex flex-column pr4">
                  <span className="flex f7 fw5 black-50">Type</span>
                  <span className="flex f4 fw5 c_1 ttc">{item.type}</span>
                </div>
              </div>
            </div>
          </Item>
        ))}
      </List>
    );
  }
}
export default List_A;
