import React from "react";
import { Link } from "react-router-dom";

export default class NavMenu extends React.PureComponent<{}> {
  public render(): React.ReactNode {
      return (
        <nav className="navbar is-fixed-top is-transparent is-primary top-nav" role="navigation" aria-label="main navigation">
          <div className="container">
            <div className="navbar-brand">
              <Link className="navbar-item" to="/">
                <img src="../assets/favicon.png"></img>
              </Link>
              <Link className="navbar-item" to="/">
                <img src="../assets/logo.png"></img>
              </Link>
            </div>
          </div>
        </nav>
      );
  }
}