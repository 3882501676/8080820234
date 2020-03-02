import { setGlobal } from "reactn";
import appconfig from "../config/app.config.js";
import alertMessages from "./alertMessages";
import methods from "../methods/index.js";
import { notification, message } from "antd";
import mailsend from "../methods/mailSend.js";
import moment from "moment";
import notificationTypes from "../util/notifications.js";
// import {} fr
// import Investments from '';
// import appconfig from '../config/app.config.js'
var success = new Set([]);

var success_ = new Set([]);

// export const util = {};
export const app = {
  get: label => {
    // console.log(' get ', label, localStorage[label])

    if (localStorage.getItem(label) === null) {
      // console.log('object is undefined')
      // // console.log('label',localStorage[label])
      // return
      // return data
      return {};
    }
    if (localStorage.getItem(label) !== null) {
      // console.log('object is not undefined')

      let a = localStorage.getItem(label);

      // console.log(' ')
      // console.log(' ')
      // console.log('localStorage[label]', label, localStorage[label])
      // console.log(' ')

      if (a !== "undefined") {
        // console.log(' ')
        // console.log(' ')
        // console.log('a',a)
        // console.log(' ')

        return JSON.parse(a);
      } else {
        return {};
      }
    }

    // else {

    //     let a = localStorage[label]
    //     // // console.log('[[ Fn.get a ]]', a)
    //     return JSON.parse(a)
    // }
  },
  set: (label, value) => {
    localStorage.setItem(label, JSON.stringify(value));
  },
  fetchUnreadMessages: async (__) => {

    return new Promise(async resolve => {

      const { self, userId } = __

      await app.fetchConversations({ self, userId, type: 'private' }).then(conversations => {

        // let unreadC = []
        let unread = new Set()

        for (let item of conversations) {

          for (let message of item.messages) {

            if (!message.seen.includes(userId)) {

              if ([...unread].filter(a => a.conversation.id === item.id).length === 0) {
                unread.add({ conversation: item, messages: new Set() })
              }

              if ([...unread].filter(a => a.conversation.id === item.id).length > 0) {
                [...unread].filter(a => a.conversation.id === item.id)[0].messages.add(message)
              }

            }
          }

        }


        console.log('** Unread', [...unread])
        // let messages;

        resolve([...unread])

      })


    })


  },
  fetchConversations: async __ => {
    // console.log('  ')
    // console.log('  ')
    // console.log('  ')
    // console.log(" ");
    // console.log(" ");
    // console.log(" ");
    // console.log("[[ fetchConversations ]]", data);
    // console.log(" ");
    // console.log(" ");
    // console.log(" ");

    const { self, userId, type } = __;


    return new Promise(async resolve => {
      // let url =
      //   "https://api.crew20.devcolab.site/v1/conversations/?participants=" +
      //   userId +
      //   "&type=" +
      //   type;

        let url =
        "https://dev.iim.technology/v1/conversations/?participants=" +
        userId +
        "&type=" +
        type;

      // console.log("conv fetch url ", url);

      await fetch(url)
        .then(async res => {
          return res.json();
        })
        .then(async conversations => {
          // console.log("Conv RES ", res);

          Fn.set("conversations", conversations);

          resolve(conversations);
        });
    });
  },
  checkConversationExists: async __ => {
    // console.log('  ')
    // console.log('  ')
    // console.log('  ')

    return new Promise(async resolve => {

      const { self, selfUserId, recipientId } = __;

      // console.log('checkConversationExists', data)

      // let url1 =
      //   "https://api.crew20.devcolab.site/v1/conversations/?participants=" +
      //   selfUserId;
      // let url2 =
      //   "https://api.crew20.devcolab.site/v1/conversations/?participants=" +
      //   recipientId;

         let url1 =
        "https://dev.iim.technology/v1/conversations/?participants=" +
        selfUserId;
      let url2 =
        "https://dev.iim.technology/v1/conversations/?participants=" +
        recipientId;

      let conv1 = await fetch(url1)
        .then(res => {
          return res.json();
        })
        .then(res => {
          // console.log('conv1 ', res)
          return res;
        });
      let conv2 = await fetch(url2)
        .then(res => {
          return res.json();
        })
        .then(res => {
          // console.log('conv2 ', res)
          return res;
        });

      let match;
      let exists = false;
      for (let item of conv1) {
        let id = item.id;
        for (let item_ of conv2) {
          let id_ = item_.id;
          if (id === id_) {
            if (item_.type === "private") {

              let a = item;
              let b = item_;
              let c = { ...a, ...b };
              // console.log("Found existing conversation", c);
              match = c;
              exists = true;
            }
            if (item_.type === "group") {

              let a = item;
              let b = item_;
              let c = { ...a, ...b };
              // console.log("Found group conversation", c);
              match = c;
              exists = false;
            }

            // else {
            //   match = null;
            //   exists = false;
            // }

            // if(c.participants.length > 2) {
            //   exists = false
            //   // return
            // }
            // else {

            // }
          }
          // else {
          //     exists
          // }
        }
      }
      // console.log('match', match)
      // Fn.store({ label: 'activeConversation', value: match})

      // let exists = match.length > 0 ? true : false

      // console.log('[[ EXISTS ]]', exists, match )
      resolve({ exists: exists, conversation: match })
      // return { exists: exists, conversation: match };

      // if(res.length > 0) {
      //     // console.log(' ')
      //     // console.log('[[ Conversation Exists ]]')
      //     // console.log(' ')
      //     return true
      // }
      // else {
      //     // console.log(' ')
      //     // console.log('[[ Conversation does Not Exist ]]')
      //     // console.log(' ')
      //     return false
      // }
    })

  },
  updateConversation: async __ => {

    return new Promise(async resolve => {

      const { self, conversation, updateTimestamp } = __;


      conversation.updatedAt = new Date()
      conversation.lastUpdate = new Date()

      if (updateTimestamp) {
        conversation.lastUpdate = new Date()
      }
      // console.log('app.updateConversation => conversation ', conversation)


      let apiUrl = api.url("conversations") + conversation.id;


      let config = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conversation)
      };

      return await fetch(apiUrl, config)
        .then(res => {
          return res.json();
        })
        .then(conversation_ => {

          // console.log('** updated conversation', conversation )

          // let index = self.props.activeConversationIndex;
          if (self.props.conversations) {
            let conversations = self.props.conversations;
            let index = conversations.findIndex(a => a.id === conversation_.id);
            conversations[index] = conversation_;

            // conversations[index] = conversation_;

            // conversations[index].authors = conversation.authors;

            // console.log("conversations", conversations, conversation);

            self.props.updateActiveConversation({
              conversations: conversations,
              activeConversation: conversation_
              // activeConversation:
            });
          }


          resolve(conversation)
        })

    })

  },
  findCurrency: async __ => {
    // const { self } = __;
    const { country } = __;
    return new Promise(async resolve => {
      if (country) {
        // const country = self.state.country;
        let url = "https://restcountries.eu/rest/v2/name/" + country;
        await fetch(url, (err, res) => {
          return res;
        })
          .then(res => {
            return res.json();
            // // console.log('Country data',res)
          })
          .then(res => {
            // return res.json()
            // console.log('Country data', res[0].currencies[0]);
            // setGlobal({
            //   activeCurrencyIsSet: true,
            //   activeCurrency: res[0].currencies[0],
            //   baseCurrency: res[0].currencies[0]
            // });
            let currency = res[0].currencies[0];
            localStorage.setItem(
              "activeCurrency",
              JSON.stringify(res[0].currencies[0])
            );
            localStorage.setItem(
              "baseCurrency",
              JSON.stringify(res[0].currencies[0])
            );
            localStorage.setItem("activeCurrencyIsSet", JSON.stringify(true));

            resolve(currency);
          });
      }
    });
  },
  reverseGeocodeCity: async __ => {
    // // console.log('[[ Fn.reverseGeocodeCity ]]');
    // const { self } = __;
    const { lat, long } = __;
    return new Promise(async resolve => {
      let url =
        "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=" +
        lat +
        "," +
        long +
        ",250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=ZZN2MPuexLyuz3VR0KDD&app_code=TnEsVJR8k3zxGMiAkbP_EQ";
      fetch(url, (e, r) => {
        return r;
      })
        .then(res => {
          return res.json();
        })
        .then(res => {
          // // console.log('reverse geocode res', res)

          // // console.log('[[ Fn.reverseGeocodeCity ]]', JSON.stringify(res.Response && res.Response.View && res.Response.View[0] && res.Response.View[0].Result[0] && res.Response.View[0].Result[0].Location && res.Response.View[0].Result[0].Location.Address));

          let data =
            res.Response &&
            res.Response.View[0] &&
            res.Response.View[0].Result[0] &&
            res.Response.View[0].Result[0].Location &&
            res.Response.View[0].Result[0].Location.Address &&
            res.Response.View[0].Result[0].Location.Address.AdditionalData;
          let location =
            res.Response &&
            res.Response.View[0] &&
            res.Response.View[0].Result[0] &&
            res.Response.View[0].Result[0].Location &&
            res.Response.View[0].Result[0].Location.Address;
          let address =
            res.Response &&
            res.Response.View[0] &&
            res.Response.View[0].Result[0] &&
            res.Response.View[0].Result[0].Location &&
            res.Response.View[0].Result[0].Location.Address;

          // for (let item of data) {
          //   if (item.key === "CountryName") {
          //     let country = item.value;
          //     // console.log('country', country);
          //     self.setState({ country: country, countrySet: true });
          //   }
          // }
          // self.setState({
          //   location: address,
          //   city: address.County,
          //   suburb: address.District,
          //   province: address.State,
          //   searchFormReady: true,
          //   ready: true
          // });
          // Fn.findCurrency({ self });
          // console.log('[[ store : location ]]', location)
          methods.store({ type: "location", data: location });
          methods.store({ type: "locationIsSet", data: true });

          resolve(location);
        });
    });
  },
  getGeoLocation: async __ => {
    // const { self } = __;

    return new Promise(async resolve => {
      const setPosition = data_ => {
        console.log("[[ getGeoLocation ]]", data_);
        // // console.log('getGeolocation', data_)

        // self.setState({
        //   lat: data_.coords.latitude || 0,
        //   long: data_.coords.longitude || 0
        // });

        // Fn.reverseGeocodeCity({ self });
        let data = {
          lat: data_.coords.latitude || 0,
          long: data_.coords.longitude || 0
        };

        resolve(data);
      };

      if (typeof window.navigator.geolocation !== "undefined") {
        window.navigator.geolocation.getCurrentPosition(setPosition);
      }
    });
  },
  createProject: async __ => {
    const { self, project } = __;

    message.config({
      top: 250,
      duration: 0,
      maxCount: 10
    });

    message.loading("Creating project ... ");

    let one = await app
      .createProjectMain({ self, project })
      .then(async project => {
        // message.destroy();
        message.loading("Configuring additional data ... ");

        await app
          .createProjectConversations({ self, project })
          .then(async project => {
            // message.destroy();
            message.loading("Configuring conversations ... ");

            await app
              .createProjectCalendar({ self, project })
              .then(async project => {
                // message.destroy();
                message.loading("Configuring calendar ... ");

                console.log("createProjectCalendar res => project ", project);
                await app
                  .createProjectRoster({ self, project })
                  .then(async project => {
                    // message.destroy();
                    message.loading("Configuring roster ... ");

                    // setTimeout(() => {
                    //   message.destroy();
                    // },2000)
                  })
                  .then(async project => { });
              });
          });
      });

    // let two = one && await app.createProjectConversations({ self, project: one }).then( async project => {
    //   // message.destroy();
    //   message.loading('Configuring additional data 2 ... ');
    // })

    // let three = two && await app.createProjectRoster({ self, project: two }).then( async project => {
    //   // message.destroy();
    //   message.loading('Configuring additional data 3 ... ');

    //   setTimeout(() => {
    //     message.destroy();
    //   },2000)
    // })
  },
  createProjectMain: async __ => {
    const { self, project } = __;

    return new Promise(async resolve => {
      // project.owner = Fn.get('account').user.id;

      let p = {};
      p.title = project.projectName;

      p.description = "";
      p.type = project.projectType;

      p.start_date = project.projectDate;
      p.end_date = project.projectEndDate;
      p.positions = project.positions;

      console.log("project", project);
      p.location =
        typeof project.location.address.county !== "undefined"
          ? project.location.address.county
          : project.location.address.county;

      p.owner = Fn.get("account").user.id;
      p.crew = [];
      p.productionCrew = [
        {
          user: Fn.get("account").user.id,
          permissions: [
            "projectfiles",
            "projectsettings",
            "projectpeople",
            "projectchecklists",
            "projectratecalculator"
          ]
        }
      ];
      p.comments = [];
      p.invited = project.invited;

      p.shortlist = project.shortlist;

      p.createdAt = new Date();
      p.checklists = [];
      p.threads = [];
      p.conversations = [];

      let days = await Fn.getDates(project.projectDate, project.projectEndDate);
      p.days = days;

      console.log(" ");
      console.log(" ");
      console.log("[[ Project to create ]] ", JSON.stringify(p));
      console.log(" ");
      console.log(" ");

      // let apiUrl = "https://api.crew20.devcolab.site/v1/projects/";
      let apiUrl = api.url("projects");

      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(p)
      };

      return await fetch(apiUrl, config)
        .then(res => {
          return res.json();
        })
        .then(res => {
          console.log("Project Created", res);

          resolve(res);
        });
    });
  },
  createProjectConversations: __ => {
    const { self, project } = __;

    console.log("createProjectConversations", __);

    return new Promise(async resolve => {
      let conversation = await app
        .createProjectConversation({
          self,
          projectOwner: Fn.get("account").user.id,
          type: "event"
        })
        .then(async conversation_ => {
          project.conversationId = conversation_.id;

          let days = project.days;

          for (let item of days) {
            let conv = await app.createProjectConversation({
              self,
              projectOwner: Fn.get("account").user.id,
              type: "project"
            });

            if (conv) {
              let item_ = {
                day: item,
                conversationId: conv.id
              };
              project.conversations.push(item_);
            }
          }

          await app.updateProject({ self, project }).then(project => {
            console.log("updated project with conversations", project);

            resolve(project);
          });
        });
    });
  },
  updateProjectConversations: __ => {

    const { self, project } = __;

    console.log("createProjectConversations", __);

    return new Promise(async resolve => {

      let days = project.days;

      for (let day of days) {
        if (project.conversations.filter(a => a.day === day).length === 0) {
          await app.createProjectConversation({
            self,
            projectOwner: Fn.get("account").user.id,
            type: "project"
          }).then(conversation => {

            let item_ = {
              day: day,
              conversationId: conversation.id
            }

            project.conversations.push(item_)

          })

        }

      }

      await app.updateProject({ self, project }).then(project => {
        console.log("updated project with conversations", project);

        resolve(project);
      });
    });
  },
  createProjectCalendar: __ => {
    const { self, project } = __;

    console.log("createProjectRoster", __);

    return new Promise(async resolve => {

      let monthNames_ = new Set();

      let months = [];

      let days_ = project.days;

      // let diff = end.diff(start, 'months', false);
      for (let day of days_) {
        let monthName = moment(day).format("MMMM");
        monthNames_.add(monthName);
      }

      let monthNames = [...monthNames_];

      console.log("monthNames", monthNames);

      for (let month of monthNames) {
        let days__ = [];
        let itinerary_ = []

        for (let day of days_) {
          let dayMonth = moment(day).format("MMMM");

          if (dayMonth === month) {
            days__.push(day);
            itinerary_.push({
              day: day,
              items: [],
              slots: new Array(24).fill(false)
            })
          }
        }

        let month__ = {
          name: month,
          days: days__,
          itinerary: itinerary_
        };

        months.push(month__);
      }

      project.calendar = months;

      await app.updateProject({ self, project }).then(project => {

        console.log("updated project with conversations", project);

        resolve(project);
      });

      // resolve(project);
    });
  },
  createProjectRoster: async __ => {
    const { self, project } = __;

    return new Promise(async resolve => {
      // let crew_ = this.state.crew;
      let crew = project.crew;
      let days = project.days;

      let crewRoster = project.crewRoster || [];

      for (let item of crew) {
        if (!crewRoster.filter(a => a.user === item.id).length > 0) {
          let rosterItem = {
            user: item.id,
            days: [],
            rate: 0
          };

          for (let day of days) {
            rosterItem.days.push({ day, selected: true });
          }

          crewRoster.push(rosterItem);
        }
        // else {

        // }
      }

      console.log("crewRoster", crewRoster);

      project.crewRoster = crewRoster;

      await app.updateProject({ self, project }).then(project => {
        console.log("updated project crew roster", project);

        resolve(project);
      });
    });
  },
  lastFetch: async __ => {
    return new Promise(async resolve => {
      const { type } = __;

      let lastFetchTime = Fn.get(type).time;

      resolve(lastFetchTime);
    });
  },
  checkAuth: async __ => {
    // const { self } = __

    // console.log(" ");
    // console.log(" ");
    // console.log("App checkAuth");
    // console.log(" ");
    // console.log(" ");

    return new Promise(async resolve => {
      if (localStorage.getItem("isAuthenticated") === null) {
        localStorage.clear();
        localStorage.setItem("isAuthenticated", JSON.stringify(false));
        localStorage.setItem(
          "env",
          JSON.stringify({ env: "production", set: true })
        );
        ui.checkmobile();
        __.props.history.push("/");
        resolve(JSON.parse(localStorage.isAuthenticated));
      }
      if (JSON.parse(localStorage.isAuthenticated) === false) {
        localStorage.clear();
        localStorage.setItem("isAuthenticated", JSON.stringify(false));
        localStorage.setItem(
          "env",
          JSON.stringify({ env: "production", set: true })
        );
        ui.checkmobile();
        __.props.history.push("/");
        resolve(JSON.parse(localStorage.isAuthenticated));
      }
    });
  },
  //   checkAuth: __ => {
  //     // const { self } = __

  //     console.log(" ");
  //     console.log(" ");
  //     console.log("App checkAuth");
  //     console.log(" ");
  //     console.log(" ");

  //     if (localStorage.getItem("isAuthenticated") === null) {
  //       __.props.history.push("/");
  //       localStorage.clear();
  //       localStorage.setItem("isAuthenticated", JSON.stringify(false));
  //       localStorage.setItem(
  //         "env",
  //         JSON.stringify({ env: "production", set: true })
  //       );
  //       ui.checkmobile();
  //     }
  //     if (JSON.parse(localStorage.isAuthenticated) === false) {
  //       __.props.history.push("/");
  //       localStorage.clear();
  //       localStorage.setItem("isAuthenticated", JSON.stringify(false));
  //       localStorage.setItem(
  //         "env",
  //         JSON.stringify({ env: "production", set: true })
  //       );
  //       ui.checkmobile();
  //     }
  //   },
  setEnv: () => {
    // console.log(" ");
    // console.log(" ");
    // console.log("Set Env");
    // console.log(" ");
    // console.log(" ");

    console.log("process.NODE_ENV", process.NODE_ENV);
    if (localStorage.getItem("env") === null) {
    }
  },
  insertNotification: async __ => {
    const { userId, title, content } = __;

    let body = {
      title: title,
      content: content,
      user: userId,
      createdAt: new Date()
    };
    let config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    };
    let url = api.url("notifications");

    await fetch(url, config)
      .then(res => {
        return res.json();
      })
      .then(async res => {
        // return res
        // resolve(res)
        console.log("notification insert res", res);

        await app.sendNotification({ userId, title, content });
        // self.setState({
        //     notifications: res,
        //     ready: true
        // })

        return res;
      });
  },
  sendNotification: async __ => {
    const { self, userId, title, content } = __;

    let user = await api.fetch("users", userId);

    await mailsend.SendNotification({ user, subject: title, content });
  },
  sendConfirmationEmail: async __ => {
    const { self, userId } = __;

    let user = await api.fetch("users", userId);

    // let title = "Please confirm your email address";
    let title = "Confirm your account.";
    let subject = "Confirm your account [ Crew20 ]";
    let content =
      "Please confirm your Crew20 account by clicking the link below:";

    // let link = "https://app.crew20.devcolab.site/confirm/?user=" + userId + "&email=" + user.email;
    let link =
      window.location.protocol +
      "//" +
      window.location.host +
      "/confirm/?user=" +
      userId +
      "&email=" +
      user.email;
    console.log("link", link);

    await mailsend.SendConfirmationEmail({
      user,
      subject,
      title,
      content,
      link
    });
  },
  sendWelcomeEmail: async __ => {
    const { self, userId, title, content } = __;

    let user = await api.fetch("users", userId);

    await mailsend.SendWelcomeEmail({ user, subject: title, content });
  },
  fetchNotifications: async __ => {
    const { self, userId } = __;

    let url = api.url("notifications") + "?user=" + userId;

    await fetch(url)
      .then(res => {
        return res.json();
      })
      .then(res => {
        // return res
        // resolve(res)
        console.log("notifications", res);

        self.setState({
          notifications: res,
          ready: true
        });

        return res;
      });
  },
  fetchProductionCrew: async __ => {
    const { self, project } = __;
    return new Promise(async resolve => {
      let prodCrew = [];
      let productionCrew_ =
        (typeof project.productionCrew !== "undefined" &&
          project.productionCrew) ||
        [];

      console.log("productionCrew_", productionCrew_);
      // productionCrew_.push({ id: project.owner });
      for (let item of productionCrew_) {
        let url = api.url("users") + item.user;

        await fetch(url)
          .then(res => {
            return res.json();
          })
          .then(res => {
            prodCrew.push(res);
          });
      }

      // self.setState({
      //   productionCrew: prodCrew
      // });

      resolve(prodCrew);
    });
  },
  fetchConfirmedCrew: async __ => {
    const { self, project } = __;
    return new Promise(async resolve => {
      let crew = [];
      let crew_ = project.crew;
      // let crew_ = project.invited || [];
      // productionCrew_.push({ id: project.owner })
      for (let item of crew_) {
        let url = api.url("users") + item.id;

        await fetch(url)
          .then(res => {
            return res.json();
          })
          .then(res => {
            crew.push(res);
          });
      }

      let isDeleting = [];
      let isDeletingStart = [];
      let deleteConfirmation = [];

      for (let item of crew) {
        isDeleting.push(false);
        isDeletingStart.push(false);
        deleteConfirmation.push(false);
      }

      if (self && self.setState) {
        self.setState({
          crew: crew,
          isDeleting: isDeleting,
          isDeletingStart: isDeletingStart,
          deleteConfirmation: deleteConfirmation,
          ready: true
        });
      }

      resolve(crew);
    });
  },
  fetchInvitedCrew: async __ => {
    const { self, project } = __;
    return new Promise(async resolve => {
      let invited = [];
      let invited_ = project.invited || [];
      // productionCrew_.push({ id: project.owner })
      for (let item of invited_) {
        let url = api.url("users") + item.id;

        await fetch(url)
          .then(res => {
            return res.json();
          })
          .then(res => {
            invited.push(res);
          });
      }

      let isDeleting = [];
      let isDeletingStart = [];
      let deleteConfirmation = [];

      for (let item of invited) {
        isDeleting.push(false);
        isDeletingStart.push(false);
        deleteConfirmation.push(false);
      }

      if (self && self.setState) {
        self.setState({
          // crew: crew,
          invited: invited,
          isDeleting: isDeleting,
          isDeletingStart: isDeletingStart,
          deleteConfirmation: deleteConfirmation,
          ready: true
        });
      }

      resolve(invited);
    });
  },
  inviteByEmail: async __ => {
    const { self, link, position, project, projectOwner, email } = __;

    let invitation = {
      receiverEmail: email,
      subject: "You have been invited to a project [ Crew20 ]",
      title: "You have been invited to crew for a project on Crew20",
      content:
        projectOwner.profile.name.first +
        " " +
        projectOwner.profile.name.last +
        " has invited you as " +
        position +
        " crew member for their new project. Follow the link to register your account and accept the position. Project details are below.",
      // user: "",
      projectTitle: project.title,
      projectStartDate: project.start_date,
      link: link + "&email=" + email
    };

    console.log("invite by email", __);
    console.log("invite by email invitation", invitation);

    let sent = await mailsend.InviteByEmail(invitation);
    if (sent) {
      console.log("sent", sent);
      setTimeout(() => {
        if (sent.success === true) {
          notification.open({
            message: "Invite Sent",
            description: "Invite sent successfully"
          });
          self.setState({ inviteBusy: false });
          self.inviteByEmailAddress.current.value = null;
        }

        if (sent.success === false) {
          notification.open({
            message: "Invite Send Error",
            description:
              "There was an issue sending the invite. Please try again or contact support."
          });
          self.setState({ inviteBusy: false });
          self.inviteByEmailAddress.current.value = null;
        }
      }, 1000);
    }
  },
  inviteByUser: async __ => {
    const { self, link, position, project, projectOwner, user } = __;

    let invitation = {
      receiverEmail: user.email,
      subject: "You have been invited to a project [ Crew20 ]",
      title: "You have been invited to crew for a project on Crew20",
      content:
        projectOwner.name.first +
        " " +
        projectOwner.name.last +
        " has invited you as " +
        position +
        " crew member for their new project. Follow the link to register your account and accept the position. Project details are below.",
      // user: "",
      projectTitle: project.title,
      projectStartDate: project.start_date,
      link: link
    };

    console.log("invite by email", __);
    console.log("invite by email invitation", invitation);

    let sent = await mailsend.InviteByEmail(invitation);
    if (sent) {
      console.log("sent", sent);
      setTimeout(() => {
        if (sent.success === true) {
          notification.open({
            message: "Invite Sent",
            description: "Invite sent successfully"
          });
          self.setState({ inviteBusy: false });
          //   self.inviteByEmailAddress.current.value = null;
        }

        if (sent.success === false) {
          notification.open({
            message: "Invite Send Error",
            description:
              "There was an issue sending the invite. Please try again or contact support."
          });
          self.setState({ inviteBusy: false });
          //   self.inviteByEmailAddress.current.value = null;
        }
      }, 1000);
    }
  },
  updateNotification: async __ => {
    const { self, notification } = __;
    let url = api.url("notifications") + notification.id;
    let config = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(notification)
    };
    await fetch(url, config)
      .then(res => {
        return res.json();
      })
      .then(res => {
        console.log("notification", res);
      });

    // if (notification) {
    //   setTimeout(() => {
    //     self.setState({ inviteBusy: false });
    //   }, 1000);
    // }
  },
  createNetworkNotification: async __ => {
    const { self, type, sender, receiverId } = __;

    console.log("createNetworkNotification", __);

    let notification = notificationTypes[type]({
      data: { sender: sender },
      user: receiverId
    });

    console.log("notification", notification);

    let url = api.url("notifications");
    let config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(notification)
    };
    await fetch(url, config)
      .then(res => {
        return res.json();
      })
      .then(res => {
        console.log("notification", res);
      });

    if (notification) {
      setTimeout(() => {
        self.setState({ inviteBusy: false });
      }, 1000);
    }
  },
  createNotification: async __ => {
    const { self, type, link, position, project, projectOwner, user } = __;

    console.log("create notification", __);
    // import
    // type === ""
    console.log("notificationTypes", notificationTypes);
    console.log("notificationTypes", notificationTypes[type]);

    let notification = notificationTypes[type]({
      owner: projectOwner,
      data: { sender: projectOwner, project: project },
      user: user
    });
    console.log("notification", notification);

    // let notification = {
    //   user: user.id,
    //   type: type,
    //   title: "You have been invited to crew for " + project.title,
    //   content:
    //     projectOwner.profile.name.first +
    //     " " +
    //     projectOwner.profile.name.last +
    //     " has invited you as " +
    //     position +
    //     " crew member for their new project. Follow the link to register your account and accept the position. Project details are below.",
    //   // user: "",
    //   project: project.id,
    //   createdAt: new Date(),
    //   data: project

    // };

    // console.log("create notification", notification);

    // let notification = await mailsend.createNotification(invitation)
    let url = api.url("notifications");
    let config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(notification)
    };
    await fetch(url, config)
      .then(res => {
        return res.json();
      })
      .then(res => {
        console.log("notification", res);
      });

    if (notification) {
      setTimeout(() => {
        self.setState({ inviteBusy: false });
      }, 1000);
    }
  },
  updateProject: async __ => {
    return new Promise(async resolve => {
      const { self, project } = __;

      let url = api.url("projects") + project.id;

      let config = {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + Fn.get("account").tokens.access.token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(project)
      };

      await fetch(url, config)
        .then(res => {
          return res.json();
        })
        .then(async res => {
          console.log("[[ Updated Project ]]", res);
          Fn.set("activeProject", res);
          resolve(res);
          // self.props.load()

          // Fn.store({ label: 'activePro===', value: res })

          // self.setState({ projects: res, ready: true })
        });
      // resolve()
    });
  },
  updateEvent: async __ => {
    return new Promise(async resolve => {
      const { self, event } = __;

      let url = api.url("events") + event.id;

      let config = {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + Fn.get("account").tokens.access.token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
      };

      await fetch(url, config)
        .then(res => {
          return res.json();
        })
        .then(async res => {
          console.log("[[ Updated Event ]]", res);
          Fn.set("activeEvent", res);
          resolve(res);
          // self.props.load()

          // Fn.store({ label: 'activePro===', value: res })

          // self.setState({ projects: res, ready: true })
        });
      // resolve()
    });
  },
  checkConfirmed: __ => {
    const { invited, crew } = __;
    let invited_ = [];
    console.log("chechConfirmed", invited);
    console.log("chechConfirmed", crew);

    return new Promise(async resolve => {
      for (let item of invited) {
        let filterCrew = crew.filter(a => a.id === item.id);
        let crewIncludesUser = filterCrew.length > 0;

        if (crewIncludesUser) {
          item.isConfirmed = true;
          invited_.push(item);
        } else {
          item.isConfirmed = false;
          invited_.push(item);
        }
      }
      console.log("invited", invited_);
      resolve(invited_);
    });
  },
  createNewConversation: async __ => {
    // console.log('  ')
    // console.log('  ')
    // console.log('  ')
    return new Promise(async resolve => {
      const { self, selfUserId, recipientId } = __;

      let conversation = {
        participants: [selfUserId, recipientId],
        messages: [],
        author: selfUserId,
        type: 'private'
      };
      // console.log('[[ Conv to create ]]', conversation)
      // let apiUrl = "https://api.crew20.devcolab.site/v1/conversations/";
      let apiUrl = "https://dev.iim.technology/v1/conversations/";

     

      let config = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conversation)
      };
      // // console.log('conversation to create ',config)
      return await fetch(apiUrl, config)
        .then(res => {

          return res.json()

        })
        .then(async conversation => {

          // console.log('[[ new Converation created ]]', conversation )

          resolve(conversation)

          // let userId = selfUserId;

          // await Fn.fetchConversations({ self, userId: selfUserId }).then( conversations => {
          //   resolve(conversations)
          // })

          // self.setState({
          //     conversations: res,
          //     activeConversation: res[0],
          //     ready: true
          // })

          // Fn.store({ label: 'conversations', value: res })

          // return res

          // self.props.updateActiveConversation({
          //     conversation: res,
          //     conversationData: {
          //         authorData: self.props.authorData,
          //         recipientData: self.props.recipientData
          //     }
          // })
        });
    })


  },
  createProjectConversation: async __ => {
    // console.log('  ')
    // console.log('  ')
    // console.log('  ')
    return new Promise(async resolve => {
      const { self, projectOwner, type } = __;

      let conversation = {
        participants: [projectOwner],
        messages: [],
        author: projectOwner,
        type: type
      };
      // console.log('[[ Conv to create ]]', conversation)
      // let apiUrl = "https://api.crew20.devcolab.site/v1/conversations/";
      let url = api.url("conversations");
      let config = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conversation)
      };
      // // console.log('conversation to create ',config)
      return await fetch(url, config)
        .then(res => {
          return res.json();
        })
        .then(async res => {
          // return res;

          resolve(res);
          // app.updateProject({ self, project: res })

          // await Fn.fetchConversations({ self, userId: projectOwner });
        });
    });
  },
  fetchSubscribedProjects: async __ => {
    return new Promise(async resolve => {
      const { self, userId } = __;

      let url = api.url("projects") + "?owner=" + userId;

      // console.log("url", url);

      return await fetch(url)
        .then(res => {
          return res.json();
        })
        .then(res => {
          Fn.set("subscribedProjects", res);
          resolve(res);
        });
    });
  },
  fetchEvents: async __ => {
    return new Promise(async resolve => {
      const { self, userId } = __;

      let url = api.url("events") + "?user=" + userId;

      // console.log("url", url);
      let config = {
        // method: "GET",
        headers: {
          Authorization: "Bearer " + Fn.get("account").tokens.access.token,
          "Content-Type": "application/json"
        }
      };
      return await fetch(url, config)
        .then(res => {
          return res.json();
        })
        .then(res => {
          resolve(res);
        });
    });
  },
  // createProjectConversation: async __ => {
  //   // console.log('  ')
  //   // console.log('  ')
  //   // console.log('  ')

  //   const { self, day, projectOwner } = __;

  //   let conversation = {
  //     participants: [projectOwner],
  //     messages: [],
  //     author: projectOwner
  //   };
  //   // console.log('[[ Conv to create ]]', conversation)
  //   // let apiUrl = "https://api.crew20.devcolab.site/v1/conversations/";
  //   let url = api.url('conversations')
  //   let config = {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(conversation)
  //   };
  //   // // console.log('conversation to create ',config)
  //   return await fetch(url, config)
  //     .then(res => {
  //       return res.json();
  //     })
  //     .then(async res => {

  //       return res
  //       // app.updateProject({ self, project: res })

  //       // await Fn.fetchConversations({ self, userId: projectOwner });

  //     })
  // },
  createEvent: async __ => {
    return new Promise(async resolve => {
      const { self, event } = __;

      console.log("event data to insert ", event);

      let conversations = [];

      for (let item of event.days) {
        let conversation = await app.createProjectConversation({
          self,
          projectOwner: event.user,
          type: "event"
        });
        if (conversation) {
          let conv = {
            day: item,
            conversationId: conversation.id
          };
          conversations.push(conv);
        }
      }

      let conversation = await app.createProjectConversation({
        self,
        projectOwner: event.user,
        type: "event"
      });

      if (conversation) {
        event.conversationId = conversation.id;
        event.conversations = conversations;

        let url = api.url("events");
        console.log("event to insert ", event);
        let config = {
          method: "POST",
          headers: {
            Authorization: "Bearer " + Fn.get("account").tokens.access.token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(event)
        };
        console.log("config", config);
        await fetch(url, config)
          .then(res => {
            return res.json();
          })
          .then(res => {
            console.log("createEvent res", res);

            self.setState({
              isOpen: false
            });

            self.reload();

            resolve(res);
          });
      }
    });
  },
  getDates: async (startDate, stopDate) => {
    console.log("getDates", startDate, stopDate);
    return new Promise(async resolve => {
      var dateArray = [];
      var current = moment(startDate);
      var end = moment(stopDate);
      while (current.isBefore(end)) {
        // console.log('isBefore', current.isBefore(end), current.isSame(end))
        dateArray.push(moment(current).format("YYYY-MM-DD"));
        current = moment(current).add(1, "days");
      }
      dateArray.push(moment(end).format("YYYY-MM-DD"));
      // let end

      // while (currentDate <= stopDate) {
      //   dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
      //   currentDate = moment(currentDate).add(1, "days");
      // }
      console.log("getDates", dateArray);
      // return dateArray;
      resolve(dateArray);
    });
  },
  refreshTokensEvery10Minutes: async () => {
    // a.add(10, 'minutes').format('hh:mm')

    // let timestamps = Fn.get('loginTimestamps');
    console.log("refreshTokensEvery10Minutes");

    setInterval(() => {
      console.log("refreshTokensEvery10Minutes");

      app.refreshTokens();
    }, 10 * 60 * 1000);
  },
  refreshTokens: async () => {
    // const url = "https://api.crew20.devcolab.site/v1/auth/refresh-tokens/";

const url = "https://dev.iim.technology/v1/auth/refresh-tokens/"


    let account = Fn.get("account");
    const data = {
      refreshToken: account.tokens.refresh.token
    };
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    await fetch(url, config)
      .then(res => {
        return res.json();
      })
      .then(res => {
        console.log("[[ Refresh Response ]]", res);

        if (res.code === 400 || res.code === 401) {
          notification.open({
            message: "Error",
            description: res.message
          });
        } else {
          console.log("refresh tokens res ", res);
          account.tokens = res;

          Fn.store({ label: "authTokens", value: res });
          Fn.store({ label: "account", value: account });
          Fn.store({ label: "isAuthenticated", value: true });

          let start = moment(new Date().getTime());

          let loginTimestamps = {
            start: start,
            check: start.add(10, "minutes")
          };
          Fn.set("loginTimestamps", loginTimestamps);
          console.log("refreshTokensEvery10Minutes", loginTimestamps);
          // this.setState({ isAuthenticated: true, account: res })
          // this.toggleDialog({ type: null, title: null })
          // this.props.history.push('/dashboard')
          // message.success('Logged In');
        }
      });
  },
  confirmAccount: async __ => {
    const { self, userId, email } = __;
    // const url = "https://api.crew20.devcolab.site/v1/users/";
    let url = api.url("users") + userId;

    let user = await fetch(url)
      .then(res => {
        return res.json();
      })
      .then(res => {
        return res;
      });

    // if(user && user.email !== email) {
    //   notification.open({
    //     message: 'Error',
    //     description:
    //       "Your email address does not match the account address."
    //   })

    // }
    if (user) {
      user.profile.confirmed = true;

      const config = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      };
      await fetch(url, config)
        .then(res => {
          return res.json();
        })
        .then(res => {
          console.log(" ");
          console.log(" ");
          console.log("[[ Account Confirm Response ]]", res);
          console.log(" ");

          self.setConfirmed();
          // self.setState({
          //   confirmed: true
          // })
        });
    }
  },
  updateUser: async __ => {
    return new Promise(async resolve => {
      const { self, user } = __;
      let url = api.url("users") + user.id;
      let config = {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + Fn.get("account").tokens.access.token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      };

      await fetch(url, config)
        .then(res => {
          return res.json();
        })
        .then(res => {

          let account = Fn.get("account");

          account.user = res;

          Fn.set("account", account);

          resolve(user);
        });
    });
  },
  fetchConnections: async data => {
    return new Promise(async resolve => {
      const { self, connections } = data;

      let lastfetch = await Fn.get("connections").time;

      // let shouldFetchNewData = (lastfetch) => {

      //   let time = moment(lastfetch)
      //   let elapsed = time.diff( moment(new Date())) / 1000;
      //   return elapsed > 300

      // }

      let shouldFetch = util.shouldFetchNewData(lastfetch);

      if (shouldFetch) {
        let connections_ = [];

        for (let item of connections) {
          // let apiUrl = 'https://api.crew20.devcolab.site/v1/users/' + item
          let apiUrl = api.url("users") + item;

          await fetch(apiUrl)
            .then(res => {
              return res.json();
            })
            .then(res => {
              // console.log('fetchConnection response', item, res)

              connections_.push(res);
            });
        }

        // console.log('[[ Fetched Connections ]]', connections_)

        Fn.store({
          label: "connections",
          value: { time: new Date(), data: connections_ }
        });

        // return connections_
        // self.setState({
        //   connections: connections_,
        //   connectionsReady: true
        // })
        resolve(connections_);
      } else {
        let connections = Fn.get("connections").data;
        resolve(connections);
      }
    });
  },
  addProductionCrewMember: async __ => {
    return new Promise(async resolve => {
      const { self, userId, project } = __;

      let crew = project.productionCrew;

      let projectOwnerData = await Fn.fetchUser({
        self,
        userId: project.owner
      });
      console.log("projectOwnerData", projectOwnerData);
      let owner = {
        name: projectOwnerData.profile.name,
        picture: projectOwnerData.profile.picture
      };
      console.log("owner", owner);
      if (crew.filter(a => a.user === userId).length === 0) {
        let crewMember = {
          permissions: [],
          user: userId
        };

        project.productionCrew.push(crewMember);

        await app.updateProject({ self, project }).then(async response => {
          //
          // let __ = { data: { project }, user: userId, owner: owner  }

          let notification_ = notificationTypes.prodCrewInvite({
            data: { project, sender: owner },
            user: userId,
            owner: owner
          });

          console.log("notification_", notification_);
          let url = api.url("notifications");
          let config = {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(notification_)
          };
          await fetch(url, config)
            .then(res => {
              return res.json();
            })
            .then(res => {
              console.log("inserted notification", res);
            });

          notification.open({
            message: "Success",
            description: "User added to production crew"
          });
          resolve(response);
        });
      } else {
        notification.open({
          message: "Error",
          description: "User is already part of production crew"
        });

        resolve({ status: "error" });
      }

      // if(crew.filter(a => a.user === userId).length > 0) {

      //   notification.open({
      //     message: "Error",
      //     description: "User is already part of production crew"
      //   });

      //   resolve({ status: 'error'})

      // }
    });
  }
};
export const ui = {
  mobile: () => {
    return Fn.get("isMobile");

    console.log(" ");
    console.log(" ");
    // console.log('App checkAuth')
    console.log(" ");
    console.log(" ");
  },
  checkmobile: () => {
    // console.log(" ");
    // console.log(" ");
    // console.log("UI Check Mobile");
    // console.log(" ");
    // console.log(" ");
    if (window.matchMedia("only screen and (max-width: 760px)").matches) {
      Fn.set("isMobile", true);
    } else {
      Fn.set("isMobile", false);
    }
  }
};
export const util = {
  shouldFetchNewData: async lastfetch => {
    let time = moment(lastfetch);
    let elapsed = time.diff(moment(new Date())) / 1000;
    return elapsed > 300;
  },
  unique: async __ => {
    return new Promise(async resolve => {
      const { array } = __;
      let set = new Set();
      for (let item of array) {
        set.add(item);
      }
      let uniqueArray = Array.from(set);
      resolve(uniqueArray);
    });
  }
};
export const Fn = {
  saveSnapShot: (label, value) => {
    localStorage.setItem(label, JSON.stringify(value));
  },
  initialise: () => { },
  set: (type, value) => {
    localStorage.setItem(type, JSON.stringify(value));
  },
  fetchAuthors: async __ => {
    const { self, authorIds } = __;

    console.log("fetching authors");

    let authors = [];

    for (let authorId of authorIds) {
      let authorData = await api.fetch("users", authorId);
      authors.push(authorData);
      // return authorData
    }

    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log("[[ participants : authors ]] ", authors);
    console.log(" ");
    console.log(" ");
    console.log(" ");

    return authors;
    //   self.setState({
    //     conversations: conversations,
    //     activeConversation: conversations[0],
    //     ready: true,
    //     conversationReady: true

    //   })

    //   setTimeout(() => {
    //     if (document.getElementById('MessagesList')) {
    //       document.getElementById('MessagesList').scroll({
    //         top: 999999999999,
    //         left: 0,
    //         behavior: 'smooth'
    //       });
    //     }
    //   }, 500)
  }
};
export const api = {
  base: () => {
    if (
      localStorage &&
      localStorage.getItem("env") !== null &&
      JSON.parse(localStorage.getItem("env")).set === true
    ) {
      let env = JSON.parse(localStorage.getItem("env")).env;
      // console.log('environment override is active', env)

      if (env === "development") {
        // console.log('appconfig', appconfig, appconfig.api, appconfig.api.dev)
        return appconfig.api.dev;
      }
      if (env === "production") {
        // console.log('appconfig', appconfig, appconfig.api, appconfig.api.prod)
        return appconfig.api.prod;
      }
    } else {
      if (process.env.NODE_ENV === "development") {
        return appconfig.api.dev;
      }
      if (process.env.NODE_ENV === "production") {
        return appconfig.api.prod;
      }
    }
  },
  url: type => {
    if (type) {
      return api.base() + type + "/";
    } else {
      return api.base();
    }
  },
  fetch: async (type, id) => {
    // const { type, id } = __

    return new Promise(async resolve => {
      let url = api.url(type) + id;

      await fetch(url)
        .then(res => {
          return res.json();
        })
        .then(res => {
          // return res
          resolve(res);
        });
    });
  },
  post: async (type, body) => {
    // const { type, id } = __

    return new Promise(async resolve => {
      let url = api.url(type);
      let config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      };

      await fetch(url, config)
        .then(res => {
          return res.json();
        })
        .then(res => {
          // return res
          resolve(res);
        });
    });
  },
  fetch_: async __ => {
    const { self, type, method, id, filter, data } = __;

    let apiUrl = api.url(type);

    let config = {
      headers: {
        "Content-Type": "application/json"
      },
      method: method,
      body:
        method === "POST" || method === "PUT" || method === "PATCH"
          ? JSON.stringify(data)
          : null
    };

    await fetch(apiUrl, config)
      .then(res => {
        return res.json();
      })
      .then(res => {
        return res;
      });
  },
  fetchAndSet: async __ => {
    const { self, type, method, id, filter, data } = __;

    const res = await api.fetch(__);

    self.setState({
      [type]: res
    });
  }
};

