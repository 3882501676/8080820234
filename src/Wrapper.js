import React from "react";
// import React, { getGlobal, setGlobal } from "reactn";
import { Redirect } from "react-router-dom";
import TransitionLayout from "./components/Layouts/Transition";
import Header from "./components/elements/layout/Header";
import HeaderMobile from "./components/elements/layout/HeaderMobile.js";
import Footer from "./components/elements/layout/Footer";
import FooterMobile from "./components/elements/layout/FooterMobile";
import WelcomeScreen from "./components/elements/layout/WelcomeScreen.js";
import { useAuth0 } from "./utils/auth/react-auth0-spa";
import { Icon, Spinner, Dialog, NumericInput } from "@blueprintjs/core";
import { CurrencyProvider } from "./utils/context/CurrencyContext";
import AccountContext, {
	AccountProvider
} from "./utils/context/AccountContext";
import { notification, message, PageHeader } from "antd";
import FormLogin from "./components/a/FormLogin/index.js";
import FormRegister from "./components/a/FormRegister/index.js";
import constants from "./utils/constants.js";
import { findCity, getGeolocation, findCurrency, ___ } from "./utils/util/";
// import Fn from "./utils/fn/Fn";
import { app, Fn, ui, api } from "./utils/fn/Fn";
import moment from "moment";

import Refresh from "./components/a/Refresh";

