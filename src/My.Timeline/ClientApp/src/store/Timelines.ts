import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface TimelinesState {
    isLoading: boolean;
    startDateIndex?: number;
    timelines: TimelineSummary[];
}

export interface TimelineSummary {
    id: string;
    title: string;
    description: string;
    snapshot: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestTimelinesAction {
    type: 'REQUEST_TIMELINES';
}

interface ReceiveTimelinesAction {
    type: 'RECEIVE_TIMELINES';
    timelines: TimelineSummary[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestTimelinesAction | ReceiveTimelinesAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestTimelines: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.timelines) {
            fetch(`api/timelines`)
                .then(response => response.json() as Promise<TimelineSummary[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_TIMELINES', timelines: data });
                });

            dispatch({ type: 'REQUEST_TIMELINES' });
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: TimelinesState = { timelines: [], isLoading: false };

export const reducer: Reducer<TimelinesState> = (state: TimelinesState | undefined, incomingAction: Action): TimelinesState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_TIMELINES':
            return {
                timelines: state.timelines,
                isLoading: true
            };
        case 'RECEIVE_TIMELINES':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            return {
                timelines: action.timelines,
                isLoading: false
            };
    }

    return state;
};