Fn.initialise = {};
Fn.apiBase = type => {
  if (
    localStorage &&
    localStorage.getItem("env") !== null &&
    localStorage.getItem("env").set === true
  ) {
    let env = localStorage.getItem("env").env;

    if (env === "development") {
      return appconfig.api.dev + type + "/";
    }
    if (env === "production") {
      return appconfig.api.prod + type + "/";
    }
  } else {
    if (process.env.NODE_ENV === "development") {
      return appconfig.api.dev + type + "/";
    }
    if (process.env.NODE_ENV === "production") {
      return appconfig.api.dev + type + "/";
    }
  }

  // if (process.env.NODE_ENV === "development") {
  //     return appconfig.api.dev + type + "/"
  // }
  // if (process.env.NODE_ENV === "production") {
  //     return appconfig.api.production + type + "/"
  // }
};

Fn.api = type => {
  // const { type } = data_;

  console.log("api type", type);

  let apiBase = api.url(type);

  return apiBase;
};
Fn.set = (label, value) => {
  localStorage.setItem(label, JSON.stringify(value));
};

// Fn.addToNetwork = async(data) => {

//     const { self, item} = data;
//     Fn.logger({ label: 'addToNetwork', data: item})

//     let account = Fn.get('account')

//     let user = account.user;
//     // console.log('[ user to update]', user)
//     let connections = user.profile.connections;
//     connections.push(item.id)

