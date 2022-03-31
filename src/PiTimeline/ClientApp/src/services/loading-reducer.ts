const initialState = { progress: 0};

export const SET_PROGRESS = 'SET_PROGRESS';

export function loadingReducer(state = initialState, action) {
    switch (action.type) {
        case SET_PROGRESS:
            state.progress = action.payload;
            return {...state};
        
        default:
            return state;
    }
}

export const setLoadingBarProgress = value => ({
    type: SET_PROGRESS,
    payload: value
})