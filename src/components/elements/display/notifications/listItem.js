import React, { getGlobal } from 'reactn';
// import methods from "../../../../utils/methods";
import moment from 'moment';
class ListItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ready: true,
            doc: {},
            // chef: this.props.conversation.recipinet
        }
        console.log('listItem props', props)
        // this.avatar = this.avatar.bind(this);
        // this.toggle = this.toggle.bind(this);
        // this.getRecipientDetail = this.getRecipientDetail.bind(this)
    }
    avatar(user) {
        console.log('avatar', user)
        return user.hasOwnProperty('picture') ? user.picture : "http://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914";

    }
    async getRecipientDetail(doc) {
        // console.log('listItem.js getRecipientDetail',doc)
        // let participants = doc.participants;
        // let userID = getGlobal().account.sub;
        // let index = participants.indexOf(userID);
        // let p = [...participants];
        // p.splice(index,1);
        // let recipientID = p[0];

        // await window.db.users.find({sub: recipientID}, (err,res) => {
        //     if(err) {console.error(err)}
        //     console.log('recipient doc',res)
        //     this.setState({ chef: res[0], ready: true })
        // })   
    }
    componentDidMount() {
        // this.getRecipientDetail(this.props.conversation);
        console.log('[[ conv item ]]', this.props)
    }
    render() {
        return (
            this.state.ready ?
                <div
                    onClick={() => this.props.showDrawer({ notification: this.props.notification })}
                    className={("br2 bs-b List_A_item cursor-pointer sans-serif flex flex-row flex-auto w-100 items-center justify-start pa0 mb2- relative overflow-hidden ")}
                >
                    {/* <div
                        className="avatar flex flex-column bg-cover bg-center br2"
                    /> */}
                    <div className="flex flex-row w-100 bg-white  ">
                        <div className="flex flex-column w-100">
                            <div className={("flex flex-column mr2 f4 fw6 pb2 ph4 pt3 ")}>
                                {this.props.notification.title}
                            </div>
                            <div className="flex flex-column mr2 f5 fw5 black-50 pb3 ph4">{this.props.notification.content}</div>
                  
                            
                        </div>

                        <div
                            className={
                                ("flex flex-row flex-auto fw3 f6 black-30 pt3 pb3 pr3 w-60 justify-end")}>
                                <span className="fw4 ml1 mr3 black-30">{moment(this.props.notification.createdAt).format('h:mm A')}</span> <span className="fw4 ml1 mr3- black-30">{moment(this.props.notification.createdAt).format('D MMMM YYYY')}</span>
                            </div>

                    </div>
                    </div>
                : null
        )
    }
}
export default ListItem