import React, { getGlobal } from "reactn";
// import { Statistic, Icon, Rate } from 'antd';

import posed from "react-pose";
// import { timingSafeEqual } from "crypto";
// import ChefItem from './ChefItem';
import GridItem from './GridItem'

const List = posed.section({
  open: {
    x: "0",
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
class ListProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      loading: false
    };
    this.avatar = this.avatar.bind(this);
    this.toggle = this.toggle.bind(this);
    // this.fetchExchangeRate = this.fetchExchangeRate.bind(this)
    console.log('List', props)
  }
  toggle = () => this.setState({ isOpen: !this.state.isOpen });
  
  avatar(item) {
    // console.log('avatar',item)
    let avatar =
      typeof (item.picture) !== "undefined" ? item.picture : "http://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914";
    return avatar;
  }
  
  // getExchangeRate() {
    
  // }
  setForeignCurrencyRate() {

  }
  componentDidMount() {
    setTimeout(this.toggle, 100);
  }
  render() {
    const { isOpen } = this.state;
    // console.log('chefs list props',this.props)
    // let exchangeRate = this.props.exchangeRate;
    return (
      <List
        pose={isOpen ? "open" : "closed"}
        id="List_A"
        className={ ( " col-" + this.props.col ) + ( " list array flex flex-row justify-between flex-auto flex-wrap w-100 pb4 pt2 ph0 bg-transparent " ) }
      >
        { this.props.projects.map((item, index) => (
          <Item key={index} className="relative mb4">
            <GridItem 
            key={index} 
            activeProject={this.props.activeProject} 
            project={item} 
            showDrawer={this.props.showDrawer} 
            theme={this.props.theme}
            activeCurrency={this.props.activeCurrency}
            // exchangeRate={this.props.exchangeRate}
            // rate={item.extended.rate * exchangeRate}
            />
          </Item>
        ))}
      </List>
    );
  }
}
export default ListProjects;
