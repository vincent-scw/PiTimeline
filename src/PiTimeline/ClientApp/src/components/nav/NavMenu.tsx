import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import Popup from "reactjs-popup";
import { SignIn } from "./SignIn";

export default class NavMenu extends React.PureComponent<{}> {
  public render(): React.ReactNode {
    return (
      <nav className="navbar is-fixed-top is-transparent is-primary top-nav" role="navigation" aria-label="main navigation">
        <div className="container">
          <div className="navbar-brand">
            <Link className="navbar-item" to="/">
              <img src="../assets/favicon.png" alt=""></img>
            </Link>
            <Link className="navbar-item" to="/">
              <img src="../assets/logo.png" alt=""></img>
            </Link>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <Popup position="center center" modal={true} closeOnDocumentClick={false}
                  trigger={
                    <a>
                      <span className="icon has-text-light"><FontAwesomeIcon icon={faSignInAlt} /></span>
                    </a>}>
                  {close => <SignIn done={close} /> }
                </Popup>

              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}