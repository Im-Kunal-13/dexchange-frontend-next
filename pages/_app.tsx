import "../styles/globals.scss"
import "tailwindcss/tailwind.css"
import type { AppProps } from "next/app"

import { Provider } from "react-redux"
import { store } from "../store/store"
import { AppContextProvider } from "../context/contextProvider"

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AppContextProvider>
            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
        </AppContextProvider>
    )
}

export default MyApp
