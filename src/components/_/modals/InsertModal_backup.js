import React, { Component } from "react";
import { Modal, Button } from "antd";
import { Carousel } from "antd";
import InsertProject from "../forms/InsertProject";
import { Drawer, Radio } from 'antd';
import {
    Form,
    Input,
    Tooltip,
    Icon,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    AutoComplete,
} from 'antd';
// import


class InsertModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.active,
      activeStep: 0,
      showPrev: false
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.carousel = React.createRef();
    this.showPrev = this.showPrev.bind(this);
    this.hidePrev = this.hidePrev.bind(this);
    this.submit = this.submit.bind(this);

    this.ProjectName = React.createRef();
    this.ProjectDescription = React.createRef();
    this.ProjectName2 = React.createRef();
    this.ProjectName3 = React.createRef();
  }
  // Wrapped;
  next() {
    this.carousel.next();
  }
  previous() {
    this.carousel.prev();
  }
  showPrev = () => {
    console.log("showPrev");
    this.setState({ showPrev: true });
  };
  hidePrev = () => {
    console.log("hidePrev");
    this.setState({ showPrev: false });
  };
  onChange = (a, b, c, d, e) => {
    let self = this;
    this.setState({ activeStep: parseInt(a) });
    setTimeout(function() {
      console.log("activeStep : ", self.state.activeStep);
      let step = parseInt(self.state.activeStep);
      step > 0 ? self.showPrev() : self.hidePrev();
    }, 0);
  };

  submit = (e) => {
    e.preventDefault();
    // console.log(this.refs)
    let data = {
      name: this.ProjectName.current.value,
      description: this.ProjectDescription.current.value,
    }
    console.log(data)

    let url = "http://localhost:3030/projects/";

    fetch(url,{
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json"
      }
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log('Proejct data',data)

      // allEvents.push(data) // Insert the event into the allEvents array.
      // item.eventsData.push(data);
      // return Promise.resolve(data)
    })
    // window.db.projects.insert(data, (e,r) => {
    //   console.log(e,r)
    //   if(r){
    //     this.props.ok();
    //   }
    // })
  }

  render() {
    const props = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    return (
      <div>
        <Modal
          closable={false}
          destroyOnClose={true}
          footer={null}
          header={null}
          title={null}
          visible={this.props.visible}
          onOk={this.props.ok}
          onCancel={this.props.cancel}

        >
          <div className="flex flex-column pt5- ph5- bg-black-02">

          <form onSubmit={this.submit}>

            <Carousel
              {...props}
              ref={node => (this.carousel = node)}
              className="insertFormCarousel relative overflow-hidden"
              afterChange={this.onChange}
            >

              <div className="flex flex-column bg-transparent ph5 pt5 pb3">
              <div id="CharacterInsertNameFirst" className="form-row flex flex-row mb4">

                  <div className="flex flex-column w-100">
                      <input
                        ref={this.ProjectName}
                        placeholder={"Project Name"}
                        name="ProjectName"
                        className="ph3 pv3 br2 bn bs-a f4 fw5 black-80 h-100" />
                  </div>
              </div>

              <div id="CharacterInsertNameFirst" className="form-row flex flex-row mb0">

                  <div className="flex flex-column w-100">
                      <input
                        ref={this.ProjectDescription}
                        placeholder={"Project Description"}
                        name="ProjectDescription"
                        className="ph3 pv3 br2 bn bs-a f4 fw5 black-80 h-100" />
                  </div>
              </div>

              </div>

              <div className="flex flex-column bg-transparent ">
              <div id="CharacterInsertNameFirst" className="form-row flex flex-row mb4">

                  <div className="flex flex-column w-100">
                      <input
                        ref={this.ProjectName2}
                        placeholder={"Project Name"}
                        name="ProjectName"
                        className="ph3 pv3 br2 bn bs-a f4 fw5 black-80 h-100" />
                  </div>
              </div>

              <div id="CharacterInsertNameFirst" className="form-row flex flex-row mb0">

                  <div className="flex flex-column w-100">
                      <input
                        ref={this.ProjectName3}
                        placeholder={"Project Description"}
                        name="ProjectDescription"
                        className="ph3 pv3 br2 bn bs-a f4 fw5 black-80 h-100" />
                  </div>
              </div>

              </div>

              <div>
                <h3>3</h3>
              </div>

              <div>
                <h3>4</h3>
              </div>

            </Carousel>

          </form>




            <div className="flex flex-column items-center justify-center w-100 pb4 pt3">
              <button
              onClick={this.submit}
              className="bn flex flex-column ph5 pv2 br5 bg-cyan bs-b-cyan">
                <span className="ttu f6 fw6 white varela pv1 tracked-03">Submit</span>
              </button>
            </div>
          </div>

          <div className="absolute right-0 top-0 h-100 -bg-red w3">
            <div className="flex flex-column items-center justify-center h-100">
              <div onClick={this.next} className="next flex flex-column">
                <div className="cyan ">
                  <svg width="2em" height="2em" viewBox="0 0 451.846 451.847">
                    <path d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute left-0 top-0 h-100 -bg-red w3">
            <div className="flex flex-column items-center justify-center h-100">
              <div onClick={this.previous} className="next flex flex-column">
                {this.state.showPrev ? (
                  <div className="cyan rotate-180">
                    <svg width="2em" height="2em" viewBox="0 0 451.846 451.847">
                      <path d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z" />
                    </svg>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default InsertModal;
