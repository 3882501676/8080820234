import appconfig from '../config/app.config.js';

let alertMessages = {};

alertMessages.info = (data) => {
    let text = "ECG stream indicating abnormal cardiac readings."
    return text;
}
alertMessages.warning = (data) => {
    let text = "Warning, you could be in danger of cardiac arrest."
    return text;
}
alertMessages.danger = (data) => {
    let text = "You are in danger, get to the hospital immediately."
    return text;
}
alertMessages.alert = (data) => {
    // console.log('alertMessages.alert',data)
    // let message;
    if( data.status === 'info' ) { return alertMessages.info() }
    if( data.status === 'warning' ) { return alertMessages.warning() }
    if( data.status === 'danger' ) { return alertMessages.danger() }
}


export default alertMessages;

// let alertThresholds = [
//     {
//         type: 'excited',
//         status: 'info',
//         severity: 0,
//         min: 8,
//         max: 12
//     },
//     {
//         type: 'disturbance',
//         status: 'warning',
//         severity: 1,
//         min: 12,
//         max: 16
//     },
//     {
//         type: 'rush',
//         status: 'warning',
//         severity: 2,
//         min: 16,
//         max: 24
//     },
//     {
//         type: 'cardiac arrest',
//         status: 'danger',
//         severity: 3,
//         min: 24,
//         max: 30
//     },
//     {
//         type: 'danger',
//         status: 'danger',
//         severity: 4,
//         min: 30,
//         max: 40
//     }
// ]