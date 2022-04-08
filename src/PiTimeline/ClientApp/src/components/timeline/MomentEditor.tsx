import React, { useState } from "react";
import { RichTextInput, TDatePicker } from "../controls";
import * as Svc from '../../services';
import { useDispatch } from "react-redux";
import { createMoment, updateMoment } from "../../services";

export interface MomentEditorProps {
  moment?: Svc.Moment;
  done?: Function;
}

export const MomentEditor: React.FC<MomentEditorProps> = (props) => {
  const dispatch = useDispatch();
  const [moment, setMoment] = useState<Svc.Moment>(props.moment || { takePlaceAtDateTime: new Date() });

  const stateChanged = (prop: string, v: any) => {
    let newEntity = { ...moment, [prop]: v };
    setMoment(newEntity);
  }

  const saveMoment = () => {
    if (moment.id) {
      dispatch(updateMoment(moment));
    } else {
      dispatch(createMoment(moment));
    }

    if (props.done)
      props.done();
  }

  return (
    <React.Fragment>
      <button className="delete" onClick={() => props.done()}></button>
      <section>
        <p className="subtitle">
          Moment Editor
        </p>
      </section>
      <hr />
      <form>
        <TDatePicker name="Date"
          value={moment.takePlaceAtDateTime}
          valueChanged={(date) => stateChanged('takePlaceAtDateTime', date)}></TDatePicker>
        <RichTextInput value={moment.content} valueChanged={(c) => stateChanged('content', c)} />
        <div className="field">
          <div className="control">
            <a className="button is-primary is-small is-fullwidth"
              onClick={saveMoment}>
              Save
            </a>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
}