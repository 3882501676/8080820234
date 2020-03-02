{
	Fn.get("isAuthenticated") &&
		typeof this.context.account !== "undefined" &&
		typeof this.context.account.user.id !== "undefined" &&
		this.state.projectOwner.id === this.context.account.user.id && (
			<div className="flex flex-row mt5 pb5   bb b--black-05">
				<div className="flex flex-auto flex-column pb0 ">
					{/* <div className="flex flex-row items-center w-100 pv3">
                                          <span className="f5 fw3 black">
                                            Crew Applications
                                          </span>
                                          <span className="round f7 fw6 black-70 ph2 pv1 bg-white ml2">
                                            {this.state.applications.length}
                                          </span>
                                        </div> */}

					<div className="flex flex-row flex-wrap items-center justify-start f4 fw4 black-60 mb0">
						{this.state.applications.length > 0 &&
							this.state.applications.map({
								/* (item, index) => (
                                                console.log("applicant", item),
                                                (
                                                  <Popover
                                                    content={
                                                      <div className="flex flex-column">
                                                        <div
                                                          onClick={() => {
                                                            this.context.history.push(
                                                              "/user/" +
                                                                item.applicant
                                                                  .id
                                                            );
                                                          }}
                                                          className="pointer flex f6 fw5 black-60 ph3 pv2 hover-black bb b--black-05"
                                                        >
                                                          View Profile
                                                        </div>

                                                        <div
                                                          onClick={() =>
                                                            this.addToNetwork(
                                                              item.applicant
                                                            )
                                                          }
                                                          className="pointer flex f6 fw5 black-60 ph3 pv2 hover-black bb b--black-05"
                                                        >
                                                          Add to network
                                                        </div>

                                                        <div
                                                          onClick={() =>
                                                            this.sendMessage(
                                                              item.applicant
                                                            )
                                                          }
                                                          className="pointer flex f6 fw5 black-60 ph3 pv2 hover-black bb b--black-05"
                                                        >
                                                          Send Message
                                                        </div>

                                                        <div
                                                          onClick={() =>
                                                            Fn.approveCrewApplication(
                                                              {
                                                                self: this,
                                                                project: this
                                                                  .state
                                                                  .project,
                                                                application: item
                                                              }
                                                            )
                                                          }
                                                          className="pointer flex f6 fw5 black-60 ph3 pv2 hover-black"
                                                        >
                                                          Approve Application
                                                        </div>
                                                      </div>
                                                    }
                                                    trigger="hover"
                                                  >
                                                    <Link
                                                      to={
                                                        "/user/" +
                                                        item.applicant.id
                                                      }
                                                      className={
                                                        " pointer flex flex-column fl-ex-auto pv2 pr3 items-center justify-center"
                                                      }
                                                    >
                                                      <div
                                                        style={{
                                                          width: "80px",
                                                          height: "80px",
                                                          borderRadius: "100px",
                                                          backgroundImage: item
                                                            .applicant.profile
                                                            .picture.length
                                                            ? "url(" +
                                                              item.applicant
                                                                .profile
                                                                .picture +
                                                              ")"
                                                            : GeoPattern.generate(
                                                                item.applicant
                                                                  .profile.name
                                                                  .first +
                                                                  item.applicant
                                                                    .profile
                                                                    .name.last
                                                              ).toDataUrl()
                                                        }}
                                                        className="cover bg-center"
                                                      />
                                                      <div
                                                        className={
                                                          " flex flex-row pt2 "
                                                        }
                                                      >
                                                        <div
                                                          className={
                                                            " flex f6 fw6 black-70 "
                                                          }
                                                        >
                                                          {
                                                            item.applicant
                                                              .profile.name
                                                              .first
                                                          }
                                                        </div>
                                                        <div
                                                          className={
                                                            " flex f6 fw6 ml1 black-70"
                                                          }
                                                        >
                                                          {
                                                            item.applicant
                                                              .profile.name.last
                                                          }
                                                        </div>
                                                      </div>

                                                      <div
                                                        className={
                                                          " flex flex-row pt2 "
                                                        }
                                                      >
                    
                                                        <div
                                                          className={
                                                            " round bg-black-30 ba ph3 pv1 b--black-05 flex f6 fw5 ml1 black-70- white"
                                                          }
                                                        >
                                                          {item.position}
                                                        </div>
                                                      </div>
                                                    </Link>
                                                  </Popover>
                                                )
                                              ) */
							})}
					</div>
				</div>
			</div>
		);
}
