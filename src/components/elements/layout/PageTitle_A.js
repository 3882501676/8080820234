import React from 'react';

export default ({ title, theme }) => <section id="PageTitle" className={ theme + " flex flex-column w-100 relative ph4 " }>
  <h1 className={ (theme.main === "dark" ? "white-40" : "black-50")+(" raleway -varela f3 fw4 black-20 mb0 pv4")}>
   {title}
  </h1>
</section>;
