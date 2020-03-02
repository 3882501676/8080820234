import { getGlobal } from "reactn";
import moment from 'moment';
import appconfig from '../config/app.config.js';
// console.log('appconfig', appconfig)
// const mailgun = require("mailgun-js");
// var Mailjet = require('node-mailjet').connect(appconfig.mailjet.api_key, appconfig.mailjet.api_secret);
// Reservation_Notification_Chef
let mailsend = {};
mailsend.SendNotificati0on = async (data) => {
  // --url https://api.pepipost.com/v2/sendEmail \
  // --header 'api_key: <YOUR_API_KEY>' \
  // --header 'content-type: application/json' \
  // --data '{"personalizations":[{"recipient":"steve@example.com","attributes":{"NAME":"Steve"}}],"tags":"OrderConfirmationEmail","from":{"fromEmail":"sales@yourdomain.com","fromName":"ABC Sales"},"subject":"Your Order is confirmed","content":"Hi,[%NAME%] this is my first test email"}'

  let data_ = {
    personalisations: [
      {
        recipient: data.user.email,
        attributes: {
          "cheffirstname": data.chef.given_name,
          "cheflastname": data.chef.family_name,
          "chefavatar": data.chef.picture,
          "location": data.location,
          "date": data.date,
          "startime": data.time,
          "endtime": data.time,
          "cost": data.cost,
          "hours": data.hours,
          "additionalcharges": data.additionalcharges,
          "totalcost": data.totalcost
        }
      }
    ],
    from: {
      fromEmail: appconfig.email.systemEmail,
      fromName: "HomeChef"
    },
    subject: "Reservation Request Received [ HomeChef ]",
    content: "Reservation Request Received for chef " + data.chef.given_name + " " + data.chef.family_name
  }
  // const proxyurl = "https://cors-anywhere.herokuapp.com/";
  let url = "https://api.pepipost.com/v2/sendEmail";
  let config = {
    method: "POST",
    cors: true,
    headers: {
      "content-type": "text/plain",
      Origin: 'http://localhost:3000',
      api_key: "c243ccfed9143e2e02f10c78eb71f1a9"
    },
    data: JSON.stringify(data_)
  }
  await fetch(url, config, (err, res) => {
    if (err) { console.error(err) }
    else {
      console.log('[[ mailsend.ReservationRequestUser ]]', res)
    }
  })

}

mailsend.ReservationRequestUser = async (data) => {
  // --url https://api.pepipost.com/v2/sendEmail \
  // --header 'api_key: <YOUR_API_KEY>' \
  // --header 'content-type: application/json' \
  // --data '{"personalizations":[{"recipient":"steve@example.com","attributes":{"NAME":"Steve"}}],"tags":"OrderConfirmationEmail","from":{"fromEmail":"sales@yourdomain.com","fromName":"ABC Sales"},"subject":"Your Order is confirmed","content":"Hi,[%NAME%] this is my first test email"}'

  let data_ = {
    personalisations: [
      {
        recipient: data.user.email,
        attributes: {
          "cheffirstname": data.chef.given_name,
          "cheflastname": data.chef.family_name,
          "chefavatar": data.chef.picture,
          "location": data.location,
          "date": data.date,
          "startime": data.time,
          "endtime": data.time,
          "cost": data.cost,
          "hours": data.hours,
          "additionalcharges": data.additionalcharges,
          "totalcost": data.totalcost
        }
      }
    ],
    from: {
      fromEmail: appconfig.email.systemEmail,
      fromName: "HomeChef"
    },
    subject: "Reservation Request Received [ HomeChef ]",
    content: "Reservation Request Received for chef " + data.chef.given_name + " " + data.chef.family_name
  }
  // const proxyurl = "https://cors-anywhere.herokuapp.com/";
  let url = "https://api.pepipost.com/v2/sendEmail";
  let config = {
    method: "POST",
    cors: true,
    headers: {
      "content-type": "text/plain",
      Origin: 'http://localhost:3000',
      api_key: "c243ccfed9143e2e02f10c78eb71f1a9"
    },
    data: JSON.stringify(data_)
  }
  await fetch(url, config, (err, res) => {
    if (err) { console.error(err) }
    else {
      console.log('[[ mailsend.ReservationRequestUser ]]', res)
    }
  })

}
mailsend.ReservationRequestUser1 = async (data) => {

  // const DOMAIN = "sandbox7e18a95c2a7140a698efeb363e548df4.mailgun.org";
  // const mg = mailgun({ apiKey: appconfig.mailgun.api_key, domain: DOMAIN, url: "http://mailgun.quantacom.co" });
  // const requestdata = {
  //   from: appconfig.email.systemEmail,
  //   to: data.user.email,
  //   subject: "Reservation Request Received [ HomeChef ]",
  //   template: "...",
  // 'h:X-Mailgun-Variables': {
  //   "cheffirstname": data.chef.given_name,
  //   "cheflastname": data.chef.family_name,
  //   "chefavatar": data.chef.picture,
  //   "location": data.location,
  //   "date": data.date,
  //   "startime": data.time,
  //   "endtime": data.time,
  //   "cost": data.cost,
  //   "hours": data.hours,
  //   "additionalcharges": data.additionalcharges,
  //   "totalcost": data.totalcost
  // }
  // };
  // await mg.messages().send(requestdata, function (error, body) {
  //   if (error) { console.error(error) }
  //   console.log(body);
  // })
}
// mailsend.ReservationRequestUser1 = async(data) => {
//   console.log('mailsend.ReservationRequestUser data',data);

