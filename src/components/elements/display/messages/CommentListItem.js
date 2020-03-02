import React from 'react'
import Fn from '../../../../utils/fn/Fn.js'
import moment from 'moment';
import Linkify from 'react-linkify';
import { InView } from 'react-intersection-observer'

var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;

class CommentListItem extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            author: {},
            picture: null,
            ready: false
        }

        this.authorData = this.authorData.bind(this)
        this.author = this.author.bind(this)
        this.isSameAuthorAsPreviousComment = this.isSameAuthorAsPreviousComment.bind(this)
        this.isMe = this.isMe.bind(this)
        this.messageIsSameDayAsPrevious = this.messageIsSameDayAsPrevious.bind(this)
        this.authorData = this.authorData.bind(this)
        this.checkForUrls = this.checkForUrls.bind(this)

        // this.fetchAuthor = this.fetchAuthor.bind(this)
    }

    // async fetchAuthor() {

    //     let authorId = this.props.item.author;

    //     console.log('fetch author', authorId)

    //     await Fn.fetchAuthor({ self: this, authorId: authorId })

    // }
    checkForUrls(text) {
        function urlify(text) {
            var urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.replace(urlRegex, function (url) {
                return '<a href="' + url + '">' + url + '</a>';
            })
            // or alternatively
            // return text.replace(urlRegex, '<a href="$1">$1</a>')
        }
        // var text = "Find me at http://www.example.com and also at http://stackoverflow.com";
        var html = urlify(text);
        return html
    }

    avatar(user) {
        // let profile = this.props.item.authorData.profile;
        // let profile = this.state.author.profile;
        // console.log('authors', this.props.authors)
        // console.log('author', this.props.item.author)

        // let user = this.props.authors.filter(a => a.id === this.props.item.author)[0]

        if (user && user.profile && user.profile.picture) {
            return user.profile.picture
        }
        else {
            return 'https://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914'
        }
    }

    authorData() {

        // console.log('CommentListItem props authordata ',this.props)
        let authors = this.props.authors;
        let authorId = this.props.item.author;
        let author = authors.filter(a => a.id === authorId)[0];
        let picture = author && author.profile.picture;
        // console.log(' ')
        // console.log(' ')
        // console.log('authorData', authors.filter(a => a.id === authorId))
        // console.log(' ')
        // console.log(' ')

        this.setState({ author: author, picture: picture })

        setTimeout(() => {

            this.setState({ ready: true })

        }, 300)

    }

    author(id) {

        // console.log('this.author() author data', this.props.authors.filter(a => a.id === id)[0])
        return this.props.authors.filter(a => a.id === id)[0]

    }
    isMe() {
        return this.props.item.author === this.props.me
    }
    isSameAuthorAsPreviousComment() {

        let item = this.props.item;
        let author = item.author;
        let index = this.props.index;

        let previous = (index - 1);

        if (index > 0) {

            // console.log('comment index check', index, 'previous', previous, 'items', this.props.items, 'items[previous]', this.props.items[previous])

            let previousCommentAuthor = previous > 0 ? this.props.items[previous].author : this.props.items[0].author;

            return author === previousCommentAuthor
        }
        else {

            return false

        }

    }
    messageIsSameDayAsPrevious() {

        let item = this.props.item;
        let items = this.props.items;
        let index = this.props.index;

        let current = this.props.index;
        let previous = (index - 1);

        let createdAt = item.createdAt;

        if (index > 0) {

            // console.log('items', items)
            // console.log('index', index)
            // console.log('previous', previous)
            // console.log('createdAt', createdAt)
            // console.log('items[previous]', items[previous])

            let previousCreatedAt = items[previous].createdAt;

            return moment(createdAt).isSame(previousCreatedAt, 'day')
        }

    }
    componentDidMount() {

        // console.log(' ')
        // console.log(' ')
        // console.log('commentListItem', this.props)
        // console.log(' ')
        // console.log(' ')

        this.authorData()
        // this.fetchAuthor()
    }

    render() {
        return (
            this.state.ready &&
            <>
                {
                    !this.messageIsSameDayAsPrevious() &&
                    <div className="flex flex-column f7 fw5 black-20 pb4 pt3 w-100 tc">
                        {
                            moment(this.props.item.createdAt).format('ddd DD MMMM')
                        }
                    </div>
                }

                <InView as="div" onChange={(inView, entry) => !this.props.item.seen.includes(this.props.me) && this.props.markAsSeen(this.props.item)}>


                    <div
                        // ref={(node) => {this[(this.props.id.toString())] = node}}
                        id={this.props.item.id}
                        className={
                            (this.isMe() ? "justify-end" : "justify-start")
                            + (!this.isSameAuthorAsPreviousComment() ? " ph3 pb3 pt5 " : " ph3 pb3 shrink ")
                            + (" flex flex-row ")}>

                        {!this.isSameAuthorAsPreviousComment() && !this.isMe() &&
                            <div
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    background:
                                    this.props.authors.filter( a => a.id === this.props.item.author)[0].profile.picture.length && this.props.authors.filter( a => a.id === this.props.item.author)[0].profile.picture
                                            ? "url(" + this.state.picture + ")"
                                            : GeoPattern.generate(this.props.authors.filter( a => a.id === this.props.item.author)[0].profile.name.first + this.props.authors.filter( a => a.id === this.props.item.author)[0].profile.name.last).toDataUrl()
                                }}
                                className="adjust-top flex flex-column bg-cover bg-center round mr2" />
                        }

                        <div className="flex flex-column">

                            {!this.isSameAuthorAsPreviousComment() &&
                                <span className={
                                    (this.isMe()
                                        ? " tr " : " tl ")
                                    + (" flex flex-column f7 fw4 black-20 adjust-top pb1 ")}>

                                    {moment(this.props.item.createdAt).format('HH:mm A')}

                                </span>
                            }
                            <div
                                key={this.props.item.createdAt}
                                ref={this.props.ref}
                                style={this.props.style}
                                className={(this.isMe()
                                    ? "row-reverse justify-end message-list-item "
                                    : " message-list-item justify-start ")
                                    + (" items-start- flex flex-row  ph3 pv2 br4 bg-light-blue mw7")}
                            >

                                <div className={(this.isMe() ? "tr" : " tl") + (" flex flex-column  w-100 f5 fw5 black-70 word-break-word")}>

                                    {/* {this.checkForUrls(this.props.item.text)} */}
                                    <Linkify>{this.props.item.text}</Linkify>

                                    <span className="f6 fw5 black-50">
                                        {this.props.item.author === this.props.me ? (!this.isSameAuthorAsPreviousComment() && "me") : this.props.authors.filter( a => a.id === this.props.item.author)[0].profile.name.first + " " + this.props.authors.filter( a => a.id === this.props.item.author)[0].profile.name.last} {" "}
                                    </span>

                                </div>

                            </div>

                        </div>

                        {
                            this.isMe() && (

                                (
                                    !this.isSameAuthorAsPreviousComment() || !this.messageIsSameDayAsPrevious())
                                    ? <div
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background:
                                        this.props.authors.filter( a => a.id === this.props.item.author)[0].profile.picture.length && this.props.authors.filter( a => a.id === this.props.item.author)[0].profile.picture
                                                ? "url(" + this.state.picture + ")"
                                                : GeoPattern.generate(this.props.authors.filter( a => a.id === this.props.item.author)[0].profile.name.first + this.props.authors.filter( a => a.id === this.props.item.author)[0].profile.name.last).toDataUrl()
                                    }}
                                        className="adjust-top flex flex-column bg-cover bg-center round ml2" />
                                    : <></>
                            )

                        }

                    </div>

                </InView>
            </>
        )
    }
}
export default CommentListItem