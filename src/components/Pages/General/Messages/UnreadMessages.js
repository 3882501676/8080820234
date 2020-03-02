import React from "react";
// import { getGlobal, setGlobal, useGlobal } from "reactn";
// import methods from '../../../utils/methods';
import { Empty, Skeleton } from "antd";
import { Fn, app } from "../../../../utils/fn/Fn.js";
import { Spinner, Icon } from "@blueprintjs/core";
// import { RingSpinner } from "react-spinners-kit";
import TransitionLayout from "../../../Layouts/Transition";
// import InsertModal from "../../elements/forms/project/modal/insert";
import ListNotifications from "../../../elements/display/notifications";
import PageTitle from "../../../elements/layout/PageTitle_B";

import NotificationDrawer from "../../../elements/display/drawers/notificationDrawer";
// import fn from '../../../../../../../UNIT/client/src/utils/fn/fn'
import AccountContext, {
    AccountConsumer
} from "../../../../utils/context/AccountContext.js";
import Loading from "../../../elements/Loading.js";
// import notificationTypes
// import { notificationTypes } from "./types";

export default class UnreadMessages extends React.Component {
    constructor(props) {
        super(props);
        // console.log('PROPS', props)
        this.state = {
            ready: false,
            unreadMessages: [],
            allUnread: [],
            activeNotification: null,
            showButtons: true,
            filter: false
        };

        this.fetchNotifications = this.fetchNotifications.bind(this);
        this.goToMessage = this.goToMessage.bind(this)
        // this.refresh = this.refresh.bind(this);
        // this.showDrawer = this.showDrawer.bind(this);
        // this.handleOk = this.handleOk.bind(this);
        // this.hideDrawer = this.hideDrawer.bind(this);
        // this.filter = this.filter.bind(this);
    }
    goToMessage = async(item) => {
        app.set('activeConversation', item.conversation)

        console.log('** set active conv', item, app.get('activeConversation'))
        this.props.history.push('/messages')
    }
    // filter(type) {
    //     let type_ = type === "new" ? false : true;

    //     this.setState({
    //         filter: type_
    //     });
    // }

    async fetchNotifications() {
        const userId = Fn.get("account").user.id;
        await app.fetchUnreadMessages({ userId: userId, self: this }).then(response => {
            
            let unread = []
            
            for(let item of response){
                for(let message of [...item.messages]){
                    // console.log(' all unread message ', message)
                    unread.push(message)   
                }
            }
            
            this.setState({
                unreadMessages: response,
                allUnread: unread,
                ready: true
            })

        })
    }

    // setReady() {
    //     this.setState({ ready: true });
    // }

    // async refresh() {
    //     this.setState({
    //         ready: false
    //     });
    //     setTimeout(async () => {
    //         return await this.fetchNotifications();
    //     }, 1000);

    //     // this.fetchCollection()
    // }
    // async showDrawer(data) {
    //     const { notification } = data;
    //     console.log("show drawer ", notification);
    //     this.setState({
    //         drawerReady: true,
    //         docInfoVisible: true,
    //         activeNotification: notification
    //     });

    //     // let notification =
    //     notification.read = true;
    //     await app.updateNotification({ self: this, notification });

    //     // setGlobal({ activeConversation: conversation, activeChef: chef })
    // }

