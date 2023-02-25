import "tailwindcss/tailwind.css"
import "@styles/globals.scss"
import * as React from "react"
import Head from "next/head"
import CssBaseline from "@mui/material/CssBaseline"
import { CacheProvider } from "@emotion/react"
import createEmotionCache from "../createEmotionCache"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export default function MyApp(props: any) {
    const {
        Component,
        emotionCache = clientSideEmotionCache,
        pageProps,
    } = props

    const client = new QueryClient()

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
            <QueryClientProvider client={client}>
                <Component {...pageProps} />
            </QueryClientProvider>
        </CacheProvider>
    )
}
