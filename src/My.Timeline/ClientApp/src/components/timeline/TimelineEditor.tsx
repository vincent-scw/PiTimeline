import React, { useState } from "react";
import { TextInput } from "../controls";
import * as Svc from '../../services';

export const TimelineEditor: React.FC = () => {
  const [timeline, setTimeline] = useState<Svc.TimelineDetail>();

  const stateChanged = (prop: string, v: any) => {
    let newEntity = { ...timeline, [prop]: v };
    setTimeline(newEntity);
  }

  return (
    <div>
      <form>
        <TextInput name="Title" valueChanged={(v) => stateChanged('title', v)} value={timeline.title} />
      </form>
    </div>
  )
}