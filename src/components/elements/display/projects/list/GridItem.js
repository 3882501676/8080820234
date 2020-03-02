import React, { getGlobal } from "reactn";
import { Link } from 'react-router-dom';

import './style.css';
import CurrencyContext from '../../../../../CurrencyContext';
import { Popover, Button } from 'antd';
import { Icon } from '@blueprintjs/core'
import moment from 'moment';
window.moment = moment;

var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;
const text = <span>Title</span>;

const listActionButtons = (props) => (
  <div className={(" flex flex-column f7 fw6 exo br3")}>
    <span className="bg-white-80 trans-a list-actions-item pointer pv2 ph3 flex bb b--black-05 black-60-white-80 flex items-center"><Icon className="f7 fw6 black-40 -white mr2" type="container" /> Add to shortlist</span>
    <span className="bg-white-80 trans-a list-actions-item pointer pv2 ph3 flex bb b--black-05 black-60 -white-80 flex items-center"><Icon className="f7 fw6 black-40 -white mr2" type="message" /> Send Message</span>
  </div>
);

class GridItem extends React.Component {

  constructor(props) {
    super(props)
    
    this.state = {

    }

    console.log('Project Detail', this.props)

    this.avatar = this.avatar.bind(this);
    
  }
  avatar(item) {
    let avatar =
    typeof (item.media) !== "undefined" && typeof (item.media.images) !== "undefined" ? item.media.images[0].url : "http://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914";
    return avatar;
  }

  componentDidUpdate() {
    // console.log('[[ ProjectItem updated ]]', this.props)    
  }
  componentDidMount() {
  }
  render() {
    return (
      <Link
        to={'/project/' + this.props.project.id}
        className={
          
           (" trans-a relative raleway Project_list_item pointer -sans-serif flex flex-column flex-auto w-100  items-center justify-start pa0 bs-b mb4 br2 overflow-hidden relative ")}
      >
        <div        
          className="avatar-l- w-100 flex flex-column bg-cover bg-center br4-"
          style={{ 
            height: '120px',
          backgroundImage: this.props.project.media && this.props.project.media.images.length
          ? "url(" +
          this.props.project.media.images[0].url +
            ")"
          : GeoPattern.generate(this.props.project.title).toDataUrl() }}
        />

        <div className="flex flex-column  w-100 relative bg-white raleway">
          <div className="list-action-buttons">
            <Popover
              placement="bottomRight"
              content={listActionButtons()}
              trigger="hover">
              <div className={(" pv0 ph2 br3 f4 fw6 black")}><span className="flex items-center justify-center w-100 h-100"><Icon className="white f4" type="ellipsis" /></span></div>
            </Popover>
          </div>
          <div className="flex flex-row w-100">
            <div className="flex flex-column w-100 ">
              <div className={
                ("flex flex-column pa3 bb b--black-10 ")}>
                <h4 className="f5 flex flex-column mb0">
                  <span className="f4 fw6 black-80">{this.props.project.title === "" ? "Untitled" : this.props.project.title }</span>
                  {/* <span className="f5 fw3 black-40">{this.props.project.description}</span> */}
                </h4>
              </div>
              <div className={
                ("flex flex-row ")}>
                
                <div className="flex flex-column mb0 pa3 flex-auto">
                  <span className="f7 fw7 black-70 mb1"><span className="fw4 black-40 mr2">Start date</span> {moment(this.props.project.start_date).format('DD MMM YYYY')}</span>
                  <span className="f7 fw7 black-70"><span className="fw4 black-40 mr2">Deadline</span> {moment(this.props.project.deadline).format('DD MMM YYYY')}</span>
                </div>

                <div className="flex flex-column w-30 bl b--black-10 bw-1 items-center justify-center ph2">
                
                <span className="flex f5 fw5 black tc items-center justify-center pb1">{moment(this.props.project.start_date).diff(new Date(), 'days')} days</span>
                
                  <span className="flex f7 fw3 black-60 tc">until start date</span>
                
                </div>
                
                </div>

            </div>
            
          </div>



        </div>
        <div className={(" exo flex flex-row justify-between  w-100")} >

          <div
            // style={{ background: 'rgb(120, 150, 120)' }}
            className=" bg-black-05-  flex flex-row justify-between w-100">

            <div className={(" flex flex-row w-100 justify-between")}>

              <div className="flex flex-row  mb0 flex-auto items-center justify-center  ">

                <span className={"flex f7 fw3 black-50 pa2"}>
                  
                  <span className="fw7 mr1">{this.props.project.positions.length}</span> positions
               
                </span>

              </div>

              <div className="flex flex-row  mb0 flex-auto items-center justify-center bl b--white-30 ">

                <span className={"flex f7 fw3 black-50  pa2"}>
                 
                  <span className="fw7 mr1">{this.props.project.crew.length}</span> filled
                
                </span>

              </div>

              <div className="flex flex-row  mb0 flex-auto items-center justify-center bl b--white-30 ">

                <span className={"flex f7 fw3 black-50 items-center justify-center  pa2"}>
                  
                  <Icon icon={'comment'} iconSize={14} className="mr1" /> {this.props.project.comments.length}
              
                </span>
                
              </div>

              <div className="flex flex-row  mb0 flex-auto items-center justify-center bl b--white-30 bg-black-1-0 ">

                <span className={"flex f7 fw3 black-50 items-center justify-center  pa2"}>
                
                  view <Icon icon={'arrow-right'} iconSize={14} className="ml1" />
              
                </span>

              </div>

            </div>

          </div>

        </div>
      </Link>
    )
  }
}
export default GridItem
