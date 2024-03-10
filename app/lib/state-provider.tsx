"use client";
import React, { createContext, useReducer } from "react";
import { GlobalStateType, ActionNameType, ActionType } from "@app/types/GlobalState";
import { UserLoginType } from "@app/types/entity/User";

const NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY: string = process.env.NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY || "";

type StoreContextType = {
    state: GlobalStateType;
    dispatch: React.Dispatch<ActionType>;
};

const initialStateValue: GlobalStateType = { user: null };
export const StoreContext = createContext<StoreContextType>({ state: initialStateValue, dispatch: () => undefined });
const { Provider }: { Provider: React.Provider<StoreContextType> } = StoreContext;

/**
 *
 * @param {{children: ReactNode}} props
 * @returns {JSX.Element}
 * @throws {Error}
 */
export function StateProvider(props: { children: React.ReactNode }): JSX.Element {
    const { children } = props;
    const [state, dispatch]: [state: GlobalStateType, dispatch: React.Dispatch<ActionType>] = useReducer(
        (stateReducer: GlobalStateType, action: ActionType): GlobalStateType => {
            const { type, payload } = action;
            switch (type) {
                case ActionNameType.Login:
                    const { username: usernameLogin, jwt: jwtLogin, role: roleLogin }: UserLoginType = payload;
                    let newStateLogin = { ...stateReducer };
                    newStateLogin.user = {
                        username: usernameLogin,
                        jwt: jwtLogin,
                        role: roleLogin,
                    };
                    localStorage.setItem(NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY, jwtLogin);
                    return newStateLogin;
                case ActionNameType.Logout:
                    let newStateLogout = { ...stateReducer };
                    newStateLogout.user = null;
                    localStorage.removeItem(NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY);
                    return newStateLogout;
                default:
                    throw Error(`Action ${type} not found`);
            }
        },
        initialStateValue
    );
    return <Provider value={{ state, dispatch }}>{children}</Provider>;
}
