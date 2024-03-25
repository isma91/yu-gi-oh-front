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
import Head from "next/head";

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
    const [loading, setLoading] = useState(false);
    const isLoginPage: boolean = router.pathname.startsWith(USER_ROUTE_JSON[UserRouteName.LOGIN]);

    useEffect(() => {
        /**
         * The Login page is the only one where we don't want to display the layout nor needed auth
         * and strangly don't trigger router event
         */
        if (isLoginPage === true) {
            FadeLoading(setLoading);
        } else {
            router.events.on("routeChangeStart", () => setLoading(true));
            router.events.on("routeChangeComplete", () => FadeLoading(setLoading));
            router.events.on("routeChangeError", () => FadeLoading(setLoading));
        }
    }, [router, isLoginPage]);

    return (
        <>
            <Head>
                <title>Yu-Gi-Oh!</title>
            </Head>
            <StateProvider>
                <ThemeProvider>
                    <SnackbarProvider>
                        <RouteGuard>
                            {loading === true ? (
                                <LoadingPage setLoading={setLoading} />
                            ) : isLoginPage === true ? (
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
        </>
    );
}