//     user.profile.connections = connections;

//     let apiUrl = 'https://api.crew20.devcolab.site/v1/users/' + user.id
//     let config = {

//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(user)
//     }
//     // console.log('config', apiUrl, user, config)
//     await fetch(apiUrl, config).then(res => {
//         return res.json()
//     }).then(res => {
//         // console.log('addToNetwork response', res)
//         // return res
//         account.user = res
//         Fn.store({ label: 'account', value: account })
//         self.setState({ isOpen: false })
//         self.context.updateAccount()
//         return res
//     })

// }

Fn.getUser = async userId => {
  return new Promise(async resolve => {
    let users = Fn.get("users").data;

    let user = users.filter(a => a.id === userId)[0];

    resolve(user);
  });
};

Fn.fetchUser = async data => {
  return new Promise(async resolve => {
    const { self, userId } = data;

    // self.setState({ ready: false });
    if (!Array.isArray(Fn.get("users"))) {
      console.log("object");
      Fn.set("users", []);
    }
    let storedUsers = Fn.get("users");

    let userExists = storedUsers.filter(a => a.data.id === userId).length > 0;

    if (userExists) {
      console.log("user is stored", userExists);

      let user = storedUsers.filter(a => a.data.id === userId)[0];

      if (util.shouldFetchNewData(user.time)) {
        let url = api.url("users") + userId;

        await fetch(url)
          .then(res => {
            return res.json();
          })
          .then(async res => {
            // console.log(" ");
            // console.log(" ");
            // console.log(" ");
            // console.log("[[ user data ]] ", res);
            // console.log(" ");
            // console.log(" ");
            // console.log(" ");

            // self.setState({ user: res, ready: true });
            // let storedUsers = Fn.get('users');
            // let userExists = storedUsers.filter(a => a.data.id === userId).length > 0;
            storedUsers.push({ time: new Date(), data: res });

            Fn.set("users", storedUsers);
            // if(!userExists) {
            // }

            resolve(res);

            // let connections = res.profile.connections;

            // await Fn.fetchConnections({ self, connections });
          });
      } else {
        resolve(user.data);
      }
    } else {
      console.log("user is not stored", userExists);

      let url = api.url("users") + userId;

      await fetch(url)
        .then(res => {
          return res.json();
        })
        .then(async res => {
          // console.log(" ");
          // console.log(" ");
          // console.log(" ");
          // console.log("[[ user data ]] ", res);
          // console.log(" ");
          // console.log(" ");
          // console.log(" ");

          // self.setState({ user: res, ready: true });
          // let storedUsers = Fn.get('users');
          // let userExists = storedUsers.filter(a => a.data.id === userId).length > 0;
          let stored = Fn.get("users");

          console.log("adding new user to store", stored);

          stored.push({ time: new Date(), data: res });

          console.log("added", stored);

          Fn.set("users", stored);

          resolve(res);

          // let connections = res.profile.connections;

          // await Fn.fetchConnections({ self, connections });
        });
    }
  });
};

