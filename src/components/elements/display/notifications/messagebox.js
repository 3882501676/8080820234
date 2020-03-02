import React, { Component, getGlobal, setGlobal, useGlobal } from "reactn";

import { Link } from "react-router-dom";
import { Drawer, Button, Radio, Rate } from "antd";
import { Tabs, Icon } from "antd";
// import EditProject from "../forms/project/edit";
// import AddAssets from "../media/list/Assets";

// const { TabPane } = Tabs;
// const RadioGroup = Radio.Group;

class MessageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      doc: this.props.doc,
      visible: this.props.visible,
      
      placement: "right",
      test: this.props.visible,
      activeTab: "1",
      characters: []
    };

    console.log('Messagebox',props)

    this.showWidget = this.showWidget.bind(this);
    this.checkUploadResult = this.checkUploadResult.bind(this);
    this.avatar = this.avatar.bind(this);
    this.goToTab1 = this.goToTab1.bind(this);
    this.tabOnChange = this.tabOnChange.bind(this);
    this.submitMessage = this.submitMessage.bind(this);

    this.messageText = React.createRef()

  }

  submitMessage(e) {
    e.preventDefault();
    let text = this.messageText.current.value;
    let message = {
      author: JSON.parse(localStorage.getItem('account')).user.sub,
      text: text
    }
    // let messages = JSON.parse(localStorage.getItem('messages'));
    let doc = this.props.doc;
    // let a = messages.messages;
    console.log('Doc',doc)
    doc.messages.push(message);
    console.log('submitMessage doc',doc)
    this.props.postCollection(doc)
    
    setTimeout(() => {
      let a = document.querySelector('.ant-drawer-wrapper-body')
      a.scrollTop = a.scrollHeight;
    },1000)

    // messages.messages = a;
    // localStorage.setItem('messages',JSON.stringify(messages));

    // let doc = this.props.doc;
    // doc.messages = messages;
    // this.setState({
    //   doc: doc
    // })
  }
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
    console.log(e);
    this.setState({
      activeTab: e
    });
  }
  goToTab1() {
    this.setState({ activeTab: "1" });
  }
  avatar() {
    console.log('avatar doc',this.props)
    let avatar =
      typeof this.props.doc.recipient !== "undefined"
        ? this.props.doc.recipient.avatar
        : "http://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914";
    return avatar;
  }
  avatarAuthor(id) {
    const chefs = JSON.parse(localStorage.getItem('chefs'));
    console.log('author',id,this.props.doc.recipient._id)

    if(id === this.props.doc.recipient._id) {
      // user is chef
      let recipient = chefs.find(o => o._id === this.props.doc.recipient._id);
      // item.recipient = recipient;
      // messages.push(item)
      console.log('recipient',recipient);
      return recipient.avatar
    }
    else {
      // user is user
      const picture = JSON.parse(localStorage.getItem('account')).user.picture
      return picture 
    }    
  }
  componentDidMount() {
    this.setState({ready: true, doc: this.props.doc});      
    // setTimeout(() => {
    //   let a = document.querySelector('.ant-drawer-wrapper-body')
    //   a.scrollTop = a.scrollHeight;
    // },1000)
         
  }
  componentDidUpdate() {    
    // setTimeout(() => {
    //   var a = document.querySelector('.ant-drawer-wrapper-body')
    //   a.scrollTop = a.scrollHeight;
    // },300)
  }
  showWidget(widget) {
    window.widget.open();
  }
  checkUploadResult(resultEvent) {
    if (resultEvent.event === "success") {
    }
  }
  render() {
    let widget;
    if (typeof window.cloudinary !== "undefined") {
      widget = window.cloudinary.createUploadWidget(
        {
          cloudName: "doy0ozmqb",
          uploadPreset: "kmegjnr9"
          // uploadPreset: "hj2fahfn"
        },
        (err, res) => {
          // console.log(res, err);
          if (res.event === "success") {
            let _ = res.info;
            console.log("############", res);
            let format = _.format;
            let projectDetail = this.props.doc;
            let audio_url = _.is_audio ? _.secure_url : projectDetail.audio;
            let avatar = _.is_audio ? projectDetail.avatar : _.secure_url;
            let media_ = [];
            media_.push(_);
            media_.push(projectDetail.media);
            // let audio

            // let imageUrl = _.is_audio ? projectDetail.avatar : null;
            // let info = _.info;

            projectDetail.media = media_
            projectDetail.avatar = avatar
            projectDetail.avatar_large = avatar
            projectDetail.is_audio = _.is_audio

            window.audio = projectDetail.audio
            // console.log(projectDetail.audio)

            if (projectDetail.is_audio) {
              projectDetail.audio.push(_.secure_url)
            }

            console.log("Project ", projectDetail)
            this.setState({
              item: projectDetail
            })
            this.props.updateProject(projectDetail)
          }
        }
      );
    }
    window.widget = widget;
    return (
      <div>
        <Drawer
          title={"Message Box"}
          placement={"right"}
          closable={true}
          onClose={this.props.hideDrawer}
          width={500}
          visible={this.props.visible}
          doc={this.props.doc}
          className="MessageBox"
        > 
        
          { this.props.doc && this.state.ready ?
          <>
            <div className="flex flex-auto flex-column relative">
              <div
                className=" relative flex flex-auto flex-column w-100 bg-center bg-cover items-start justify-end pa3 relative overflow-hidden bb b--black-05"
              >
                <div
                  className={
                    (this.props.theme.main === "dark" ? " " : " ")
                    + ("List_A_item cursor-pointer sans-serif flex flex-row flex-auto w-100  items-center justify-start pa0 mb4- br2 overflow-hidden relative ")}
                >
                  <div
                    style={{ backgroundImage: `url(` + this.avatar(this.props.doc.recipient && this.props.doc.recipient) + `)` }}
                    className="avatar flex flex-column bg-cover bg-center br2"
                  />                 <div className="flex flex-column pa3 w-100">
                    <div className="flex flex-row w-100">
                      <div className={
                        (this.props.theme.main === "dark" ? " white " : " black-70 ")
                        + ("flex flex-column mr2 f5 fw6 ")}>
                        {this.props.doc && this.props.doc.recipient && this.props.doc.recipient.name.first}
                      </div>
                      <div className={
                        (this.props.theme.main === "dark" ? " white-50 " : " black-50 ")
                        + ("flex flex-column flex-auto fw4 f5 black-50 ")}>
                        {this.props.doc && this.props.doc.recipient && this.props.doc.recipient.name.last}
                      </div>
                    </div>
                  </div></div>
              </div>
            </div>
            <div
            className=" relative flex flex-auto flex-column w-100 bg-center bg-cover items-start justify-end pa4 relative overflow-hidden mb5"
          >
            { this.props.doc.messages.map((item,index) => (
                    <div className={ ( this.props.doc && this.props.doc.recipient._id !== item.author ? "row-reverse justify-end" : " justify-start " ) + ( " items-start flex flex-row w-100 pb3" ) }>
                      <div
                    style={{ backgroundImage: `url(` + this.avatarAuthor(item.author) + `)` }}
                    className="avatar-s flex flex-column bg-cover bg-center br2"
                  />                 <div className={ ( this.props.doc && this.props.doc.recipient._id !== item.author ? "tr" : " tl" ) + ( " flex flex-column ph3 w-100" ) }>
                    {item.text}
                  </div>
                      
                    </div>
            ))}
            </div>
            </>
            : null}

            <div className="absolute bottom-0 w-100 bt b--black-05">
              <form onSubmit={this.submitMessage} className="flex flex-row w-100">
              <div className="flex flex-column w-80">
                <input ref={this.messageText} className="bn pa3 f4 fw5 black-60" type="text"></input>
              </div>
              <div className="flex flex-column w-20 bl b--black-05">

                <button type={'submit'} className="flex h-100 items-center justify-center f4 bg-black-10 bn"><Icon type="arrow-right" /></button>
              </div>
              </form>
            </div>


        </Drawer>
      </div>
    );
  }
}

export default MessageBox;
