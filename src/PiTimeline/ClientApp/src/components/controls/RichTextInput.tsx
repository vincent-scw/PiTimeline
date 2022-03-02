import React, { useRef } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export interface RichTextInputProps {
  value?: string;
  valueChanged?: (content: string) => void;
  insertImageClicked?: () => string;
  insertVideoClicked?: () => string;
}

export const RichTextInput: React.FC<RichTextInputProps> = (props) => {
  const { value, valueChanged, insertImageClicked, insertVideoClicked } = props;
  const quill = useRef(null);

  const modules = {
    toolbar: {
      container: [['bold', 'italic', 'underline', 'strike'], ['image'], ['video']],
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
    const content = filter === 'photo' ?
      insertImageClicked() : insertVideoClicked();

    if (content) {
      const editor = quill.current.getEditor();
      const cursorPosition = editor.getSelection().index;
      editor.insertText(cursorPosition, content);
      editor.setSelection(cursorPosition + content.length);
    }
  }

  const handleValueChanged = newValue =>
    setTimeout(() => valueChanged(newValue))

  return (
    <div className="field">
      <ReactQuill theme="snow" placeholder="Record your moment here..." defaultValue={value} onChange={handleValueChanged}
        modules={modules} ref={quill} />
    </div>
  )
}
