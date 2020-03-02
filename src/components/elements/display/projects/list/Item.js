import React, { getGlobal } from "reactn";
import { Statistic, Icon, Rate } from 'antd';
import './style.css';
import CurrencyContext from '../../../../../CurrencyContext';
import { Popover, Button } from 'antd';
const text = <span>Title</span>;

const listActionButtons = (props) => (
  <div className={ props.bg + (" flex flex-column f7 fw5 exo br3" ) }>
    <span className="trans-a list-actions-item pointer pv2 ph2 flex bb b--black-05 white-80"><Icon className="f5 fw6 white mr2" type="container" /> Add to shortlist</span>
    <span className="trans-a list-actions-item pointer pv2 ph2 flex bb b--black-05 white-80"><Icon className="f5 fw6 white mr2" type="message" /> Send Message</span>
  </div>
);


class Item extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      exchangeRate: this.props.exchangeRate,
      rate: parseInt(this.props.chef.extended.rate) * parseInt(getGlobal().exchangeRate)
    }
    console.log('chefitem', this.props)
    this.fetchExchangeRate = this.fetchExchangeRate.bind(this)
    this.avatar = this.avatar.bind(this);
  }
  avatar(item) {
    let avatar =
      typeof (item.picture) !== "undefined" ? item.picture : "http://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914";
    return avatar;
  }

  async fetchExchangeRate() {
    const baseRate = this.props.chef.extended.rate;
    let newRate = baseRate * this.props.exchangeRate;
    this.setState({ rate: newRate })


  }
  componentDidUpdate() {
    console.log('[[ ChefItem updated ]]', this.props)
    console.log('rate', this.props.chef.extended.rate);
    console.log('exchange rate', this.props.rate)
  }
  componentDidMount() {
  }
  render() {
    return (
      <div
        onClick={() => this.props.showDrawer(this.props.chef)}
        className={
          (this.props.activeChef.id === this.props.chef.id ? "active " : "")
          + (this.props.theme && this.props.theme.main === "dark" ? " bg-charcoal " : " bg-white ")
          + (" trans-a relative exo Chef_list_item cursor-pointer -sans-serif flex flex-column flex-auto w-100  items-center justify-start pa0 bs-a mb4 br2 overflow-hidden relative ")}
      >
        <div
          style={{ backgroundImage: `url(` + this.avatar(this.props.chef) + `)` }}
          className="avatar-l flex flex-column bg-cover bg-center br4"
        />

        <div className="flex flex-column pa3 w-100 relative">
          <div className="list-action-buttons">
            <Popover 
            placement="bottomRight" 
            content={listActionButtons({ bg: Fn.get('theme').config.theme.colorScheme.bg})} 
            trigger="hover">
              <div className={ Fn.get('theme').config.theme.colorScheme.bg + (" pv0 ph2 br3 f4 fw6 black") }><span className="flex items-center justify-center w-100 h-100"><Icon className="white f4" type="ellipsis" /></span></div>
            </Popover>
          </div>
          <div className="flex flex-row w-100">
            <div className={
              (this.props.theme && this.props.theme.main === "dark" ? " white " : " black-50 ")
              + ("flex flex-column mr2  ")}>
              <h4 className="f5 flex flex-column">
                <span className="f4 fw6 black-80">{this.props.chef.given_name}</span>
                <span className="f5 fw3 black-40">{this.props.chef.family_name}</span></h4>
            </div>

          </div>
          <div className="flex flex-column w-100 justify-end pt3">
            <div className="flex flex-column w-100 pb2">
              <span className={
                (this.props.theme && this.props.theme.main === "dark" ? " black-90 " : " black-30 ")
                + ("flex f7 fw5")}>Hourly Rate</span>
              <span className={
                (this.props.theme && this.props.theme.colorScheme.color)
                + (" exo flex f4 fw6 ttc -black-60 trans-a")}>
                <div>{this.props.activeCurrency.symbol}{Math.round(this.props.chef.extended.rate * this.props.exchangeRate)}</div>

              </span>
            </div>

            <div className="flex flex-column ">
              <span className={
                (this.props.theme && this.props.theme.main === "dark" ? " black-90 " : " black-30 ")
                + ("flex f7 fw5 pb2")}>Reputation</span>
              <span className={
                (this.props.theme && this.props.theme.colorScheme.color)
                + (" flex f4 fw5 ttc")}>
                <Rate
                  disabled
                  allowHalf
                  defaultValue={this.props.chef.extended.profile.additional.rate.rating}
                  className={(this.props.theme && this.props.theme.colorScheme.color) + " f6 "}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Item
// {/**--
//               this.props.activeChef._id === item._id
//                 ? <><div className={(this.props.theme.colorScheme.bg + " trans-a project-active bs-a")}></div>
//                   <div className={(" trans-a project-active-outer bs-a")}></div></>
//                 : null
//             --**/}
//             {
//                 this.props.activeChef._id === item._id ? <></> : <></>
//               }