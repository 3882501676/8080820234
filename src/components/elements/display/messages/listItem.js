import React, { getGlobal } from 'reactn';
// import methods from "../../../../utils/methods";

class ListItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ready: true,
            doc: {},
            chef: this.props.conversation.recipinet
        }
        console.log('listItem props', props)
        this.avatar = this.avatar.bind(this);
        // this.toggle = this.toggle.bind(this);
        this.getRecipientDetail = this.getRecipientDetail.bind(this)
    }
    avatar(user) {

        console.log('avatar', user)

        return user.hasOwnProperty('picture')
            ? user.picture
            : "http://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914";

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
    componentWillMount() {
        console.log('[[ conv item ]]', this.props)
    }
    componentDidMount() {
        // this.getRecipientDetail(this.props.conversation);

    }
    render() {
        return (
            this.state.ready ?
                <div
                    onClick={() => this.props.showDrawer({ conversation: this.props.conversation, chef: this.state.chef })}
                    className={
                        (this.props.activeConversation._id === this.props.conversation._id ? "active " : "")
                        + (Fn.get('theme').config.theme.main === "dark" ? " dark " : " light ")
                        + ("List_A_item cursor-pointer sans-serif flex flex-row flex-auto w-100 items-center justify-start pa0 mb2 br2 relative ")}
                >
                    <div
                        style={{ backgroundImage: `url(` + this.avatar(this.props.conversation.recipient) + `)`, boxShadow: this.props.activeConversation._id === this.props.conversation._id ? ("0px 0px 0px 4px " + Fn.get('theme').config.theme.colorScheme.color) : "0px 0px 0px 0px #646464" }}
                        className="avatar flex flex-column bg-cover bg-center br2"
                    />
                    <div className="flex flex-column pa3 w-100">
                        <div className="flex flex-row w-100">
                            <div className={
                                (Fn.get('theme').config.theme.main === "dark" ? " white " : " black-70 ")
                                + ("flex flex-column mr2 f5 fw6 ")}>
                                {this.props.conversation.recipient.given_name}
                            </div>
                            <div className={
                                (Fn.get('theme').config.theme.main === "dark" ? " white-50 " : " black-50 ")
                                + ("flex flex-column flex-auto fw4 f5 black-50 ")}>
                                {this.props.conversation.recipient.family_name}
                            </div>
                        </div>

                    </div>
                </div>
                : null
        )
    }
}
export default ListItem