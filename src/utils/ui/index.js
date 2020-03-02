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
  let { tracks, tracks_, track, type } = data;
  let index = parseInt(tracks_.findIndex(item => item._id == track._id));

  let index_ = index;
  let newIndex = type === "up" ? --index_ : ++index_;
  let trackToMoveDown = tracks[index];
  let trackToMoveUp = tracks[newIndex];
  tracks_[newIndex] = trackToMoveDown;
  tracks_[index] = trackToMoveUp;
  let _index = parseInt(tracks.findIndex(item => item._id == track._id));

  let _index_ = _index;
  let _newIndex = type === "up" ? --_index_ : ++_index_;
  let _trackToMoveDown = tracks[index];
  let _trackToMoveUp = tracks[newIndex];
  tracks[newIndex] = _trackToMoveDown;
  tracks[index] = _trackToMoveUp;

  return { tracks, tracks_ }
}
// ui = { reorder }
export default ui
