import { getGlobal, setGlobal } from 'reactn';
import methods from '../../../utils/methods';

let Fn = {};
// window.Fn = Fn
Fn.submitBio = async(data) => {
  let data_ = {
    "extended": {
      "profile": {
        "bio": data
      }
    }
  }
  let apiUrl = 'http://3.135.242.213:8010/nedb/users'
  let config = {
    method: "PUT",
    body: JSON.stringify(data_)
  }

  await fetch(apiUrl, config).then(res => {
    return res.json()
  }).then(res => {
    console.log('submitBio response',res)
    return res
  })

}
Fn.sleep = async(fn) => {
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }
}
Fn.fetchProjects2 = async(data) => {
    const { city, self } = data;
    console.log('[[ Fn fetchProjects2 data ]]', data);

    let apiurl = "https://homeproject-51a6.restdb.io/rest/";
    let collection = 'appusers';

    let query =  '?q={"extended.config.type": "project", "extended.location.County":"' + city + '"}';
    let endpoint = apiurl + collection + query;

    console.log('[[ Endpoint ]]', endpoint)
    let config = {
      method: "GET",
      headers: {
        "origin": "localhost:3000",
        "x-apikey": "5dbadbac64e7774913b6e751",
        "Content-Type": "application/json"
      }
    }
    return fetch(endpoint, config).then(res => {

      return res.json()
    }).then(projects => {
      console.log('projects', projects)
      // this.setState({ ready: true })
      self.setState({
              activeProject: projects[0],
              projects: projects,
              ready: true,
              drawerReady: true,     
              locationIsSet: true       
            })
            setGlobal({activeProject: projects[0], projects: projects})

    })
}
Fn.fetchConvversations = async(data) => {
  const { userID, self } = data;
  console.log('[[ Fn fetchProjects2 data ]]', data);

  let apiurl = "https://homeproject-51a6.restdb.io/rest/";
  let collection = 'conversations';

  let query =  '?q={"participants": "'+ userID +'"}';
  let endpoint = apiurl + collection + query;

  console.log('[[ Endpoint ]]', endpoint)
  let config = {
    method: "GET",
    headers: {
      "origin": "localhost:3000",
      "x-apikey": "5dbadbac64e7774913b6e751",
      "Content-Type": "application/json"
    }
  }
  return fetch(endpoint, config).then(res => {
    return res.json()
  }).then(conversations => {
    console.log('[[ conversations ]]', conversations)  
    return Fn.findActiveConversations({ conversations, self })
  })
}
// Fn.fetchNotifications = async(data) => {
//   const { userID, self } = data;
//   console.log('[[ Fn fetchProjects2 data ]]', data);

//   let apiurl = "https://homeproject-51a6.restdb.io/rest/";
//   let collection = 'notifications';

//   let query =  '?q={"sub": "'+ userID +'"}';
//   let endpoint = apiurl + collection + query;

