import React, { getGlobal } from "reactn";
// import { Icon } from 'antd';
import { Spinner } from "@blueprintjs/core";

import TransitionLayout from '../Layouts/Transition.js';

const Loading = () => (
<TransitionLayout>
<section 
style={{opacity: '0.7'}}
id="Loading" className={(" trans-a fixed top-0 w-100 vh-100 bg-near-white z-99")}>
    <div className="flex flex-column flex-auto vh-100 w-100 items-center justify-start pt6">
      <div className="flex flex-column pa5- h-100 justify-center">
        <Spinner size={80} className="red"/>
      </div>
    </div>
  </section>
  </TransitionLayout>
)

export default Loading
{/* <Icon type="loading" className="f2 black-20" /> */ }