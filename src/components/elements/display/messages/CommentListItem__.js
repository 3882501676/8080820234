import React from 'react'
import Fn from '../../../../utils/fn/Fn.js'
import moment from 'moment'

class CommentListItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // author: {},
            recipient: props.recipientData,
            author: props.authorData,
            ready: true,
            // selfUser: Fn.get('account').user
        }

        this.fetchAuthor = this.fetchAuthor.bind(this)
        this.log = this.log.bind(this)
        this.avatar = this.avatar.bind(this)
        this.authorName = this.authorName.bind(this)
    }
    authorName() {

        // let authorId = this.props.item.author;
        if (this.props.item.author === this.props.authorData.id) {
            return this.props.authorData.profile.name.first + " " + this.props.authorData.profile.name.last
        }
        if (this.props.item.author === this.props.recipientData.id) {
            return this.props.recipientData.profile.name.first + " " + this.props.recipientData.profile.name.last
        }

    }
    avatar() {
        let authorId = this.props.item.author;
        if (this.props.item.author === this.props.authorData.id) {
          
            if(this.props.authorData.profile.picture.length > 0) {
                return this.props.authorData.profile.picture
            }

            else {
                return 'https://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914'
            }
            
        }
        if (this.props.item.author === this.props.recipientData.id) {
         
            if(this.props.recipientData.profile.picture.length > 0) {
                return this.props.recipientData.profile.picture
            }

            else {
                return 'https://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914'
            }
            
        }
        // this.state.author.profile.picture
    }
    log() {
        console.log({ item: this.props.item, author: this.state.author })
    }
    async fetchAuthor() {

        // let authorId = this.props.item.author;

        // console.log('fetch author', authorId)

        // await Fn.fetchAuthor({ self: this, authorId: authorId })
        // let apiUrl = "https://api.crew20.devcolab.site/v1/users/" + this.props.item.author;


        // return await fetch(apiUrl).then(res => {

        //     return res.json()

        // }).then(res => {

        //     console.log('[[ Author data ]]', res)

        //     this.setState({
        //         author: res,
        //         ready: true
        //     })



        // })


    }
    componentDidMount() {

        // this.fetchAuthor()
    }
    render() {
        const now = moment(new Date().getTime())
        return (

            <div
                onClick={() => this.log()}
                style={{ width: 'auto' }}
                className={(this.props.item.author === this.props.authorData.id ? "justify-end" : "justify-start") + (" flex flex-row w-100 pa4 pointer ")}>
                {this.props.item.author === this.props.recipientData.id &&
                    <div style={{ width: '50px', height: '50px', borderRadius: '100px', backgroundImage: 'url("' + this.avatar() + '")' }}
                        className=" mr2 flex flex-column bg-cover bg-center br2" />
                }

                <div
                    key={this.props.item.createdAt}
                    ref={this.props.ref}
                    // style={this.props.style}
                    style={{ width: 'auto' }}
                    className={(this.props.item.author === this.props.authorData.id ? "row-reverse justify-end message-list-item " : " message-list-item justify-start ") + (" items-start- flex flex-column w-100 pa3 br3 bg-black-05")}
                >

                    <div
                        style={{ whiteSpace: 'normal', overflowWrap: 'break-word' }}
                        className={(this.props.item.author === this.props.authorData.id ? "tr" : " tl") + (" flex flex-column ph0 w-100 f5 fw5 black-70 mw6")}>
                        {this.props.item.text}

                        <div className={ ( this.props.item.author === this.props.authorData.id ? " justify-end " : " justify-start " ) + ( "flex flex-row pt2" ) } >
                            <span className="f7 fw5 black-50">{this.authorName()}</span>
                            <span className="f7 fw4 black-30 ml2">{moment(this.props.item.createdAt).from(now)}</span>
                        </div>
                    </div>

                  

                </div>
                {this.props.item.author === this.props.authorData.id &&
                    <div style={{ width: '50px', height: '50px', borderRadius: '100px', backgroundImage: 'url("' + this.avatar() + '")' }}
                        className=" ml2 flex flex-column bg-cover bg-center br2" />
                }
            </div>
        )
    }
}
export default CommentListItem