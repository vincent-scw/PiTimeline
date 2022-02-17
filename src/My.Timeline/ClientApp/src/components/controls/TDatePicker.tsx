import React from 'react';
import DatePicker from 'react-date-picker';

export interface TDatePickerProps {
  name?: string;
  value?: Date;
  valueChanged: (date) => void;
}

export const TDatePicker: React.FC<TDatePickerProps> = (props) => {
  const { name, value, valueChanged } = props;

  return (
    <React.Fragment>
      <div className="field is-horizontal">
        {name &&
          <div className="field-label is-normal">
            <label className="label">{name}</label>
          </div>
        }
        <div className="field-body">
          <div className="field">
            <div className="control">
              <DatePicker value={value ? new Date(value): new Date()} onChange={valueChanged} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}