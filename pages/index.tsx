import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../store/store"
import {
    loadProvider,
    loadNetwork,
    loadAccount,
    loadTokens,
    loadExchange,
    loadTokenPair,
    getBuyOrders,
    getSellOrders,
    loadTrades,
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
import AlertWarning from "../components/Alerts/AlertWarning"
import AlertInfo from "../components/Alerts/AlertInfo"
import AlertSuccess from "../components/Alerts/AlertSuccess"
import AlertError from "../components/Alerts/AlertError"
import { useAppStateContext } from "../context/contextProvider"
import AlertLoading from "../components/Alerts/AlertLoading"

const Home: NextPage = () => {
    const dispatch = useAppDispatch()
    const { symbols, contracts } = useAppSelector((state) => state.tokens)
    const { depositState, withdrawState } = useAppSelector(
        (state) => state.exchange
    )
    const { insertOrderState } = useAppSelector((state) => state.order)
    const { account } = useAppSelector((state) => state.provider)

    const {
        // @ts-ignore
        setSnackbarError,
        // @ts-ignore
        setSnackbarLoading,
        // @ts-ignore
        setSnackbarSuccess,
    } = useAppStateContext()

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
        let BTC, USDC

        if (contracts.length > 0) {
            BTC = contracts[0].address
            USDC = contracts[1].address
        } else {
            BTC = "0x8c769d033934009fF7dB8A2976d3BdabFa3Dd833"
            USDC = "0x89126812d7aa022f817465B7197dE668330712E8"
        }

        await loadTokens(provider, [BTC, USDC], dispatch)

        // Exchange Smart contract
        const exchangeConfig = "0xEaa99f33BCB372F6Bb49eE91d7e47212444da374"
        await loadExchange(
            provider,
            exchangeConfig ? exchangeConfig : "",
            dispatch
        )
    }

    useEffect(() => {
        loadBlockchainData()
    }, [])

    useEffect(() => {
        if (depositState.success || withdrawState.success) {
            loadBlockchainData()
        }
    }, [depositState.success, withdrawState.success])

    useEffect(() => {
        if (depositState.loading) {
            setSnackbarLoading({
                open: true,
                message: "Depositing tokens...",
            })
        } else if (depositState.success) {
            setSnackbarLoading({
                open: false,
                message: "Depositing tokens...",
            })
            setSnackbarSuccess({
                open: true,
                message: "Tokens deposited successfully",
            })
        } else if (depositState.failed) {
            setSnackbarLoading({
                open: false,
                message: "Depositing tokens...",
            })
            setSnackbarError({
                open: true,
                message: "Token deposit unsuccessful",
            })
        }
    }, [depositState.success, depositState.loading, depositState.failed])

    useEffect(() => {
        if (insertOrderState.loading) {
            setSnackbarLoading({
                open: true,
                message: "Placing your order...",
            })
        } else if (insertOrderState.success) {
            getBuyOrders(dispatch)
            getSellOrders(dispatch)
            loadTrades(dispatch)
            loadTrades(dispatch, account)
            setSnackbarLoading({
                open: false,
                message: "Placing your order...",
            })
            setSnackbarSuccess({
                open: true,
                message: "Your order has beed placed",
            })
        } else if (insertOrderState.error) {
            setSnackbarLoading({
                open: false,
                message: "Placing your order...",
            })
            setSnackbarError({
                open: true,
                message: "Failed to place order !",
            })
        }
    }, [
        insertOrderState.success,
        insertOrderState.loading,
        insertOrderState.error,
    ])

    useEffect(() => {
        if (symbols.length) {
            loadTokenPair(dispatch)
        }
    }, [symbols])

    useEffect(() => {
        getBuyOrders(dispatch)
        getSellOrders(dispatch)
    }, [])

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
            <AlertLoading />
        </div>
    )
}

export default Home
