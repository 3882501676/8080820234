import React, { Component } from 'react';
import { Drawer, Button, Radio } from 'antd';
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
// import ItemDetailList from '../ItemDetailList';
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

const RadioGroup = Radio.Group;

class InsertProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.item,
            visible: this.props.visible,
            placement: 'right',
            test: this.props.visible
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };
    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    onChange = e => {
        this.setState({
            placement: e.target.value,
        });
    };
    componentDidMount() {
        // console.log(this.props)
        console.log('Mount', this.state)
    }
    componentDidUpdate() {
        console.log('Update', this.state, this.props)
    }
    render() {

        return (
          <Form onSubmit={this.handleSubmit}>
              <div id="CharacterInsertNameFirst" className="form-row flex flex-row mb4">

                  <div className="flex flex-column w-100">
                      <input
                        placeholder={"Project Name"}
                        name="NameFirst"
                        className="ph3 pv3 br2 bn bs-a f4 fw5 black-80" />
                  </div>
              </div>

              <div id="CharacterInsertNameFirst" className="form-row flex flex-row mb0">

                  <div className="flex flex-column w-100">
                      <input
                        placeholder={"Project Description"}
                        name="NameLast"
                        className="ph3 pv3 br2 bn bs-a f4 fw5 black-80" />
                  </div>
              </div>



          </Form>
        );
    }
}


// const WrappedInsertProjectForm = Form.create({ name: 'insertProject' })(InsertProject);

export default InsertProject;
