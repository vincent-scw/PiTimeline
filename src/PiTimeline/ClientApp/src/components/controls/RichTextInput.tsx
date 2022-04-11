import React, { useRef, useMemo } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Popup from "reactjs-popup";
import { GalleryCtl } from "./GalleryCtl";
import * as Svc from '../../services';

export interface RichTextInputProps {
  value?: string;
  valueChanged?: (content: string) => void;
}

export const RichTextInput: React.FC<RichTextInputProps> = (props) => {
  const { value, valueChanged } = props;
  const quill = useRef(null);

  const modules = useMemo(() => ({
    toolbar: {
      container: "#toolbar",
      handlers: {
        image: () => { },
        video: () => { }
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const photoSelected = (item: Svc.ItemInfo) => {
    const content = item.thumbnail;

    if (content) {
      const editor = quill.current.getEditor();
      const cursorPosition = editor.getSelection().index;
      editor.insertEmbed(cursorPosition, 'image', content);
      editor.setSelection(cursorPosition + content.length);
    }
  }

  const videoSelected = (item: Svc.ItemInfo) => {
    const content = item.thumbnail;

    if (content) {
      const editor = quill.current.getEditor();
      const cursorPosition = editor.getSelection().index;
      editor.insertEmbed(cursorPosition, content);
      editor.setSelection(cursorPosition + content.length);
    }
  }
  
  const handleValueChanged = newValue =>
    setTimeout(() => valueChanged(newValue))

  const buildCustomToolbar = () => (
    <div id="toolbar">
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <Popup trigger={<button className="ql-image"></button>} nested position="bottom center">
        {close => <GalleryCtl itemSelected={(item) => { photoSelected(item); close(); }} />}
      </Popup>
      <Popup trigger={<button className="ql-video"></button>} nested position="bottom center">
        {close => <GalleryCtl itemSelected={(item) => { videoSelected(item); close(); }} />}
      </Popup>
    </div>
  )

  return (
    <div className="field">
      {buildCustomToolbar()}
      <ReactQuill theme="snow" placeholder="Record your moment here..." defaultValue={value} onChange={handleValueChanged}
        modules={modules} ref={quill} />
    </div>
  )
}
