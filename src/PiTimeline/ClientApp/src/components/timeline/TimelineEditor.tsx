import React, { useState } from "react";
import { TextInput } from "../controls";
import { toast } from "react-toastify";
import * as Svc from '../../services';

export interface TimelineEditorProps {
  timeline?: Svc.Timeline;
  saved?: Function;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = (props) => {
  const { saved } = props;

  const [timeline, setTimeline] = useState<Svc.Timeline>(props.timeline || {});

  const stateChanged = (prop: string, v: any) => {
    let newEntity = { ...timeline, [prop]: v };
    setTimeline(newEntity);
  }

  const saveTimeline = () => {
    if (timeline.id) {
      Svc.TimelineSvc.updateTimeline(timeline)
        .then(t => {
          toast.info(`${t.data.name} has been updated.`)
          if (saved) saved(t.data);
        });
    } else {
      Svc.TimelineSvc.createTimeline(timeline)
        .then(t => {
          toast.info(`${t.data.name} has been created.`)
          if (saved) saved(t.data);
        });
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