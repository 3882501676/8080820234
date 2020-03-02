import { getGlobal } from "reactn";
import moment from 'moment';
import appconfig from '../config/app.config.js';
// console.log('appconfig', appconfig)
// const mailgun = require("mailgun-js");
// var Mailjet = require('node-mailjet').connect(appconfig.mailjet.api_key, appconfig.mailjet.api_secret);
// Reservation_Notification_Chef
let mailsend = {};

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
mailsend.SendConfirmationEmail = async (data_) => {

  console.log('mailsend.SendNotification', data_)

  const { user, subject, title, content, link } = data_;

  console.log('')

  let body = {
    to: user.email,
    subject: subject,
    title: title,
    // userFirstName: user.profile.name.first,
    // userLastName: user.profile.name.last,
    // userAvatar: user.profile.picture,
    content: content,
    link: link
    // title: title
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
    template: "crew20_confirmationemail",
    isTransactional: true,
    merge_title: body.title,
    // merge_senderfirstname: body.senderFirstName,
    // merge_senderlastname: body.senderLastName,
    // merge_useravatar: body.userAvatar,
    subject: body.subject,
    fromName: appconfig.email.fromName,
    msgFromName: appconfig.email.fromName,
    replyTo: appconfig.email.systemEmail,
    sender: appconfig.email.fromName,
    merge_link: body.link
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
    "&merge_title=" +
    data.merge_title +
    "&merge_content=" +
    data.merge_content +
    "&merge_link=" +
    data.merge_link +
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
      console.log("mailsend.SendConfirmationEmail Request succeeded with JSON response", data)
      return data
    })
    .catch(error => {
      console.log("mailsend.SendConfirmationEmail Request failed", error);
      return error
    });
}
mailsend.SendEmail = async (data_) => {

  console.log('mailsend.SendPasswordReset', data_)

  const { user, subject, title, content, link } = data_;

  console.log('')

  let body = {
    to: user.email,
    subject: subject,
    title: title,
    content: content,
    link: link
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
    template: "crew20_confirmationemail",
    isTransactional: true,
    merge_title: body.title,
    // merge_senderfirstname: body.senderFirstName,
    // merge_senderlastname: body.senderLastName,
    // merge_useravatar: body.userAvatar,
    subject: body.subject,
    fromName: appconfig.email.fromName,
    msgFromName: appconfig.email.fromName,
    replyTo: appconfig.email.systemEmail,
    sender: appconfig.email.fromName,
    merge_link: body.link
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
    "&merge_title=" +
    data.merge_title +
    "&merge_content=" +
    data.merge_content +
    "&merge_link=" +
    data.merge_link +
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
      console.log("mailsend.SendConfirmationEmail Request succeeded with JSON response", data)
      return data
    })
    .catch(error => {
      console.log("mailsend.SendConfirmationEmail Request failed", error);
      return error
    });
}
mailsend.SendPasswordReset = async (data_) => {

  console.log('mailsend.SendPasswordReset', data_)

  const { user, subject, title, content, link } = data_;

  console.log('')

  let body = {
    to: user.email,
    subject: subject,
    title: title,
    content: content,
    link: link
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
    template: "crew20_confirmationemail",
    isTransactional: true,
    merge_title: body.title,
    // merge_senderfirstname: body.senderFirstName,
    // merge_senderlastname: body.senderLastName,
    // merge_useravatar: body.userAvatar,
    subject: body.subject,
    fromName: appconfig.email.fromName,
    msgFromName: appconfig.email.fromName,
    replyTo: appconfig.email.systemEmail,
    sender: appconfig.email.fromName,
    merge_link: body.link
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
    "&merge_title=" +
    data.merge_title +
    "&merge_content=" +
    data.merge_content +
    "&merge_link=" +
    data.merge_link +
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
      console.log("mailsend.SendConfirmationEmail Request succeeded with JSON response", data)
      return data
    })
    .catch(error => {
      console.log("mailsend.SendConfirmationEmail Request failed", error);
      return error
    });
}
mailsend.InviteByEmail = async (invitation) => {

  console.log('mailsend.SendNotification', invitation)

  const { link, receiverEmail, subject, title, content, projectTitle, projectStartDate } = invitation;

  console.log('')

  let body = {
    to: receiverEmail,
    subject: subject,
    content: content,
    title: title,
    projectTitle: projectTitle,
    projectStartDate: projectStartDate,
    link: link
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
    template: "crew20_inviteByEmail",
    isTransactional: true,
    merge_title: body.title,
    merge_projectStartDate: body.projectStartDate,
    merge_projectTitle: body.projectTitle,
    merge_link: body.link,
    // merge_senderfirstname: body.senderFirstName,
    // merge_senderlastname: body.senderLastName,
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
    "&merge_projectTitle=" +
    data.merge_projectTitle +
    "&merge_projectStartDate=" +
    data.merge_projectStartDate +
    "&merge_title=" +
    data.merge_title +
    "&merge_link=" +
    data.merge_link +
    // "&merge_email=" +
    // data.merge_email +
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

  return await fetch(url, config_)
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log("mailsend.inviteByEmail Request succeeded with JSON response", data)
      return data
    })
    .catch(error => {
      console.log("mailsend.inviteByEmail Request failed", error);
      return error
    });
}
export default mailsend;