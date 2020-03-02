const dataModel = {
    data: {
        info: 'contains associated project, conversation or event data',
        sender: {
            profile: {}
        },
        applicant: {
            profile: {}
        },
        event: {},
        project: {},
        message: {},
        position: {},
    }
}

export const notificationTypes = {
    crewInvite: (__) => {
        return {
            title: "Invite",
            content: "You have been invited to crew for a project",
            data: __.data,
            icon: "",
            createdAt: new Date(),
            read: false,
            owner: __.owner
        }
    },
    crewInviteAccept: (__) => {
        return {
            title: "Invite Accepted",
            content: __.data.sender.name.first + " " + __.data.sender.name.last + " has accepted your invitation to " + __.data.project.title,
            data: __.data,
            icon: "",
            createdAt: new Date(),
            read: false,
            owner: __.owner
        }
    },
    crewInviteReject: (__) => {
        return {
            title: "Invite Rejected",
            content: __.data.sender.name.first + " " + __.data.sender.name.last + " has rejected your invitation to " + __.data.project.title,
            data: __.data,
            icon: "",
            createdAt: new Date(),
            read: false,
            owner: __.owner
        }
    },
    message: (__) => {
        return {
            title: "New Message",
            content: __.content.substring(0, 50),
            data: __.data,
            icon: "",
            createdAt: new Date(),
            read: false,
            owner: __.owner
            
        }
    },  
    applicationReject: (__) => {
        return {
            title: "Rejected",
            content: "Your application for crew has been rejected",
            data: __.data,
            icon: "",
            createdAt: new Date(),
            read: false,
            owner: __.owner
        }
    },
    applicationApprove: (__) => {
        return {
            title: "Approved",
            content: "Your application for crew has been approved",
            data: __.data,
            icon: "",
            createdAt: new Date(),
            read: false,
            owner: __.owner
        }
    },
    crewApplication: (__) => {
        return {
            title: "Crew Application",
            content: __.data.applicant.name.first + " " + __.data.applicant.name.last + " has applied as crew for " + __.data.project.title,
            data: __.data,
            icon: "",
            createdAt: new Date(),
            read: false,
            owner: __.owner
        }
    },
    connectRequest: (__) => {
        return {
            title: "Connection Request",
            content: __.data.sender.name.first + " " + __.data.sender.name.last + " wants to connect",
            data: __.data,
            icon: "",
            createdAt: new Date(),
            read: false,
            owner: __.owner
        }
    },
    connectDeny: (__) => {
        return {
            title: "Connection Ignored",
            data: __.data,
            content: __.content,
            icon: "",
            createdAt: new Date(),
            read: false,
            owner: __.owner
        }
    },
    addToChatGroup: (__) => {
        return {
            title: "Chat Group Invite",
            content: __.data.sender.name.first + " " + __.data.sender.name.last + " has added you to a chat group",
            data: __.data,
            icon: "",
            createdAt: new Date(),
            read: false,
            owner: __.owner
        }
    },
    eventInvite: (__) => {
        return {
            title: "Event Invite",
            content: __.data.sender.name.first + " " + __.data.sender.name.last + " has invited you to an event",
            data: __.data,
            icon: "",
            createdAt: new Date(),
            read: false,
            owner: __.owner
        }
    },
    eventInviteAccept: (__) => {
        return {
            title: "Event Invite Accepted",
            content: __.data.sender.name.first + " " + __.data.sender.name.last + " has accepted your invite to event: " + __.data.event.title,
            data: __.data,
            icon: "",
            createdAt: new Date(),
            read: false,
            owner: __.owner
        }
    },
    eventInviteReject: (__) => {
        return {
            title: "Event Invite Rjected",
            content: __.data.sender.name.first + " " + __.data.sender.name.last + " cannot attend your event " + __.data.event.title,
            data: __.data,
            icon: "",
            createdAt: new Date(),
            read: false,
            owner: __.owner
        }
    },

}

window.notificationTypes = notificationTypes;
export default notificationTypes