Fn.fetchInvitedUsers = async data => {
  const { self, project } = data;

  let invitedUsers = project.invited || [];

  let users_ = [];

  for (let user of invitedUsers) {
    let apiUrl = api.url("users") + user.id;

    await fetch(apiUrl)
      .then(res => {
        return res.json();
      })
      .then(async res => {
        users_.push(res);
      });
  }

  console.log(" ");
  console.log(" ");
  console.log(" ");
  console.log(" [ Invited Users Data ] ", users_);
  console.log(" ");
  console.log(" ");

  self.setState({
    invited: users_
  });
};
Fn.fetchShortlistedUsers = async data => {
  const { self, users } = data;

  let users_ = [];

  for (let user of users) {
    // let apiUrl = 'https://api.crew20.devcolab.site/v1/users/' + user.id;
    let apiUrl = api.url("users") + user.id;

    await fetch(apiUrl)
      .then(res => {
        return res.json();
      })
      .then(async res => {
        users_.push(res);
      });
  }

  self.setState({
    shortlist: users_
  });
};

Fn.approveCrewApplication = async data_ => {
  const { self, project, application } = data_;

  let projectId = application.project;

  // let projectData =
  let crew = new Set(project.crew);

  crew.add({
    id: application.applicant.id,
    position: application.position.title
  });
  let crew_ = Array.from(crew);
  project.crew = crew_;

  // console.log(' ')
  // console.log('project',project)

  // console.log(' ')

  let config = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(project)
  };

  // let apiUrl = 'https://api.crew20.devcolab.site/v1/projects/' + project.id;
  let apiUrl = api.url("projects") + project.id;

  await fetch(apiUrl, config)
    .then(res => {
      return res.json();
    })
    .then(async res => {
      // console.log(' ')
      // console.log('approve application response ', res)
      // console.log(' ')

      self.setState({
        project: res
      });

      Fn.store({ label: "activeProject", value: res });

      notification.open({
        message: "Approved",
        description:
          application.applicant.profile.name.first +
          " " +
          application.applicant.profile.name.last +
          " has been added to the project crew."
      });

      self.load();
    });
};
Fn.fetchScheduleUsers = async data => {
  const { self, people } = data;
  console.log("fetchScheduleUsers", data);
  // self.setState({ ready: false })
  // self.setState({ user: null, userid: null, connections: null  })

  // let apiUrl = 'https://api.crew20.devcolab.site/v1/users/';

  let people_ = [];

  for (let item of people) {
    if (item.id) {
      let apiUrl = api.url("users") + item.id;

      await fetch(apiUrl)
        .then(res => {
          return res.json();
        })
        .then(async res => {
          console.log("fetchUsers response", res);

          people.push(item);
        });
    } else {
      let apiUrl = api.url("users") + item;

      await fetch(apiUrl)
        .then(res => {
          return res.json();
        })
        .then(async res => {
          console.log("fetchUsers response", res);

          people.push(item);
        });
    }
  }

  return people_;

  // console.log("people", people_);
  // self.setState({
  //   people: people_,
  //   peopleReady: true
  // });
};
Fn.fetchUsers = async data => {
  const { self, positions } = data;
  console.log("fetchUsers", data);
  // self.setState({ ready: false })
  // self.setState({ user: null, userid: null, connections: null  })

  // let apiUrl = 'https://api.crew20.devcolab.site/v1/users/';
  return new Promise(async resolve => {
    let positions_ = [];
    for (let item of positions) {
      let apiUrl = api.url("users") + "?position=" + item;

      await fetch(apiUrl)
        .then(res => {
          return res.json();
        })
        .then(async res => {
          console.log("fetchUsers response", res);

          let item_ = {
            position: item,
            users: res
          };
          // console.log('item_', item_)

          positions_.push(item_);

          // for (let item of positions) {

          // }

          // console.log('positions', positions_)

          // return res
          // let connections = res.profile.connections;

          // await Fn.fetchConnections({ self, connections })
        });
    }
    // self.setState({ users: res, ready: true })

    // Fn.store({ label: 'users', value: res })
    console.log("crew", positions_);
    self.setState({
      crew_: positions_
      // searchLoading: false
    });
    resolve(positions_);
    setTimeout(() => {
      self.setState({
        // crew_: positions_,
        searchLoading: false
      });
    }, 1000);
  });
};
Fn.fetchConnections = async data => {
  const { self, connections } = data;

  let connections_ = [];

  for (let item of connections) {
    // let apiUrl = 'https://api.crew20.devcolab.site/v1/users/' + item
    let apiUrl = api.url("users") + item;

    await fetch(apiUrl)
      .then(res => {
        return res.json();
      })
      .then(res => {
        // console.log('fetchConnection response', item, res)

        connections_.push(res);
      });
  }

  // console.log('[[ Fetched Connections ]]', connections_)

  Fn.set("connections", { time: new Date(), data: connections_ });

  // return connections_
  self.setState({
    connections: connections_,
    connectionsReady: true
  });
};

Fn.fetchApplicantData = async data_ => {
  const { self, applicants } = data_;

  let applicants_ = [];

  for (let item of applicants) {
    // const url = "https://api.crew20.devcolab.site/v1/users/" + item.applicant
    const url = api.url("users") + item.applicant;

    await fetch(url)
      .then(res => {
        return res.json();
      })
      .then(res => {
        item.applicant = res;

        applicants_.push(item);
      });

    // Fn.logger({ data: applicants_, text: "Applications", type: "primary" });

    Fn.store({ label: "applications", value: applicants_ });

    self.setState({
      applications: applicants_
    });
  }
};

Fn.fetchApplications = async data_ => {
  const { self, project } = data_;

  // const url = "https://api.crew20.devcolab.site/v1/applications/?project=" + project.id

  const url = api.url("applications") + "?project=" + project.id;

  await fetch(url)
    .then(res => {
      return res.json();
    })
    .then(async res => {
      return await Fn.fetchApplicantData({ self, applicants: res });

      // Fn.logger({ data: res, text: "Applications", type: 'primary' })

      // Fn.store({ label: 'applications', value: res})

      // self.setState({
      //     applications: res
      // })
    });
};

Fn.applyForPosition = async data_ => {
  const { self, application } = data_;

  // const url = "https://api.crew20.devcolab.site/v1/applications"

  const url = api.url("applications");

  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(application)
  };

  // console.log('[[ Application Request config  ]]', config)

  await fetch(url, config)
    .then(res => {
      return res.json();
    })
    .then(res => {
      // console.log('[[ Application Response ]]', res)

      setTimeout(() => {
        self.setState({
          buttonLoading: false,
          drawerVisible: false
        });
      }, 2000);
      setTimeout(() => {
        notification.open({
          message: "Application Submitted",
          description: "Your crew application request has been submitted."
        });
      }, 3000);
    });
};

Fn.fetchCrew_ = async data_ => {
  // console.log('fetchCrew config ',data_)

  const { self, next, nextIndex, project } = data_;

  // Fn.logger({ data: next, text: "Fetching Crew Data", type: "primary" });

  const crew = project.crew;

  // let nextIndex = 0;

  let data = [];

  for (let crewMember of crew) {
    // const url = "https://api.crew20.devcolab.site/v1/users/" + crewMember.id;

    const url = api.url("users") + crewMember.id;

    await fetch(url)
      .then(res => {
        return res.json();
      })

      .then(res => {
        // console.log("[[ Crew Member Data ]]", res)

        data.push(res);
      });
  }

  // Fn.logger({
  //   data: null,
  //   text: "type next : " + nextIndex + ", " + typeof next[nextIndex],
  //   type: "primary"
  // });
  if (typeof next[nextIndex] === "function") {
    self.setState({
      crew: data
    });

    let nextIndex_ = nextIndex + 1;

    next[nextIndex]({
      self,
      data,
      next: next[nextIndex_],
      nextIndex: nextIndex_
    });
  } else {
    self.setState({
      crew: data,
      ready: true
    });
  }
};

Fn.fetchProjectOwner = async data_ => {
  const { self, project } = data_;

  // const url = Fn.api('users') + project.owner
  const url = api.url("users") + project.owner;

  await fetch(url)
    .then(res => {
      return res.json();
    })
    .then(res => {
      console.log(" ");
      console.log(" ");
      console.log(" ");
      console.log(" ");
      console.log("projectOwner", res);
      console.log(" ");
      console.log(" ");
      console.log(" ");
      console.log(" ");

      window.logged.push({ title: "projectOwner", data: res });

      self.setState({
        projectOwner: res
      });
    });
};

