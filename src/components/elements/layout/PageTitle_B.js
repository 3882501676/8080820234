import React, { getGlobal } from "reactn";
import { Icon } from "antd";
import './style.css'
// const docList = docs => (
//   <div className="flex flex-column">
//     {docs.map((item, index) => (
//       <div className="flex flex-row bb b--black-05">
//         <div
//           style={{ backgroundImage: "url(" + item.avatar + ")" }}
//           className="project-image pa2 br2"
//         />
//         <div className="flex">
//           <span className="f5 fw5 black-70">{item.title}</span>
//         </div>
//       </div>
//     ))}
//   </div>
// );

export default ({
  updateActiveDoc,
  activeDoc,
  title,
  theme,
  docs,
  showInsertForm,
  trigger,
  ready,
  showButton
}) => (
  <section className="flex flex-row w-100">
    <section id="PageTitle" className="flex flex-column w-100 relative">
      <h1
        className={          
          "ma0 raleway -raleway f3 fw6  mb-0 flex flex-row items-center justify-start black"
        }
      >
        <span>{title}</span>
        {
          typeof docs !== "undefined" && docs !== false && 
          <div
          style={{
            color: "white",
            fontWeight: "bold",
            marginLeft: "1rem",
            background: '#c4c4c7'
          }}
          className={"  count-badge- f6 pv1 ph2 br1 -bg-white "}
        >
          <span className={"bg-white-"}>
            { ready && docs && docs.length || 0}
          </span>
        </div>
        }
        
      </h1>
      {
        showButton ? 
        <h5
        onClick={showInsertForm}
        className={theme && theme.colorScheme.color + " raleway -varela f6 fw6 mb4"} >
          <Icon type="plus" /> Add New
        </h5>
        : null
      }
      
    </section>
    
  </section>
);
