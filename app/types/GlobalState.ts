import { UserLoginType } from "@app/types/entity/User";

export type GlobalStateType = {
    user: UserLoginType | null
}

export type ActionType = {
    type: ActionNameType,
    payload: UserLoginType | any
}

export enum ActionNameType {
    Login = "login",
    Logout = "logout"
};