import React, { useState } from "react";
import { RichTextInput, TDatePicker } from "../controls";
import { toast } from "react-toastify";
import * as Svc from '../../services';
import Popup from "reactjs-popup";
import { TGallery } from "../gallery/TGallery";

export interface MomentEditorProps {
  moment?: Svc.Moment;
  saved?: Function;
}

export const MomentEditor: React.FC<MomentEditorProps> = (props) => {
  const [moment, setMoment] = useState<Svc.Moment>(props.moment || {});
  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  const stateChanged = (prop: string, v: any) => {
    let newEntity = { ...moment, [prop]: v };
    setMoment(newEntity);
  }

  const saveMoment = () => {
    if (moment.id) {
      Svc.MomentSvc.updateMoment(moment)
        .then(t => {
          toast.info(`${t.data.name} has been updated.`)
          if (props.saved) props.saved(t.data);
        });
    } else {
      Svc.MomentSvc.createMoment(moment)
        .then(t => {
          toast.info(`${t.data.name} has been created.`)
          if (props.saved) props.saved(t.data);
        });
    }
  }

  const insertImage = (): string => {
    setPopupOpen(true)
    return '';
  }

  const insertVideo = (): string => {
    setPopupOpen(true)
    return '';
  }

  return (
    <React.Fragment>
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
        <RichTextInput value={moment.content} valueChanged={(c) => stateChanged('content', c)} 
          insertImageClicked={() => insertImage()}
          insertVideoClicked={() => insertVideo()} />
        <div className="field">
          <div className="control">
            <a className="button is-primary is-small is-fullwidth"
              onClick={saveMoment}>
              Save
            </a>
          </div>
        </div>
      </form>
      <Popup open={popupOpen} closeOnDocumentClick onClose={() => setPopupOpen(false)}>
        <TGallery />
      </Popup>
    </React.Fragment>
  );
}