//   console.log('[[ Endpoint ]]', endpoint)
//   let config = {
//     method: "GET",
//     headers: {
//       "origin": "localhost:3000",
//       "x-apikey": "5dbadbac64e7774913b6e751",
//       "Content-Type": "application/json"
//     }
//   }
//   return fetch(endpoint, config).then(res => {
//     return res.json()
//   }).then(notifications => {
//     console.log('[[ notifications ]]', notifications)  
//     self.setState({
//       ready: true,
//       notifications: notifications, 
//       activeNotification: notifications[0]
//     })
//     // return Fn.findActiveConversations({ notifications, self })
//   })
// }
Fn.getRecipientDetail = async(data) => {
  const { item } = data;
  console.log('[[ Fn.getRecipientDetail  ]]', item)
  let participants = item.participants;
  let userID = getGlobal().account.sub;
  let index = participants.indexOf(userID);
  let p = [...participants];
  p.splice(index,1);
  let recipientID = p[0];

  let apiurl = "https://homeproject-51a6.restdb.io/rest/";
  let collection = 'appusers';

  let query =  '?q={"sub": "'+ recipientID +'", "extended.config.onboardingcomplete": true }';
  let endpoint = apiurl + collection + query

  console.log('[[ Endpoint ]]', endpoint)
  let config = {
    method: "GET",
    headers: {
      "origin": "localhost:3000",
      "x-apikey": "5dbadbac64e7774913b6e751",
      "Content-Type": "application/json"
    }
  }
  return fetch(endpoint, config).then(res => {
    return res.json()
  }).then(user => {
    console.log('[[ Recipient Detail ]]', user)  
    item.recipient = user[0];
    return item
    // return 
    // return Fn.findActiveConversations({ conversations, self })
  })
}
Fn.findActiveConversations = async(data) => {
    const { conversations, self } = data;
    let active = [];
    for(let item of conversations) {
      if(item.messages.length > 0) {
        active.push(item)
      }
    }
    self.setState({
      // ready: true,
      activeConversation: active[0],
      conversations: active,
      // conversations: res
    });

    let array = [];
    for(let item of active){
      let item_ = await Fn.getRecipientDetail({item});
      //  = res;
      array.push(item_)
    }
    // return array
    self.setState({
      ready: true,
      activeConversation: array[0],
      conversations: array,
      // conversations: res
    });

}
Fn.fetchProjects = async(data) => {
    const { city, self } = data;
    self.setState({
        progressBarActive: true,
        progressBarPercent: 10,
        locationQueryCity: city
      })
  
      setTimeout(() => {
        self.setState({
          progressBarPercent: 20
        })
        setTimeout(() => {
          self.setState({
            progressBarPercent: 30
          })
          window.db.users.find({ 'config.type': "project", 'location.city': city }, (err, projects) => {
            // console.log('fetchProjects', projects)
            setTimeout(() => {
              self.setState({
                progressBarPercent: 60
              })
              setTimeout(() => {
                self.setState({
                  progressBarPercent: 80,
                  activeProject: projects[0],
                  projects: projects,
                  ready: true,
                  drawerReady: true
                })
                setGlobal({activeProject: projects[0]})
                setGlobal({ 'projects': projects })
                // console.log('state', self.state)
                setTimeout(() => {
                  self.setState({
                    progressBarPercent: 100,
                    progressBarActive: false,
                    locationIsSet: true,
                    showLocationForm: false                
                  })
                }, 500)
              }, 500)
            }, 500)
          })
        }, 1000)
      }, 1000)
}
Fn.setLocation = async(data) => {
    const { self } = data;
    const locationIsSet = JSON.parse(localStorage.getItem('locationIsSet'));
    
    
    if(locationIsSet === true) {
      const location = JSON.parse(localStorage.getItem('location'));
      console.log('[[ locationIsSet ]]',JSON.parse(localStorage.getItem('location')))
      self.setState({
        locationIsSet: true,
        locationQueryCity: location.County,
        showLocationForm: false,
        location: location,
        searchCity: location.County
      })
      setGlobal({location: location, locationIsSet: true})
      return Fn.fetchProjects2({city: location.County, self: self })      
    }
    else {
      console.log('[[ locationIsNotSet ]]')
      self.setState({
        locationIsSet: false,
        locationQueryCity: null,
        showLocationForm: true
      })      
      setGlobal({locationIsSet: false})
    }  
}
Fn.sendMessage = async(data) => {
    const { doc, self } = data;
    let conversations_ = JSON.parse(localStorage.getItem('conversations'));
    console.log('Existing conversations', conversations_);
    let conversations = await methods.checkIfConversationExists(doc);
    console.log('sendMessage conversations', conversations)
    setGlobal({ sendMessage: true, activeDoc: conversations.conversationExists1.doc, recipient: doc })
    self.setState({ toMessages: true })
}
Fn.refresh = async(data) => {
    const { self } = data;
    self.setState({
        ready: false
      });
      const location = JSON.parse(localStorage.getItem('location'));
      console.log('refresh city',location)
      setTimeout(() => {
        Fn.fetchProjects2({ city: location.County, self: self })
      }, 1000)
}
Fn.showDrawer = async(data) => {
    const { project, self } = data;
    console.log('showDrawer', project);
    setGlobal({
      activeProject: project
    });
    self.setState({
      projectInfoVisible: true,
      activeProject: project,
      conversationReady: true,
      activeTab: "1"
    });

    localStorage.setItem("activeProject", JSON.stringify(project))
}
Fn.hideDrawer = async(data) => {
    const { self } = data;
    self.setState({
        activeTab: '1',
        projectInfoVisible: false,
        conversationReady: false
      });
      setTimeout(() => {
        self.setState({
          drawerReady: false
        })
        setTimeout(() => {
          self.setState({
            drawerReady: true
          })
        }, 500)
      }, 500)
}
Fn.submitReservationRequest = async(data) => {
    await window.db.reservations.insert(data, (err, res) => {
        if (err) { console.error(err) }
        else {
          console.log(res)
          return res
        }
      })
}
export default Fn