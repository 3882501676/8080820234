import { setGlobal, getGlobal } from "reactn";
// import appconfig from "../../utils/config/app.config";
import initialise from "../init";
let methods = {};

methods.start = () => { }
methods.extendUser = async (data) => {
  const { user } = data;
  const auth0User = { ...user };

  console.log(' ')
  console.log('[[ methods.extendUser profile ...user raw data]]', auth0User);
  console.log(' ')

  let profile = {
    config: {
      type: "",
      onboardingcomplete: false,
    },
    location: {},
    preferredCurrency: {},
    contact: {
      phone: "",
    },
    grade: 0,
    bio: "",
    role: "",
    connections: [],
    projects: [],
    additional: {
      ratings: {
        rating: 0,
        ratings: []
      },
      skills: []
    }
  }
  let user_ = {
    email: auth0User.email,
    password: "password1",
    auth0: auth0User,
    profile: profile
  }
  let store = async (data) => {

    console.log(' ')
    console.log('[[ Store ]]', data)
    console.log(' ')

    return methods.store({ type: 'account', data: data })
  }
  let insert = async (user_) => {
    // const { profile } = data;
    console.log(' ')
    console.log('[[ Insert : extended profile ]]', user_)
    console.log(' ')
    // let apiurl = "http://3.135.242.213:8010/nedb/";
    let apiUrl = 'https://localhost:3030/v1/'
    let collection = 'users';

    // let query =  '?q={"$and":[{"participants":"' + userID + '"},{"participants":"' + recipientID + '"}]}';
    let endpoint = apiUrl + collection;

    console.log('[[ Endpoint ]]', endpoint)
    let config = {
      method: "POST",
      headers: {
        "origin": "localhost:3000",
        // "x-apikey": "5dbadbac64e7774913b6e751",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user_)
    }
    return fetch(endpoint, config).then(res => {

      return res.json()

    }).then(res => {

      console.log(' ')
      console.log('[[ Extended user created ]]', res.user)
      console.log(' ')

      return methods.store({ type: 'account', data: res.user })
    })

  }
  // let apiurl = "http://3.135.242.213:8010/nedb/";
  let apiUrl = 'https://localhost:3030/v1/'
  let collection = 'users';

  // let query = '?$filter={"auth0.email":"' + auth0User.email + '"}';
  let query = "?email=" + auth0User.email
  let endpoint = apiUrl + collection + query;

  console.log('[[ Endpoint ]]', endpoint)
  let config = {
    method: "GET",
    headers: {
      "origin": "localhost:3000",
      // "x-apikey": "5dbadbac64e7774913b6e751",
      "Content-Type": "application/json"
    }
  }
  return fetch(endpoint, config).then(res => {

    return res.json()
  }).then(res => {
    console.log(' ')
    console.log('[[ find users with email ' + auth0User.email + ']]', res);
    console.log(' ')

    if (res.length > 0) {
      // return store(res[0])
      return methods.store({ type: 'account', data: res[0] })

    }
    else if (res.length === 0) {

      return insert(user_)

    }
  })

  // return await window.db.users.find({ sub: profile.sub }, (err, res) => {

  //   if (err) { console.error(err) }

  //   if(res) {

  //     console.log(' ')
  //     console.log('[[ ExtendUser : User find ]]', JSON.stringify(res));
  //     console.log(' ')

  //     if(res.length > 0){
  //       return store(res[0])
  //     }
  //     else if(res.length === 0) {
  //       return insert()
  //     }
  //   }   
  // })
}
methods.store = (payload) => {

  let { type, data } = payload;
  console.log(' ')
  console.log('[[[ Storing ' + type + ' ]]]', data)
  console.log(' ')
  setGlobal({
    [type]: data
  });

  let globalData = getGlobal();

  localStorage.setItem('globalData', JSON.stringify(globalData))

  localStorage.setItem(type, JSON.stringify(data))

}

methods.call = async (data) => {
  console.log("appfunctions.call", data);
  let { endpoint, config, type } = data;

  return fetch(endpoint, config)
    .then(res => {
      return res.json();
    })
    .then(res => {
      methods.store({ type, data: res.data })
      console.log('Request Response : ', res.data)
      return res.data
    })
}
methods.post = async (data) => {
  console.log("appfunctions.call", data);
  let { endpoint, config, type } = data;
  // let apiurl = initial.api() + endpoint;
  // console.log(apiurl);

  return fetch(endpoint, config)
    .then(res => {
      return res.json();
    })
    .then(res => {
      methods.store({ type, data: res.data })
      console.log('Request Response : ', res.data)
      return res.data
    })
}
methods.call2 = async (data) => {
  console.log("appfunctions.call", data);
  let { endpoint, config, type } = data;
  // let apiurl = initial.api() + endpoint;
  // console.log(apiurl);

  return fetch(endpoint, config)
    .then(res => {
      return res.json();
    })
    .then(res => {
      methods.store({ type, data: res })
      console.log('Request Response : ', res)
      return res
    })
}
methods.fetchCollection = async (data) => {
  const { type, self } = data;
  // console.log(that.state);
  // let self = that;
  self.setState({
    something: 'test'
  })
  let endpoint = initialise.api() + '/' + type;
  let config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }
  // type
  const collection = await methods.call({ endpoint, config, type });
  methods.store(type, collection)
  console.log('Collection', collection)
  return collection
}
// methods.postCollection = async (data) => {
//   const { type, self, payload, endpoint } = data;

