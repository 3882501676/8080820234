// @flow
import React, { Component } from "react";
import Fn from "../../../../utils/fn/Fn";
// import PropTypes from 'prop-types';
var GeoPattern = require("geopattern");
window.GeoPattern = GeoPattern;

class ConversationItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      ready: true,
      // data: {},
      // recipientData: {},
      recipientId: this.props.item.participants.filter(a => a.id !== this.props.selfUserId)[0],
      conversation: null,
      author: this.props.item.authors.filter(a => a.id !== this.props.item.participants.filter(a => a.id !== this.props.selfUserId)[0])[0],
      authors: this.props.item.authors,
      picture: this.props.item.authors.filter(a => a.id !== this.props.item.participants.filter(a => a.id !== this.props.selfUserId)[0])[0].profile.picture,
      multi: false
    };

    // this.recipientData = this.recipientData.bind(this);
    // this.isActive = this.isActive.bind(this);

    // this.fetchRecipientData = this.fetchRecipientData.bind(this)
  }

  // async recipientData() {

  //   const multi = this.state.multi;

  //   if (multi) {
      
  //     let recipientId = this.props.item.participants.filter(a => a.id !== this.props.selfUserId)[0]
      
  //     let authors = this.props.item.authors;

  //     let author = this.props.item.authors.filter(a => a.id === recipientId)[0];

  //     let picture = author && author.profile.picture;

  //     if (author) {
  //       this.setState({ author: author, picture: picture, ready: true });
  //     }
  //   }
  //   if (!multi) {

  //     let recipientId = this.props.item.participants.filter(a => a.id !== this.props.selfUserId)[0]
      
  //     let authors = this.props.item.authors;

  //     let author = this.props.item.authors.filter(a => a.id === recipientId)[0];

  //     let picture = author && author.profile.picture;

  //     if (author) {
  //       this.setState({ author: author, picture: picture, ready: true });
  //     }
  //   }
  // }
  componentDidUpdate() {
    // console.log(' ')
    // console.log(' ')
    // console.log('ConversationItem updated', this.props)
    // console.log(' ')
    // console.log(' ')
  }

  // isActive() {
  //   console.log(" ");
  //   // console.log(' ')
  //   // console.log('isActive', this.props, this.props.conversation.id, this.props.item.id, this.props.conversation.id === this.props.item.id)
  //   // console.log(' ')
  //   // console.log(' ')

  //   return this.props.conversation.id === this.props.activeConversation.id;
  // }
  componentDidMount = () => {
    // console.log("ConversationItem mounted", this.props);
    // console.log(
    //   "Participants > 2",
    //   this.props.item.participants.length > 2 && this.props.item.participants
    // );
    // if (this.props.item.participants.length > 2) {
    //   this.setState({
    //     multi: true
    //   });
    //   // console.log(' ')
    //   // console.log(' ')
    //   // console.log('conv data', this.props.item)
    //   // console.log(' ')
    //   // console.log(' ')
    // }

    // this.recipientData();

    // this.fetchRecipientData(this.props.item)
  };

  render() {
    // const { multi } = this.state;

    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      this.state.ready && (
        <div
          onClick={() =>
            this.props.selectConversation({
              conversation: this.props.item,
              // activeConversation: this.props.item
            })
          }
          id={this.props.item.id}
          className={
            ( this.props.conversation.id === this.props.activeConversation.id ? " bg-light-blue " : " bg-white ") +
            " pointer conversation-item flex flex-column w-100"
          }
        >

          {!this.props.item.group && (
            <div
              className={
                ( this.props.conversation.id === this.props.activeConversation.id ? "  " : " bb b--black-05 ") +
                " flex flex-row items-center pv3 ph4 "
              }
            >
              <div className="conversation-recipient-avatar flex flex-row">
                <div className=" pointer flex flex-column pv2 pr3 items-center justify-center">
                  <div
                    className="cover bg-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "100px",
                      boxShadow: "0 0px 0px 6px #ffffff9e",
                      background:
                      this.state.picture.length
                      ? "url('" +  this.state.picture + "')"
                      : GeoPattern.generate( ( this.state.author && this.state.author.profile && this.state.author.profile.name.first ) + ( this.state.author && this.state.author.profile && this.state.author.profile.name.last )).toDataUrl()
                    }}
                  />
                </div>
              </div>

              <div className=" flex flex-column items-start justify-center">
                <div className=" raleway -raleway flex flex-row  fw6">
                  <div className=" flex f5 fw5- black-70 ">
                    { this.state.author && this.state.author.profile && this.state.author.profile.name.first}
                  </div>
                  <div className=" flex f5 fw5- ml1 black-70">
                    { this.state.author && this.state.author.profile && this.state.author.profile.name.last}
                  </div>
                </div>

                <div className=" flex flex-row pt1">
                  <div className=" raleway flex f6 fw5 black-20 ">
                    { this.state.author && this.state.author.profile && this.state.author.profile && this.state.author.profile.additional.role}
                  </div>
                </div>
              </div>

              <div className=" flex flex-row w-100"></div>
            </div>
          )}

          {this.props.item.group && (
            <div
              className={
                (this.isActive() ? "  " : " bb b--black-05 ") +
                " flex flex-row items-center pv3 ph4 "
              }
            >
              <div className="conversation-recipient-avatar flex flex-row justify-between w-100">
                <div className=" pointer flex flex-row pv2 pr3 items-center justify-start">

                <div
                        className="cover bg-center mh2- "
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "100px",
                          boxShadow: "0 0px 0px 6px #ffffff9e",
                          background:
                          GeoPattern.generate( this.props.item.name ).toDataUrl()
                        }}
                      />
                      
                </div>
                <div className=" flex flex-column w-100 items-start justify-center">
                <div className=" raleway -raleway flex flex-row  fw6">
                  <div className=" flex f5 fw5- black-70 ">
                    { this.props.item.name }
                  </div>
                 
                </div>
                </div>

                <div className="flex w-40 flex-row items-center">
                  {this.props.item.authors && this.props.item.authors.length && this.props.item.authors
                    .filter(a => a.id !== this.props.item.author)
                    .map((item, index) => (
                      <div
                        className="cover bg-center mh2"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "100px",
                          backgroundImage:
                            'url("' + item.profile.picture + '")',
                          boxShadow: "0 0px 0px 6px #ffffff9e"
                        }}
                      />
                    ))}
                    </div>

              </div>
            </div>
          )}
        </div>
      )
    );
  }
}

export default ConversationItem;