const queryString = require("query-string");

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			dialogType: "login",
			dialogTitle: "Login",
			isVisible: false,
			theme: "",
			maskActive: false,
			mediaType: "audio",
			popoverVisible: false,
			lat: 0,
			long: 0,
			city: "",
			currency: null,
			location: null,
			country: "",
			countrySet: false,
			ready: true,
			activeCurrency: {},
			activeCurrencyIsSet: false,
			exchangeRate: 1,
			isAuthenticated: false,
			account: Fn.get("account"),
			redirectHome: false,
			notifications: [],
			subscribedProjects: [],
			messages: [],
			submitInProgress: false,
			unreadMessages: [],
			allUnread: [],
			page: {
				title: "Dashboard",
				subtitle: "..."
			},
			backOffice: false,
			isProject: false
		};

		// this.switchTheme = this.switchTheme.bind(this);

		this.login = this.login.bind(this);
		this.register = this.register.bind(this);
		this.logout = this.logout.bind(this);
		this.toggleDialog = this.toggleDialog.bind(this);
		this.setDialogToRegister = this.setDialogToRegister.bind(this);
		this.setDialogToLogin = this.setDialogToLogin.bind(this);
		this.submitLoginForm = this.submitLoginForm.bind(this);
		this.submitRegisterForm = this.submitRegisterForm.bind(this);
		this.refreshTokens = this.refreshTokens.bind(this);
		this.getLocationData = this.getLocationData.bind(this);
		// this.getGeolocation = this.getGeolocation.bind(this)
		// this.findCity = this.findCity.bind(this)

		this.updateAccount = this.updateAccount.bind(this);
		this.clearState = this.clearState.bind(this);
		this.fetchUnreadMessages = this.fetchUnreadMessages.bind(this);
		this.setPage = this.setPage.bind(this);
		this.toggleBackoffice = this.toggleBackoffice.bind(this)
		this.toggleIsProject = this.toggleIsProject.bind(this)

		console.log(" ");
		console.log("[[ Wrapper props]]", props);
		console.log(" ");
	}
	
	toggleIsProject(boolean) {
		this.setState({
			isProject: boolean
		})
	}

	toggleBackoffice() {
		this.setState({
			backOffice: !this.state.backOffice
		})
		// alert('back office')
	}
	
	setPage(page) {
		this.setState({
			page: page
		});
	}

	updateAccount_() {
		app.checkAuth(this).then(async result => {
			console.log(result);
			this.setState({
				account: Fn.get("account")
			});
		});
	}
	updateAccount(data) {
		console.log("updateAccount", data);
		let account = Fn.get("account");

		this.setState({
			account: account
		});
	}
	setDialogToRegister() {
		this.setState({
			dialogType: "register",
			dialogTitle: "Register an account"
		});
	}
	setDialogToLogin() {
		this.setState({
			dialogType: "login",
			dialogTitle: "Login"
		});
	}
	toggleDialog(config) {
		const { title, type } = config;
		this.setState({
			isOpen: !this.state.isOpen,
			dialogType: type,
			dialogTitle: title
		});
	}
	async submitRegisterForm(data) {
		console.log("data", data);
		this.setState({
			submitInProgress: true
		});

		// const url = "https://api.crew20.devcolab.site/v1/auth/register";
		// const url = "https://dev.iim.technology/v1/auth/register";
		const url = "https://dev.iim.technology/v1/auth/register";

		const config = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		};

		fetch(url, config)
			.then(res => {
				return res.json();
			})
			.then(async res => {
				console.log("[[ Register Response ]]", res);

				if (res.code === 400 || res.code === 401) {
					notification.open({
						message: "Error",
						description: res.message
					});
				} else {
					Fn.store({ label: "authTokens", value: res.tokens });
					Fn.store({ label: "account", value: res });
					Fn.store({ label: "isAuthenticated", value: true });

					this.setState({ isAuthenticated: false, account: res });

					await Fn.userAfterRegistration({ self: this, data: res });

					this.toggleDialog({ type: null, title: null });

					// this.props.history.push('/profile')
					this.props.history.push("/confirmaccount");
					// message.success('Logged In');
				}
			});
	}
	async refreshTokens() {
		// const url = "https://api.crew20.devcolab.site/v1/auth/refresh-tokens/";
		const url = "https://dev.iim.technology/v1/auth/refresh-tokens/";

		const data = {
			refreshToken: Fn.get("account").tokens.refresh.token
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
					let account = Fn.get("account");
					account.tokens = res;
					Fn.store({ label: "authTokens", value: res });
					Fn.store({ label: "account", value: account });
					Fn.store({ label: "isAuthenticated", value: true });
					this.setState({ isAuthenticated: true, account: account });
					this.toggleDialog({ type: null, title: null });
					let start = moment(new Date().getTime());
					let loginTimestamps = {
						start: start,
						check: start.add(10, "minutes")
					};
					Fn.set("loginTimestamps", loginTimestamps);
					// this.props.history.push('/dashboard')
					// message.success('Logged In');
				}
			});
	}
	submitLoginForm = async data => {
		const { email, password, type } = data;

		console.log(" ** data ", data);

		this.setState({
			submitInProgress: true
		});

		const submitData = { email, password };

		// const url = "https://api.crew20.devcolab.site/v1/auth/login";
		// const url = Fn.get("env").env === "production"
		// ? "https://api.crew20.devcolab.site/v1/auth/" + type + "/"
		// : "http://localhost:3030/v1/auth/"+ type + "/"

		const url =
			Fn.get("env").env === "production"
				? "https://dev.iim.technology/v1/auth/" + type + "/"
				: "http://localhost:3030/v1/auth/" + type + "/";

		const config = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(submitData)
		};

		// alert('sending')

		console.log(url);

		await fetch(url, config)
			.then(res => {
				// alert('sent')

				return res.json();
			})
			.then(res => {
				console.log("[[ Login Response ]]", res);

				if (res.code === 400 || res.code === 401) {
					notification.open({
						message: "Error",
						description: res.message
					});
				} else {
					Fn.store({ label: "authTokens", value: res.tokens });
					Fn.store({ label: "account", value: res });
					Fn.store({ label: "isAuthenticated", value: true });

					// this.setState({
					//   account: res,
					//   isAuthenticated: true
					// })

					let start = moment(new Date().getTime());
					let loginTimestamps = {
						start: start,
						check: start.add(10, "minutes")
					};

					Fn.set("loginTimestamps", loginTimestamps);

					this.setState({ isAuthenticated: true, account: res });
					this.toggleDialog({ type: null, title: null });
					this.props.history.push("/dashboard");

					message.success("Logged In");

					if (
						Fn.get("account").tokens &&
						Fn.get("account").tokens.refresh.token
					) {
						app.refreshTokensEvery10Minutes();
					}
				}
			});
	};
	login() {
		this.toggleDialog({ type: "login", title: "Login" });
	}
	register() {
		this.toggleDialog({ type: "register", title: "Register your account" });
	}
	logout() {
		let env = Fn.get("env");
		let isMobile = Fn.get("isMobile");
		this.clearState();
		localStorage.clear();

		Fn.store({ label: "isAuthenticated", value: false });
		Fn.store({ label: "account", value: { tokens: null, user: null } });
		Fn.set("env", env);
		Fn.set("isMobile", isMobile);
		// // this.setState({ isAuthenticated: false })
		this.props.history.push("/");
		// window.href = window.location.origin;
	}
	clearState() {
		this.setState({
			isAuthenticated: false,
			account: null,
			notifications: [],
			subscribedProjects: [],
			messages: []
		});
	}
	async fetchUnreadMessages() {
		const userId =
			(Fn.get("account") &&
				Fn.get("account").user &&
				Fn.get("account").user.id) ||
			null;

		typeof userid !== "undefined" &&
			(await app
				.fetchUnreadMessages({ userId: userId, self: this })
				.then(response => {
					let unread = [];

					for (let item of response) {
						for (let message of [...item.messages]) {
							// console.log(' all unread message ', message)
							unread.push(message);
						}
					}

					this.setState({
						unreadMessages: response,
						allUnread: unread
						// ready: true
					});
				}));
	}

	async getLocationData() {
		let coords = await app.getGeoLocation();
		let location = await app.reverseGeocodeCity({
			lat: coords.lat,
			long: coords.long
		});
		let currency = await app
			.findCurrency({ country: location.AdditionalData[0].value })
			.then(currency_ => {
				this.setState({
					location: location,
					currency: currency_,
					activeCurrencyIsSet: true
				});
			});
	}
	componentDidUpdate() {}
	componentDidMount() {
		let self = this;

		this.getLocationData();

		ui.checkmobile();

		app.checkAuth(this).then(async isAuthenticated => {
			console.log(isAuthenticated);

			isAuthenticated && this.fetchUnreadMessages();

			let account = (isAuthenticated && Fn.get("account")) || null;

			isAuthenticated &&
				this.setState({
					account: account,
					isAuthenticated: true
				});

			!isAuthenticated &&
				this.setState({
					account: null,
					isAuthenticated: false
				});

			if (isAuthenticated && account && account.hasOwnProperty("user")) {
				let userId = account && account.user && account.user.id;

				app.fetchNotifications({ self: this, userId: userId });

				app.fetchSubscribedProjects({ self: this, userId: userId });
			} else {
				this.setState({ ready: true });
			}
			// app.checkAuth2(this)
			// console.log('query string', window.location.search);
			const parsed = queryString.parse(window.location.search);
			// console.log('parsed', parsed);

			// console.log('parsed type', typeof parsed)

			if (typeof parsed.newinvite !== "undefined") {
				// Fn.set('newinvite', JSON.parse(parsed.newinvite))
				localStorage.setItem("newinvite", JSON.parse(parsed.newinvite));
			}
			if (typeof parsed.referrer !== "undefined") {
				// Fn.set('referrer', parsed.referrer)
				localStorage.setItem("referrer", parsed.referrer);
			}

			// app.setEnv()

			// ___.checkMobile(self)
			// ___.setThemes(self)
			// ___.setEnv(self)
			// ___.getGeolocation(self)
			// ___.getCityData(self)
			// ___.getCurrency(self)
			// ___.checkAndParseInviteFromUrl(self)
			// ___.getNotifications(self)
			// ___.processOnboardingProject(self)
		});
	}
	render() {
		const {
			ready,
			account,
			isAuthenticated,
			theme,
			maskActive,
			dialogTitle,
			dialogType,
			currency,
			activeCurrencyIsSet,
			allUnread,
			backOffice,
			isProject
		} = this.state;
		const { children, history } = this.props;

		return (
			<TransitionLayout>
				<div>
					{ready && activeCurrencyIsSet ? (
						<section
							id="Wrapper"
							className={
								this.state.theme.main +
								" rubik trans-a w-100 -h-100 -overflow-hidden -scrollbar -scrollbar-dark"
							}
						>
							<AccountProvider
								value={{
									history: history,
									account: account,
									isAuthenticated: isAuthenticated,
									updateAccount: this.updateAccount,
									login: this.login,
									refreshTokens: this.refreshTokens,
									register: this.register,
									logout: this.logout,
									notifications: this.state.notifications,
									subscribedProjects: this.state.subscribedProjects,
									messages: this.state.messages,
									currency: this.state.currency,
									location: this.state.location,
									allUnread: allUnread,
									setPage: this.setPage,
									backOffice: backOffice,
									toggleBackoffice: this.toggleBackoffice,
									isProject: isProject,
									toggleIsProject: this.toggleIsProject

								}}
							>
								<main
									id="App"
									className={
										(ui.mobile() ? " h-100 overflow-hidden " : "  ") +
										" sans-serif relative db "
									}
								>
									<section
										style={
											this.state.isAuthenticated
												? { top: "22vh" }
												: { top: "0vh" }
										}
										id="Main"
										className={
											(ui.mobile() ? " h-100 overflow-auto " : "  ") +
											" content relative flex flex-column -pa4 -pt6 -mw7 center w-100 -h-100"
										}
									>
										<div
											className={
												(this.props.history.location.pathname !== "/" &&
												!this.state.isAuthenticated
													? " blur "
													: "") + " flex relative flex-column w-100 "
											}
										>
											{children}
										</div>
									</section>

									{this.props.history.location.pathname !== "/" &&
										!this.state.isAuthenticated && <LoggedOut />}

									{ui.mobile() ? (
										<HeaderMobile history={history} />
									) : (
										<Header history={history} />
									)}

									{this.state.isAuthenticated && (
										<PageHeader
											style={
												this.state.page ? { top: "12vh" } : { top: "22vh" }
											}
											onBack={() => {
												console.log("*** ", this.props);
												this.props.history.goBack();
											}}
											title={this.state.page.title}
											subTitle={this.state.page.subtitle}
											className="vh10 pv0 ant-page-header fixed flex top-0 left-0 w-100 bn bs-b items-center"
										>
											{/* <div className="flex flex-row pa0">
  {
    this.state.page && this.state.page.buttons && this.state.page.buttons.length && this.state.page.buttons.map(( button, index) => (
      <button className="flex flex-column f5 fw7 black-50 ph4 h-100 items-center justify-center">{button.label}</button>
    ))
  }
  </div> */}
											<Refresh
												ready={this.state.ready}
												dashboard={this.props.dashboard}
												refresh={this.refresh}
											/>
										</PageHeader>
									)}

									{ui.mobile() ? (
										<FooterMobile
											theme={theme}
											switchTheme={this.switchTheme}
											history={history}
										/>
									) : (
										<Footer
											theme={theme}
											switchTheme={this.switchTheme}
											history={history}
										/>
									)}

									{maskActive ? (
										<div className="trans-a z-1000 mask bg-black-80 fixed top-0 ldft-0 vh-100 w-100 " />
									) : null}
								</main>

								<Dialog
									className={"bp3-light"}
									// icon="info-sign"
									onClose={this.toggleDialog}
									title={dialogTitle}
									onValueChange={this.onValueChange}
									{...this.state}
								>
									<div className="flex flex-column ">
										{this.state.dialogType === "register" && (
											// <FormRegister
											//   setDialogToRegister={this.setDialogToRegister}
											//   setDialogToLogin={this.setDialogToLogin}
											//   dialogType={dialogType}
											//   submitRegisterForm={this.submitRegisterForm}
											//   submitInProgress={this.state.submitInProgress}
											// />
											<FormLogin
												setDialogToRegister={this.setDialogToRegister}
												setDialogToLogin={this.setDialogToLogin}
												dialogType={dialogType}
												submitLoginForm={this.submitLoginForm}
												submitInProgress={this.state.submitInProgress}
												type={"register"}
											/>
										)}
										{this.state.dialogType === "login" && (
											<FormLogin
												setDialogToRegister={this.setDialogToRegister}
												setDialogToLogin={this.setDialogToLogin}
												dialogType={dialogType}
												submitLoginForm={this.submitLoginForm}
												submitInProgress={this.state.submitInProgress}
												type={"login"}
											/>
										)}
										{this.state.dialogType === "forgotpassword" && (
											<FormLogin
												setDialogToRegister={this.setDialogToRegister}
												setDialogToLogin={this.setDialogToLogin}
												dialogType={dialogType}
												submitInProgress={this.state.submitInProgress}
												type={"forgotpassword"}
											/>
										)}
									</div>

									{/* {
                    this.state.dialogType === "login" &&
                    <div
                      onClick={this.setDialogToRegister}
                      className="pointer flex flex-column ph4 pt4 pb3 black-60 f5 fw6">
                      Register your account
                    </div>
                  }

                  {
                    this.state.dialogType === "register" &&
                    <div
                      onClick={this.setDialogToLogin}
                      className="pointer flex flex-column ph4 pt4 pb3 black-60 f5 fw6">
                      Login
                    </div>
                  } */}
								</Dialog>
							</AccountProvider>
						</section>
					) : null}
				</div>
			</TransitionLayout>
		);
	}
}

export default App;

const LoggedOut = () => (
	<>
		<div className="hover-slide-up trans-a flex flex-column items-center justify-center fixed top-0 left-0 h-100 w-100 bg-black-50 z-9">
			<span className="f4 fw5 white-60">
				You have been logged out. Please log in again.
			</span>
		</div>
	</>
);
