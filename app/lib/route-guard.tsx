"use client";
import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from "@app/lib/state-provider";
import { NextRouter, useRouter } from "next/router";
import RefreshLoginRequest from "@api/User/Auth/RefreshLogin";
import { ActionNameType, GlobalStateType, ActionType } from "@app/types/GlobalState";
import { UserLoginRequestType } from "@app/types/entity/User";
import { USER_ROUTE_JSON, UserRouteName } from "@routes/User";

/**
 *
 * @param {children: React.ReactNode} props
 * @returns {React.ReactNode}
 */
function RouteGuard({ children }: { children: React.ReactNode }): React.ReactNode {
    const [authorized, setAuthorized] = useState<boolean>(false);
    const {
        state,
        dispatch,
    }: {
        state: GlobalStateType;
        dispatch: React.Dispatch<ActionType>;
    } = useContext(StoreContext);
    const router: NextRouter = useRouter();
    const loginPath: string = USER_ROUTE_JSON[UserRouteName.LOGIN];
    const NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY: string = process.env.NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY || "";
    let jwt: string | null = null;
    if (typeof window !== "undefined") {
        jwt = window.localStorage.getItem(NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY);
    }

    /**
     * if we have a JWT in the localStorage and no globalState we try to refresh the login first
     * then we set to false as default when the route begin to start changing
     * after the route is completely changed we check if the user have the right to be in this route
     * we put the globalState as depandancy to avoid some error
     */
    useEffect(() => {
        if (state.user === null && jwt !== null) {
            refreshLogin();
        }
        authCheck(router.asPath);
        const hide = () => setAuthorized(false);
        router.events.on("routeChangeStart", hide);
        router.events.on("routeChangeComplete", authCheck);
        return () => {
            router.events.off("routeChangeStart", hide);
            router.events.off("routeChangeComplete", authCheck);
        };
    }, [state]);

    /**
     * Try to login with the JWT in localStorage
     * @returns {Promise<void>}
     */
    const refreshLogin = async (): Promise<void> => {
        return RefreshLoginRequest()
            .then((res: UserLoginRequestType) => {
                dispatch({ type: ActionNameType.Login, payload: res.data.userInfo });
            })
            .catch((err: string | null) => {
                console.error("refresh login error:");
                console.error(err);
                dispatch({ type: ActionNameType.Logout, payload: null });
            });
    };

    /**
     * if not logged user try to go to a path who's not the login route, we redirect to login
     * if logged user try to go to login page, we redirect to home page
     * @param {string} url
     */
    const authCheck = (url: string): Promise<boolean> | void => {
        const path: string = url.split("?")[0];
        /**
         * we can only assume like that or when we change link manually we allways go to  the home page
         */
        const maybeLogged = state.user !== null || jwt !== null;
        if (maybeLogged === false && path !== loginPath) {
            router.push({
                pathname: loginPath,
                query: { returnUrl: router.asPath },
            });
        } else if (maybeLogged === true && path === loginPath) {
            router.push("/");
        } else {
            setAuthorized(true);
        }
    };
    return authorized && children;
}

export default RouteGuard;
