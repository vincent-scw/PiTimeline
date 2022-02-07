import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface MomentState {
    timelineId: string;
    moment: Moment;
}

export interface Moment {
    id: string;
    content: string;
    dateTime: Date;
}

interface CreateMomentAction {
    type: 'CREATE_MOMENT';
    timelineId: string;
    moment: Moment;
}

interface UpdateMomentAction {
    type: 'UPDATE_MOMENT';
    timelineId: string;
    moment: Moment;
}

interface DeleteMomentAction {
    type: 'DELETE_MOMENT';
    timlineId: string;
    momentId: string;
}