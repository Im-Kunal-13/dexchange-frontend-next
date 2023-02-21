import { NoSsr } from "@mui/material"

import { NextPage } from "next"
import DashboardLayout from "layout/dashboardLayout"
import ExchangeLayout from "layout/exchangeLayout"
import Head from "next/head"
import NavbarV2 from "components/Dashboard/NavbarV2"
import { useAppStateContext } from "context/contextProvider"
import { useWallet } from "@sei-js/react"
import { useEffect } from "react"
import { RPC_URL, REST_URL } from "constants/index"

const Home: NextPage = () => {
    const {
        // @ts-ignore
        setMetamaskModalActive,
        // @ts-ignore
        metamaskModalActive,
    } = useAppStateContext()

    // @ts-ignore
    const seiWallet: UseWallet | null =
        typeof window !== "undefined"
            ? useWallet(window, {
                  inputWallet: "keplr",
                  autoConnect: true,
                  chainConfiguration: {
                      chainId: "sei",
                      rpcUrl: RPC_URL,
                      restUrl: REST_URL,
                  },
              })
            : null

    useEffect(() => {
        // @ts-ignore
        if (typeof window?.keplr === "undefined") {
            setMetamaskModalActive(true)
        }
    }, [metamaskModalActive])

    return (
        <DashboardLayout>
            <Head>
                <title>Dexchange</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <NoSsr>
                <NavbarV2 seiWallet={seiWallet} />
            </NoSsr>
            <ExchangeLayout seiWallet={seiWallet} />
        </DashboardLayout>
    )
}

export default Home