//   const request = Mailjet
//     .post("send", {'version': 'v3'})
//     .request({
//         "Messages":[
//                 {
//                         "From": {
//                                 "Email": "questappsza@gmail.com",
//                                 "Name": "[ HomeChef ]"
//                         },
//                         "To": [
//                                 {
//                                         "Email": data.user.email,
//                                         "Name": data.user.given_name
//                                 }
//                         ],
//                         "TemplateID": "1060247",
//                         "Subject": "Reservation Request Received [ HomeChef ]",
//                         "TextPart": "Reservation request received for chef " + data.chef.given_name + " " +data.chef.family_name +".",
//                         "HTMLPart": "",
//                         "Vars": {
//                           "cheffirstname": data.chef.given_name,
//                           "cheflastname": data.chef.family_name,
//                           "chefavatar": data.chef.picture,
//                           "location": data.location,
//                           "date": data.date,
//                           "startime": data.time,
//                           "endtime": data.time,
//                           "cost": data.cost,
//                           "hours": data.hours,
//                           "additionalcharges": data.additionalcharges,
//                           "totalcost": data.totalcost
//                         }
//                 }
//         ]
//     })
//     console.log('request', request)
// request
//     .then((result) => {
//         console.log(result)
//     })
//     .catch((err) => {
//         console.log(err)
//     })
// }
mailsend.SendNotification = async (data_) => {

  console.log('mailsend.SendNotification', data_)

  const { user, content, subject, title } = data_;

  console.log('')

  let body = {
    to: user.email,
    subject: subject,
    userFirstName: user.profile.name.first,
    userLastName: user.profile.name.last,
    userAvatar: user.profile.picture,
    content: content,
    title: title
  }

  console.log('body', body);

  const config_ = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: {}
  }
  // console.log('config',config, config.email)
  const data = {
    apiKey: "15b3483f-bc64-4feb-9e8e-e3909ca8646f",
    from: appconfig.email.systemEmail,
    to: body.to,
    bodyText: body.content,
    merge_content: body.content,
    template: "crew20_notification",
    isTransactional: true,
    merge_title: body.title,
    merge_senderfirstname: body.senderFirstName,
    merge_senderlastname: body.senderLastName,
    // merge_useravatar: body.userAvatar,
    subject: body.subject,
    fromName: appconfig.email.fromName,
    msgFromName: appconfig.email.fromName,
    replyTo: appconfig.email.systemEmail,
    sender: appconfig.email.fromName
  };

  console.log('User Mailsend data', data)

  const url =
    "https://api.elasticemail.com/v2/email/send?apikey=" +
    data.apiKey +
    "&from=" +
    data.from +
    "&to=" +
    data.to +
    "&template=" +
    data.template +
    "&isTransactional=" +
    body.isTransactional +
    "&bodyText=" +
    data.bodyText +
    "&merge_content=" +
    data.merge_content +
    "&merge_usernamefirst=" +
    data.merge_usernamefirst +
    "&merge_usernamelast=" +
    data.merge_usernamelast +
    "&merge_email=" +
    data.merge_email +
    "&subject=" +
    data.subject +
    "&fromName=" +
    data.fromName +
    "&msgFromName=" +
    data.msgFromName +
    "&replyTo=" +
    data.replyTo +
    "&sender=" +
    data.sender;

  // console.log("URL", url);

  await fetch(url, config_)
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log("mailsend.reservationRequestNotification Request succeeded with JSON response", data)
      return data
    })
    .catch(error => {
      console.log("mailsend.reservationRequestNotification Request failed", error);
      return error
    });
}
mailsend.ChefReservationRequestNotification = async (data_) => {
  console.log('mailsend.UserReservationRequestNotification', data_)
  const { currency, location, reservationID, user, chef, cost, hours, timeStart, timeEnd, date, confirmationEmailSubject, additionalCharges, totalCost } = data_;
  console.log()
  let body = {
    to: user.email,
    subject: "Reservation request received for " + date + ". ",
    userNameFirst: user.given_name,
    userNameLast: user.family_name,
    userAvatar: user.picture,
    userCity: '',
    userCountry: '',
    chefNameFirst: chef.given_name,
    chefNameLast: chef.family_name,
    chefAvatar: chef.picture,
    date: moment(date).format('MMMM Do YYYY'),
    startTime: moment(timeStart).format('LT'),
    endTime: moment(timeEnd).format('LT'),
    cost: cost,
    additionalCharges: additionalCharges,
    totalCost: totalCost,
    location: location,
    reservationID: reservationID,
    hours: hours
  }
  console.log('body', body);
  const config_ = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: {}
  }
  // console.log('config',config, config.email)
  const data = {
    apiKey: "15b3483f-bc64-4feb-9e8e-e3909ca8646f",
    from: appconfig.email.systemEmail,
    to: chef.email,
    bodyText: "Reservation request received for " + date + ". " + body.content,
    merge_content: body.content,
    template: "ReserveChef",
    isTransactional: true,
    merge_userfirstname: body.userNameFirst,
    merge_userlastname: body.userNameLast,
    merge_useravatar: body.userAvatar,
    merge_usercity: '',
    merge_usercountry: '',
    merge_cheffirstname: body.chefNameFirst,
    merge_cheflastname: body.chefNameLast,
    merge_chefavatar: body.chefAvatar,
    merge_date: body.date,
    merge_hours: body.hours,
    merge_starttime: body.startTime,
    merge_endtime: body.endTime,
    merge_cost: body.cost,
    merge_location: body.location,
    merge_additionalcharges: body.additionalCharges,
    merge_totalcost: body.totalCost,
    merge_resID: body.reservationID,
    merge_currencysymbol: currency.symbol,
    merge_currencyname: currency.name,
    subject: body.subject,
    fromName: appconfig.email.fromName,
    msgFromName: appconfig.email.fromName,
    replyTo: appconfig.email.systemEmail,
    sender: appconfig.email.fromName
  };
  console.log('User Mailsend data', data)
  const url =
    "https://api.elasticemail.com/v2/email/send?apikey=" +
    data.apiKey +
    "&from=" +
    data.from +
    "&to=" +
    data.to +
    "&template=" +
    data.template +
    "&isTransactional=" +
    body.isTransactional +
    "&bodyText=" +
    data.bodyText +
    "&merge_content=" +
    data.merge_content +
    "&merge_userfirstname=" +
    data.merge_userfirstname +
    "&merge_userlastname=" +
    data.merge_userlastname +
    "&merge_useravatar=" +
    data.merge_useravatar +
    "&merge_cheffirstname=" +
    data.merge_cheffirstname +
    "&merge_cheflastname=" +
    data.merge_cheflastname +
    "&merge_chefavatar=" +
    data.merge_chefavatar +
    "&merge_email=" +
    data.merge_email +
    "&merge_date=" +
    data.merge_date +
    "&merge_hours=" +
    data.merge_hours +
    "&merge_starttime=" +
    data.merge_starttime +
    "&merge_endtime=" +
    data.merge_endtime +
    "&merge_cost=" +
    data.merge_cost +
    "&merge_location=" +
    data.merge_location +
    "&merge_additionalcharges=" +
    data.merge_additionalcharges +
    "&merge_totalcost=" +
    data.merge_totalcost +
    "&merge_resID=" +
    data.merge_resID +
    "&merge_currencysymbol=" +
    data.merge_currencysymbol +
    "&merge_currencyname=" +
    data.merge_currencyname +
    "&subject=" +
    data.subject +
    "&fromName=" +
    data.fromName +
    "&msgFromName=" +
    data.msgFromName +
    "&replyTo=" +
    data.replyTo +
    "&sender=" +
    data.sender;

  // console.log("URL", url);

  await fetch(url, config_)
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log("mailsend.reservationRequestNotification Request succeeded with JSON response", data)
      return data
    })
    .catch(error => {
      console.log("mailsend.reservationRequestNotification Request failed", error);
      return error
    });
}

