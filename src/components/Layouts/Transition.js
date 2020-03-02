
import React from 'react';
// import { Tabs, Icon } from "antd";
import posed from 'react-pose';

const Box = posed.div({
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
})

class TransitionLayout extends React.Component {
    constructor(props) {
        super(props)
        this.state = { isVisible: false };
    }
    componentDidMount() {
        let self = this;
        setTimeout(() => {
            self.setState({ isVisible: !this.state.isVisible });
        }, 100)
    }
    componentWillUnmount() {
        let self = this;
        setTimeout(() => {
            self.setState({ isVisible: !this.state.isVisible });
        }, 100)
    }
    render() {
        const { isVisible } = this.state;
        return (
            <Box className="box w-100" pose={isVisible ? 'visible' : 'hidden'} >
                {this.props.children}
            </Box>
        );
    }

};

export default TransitionLayout;
