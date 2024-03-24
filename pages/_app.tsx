import "@app/css/layout.css";
import "@app/css/loading.css";
import React, { useEffect, useState } from "react";
import ThemeProvider from "@app/lib/theme-provider";
import SnackbarProvider from "@app/lib/snackbar-provider";
import { StateProvider } from "@app/lib/state-provider";
import RouteGuard from "@app/lib/route-guard";
import Layout from "@pages/layout";
import { NextRouter, useRouter } from "next/router";
import { USER_ROUTE_JSON, UserRouteName } from "@routes/User";
import LoadingPage from "@components/feedback/LoadingPage";
import type { Metadata } from "next";
import { FadeLoading } from "@utils/Loading";

export const metadata: Metadata = {
    title: "Yu-Gi-Oh!",
    description: "isma91 Yu-Gi-Oh! front project",
};

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
    const [loading, setLoading] = useState(true);
    const loginPathArray = [USER_ROUTE_JSON[UserRouteName.LOGIN]];
    const layoutlessPathName: boolean = loginPathArray.includes(router.pathname);

    useEffect(() => {
        /**
         * The layoutlessPathName containes route page who don't have layout nor needed auth
         * and strangly don't trigger router event
         */
        if (layoutlessPathName === true) {
            FadeLoading(setLoading);
        } else {
            router.events.on("routeChangeStart", () => setLoading(true));
            router.events.on("routeChangeComplete", () => FadeLoading(setLoading));
            router.events.on("routeChangeError", () => FadeLoading(setLoading));
        }
    }, [router, layoutlessPathName]);

    return (
        <StateProvider>
            <ThemeProvider>
                <SnackbarProvider>
                    <RouteGuard>
                        {loading === true ? (
                            <LoadingPage setLoading={setLoading} />
                        ) : layoutlessPathName === true ? (
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
