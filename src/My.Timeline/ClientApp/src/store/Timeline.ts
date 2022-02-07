import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { Moment } from './Moments';

export interface TimelineDetailState {
    isLoading: boolean;
    id: string;
    timeline?: TimelineDetail;
}

export interface TimelineDetail {
    id: string;
    title: string;
    description: string;
    moments: Moment[];
    isCompleted?: boolean;
}

interface GetTimelineDetailAction {
    type: 'GET_TIMELINE_DETAIL';
    id: string;
}

interface ReceiveTimelineDetailAction {
    type: 'RECEIVE_TIMELINE_DETAIL';
    id: string;
    timeline: TimelineDetail;
}

type KnownAction = GetTimelineDetailAction | ReceiveTimelineDetailAction;

export const actionCreators = {
    getTimeline: (id: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.currentTimeline && id !== appState.currentTimeline.id) {
            fetch(`api/timelines/${id}`)
                .then(response => response.json() as Promise<TimelineDetail>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_TIMELINE_DETAIL', id: id, timeline: data });
                });

            dispatch({ type: 'GET_TIMELINE_DETAIL', id: id });
        }
    }
}

export const reducer: Reducer<TimelineDetailState> =
    (state: TimelineDetailState | undefined, incomingAction: Action): TimelineDetailState => {
        if (state === undefined) {
            return { id: '', timeline: undefined, isLoading: false };
        }

        const action = incomingAction as KnownAction;
        switch (action.type) {
            case 'GET_TIMELINE_DETAIL':
                return {
                    id: action.id, isLoading: true
                }
            case 'RECEIVE_TIMELINE_DETAIL':
                if (action.id === state.id) {
                    return {
                        id: action.id,
                        timeline: action.timeline,
                        isLoading: false
                    }
                }
                break;
        }

        return state;
    }