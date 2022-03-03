import React, { useRef } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Popup from "reactjs-popup";
import { GalleryCtl } from "./GalleryCtl";

export interface RichTextInputProps {
  value?: string;
  valueChanged?: (content: string) => void;
}

export const RichTextInput: React.FC<RichTextInputProps> = (props) => {
  const { value, valueChanged } = props;
  const quill = useRef(null);

  const modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {
        image: () => insert('photo'),
        video: () => insert('video')
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }

  const insert = (filter: string) => {
    const content = 'a';

    if (content) {
      const editor = quill.current.getEditor();
      const cursorPosition = editor.getSelection().index;
      editor.insertText(cursorPosition, content);
      editor.setSelection(cursorPosition + content.length);
    }
  }

  const handleValueChanged = newValue =>
    setTimeout(() => valueChanged(newValue))

  const buildCustomToolbar = () => (
    <div id="toolbar">
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <select className="ql-color">
        <option value="red"></option>
        <option value="green"></option>
        <option value="blue"></option>
        <option value="orange"></option>
        <option value="violet"></option>
        <option value="#d0d1d2"></option>
        <option value="black" selected></option>
      </select>
      <Popup trigger={<button className="ql-image"></button>} nested position="bottom center">
        <GalleryCtl />
      </Popup>
      <Popup trigger={<button className="ql-video"></button>} nested position="bottom center">
        {close => <GalleryCtl itemSelected={() => close()} />}
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
