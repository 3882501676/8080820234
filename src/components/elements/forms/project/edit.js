import React, { Component, getGlobal } from "reactn";
import { useAuth0 } from "../../../../react-auth0-spa";
import { notification, Drawer, Button, Radio } from "antd";
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
  AutoComplete
} from "antd";
// import ItemDetailList from "../ItemDetailList";
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

const RadioGroup = Radio.Group;

class EditProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item,
      visible: this.props.visible,
      placement: "right",
      test: this.props.visible,
      iconLoading: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);

    this.ProjectTitle = React.createRef();
    this.ProjectDescription = React.createRef();
    this.ProjectSynopsis = React.createRef();

    console.log('EditProject',props)
    // this.Phone = React.createRef();
    // this.Requirements = React.createRef();
    // this.eventType = React.createRef();
    // this.eventTime = React.createRef();
    // this.eventTLength = React.createRef();
  }
  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      iconLoading: true
    });
    this.props.refresh()
    let project = this.state.item;

    project.title = this.ProjectTitle.current.value;
    project.description = this.ProjectDescription.current.value;
    project.synopsis = this.ProjectSynopsis.current.value;
    project.meta.owner = JSON.parse(localStorage.getItem('account')).user.sub;

    console.log("Project State", project);

    let url = getGlobal().api + "/projects/" + project._id;

    console.log("PROJECT", JSON.stringify(project, null, 2));

    fetch(url, {
      method: "PATCH",
      body: JSON.stringify(project),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        console.log("res", res);
        if (!res.ok) {
          // throw Error(res.statusText);
          notification.open({
            duration: 3,
            message: "Error",
            description: "Unable to update your project",
            icon: <Icon type="check-circle" className="c_8" />,
          });
        }
        // return response;
        return res.json();
      })
      .then(data => {
        // this.setState.
        console.log('Updated project',data);
        notification.open({
          duration: 3,
          message: "Success",
          description: "Your project has been updated.",
          icon: <Icon type="check-circle" className="c_8" />,
        });

        setTimeout(() => {
          this.setState({
            iconLoading: false,
            // visible: false
          })
          this.props.updateProject(data)
          this.props.goToTab1()
          // this.props.refresh()
          // this.props.close()
        },1000)
      });
    // this.props.form.validateFieldsAndScroll((err, values) => {
    //   if (!err) {
    //     console.log("Received values of form: ", values);
    //   }
    // });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
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
  componentDidMount() {
    // console.log(this.props)
    console.log("Mount", this.state);
  }
  componentDidUpdate() {
    console.log("Update", this.state, this.props);
  }
  render() {
    console.log("Project info ", this.props.item);
    const inputClassNames = "ph3 pv3 br2 bn bs-a f4 fw5 black-80 h-100";
    return (
      <Form className="appForm DrawerEditForm" onSubmit={this.handleSubmit}>
        <div className="pa5 flex flex-column">
          <div id="ProjectTitle" className="form-row flex flex-row mb4">
            <div className="flex flex-column w-100">
              <input
                ref={this.ProjectTitle}
                placeholder={"Project Title"}
                name="ProjectTitle"
                className={inputClassNames}
                defaultValue={this.props.item.title}
              />
            </div>
          </div>

          <div id="ProjectDescription" className="form-row flex flex-row mb4">
            <div className="flex flex-column w-100">
              <input
                ref={this.ProjectDescription}
                placeholder={"Project Description"}
                name="ProjectDescription"
                className={inputClassNames}
                defaultValue={this.props.item.description}
              />
            </div>
          </div>
          <div id="ProjectSynopsis" className="form-row flex flex-row mb0">
            <div className="flex flex-column w-100">
              <textarea
                ref={this.ProjectSynopsis}
                rows={4}
                placeholder={"Project Synopsis"}
                name="ProjectSynopsis"
                className={inputClassNames}
                defaultValue={this.props.item.synopsis}
              />
            </div>
          </div>
          <div className="flex flex-column items-center justify-center w-100 pb4 pt5">
            <button className="bn flex flex-row items-center ph5 pv2-5 br5 bg-cyan bs-b-cyan relative">
              {this.state.iconLoading ? <Icon type="loading" /> : null}
              <span className="ttu f6 fw6 white varela pv1 tracked-03">
                Submit
              </span>
            </button>
          </div>
        </div>
      </Form>
    );
  }
}

// const WrappedInsertProjectForm = Form.create({ name: 'insertProject' })(InsertProject);

export default EditProject;
