import config from "../assets/data/config.json"
import { useEffect } from "react"
import { useAppDispatch } from "../store/store"
import {
    loadProvider,
    loadNetwork,
    loadAccount,
    loadTokens,
    loadExchange,
    // subscribeToEvents,
} from "../api/interactions"

import type { NextPage } from "next"
import Navbar from "../components/Dashboard/Navbar"
import Markets from "../components/Dashboard/Markets"
import TvChart from "../components/Dashboard/TvChart"
import Balance from "../components/Dashboard/Balance"
import Order from "../components/Dashboard/Order"
import Transactions from "../components/Dashboard/Transactions"
import Trades from "../components/Dashboard/Trades"
import OrderBook from "../components/Dashboard/OrderBook"
import * as zksync from "zksync-web3"
import AlertWarning from "../components/Alerts/AlertWarning"
import AlertInfo from "../components/Alerts/AlertInfo"
import AlertSuccess from "../components/Alerts/AlertSuccess"
import AlertError from "../components/Alerts/AlertError"

const Home: NextPage = () => {
    const dispatch = useAppDispatch()

    const loadBlockchainData = async () => {
        // Connect to web3 API
        const provider: any = loadProvider(dispatch)

        // Fetch current network chain id
        const chainId = await loadNetwork(provider, dispatch)

        if (typeof window !== "undefined") {
            // Reload page on network change
            window.ethereum.on("chainChanged", () => {
                window.location.reload()
            })

            // Fetch current account and balance from metamask when changed
            window.ethereum.on("accountsChanged", () => {
                loadAccount(provider, dispatch)
            })
        }

        // Token Smart Contracts
        //@ts-ignore
        const BTC = config[chainId].BTC
        //@ts-ignore
        const USDC = config[chainId].USDC
        await loadTokens(provider, [BTC.address, USDC.address], dispatch)

        // Exchange Smart contract
        //@ts-ignore
        const exchangeConfig = config[chainId].deXchange
        const exchange = await loadExchange(
            provider,
            exchangeConfig.address,
            dispatch
        )

        // Listen to events
        // subscribeToEvents(exchange, dispatch)
    }

    useEffect(() => {
        loadBlockchainData()
    })

    return (
        <div className="bg-bgGray1">
            <Navbar />
            <main className="grid">
                <section className="bg-black shadow-black1 p-[2em] col-start-1 col-end-5 max-h-[82rem]">
                    <Markets />

                    <Balance />

                    <Order />
                </section>
                <section className="pt-[0.25em] px-[0.75em] col-start-5 col-end-13 grid h-fit max-h-[82rem] overflow-scroll">
                    <TvChart />
                    <Transactions />
                    <Trades />
                    <OrderBook />
                </section>
            </main>

            <AlertWarning />
            <AlertInfo />
            <AlertSuccess />
            <AlertError />
        </div>
    )
}

export default Home
