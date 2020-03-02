import constants from "./constants";
import util from './__';

export const ___ = {
  constants: () => {
    return constants
  },
  getGeolocation: async __ => {
    
    /**
     *
     *
     * @memberof App
     */
    
     const { self } = __;

    const setPosition = data => {
      self.setState({
        lat: data.coords.latitude,
        long: data.coords.longitude
      });
      console.log("[[ Retrieving Geolocation Data ]]", JSON.stringify(data));
      return self.findCity();
    };
    window.navigator.geolocation.getCurrentPosition(setPosition);
  },
  findCity: async __ => {
    
    /**
     *
     *
     * @memberof App
     */

    return new Promise(async resolve => {
      const { self } = __;
      console.log("[[ Retrieving City Data ]]");
      // let url = "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=" + self.state.lat + "," + self.state.long + ",250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=ZZN2MPuexLyuz3VR0KDD&app_code=TnEsVJR8k3zxGMiAkbP_EQ";
      let url = constants.api.findCity(self.state.lat, self.state.long);

      fetch(url, (e, r) => {
        return r;
      })
        .then(res => {
          return res.json();
        })

        .then(res => {
          console.log("Geo ", res);

          let data =
            res.Response.View[0].Result[0].Location.Address.AdditionalData;

          for (let item of data) {
            if (item.key === "CountryName") {
              self.setState({ country: item.value, countrySet: true });
            }
          }
          self.setState({
            city: res.Response.View[0].Result[0].Location.Address.County,
            suburb: res.Response.View[0].Result[0].Location.Address.District,
            province: res.Response.View[0].Result[0].Location.Address.State,
            searchFormReady: true,
            location: res.Response.View[0].Result[0].Location.Address,
            locationIsSet: true
          });
          localStorage.setItem(
            "location",
            JSON.stringify(res.Response.View[0].Result[0].Location.Address)
          );
          localStorage.setItem("locationIsSet", JSON.stringify(true));

          // setGlobal({
          //   locationIsSet: true,
          //   location: res.Response.View[0].Result[0].Location.Address
          // }); 

          resolve(res)

          // return self.findCurrency()
        });
    })

  },
  findCurrency: async __ => {

    return new Promise(async resolve => {
      console.log("[[ Retrieving Currency Data ]]");
      const { self } = __;
      if (self.state.countrySet) {
        const country = self.state.country;
        let url = "https://restcountries.eu/rest/v2/name/" + country;
        await fetch(url, (err, res) => {
          return res;
        })
          .then(res => {
            return res.json();
          })
          .then(res => {
            if (localStorage.getItem("activeCurrency") !== null) {
              let activeCurrency = JSON.parse(
                localStorage.getItem("activeCurrency")
              );
              localStorage.setItem("activeCurrencyIsSet", JSON.stringify(true));
              // setGlobal({
              //   activeCurrency: activeCurrency,
              //   activeCurrencyIsSet: true
              // });
              self.setState({
                activeCurrencyIsSet: true,
                activeCurrency: activeCurrency
              });
              ___.fetchExchangeRate({ currency: activeCurrency });
              resolve(res)
            } else {
              // setGlobal({
              //   activeCurrencyIsSet: true,
              //   activeCurrency: res[0].currencies[0],
              //   baseCurrency: res[0].currencies[0]
              // });
              localStorage.setItem(
                "activeCurrency",
                JSON.stringify(res[0].currencies[0])
              );
              localStorage.setItem(
                "baseCurrency",
                JSON.stringify(res[0].currencies[0])
              );
              localStorage.setItem("activeCurrencyIsSet", JSON.stringify(true));
              self.setState({
                activeCurrencyIsSet: true,
                activeCurrency: res[0].currencies[0],
                baseCurrency: res[0].currencies[0]
              });
              ___.fetchExchangeRate({ currency: res[0].currencies[0] });
              resolve(res)
            }
          });
      }
    })

  },
  // fetchExchangeRate: async __ => {
  //   return new Promise(async resolve => {
  //     console.log("[[ fetch Exchange Rate : data ]]", __);
  //     const { self } = __;
  //     // const baseCurrency = getGlobal().baseCurrency;
  //     const baseCurrency = "ZAR";
  //     const activeCurrency = __.currency;
  //     console.log(
  //       "[[ fetching Exchange Rate ]]",
  //       baseCurrency.symbol,
  //       activeCurrency.symbol
  //     );

  //     let url =
  //       "https://api.exchangeratesapi.io/latest?base=" +
  //       baseCurrency.code +
  //       "&symbols=" +
  //       activeCurrency.code;

  //     return await fetch(url, (err, res) => {
  //       return res;
  //     })
  //       .then(res => {
  //         return res.json();
  //       })
  //       .then(res => {
  //         console.log(
  //           "[[ fetched Exchange Rate ]]",
  //           res.rates[activeCurrency.code]
  //         );
  //         let exchangeRate = res.rates[activeCurrency.code];
  //         self.setState({
  //           ready: true,
  //           activeCurrency: __.currency,
  //           exchangeRate: res.rates[activeCurrency.code]
  //         });
  //         // setGlobal({ exchangeRate: exchangeRate });
  //         // return 

  //         resolve(exchangeRate)

  //       });
  //   }
  //   }

}

export default util;
