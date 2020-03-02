import React from "react";
import { Fn, api } from "../../../utils/fn/Fn.js";

export default class Peson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      person: null,
      ready: false
    };
  }
  async componentDidMount() {
    let userId =
      typeof this.props.item === "object"
        ? this.props.item.id
        : this.props.item;
    // let userId = this.props.item;
    let url = api.url("users") + userId;
    let config = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + Fn.get("account").tokens.access.token,
        "Content-Type": "application/json"
      }
      // body: JSON.stringify()
    };
    // console.log("url", url);
    await fetch(url, config)
      .then(res => {
        return res.json();
      })
      .then(async res => {
        // console.log('person',res)
        this.setState({
          person: res,
          ready: true
        });
      });
  }
  render() {
    const { person } = this.state;
    return (
      <div
        // onClick={
        //   this.state.dialogType === "single" &&
        //   this.newConversation(item)
        // }
        className="flex flex-row justify-between pr3 pb3"
      >
        <div
          // to={"/user/" + item.id}
          className={
            "    pointer flex flex-row-ns flex-row items-center justify-start  w-100-s bn-ns bb b--black-05"
          }
        >
          {this.state.ready && (
            <>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "100px",
                  backgroundImage: "url(" + person.profile.picture + ")"
                }}
                className="cover bg-center"
              />
              <div
                className={
                  "    flex flex-row -flex-column pt2-ns- pl3 f5 fw6 black  "
                }
              >
                <div className={" flex  "}>{person.profile.name.first}</div>
                <div className={" flex ml1"}>{person.profile.name.last}</div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}
