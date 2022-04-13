import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Popup from "reactjs-popup";
import { GalleryCtl, TextInput } from "../controls";
import * as Svc from '../../services';
import { createTimeline, updateTimeline } from "../../services";

export interface TimelineEditorProps {
  timeline?: Svc.Timeline;
  done?: Function;
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

    if (props.done)
      props.done();
  }

  return (
    <React.Fragment>
      <button className="delete" onClick={() => props.done()}></button>
      <section className="popup-title">
        <p className="subtitle">
          Timeline Editor
        </p>
      </section>

      <form>
        <TextInput
          valueChanged={(v) => stateChanged('title', v)}
          value={timeline.title}
          placeholder="Input timeline title here" />

        <Popup trigger={
          <a className="button is-primary is-light">Choose Cover Pattern</a>} nested position="right center">
          {close => <GalleryCtl itemSelected={(item) => {
            stateChanged('coverPatternUrl', item.thumbnail); close();
          }} />}
        </Popup>

        <div>
          <img src={timeline.coverPatternUrl} className="timeline-editor-pic" />
        </div>

        <div className="field">
          <div className="control">
            <a className="button is-primary is-fullwidth"
              onClick={saveTimeline}>
              Save
            </a>
          </div>
        </div>
      </form>
    </React.Fragment>
  )
}