import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta charSet="utf-8" key="charset" />
                <link rel="icon" type="image/png" sizes="192x192" href="/static/images/favicon/android-chrome-192x192.png" key="icon-android-192" />
                <link rel="icon" type="image/png" sizes="512x512" href="/static/images/favicon/android-chrome-512x512.png" key="icon-android-512" />
                <link rel="apple-touch-icon" sizes="180x180" href="/static/images/favicon/apple-touch-icon.png" key="icon-apple-touch" />
                <link rel="icon" type="image/png" sizes="32x32" href="/static/images/favicon/favicon-32x32.png" key="icon-32" />
                <link rel="icon" type="image/png" sizes="16x16" href="/static/images/favicon/favicon-16x16.png" key="icon-16" />
                <meta name="description" content="isma91 Yu-Gi-Oh! front page" key="description" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
