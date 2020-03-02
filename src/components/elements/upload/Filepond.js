import React from "react";
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileRename from 'filepond-plugin-file-rename';

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Fn from "../../../utils/fn/Fn.js";
import AccountContext, {
  AccountConsumer
} from "../../../utils/context/AccountContext.js";

// Register the plugins
registerPlugin(FilePondPluginFileRename, FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const mimetypes = [
  { "image/png": ".png" },
  { "image/jpg": ".jpg" },
  { "image/gif": ".gif" }
];
// Our app
class Filepond extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      files: []
    };

    this.handleInit = this.handleInit.bind(this);
    this.updateFile = this.updateFile.bind(this);
    this.handlePondFile = this.handlePondFile.bind(this);
    this.onProcessFile = this.onProcessFile.bind(this);
    this.renameFile = this.renameFile.bind(this)
    // this.pond = React.createRef();
  }
  renameFile(file) {
    console.log('renaming file',file);
    let filename = Date.now().toString() +"-"+ file.name
    console.log('new filename', filename)
    return filename
  }
  componentDidMount() {
    console.log("Filepond props", this.props);
  }
  onProcessFile(
    fieldName,
    file,
    metadata,
    load,
    error,
    progress,
    abort,
    transfer,
    options
  ) {
    console.log("onProcessFile", file);

  }
  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }
  updateFile(file) {
    console.log('[[ File ]]', file)

  }

  async handlePondFile(error, file) {
    if (error) {
      console.log("Oh no");
      return;
    }
    if (file) {

      console.log('file', file)



      if (this.props.type === "profileImage") {
        Fn.uploadProfileImage({ self: this, file: this.pond.getFile().file });
      }

      if (this.props.type === "cv") {
        Fn.uploadCV({ self: this, file: this.pond.getFile().file });
      }

      if (this.props.type === "WorkPortfolioImage") {
        let image = await Fn.uploadWorkPortfolioImage({
          self: this,
          file: this.pond.getFile().file
        });
        this.props.setImage(image);
      }

      console.log('filepond props', this.props)

      if (this.props.type === "files") {
        
        console.log("[[ File ]]", file);
        console.log("[[ File ]]", this.pond.getFile());

        let files = await Fn.uploadProjectFiles({
          parent: this.props.self,
          self: this,
          project: this.props.project,
          file: this.pond.getFile().file,
          fileType: this.pond.getFile().fileType
        });

        // this.setState({ files: [] });
      }
      if (this.props.type === "projectAvatarUpload") {
        console.log("[[ File ]]", file);

        let files = await Fn.uploadProjectAvatar({
          parent: this.props.self,
          self: this,
          project: this.props.project,
          file: this.pond.getFile().file
        });

        this.setState({ files: [] });
      }

      if (this.props.type === "calendar") {
        console.log("[[ File ]]", file);

        console.log("Event", this.props.project);

        let files = await Fn.uploadEventFiles({
          parent: this.props.self,
          self: this,
          event: this.props.project.event,
          file: this.pond.getFile().file
        });

        this.setState({ files: [] });
      }
    }
  }
  componentDidMount() {

    console.log('this.pond', this.pond)

  }
  render() {
    return (
      <div className="FilePond-Wrapper flex flex-column w-100 ">
        <FilePond
          ref={ref => (this.pond = ref)}
          files={this.state.files}
          allowMultiple={true}
          oninit={() => this.handleInit()}
          fileRenameFunction={file => this.renameFile(file)}
          onprocessfile={this.handlePondFile}
          onupdatefile={this.handlePondFile}
          multiple={true}
          name="images"
          // server="https://upload.crew20.devcolab.site/api/image"
          server="https://upload.dev.iim.technology/api/image"
          // server="http://localhost:3001/api/image"
        />

        {/* <div onClick={() => this.pond.browse()} className="f5 fw5 black pa3 ba b--black-05 pointer mt4 mb4">Browse</div>
        <div onClick={() => this.setState({files: []})} className="f5 fw5 black pa3 ba b--black-05 pointer mt4 mb4">Clear</div> */}
      </div>
    );
  }
}
export default Filepond;
Filepond.contextType = AccountContext;
