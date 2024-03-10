import "@app/css/layout.css";
import React from "react";
import ThemeProvider from "@app/lib/theme-provider";
import SnackbarProvider from "@app/lib/snackbar-provider";
import { StateProvider } from "@app/lib/state-provider";
import RouteGuard from "@app/lib/route-guard";
import Layout from "@pages/layout";
import { NextRouter, useRouter } from "next/router";
import { USER_ROUTE_JSON, UserRouteName } from "@routes/User";

type AppPropsType = {
    Component: any | Function;
    pageProps: Object;
    router: any;
};

/**
 *
 * @param {AppPropsType} props
 * @returns {React.JSX.Element}
 */
export default function App(props: AppPropsType): React.JSX.Element {
    const { Component, pageProps } = props;
    const router: NextRouter = useRouter();
    const loginPath = USER_ROUTE_JSON[UserRouteName.LOGIN];
    const layoutlessPathName: boolean = router.pathname === loginPath;

    return (
        <StateProvider>
            <ThemeProvider>
                <SnackbarProvider>
                    <RouteGuard>
                        {layoutlessPathName === true ? (
                            <Component {...pageProps} />
                        ) : (
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        )}
                    </RouteGuard>
                </SnackbarProvider>
            </ThemeProvider>
        </StateProvider>
    );
}
