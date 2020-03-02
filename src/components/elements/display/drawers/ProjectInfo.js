import React, { getGlobal } from "reactn";
import { Link } from "react-router-dom";
import { Drawer, Rate } from "antd";
import { Tabs, Icon } from "antd";
import MessageBox1 from '../messages/messagebox1';
import methods from '../../../../utils/methods';
import { Fn } from '../../../../utils/fn/Fn.js';
import ReservationFormWrapper from '../forms/ReservationFormWrapper';

import './style.css';

const { TabPane } = Tabs;

const specialties = [
  {
    name: "pizza",
    description: "pizza",
    image: "https://img.theculturetrip.com/768x432/wp-content/uploads/2018/11/p028c1.jpg"
  },
  {
    name: "pasta",
    description: "pasta",
    image: "https://www.bbcgoodfood.com/sites/default/files/editor_files/2017/08/goan.jpg"
  },
  {
    name: "lasagne",
    description: "lasagne",
    image: "https://www.africa.com/wp-content/uploads/2019/04/potjiekos_sa_geckoro_sGNEZ.jpg"
  },
]
const cuisines = [
  {
    name: "italian",
    description: "italian",
    image: "https://img.theculturetrip.com/768x432/wp-content/uploads/2018/11/p028c1.jpg"
  },
  {
    name: "thai",
    description: "thai",
    image: "https://www.bbcgoodfood.com/sites/default/files/editor_files/2017/08/goan.jpg"
  },
  {
    name: "south african",
    description: "south african",
    image: "https://www.africa.com/wp-content/uploads/2019/04/potjiekos_sa_geckoro_sGNEZ.jpg"
  },
]

const roles = [
  { name: "Executive Project",
  description: "",
    active: true },
    { name: "Project de Cuisine",
    description: "",
    active: false },
    { name: "Sous Project",
    description: "",
    active: true },
    { name: "Project de Partie",
    description: "",
    active: false },
    { name: "Commis Project",
    description: "",
    active: false },
]

class ProjectInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doc: this.props.project,
      conversation: this.props.activeConversation,
      visible: this.props.visible,
      childrenDrawer: false,
      placement: "right",
      test: this.props.visible,
      activeTab: this.props.activeTab,
      characters: [],
      conversationReady: false,
      ready: false,
      specialtiesDrawerVisible: false,
      itemDetailDrawerVisible: false,
      activeItem: {}
    }

    console.log('DocInfo', props);

    this.avatar = this.avatar.bind(this);
    this.goToTab1 = this.goToTab1.bind(this);
    this.goToTab2 = this.goToTab2.bind(this);
    this.tabOnChange = this.tabOnChange.bind(this);
    this.showChildrenDrawer = this.showChildrenDrawer.bind(this)
    this.hideInnerDrawer = this.hideInnerDrawer.bind(this);
    this.getRecipientDetail = this.getRecipientDetail.bind(this);
    this.toggleSpecialtiesDrawer = this.toggleSpecialtiesDrawer.bind(this);
    this.toggleItemDetailDrawer = this.toggleItemDetailDrawer.bind(this)

    this.reservationHours = React.createRef();
    this.reservationDate = React.createRef();
  }
  toggleItemDetailDrawer(data) {
    // alert()
    const { item } = data;
    this.setState({
      activeItem: item && item || this.state.activeItem,
      itemDetailDrawerVisible: !this.state.itemDetailDrawerVisible
    })
  }
  toggleSpecialtiesDrawer() {
    this.setState({
      specialtiesDrawerVisible: !this.state.specialtiesDrawerVisible
    })
  }
  showChildrenDrawer = () => {
    this.setState({
      childrenDrawer: true,
    });
  };

  hideInnerDrawer = () => {
    this.setState({
      childrenDrawer: false,
    });
  };
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };
  onClose = () => {
    this.setState({
      visible: false
    });
  };
  onChange = e => {
    this.setState({
      placement: e.target.value
    });
  };
  tabOnChange(e) {
    console.log('activeTab', e);
    this.setState({
      activeTab: e
    })
  }
  goToTab1() {
    this.setState({ activeTab: "1" });
  }
  goToTab2() {
    this.setState({ activeTab: "2" });
  }
  avatar(project) {
    console.log('ProjectInfo user', project)
    let avatar =
      typeof project.media.images !== "undefined"
        ? project.media.images[0].url
        : "http://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914";
    return avatar;
  }
  checkUploadResult(resultEvent) {
    if (resultEvent.event === "success") {
      // console.log(this.props.currentUser.id)
    }
  }
  async getRecipientDetail(doc) {
    let data = { doc, self: this };
    console.log('docinfo.js getRecipientDetail doc', data)
    let doc_ = await methods.getRecipientDetail(data);
    console.log('getRecipientDetail', doc_)
  }
  componentDidUpdate() {
    // console.log("Update", this.state, this.props.visible);
  }
  componentDidMount() {
    console.log('docinfo props', this.props)
  }
  render() {

    return (
      <div>
        <Drawer
          // title={"Project Detail"}
          placement={"right"}
          // closable={true}
          onClose={this.props.hideDrawer}
          width={500}
          visible={this.props.visible}
          doc={this.props.project}
          className={"ProjectDetail -bg-near-white"}
        >
          <Drawer
            // title="Request a Reservation"
            width={500}
            closable={false}
            onClose={this.hideInnerDrawer}
            visible={this.state.childrenDrawer}
            className={"-bg-near-white"}
          >
            <ReservationFormWrapper
              project={this.props.project}
              hideDrawer={this.props.hideDrawer}
              hideInnerDrawer={this.hideInnerDrawer}
              exchangeRate={this.props.exchangeRate}
              currency={this.props.activeCurrency}
            />
          </Drawer>

          <Drawer
            // title="Request a Reservation"
            width={400}
            closable={true}
            onClose={this.toggleSpecialtiesDrawer}
            visible={this.state.specialtiesDrawerVisible}
          >
            <div className="flex flex-column mb2 pa4  ">
              <div className="ProjectScenesHeading pt0">
                <h3 className="f6 fw3 black-30 mb3">Specialties</h3>
              </div>

              <div className="flex flex-auto flex-column pb0">
                <div className="specialties-list- flex flex-column flex-wrap justify-start f4 fw4 black-60 mb0">
                  {
                    specialties.map((item, index) => (
                      <div onClick={() => this.toggleItemDetailDrawer({ item })} className="specialties-list-item- flex flex-column mb4 ">
                        <div className="ttc flex flex-column pb2 f5 fw5 exo">{item.name}</div>
                        <div
                          style={{ backgroundImage: 'url(' + item.image + ')' }}
                          className="h4 w-100 cover bg-center br3 bs-c"></div>

                      </div>
                    ))
                  }
                  {
                    specialties.length === 0 &&


                    <h3 className="f5 fw1 black-30 pb3">No Specialties Added Yet</h3>
                  }
                </div>
              </div>
            </div>
          </Drawer>
          <Drawer
            title="Detail"
            width={400}
            closable={true}
            onClose={this.toggleItemDetailDrawer}
            visible={this.state.itemDetailDrawerVisible}
          >
            <div className="flex flex-column mb2 pa4  ">
              <div className="ProjectScenesHeading pt0">
                <h3 className="f6 fw3 black-30 mb3">Specialties</h3>
              </div>

              <div className="flex flex-auto flex-column pb0">
                <div className="specialties-list- flex flex-column flex-wrap justify-start f4 fw4 black-60 mb0">
                  <div className="specialties-list-item- flex flex-column mb4 ">
                    <div className="ttc flex flex-column pb2 f5 fw5 exo">{this.state.activeItem.name}</div>
                    <div
                      style={{ backgroundImage: 'url(' + this.state.activeItem.image + ')' }}
                      className="h4 w-100 cover bg-center br2 bs-c"></div>
                    <div className="ttc flex flex-column pb2 f4 fw3 exo mt3 black-60">{this.state.activeItem.description}</div>
                  </div>

                </div>
              </div>
            </div>
          </Drawer>

          <Tabs
            onChange={this.tabOnChange}
            defaultActiveKey="1"
            activeKey={this.state.activeTab}
          >
            <TabPane tab={<span className="exo f7 fw5 white- black-30 pv2 flex items-center justify-center"><Icon type="calendar" className={(Fn.get('theme').config.theme.colorScheme.color) + (" f4 black-60 mr2")} /> View</span>} key="1">
              <div className="exo flex flex-auto flex-column relative">
                <div
                  style={{
                    backgroundImage: "url(" + this.avatar(this.props.project) + ")"
                  }}
                  className=" project-cover-image relative h5 flex flex-auto flex-column w-100 bg-center bg-cover items-start justify-end pa5 relative overflow-hidden"
                >
                  <h4 className="f4 fw6 black-70- white mb0 rubik">
                    {this.props.project.title}
                  </h4>
                  <h4 className="f5 fw4 black-50- white-80 mb0">
                    {this.props.project.description}
                  </h4>

                  <div className="absolute bottom-0 right-0 flex flex-auto flex-column pa3">
                    <button
                      className="addCoverPhoto -pulse flex flex-auto items-center justify-center ph3 pv2 bn br1 -c_1_bg white f6 fw6 bg-transparent relative"
                      onClick={this.showWidget}
                    >
                      <Icon type="file" className="slide-fwd-center " />
                    </button>
                  </div>
                </div>
              </div>
              <section id="ActionButtons" className="-ph3 -pv3 -pb5 -bb -b--black-05">

                <div className="Buttons flex flex-row justify-between">
                  <div className="flex flex-column w-100 ">
                    <button className={("- bg-white -bs-a -c_1_bg ph3 pv2 pointer bn ")} onClick={this.showChildrenDrawer}><span className="exo c_5- f6 fw5 white- black-30 pv3 flex items-center justify-center"><Icon type="calendar" className={(" f4 black-60 mr2")} /> Reserve</span></button>
                  </div>
                  <div className="flex flex-column w-100  bl b--black-05">
                    <button className={ + ("- bg-white -bs-a -c_1_bg ph3 pv2 pointer bn")} onClick={this.goToTab2}><span className="exo c_5- f6 fw5 white- black-30 pv3 flex items-center justify-center"><Icon type="message" className={ (" f4 black-60 mr2")} /> Message</span></button>                  </div>
                </div>

              </section>
              <div className="pa4 bg-white-60 exo ">
                <div className="flex flex-column mb2 ">
                  <div className="flex flex-row justify-between">
                    <section id="Reputation" className="flex flex-column pa4">
                      <div className="ProjectScenesHeading pt0">
                        <h3 className="f6 fw3 black-30 mb2">Hourly Rate</h3>
                      </div>
                      <div className="flex flex-auto flex-column">

                        {/* <p className={this.props.theme.colorScheme.color + (" f3 fw6 black-60-")}>
                          {this.props.activeCurrency.symbol}
                          {Math.round(this.props.project.extended.rate * this.props.exchangeRate)}.00
</p>
                        <p className="f7 fw4 black-20 mb0">
                          {this.props.activeCurrency.name}
                        </p> */}

                      </div>

                    </section>
                    <section id="Rate" className="flex flex-column pa4">
                      <div className="ProjectScenesHeading pt0">
                        <h3 className="f6 fw3 black-30 mb3">Reputation</h3>
                      </div>
                      <div className="flex flex-auto flex-column">
                        <Rate
                          disabled
                          allowHalf
                          className={""}
                          defaultValue={this.props.project.reputation && this.props.project.reputation || 3} />

                      </div>
                    </section>
                  </div>
                </div>
                <div className="flex flex-column mb2 pa4 br4 bg-white">
                  <div className="flex flex-column">
                    <div className="ProjectScenesHeading pt0">
                      <h3 className="f6 fw3 black-30 mb2">Bio</h3>
                    </div>

                    <div className="flex flex-auto flex-column pb0">
                      <p className="f4 fw4 black-60 mb0">{this.props.project.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-column pt4">
                    <div className="ProjectScenesHeading pt0">
                      <h3 className="f6 fw3 black-30 mb3">Ideal role</h3>
                    </div>

                    <div className="flex flex-auto flex-column pb0">
                      <p className="flex flex-row flex-wrap f4 fw4 black-60 mb0">{roles.map((item, index) => (
                      <span className={ (item.active &&  " bg-blue white ") + (" flex f7 fw6 black-60 ph2 pv1 br1 bs-d mr2 mb2" ) }>{ item.active && <Icon type="check" />} {item.name}</span>
                      ))}</p>
                    </div>
                  </div>
                </div>



                <div className="flex flex-column mb2 pa4  ">
                  <div className="ProjectScenesHeading pt0">
                    <h3 className="f6 fw3 black-30 mb3">Specialties</h3>

                  </div>

                  <div className="flex flex-auto flex-column pb0">
                    <div className="specialties-list flex flex-row flex-wrap justify-start f4 fw4 black-60 mb0">
                      {
                        specialties.map((item, index) => (
                          <div onClick={() => this.toggleItemDetailDrawer({ item })} className="specialties-list-item flex flex-column ">
                            <div
                              style={{ backgroundImage: 'url(' + item.image + ')' }}
                              className="avatar-m cover bg-center br3 bs-c"></div>

                          </div>
                        ))
                      }
                      {
                        specialties.length === 0 &&
                        <h3 className="f5 fw1 black-30 pb3">No Specialties Added Yet</h3>
                      }
                    </div>
                    <span
                      onClick={this.toggleSpecialtiesDrawer}
                      className={Fn.get('theme').config.theme.colorScheme.color + (" white- c_9 ph1 pv0 br1 f7 fw6 mt3")}>
                      see more
                      </span>
                  </div>
                </div>
                <div className="flex flex-column mb2 pa4  ">
                  <div className="ProjectScenesHeading pt0">
                    <h3 className="f6 fw3 black-30 mb3">Cuisines</h3>
                  </div>

                  <div className="flex flex-auto flex-column pb0">
                    <div className="cuisines-list flex flex-row flex-wrap justify-start f4 fw4 black-60 mb0">
                      {
                        cuisines.map((item, index) => (
                          <div onClick={() => this.toggleItemDetailDrawer({ item })} className="cuisines-list-item flex flex-column ">
                            <div
                              style={{ backgroundImage: 'url(' + item.image + ')' }}
                              className="avatar-m cover bg-center br3 bs-c"></div>

                          </div>
                        ))
                      }
                      {
                        cuisines.length === 0 &&
                        <h3 className="f5 fw1 black-30 pb3">No Cuisines Added Yet</h3>
                      }
                    </div>
                    <span
                      onClick={this.toggleSpecialtiesDrawer}
                      className={Fn.get('theme').config.theme.colorScheme.color + (" white- c_9 ph1 pv0 br1 f7 fw6 mt3")}>
                      see more
                      </span>
                  </div>
                </div>



              </div>
            </TabPane>
            <TabPane tab={<span className="f7 fw5 white- black-30 pv2 flex items-center justify-center"><Icon type="message" className={(Fn.get('theme').config.theme.colorScheme.color) + (" f4 black-60 mr2")} /> Message</span>} key="2">
              <div className="flex flex-auto flex-column relative">
                {
                  this.props.conversationReady
                    ? <MessageBox1
                      type={"info"}
                      project={this.props.project}
                      postCollection={this.postCollection}
                      updateDoc={this.updateDoc}
                      theme={Fn.get('theme').config.theme}
                      conversationReady={this.props.conversationReady}
                    />
                    : null
                }
              </div>
            </TabPane>

          </Tabs>
        </Drawer>
      </div>
    );
  }
}

export default ProjectInfo;
