"use client";
import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from "@app/lib/state-provider";
import { NextRouter, useRouter } from "next/router";
import RefreshLoginRequest from "@api/User/Auth/RefreshLogin";
import { ActionNameType, GlobalStateType, ActionType } from "@app/types/GlobalState";
import { UserLoginRequestType } from "@app/types/entity/User";
import { USER_ROUTE_JSON, UserRouteName } from "@routes/User";
import { GetLocalStorageValue } from "@utils/Window";

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

    /**
     * if we have a JWT in the localStorage and no globalState we try to refresh the login first
     * then we set to false as default when the route begin to start changing
     * after the route is completely changed we check if the user have the right to be in this route
     * we put the globalState as depandancy to avoid some error
     */
    useEffect(() => {
        const loginPath: string = USER_ROUTE_JSON[UserRouteName.LOGIN];
        const NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY: string = process.env.NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY || "";
        let jwt: string | null = GetLocalStorageValue(NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY);
        if (state.user === null && jwt !== null) {
            RefreshLoginRequest()
                .then((res: UserLoginRequestType) => {
                    dispatch({ type: ActionNameType.Login, payload: res.data.userInfo });
                })
                .catch((err: string | null) => {
                    console.error("refresh login error:");
                    console.error(err);
                    dispatch({ type: ActionNameType.Logout, payload: null });
                });
        }
        /**
         * if not logged user try to go to a path who's not the login route, we redirect to login
         * if logged user try to go to login page, we redirect to home page or the waited url before login
         */
        const authCheck = (): Promise<boolean> | void => {
            const completePath: string[] = router.asPath.split("?");
            const path: string = completePath[0];
            let returnUrl: string | null = null;
            if (completePath.length > 1) {
                const returnUrlString = "returnUrl=";
                if (completePath[1].startsWith(returnUrlString) === true) {
                    returnUrl = decodeURIComponent(completePath[1].substring(returnUrlString.length));
                }
            }
            const maybeLogged = state.user !== null || jwt !== null;
            if (maybeLogged === false && path !== loginPath) {
                router.push({
                    pathname: loginPath,
                    query: { returnUrl: router.asPath },
                });
            } else if (maybeLogged === true && path === loginPath) {
                let url = "/";
                if (returnUrl !== null) {
                    url = returnUrl;
                }
                router.push(url);
            } else {
                setAuthorized(true);
            }
        };
        authCheck();
        const hide = () => setAuthorized(false);
        router.events.on("routeChangeStart", hide);
        router.events.on("routeChangeComplete", authCheck);
        return () => {
            router.events.off("routeChangeStart", hide);
            router.events.off("routeChangeComplete", authCheck);
        };
    }, [state, router, dispatch]);

    return authorized && children;
}

export default RouteGuard;