// mailsend.ChefReservationRequestNotification = async (data_) => {
//   console.log('mailsend.ChefReservationRequestNotification', data_)
//   const { location, reservationID, user, chef, cost, hours, time, date, confirmationEmailSubject, additionalCharges, totalCost } = data_;
//   console.log()
//   let body = {
//     to: chef.email,
//     subject: confirmationEmailSubject,
//     userNameFirst: user.given_name,
//     userNameLast: user.family_name,
//     userAvatar: user.picture,
//     userCity: user.config.location.city,
//     userCountry: user.config.location.country,
//     chefNameFirst: chef.given_name,
//     chefNameLast: chef.family_name,
//     chefAvatar: chef.avatar,
//     reservationDate: moment(date).format('MMMM Do YYYY'),
//     reservationHours: hours,
//     reservationTime: time,
//     reservationLocation: location,
//     reservationCost: getGlobal().activeCurrency.symbol + cost,
//     additionalCharges: getGlobal().activeCurrency.symbol + additionalCharges,
//     totalCost: getGlobal().activeCurrency.symbol + totalCost,
//     reservationID: reservationID
//   }
//   console.log('body', body);
//   const config_ = {
//     method: "POST",
//     headers: {
//       "content-type": "application/x-www-form-urlencoded"
//     },
//     body: {}
//   }
//   // console.log('config',config, config.email)
//   const data = {
//     apiKey: "15b3483f-bc64-4feb-9e8e-e3909ca8646f",
//     from: appconfig.email.systemEmail,
//     to: body.to,
//     bodyText: "Reservation request received for chef" + body.chefNameFirst + " " + body.chefNameLast + ". " + body.content,
//     merge_content: body.content,
//     template: "Reservation_Notification_Chef",
//     isTransactional: true,
//     merge_userfirstname: body.userNameFirst,
//     merge_userlastname: body.userNameLast,
//     merge_useravatar: body.userAvatar,
//     merge_usercity: body.userCity,
//     merge_usercountry: body.userCountry,
//     merge_cheffirstname: body.chefNameFirst,
//     merge_cheflastname: body.chefNameLast,
//     merge_chefavatar: body.chefAvatar,
//     merge_reservationdate: body.reservationDate,
//     merge_reservationhours: body.reservationHours,
//     merge_reservationtime: body.reservationTime,
//     merge_reservationcost: body.reservationCost,
//     merge_reservationlocation: body.reservationLocation,
//     merge_additionalcharges: body.additionalCharges,
//     merge_totalcost: body.totalCost,
//     merge_resID: body.reservationID,
//     subject: body.subject,
//     fromName: appconfig.email.fromName,
//     msgFromName: appconfig.email.fromName,
//     replyTo: appconfig.email.systemEmail,
//     sender: appconfig.email.fromName
//   };
//   console.log('Chef Mailsend data', data)
//   const url =
//     "https://api.elasticemail.com/v2/email/send?apikey=" +
//     data.apiKey +
//     "&from=" +
//     data.from +
//     "&to=" +
//     data.to +
//     "&template=" +
//     data.template +
//     "&isTransactional=" +
//     body.isTransactional +
//     "&bodyText=" +
//     data.bodyText +
//     "&merge_content=" +
//     data.merge_content +
//     "&merge_userfirstname=" +
//     data.merge_userfirstname +
//     "&merge_userlastname=" +
//     data.merge_userlastname +
//     "&merge_useravatar=" +
//     data.merge_useravatar +
//     "&merge_usercity=" +
//     data.merge_usercity +
//     "&merge_usercountry=" +
//     data.merge_usercountry +
//     "&merge_cheffirstname=" +
//     data.merge_cheffirstname +
//     "&merge_cheflastname=" +
//     data.merge_cheflastname +
//     "&merge_chefavatar=" +
//     data.merge_chefavatar +
//     "&merge_email=" +
//     data.merge_email +
//     "&merge_reservationdate=" +
//     data.merge_reservationdate +
//     "&merge_reservationhours=" +
//     data.merge_reservationhours +
//     "&merge_reservationtime=" +
//     data.merge_reservationtime +
//     "&merge_reservationcost=" +
//     data.merge_reservationcost +
//     "&merge_reservationlocation=" +
//     data.merge_reservationlocation +
//     "&merge_additionalcharges=" +
//     data.merge_additionalcharges +
//     "&merge_totalcost=" +
//     data.merge_totalcost +
//     "&merge_resID=" +
//     data.merge_resID +
//     "&subject=" +
//     data.subject +
//     "&fromName=" +
//     data.fromName +
//     "&msgFromName=" +
//     data.msgFromName +
//     "&replyTo=" +
//     data.replyTo +
//     "&sender=" +
//     data.sender;

