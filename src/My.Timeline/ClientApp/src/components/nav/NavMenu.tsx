import React from "react";

export default class NavMenu extends React.PureComponent<{}> {
  public render(): React.ReactNode {
      return (
        <nav className="navbar is-fixed-top is-transparent is-primary top-nav" role="navigation" aria-label="main navigation">
          <div className="container">
            <div className="navbar-brand">
              <a className="navbar-item" >
                <img src="../assets/favicon.png"></img>
              </a>
              <a className="navbar-item">
                <img src="../assets/logo.png"></img>
              </a>
            </div>
          </div>
        </nav>
      );
  }
}