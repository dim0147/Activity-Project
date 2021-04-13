import { IUser, SET_USER, REMOVE_USER, UserActionTypes } from './types'

const initState = null;

export default function userReducer(state: null | IUser = initState , action: UserActionTypes): null | IUser{
    switch(action.type){
        case SET_USER:
            return action.payload;
        case REMOVE_USER:
            return null;
        default:
            return null;
    }
}