Fn.fetchh = async _ => {
  const { url, type, body } = _;

  let config =
    type === "PATCH" || type === "PUT" || type === "POST"
      ? {
        method: type,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
      : {
        method: type
      };

  return await fetch(url, config)
    .then(res => {
      return res.json();
    })
    .then(res => {
      return res;
    });
};
Fn.fetchProject = async _ => {
  const { self, projectId, next } = _;

  return new Promise(async resolve => {
    console.log(_);

    let url = api.url("projects") + projectId;

    let project = await fetch(url)
      .then(res => {
        return res.json();
      })
      .then(res => {
        return res;
      });

    // self.setState({ project })

    // let crew = await Fn.fetchCrew({ self, project })

    resolve(project);
  });
};

Fn.fetchCrew = async data_ => {
  // console.log('fetchCrew config ',data_)

  const { self, project } = data_;
  console.log("project", project);

  // Fn.logger({ data: crew, text: 'Fetching Crew Data', type: 'primary' })

  const crew = project.crew;

  // let nextIndex = 0;

  let data = [];

  for (let crewMember of crew) {
    // const url = "https://api.crew20.devcolab.site/v1/users/" + crewMember.id;
    const url = api.url("users") + crewMember.id;

    await fetch(url)
      .then(res => {
        return res.json();
      })

      .then(res => {
        // console.log("[[ Crew Member Data ]]", res)

        data.push(res);
      });
  }

  // Fn.logger({ data: null, text: 'type next : ' + nextIndex + ", " + typeof next[nextIndex], type: 'primary' })
  self.setState({
    crew: data,
    ready: true
  });
};

Fn.fetchProject__ = async data_ => {
  const { self, projectId, next } = data_;

  Fn.logger({ data: data_, text: "Fetching Project Data", type: "primary" });

  let userId = Fn.get("account").user.id;

  let nextIndex = 0;

  // let apiUrl = "https://api.crew20.devcolab.site/v1/projects/" + projectId
  let apiUrl = api.url("projects") + projectId;

  await fetch(apiUrl)
    .then(res => {
      console.log(" ");
      console.log(" ");
      console.log("fetch project initial res ", res);

      console.log(" ");
      console.log(" ");

      if (!res.ok) {
        let a = res.json();
        a.ok = res.ok;
        a.status = res.status;
        return a;
      }
      if (res.ok) {
        let a = res.json();
        a.ok = res.ok;
        a.status = res.status;
        return a;
      }
    })
    .then(async res => {
      console.log(" ");
      console.log(" ");
      console.log("fetch project json res ", res);

      console.log(" ");
      console.log(" ");

      if (!res.hasOwnProperty("id")) {
        self.props.history.push("/notfound");
        return false;
      }
      if (res.hasOwnProperty("id")) {
        self.setState({
          project: res
        });

        await Fn.fetchInvitedUsers({ self, users: res.invited });

        Fn.store({ label: "activeProject", value: res });

        let projectOwner = res.owner;

        await Fn.fetchProjectOwner({ self, userId: projectOwner });

        // console.log(' ')
        // console.log(' ')
        // console.log('isOwner', projectOwner, userId)
        // console.log(' ')
        if (projectOwner === userId) {
          self.setState({
            userIsOwner: true
          });
        }

        if (typeof next[nextIndex] === "function") {
          let nextIndex_ = nextIndex + 1;

          // console.log(' ')
          // console.log(' ')

          // console.log('fetchProject next ',{ next: next, self, project: res, next: next[nextIndex_], nextIndex: nextIndex_ })

          // console.log(' ')

          // let fn = next[nextIndex];
          // JSON.stringify(fn)
          // // console.log('fn', next, next[nextIndex])
          // return await fn({ self: self, project: res, next: next[nextIndex_], nextIndex: nextIndex_ })

          return await next[nextIndex]({
            self: self,
            project: res,
            next: next[nextIndex_],
            nextIndex: nextIndex_
          });

          // return await next[0]({ self, project: res, next })
        } else {
          // self.setState({ ready: true})
        }
      }
    });
};
Fn.fetchProjects = async data => {
  const { self } = data;

  // let apiUrl = "https://api.crew20.devcolab.site/v1/projects";

  let apiUrl = api.url("projects");

  return await fetch(apiUrl)
    .then(res => {
      return res.json();
    })
    .then(async res => {
      // console.log('[[ Fetched Projects]]', res)

      Fn.store({ label: "activeProject", value: res[0] });
      Fn.store({ label: "projects", value: res });

      if (self) {
        self.setState({
          drawerReady: true,
          projects: res,
          activeProject: res[0],
          ready: true
        });
      } else {
        return res;
      }
    });
};

Fn.fetchCommentAuthors = async data_ => {
  const { self, authorIds } = data_;
  // console.log('comments',comments)

  console.log(" ");
  console.log(" ");
  console.log(" ");
  console.log("[[ authorIds ]]", authorIds);
  console.log(" ");
  console.log(" ");
  console.log(" ");

  return new Promise(async resolve => {
    let authors = [];

    for (let authorId of authorIds) {
      // let commentAuthorId = item.author;

      // let url = Fn.api('users') + authorId
      let url = api.url("users") + authorId;

      await fetch(url)
        .then(res => {
          return res.json();
        })
        .then(res => {
          // item.authorData = res

          authors.push(res);
        });

      // console.log('Fn.api(user)',Fn.api('user'))
    }

    self.setState({
      authors: authors,
      ready: true,
      conversationReady: true
    });
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log("[[ authors  ]]", authors);
    console.log(" ");
    console.log(" ");
    console.log(" ");

    setTimeout(() => {
      if (document.getElementById("MessagesList")) {
        document.getElementById("MessagesList").scroll({
          top: 9999999999,
          left: 0,
          behavior: "smooth"
        });
      }
    }, 500);

    resolve(authors);
  });

  // return comments_
};
Fn.fetchCommentAuthor = async data_ => {
  const { self, authorId } = data_;
  // console.log('comments',comments)

  // let url = Fn.api('users') + authorId
  let url = api.url("users") + authorId;

  let author = await fetch(url)
    .then(res => {
      return res.json();
    })
    .then(res => {
      return res;
    });

  let a = new Set(self.state.authors);

  a.add(author);

  let b = Array.from(a);
  // res
  self.setState({ authors: b });

  // self.setState( self.state => ({ authors: [res, ...self.state.authors] }))

  // return comments_
};
Fn.filterSubscribedProjects = async data => {
  const { self, projects, next } = data;

  let userId = Fn.get("account").user.id;

  // let userId = api.url('account')
  let p = [];

  for (let project of projects) {
    let crew = project.crew;

    let isCrew = crew.filter(a => a.id === userId);
    // console.log(' ')
    // console.log('isCrew',isCrew)
    // console.log(' ')
    if (isCrew.length > 0) {
      p.push(project);
    }
  }

  // projects.filter(a => a.crew.filter(c => c.id === userId)[0].id === )
  Fn.store({ label: "activeProject", value: p[0] });

  Fn.store({ label: "subscribedProjects", value: p });

  self.setState({
    drawerReady: true,
    subscribedProjects: p,
    activeProject: p[0]
  });

  if (typeof next === "function") {
    self.setState({ ready: false });

    // eval()
    next({ self });
  } else {
    self.setState({ ready: true });
  }
};

Fn.fetchSubscribedProjects = async data => {
  const { self, userId } = data;

  let apiUrl = api.url("projects");

  return new Promise(async resolve => {
    return await fetch(apiUrl)
      .then(res => {
        return res.json();
      })
      .then(async res => {
        let subscribed = [];

        console.log("### all projects sub res", res);

        for (let project of res) {
          let crew = project.crew;

          let isCrew = crew.filter(a => a.id === userId);

          if (isCrew.length > 0) {
            subscribed.push(project);
          }
        }

        Fn.set("subscribedProjects", subscribed);

        Fn.set("activeProject", subscribed[0]);

        self.setState({
          // ready: true,
          // drawerReady: true,
          subscribedProjectsReady: true,
          subscribedProjects: subscribed,
          activeProject: subscribed[0]
        });

        resolve(subscribed);
      });
  });
};
Fn.fetchOwnProjects = async data => {
  const { self } = data;

  const userId = Fn.get("account").user.id;

  let apiUrl = api.url("projects") + "?owner=" + userId;

  return new Promise(async resolve => {
    return await fetch(apiUrl)
      .then(res => {
        return res.json();
      })
      .then(async res => {
        console.log("[[ Fetched Own Projects]]", res);

        Fn.store({ label: "activeProject", value: res[0] });

        Fn.store({ label: "ownProjects", value: res });

        resolve(res);
      });
  });
};
Fn.getDates = async (startDate, stopDate) => {
  var dateArray = [];
  var currentDate = moment(startDate);
  var stopDate = moment(stopDate);
  while (currentDate <= stopDate) {

    dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
    currentDate = moment(currentDate).add(1, "days");
  }
  dateArray.push(moment(stopDate).format("YYYY-MM-DD"));

  console.log('get days', dateArray)
  return dateArray;
};
Fn.createProject = async data => {
  const { self, project, message } = data;

  // project.owner = Fn.get('account').user.id;

  let p = {};
  p.title = project.projectName;

  p.description = "";
  p.type = project.projectType;

  p.start_date = project.projectDate;
  p.end_date = project.projectEndDate;
  p.positions = project.positions;

  let days = Fn.getDates(project.projectDate, project.projectEndDate);
  // for (let item of project.positions) {
  //   let pos = {
  //     title: item,
  //     description: ""
  //   };
  //   p.positions.push(pos);
  // }
  console.log("project", project);
  p.location =
    typeof project.location.address.county !== "undefined"
      ? project.location.address.county
      : project.location.address.county;

  p.owner = Fn.get("account").user.id;
  p.crew = [];
  p.productionCrew = [
    {
      user: Fn.get("account").user.id,
      permissions: [
        "projectfiles",
        "projectsettings",
        "projectpeople",
        "projectchecklists",
        "projectratecalculator"
      ]
    }
  ];
  p.comments = [];
  p.invited = project.invited;

  p.shortlist = project.shortlist;

  p.createdAt = new Date();
  p.checklists = [];
  p.threads = [];
  p.conversations = [];
  p.days = days;

  // p.conversation = {}
  for (let item of days) {
    let conv = await app.createProjectConversation({
      self,
      projectOwner: Fn.get("account").user.id,
      type: "project"
    });

    if (conv) {
      let item_ = {
        day: item,
        conversationId: conv.id
      };
      p.conversations.push(item_);
    }
  }

  let conversation = await app.createProjectConversation({
    self,
    projectOwner: Fn.get("account").user.id,
    type: "event"
  });

  if (conversation) {
    p.conversationId = conversation.id;

    // // console.log(' ')
    // // console.log(' ')
    // // console.log(' ')
    // // console.log(' ')
    // // console.log('[[ Project to create ]] ', p)
    console.log(" ");
    console.log(" ");
    console.log("[[ Project to create ]] ", JSON.stringify(p));
    console.log(" ");
    console.log(" ");

    // let apiUrl = "https://api.crew20.devcolab.site/v1/projects/";
    let apiUrl = api.url("projects");

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(p)
    };

    return await fetch(apiUrl, config)
      .then(res => {
        // // console.log(' ','[[ Status ]] ',res,' ')
        // // console.log

        if (!res.ok) {
          notification.open({
            message: "Error Creating Project",
            description: "Error creating project."
          });
        } else {
          notification.open({
            message: "Project Created",
            description: "Your project has been created successfully."
          });
        }

        return res.json();
      })
      .then(res => {
        // console.log('[[ Project Insert Response ]]', res)

        // Fn.store({ label: 'projects', value: [res] })

        let crewBuilder = Fn.get("crewBuilder");

        crewBuilder.hasBeenUploaded = true;

        Fn.store({ label: "crewBuilder", value: crewBuilder });

        self.setState({
          createProject: false
        });

        self.refresh();

        message.destroy();
      });
  }
};
// Fn.fetchOwnProjects = async (data) => {

//     const { self } = data

//     let userId = Fn.get('account').user.id;

//     // let apiUrl = "https://api.crew20.devcolab.site/v1/projects?owner=" + userId;
//     let apiUrl = api.url('projects') + "?owner=" + userId

//     return await fetch(apiUrl).then(res => {

//         return res.json()

//     }).then(async res => {

//         // // console.log('[[ Fetched Projects]]', res)

//         Fn.store({ label: 'ownProjects', value: res })

//         self.setState({ ownProjects: res, ready: true })

//     })

// }
Fn.addUserToProject = async data => {
  const { self, project, userId, closeDialog } = data;

  // let userId = Fn.get('account').user.id;

  let crew = new Set(project.crew);

  crew.add({ id: userId });
  let crew_ = Array.from(crew);
  project.crew = crew_;

  // let apiUrl = "https://api.crew20.devcolab.site/v1/projects/" + project.id;
  let apiUrl = api.url("projects") + project.id;

  let config = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project)
  };

  return await fetch(apiUrl, config)
    .then(res => {
      return res.json();
    })
    .then(async res => {
      // // console.log('[[ Updated Project with Crew Member ]]', res)
      notification.info({
        message: "Added to Project",
        description: "User has been added to your project.",

        placement: "bottomRight"
      });

      closeDialog();
      // Fn.store({ label: 'activePro===', value: res })

      // self.setState({ projects: res, ready: true })
    });
};
Fn.fetchAuthor = async data => {
  const { self, authorId } = data;
  // let apiUrl = "https://api.crew20.devcolab.site/v1/users/" + authorId;
  let apiUrl = api.url("users") + authorId;
  // let config = {
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(project)

  // }

  return await fetch(apiUrl)
    .then(res => {
      return res.json();
    })
    .then(res => {
      // // console.log('[[ Author data ]]', res)

      self.setState({
        author: res,
        ready: true
      });
    });
};
Fn.updateProjectComments = async data => {
  const { self, project } = data;

  // console.log('Project to update', project)

  // let p = {...project}

  // let apiUrl = "https://api.crew20.devcolab.site/v1/projects/" + project.id;
  let apiUrl = api.url("projects") + project.id;

  let config = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project)
  };

  return await fetch(apiUrl, config)
    .then(res => {
      return res.json();
    })
    .then(async res => {
      console.log("[[ Updated Project with comments ]]", res);
      self.props.load();

      // Fn.store({ label: 'activePro===', value: res })

      // self.setState({ projects: res, ready: true })
    });
};
Fn.hideDrawer = async data => {
  const { self } = data;
  self.setState({
    activeTab: "1",
    projectInfoVisible: false,
    conversationReady: false
  });
  setTimeout(() => {
    self.setState({
      drawerReady: false
    });
    setTimeout(() => {
      self.setState({
        drawerReady: true
      });
    }, 500);
  }, 500);
};
Fn.submitBio = async data_ => {
  const { self, data } = data_;
  let account = Fn.get("account");
  let userId = account.user.id;
  let user = account.user;
  user.profile.bio = data;
  // console.log('userId', userId)
  // let apiUrl = 'http://3.135.242.213:3030/nedb/users/' + accountId
  // let apiUrl = 'https://api.crew20.devcolab.site/v1/users/' + userId
  let apiUrl = api.url("users") + userId;
  let config = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
    // body: account
  };
  // console.log('config', config)
  await fetch(apiUrl, config)
    .then(res => {
      return res.json();
    })
    .then(res => {
      // console.log('submitBio response', res)
      // return res
      account.user = res;
      Fn.store({ label: "account", value: account });
      self.setState({ isOpen: false });
      self.context.updateAccount();
      return res;
    });
};

Fn.updateSkills = async data => {
  const { self, skills } = data;

  let account = Fn.get("account");

  let userId = account.user.id;

  let user = account.user;

  user.profile.additional.skills = skills;

  // let apiUrl = 'https://api.crew20.devcolab.site/v1/users/' + userId
  let apiUrl = api.url("users") + userId;

  let config = {
    method: "PATCH",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify(user)
  };

  // // console.log('config', user)

  await fetch(apiUrl, config)
    .then(res => {
      return res.json();
    })
    .then(res => {
      // console.log('Update Skills response', res)

      account.user = res;

      Fn.store({ label: "account", value: account });

      self.setState({ isOpen: false });

      self.context.updateAccount();

      return res;
    });
};

