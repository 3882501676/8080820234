import React, { setGlobal, useGlobal, getGlobal } from "reactn";
// import config from "../../app.config";
// import initial, { api } from "../initial";
// import themeColors from "../utils/themes";
// const key = "";
let ui = {};

ui.start = () => {}

ui.call = data => {

}
ui.loader = () => {
  return (
    <div className="lds-ripple">
      <div />
      <div />
    </div>
  )
}
ui.reorder = (data) => {
  let { config, tracks, tracks_, track } = data;
  // let tracks_ = data.tracks_;
  let index = parseInt(tracks_.findIndex(track => track._id == track._id));

  let index_ = index;
  let newIndex = ++index_;
  let trackToMoveDown = tracks[index];
  let trackToMoveUp = tracks[newIndex];
  let updatedTracks = [...tracks];

  updatedTracks[newIndex] = trackToMoveDown;
  updatedTracks[index] = trackToMoveUp;

  // let tracks = this.state.tracks_;
  let _index = parseInt(tracks.findIndex(track => track._id == track._id));

  let _index_ = _index;
  let _newIndex = ++_index_;
  let _trackToMoveDown = tracks[index];
  let _trackToMoveUp = tracks[newIndex];
  let _updatedTracks = [...tracks];

  _updatedTracks[newIndex] = _trackToMoveDown;
  _updatedTracks[index] = _trackToMoveUp;

  return { updatedTracks, _updatedTracks }
}

export default ui
