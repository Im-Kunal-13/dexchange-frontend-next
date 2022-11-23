import { useEffect } from "react"
import type { NextPage } from "next"
import { useAppDispatch, useAppSelector } from "../store/store"
import Navbar from "../components/Dashboard/Navbar"
import Markets from "../components/Dashboard/Markets"
import Balance from "../components/Dashboard/Balance"
import Order from "../components/Dashboard/Order"
import Transactions from "../components/Dashboard/Transactions"
import Trades from "../components/Dashboard/Trades"
import OrderBook from "../components/Dashboard/OrderBook"
import AlertWarning from "../components/Alerts/AlertWarning"
import AlertInfo from "../components/Alerts/AlertInfo"
import AlertSuccess from "../components/Alerts/AlertSuccess"
import AlertError from "../components/Alerts/AlertError"
import AlertLoading from "../components/Alerts/AlertLoading"
import TvChart from "../components/Dashboard/TvChart"
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
    getCancelledOrders,
} from "../api/interactions"
import { useAppStateContext } from "../context/contextProvider"
import { actions } from "../features/reducerActions"
import * as io from "socket.io-client"
import { IGetOrder } from "../types"
import PriceChart from "../components/Dashboard/PriceChart"
import Head from "next/head"

const socket = io.connect("https://seashell-app-5u4ct.ondigitalocean.app")

