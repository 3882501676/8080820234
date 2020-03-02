import { setGlobal, getGlobal, clearGlobal } from "reactn";
import appconfig from "./config/app.config";
// import { DOUBLE_CHEVRON_UP } from "@blueprintjs/icons/lib/esm/generated/iconNames";
// // import { Datastore } from "nedb-async-await";
// // var Datastore = require('nedb');
// var db = {};


let initialise = {};
// initialise.global = () => {
//   window.clearGlobal = clearGlobal;
//   window.getGlobal = getGlobal;
//   window.setGlobal = setGlobal;
// }
// initialise.DB = async (db) => {

//   // var users = new Datastore({ filename: '../data/users.db', autoload: true, inMemoryOnly: false });
//   // var conversations = new Datastore({ filename: '../data/conversations.db', autoload: true, inMemoryOnly: false });
//   // var reservations = new Datastore({ filename: '../data/reservations.db', autoload: true, inMemoryOnly: false });
//   // var notifications = new Datastore({ filename: '../data/notifications.db', autoload: true, inMemoryOnly: false });

//   // const users = new Datastore({
//   //   filename: '../data/users.db',
//   //   autoload: true,
//   //   inMemoryOnly: false
//   // })
//   // const conversations = new Datastore({
//   //   filename: '../data/conversations.db',
//   //   autoload: true,
//   //   inMemoryOnly: false
//   // })
//   // const reservations = new Datastore({
//   //   filename: '../data/reservations.db',
//   //   autoload: true,
//   //   inMemoryOnly: false
//   // })
//   // const notifications = new Datastore({
//   //   filename: '../data/notifications.db',
//   //   autoload: true,
//   //   inMemoryOnly: false
//   // })


//   // db = {
//   //   users, conversations, reservations, notifications
//   // }
//   // window.db = db;
//   // db.users.loadDatabase();
//   // db.conversations.loadDatabase();
//   // db.reservations.loadDatabase();
//   // db.notifications.loadDatabase();
// }

initialise.state = () => {

  const initialiseState = {

    theme: {
      main: "light",
      colorScheme: {
        name: "c_1",
        color: "c_1",
        bg: "c_1_bg",
        accent: {
          dark: "light-grey",
          light: "light-grey"
        }
      },
      font: {
        primary: "rubik",
        other: "varela",
        other1: "roboto"
      }
    },
    projects: [],
    conversations: [],
    notifications: [],
    messages: []
  };

  window.initialiseState = initialiseState;
  return initialiseState;

}
initialise.setDefaultCurrency = () => {
  if (localStorage.getItem('baseCurrency') !== null) {
    let baseCurrency = JSON.parse(localStorage.getItem('baseCurrency'));
    setGlobal({ baseCurrency: baseCurrency });
  }
  else {
    setGlobal({ baseCurrency: {} });
  }
  if (localStorage.getItem('activeCurrency') !== null) {
    let activeCurrency = JSON.parse(localStorage.getItem('activeCurrency'));
    setGlobal({ activeCurrency: activeCurrency, activeCurrencyIsSet: true });
  }
  else {
    setGlobal({ activeCurrency: {}, activeCurrencyIsSet: false });
  }
}
initialise.hydrate = () => {

  if (localStorage.getItem('account') === null) {

    localStorage.setItem('account', JSON.stringify(null))

  }
  if (localStorage.getItem('isAuthenticated') === null) {

    localStorage.setItem('isAuthenticated', JSON.stringify(false))

  }
  if (localStorage.getItem('activeConversation') === null) {

    localStorage.setItem('activeConversation', JSON.stringify(null))

  }
  if (!window.localStorage.gs) {

    // console.log("[[ Configuring Initial State ]]");
    
    // window.localStorage.setItem(
    //   "globalState",
    //   JSON.stringify(initialise.state())
    // )

    // setGlobal({ config: initialise.state() });

    // setGlobal({
    //   locationIsSet: JSON.parse(window.localStorage.getItem('locationIsSet')),
    //   location: JSON.parse(window.localStorage.getItem('location')),
    //   account: JSON.parse(window.localStorage.getItem('account')),
    //   config: JSON.parse(window.localStorage.getItem('globalState'))
    // })
    // window.localStorage.setItem("gs", true);

    // console.log('[[ getGlobal ]]', getGlobal())

  } else {

    // console.log("[[ Hydrating Global State from localStorage ]]");
    
    // let config = JSON.parse(window.localStorage.getItem('globalState'));
    
    // setGlobal({
    //   locationIsSet: JSON.parse(window.localStorage.getItem('locationIsSet')),
    //   location: JSON.parse(window.localStorage.getItem('location')),
    //   account: JSON.parse(window.localStorage.getItem('account')),
    //   config: config
    // })

    // console.log('[[ getGlobal ]]', getGlobal())

  }
}
// initialise.cloudinary = () => {
//   if (typeof window.cloudinary !== "undefined") {
//     let widget = window.cloudinary.createUploadWidget(
//       {
//         cloudName: "doy0ozmqb",
//         uploadPreset: "kmegjnr9"
//         // uploadPreset: "hj2fahfn"
//       },
//       (err, res) => {
//         console.log(res, err);
//         // if (res.event === "success") {
//         //   // let _ = res;
//         // }
//       }
//     );
//     window.widget = widget;
//   }
// }

initialise.api = () => {
  let api;

  if (process.env.NODE_ENV !== 'production') {
    api = appconfig.api.dev;
    // let global = getGlobal();
    // global.api = api;
    // setGlobal(global)
  }
  else {
    api = appconfig.api.prod;
    // let global = getGlobal();
    // global.api = api;
    // setGlobal(global)
  }
  return api
  // console.log('[[ THEMES ]]', themeColors());
}

// initialise.global = () => {
//   window.getGlobal = getGlobal
// }

// initialise.importDemoUsers = async () => {
//   if (window.db && window.db.users !== "undefined") {
//     let fetchData = async () => {
//       let url = "https://jsonblob.com/api/29254ce5-eb1d-11e9-9c02-d9f7655db410";
//       let config = {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json"
//         }
//       }      

//       await fetch(url, config).then(res => {
//         return res.json()
//       }).then(res => {
//         console.log('res', res)
//         // return res
//         for (let item of res) {
//           // db_.collection('users').insert(item).asArray()
//           // ).then(docs => {
//           //   console.log("Found docs", docs)
          
//           //   console.log("[MongoDB Stitch] Connected to Stitch")
//           // }).catch(err => {
//           //   console.error(err)
//           // });
       
//         }
//       })
//     }
//     await window.db.users.find({}, function (err, docs) {
//       if (docs.length === 0) {
//         // fetchData();
//       }
//     })
//   }
// }

// initialise.complete = () => {
//   if (getGlobal() !== "undefined") {
//     return true
//   }
//   else {
//     return false
//   }
// }
initialise.start = () => {
  // initialise.global()
  // initialise.DB()
  // // initialise.importDemoUsers()
  // initialise.setDefaultCurrency()
  initialise.hydrate();
  // initialise.cloudinary();
  initialise.api();

}

export default initialise
