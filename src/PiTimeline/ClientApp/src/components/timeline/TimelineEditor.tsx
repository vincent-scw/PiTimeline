import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { TextInput } from "../controls";
import * as Svc from '../../services';
import { createTimeline, updateTimeline } from "../../services";

export interface TimelineEditorProps {
  timeline?: Svc.Timeline;
  saved?: Function;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = (props) => {
  const dispatch = useDispatch();
  const [timeline, setTimeline] = useState<Svc.Timeline>(props.timeline || {});

  const stateChanged = (prop: string, v: any) => {
    let newEntity = { ...timeline, [prop]: v };
    setTimeline(newEntity);
  }

  const saveTimeline = () => {
    if (timeline.id) {
      dispatch(updateTimeline(timeline));
    } else {
      dispatch(createTimeline(timeline));
    }
  }

  return (
    <React.Fragment>
      <form>
        <TextInput
          valueChanged={(v) => stateChanged('title', v)}
          value={timeline.title}
          placeholder="Input timeline title here" />

        <div className="field">
          <div className="control">
            <a className="button is-primary is-small is-fullwidth"
              onClick={saveTimeline}>
              Save
            </a>
          </div>
        </div>
      </form>
    </React.Fragment>
  )
}