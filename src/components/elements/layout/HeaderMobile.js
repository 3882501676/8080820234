import React from "react";
// import { useAuth0 } from "../../../utils/auth/react-auth0-spa";
import { BrowserRouter, Link } from "react-router-dom";
import moment from "moment";
import { Avatar, Badge } from "antd";
// import { Popover, NavBar } from 'antd-mobile';
import { Menu, ActivityIndicator, NavBar } from 'antd-mobile';
import { Icon } from '@blueprintjs/core'

// import SelectCurrency from '../display/lists/SelectCurrency';
import AccountContext from '../../../utils/context/AccountContext';

// const Item = Popover.Item;
const notifications = [];
const data = [
  {
    value: '1',
    label: 'Food',
  }, {
    value: '2',
    label: 'Supermarket',
  },
  {
    value: '3',
    label: 'Extra',
    isLeaf: true,
  },
];

const myImg = src => <img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs" alt="" />;

const mainMenuListClass =
  "flex flex-auto- f6 fw6 black-50 ph3 pv4 bb b--black-05 w5 w-100";
const profileMenuListClass =
  "flex flex-auto f6 fw6 black-50 ph2 pv3 bb b--black-05 w5 pointer";
const profileMenuListClass2 =
  "flex flex-auto f6 fw6 bg-black-05 black-30 ph2 pv3 bb b--black-05 w5 pointer";
const mainMenu = (props) => (
  <div onClick={props.close} className="mh-90vh oveflow-scroll- flex flex-column ma0 pa0 w-100 bg-white z-99">

    <div className="flex flex-row  bg-black-10 pv4 ph3 items-center justify-start">

      <div
        // size="large"
        // shape="round"
        className={"bg-center bg-cover "}
        style={{ width: '60px', height: '60px', borderRadius: '100px', color: 'black', backgroundImage: 'url("' + props.context.account.user.profile.picture + '")' }} />

      <span className="f4 fw6 black ml3">{props.context.account.user.profile && props.context.account.user.profile.name.first}{" "}{props.context.account.user.profile && props.context.account.user.profile.name.last}</span>

    </div>

    <Link to={"/profile"} className={mainMenuListClass}>
      <span className="ml2"><Icon icon="home" iconSize={15} className="f7 black-20 mr2" /> Profile</span>
    </Link>

    <Link to={"/home"} className={mainMenuListClass}>
      <span className="ml2"><Icon icon="projects" iconSize={15} className="f7 black-20 mr2" /> Projects</span>
    </Link>

    <Link to={"/messages"} className={mainMenuListClass}>
      <span className="ml2"><Icon icon="chat" iconSize={15} className="f7 black-30 mr2" /> Messages</span>
    </Link>

    {/* <Link to={"/network"} className={mainMenuListClass}>
      <span className="ml2"><Icon icon="exchange" iconSize={15} className="f7 black-30 mr2" /> Network</span>
    </Link> */}

    <Link to={"/calendar"} className={mainMenuListClass}>
      <span className="ml2"><Icon icon="timeline-events" iconSize={15} className="f7 black-30 mr2" /> Calendar</span>
    </Link>

    <Link to={"/myprojects"} className={mainMenuListClass}>
      <span className="ml2"><Icon icon="projects" iconSize={15} className="f7 black-30 mr2" /> My Projects</span>
    </Link>

    {/* <Link to={"/settings"} className={mainMenuListClass}>
      <span className="ml2"><Icon type="unordered-list" className="f7 black-30 mr2" /> Settings</span>

    </Link> */}
  </div>
)

class HeaderMobile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      selected: '',
      show: false,
      initData: '',
    };

    this.toggleMenu = this.toggleMenu.bind(this)
    this.onMaskClick = this.onMaskClick.bind(this)
  }

  onSelect = (opt) => {
    // console.log(opt.props.value);
    this.setState({
      visible: false,
      selected: opt.props.value,
    });
  };
  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  };
  toggleMenu(e) {
    e.preventDefault(); // Fix event propagation on Android
    this.setState({
      show: !this.state.show,
    });
    // mock for async data loading
    if (!this.state.initData) {
      setTimeout(() => {
        this.setState({
          initData: data,
        });
      }, 500);
    }
  }
  onMaskClick = () => {
    this.setState({
      show: false,
    });
  }
  render() {

    const { initData, show } = this.state;

    const menuEl = (
      <Menu
        className="single-foo-menu top-10vh "
        data={initData}
        value={['1']}
        level={1}
        onChange={this.onChange}
        height={document.documentElement.clientHeight * 0.6}
      />
    );
    const loadingEl = (
      <div style={{ position: 'absolute', width: '100%', height: document.documentElement.clientHeight * 0.6, display: 'flex', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </div>
    );

    return (
      <div id="Header-Mobile" className="flex flex-row fixed top-0 left-0 w-100 z-999">

        <div className={show ? ' single-menu-active flex w-100 flex-column ' : ' flex w-100 flex-column '}>
          <div className="flex w-100 flex-column">
            <NavBar
              rightContent={<div className="flex flex-row row-reverse flex-auto ph3 pv3 black-80 fw7 items-center justify-start">

                <div
                  className={

                    "white flex ph3 ttu pv2 items-center logotext ttu spaced tracked raleway fw6 ba b--white bw1"
                  }
                >
                  Crew20
</div>

              </div>}
              leftContent={<Icon icon='menu' iconSize={20} />}
              mode="light"
              onLeftClick={this.toggleMenu}
              // onRightClick={this.props.history.push('/home')}
              className="single-top-nav-bar row-reverse w-100 flex"
            >

            </NavBar>
          </div>
          {show ? initData ? mainMenu({ context: this.context, close: this.onMaskClick }) : loadingEl : null}
          {show ? <div className="menu-mask" onClick={this.onMaskClick} /> : null}
        </div >

      </div >);
  }
}
export default HeaderMobile
HeaderMobile.contextType = AccountContext