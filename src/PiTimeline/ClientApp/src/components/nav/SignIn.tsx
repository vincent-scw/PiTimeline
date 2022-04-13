import React, {useEffect, useState} from "react";
import { TextInput } from "../controls";
import { useDispatch, useSelector } from "react-redux";
import { Credentials, login, selectAuthenticated } from "../../services";

export interface SignInProps {
  done?: Function;
}

export const SignIn: React.FC<SignInProps> = (props) => {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState<Credentials>({username: ''});
  const authenticated = useSelector(selectAuthenticated);

  useEffect(() => {
    if (authenticated && props.done)
    props.done();
  }, [authenticated])

  const doLogin = () => {
    dispatch(login(credentials));
  }

  const stateChanged = (prop: string, v: any) => {
    let newEntity = { ...credentials, [prop]: v };
    setCredentials(newEntity);
  }

  return (
    <React.Fragment>
      <button className="delete" onClick={() => props.done()}></button>
      <section className="popup-title">
        <p className="subtitle">
          Account
        </p>
      </section>
      <form>
        <TextInput value={credentials.username} valueChanged={(v) => stateChanged('username', v)} placeholder="Username"/>
        <TextInput value={credentials.password} valueChanged={(v) => stateChanged('password', v)} type={'password'} placeholder="Password"/>
        <div className="field">
          <div className="control">
            <a className="button is-primary is-fullwidth"
              onClick={doLogin}>
              Sign In
            </a>
          </div>
        </div>
      </form>
    </React.Fragment>
  )
}