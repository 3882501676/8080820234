const constants = {}

constants.placeholderImage = "http://cdn.shopify.com/s/files/1/2278/2351/products/W1151_GeometricPattern3_1024x1024.jpg?v=1510704914";

constants.api = {}

constants.api.findCity = (lat, long) => {
    return "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=" + lat + "," + long + ",250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=ZZN2MPuexLyuz3VR0KDD&app_code=TnEsVJR8k3zxGMiAkbP_EQ";
}
constants.api.base2 = () => {
    return 'https://api.crew20.devcolab.site/v1/'
}
constants.api.base = () => {
    return 'https://dev.iim.technology/v1/'
}
export default constants