import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Popup from "reactjs-popup";
import { SignIn } from "./SignIn";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthenticated, logout } from "../../services";

const NavMenu: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<Boolean>(false);
  const dispatch = useDispatch();
  const authenticated = useSelector(selectAuthenticated);

  const doSignout = () => {
    dispatch(logout({}));
  }

  return (
    <nav className="navbar is-fixed-top is-transparent is-primary top-nav" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            <img src="../assets/favicon.png" alt=""></img>
          </Link>
          <Link className="navbar-item" to="/">
            <p className="logo-p">Pi Timeline</p>
          </Link>

          <a role="button" onClick={() => setIsExpanded(!isExpanded)}
            className={isExpanded ? `navbar-burger is-active` : `navbar-burger`} aria-label="menu" aria-expanded="false" data-target="navbarContent">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div id="navbarContent" className={isExpanded ? `navbar-menu is-active` : `navbar-menu`}>
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                {authenticated &&
                  <a onClick={doSignout}>
                    <span className="icon has-text-dark"><FontAwesomeIcon icon={faSignOutAlt} /></span>
                  </a>
                }
                {!authenticated &&
                  <Popup position="center center" modal={true} closeOnDocumentClick={false}
                    trigger={
                      <a>
                        <span className="icon has-text-dark"><FontAwesomeIcon icon={faSignInAlt} /></span>
                      </a>}>
                    {close => <SignIn done={close} />}
                  </Popup>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavMenu;