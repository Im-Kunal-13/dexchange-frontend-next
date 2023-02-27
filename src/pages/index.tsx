import { NoSsr } from "@mui/material"

import { NextPage } from "next"
import DashboardLayout from "@layout/dashboardLayout"
import ExchangeLayout from "@layout/exchangeLayout"
import Head from "next/head"
import NavbarV2 from "@components/Dashboard/NavbarV2"
import { useWallet } from "@sei-js/react"
import { useEffect } from "react"
import { RPC_URL, REST_URL } from "@constants/index"
import { useAppUiStore } from "@store/app"
import { useQuery } from "@tanstack/react-query"
import axiosConfig from "src/config/axiosConfig"
import { useTradeStore } from "@store/trades"

const Home: NextPage = () => {
    const { setMetamaskModalActive, metamaskModalActive } = useAppUiStore()
    const { setTxHistory } = useTradeStore()

    const suggestChain = async () => {
        // @ts-ignore
        return window?.keplr.experimentalSuggestChain({
            chainId: "sei",
            chainName: "Sei Devnet",
            rpc: RPC_URL,
            rest: REST_URL,
            bip44: {
                coinType: 118,
            },
            bech32Config: {
                bech32PrefixAccAddr: "sei",
                bech32PrefixAccPub: "sei" + "pub",
                bech32PrefixValAddr: "sei" + "valoper",
                bech32PrefixValPub: "sei" + "valoperpub",
                bech32PrefixConsAddr: "sei" + "valcons",
                bech32PrefixConsPub: "sei" + "valconspub",
            },
            currencies: [
                {
                    coinDenom: "SEI",
                    coinMinimalDenom: "usei",
                    coinDecimals: 6,
                    coinGeckoId: "sei",
                },
            ],
            feeCurrencies: [
                {
                    coinDenom: "SEI",
                    coinMinimalDenom: "usei",
                    coinDecimals: 6,
                    coinGeckoId: "sei",
                    gasPriceStep: {
                        low: 0.01,
                        average: 0.025,
                        high: 0.04,
                    },
                },
            ],
            stakeCurrency: {
                coinDenom: "sei",
                coinMinimalDenom: "usei",
                coinDecimals: 6,
                coinGeckoId: "sei",
            },
        })
    }

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

    useEffect(() => {
        suggestChain()
    }, [])

    useQuery(
        ["getTrades"],
        async ({ signal }) => {
            return await axiosConfig({
                method: "get",
                url: "/api/trades",
                signal,
            }).then((res) => res.data)
        },
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            onSuccess: (data) => {
                setTxHistory(data)
            },
            onError: (err) => {
                console.log("Fetching error: ", err)
            },
        }
    )

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
