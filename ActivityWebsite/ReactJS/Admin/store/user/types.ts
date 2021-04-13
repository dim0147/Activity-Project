export const SET_USER = 'SET_USER';
export const REMOVE_USER = 'REMOVE_USER';

export interface IUser {
    Id: string,
    Email: string,
    Username: string,
    DisplayName: string,
    Role?: string,
    Status: string,
    AuthenticateType: string,
    PhoneNumber: string
}

export interface ISetUserAction {
    type: typeof SET_USER,
    payload: IUser
}

export interface IRemoveUserAction {
    type: typeof REMOVE_USER
}

export type UserActionTypes = ISetUserAction | IRemoveUserAction;