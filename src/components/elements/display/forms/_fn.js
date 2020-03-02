import { setGlobal } from 'reactn';
import methods from '../../../../utils/methods';

let _fn = {};
_fn.sleep = async (fn) => {
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
}
_fn.reverseGeocodeCity = async (data) => {
    console.log('[[ _fn.reverseGeocodeCity ]]');
    const { self } = data;
    let url = "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=" + self.state.lat + "," + self.state.long + ",250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=ZZN2MPuexLyuz3VR0KDD&app_code=TnEsVJR8k3zxGMiAkbP_EQ";
    fetch(url, (e, r) => {
        return r
    })
        .then(res => { return res.json() })
        .then(res => {
            // console.log('reverse geocode res', res)

            console.log('[[ _fn.reverseGeocodeCity ]]', JSON.stringify(res.Response.View[0].Result[0].Location.Address));

            let data = res.Response.View[0].Result[0].Location.Address.AdditionalData;
            let location = res.Response.View[0].Result[0].Location.Address;
            for (let item of data) {
                if (item.key === "CountryName") {
                    let country = item.value;
                    console.log('country', country);
                    self.setState({ country: country, countrySet: true })
                }
            }
            self.setState({
                city: res.Response.View[0].Result[0].Location.Address.County,
                suburb: res.Response.View[0].Result[0].Location.Address.District,
                province: res.Response.View[0].Result[0].Location.Address.State,
                searchFormReady: true,
                location: res.Response.View[0].Result[0].Location.Address,
                ready: true
            })
            _fn.findCurrency({ self })
            console.log('[[ store : location ]]',location)
            methods.store({ type: 'location', data: location })
            methods.store({ type: 'locationIsSet', data: true })
        })
}
_fn.findCurrency = async (data) => {
    const { self } = data;
    if (self.state.countrySet) {
        const country = self.state.country;
        let url = "https://restcountries.eu/rest/v2/name/" + country;
        await fetch(url, (err, res) => {
            return res
        }).then(res => {
            return res.json()
            // console.log('Country data',res)
        }).then(res => {
            // return res.json()
            console.log('Country data', res[0].currencies[0]);
            setGlobal({ activeCurrencyIsSet: true, activeCurrency: res[0].currencies[0], baseCurrency: res[0].currencies[0] })
            localStorage.setItem('activeCurrency', JSON.stringify(res[0].currencies[0]))
            localStorage.setItem('baseCurrency', JSON.stringify(res[0].currencies[0]))
            localStorage.setItem('activeCurrencyIsSet', JSON.stringify(true))
        })
    }
}
_fn.getGeoLocation = async (data) => {
    const { self } = data;

    const setPosition = (data_) => {
        console.log('[[ getGeoLocation ]]', data_)
        // console.log('getGeolocation', data_)
        self.setState({
            lat: data_.coords.latitude,
            long: data_.coords.longitude
        })
        _fn.reverseGeocodeCity({ self })
    }
    window.navigator.geolocation.getCurrentPosition(setPosition)
}
_fn.findLocation = (data) => {
    const { searchTerm, self } = data;

    let url = "https://geocoder.api.here.com/6.2/geocode.json?searchtext=" + searchTerm + "&app_id=ZZN2MPuexLyuz3VR0KDD&app_code=TnEsVJR8k3zxGMiAkbP_EQ&gen=9";
    fetch(url, (e, r) => {
        return r
    })
        .then(res => { return res.json() })
        .then(res => {
            console.log('findLocation', res.Response.View[0].Result[0].Location.Address)
            self.setState({
                city: res.Response.View[0].Result[0].Location.Address.County,
                suburb: res.Response.View[0].Result[0].Location.Address.District,
                province: res.Response.View[0].Result[0].Location.Address.State,
                searchFormReady: true,
                location: res.Response.View[0].Result[0].Location.Address
            })
            return _fn.findCurrency({ self })
            // return res.Response.View[0].Result[0].Location.Address
            // console
        })

}
export default _fn