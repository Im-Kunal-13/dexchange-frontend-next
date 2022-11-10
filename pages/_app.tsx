import "../styles/globals.scss"
import "tailwindcss/tailwind.css"
import type { AppProps } from "next/app"
import { Provider } from "react-redux"
import { store } from "../store/store"
import { AppContextProvider } from "../context/contextProvider"
import * as React from "react"
import PropTypes from "prop-types"
import Head from "next/head"
import CssBaseline from "@mui/material/CssBaseline"
import { CacheProvider } from "@emotion/react"
import createEmotionCache from "../src/createEmotionCache"

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export default function MyApp(props: any) {
    const {
        Component,
        emotionCache = clientSideEmotionCache,
        pageProps,
    } = props

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </Head>

            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <AppContextProvider>
                <Provider store={store}>
                    <Component {...pageProps} />
                </Provider>
            </AppContextProvider>
        </CacheProvider>
    )
}
