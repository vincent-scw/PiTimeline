import React from "react";

export interface TextInputProps {
  name: string;
  value?: any;
  valueChanged: Function;
  placeholder?: string;
}

export const TextInput: React.FC<TextInputProps> = (props) => {
  const { name, value, valueChanged, placeholder } = props;

  return (
    <React.Fragment>
      <div className="field">
        <label className="label">{name}</label>
        <div className="control">
          <input className="input" type="text"
            placeholder={placeholder} value={value} onChange={(e) => valueChanged(e.target.value)}/>
        </div>
      </div>
    </React.Fragment>
  )
}