//   let config = {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(payload)
//   }
//   return fetch(endpoint, config)
//     .then(res => {
//       return res.json();
//     })
//     .then(res => {
//       methods.store({ type, data: res })
//       console.log('Request Response Post Messages : ', res)
//       return res
//     })
//   // type
//   // const collection = await methods.post({endpoint, config, type});
//   // methods.store(type,collection)
//   // console.log('Collection',collection)
//   // return collection
// }
// methods.fetchCollectionLocal = async (data) => {
//   const { endpoint, type, self } = data;
//   let config = {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json"
//     }
//   }

//   const collection = await methods.call2({ endpoint, config, type });
//   methods.store(type, collection)
//   console.log('Collection', collection)
//   return collection
// }
// methods.singleConversationFromArray = async (data) => {
//   const { collection, activeChef } = data;
//   console.log('data', data);
//   let conv = {};
//   for (let item of data.collection) {
//     if (item.participants.includes(activeChef._id)) {
//       conv = { hasData: true, data: item };
//     }
//     else {
//       conv = {
//         hasData: false
//       }
//     }
//   }
//   if (!conv.hasData) {

//     let recipientID = activeChef._id;
//     let currentUserId = JSON.parse(localStorage.getItem('account')).user.sub;
//     let existingConversations = JSON.parse(localStorage.getItem('conversations'));
//     let newConversation = {
//       "_id": Math.random().toString(36).substr(2, 10),
//       "participants": [
//         currentUserId,
//         recipientID
//       ],
//       "messages": []
//     }
//     existingConversations.push(newConversation);
//     console.log('existingConversations', existingConversations);
//     const collection = await methods.postCollection({ endpoint: "https://jsonblob.com/api/7986d895-eb1d-11e9-9c02-633d90d7f5ff", type: 'conversations', self: this, payload: existingConversations })

//     console.log('singleConversationFromArray', collection)


//   }
//   else {
//     return conv
//   }

// }
methods.fetchConversations = async (data) => {
  const { endpoint, type, self } = data;
  let config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }
  const collection = await methods.call2({ endpoint, config, type });
  methods.store(type, collection)
  console.log('Collection', collection)
  return collection
}
// methods.fetchConversation = async (data) => {
//   const { endpoint, type, self } = data;
//   let config = {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json"
//     }
//   }
//   // let conversations = await methods.checkIfConversationExists(doc);

//   const collection = await methods.call2({ endpoint, config, type });
//   let activeChef = JSON.parse(localStorage.getItem('activeDoc'));
//   let data_ = {
//     collection, activeChef
//   }

//   // let currentUserId = JSON.parse(localStorage.getItem('account')).user.sub;
//   const singleConversation = methods.singleConversationFromArray(data_)
//   console.log('singleConversation', singleConversation);

