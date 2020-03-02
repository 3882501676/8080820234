import React, { getGlobal, setGlobal } from "reactn";
import { Menu, Dropdown } from 'antd';
import Currencies from '../../../../utils/currencies/worldcurrencies.json';
import { Fn } from '../../../../utils/fn/Fn.js';
import './style.css';

class SelectCurrency extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeCurrency: this.props.activeCurrency,
            ready: true
        }
        this.setCurrency = this.setCurrency.bind(this)
        // console.log('SelectCurrency', props)
    }
    setCurrency(currency) {
        this.setState({
            activeCurrency: currency
        })
        setGlobal({ activeCurrency: currency })
        localStorage.setItem('activeCurrency', JSON.stringify(currency))
    }
    componentDidUpdate() {
        console.log('SelectCurrency props', this.props)
    }
    componentDidMount() {

    }
    render() {
        return (
            <div className="currencies-dropdown1">
                { this.state.ready && 
                    <Dropdown overlayClassName="currencies-dropdown" overlay={<Menu>
                        {
                            Currencies.map((item, index) => (
                                <Menu.Item key={index} onClick={() => this.props.setCurrency(item)}>
                                    <div className="flex flex-row ">
                                        <span className="flex flex-column f7 fw6 ph2 black-70 w3">
                                            {item.code}
                                        </span>
                                        <span className="flex flex-column f7 fw6 ph2 black-70 w3">
                                            {item.symbol}
                                        </span>
                                        <span className="flex flex-column f8 fw5 ph2 black-50">
                                            {item.name}
                                        </span>
                                    </div>
                                </Menu.Item>
                            ))
                        }
                    </Menu>} trigger={['click']}>
                        <div className="flex flex-column black-70">
                            <span className={ Fn.get('theme').config.theme.colorScheme.bg + " exo flex flex-column br1 f7 fw6 ph2 pv1 pointer bg-black-20 white"}>
                                {this.props.activeCurrency.code}
                            </span>
                        </div>
                    </Dropdown>}
            </div>
        )
    }
}
export default SelectCurrency;