Fn.submitProfile = async data_ => {
  const { self, data } = data_;

  console.log("data", data);

  let account = Fn.get("account");

  let userId = account.user.id;

  let user = account.user;

  user.profile.name = {
    first: data.firstname,
    last: data.lastname
  };

  user.profile.dob = data.dob;
  user.profile.gender = data.gender;
  user.profile.location = data.location;
  user.position = data.role;

  console.log("user", user);

  // let apiUrl = 'https://api.crew20.devcolab.site/v1/users/' + userId
  let apiUrl = api.url("users") + userId;

  let config = {
    method: "PATCH",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify(user)
  };

  // console.log('config', user)

  await fetch(apiUrl, config)
    .then(res => {
      return res.json();
    })
    .then(res => {
      // console.log('submitBio response', res)

      account.user = res;

      Fn.store({ label: "account", value: account });

      self.setState({ isOpen: false });

      self.context.updateAccount();

      return res;
    });
};

Fn.submitPortfolioItem = async data_ => {
  const { self, data, updateAccount, closeDialog } = data_;

  let account = Fn.get("account");

  let userId = account.user.id;

  let user = account.user;

  let projects =
    typeof user.profile.projects !== "undefined" ? user.profile.projects : [];

  projects.push(data);

  user.profile.projects = projects;

  // // console.log('userId', userId)

  // let apiUrl = 'https://api.crew20.devcolab.site/v1/users/' + userId
  let apiUrl = api.url("users") + userId;

  let config = {
    method: "PATCH",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify(user)
  };

  // console.log('config', user)

  await fetch(apiUrl, config)
    .then(res => {
      return res.json();
    })
    .then(res => {
      // console.log('submitBio response', res)

      account.user = res;

      Fn.store({ label: "account", value: account });

      self.setState({ isOpen: false });

      updateAccount();
      closeDialog();

      return res;
    });
};

Fn.addToNetwork = async data => {
  const { self, item } = data;

  // console.log('User to add to network', item)

  let account = Fn.get("account");
  // console.log('user to update', account.user)
  let requestUserId = account.user.id;

  let connections = account.user.profile.connections;
  let pending = account.user.profile.network.pending;

  connections.push(item.id);
  const distinctConnections = [...new Set(connections)];
  account.user.profile.connections = distinctConnections;

  pending.push(item.id);
  const distinctPending = [...new Set(pending)];
  account.user.profile.network.pending = distinctPending;

  // // console.log('accountId', accountId)

  // let apiUrl = 'http://3.135.242.213:3030/nedb/users/' + accountId

  let apiUrl = api.url("users") + requestUserId;
  let apiUrl1 = api.url("users") + item.id;

  let config = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(account.user)
  };

  // console.log('config', config)

  await fetch(apiUrl, config)
    .then(res => {
      return res.json();
    })
    .then(res => {
      // console.log('addToNetwork response', res)

      account.user = res;

      Fn.store({ label: "account", value: account });

      self.setState({ isOpen: false, AddToNetworkButtonLoading: false });

      self.context.updateAccount();

      notification.open({
        message: "Added to Network",
        description:
          "A connect request has been sent to " +
          item.profile.name.first +
          " " +
          item.profile.name.last
      });

      Fn.createNetworkNotification({});

      return res;
    });

  // let apiUrl1 = 'https://api.crew20.devcolab.site/v1/users/' + item.id
  let userData = await fetch(apiUrl1)
    .then(res => {
      return res.json();
    })
    .then(res => {
      // console.log('[[ Connecting user data ]]', res)
      return res;
    });

  // console.log('UserData', userData)
  let connections1 = userData.profile.connections;

  connections1.push(requestUserId);
  const distinctConnections1 = [...new Set(connections1)];
  userData.profile.connections = distinctConnections1;
  // connections1.push(userId)

  let config1 = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  };

  await fetch(apiUrl1, config1)
    .then(res => {
      return res.json();
    })
    .then(res => {
      // console.log('addToNetwork2 response', res)
    });
};
Fn.fetch = async options => {
  const { collection, self } = options;

  // console.log('[[ Fn.fetch options ]]', options)

  const dbInitData = {
    type: "alert",
    text: "First alert to initialise the remote alerts db.",
    createdAt: new Date()
  };

  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access-control-expose-headers": "X-jsonBlob"
    },
    body: JSON.stringify(dbInitData)
  };

  const url = appconfig.storageProvider.initUrl;

  await fetch(url, config).then(res => {
    Fn.store({
      label: "db_alerts_endpoint_id",
      value: res.headers.get("X-jsonBlob")
    });

    success.add(url);

    return res.headers.get("X-jsonBlob");
  });
  // return new Promise(async resolve => {

  //     let a = await Fn.checkExists({ self, values })

  //     resolve(a)

  // })
};

Fn.logger = async config => {
  const { data, text, type } = config;

  // const colorScheme = type.length && colorScheme[type]
  const logPrimary = [
    "background: #38c172",
    ,
    "padding: 1rem 0.7rem",
    "border: none",
    "color: white",
    "display: block",
    "line-height: auto",
    "text-align: left",
    "font-weight: bold",
    "font-size: 0.9rem",
    "border-radius: 2px",
    "width: 100%",
    "margin-top: 1rem",
    "margin-bottom: 1rem"
  ].join(";");

  const logInfo = [
    "background: #f3f3f3",
    "padding: 1rem 0.7rem",
    "border: none",
    "color: grey",
    "display: block",
    "line-height: 1.5rem",
    "text-align: left",
    "font-weight: light",
    "font-size: 0.8rem",
    "border-radius: 2px",
    "width: 100%",
    "margin-top: 1rem",
    "margin-bottom: 1rem"
  ].join(";");

  let loggerColorScheme = {
    alert: logPrimary,
    info: logInfo
  };

  {
    text &&
      text.length &&
      console.log("%c " + text + " ", loggerColorScheme.alert);
  }

  {
    data &&
      data.length &&
      console.log("%c " + JSON.stringify(data) + " ", loggerColorScheme.info);
  }

  {
    data && data.length && console.log("%c data >", logInfo, data);
  }
};

Fn.store = data => {
  // console.log('[[ Storing Data ]]', data)

  const { label, value } = data;

  localStorage.setItem(label, JSON.stringify(value));

  setGlobal({ activeProject: data.value });
};

// Fn.get = (data) => {

//     return JSON.parse(localStorage.getItem(data))

// }

Fn.hydrateDataFromLocalstorage = async data => {
  const { self } = data;

  self.setState({
    theme: Fn.get("theme"),
    layout: Fn.get("layout"),
    alerts: Fn.get("alerts"),
    ready: true
  });
};
// Fn.set = (label, value) => {
//   localStorage.setItem(label, JSON.stringify(value));
// };

Fn.get = label => {
  // console.log(' get ', label, localStorage[label])

  if (localStorage.getItem(label) === null) {
    // console.log('object is undefined')
    // // console.log('label',localStorage[label])
    // return
    // return data
    return {};
  }
  if (localStorage.getItem(label) !== null) {
    // console.log('object is not undefined')

    let a = localStorage.getItem(label);

    // console.log(' ')
    // console.log(' ')
    // console.log('localStorage[label]', label, localStorage[label])
    // console.log(' ')

    if (a !== "undefined") {
      // console.log(' ')
      // console.log(' ')
      // console.log('a',a)
      // console.log(' ')

      return JSON.parse(a);
    } else {
      return {};
    }
  }

  // else {

  //     let a = localStorage[label]
  //     // // console.log('[[ Fn.get a ]]', a)
  //     return JSON.parse(a)
  // }
};

Fn.getLocallyStoredAlerts = () => {
  return JSON.parse(localStorage.getItem("Alerts"));
};

Fn.getTheme = () => {
  return JSON.parse(localStorage.getItem("Theme"));
};

Fn.dummyScript = async data => {
  // Fn.logger({
  //   data: null,
  //   text:
  //     "dummy localstorage item does not exist, so we are running this dummy script."
  // });

  localStorage.setItem("dummy", JSON.stringify({ test: "dummy" }));

  success.add({});
};

Fn.initialise.Alerts = async data => {
  const { self } = data;

  return new Promise(async resolve => {
    Fn.store({ label: "Alerts", value: [] });

    self.setState({ alerts: [] });

    success.add({});

    resolve({ alerts: [] });
  });
};
Fn.initialise.layout = async data => {
  const { self } = data;

  return new Promise(async resolve => {
    Fn.store({ label: "layout", value: "default" });

    self.setState({ layout: "default" });

    success.add({});

    resolve({ layout: "default" });
  });
};

Fn.initialise.theme = async data => {
  const { self } = data;

  // Fn.logger({ data: null, text: "Setting theme" });

  return new Promise(async resolve => {
    let theme = { base: "dark" };

    Fn.store({ label: "theme", value: theme });

    self.setState({ theme });

    success.add({});

    resolve({ theme: theme });
  });
};

Fn.initialise.shift = async data => {
  const { self } = data;

  return new Promise(async resolve => {
    Fn.store({ label: "shift", value: 200 });

    self.setState({ shift: 200 });

    success.add({});

    resolve({ shift: 200 });
  });
};

// Fn.initialise.mvoffset = async (data) => {

//     const { self } = data;

//     return new Promise(async resolve => {

//         Fn.store({ label: 'mvoffset', value: 0 })

//         self.setState({ offsetY: 0 })

//         success.add({})

//         resolve({ offsetY: 0 })

//     })

// }

Fn.initialise.mv = async data => {
  const { self } = data;

  return new Promise(async resolve => {
    Fn.store({ label: "mv", value: 25 });

    self.setState({ mv: 25 });

    success.add({});

    resolve({ mv: 25 });
  });
};
Fn.initialise.snapshots = async data => {
  const { self } = data;

  return new Promise(async resolve => {
    Fn.store({ label: "snapshots", value: [] });

    self.setState({ snapshots: [] });

    success.add({});

    resolve({ snapshots: [] });
  });
};

// Fn.initialise.snapshots = async() => {
//     // const { label, type } = options

//     // const data = type === "array" ? [] : type === "string" ? "" : {}

//     localStorage.setItem('snapshots', JSON.stringify([]))

// }

Fn.initialise.sampleData = async () => {
  let url = "https://jsonblob.com/api/f77c0c24-014e-11ea-be47-f9ab32f9bc7d";

  return await fetch(url)
    .then(res => {
      return res;
    })
    .then(res => {
      return res.json();
    })
    .then(res => {
      // Fn.logger({
      //   data: null,
      //   text: "Sample data imported into localstorage from [ " + url + " ]"
      // });

      Fn.store({ label: "sampledata", value: res });
    });
};
Fn.initialise.initialValues = () => {
  let items = [
    {
      label: "theme",
      initial: { base: "light" }
    },
    {
      label: "investments",
      initial: []
    }
  ];

  for (let item of items) {
    if (localStorage.getItem(item.label) === null) {
      return localStorage.setItem(item.label, JSON.stringify(item.initial));
    }
  }
};

Fn.hydrateFromLocalstorage = options => {
  const { self } = options;

  let items = [
    {
      label: "theme",
      initial: {}
    },
    {
      label: "alerts",
      initial: []
    },
    {
      label: "sampledata",
      initial: []
    },
    {
      label: "shift",
      initial: 0
    },
    {
      label: "mv",
      initial: 0
    }
  ];

  for (let item of items) {
    if (localStorage.getItem(item.label) !== null) {
      let value = JSON.parse(localStorage.getItem(item.label));
      self.setState({ [item.label]: value });
    } else {
      localStorage.setItem(item.label, JSON.stringify(item.initial));
    }
  }
};

Fn.initialise.Startup = async data => {
  const { self } = data;
};
Fn.initialise.store = (label, type) => {
  // const { label, type } = options

  const data = type === "array" ? [] : type === "string" ? "" : {};

  localStorage.setItem(label, JSON.stringify(data));
};

Fn.checkExists = async data => {
  return new Promise(async resolve => {
    let { self, values } = data;

    var checkInterval = setInterval(() => {
      for (let item of values) {
        // // console.log(item, item.check, typeof item.check)
        // let item_ = { ...item }

        if (item.check !== null) {
          // Fn.logger({
          //   data: item,
          //   text: "[ " + item.label + " ] does exist, moving on ..."
          // });

          success.add(item);

          // return item
        }
        if (item.check === null) {
          // eval('Fn.' + item.run)

          // Fn.logger({
          //   data: item,
          //   text:
          //     "[ " + item.label + " ] does not exist, attempting to create ..."
          // });

          return item.run;
        }
      }

      // console.log(success.size, values.length)

      if (success.size >= values.length) {
        let res = {
          success: [...new Set(success)],
          ok: true
        };

        // Fn.logger({ data: null, text: "All checks complete" });

        clearInterval(checkInterval);

        resolve(JSON.stringify(res));
      }
    }, 2000);
  });
};
Fn.createMessagesDB = async data => {
  // console.log('[[ Fn.createMessagesDB ]]', data)

  const { self } = data;

  const dbInitData = {
    type: "message",
    text: "First message to initialise the remote messages db.",
    createdAt: new Date()
  };

  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access-control-expose-headers": "X-jsonBlob"
    },
    body: JSON.stringify(dbInitData)
  };

  const url = appconfig.storageProvider.initUrl;

  await fetch(url, config).then(res => {
    Fn.store({
      label: "db_messages_endpoint_id",
      value: res.headers.get("X-jsonBlob")
    });

    success.add(url);

    return res.headers.get("X-jsonBlob");
  });
};
Fn.createNotificationsDB = async data => {
  // console.log('[[ Fn.createNotificationsDB ]]', data)

  const { self } = data;

  const dbInitData = {
    type: "notification",
    text: "First notification to initialise the remote notifications db.",
    createdAt: new Date()
  };

  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access-control-expose-headers": "X-jsonBlob"
    },
    body: JSON.stringify(dbInitData)
  };

  const url = appconfig.storageProvider.initUrl;

  await fetch(url, config).then(res => {
    Fn.store({
      label: "db_notifications_endpoint_id",
      value: res.headers.get("X-jsonBlob")
    });

    success.add(url);

    return res.headers.get("X-jsonBlob");
  });
};
Fn.createAlertsDB = async data => {
  // console.log('[[ Fn.createAlertsDB ]]', data)

  const { self } = data;

  const dbInitData = {
    type: "alert",
    text: "First alert to initialise the remote alerts db.",
    createdAt: new Date()
  };

  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access-control-expose-headers": "X-jsonBlob"
    },
    body: JSON.stringify(dbInitData)
  };

  const url = appconfig.storageProvider.initUrl;

  await fetch(url, config).then(res => {
    Fn.store({
      label: "db_alerts_endpoint_id",
      value: res.headers.get("X-jsonBlob")
    });

    success.add(url);

    return res.headers.get("X-jsonBlob");
  });
};
Fn.getCollectionEndpointUrl = type => {
  const storageProviderUrl = appconfig.storageProvider.url;

  if (type === "alerts") {
    const id = JSON.parse(localStorage.getItem("db_alerts_endpoint_id"));
    const url = storageProviderUrl + id;
    return url;
  }
  if (type === "messages") {
    const id = JSON.parse(localStorage.getItem("db_messages_endpoint_id"));
    const url = storageProviderUrl + id;
    return url;
  }
  if (type === "notifications") {
    const id = JSON.parse(localStorage.getItem("db_notifications_endpoint_id"));
    const url = storageProviderUrl + id;
    return url;
  }
};
Fn.createAlert = async data => {
  let { self, alert } = data;

  alert.createdAt = new Date();

  alert.message = alertMessages.alert(alert);

  let alerts = await Fn.get("Alerts");

  alerts.push(alert);

  self.setState({ alerts: alerts });

  Fn.store({ label: "Alerts", value: alerts });

  return new Promise(async resolve => {
    const url = Fn.getCollectionEndpointUrl("alerts");

    const config = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(alerts)
    };

    await fetch(url, config)
      .then(res => {
        return res.json();
      })
      .then(res => {
        return res;
      })
      .then(data => {
        resolve({ data, ok: true });
      });
  });
};

