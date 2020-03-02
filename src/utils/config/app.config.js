module.exports = {
	// siteRoot: 'http://crew20.devcolab.site',
	siteRoot: "https://crew.quantacom.co/",
	siteMeta: {
		title: "Crew20 : Film Crew Management Made Easier",
		author: "Christopher Hurrell ",
		image: "/image.png",
		description: "Crew management, made easier",
		siteUrl: "http://crew.quantacom.co",
		social: {
			twitter: "crew20"
		},
		postsPerPage: 5
	},
	api: {
		dev: "http://localhost:3030/v1/",
		// prod: "https://api.imaginiq.com:3030",
		prod: "https://dev.iim.technology/v1/"
	},
	email: {
		systemEmail: "quantacomsoftware@gmail.com",
		fromName: "[ Crew 20 ]"
	},
	maps: {
		apiKey: "AIzaSyA_IMH_3G-OhGEZvzzbNrGU1e8p4yfJf4s"
	},
	mailjet: {
		api_key: "5aa08edbff41a28262efbd53bd10c535",
		api_secret: "6e1c9c1eb1511c874adaf0614bdec260"
	},
	mailgun: {
		api_key: "13be5264a82a538df626bb3461961a50-898ca80e-e8f3fe11"
	}
};
