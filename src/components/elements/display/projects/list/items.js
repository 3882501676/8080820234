import React, { Component } from "react";
import { Statistic, Icon } from 'antd';

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

let loader = (
  <div className="lds-ripple">
    <div />
    <div />
  </div>
);
class List_Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      loading: false
    };
    this.avatar = this.avatar.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  toggle = () => this.setState({ isOpen: !this.state.isOpen });
  componentDidMount() {
    setTimeout(this.toggle, 100);
  }
  avatar(item) {
    let avatar =
      typeof(item.avatar) !== "undefined" ? item.avatar : "http://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914";
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

        { this.props.items.map((item, index) => (
            <Item key={index} className="relative mv2">
            {
              this.props.activeItem._id === item._id
              ? <><div className={( this.props.theme.colorScheme.bg + " trans-a project-active bs-a" )}></div>
              <div className={(" trans-a project-active-outer bs-a" )}></div></>
              : null
            }
              <div
                onClick={() => this.props.showDrawer(item)}
                className={
                  (this.props.activeItem._id === item._id ? "active " : "")
                + ( this.props.theme.main === "dark" ? " bg-charcoal ": " bg-white " )
                + ( "List_A_item cursor-pointer sans-serif flex flex-row flex-auto w-100  items-center justify-start pa0 bs-a mb4 br2 overflow-hidden relative " )}
              >
                <div
                  style={{ backgroundImage: `url(` + this.avatar(item) + `)` }}
                  className="avatar-l flex flex-column flex-auto- mr3 bg-cover bg-center br4"
                />
                <div className="flex flex-column w-40">
                  <div className={
                    ( this.props.theme.main === "dark" ? " white " : " black-70 " )
                    + ("flex flex-column mr2 f5 fw6 ")}>
                    {item.title || item.name.first}
                  </div>
                  <div className={
                    ( this.props.theme.main === "dark" ? " white-50 " : " black-50 " )
                    + ("flex flex-column flex-auto fw4 f6 black-50")}>
                    {item.description || item.name.last}
                  </div>
                </div>
                <div className="flex flex-column flex-auto w-40 fw7 f5 black-60">

                </div>
                <div
                className="flex flex-row pr3 w-40 justify-end"
                // style={{ background: '#ECECEC', padding: '30px' }}
                >
                <div className="flex flex-column pr4">
                  <span className={
                    ( this.props.theme.main === "dark" ? " black-90 " : " black-50 " )
                    + ("flex f7 fw5")}>Scenes</span>
                  <span className={
                    ( this.props.theme.colorScheme.color )
                    + ( " flex f4 fw5 ttc" )}>
                  3
                  </span>
                </div>

                <div className="flex flex-column pr4">
                  <span className={
                    ( this.props.theme.main === "dark" ? " black-90 " : " black-50 " )
                    + ( "flex f7 fw5")}>Characters</span>
                    <span className={
                      ( this.props.theme.colorScheme.color )
                      + ( " flex f4 fw5 ttc" )}>
                  5
                  </span>
                </div>
  </div>
              </div>
            </Item>
          ))}

      </List>


    );
  }
}
export default List_Projects;
