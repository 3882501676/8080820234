import React, { Component, getGlobal, setGlobal, useGlobal } from "reactn";
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

class InsertForm extends React.Component {
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
    this.insertCharacter = this.insertCharacter.bind(this);
  }
  handleSubmit = e => {
    e.preventDefault();

    let API_url = getGlobal().api;
    let endpoint = "/characters/";
    let url = API_url + endpoint;

  }

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };
  onClose = () => {
    this.setState({
      visible: false
    })
  }
  onChange = e => {
    this.setState({
      placement: e.target.value
    })
  }
  componentDidMount() {
    // console.log(this.props)
    // console.log("Mount", this.state);
  }

  insertCharacter = event => {
    event.preventDefault();
    let self = this;
    this.setState({
      iconLoading: true,
      ready: false
    })

    let API_url = getGlobal().api;
    let endpoint = "/characters/";
    let url = API_url + endpoint;
    //
    // this.props.form.validateFieldsAndScroll((err, values) => {
    //   if (!err) {
    //     console.log("Received values of form: ", values);
    //   }
    // });
    let updateObj = {
      name: {
        first: this.NameFirst.value,
        last: this.NameLast.value
      },
      bio: this.Bio.value,
      gender: this.Gender.value,
      type: this.Type.value,
      project: JSON.parse(localStorage.globalState).activeProject._id
    };
    // console.log(this.getGlobal())
    console.log(updateObj);

    fetch(url, {
      method: "post",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(updateObj)
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log("Request succeeded with JSON response", data);
        this.props.success({type: "insert"});
        self.setState({
          // insertFormVisible: false,
          iconLoading: false
        });
      })
      .catch(error => {
        console.log("Request failed", error);
      });
  };
  componentDidUpdate() {
    // console.log("Update", this.state, this.props);
  }
  render() {
    const inputClassNames = "ph3 pv3 br2 bn bs-a f4 fw5 black-80 h-100";
    return (
      <div>
        <Drawer
          title={"Insert Character"}
          placement={"right"}
          closable={true}
          onClose={this.props.hideDrawer}
          visible={this.props.visible}
          width={500}
          className="bg-black-02"
          type="insert"
        >

          <form className="pa5 flex flex-column h-100 overflow-auto">
            <div
              id="CharacterInsertNameFirst"
              className="form-row flex flex-row mb4"
            >
              <div className="flex flex-column items-end justify-center mr3 w-100 w-40-l w-40-m">
                <label className="f4 fw6 black-60- cyan">First Name</label>
                <label className="f7 fw1 black-40 tr">
                  Character first name
                </label>
              </div>
              <div className="flex flex-column w-100">
                <input
                  required
                  ref={input => (this.NameFirst = input)}
                  name="NameFirst"
                  className="ph3 pv3 br2 bn bs-a f4 fw5 black-80"
                />
              </div>
            </div>
            <div id="NameFirst" className="form-row flex flex-row mb4">
              <div className="flex flex-column w-100">
                <input
                  required
                  ref={input => (this.NameFirst = input)}
                  name="NameFirst"
                  className={inputClassNames}
                  placeholder={"First Name"}
                />
              </div>
            </div>
            <div id="NameLast" className="form-row flex flex-row mb4">
              <div className="flex flex-column w-100">
                <input
                  required
                  ref={input => (this.NameLast = input)}
                  name="NameFirst"
                  className={inputClassNames}
                  placeholder={"Last Name"}
                />
              </div>
            </div>
            <div id="Bio" className="form-row flex flex-row mb4">
              <div className="flex flex-column w-100">
                <input
                  required
                  ref={input => (this.Bio = input)}
                  name="Bio"
                  className={inputClassNames}
                  placeholder={"Character Bio"}
                />
              </div>
            </div>
            <div id="Gender" className="form-row flex flex-row mb4">
              <div className="flex flex-column w-100">
                <input
                  required
                  ref={input => (this.Gender = input)}
                  name="Gender"
                  className={inputClassNames}
                  placeholder={"Gender"}
                />
              </div>
            </div>
            <div id="Type" className="form-row flex flex-row mb4">
              <div className="flex flex-column w-100">
                <input
                  required
                  ref={input => (this.Type = input)}
                  name="Type"
                  className={inputClassNames}
                  placeholder={"Type"}
                />
              </div>
            </div>

            <div
              id="CharacterInsertNameFirst"
              className="form-row flex flex-row mb4"
            >
              <div className="flex flex-column items-end justify-center mr3 w-100 w-40-l w-40-m">
                <label className="f4 fw6 black-60- cyan">Last Name</label>
                <label className="f7 fw1 black-40 tr">
                  Character last name
                </label>
              </div>
              <div className="flex flex-column w-100">
                <input
                  required
                  ref={input => (this.NameLast = input)}
                  name="NameLast"
                  className="ph3 pv3 br2 bn bs-a f4 fw5 black-80"
                />
              </div>
            </div>

            <div
              id="CharacterInsertNameFirst"
              className="form-row flex flex-row mb4"
            >
              <div className="flex flex-column items-end justify-center mr3 w-100 w-40-l w-40-m">
                <label className="f4 fw6 black-60- cyan">Gender</label>
                <label className="f7 fw1 black-40 tr">
                  Character gender: Male/Female
                </label>
              </div>
              <div className="flex flex-column w-100">
                <input
                  required
                  ref={input => (this.Gender = input)}
                  name="NameFirst"
                  className="ph3 pv3 br2 bn bs-a f4 fw5 black-80"
                />
              </div>
            </div>

            <div
              id="CharacterInsertNameFirst"
              className="form-row flex flex-row mb4"
            >
              <div className="flex flex-column items-end justify-center mr3 w-100 w-40-l w-40-m">
                <label className="f4 fw6 black-60- cyan">Bio</label>
                <label className="f7 fw1 black-40 tr">Character bio</label>
              </div>
              <div className="flex flex-column w-100">
                <textarea
                  required
                  ref={input => (this.Bio = input)}
                  rows={4}
                  name="NameFirst"
                  className="ph3 pv3 br2 bn bs-a f4 fw5 black-80"
                />
              </div>
            </div>

            <div
              id="CharacterInsertNameFirst"
              className="form-row flex flex-row mb4"
            >
              <div className="flex flex-column items-end justify-center mr3 w-100 w-40-l w-40-m">
                <label className="f4 fw6 black-60- cyan">Type</label>
                <label className="f7 fw1 black-40 tr">
                  Character type: human, alien
                </label>
              </div>
              <div className="flex flex-column w-100">
                <input
                  required
                  ref={input => (this.Type = input)}
                  name="NameFirst"
                  className="ph3 pv3 br2 bn bs-a f4 fw5 black-80"
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
          </form>
        </Drawer>
      </div>
    );
  }
}

const WrappedInsertForm = Form.create({ name: "insert" })(InsertForm);

export default WrappedInsertForm;
