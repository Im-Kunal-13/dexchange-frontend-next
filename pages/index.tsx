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
    loadTokenBalances,
    loadExchangeBalances,
    getMyOrders,
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
import io from "socket.io-client"
import { IGetOrder } from "../types"

// Getting the socket from the io object we imported.

// @ts-ignore
const socket = io.connect("http://localhost:5001")

const Home: NextPage = () => {
    const dispatch = useAppDispatch()
    const { contracts, pair, symbols } = useAppSelector((state) => state.tokens)
    const { depositState, withdrawState, contract } = useAppSelector(
        (state) => state.exchange
    )
    const { insertOrderState } = useAppSelector((state) => state.order)
    const { account, chainId, connection } = useAppSelector(
        (state) => state.provider
    )

    const {
        // @ts-ignore
        setSnackbarError,
        // @ts-ignore
        setSnackbarLoading,
        // @ts-ignore
        setSnackbarSuccess,
    } = useAppStateContext()

    const loadBlockchainData = async () => {
        if (typeof window !== "undefined") {
            // Reload page on network change
            window.ethereum.on("chainChanged", () => {
                window.location.reload()
            })

            // Fetch current account and balance from metamask when changed
            window.ethereum.on("accountsChanged", () => {
                loadAccount(connection, dispatch)
            })
        }

        // Token Smart Contracts
        let token_1_address, token_2_address

        if (contracts.length > 0) {
            token_1_address = contracts[0].address
            token_2_address = contracts[1].address
        } else {
            token_1_address = pair["BTC-USDC"].baseAssetAddress
            token_2_address = pair["BTC-USDC"].quoteAssetAddress
        }

        await loadTokens(
            connection,
            [token_1_address, token_2_address],
            dispatch
        )

        // Exchange Smart contract
        const dexchangeAddress = "0xEaa99f33BCB372F6Bb49eE91d7e47212444da374"
        await loadExchange(
            connection,
            dexchangeAddress ? dexchangeAddress : "",
            dispatch
        )
    }

    useEffect(() => {
        if (pair && connection && chainId) {
            loadBlockchainData()
        }
    }, [pair, connection, chainId])

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
                message: "Token deposit unsuccessful !",
            })
        }
    }, [depositState.success, depositState.loading, depositState.failed])

    useEffect(() => {
        if (withdrawState.loading) {
            setSnackbarLoading({
                open: true,
                message: "Withdrawing tokens...",
            })
        } else if (withdrawState.success) {
            setSnackbarLoading({
                open: false,
                message: "Withdrawing tokens...",
            })
            setSnackbarSuccess({
                open: true,
                message: "Tokens withdrawn successfully !",
            })
        } else if (withdrawState.failed) {
            setSnackbarLoading({
                open: false,
                message: "Withdrawing tokens...",
            })
            setSnackbarError({
                open: true,
                message: "Token withdraw unsuccessful !",
            })
        }
    }, [withdrawState.success, withdrawState.loading, withdrawState.failed])

    useEffect(() => {
        if (insertOrderState.loading) {
            setSnackbarLoading({
                open: true,
                message: "Order in progress...",
            })
        } else if (insertOrderState.success) {
            getBuyOrders(dispatch)
            getSellOrders(dispatch)
            getMyOrders(account, dispatch)
            loadTrades(dispatch)
            loadTrades(dispatch, account)

            if (
                contract &&
                contracts[0] &&
                contracts[1] &&
                account &&
                symbols[0] &&
                symbols[1] &&
                pair
            ) {
                loadTokenBalances(
                    contracts,
                    account,
                    pair && [
                        pair[symbols.join("-")].baseAssetPrecision,
                        pair[symbols.join("-")].quoteAssetPrecision,
                    ],
                    dispatch
                )
                loadExchangeBalances(
                    [
                        pair[symbols.join("-")].baseAssetPrecision,
                        pair[symbols.join("-")].quoteAssetPrecision,
                    ],
                    contracts,
                    account,
                    chainId,
                    dispatch
                )
            }

            setSnackbarLoading({
                open: false,
                message: "Order in progress...",
            })
            setSnackbarSuccess({
                open: true,
                message: "Your order has beed placed",
            })
        } else if (insertOrderState.error) {
            setSnackbarLoading({
                open: false,
                message: "Order in progress...",
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
        if (chainId) {
            loadTokenPair(chainId, dispatch)
        }
    }, [chainId])

    useEffect(() => {
        if (
            contract &&
            contracts[0] &&
            contracts[1] &&
            account &&
            symbols[0] &&
            symbols[1] &&
            pair
        ) {
            loadTokenBalances(
                contracts,
                account,
                pair && [
                    pair[symbols.join("-")].baseAssetPrecision,
                    pair[symbols.join("-")].quoteAssetPrecision,
                ],
                dispatch
            )
            loadExchangeBalances(
                [
                    pair[symbols.join("-")].baseAssetPrecision,
                    pair[symbols.join("-")].quoteAssetPrecision,
                ],
                contracts,
                account,
                chainId,
                dispatch
            )
        }
    }, [contract, contracts, account, dispatch, symbols, pair])

    useEffect(() => {
        if (
            contracts[0] &&
            contracts[1] &&
            account &&
            pair &&
            chainId &&
            (withdrawState.success || depositState.success)
        ) {
            loadTokenBalances(
                contracts,
                account,
                pair && [
                    pair[symbols.join("-")].baseAssetPrecision,
                    pair[symbols.join("-")].quoteAssetPrecision,
                ],
                dispatch
            )
            loadExchangeBalances(
                [
                    pair[symbols.join("-")].baseAssetPrecision,
                    pair[symbols.join("-")].quoteAssetPrecision,
                ],
                contracts,
                account,
                chainId,
                dispatch
            )
        }
    }, [withdrawState.success, depositState.success])

    useEffect(() => {
        getBuyOrders(dispatch)
        getSellOrders(dispatch)
        loadTrades(dispatch)

        const provider: any = loadProvider(dispatch)
        loadNetwork(provider, dispatch)

        if (localStorage?.getItem("isWalletConnected") === "true") {
            loadAccount(provider, dispatch)
        }
    }, [])

    useEffect(() => {
        socket.on("new_order_inserted", (data: IGetOrder) => {
            getBuyOrders(dispatch)
            getSellOrders(dispatch)
            getMyOrders(account, dispatch)
        })

        return () => {
            socket.off("new_order_inserted")
        }
    }, [socket])

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
