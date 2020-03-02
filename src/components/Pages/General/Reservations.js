import React from "reactn";
import { getGlobal, setGlobal, useGlobal } from "reactn";
// import methods from '../../../utils/methods';

import { Icon, Empty, Skeleton } from "antd";
import TransitionLayout from "../../Layouts/Transition";
import InsertModal from "../../elements/forms/project/modal/insert";
import PageTitle from "../../elements/layout/PageTitle_B";
import ReservationsDrawer from '../../elements/display/drawers/Reservations';
import ListReservations from '../../elements/display/lists/Reservations';

window.getGlobal = getGlobal;
window.useGlobal = useGlobal;
window.setGlobal = setGlobal;

class Reservations extends React.Component {
  constructor(props) {
    super(props);
    console.log('Reservations props', props)
    this.state = {
      reservations: [],
      activeReservation: {},
      ready: false,
      loading: false,
      theme: Fn.get('theme').config.theme
    }

    this.fetchReservations = this.fetchReservations.bind(this)
    this.refresh = this.refresh.bind(this)

  }
  async fetchReservations() {
    const userID = getGlobal().account.sub;
    await window.db.reservations.find({ 'user.sub': userID }, (err, res) => {
      if (err) { console.error(err) }
      else {
        console.log('reservations', res)
        this.setState({ reservations: res, activeReservation: res[0], ready: true })
      }
    })
  }
  showDrawer(doc) {
    console.log("Document to update ", doc);
    setGlobal({
      activeDoc: doc
    });
    this.setState({
      docInfoVisible: true,
      activeDoc: doc
    });

    localStorage.setItem("activeDoc", JSON.stringify(doc));
  }

  hideDrawer(doc) {
    this.setState({
      docInfoVisible: false
    });
  }
  showModal = () => {
    this.setState({
      insertModalVisible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      insertModalVisible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      insertModalVisible: false
    });
  };
  componentWillUnmount() {
  }
  refresh() {
    this.setState({
      ready: false
    })
    setTimeout(() => {
      this.fetchReservations()
    }, 1000)
  }
  async componentDidMount() {
    this.fetchReservations()
  }
  render() {
    return (
      <TransitionLayout>
        <section id="Home" className="w-100 mw7 center pa4">
          <div onClick={this.refresh} className="absolute top-0 right-0 pa4 pointer">
            <Icon type="sync" />
          </div>

          <PageTitle
            title={"Your Reservations"}
            theme={Fn.get('theme').config.theme}
            showInsertForm={this.showModal}
            docs={this.state.reservations}
            activeDoc={getGlobal().activeDoc}
            updateActiveDoc={this.updateActiveDoc}
          />
          {this.state.ready ? (
            this.state.reservations.length > 0 ? (
              <ListReservations
                reservations={this.state.reservations}
                activeReservation={this.state.activeReservation}
                className="trans-a"
                showDrawer={this.showDrawer}
                theme={Fn.get('theme').config.theme}
              />
            ) : (
                <Empty
                  className="trans-a flex flex-column justify-center items-start"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )
          ) : (
              <div className="trans-a">
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
              </div>
            )}
          {this.state.ready ? (
            <ReservationsDrawer
              type={"info"}
              doc={this.state.activeDoc}
              updateDoc={this.updateDoc}
              visible={this.state.docInfoVisible}
              hideDrawer={this.hideDrawer}
              className="DocInfo"
              close={this.props.handleOk}
              refresh={this.refresh}
              theme={Fn.get('theme').config.theme}
            />) : null}
        </section>
        <InsertModal
          cancel={this.handleCancel}
          ok={this.handleOk}
          visible={this.state.insertModalVisible}
          close={this.handleOk}
          fetchDocs={this.fetchDocs}
          theme={Fn.get('theme').config.theme}
        />
      </TransitionLayout>
    );
  }
}

export default Reservations;
