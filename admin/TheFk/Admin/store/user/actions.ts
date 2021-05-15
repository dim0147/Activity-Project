import {
    IUser,
    SET_USER,
    REMOVE_USER,
    ISetUserAction,
    IRemoveUserAction,
} from './types';

export const setUser = (user: IUser): ISetUserAction => ({
    type: SET_USER,
    payload: user
});

export const removeUser = (): IRemoveUserAction => ({
    type: REMOVE_USER,
});