//   console.log("URL", url);

//   await fetch(url, config_)
//     .then(res => {
//       return res.json();
//     })
//     .then(data => {
//       console.log("mailsend.reservationRequestNotification Request succeeded with JSON response", data)
//       return data
//     })
//     .catch(error => {
//       console.log("mailsend.reservationRequestNotification Request failed", error);
//       return error
//     });
// }
mailsend.confirmation = async (data_) => {
  let self = this;
  let body = {
    to: "info@quantacom.co",
    firstname: this.Name.value,
    lastname: this.Surname.value,
    email: this.Email.value,
    phone: this.Phone.value,
    requirements: this.Requirements.value
  };
  console.log(body);
  const config = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: {}
  };
  const data = {
    apiKey: "15b3483f-bc64-4feb-9e8e-e3909ca8646f",
    from: "info@quantacom.co",
    to: "info@quantacom.co",
    bodyText: "",
    template: "Contact_Admin",
    isTransactional: false,
    merge_firstname: body.firstname,
    merge_lastname: body.lastname,
    merge_requirements: body.requirements,
    merge_email: body.email,
    merge_phone: body.phone,
    subject:
      "New Message From [ " + body.firstname + " " + body.lastname + " ]",
    fromName: body.firstname,
    msgFromName: body.firstname + " " + body.lastname,
    replyTo: body.email,
    sender: body.firstname
  };
  const url =
    "https://api.elasticemail.com/v2/email/send?apikey=" +
    data.apiKey +
    "&from=" +
    data.from +
    "&to=" +
    data.to +
    "&bodyText=" +
    data.bodyText +
    "&template=" +
    data.template +
    "&isTransactional=" +
    body.isTransactional +
    "&merge_firstname=" +
    data.merge_firstname +
    "&merge_lastname=" +
    data.merge_lastname +
    "&merge_requirements=" +
    data.merge_requirements +
    "&merge_email=" +
    data.merge_email +
    "&merge_phone=" +
    data.merge_phone +
    "&subject=" +
    data.subject +
    "&fromName=" +
    data.fromName +
    "&msgFromName=" +
    data.msgFromName +
    "&replyTo=" +
    data.replyTo +
    "&sender=" +
    data.sender;

  console.log("URL", url);

  await fetch(url, config)
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log("Request succeeded with JSON response", data);
      // this.props.success({type: "mail"});
      self.setState({
        // insertFormVisible: false,
        buttonLoading: false
      });
    })
    .catch(error => {
      console.log("Request failed", error);
      self.setState({
        // insertFormVisible: false,
        buttonLoading: false
      });
    });
}
export default mailsend;