Fn.filterJSON = a => {
  let b = a.filter((item, index) => !Number.isInteger(index / 2));
  return b;
};

Fn.sleep = async fn => {
  const sleep = milliseconds => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };
};
Fn.reverseGeocodeCity = async data => {
  // // console.log('[[ Fn.reverseGeocodeCity ]]');
  const { self } = data;
  let url =
    "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=" +
    self.state.lat +
    "," +
    self.state.long +
    ",250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=ZZN2MPuexLyuz3VR0KDD&app_code=TnEsVJR8k3zxGMiAkbP_EQ";
  fetch(url, (e, r) => {
    return r;
  })
    .then(res => {
      return res.json();
    })
    .then(res => {
      // // console.log('reverse geocode res', res)

      // // console.log('[[ Fn.reverseGeocodeCity ]]', JSON.stringify(res.Response && res.Response.View && res.Response.View[0] && res.Response.View[0].Result[0] && res.Response.View[0].Result[0].Location && res.Response.View[0].Result[0].Location.Address));

      let data =
        res.Response &&
        res.Response.View[0] &&
        res.Response.View[0].Result[0] &&
        res.Response.View[0].Result[0].Location &&
        res.Response.View[0].Result[0].Location.Address &&
        res.Response.View[0].Result[0].Location.Address.AdditionalData;
      let location =
        res.Response &&
        res.Response.View[0] &&
        res.Response.View[0].Result[0] &&
        res.Response.View[0].Result[0].Location &&
        res.Response.View[0].Result[0].Location.Address;
      let address =
        res.Response &&
        res.Response.View[0] &&
        res.Response.View[0].Result[0] &&
        res.Response.View[0].Result[0].Location &&
        res.Response.View[0].Result[0].Location.Address;

      for (let item of data) {
        if (item.key === "CountryName") {
          let country = item.value;
          // console.log('country', country);
          self.setState({ country: country, countrySet: true });
        }
      }
      self.setState({
        location: address,
        city: address.County,
        suburb: address.District,
        province: address.State,
        searchFormReady: true,
        ready: true
      });
      Fn.findCurrency({ self });
      // console.log('[[ store : location ]]', location)
      methods.store({ type: "location", data: location });
      methods.store({ type: "locationIsSet", data: true });
    });
};
Fn.findCurrency = async data => {
  const { self } = data;
  if (self.state.countrySet) {
    const country = self.state.country;
    let url = "https://restcountries.eu/rest/v2/name/" + country;
    await fetch(url, (err, res) => {
      return res;
    })
      .then(res => {
        return res.json();
        // // console.log('Country data',res)
      })
      .then(res => {
        // return res.json()
        // console.log('Country data', res[0].currencies[0]);
        setGlobal({
          activeCurrencyIsSet: true,
          activeCurrency: res[0].currencies[0],
          baseCurrency: res[0].currencies[0]
        });
        localStorage.setItem(
          "activeCurrency",
          JSON.stringify(res[0].currencies[0])
        );
        localStorage.setItem(
          "baseCurrency",
          JSON.stringify(res[0].currencies[0])
        );
        localStorage.setItem("activeCurrencyIsSet", JSON.stringify(true));
      });
  }
};
Fn.getGeoLocation = async data => {
  const { self } = data;

  const setPosition = data_ => {
    // // console.log('[[ getGeoLocation ]]', data_)
    // // console.log('getGeolocation', data_)

    self.setState({
      lat: data_.coords.latitude || 0,
      long: data_.coords.longitude || 0
    });

    Fn.reverseGeocodeCity({ self });
  };

  if (typeof window.navigator.geolocation !== "undefined") {
    window.navigator.geolocation.getCurrentPosition(setPosition);
  }
};
Fn.findLocation = data => {
  const { searchTerm, self } = data;

  let url =
    "https://geocoder.api.here.com/6.2/geocode.json?searchtext=" +
    searchTerm +
    "&app_id=ZZN2MPuexLyuz3VR0KDD&app_code=TnEsVJR8k3zxGMiAkbP_EQ&gen=9";
  fetch(url, (e, r) => {
    return r;
  })
    .then(res => {
      return res.json();
    })

    .then(res => {
      // // console.log('findLocation', res.Response.View[0].Result[0].Location.Address)

      self.setState({
        city: res.Response.View[0].Result[0].Location.Address.County,
        suburb: res.Response.View[0].Result[0].Location.Address.District,
        province: res.Response.View[0].Result[0].Location.Address.State,
        searchFormReady: true,
        location: res.Response.View[0].Result[0].Location.Address
      });

      return Fn.findCurrency({ self });
    });
};
Fn.showDrawer = async data => {
  const { project, self } = data;

  // // console.log('showDrawer', project);

  setGlobal({
    activeProject: project
  });
  self.setState({
    projectInfoVisible: true,
    activeProject: project,

    conversationReady: true,
    activeTab: "1"
  });

  localStorage.setItem("activeProject", JSON.stringify(project));
};
Fn.refresh = async data => {
  const { self } = data;
  self.setState({
    ready: false
  });
  setTimeout(() => {
    Fn.fetchProjects({ self });
  }, 1000);
};
Fn.userAfterRegistration = async data_ => {
  // // console.log('userAfterRegistration', data_)

  const { self, data } = data_;
  console.log("userAfterRegistration", data);
  let user = data.user;

  user.profile = {
    confirmed: false,
    config: {
      type: "",
      onboardingcomplete: false
    },
    name: {
      first: "",
      last: ""
    },
    picture: "",
    location: {},
    preferredCurrency: {},
    contact: {
      phone: ""
    },
    grade: 0,
    bio: "",
    role: "",
    dob: "",
    gender: "",
    connections: [],
    network: {
      pending: [],
      confirmed: []
    },
    projects: [],
    cv: {
      file: "",
      uploaded: false
    },
    additional: {
      ratings: {
        rating: 0,
        ratings: []
      },
      skills: []
    }
  };
  user.confirmed = false;

  // const url = "https://api.crew20.devcolab.site/v1/users/" + user.id;
   const url = "https://dev.iim.technology/v1/users/" + user.id;

  const config = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  }

  await fetch(url, config)
    .then(res => {

      return res.json();

    })
    .then(async res => {

      if (res.code === 400 || res.code === 401) {

      } else {

        let account = Fn.get("account");

        account.user = res;

        self.setState({ isAuthenticated: true, account: account });

        Fn.store({ label: "account", value: account });

        await app.sendConfirmationEmail({ self, userId: res.id });

      }
    });
};

Fn.uploadProfileImage = async data => {

  const { self, file } = data;

  console.log("uploadProfileImage", file);

  let fileUrl =
    "https://crew20-uploads.s3.eu-west-2.amazonaws.com/" + file.name;

  let account = Fn.get("account");

  let user = account.user;

  user.profile.picture = fileUrl;

  let url = api.url("users") + user.id;

  let config = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  };

  await fetch(url, config)
    .then(res => {

      if (res.status !== 200) {
        return null;
      }

      return res.json();
    })
    .then(res => {

      account.user = res;

      Fn.set("account", account);

      self.context.updateAccount();

      self.props.closeDialog();

    });
};
Fn.createFileConversation = async data_ => {
  return new Promise(async resolve => {
    let conversation = {
      type: "file",
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
      participants: [Fn.get("account").user.id],
      type: "file"
    };

    let url = api.url("conversations");

    let config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(conversation)
    };

    await fetch(url, config)
      .then(res => {
        return res.json();
      })
      .then(res => {
        console.log("conversation", res);
        resolve(res);
      });
  });
};
Fn.uploadEventFiles = async data => {
  const { self, parent, event, file } = data;

  // let project = self.state.project;

  let conversation = await Fn.createFileConversation().then(async convRes => {
    console.log("convRes", convRes);

    let fileUrl =
      "https://crew20-uploads.s3.eu-west-2.amazonaws.com/" + file.name;
    let account = Fn.get("account");

    let user = account.user;

    let file__ = {
      url: fileUrl,
      file: fileUrl,
      title: fileUrl,
      uploadedBy: user.id,
      createdAt: new Date(),
      conversation: convRes.id,
      event: event.id
      // type: "calendar"
    };

    if (!event.hasOwnProperty("files")) {
      event.files = [];
    }

    event.files.push(file__);

    console.log("event", event);

    let url = api.url("events") + event.id;

    let config = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Fn.get("account").tokens.access.token
      },
      body: JSON.stringify(event)
    };

    console.log("file upload project patch config", config);

    await fetch(url, config)
      .then(res => {
        // if (res.status !== 200) {

        //     return null
        // }
        return res.json();
      })
      .then(res => {
        // account.user = res

        console.log("Updated event : file uploaded", res);

        Fn.store({ label: "activeEvent", value: res });

        parent.setState({
          event: res,

          files: res.files
        });

        // self.context.updateAccount()

        // self.props.closeDialog()
      });
  });

  // if( conversation ) {

  // }
};
Fn.uploadProjectFiles = async data => {

  const { self, parent, project, file, fileType } = data;

  // let project = self.state.project;

  let conversation = await Fn.createFileConversation().then(async conversation => {

    console.log("created file converasation", conversation);

    let fileUrl =
      "https://crew20-uploads.s3.eu-west-2.amazonaws.com/" + file.name;

    let account = Fn.get("account");

    let user = account.user;

    let file__ = {
      url: fileUrl,
      file: fileUrl,
      title: fileUrl,
      uploadedBy: user.id,
      createdAt: new Date(),
      conversation: conversation.id,
      project: project.id,
      fileType: fileType
    };

    if (!project.hasOwnProperty("files")) {
      project.files = [];
    }

    project.files.push(file__);

    console.log("project", project);

    let url = api.url("projects") + project.id;

    let config = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(project)
    };

    console.log("file upload project patch config", config);

    await fetch(url, config)
      .then(res => {
        return res.json();
      })
      .then(res => {
        // account.user = res

        console.log("Updated project : file uploaded", res);

        Fn.store({ label: "activeProject", value: res });

        parent.setState({
          project: res,
          files: res.files
        });

        // self.context.updateAccount()

        // parent.closeDialog()

      });
  });

  // if( conversation ) {

  // }
};
Fn.uploadProjectAvatar = async data => {
  const { self, parent, project, file } = data;

  let fileUrl =
    "https://crew20-uploads.s3.eu-west-2.amazonaws.com/" + file.name;

  let account = Fn.get("account");

  let user = account.user;

  // let file__ = {
  //     url: fileUrl,
  //     file: file_,
  //     title:   fileUrl,
  //     uploadedBy: user.id,
  //     createdAt: new Date(),
  //     conversation: convRes.id,
  //     project: project.id

  // }

  if (!project.hasOwnProperty("media")) {
    project.media = {
      video: [],
      images: []
    };
  }

  project.media.images.unshift({ title: fileUrl, url: fileUrl });

  console.log("project", project);

  let url = Fn.api("projects") + project.id;

  let config = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(project)
  };

  console.log("file upload project patch config", config);

  await fetch(url, config)
    .then(res => {
      // if (res.status !== 200) {

      //     return null
      // }
      return res.json();
    })
    .then(res => {
      // account.user = res

      console.log("Update project", res);

      Fn.store({ label: "activeProject", value: res });

      parent.setState({
        project: res,

        isOpen: false
        // files: res.files
      });

      // self.context.updateAccount()

      // self.props.closeDialog()
    });
};
Fn.uploadCV = async data => {
  const { self, file } = data;

  let fileUrl =
    "https://crew20-uploads.s3.eu-west-2.amazonaws.com/" + file.name;

  // // console.log(fileUrl)

  let account = Fn.get("account");

  let user = account.user;

  user.profile.cv.file = fileUrl;

  user.profile.cv.uploaded = true;

  // let userId = user.id;

  // let url = "https://api.crew20.devcolab.site/v1/users/" + userId;
  let url = api.url("users") + user.id;

  let config = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  };
  await fetch(url, config)
    .then(res => {
      // // console.log('res', res)

      if (res.status !== 200) {
        return null;
      }
      return res.json();
    })
    .then(res => {
      // console.log('CV Upload Updated User', res)

      account.user = res;

      Fn.store({ label: "account", value: account });

      self.context.updateAccount();

      self.props.closeDialog();
    });
};

Fn.uploadWorkPortfolioImage = async data => {
  const { self, file } = data;

  let fileUrl =
    "https://crew20-uploads.s3.eu-west-2.amazonaws.com/" + file.name;

  // console.log(fileUrl)

  self.setState({
    portfolioImage: fileUrl
  });

  return fileUrl;

  // let account = Fn.get('account');
  // let user = account.user;

  // user.profile.portfolio = fileUrl
  // let userId = user.id;

  // let url = "https://api.crew20.devcolab.site/v1/users/" + userId;

  // let config = {
  //     method: "PATCH",
  //     headers: {
  //         "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify(user)
  // }
  // await fetch(url, config).then(res => {
  //     // console.log('res', res)
  //     if (res.status !== 200) {

  //         return null
  //     }
  //     return res.json()
  // }).then(res => {
  //     // console.log('user update', res)
  //     account.user = res
  //     Fn.store({ label: 'account', value: account })
  //     self.context.updateAccount()
  //     self.props.closeDialog()
  // })
};

Fn.modifyUsers = async () => {
  let url = "https://api.crew20.devcolab.site/v1/users/";
  let users = await fetch(url)
    .then(res => {
      return res.json();
    })
    .then(res => {
      return res;
    });

  for (let user of users) {
    // let role = item.profile.additional.role;

    // item.position = role;

    // user.profile.cv = {
    //   file: "",
    //   uploaded: false
    // };
    user.profile.network = {
      pending: [],
      confirmed: []
    };
    user.profile.confirmed = true;

    let url = "https://api.crew20.devcolab.site/v1/users/" + user.id;

    let config = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    };
    await fetch(url, config)
      .then(res => {
        return res.json();
      })
      .then(res => {
        // console.log(res)
      });
  }
};

