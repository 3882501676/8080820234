import React from 'react';
import { Icon } from 'antd';
import { Progress } from 'antd';
import './style.css';
import { Fn } from '../../../../utils/fn/Fn.js';

class LocationSearchBar2 extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: false,
            searchResults: [],
            location: this.props.location,
            percent: this.props.progressBarPercent,
            progressBarActive: this.props.progressBarActive,
            searchAttempts: 0
        }

        this.submit = this.submit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this)
        this.submitSearch = this.submitSearch.bind(this)

        this.increase = this.increase.bind(this)

        this.location = React.createRef();

        console.log('LocationSearchForm', props)
    }
    increase = () => {
        let percent = this.state.percent + 10;
        if (percent > 100) {
            percent = 100;
        }
        this.setState({ percent });
    };

    async onChange(e) {

        this.setState({ progressBarActive: false })

        let address = e.target.value;

        // const proxyurl = "https://cors-anywhere.herokuapp.com/";

        let url = "https://autocomplete.geocoder.api.here.com/6.2/suggest.json?app_id=ZZN2MPuexLyuz3VR0KDD&app_code=TnEsVJR8k3zxGMiAkbP_EQ&query=" + address;

        const config = {
            origin: 'locahost',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
            }
        }

        await fetch(url, config, (err, res) => {
            if (!res.ok) { console.error(err) }
            return res
        }).then(res => { return res.json() }).then(res => {
            // return res
            console.log('Autocomplete res', res)
            this.setState({
                searchResults: res.suggestions
            })
        })

    }

    async setLocation(item) {
        // alert(JSON.stringify(item))
        // alert('setLocation')
        this.setState({
            location: item,
            // progressBarActive: true,
            // percent: 50
        })
        this.location.current.value = item.address.houseNumber + ", " + item.address.street + ", " + item.address.district + ", " + item.address.county;
        this.setState({ searchResults: [] })
        if (typeof this.props.updateProjectLocation !== "undefined") {
            localStorage.setItem('updateProjectLocation', JSON.stringify(item));
            this.props.updateProjectLocation(item)
        }
        else {
            // setGlobal({ location: item, locationSet: true })
            localStorage.setItem('location', JSON.stringify(item));
            localStorage.setItem('locationSet', JSON.stringify(true));
        }

        if (typeof this.props.type !== "undefined" && this.props.type === "event") {
            this.props.setLocation(item)
        }

        // return await this.props.fetchChefs(item.address.city)
        // await this.findLocation(item)
    }
    async submitSearch(e) {
        e.preventDefault()
        e.stopPropagation()
        // setGlobal({ location: this.props.location, locationSet: true })
        localStorage.setItem('location', JSON.stringify(this.props.location));
        localStorage.setItem('locationSet', JSON.stringify(true));
        // alert(JSON.stringify(this.props.location))
        let city = this.props.location.County;
        return await this.props.fetchChefs(city)
    }
    submit(e) {
        e.preventDefault();
        e.stopPropagation();

    }
    handleSearch = value => {
        if (value) {
            fetch(value, data => this.setState({ data }));
        } else {
            this.setState({ searchResults: [] });
        }
    };

    handleChange = value => {
        this.setState({ location: value });
    };
    componentDidMount() {
        const location = this.props.location;
        this.setState({
            location: location,
            ready: true
        })
    }
    render() {
        // const options = this.state.searchResults.map(d => <Option key={d}>{d}</Option>);
        return (
            <div id="LocationSearchBar" className="flex flex-column h-100 w-100 ">
                <form
                    onSubmit={this.submitSearch}
                    className="flex flex-column items-end justify-center ma0 pa0 w-100" id="">
                    {this.state.ready && <div className="flex flex-column relative w-100 items-end">

                        <div className="flex flex-column items-end mt3- w-100 mw-5 right ">
                            <input
                                id={"toolbarLocationSearch"}
                                ref={this.location}
                                onChange={this.onChange}
                                className="flex flex-column ph4 pv3 bn br1- round bg-white black-50 f4 fw5 bs-a- w-100"
                                placeholder={"Enter an address"}
                                type={"text"}
                                defaultValue={this.props.defaultValue}

                            ></input>{this.props.progressBarActive && <Icon type="loading" className="formLoadingIcon" />}
                        </div>
                        {
                            this.props.progressBarActive &&
                            <div className="LocationProgressBar absolute w-100 left-0 flex flex-column pt2 ">
                                <Progress
                                    strokeColor={'gainsboro'}
                                    showInfo={false}
                                    percent={this.props.progressBarPercent} />
                            </div>
                        }

                        {this.state && this.state.searchResults && this.state.searchResults.length > 0 &&
                            <div className="searchResults flex flex-column bs-a bg-near-white br1 w-100">
                                {
                                    this.state.searchResults.map((item, index) => (
                                        item.address && item.address.county && item.address.city && <div
                                            onClick={() => this.setLocation(item)}
                                            className="pointer flex flex-row f6 fw5 black-50 pa2">
                                            <span className="location-label-primary flex flex-auto items-center pl2 f5 fw4 black-40">{item.address.city || "n/a"}</span>
                                            <div className="flex flex-row items-center justify-end flex-auto ">
                                                <span className="location-label-secondary flex items-center  f7 fw6 black-60 pl3">{item.address.houseNumber}</span>
                                                <span className="location-label-secondary flex items-center  f7 fw6 black-60 pl3">{item.address.street}</span>
                                                <span className="location-label-secondary flex items-center  f7 fw6 black-60 pl3">{item.address.state}</span>
                                                <span className="location-label-secondary flex items-center f7 fw6 black-60 pl2">{item.address.country}</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>}

                    </div>}
                </form>
            </div>
        )
    }
}
export default LocationSearchBar2;