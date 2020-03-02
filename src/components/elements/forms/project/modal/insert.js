import React, { getGlobal } from "reactn";
// import { useAuth0 } from "../../../../../react-auth0-spa";
import { notification, Modal } from "antd";
// import { Carousel } from "antd";
// import InsertProject from "../insert";
// import { Drawer, Radio } from "antd";
import {
  // Form,
  // Input,
  // Tooltip,
  Icon,
  // Cascader,
  // Select,
  // Row,
  // Col,
  // Checkbox,
  // AutoComplete
} from "antd";
// import

class InsertModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.active,
      activeStep: 0,
      showPrev: false,
      iconLoading: false
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.carousel = React.createRef();
    this.showPrev = this.showPrev.bind(this);
    this.hidePrev = this.hidePrev.bind(this);
    this.submit = this.submit.bind(this);

    this.ProjectTitle = React.createRef();
    this.ProjectDescription = React.createRef();
    this.ProjectSynopsis = React.createRef();
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

  submit = e => {
    e.preventDefault();
    // console.log(this.refs)

    this.setState({
      iconLoading: true
    });
    let data = {
      title: this.ProjectTitle.current.value,
      description: this.ProjectDescription.current.value,
      synopsis: this.ProjectSynopsis.current.value,
      meta: {
        createdAt: new Date(),
        // owner: this.global.user._id
        owner: JSON.parse(localStorage.getItem('account')).user.sub
      }
    };
    console.log(data);

    // let url = "http://localhost:3030/projects/";
    let url = getGlobal().api + '/projects/';

    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(data => {
        console.log("Project data", data);

        setTimeout(() => {
          this.setState({
            iconLoading: false
          });
          this.props.close()
        }, 1000);
        setTimeout(() => {
          notification.open({
            duration: 3,
            message: "Success",
            description: "Your project has been created.",
            icon: <Icon type="check-circle" className="c_8" />,
          });
          this.props.fetchProjects()
        },1500)
      });
  };

  render() {
    // const props = {
    //   dots: false,
    //   infinite: false,
    //   speed: 500,
    //   slidesToShow: 1,
    //   slidesToScroll: 1
    // };
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
          <div className="appForm flex flex-column pt5- ph5- bg-black-02">
            <form className="">
              <div className="flex flex-column bg-transparent ph5 pt5 pb0">
                <div
                  id="ProjectTitle"
                  className="form-row flex flex-row mb4"
                >
                  <div className="flex flex-column w-100">
                    <input
                      ref={this.ProjectTitle}
                      placeholder={"Project Title"}
                      name="ProjectTitle"
                      className="ph3 pv3 br2 bn bs-a f4 fw5 black-80 h-100"
                    />
                  </div>
                </div>

                <div
                  id="ProjectDescription"
                  className="form-row flex flex-row mb4"
                >
                  <div className="flex flex-column w-100">
                    <input
                      ref={this.ProjectDescription}
                      placeholder={"Project Description"}
                      name="ProjectDescription"
                      className="ph3 pv3 br2 bn bs-a f4 fw5 black-80 h-100"
                    />
                  </div>
                </div>

                <div
                  id="ProjectSynopsis"
                  className="form-row flex flex-row mb0"
                >
                  <div className="flex flex-column w-100">
                    <textarea
                    rows={4}
                      ref={this.ProjectSynopsis}
                      placeholder={"Project Synopsis"}
                      name="ProjectSynopsis"
                      className="ph3 pv3 br2 bn bs-a f4 fw5 black-80 h-100"
                    />
                  </div>
                </div>

              </div>
            </form>

            <div className="flex flex-column items-center justify-center w-100 pb4 pt0 ph5">
              <button
                onClick={this.submit}
                className="bn flex flex-row items-center ph5 pv2-5 br2 bg-cyan bs-b-cyan relative w-100"
              >
                {this.state.iconLoading ? <Icon type="loading" /> : null}
                <span className="ttu f6 fw6 white varela pv1 tracked-03 w-100 tc">
                  Submit
                </span>
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default InsertModal;
