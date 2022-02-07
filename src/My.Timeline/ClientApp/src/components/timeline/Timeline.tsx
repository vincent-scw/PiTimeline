import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as MomentsStore from "../../store/Moments";
import * as TimelineStore from '../../store/Timeline';

type TimelineProps =
  TimelineStore.TimelineDetailState
  & typeof TimelineStore.actionCreators
  & RouteComponentProps<{ tid: string }>;

type GroupedMoments = {
  group: string;
  moments: MomentsStore.Moment[];
}

const Timeline: React.FC<TimelineProps> = (props) => {
  const { isLoading, timeline } = props;
  const groupedMoments: GroupedMoments[] = [
    { group: 'Sep 19, 2014', moments: [{ id: '', dateTime: new Date(), content: '土耳其那边也有夏令时和冬令时之分。因为去的时候正是夏秋之际，所以和这边的时差是5个小时。飞机坐了很久，11个小时腰酸背疼腿抽筋，就一个字——累抵达伊斯坦布尔国际机场是当地时间早上5点多，天都没亮呢' }] },
    { group: 'Sep 20, 2014', moments: [{ id: '', dateTime: new Date(), content: '当地时间早上6点刚过，我们坐上了旅游中巴（飞机下来没有休息）。全团连带两个导游，一个领队，一个司机，一共才12个人。在中巴车上坐的非常宽敞。其实一坐上车，我们就跑出伊斯坦布尔了（旅行将在最后两天重返伊斯坦布尔）。导游说现在土耳其的工业蛮发达的，而且经济很稳定。不过总体看上去还是以农业为主，路上大片的经济作物......' }] }
  ];

  useEffect(() => {
    props.getTimeline(props.match.params.tid);
  }, [props.match.params.tid])

  return (
    <React.Fragment>
      {isLoading && <div>Loading...</div>}
      {timeline &&
        <div>
          <div className="t-content">
            <section>
              <h1 className="title">
                {timeline.title}
              </h1>
            </section>
          </div>
          {groupedMoments.map(gm => (
            <div className="timeline" key={gm.group}>
              <header className="timeline-header">
                <span className="tag is-primary">{gm.group}</span>
              </header>
              {gm.moments.map(m => (
                <div className="timeline-item" key={m.id}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <p className="heading">{m.dateTime.toDateString()}</p>
                    <p>{m.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ))

          }
        </div>
      }
    </React.Fragment>
  );
}

export default connect(
  (state: ApplicationState) => state.currentTimeline,
  TimelineStore.actionCreators
)(Timeline as any)