import React, { useRef, useMemo } from "react";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Popup from "reactjs-popup";
import { PopupGallery } from "./PopupGallery";
import * as Svc from '../../services';
import { buildImgUrl } from "../../utilities/ImgUrlBuilder";

const BlockEmbed = Quill.import('blots/block/embed');
class ImgEmbed extends BlockEmbed {
  static create(value) {
    let node = super.create(value);
    node.setAttribute('src', value.src);
    node.setAttribute('class', value.className);

    node.onclick = function(e) {
      console.log('click:' + value.src);
    }
    return node;
  }

  static value(node) {
    return {
      src: node.getAttribute('src'),
      className: node.getAttribute('class')
    };
  }
}

ImgEmbed.blotName = 'mImage';
ImgEmbed.tagName = 'img';
Quill.register(ImgEmbed);

class VideoEmbed extends BlockEmbed {
  static create(value) {
    let node = super.create(value);
    node.setAttribute('src', value.src)
    node.setAttribute('controls', value.controls)
    node.setAttribute('class', value.className)
    node.setAttribute('webkit-playsinline', true)
    node.setAttribute('playsinline', true)
    node.setAttribute('x5-playsinline', true)
    return node;
  }

  static value (node) {
    return {
      src: node.getAttribute('src'),
      controls: node.getAttribute('controls'),
      className: node.getAttribute('class')
    };
  }
}

VideoEmbed.blotName = 'mVideo';
VideoEmbed.tagName = 'video';
Quill.register(VideoEmbed);

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

  const photoSelected = (item: Svc.Media) => {
    quill.current.focus();
    if (item) {
      const editor = quill.current.getEditor();
      const cursorPosition = editor.getSelection().index;
      editor.insertEmbed(cursorPosition, 'mImage', { src: buildImgUrl(item.path, 800), className: 'moment-image' });
      editor.setSelection(cursorPosition + 1);
    }
  }

  const videoSelected = (item: Svc.Media) => {
    quill.current.focus();
    if (item) {
      const editor = quill.current.getEditor();
      const cursorPosition = editor.getSelection().index;
      editor.insertEmbed(cursorPosition, 'mVideo', { src: buildImgUrl(item.path, 800), clasName: 'moment-video' });
      editor.setSelection(cursorPosition + 1);
    }
  }
  
  const handleValueChanged = newValue =>
    setTimeout(() => valueChanged(newValue))

  const buildCustomToolbar = () => (
    <div id="toolbar">
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <Popup trigger={<button className="ql-image"></button>} modal nested position="center center">
        {close => <PopupGallery itemSelected={(item) => { photoSelected(item); close(); }} />}
      </Popup>
      {/* <Popup trigger={<button className="ql-video"></button>} modal nested position="center center">
        {close => <PopupGallery itemSelected={(item) => { videoSelected(item); close(); }} />}
      </Popup> */}
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