const Home: NextPage = () => {
    const dispatch = useAppDispatch()
    const { contracts, pair, symbols } = useAppSelector((state) => state.tokens)
    const { depositState, withdrawState, contract } = useAppSelector(
        (state) => state.exchange
    )
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

            // Fetch current account and balance from metamask when changed //todo -> Not working
            window.ethereum.on("accountsChanged", () => {
                loadAccount(connection, dispatch)
            })
        }

        // Token Smart Contracts
        let token_1_address, token_2_address

        if (contracts.length > 0 && symbols.length > 0) {
            token_1_address = contracts[0].address
            token_2_address = contracts[1].address

            await loadTokens(
                connection,
                [token_1_address, token_2_address],
                symbols,
                dispatch
            )
        } else {
            token_1_address = pair?.pairs["BTC-USDC"].baseAssetAddress
            token_2_address = pair?.pairs["BTC-USDC"].quoteAssetAddress

            await loadTokens(
                connection,
                [token_1_address, token_2_address],
                ["BTC", "USDC"],
                dispatch
            )
        }

        // Exchange Smart contract
        const dexchangeAddress = pair.dexchange

        await loadExchange(connection, dexchangeAddress, dispatch)
    }

    const loadMyBalances = () => {
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
                    pair.pairs[symbols.join("-")].baseAssetPrecision,
                    pair.pairs[symbols.join("-")].quoteAssetPrecision,
                ],
                dispatch
            )
            loadExchangeBalances(
                [
                    pair.pairs[symbols.join("-")].baseAssetPrecision,
                    pair.pairs[symbols.join("-")].quoteAssetPrecision,
                ],
                contracts,
                account,
                chainId,
                dispatch
            )
        }
    }

    // Initially loading the blockchain data on first render
    useEffect(() => {
        if (pair && connection && chainId) {
            loadBlockchainData()
        }
    }, [pair, connection, chainId, symbols])

    // Loading the blockchain data on withdraw or deposit success
    useEffect(() => {
        if (depositState.success || withdrawState.success) {
            loadBlockchainData()
        }
    }, [depositState.success, withdrawState.success])

    // Loading states while depositing tokens
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

    // Loading states while withdrawing tokens
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

    // Loading the token pairs when chainId is there
    useEffect(() => {
        if (chainId) {
            loadTokenPair(chainId, dispatch)
        }
    }, [chainId])

    // Loading the token and dexchange contract balances on the initial render
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
                    pair.pairs[symbols.join("-")].baseAssetPrecision,
                    pair.pairs[symbols.join("-")].quoteAssetPrecision,
                ],
                dispatch
            )
            loadExchangeBalances(
                [
                    pair.pairs[symbols.join("-")].baseAssetPrecision,
                    pair.pairs[symbols.join("-")].quoteAssetPrecision,
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
                    pair.pairs[symbols.join("-")].baseAssetPrecision,
                    pair.pairs[symbols.join("-")].quoteAssetPrecision,
                ],
                dispatch
            )

            loadExchangeBalances(
                [
                    pair.pairs[symbols.join("-")].baseAssetPrecision,
                    pair.pairs[symbols.join("-")].quoteAssetPrecision,
                ],
                contracts,
                account,
                chainId,
                dispatch
            )
        }
    }, [withdrawState.success, depositState.success])

    // Loading chainId on first render // todo: edge cases check
    useEffect(() => {
        const provider: any = loadProvider(dispatch)
        loadNetwork(provider, dispatch)

        if (localStorage?.getItem("isWalletConnected") === "true") {
            loadAccount(provider, dispatch)
        }
    }, [])

    // Loadig orders and trades when chainId is available
    useEffect(() => {
        if (chainId && symbols) {
            getBuyOrders(chainId, dispatch)
            getSellOrders(chainId, dispatch)
            loadTrades(chainId, symbols.join("-"), dispatch)
        }
    }, [chainId, symbols])

    // Loading my orders and trades when chainId and account is available
    useEffect(() => {
        if (account && chainId && symbols) {
            getMyOrders(chainId, account, dispatch)
            loadTrades(chainId, symbols.join("-"), dispatch, account)
            getCancelledOrders(chainId, account, dispatch)
        }
    }, [chainId, account, symbols])

    // Listening to Socket.io events
    useEffect(() => {
        if (account && chainId) {
            socket.on("new_order_inserted", (order: IGetOrder) => {
                if (order.chainId === chainId) {
                    dispatch(
                        actions.new_order_inserted({ order, account: account })
                    )

                    if (order.wallet === account) {
                        setSnackbarSuccess({
                            open: true,
                            message: "Your order has beed placed",
                        })

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
                                    pair.pairs[symbols.join("-")]
                                        .baseAssetPrecision,
                                    pair.pairs[symbols.join("-")]
                                        .quoteAssetPrecision,
                                ],
                                dispatch
                            )
                            loadExchangeBalances(
                                [
                                    pair.pairs[symbols.join("-")]
                                        .baseAssetPrecision,
                                    pair.pairs[symbols.join("-")]
                                        .quoteAssetPrecision,
                                ],
                                contracts,
                                account,
                                chainId,
                                dispatch
                            )
                        }
                    }
                }
            })

            socket.on("order_cancelled", (order: IGetOrder) => {
                if (order.chainId === chainId) {
                    dispatch(actions.order_cancelled({ order, account }))
                }
                if (order.wallet === account) {
                    loadMyBalances()
                }
            })

            socket.on("order_filled", (order: IGetOrder) => {
                if (order.chainId === chainId) {
                    dispatch(actions.order_filled({ order, account }))
                    dispatch(actions.insert_trade({ order, account }))
                }

                if (order.wallet === account) {
                    loadMyBalances()
                }
            })

            socket.on("order_partially_filled", (order: IGetOrder) => {
                if (order.chainId === chainId) {
                    dispatch(actions.order_partially_filled({ order, account }))
                }
                if (order.wallet === account) {
                    loadMyBalances()
                }
            })
            socket.on(
                "order_partially_filled_cancelled",
                (order: IGetOrder) => {
                    if (order.chainId === chainId) {
                        dispatch(
                            actions.order_partially_filled_cancelled({
                                order,
                                account,
                            })
                        )
                    }

                    if (order.wallet === account) {
                        loadMyBalances()
                    }
                }
            )
        }

        return () => {
            socket.off("new_order_inserted")
            socket.off("order_cancelled")
            socket.off("order_filled")
            socket.off("order_partially_filled")
            socket.off("order_partially_filled_cancelled")
        }
    }, [socket, account, chainId, contract, contracts, symbols, pair])

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
                    {/* <TvChart /> */}
                    <PriceChart />
                    <Transactions />
                    <Trades />
                    <OrderBook />
                </section>
            </main>

            {/* Alerts */}
            <AlertWarning />
            <AlertInfo />
            <AlertSuccess />
            <AlertError />
            <AlertLoading />
        </div>
    )
}

export default Home