//   // methods.store(type, collection)
//   // console.log('Collection', collection)
//   // return collection
// }
methods.updateDoc = async (payload) => {
  let { doc, self } = payload;
  console.log(this.state)
  let endpoint = initialise.api() + '/' + doc._id;
  let config = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    }
  }
  const type = "activeDoc";
  return await methods.call({ endpoint, config, type });
  // return doc
}
methods.syncActiveDoc = (payload) => {
  let { doc, self } = payload;
  self.setState({ activeItem: doc });
  methods.store({ type: "activeDoc", data: doc })
  // let gs_local = JSON.parse(window.localStorage.globalState);
  // gs_local.activeProject = data
  // setGlo?bal({
  // activeProject: data
  // });
  // localStorage.setItem("globalState",JSON.stringify(gs_local))
}
methods.syncDoc = (payload) => {
  let { doc, self } = payload;
  this.updateActiveProject(doc);
  methods.syncActiveDoc(doc);

  let url = getGlobal().api + '/projects/' + doc._id;

  fetch(url, {
    method: "PATCH",
    body: JSON.stringify(doc),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log("Updated Project", data);
      this.fetchProjects();
      this.refresh();
      setTimeout(() => {
      }, 1500);
    });
}
methods.checkIfConversationExists = async (doc) => {

  let conversations = JSON.parse(localStorage.getItem('conversations'));
  // let conversations = 
  if (!doc) {
    return conversations
  }
  console.log('Messages', conversations)
  let recipientID = doc._id;
  // console.log('Check', , doc._id)
  let conversationExists1 = {}
  if (conversations.length > 0) {
    for (let item of conversations) {
      // console.log('Check', item, doc._id)

      if (item.participants.includes(doc._id)) {
        conversationExists1 = { exists: true, doc: item }
      }
      else {
        conversationExists1 = { exists: false, doc: item }
      }
    }
  }
  else {
    conversationExists1 = false
  }
  // let findMessage = messages.find(r => r.recipient._id === doc._id);
  // let conversationExists = Boolean(messages.find(r => r.recipient._id === doc._id))
  // console.log('converationExists',conversationExists);
  let currentUserId = JSON.parse(localStorage.getItem('account')).user.sub;

  let newConversation = {
    "_id": Math.random().toString(36).substr(2, 10),
    "participants": [
      currentUserId,
      recipientID
    ],
    "messages": []
  }

  console.log('newConversation', newConversation)
  // console.log('find',Boolean(messages.find(r => r.recipient._id === doc._id)))

  if (!conversationExists1) {
    conversations.push(newConversation)
    console.log('Messages payload', conversations);
    const collection = await methods.postCollection({ endpoint: "https://jsonblob.com/api/7986d895-eb1d-11e9-9c02-633d90d7f5ff", type: 'conversations', self: this, payload: conversations })
    console.log('updated conversations', collection)
    return { collection, conversationExists1 }
  }
  else {
    return { conversations, conversationExists1 }
  }
}
// methods.getRecipientDetail = async (data) => {
//   const { doc, self } = data;
//   console.log('getRecipientDetail doc', data)
//   console.log('getRecipientDetail doc', data.doc.participants)
//   let p = data.doc.participants;

//   const participants_ = { ...p };
//   const userid = JSON.parse(localStorage.getItem('account')).user.sub;
//   // const chefs = getGlobal().chefs;
//   // const index = participants_.indexOf(userid);
//   // let newArray = participants_.splice(index, 1);
//   let recipientUserId = participants_[0];
//   // let recipient = chefs       
//   // let recipient = chefs.find(o => o._id === recipientUserId);
//   let recipient = window.db.users.find({ _id: recipientUserId }, (e, r) => {
//     doc.recipient = r[0];
//     self.setState({ ready: true, conversation: doc })
//     // console.log('getRecipientDetail doc',doc)
//     // conversations_.push(item)
//     return doc
//   });
// }
methods.findConversation = async (data) => {
  const { recipientID, userID } = data;
  return await window.db.conversations.find({
    $and: [{ participants: recipientID }, { participants: userID }]
  }, function (e, r) {
    console.log('methods.findConversation', r[0])
    return r
  })

}
export default methods;