Fn.extractAuthors = async data_ => {
  const { self, conversations } = data_;

  console.log(" ");
  console.log(" ");
  console.log(" ");
  console.log("[[ extractAuthors ]]", data_);
  console.log(" ");
  console.log(" ");
  console.log(" ");

  return new Promise(async resolve => {
    // let messages = messages;

    for (let conversation of conversations) {
      let authorIds = new Set();

      let messages = conversation.messages;

      for (let item of messages) {
        authorIds.add(item.author);
      }

      let a = Array.from(authorIds);

      // this.setState({
      //     authorIds: a
      // })
    }

    // console.log(' ')
    // console.log(' ')
    // console.log(' ')
    // console.log('[[ authorIds ]]', a)
    // console.log(' ')
    // console.log(' ')
    // console.log(' ')

    // setTimeout(() => {
    //     resolve(a)
    // },1000)
  });

  // await Fn.fetchCommentAuthors({ self: this, authorIds: a })
};
Fn.fetchConversations = async data => {
  // console.log('  ')
  // console.log('  ')
  // console.log('  ')
  // console.log(" ");
  // console.log(" ");
  // console.log(" ");
  // console.log("[[ fetchConversations ]]", data);
  // console.log(" ");
  // console.log(" ");
  // console.log(" ");

  const { self, userId, type } = data;


  return new Promise(async resolve => {
    // let url =
    //   "https://api.crew20.devcolab.site/v1/conversations/?participants=" +
    //   userId +
    //   "&type=" +
    //   type;

         let url =
      "https://dev.iim.technology/v1/conversations/?participants=" +
      userId +
      "&type=" +
      type;

    // console.log("conv fetch url ", url);

    await fetch(url)
      .then(async res => {
        return res.json();
      })
      .then(async res => {
        // console.log("Conv RES ", res);

        Fn.store({ label: "conversations", value: res });

        self.setState({
          conversations: res,
          activeConversation: res[0]
        });

        resolve(res);
      });
  });
};
Fn.fetchRecipientData = async data => {
  // console.log('  ')
  // console.log('  ')
  // console.log('  ')

  const { self, recipientId } = data;

  let url = "https://api.crew20.devcolab.site/v1/users/" + recipientId;

  return await fetch(url)
    .then(res => {
      return res.json();
    })
    .then(res => {
      // console.log('recipient data ', res)
      // self.setState({
      //     recipientData: res,
      //     conversation: {
      //         messages: self.props.item.messages,
      //         authorData: Fn.get('account').user,
      //         recipientData: res,
      //         item: self.props.item
      //     },
      //     ready: true
      // })
      // Fn.store({ label: 'conversations', value: res })
      return res;
    });
};
Fn.getRecipientId = async data => {
  const { self, participants, userId } = data;

  let userIndex = participants.indexOf(userId);

  let p = [...participants];

  p.splice(userIndex, 1);

  return p[0];
};
Fn.updateConversationMessages = async data => {
  const { self, conversation } = data;

  // console.log('conversation to update', conversation)

  let apiUrl = api.url("conversations") + conversation.id;

  let config = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(conversation)
  };

  return await fetch(apiUrl, config)
    .then(res => {
      return res.json();
    })
    .then(res => {
      let index = self.props.activeConversationIndex;

      let conversations = self.props.conversations;

      conversations[index] = res;
      conversations[index].authors = conversation.authors;

      // console.log("conversations", conversations, conversation);

      self.props.updateActiveConversation({
        conversations: conversations,
        activeConversation: conversations[index]
        // activeConversation:
      });
    });
};
Fn.createGroupConversation = async data => {
  console.log("  ");
  console.log(" conversation to insert  ", data);
  console.log("  ");

  const { self, users, type, name } = data;

  const author = Fn.get("account").user.id;

  let u = users.map(item => item.id);

  let conversation = {
    participants: u,
    messages: [],
    author: author,
    type: type,
    name: name,
    group: true
  };

  // let url = "https://api.crew20.devcolab.site/v1/conversations/";
    let url = "https://dev.iim.technology/v1/conversations/";

  let config = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + Fn.get("account").tokens.access.token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(conversation)
  };

  console.log("group con to insert", conversation);

  return await fetch(url, config)
    .then(res => {
      // console.log(res)
      return res.json();
    })
    .then(async res => {
      console.log("[[ new Group Converation created ]]", res);

      Fn.set("activeConversation", res);
      // await Fn.fetchConversations({ self, userId: selfUserId });

      self.setState({
        buttonLoading: false,
        isOpen: false
      });
      self.reload();
    });
};
Fn.createNewConversation = async data => {
  console.log("  ");
  console.log(" conversation to insert  ", data);
  console.log("  ");

  const { self, selfUserId, recipientId, type } = data;

  let conversation = {
    participants: [selfUserId, recipientId],
    messages: [],
    author: selfUserId,
    type: type
  };
  // console.log('[[ Conv to create ]]', conversation)
  // let url = "https://api.crew20.devcolab.site/v1/conversations/";

 let url = "https://dev.iim.technology/v1/conversations/";
  

  let config = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + Fn.get("account").tokens.access.token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(conversation)
  };
  // // console.log('conversation to create ',config)
  return await fetch(url, config)
    .then(res => {
      console.log(res);
      return res.json();
    })
    .then(async res => {
      console.log("[[ new Converation created ]]", res);

      // let userId = selfUserId;

      await Fn.fetchConversations({ self, userId: selfUserId });
      // self.setState({
      //     conversations: res,
      //     activeConversation: res[0],
      //     ready: true
      // })

      // Fn.store({ label: 'conversations', value: res })

      // return res

      // self.props.updateActiveConversation({
      //     conversation: res,
      //     conversationData: {
      //         authorData: self.props.authorData,
      //         recipientData: self.props.recipientData
      //     }
      // })
    });
};

Fn.checkConversationExists = async data => {
  // console.log('  ')
  // console.log('  ')
  // console.log('  ')

  const { self, selfUserId, recipientId } = data;

  // console.log('checkConversationExists', data)

  // let url1 =
  //   "https://api.crew20.devcolab.site/v1/conversations/?participants=" +
  //   selfUserId;
  // let url2 =
  //   "https://api.crew20.devcolab.site/v1/conversations/?participants=" +
  //   recipientId;

  let url1 =
    "https://dev.iim.technology/v1/conversations/?participants=" +
    selfUserId;
  let url2 =
    "https://dev.iim.technology/v1/conversations/?participants=" +
    recipientId;


  let conv1 = await fetch(url1)
    .then(res => {
      return res.json();
    })
    .then(res => {
      // console.log('conv1 ', res)
      return res;
    });
  let conv2 = await fetch(url2)
    .then(res => {
      return res.json();
    })
    .then(res => {
      // console.log('conv2 ', res)
      return res;
    });

  let match;
  let exists = false;
  for (let item of conv1) {
    let id = item.id;
    for (let item_ of conv2) {
      let id_ = item_.id;
      if (id === id_) {
        if (item_.type === "private") {
          let a = item;
          let b = item_;
          let c = { ...a, ...b };
          console.log("Found existing conversation", c);
          match = c;
          exists = true;
        } else {
          match = null;
          exists = false;
        }

        // if(c.participants.length > 2) {
        //   exists = false
        //   // return
        // }
        // else {

        // }
      }
      // else {
      //     exists
      // }
    }
  }
  // console.log('match', match)
  // Fn.store({ label: 'activeConversation', value: match})

  // let exists = match.length > 0 ? true : false

  // console.log('[[ EXISTS ]]', exists)

  return { exists: exists, conversation: match };

  // if(res.length > 0) {
  //     // console.log(' ')
  //     // console.log('[[ Conversation Exists ]]')
  //     // console.log(' ')
  //     return true
  // }
  // else {
  //     // console.log(' ')
  //     // console.log('[[ Conversation does Not Exist ]]')
  //     // console.log(' ')
  //     return false
  // }
};
Fn.deleteAllConversations = async () => {
  let url = "https://api.crew20.devcolab.site/v1/conversations/";

  let conversations = await fetch(url)
    .then(res => {
      return res.json();
    })
    .then(res => {
      return res;
    });

  for (let item of conversations) {
    let url = "https://api.crew20.devcolab.site/v1/conversations/" + item.id;

    let config = {
      method: "DELETE"
    };
    await fetch(url, config);
  }
};
Fn.modifyProjects = async data => {
  let urlP = "https://api.crew20.devcolab.site/v1/projects/";
  let projects = await fetch(urlP)
    .then(res => {
      return res.json();
    })
    .then(res => {
      console.log("p", res);
      return res;
    });

  for (let item of projects) {
    let admins = [];
    let roles = [
      {
        canEditCrew: [],
        canEditProject: [],
        canManageFiles: [],
        canEditCalendar: []
      }
    ];
    item.admins = admins;
    item.roles = roles;
    item.accepted = [];
    let config = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    };
    let url = "https://api.crew20.devcolab.site/v1/projects/" + item.id;
    await fetch(url, config)
      .then(res => {
        return res.json();
      })
      .then(res => {
        console.log("p", res);
        return res;
      });
    // if (item.hasOwnProperty("positions")) {
    //   // item.discussion = []

    //   // let url = "https://api.crew20.devcolab.site/v1/projects/" + item.id;

    //   let body = {
    //     messages: [],
    //     participants: [],
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   };

    //   let conversation = await api
    //     .post("projects", body)
    //     .then(async conversation => {
    //       item.conversation = conversation.id;

    //       let url = api.url("projects") + item.id;

    //       let config = {
    //         method: "PATCH",
    //         headers: {
    //           "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(item)
    //       };

    //       await fetch(url, config)
    //         .then(res => {
    //           return res.json();
    //         })
    //         .then(res => {
    //           console.log(" updated project res", res);
    //         });
    //     });

    //   // let body = {

    //   // }
    // }

    // if (!item.hasOwnProperty("shortlist")) {
    //   item.shortlist = [];

    //   let url = "https://api.crew20.devcolab.site/v1/projects/" + item.id;

    //   let config = {
    //     method: "PATCH",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(item)
    //   };

    //   await fetch(url, config)
    //     .then(res => {
    //       return res.json();
    //     })
    //     .then(res => {
    //       console.log(" updated project res", res);
    //     });
    // }
  }
};
Fn.deleteConversation = async data_ => {
  const { convId } = data_;

  let url = Fn.api("conversations") + convId;

  console.log("url", url);

  let config = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  };

  await fetch(url, config);
};
Fn.modifyConversations = async () => {
  let url = await Fn.api("conversations");

  let conversations = await fetch(url)
    .then(res => {
      return res.json();
    })
    .then(res => {
      return res;
    });

  for (let conv of conversations) {
    if (!conv.hasOwnProperty("author")) {
      console.log("conv doesnt have author");

      let convId = conv.id;

      await Fn.deleteConversation({ convId });
    }
  }
};

Fn.createEvent = async _ => {
  const { self, user, event } = _;

  if (!user.profile.hasOwnProperty("events")) {
    user.profile.events = [];
  }

  let events = user.profile.events;

  events.push(event);

  user.profile.events = events;

  let url = Fn.api("users") + user.id;

  let config = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  };

  await fetch(url, config)
    .then(res => {
      return res.json();
    })
    .then(res => {
      console.log("createEvent res", res);

      self.context.updateAccount(res);

      self.setState({
        isOpen: false
      });

      self.reload();
    });
};

Fn.deleteEvents = async () => {
  let eurl = api.url("events");
  let config = {
    headers: {
      Authorization: "Bearer " + Fn.get("account").tokens.access.token
    }
  };
  // let events = []
  let events = await fetch(eurl, config)
    .then(res => {
      return res.json();
    })
    .then(res => {
      console.log("event", res);
      // events.push(res.id)
      return res;
    });

  for (let item of events) {
    let eurl1 = api.url("events") + item.id;
    let config = {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + Fn.get("account").tokens.access.token
      }
    };
    // let events = []
    await fetch(eurl1, config)
      .then(res => {
        // return res.json()
      })
      .then(res => {
        // events.push(res.id)
        // console.log('event deleted', res)
      });
  }
};

Fn.deleteProjects = async () => {
  let eurl = api.url("projects");

  let config = {
    headers: {
      Authorization: "Bearer " + Fn.get("account").tokens.access.token
    }
  };

  // let events = []
  let events = await fetch(eurl, config)
    .then(res => {
      return res.json();
    })
    .then(res => {
      console.log("event", res);
      // events.push(res.id)
      return res;
    });

  for (let item of events) {
    let eurl1 = api.url("projects") + item.id;
    let config = {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + Fn.get("account").tokens.access.token
      }
    };
    // let events = []
    await fetch(eurl1, config)
      .then(res => {
        // return res.json()
        console.log(res);
      })
      .then(res => {
        // events.push(res.id)
        // console.log('event deleted', res)
      });
  }
};

Fn.deleteConversations = async () => {
  let eurl = api.url("conversations");
  let config = {
    headers: {
      Authorization: "Bearer " + Fn.get("account").tokens.access.token
    }
  };
  // let events = []
  let events = await fetch(eurl, config)
    .then(res => {
      return res.json();
    })
    .then(res => {
      console.log("event", res);
      // events.push(res.id)
      return res;
    });

  for (let item of events) {
    let eurl1 = api.url("conversations") + item.id;
    let config = {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + Fn.get("account").tokens.access.token
      }
    };
    // let events = []
    await fetch(eurl1, config)
      .then(res => {
        // return res.json()
        console.log(res);
      })
      .then(res => {
        // events.push(res.id)
        // console.log('event deleted', res)
      });
  }
};

// export const api = () => {

// }

// api.fetch = async (__) => {

//     const { self, type, method, id, filter, data } = __

//     let apiUrl = api.url(type)

//     let config = {
//         headers: {
//             "Content-Type": "application/json"
//         },
//         method: method,
//         body: method === "POST" || method === "PUT" || method === "PATCH" ? JSON.stringify(data) : null
//     }

//     await fetch(apiUrl, config).then(res => {

//         return res.json()

//     }).then(res => {

//         return res

//     })

// }

// api.fetchAndSet = async (__) => {

//     const { self, type, method, id, filter, data } = __

//     const res = await api.fetch(__)

//     self.setState({
//         [type]: res
//     })

// }

// api.url = (type) => {

//     if (localStorage && localStorage.getItem('env') !== null && localStorage.getItem('env').set === true) {

//         let env = localStorage.getItem('env').env

//         if (env === "development") {
//             return appconfig.api.dev + type + "/"
//         }
//         if (env === "production") {
//             return appconfig.api.prod + type + "/"
//         }

//     }
//     else {
//         if (process.env.NODE_ENV === "development") {
//             return appconfig.api.dev + type + "/"
//         }
//         if (process.env.NODE_ENV === "production") {
//             return appconfig.api.dev + type + "/"
//         }
//     }

//     // if (process.env.NODE_ENV === "development") {
//     //     return appconfig.api.dev + type + "/"
//     // }
//     // if (process.env.NODE_ENV === "production") {
//     //     return appconfig.api.production + type + "/"
//     // }

// }

// api.api = (type) => {

//     // const { type } = data_;

//     console.log('api type', type)

//     let apiBase = Fn.apiBase(type)

//     return apiBase

// }

util.Fn = Fn;
util.api = api;
util.ui = ui;
util.app = app;
util.util = util;

window.Fn = Fn;
window.api = api;
window.util = util;
window.ui = ui;
window.app = app;
export default Fn;
