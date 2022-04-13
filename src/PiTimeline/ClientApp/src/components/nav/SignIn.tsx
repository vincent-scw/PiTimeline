import React, {useState} from "react";
import { TextInput } from "../controls";
import * as Svc from '../../services';

export interface SignInProps {
  done?: Function;
}

export const SignIn: React.FC<SignInProps> = (props) => {
  const [credentials, setCredentials] = useState<Svc.Credentials>({username: ''});

  const login = () => {

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
        <TextInput valueChanged={(v) => stateChanged('username', v)} placeholder="Username"/>
        <TextInput valueChanged={(v) => stateChanged('password', v)} type={'password'} placeholder="Password"/>
        <div className="field">
          <div className="control">
            <a className="button is-primary is-fullwidth"
              onClick={login}>
              Sign In
            </a>
          </div>
        </div>
      </form>
    </React.Fragment>
  )
}