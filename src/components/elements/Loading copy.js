import React, { getGlobal } from "reactn";
// import { Icon } from 'antd';
import { Spinner } from "@blueprintjs/core";

const Loading = () => (
  <section id="Loading" className={(" fixed top-0 w-100 vh-100")}>
    <div className="flex flex-column flex-auto vh-100 w-100 items-center justify-center">
      <div className="flex flex-column pa5">
        <Spinner size={100} />
      </div>
    </div>
  </section>
)

export default Loading
{/* <Icon type="loading" className="f2 black-20" /> */ }