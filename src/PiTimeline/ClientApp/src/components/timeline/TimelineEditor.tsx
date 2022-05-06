import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Popup from "reactjs-popup";
import { buildImgUrl, PopupGallery, TextInput } from "../controls";
import { Timeline, createTimeline, updateTimeline } from "../../services";

export interface TimelineEditorProps {
  timeline?: Timeline;
  done?: Function;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = (props) => {
  const dispatch = useDispatch();
  const [timeline, setTimeline] = useState<Timeline>(props.timeline || {});

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
          <a className="button is-primary is-light">Choose Cover Pattern</a>} modal nested position="center center">
          {close =>
            <PopupGallery itemSelected={(item) => {
              stateChanged('coverPatternUrl', buildImgUrl(item.path, 320)); close();
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