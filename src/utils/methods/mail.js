// import React, { setGlobal, useGlobal, getGlobal } from "reactn";
import mailsend from './mailSend.js';
let mail = {}
// mail.init = () => {
//     let a = "test"
// }
mail.ReservationRequestUser = async (data) => {
    return await mailsend.ReservationRequestUser(data)
}
mail.SendNotification = async (data) => {
    console.log('mail.SendNotification', data)
    // const subject_ = data.subject + " [ Crew20 ]",
    // data_ = { subject_, ...data }
    return await mailsend.SendNotification(data)
}
mail.ChefReservationRequestNotification = async (data) => {
    console.log('mail.ChefReservationRequestNotification', data)
    const confirmationEmailSubject = "Reservation request received [ HomeChef ]",
        data_ = { confirmationEmailSubject, ...data }
    return await mailsend.ChefReservationRequestNotification(data_)
}
mail.reservationCancellationNotification = async (data) => { }
mail.reservationConfirmationNotification = async (data) => { }
mail.reservationRequestConfirmation = async (data) => { }
mail.reservationDeniedConfirmation = async (data) => { }

mail.userRegistration = async (data) => { }
mail.userWelcomeEmail = async (data) => { }

mail.passwordReset = async (data) => { }
mail.passwordResetConfirmation = async (data) => { }

mail.newMessage = async (data) => { }
// mail.EmailNotification = async (data) => { 

// }
export default mail;