import React, { getGlobal } from "reactn";
// import { Statistic, Icon, Rate } from 'antd';
import moment from 'moment';
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

// let loader = (
//   <div className="lds-ripple">
//     <div />
//     <div />
//   </div>
// );
class ListReservations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      loading: false
    };
    this.avatar = this.avatar.bind(this);
    this.toggle = this.toggle.bind(this);
    console.log('List', props)
  }
  toggle = () => this.setState({ isOpen: !this.state.isOpen });
  
  avatar(item) {
    // console.log('avatar',item)
    let avatar =
      typeof (item.avatar) !== "undefined" ? item.avatar : "http://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914";
    return avatar;
  }
  componentDidMount() {
    setTimeout(this.toggle, 100);
  }
  render() {
    const { isOpen } = this.state;
    console.log('chefs list props',this.props)
    return (
      <List
        pose={isOpen ? "open" : "closed"}
        id="List_A"
        className="list array flex flex-column justify-between flex-auto flex-wrap w-100 pb4 pt2 ph0 bg-transparent"
      >
        {this.props.reservations.map((item, index) => (
          <Item key={index} className="relative mv2">
           
            <div
              onClick={() => this.props.showDrawer(item)}
              className={
                (this.props.activeReservation.id === item.id ? "active " : "")
                + (this.props.theme.main === "dark" ? " bg-charcoal " : " bg-white ")
                + ("List_A_item cursor-pointer sans-serif flex flex-column flex-row-ns flex-auto w-100  items-center justify-start pa0 bs-a mb4 br2 overflow-hidden relative ")}
            >
              <div
                style={{ backgroundImage: `url(`+ item.chef.picture +`)` }}
                className="avatar-m flex flex-column flex-row-ns bg-cover bg-center br4-"
              />
              <div className="flex flex-column flex-row-ns w-100">
                <div className="flex flex-row w-100 ph3 items-center">
                  <div className={
                    (this.props.theme.main === "dark" ? " white " : " black-70 ")
                    + ("flex flex-column mr2 f5 fw6 ")}>
                    {item.chef.given_name}
                  </div>
                  <div className={
                    (this.props.theme.main === "dark" ? " white-50 " : " black-50 ")
                    + ("flex flex-column flex-auto fw4 f5 black-50 ")}>
                    {item.chef.family_name}
                  </div>
                </div>
                
                <div
                  className="flex flex-column flex-row-ns w-100 justify-end pr3"               
                >
                  <div className="flex flex-column w-100 items-start justify-center">
                    <span className={
                      (this.props.theme.main === "dark" ? " black-90 " : " black-30 ")
                      + ("flex f7 fw5")}>Date</span>
                    <span className={
                      " flex f5 fw5 ttc black-70"}>
                      {moment(item.date).format('MMM Do YYYY')}
                    </span>
                  </div>                 
                </div>

                
                <div
                  className="flex flex-column flex-row-ns w-100 justify-end pr3"               
                >
                  <div className="flex flex-column w-100 items-start justify-center">
                    <span className={
                      (this.props.theme.main === "dark" ? " black-90 " : " black-30 ")
                      + ("flex f7 fw5")}>Cost</span>
                    <span className={
                      " flex f5 fw5 ttc black-70"}>
                      {getGlobal().activeCurrency.symbol}{item.totalCost}
                    </span>
                  </div>                 
                </div>

                <div
                  className="flex flex-column flex-row-ns w-100 justify-end pr3"               
                >
                  <div className="flex flex-column w-100 items-start justify-center">
                    <span className={
                      (this.props.theme.main === "dark" ? " black-90 " : " black-30 ")
                      + ("flex f7 fw5")}>Location</span>
                    <span className={" flex f7 fw5 ttc black-70"}>
                      {item.location}
                    </span>
                  </div>                 
                </div>

              </div>
            </div>
          </Item>
        ))}
      </List>
    );
  }
}
export default ListReservations;