    // hideDrawer(doc) {
    //     this.setState({
    //         drawerReady: false,
    //         docInfoVisible: false
    //     });
    // }
    // showModal = () => {
    //     this.setState({
    //         insertModalVisible: true
    //     });
    // };
    // handleOk = e => {
    //     // console.log(e);
    //     this.setState({
    //         insertModalVisible: false
    //     });
    // };
    // handleCancel = e => {
    //     // console.log(e);
    //     this.setState({
    //         insertModalVisible: false
    //     });
    // };
    componentWillUnmount() { }
    async componentDidMount() {
        this.fetchNotifications();
    }
    render() {
        const selfUserId = Fn.get('account').user.id;
        return (
            <AccountContext.Consumer>
                {props => (
                    <TransitionLayout>
                        {!this.state.ready && !this.props.dashboard && <Loading />}

                        <section
                            id="Notifications"
                            className={
                                (this.props.padding !== false ? " pa4 " : "  ") +
                                " w-100 mw9 center mt3 "
                            }
                        >
                            {/* <div onClick={this.refresh} className="absolute top-0 right-0 pa4">
            <Icon type="sync" />
          </div> */}

                            <PageTitle
                                title={"New Messages"}
                                ready={this.state.ready}
                                // theme={props.theme}
                                // showInsertForm={this.showModal}
                                docs={this.state.allUnread}
                            // activeDoc={this.state.activeProject}
                            // updateActiveDoc={this.updateActiveDoc}
                            // showButton={false}
                            />

                            {/* {this.state.showButtons && (
                <div className={" flex flex-row "}>
                  <div className="flex flex-row">
                    <div
                      onClick={() => this.filter("new")}
                      className={
                        (this.state.filter ? " fw5 " : " fw6 ") +
                        " pointer flex flex-column pv2 f5 black-30 mr2 "
                      }
                    >
                      New
                    </div>
                    <div
                      onClick={() => this.filter("read")}
                      className={
                        (this.state.filter ? " fw6 " : " fw5 ") +
                        " pointer flex flex-column pv2 f5 black-30 mr2 "
                      }
                    >
                      Read
                    </div>
                  </div>
                </div>
              )} */}

                            <div className="h2"></div>

                            {/* {this.state.ready && !this.state.filter && this.state.notifications.filter(
                      a => a.read === false
                    ).length === 0 && (
                <div
                  className="flex flex-row ph0 pb3 items-center justify-start"
                  id=""
                >
                  <span className="f6 fw5 black-50 pv2 ph3 ba b--black-05">
                    No new notifications
                  </span>
                </div>
              )} */}


                            {this.state.ready &&
                                this.state.unreadMessages.length > 0 &&
                                this.state.unreadMessages.map((item, index) => (
                                    <div
                                        onClick={() => this.goToMessage(item)}
                                        className={("br2 bs-b List_A_item cursor-pointer sans-serif flex flex-row flex-auto w-100 items-center justify-start pa0 mb2- relative overflow-hidden mb3")}
                                    >
                                        {/* <div
                        className="avatar flex flex-column bg-cover bg-center br2"
                    /> */}
                                        <div className="flex flex-row w-100 bg-white  ">
                                            <div className="flex flex-column w-100">
                                                <div className={("flex flex-column mr2 f4 fw6 pb2 ph4 pt3 ")}>
                                                    {item.conversation.authors.filter(a => a.id !== selfUserId)[0].profile.name.first}
                                                </div>
                                                <div className="flex flex-row mr2 f5 fw5 black-50 pb3 ph4">
                                                    <span className="flex flex-row ph2 pv2 br2 bg-near-white black-50 f5 fw5 mr2">{" + " + item.messages.size}</span>
                                                    <span className="flex flex-row ph2 pv2 br2 bg-white black-50 f5 fw5 mr2">{[...item.messages][item.messages.size - 1].text}</span>



                                                </div>

                                                {/* <div
                            className={
                                ("flex flex-row flex-auto fw3 f6 black-30 pt3 pb3 pr3 w-60 justify-end")}>
                                <span className="fw4 ml1 mr3 black-30">{moment(this.props.notification.createdAt).format('h:mm A')}</span> <span className="fw4 ml1 mr3- black-30">{moment(this.props.notification.createdAt).format('D MMMM YYYY')}</span>
                            </div> */}

                                            </div>
                                        </div>

                                    </div>
                                ))


                            }
                            {!this.state.ready && (
                                <div className="trans-a">
                                    <Skeleton active />
                                    <Skeleton active />
                                </div>
                            )
                            }

                            {this.state.ready ? (
                                <NotificationDrawer
                                    type={"info"}
                                    notification={this.state.notification}
                                    doc={this.state.activeNotification}
                                    // chef={this.state.activeChef}/
                                    // updateDoc={this.updateDoc}
                                    visible={this.state.docInfoVisible}
                                    hideDrawer={this.hideDrawer}
                                    className="NotificationDetail"
                                    close={this.hideDrawer}
                                    refresh={this.refresh}

                                // theme={/Fn.get('theme').config.theme}
                                // reserve={this.reserve}
                                // sendMessage={this.sendMessage}
                                // conversationReady={this.state.drawerReady}
                                />
                            ) : null}

                            {!this.props.dashboard && (
                                <div
                                    onClick={this.refresh}
                                    className={
                                        (Fn.get("isMobile") ? " top-6vh " : "  ") +
                                        " absolute top-0 right-0 pa4 pointer black-20- hover-black-40 flex flex-row items-center z-9 "
                                    }
                                >
                                    <span className="mr2 f5 fw4 black-30">
                                        {this.state.ready ? "reload" : "loading"}
                                    </span>{" "}
                                    {this.state.ready ? (
                                        <Icon icon="refresh" iconSize={15} className="black-40" />
                                    ) : (
                                            <Spinner size={15} className="black-40" />
                                        )}
                                </div>
                            )}
                        </section>
                    </TransitionLayout>
                )}
            </AccountContext.Consumer>
        );
    }
}

// export default Notifications;
