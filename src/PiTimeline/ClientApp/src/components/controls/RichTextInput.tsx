import React from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export interface RichTextInputProps {
  value?: string;
  valueChanged?: (content: string) => void;
}

export const RichTextInput: React.FC<RichTextInputProps> = (props) => {
  const { value, valueChanged } = props;

  return (
    <div className="field">
      <ReactQuill theme="snow" value={value} onChange={valueChanged} />
    </div>
  )
}