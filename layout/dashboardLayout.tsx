import { Sidebar } from "../components/Core/Sidebar/Sidebar"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../store/store"
import AlertWarning from "../components/Alerts/AlertWarning"
import AlertInfo from "../components/Alerts/AlertInfo"
import AlertSuccess from "../components/Alerts/AlertSuccess"
import AlertError from "../components/Alerts/AlertError"
import AlertLoading from "../components/Alerts/AlertLoading"

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
import MetamaskModal from "../components/Core/Modal/MetamaskModal"

const socket = io.connect(process.env.NEXT_PUBLIC_DEXCHANGE_SERVER_DEV || "")

function DashboardLayout({ children }: { children: React.ReactNode }) {
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
        // @ts-ignore
        setSnackbarInfo,
        // @ts-ignore
        setMetamaskModalActive,
        // @ts-ignore
        metamaskModalActive,
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
            loadTokenBalances(contracts, account, dispatch)
            loadExchangeBalances(contracts, account, chainId, dispatch)
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

                dispatch
            )
            loadExchangeBalances(contracts, account, chainId, dispatch)
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
            loadTokenBalances(contracts, account, dispatch)

            loadExchangeBalances(contracts, account, chainId, dispatch)
        }
    }, [withdrawState.success, depositState.success])

    // Loading chainId on first render // todo: edge cases check
    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
            const provider: any = loadProvider(dispatch)
            loadNetwork(provider, dispatch)
            if (localStorage?.getItem("isWalletConnected") === "true") {
                loadAccount(provider, dispatch)
            }
        } else {
            setMetamaskModalActive(true)
        }
    }, [metamaskModalActive])

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
                console.log("new_order_inserted evnet triggered", order)
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
                            loadTokenBalances(contracts, account, dispatch)
                            loadExchangeBalances(
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
        <div className="h-screen relative overflow-hidden flex flex-row justify-start bg-bgBlack1">
            <Sidebar />
            <div className="w-full overflow-y-scroll">
                <div className="ml-24">{children}</div>
            </div>

            {/* Alerts */}
            <AlertWarning />
            <AlertInfo />
            <AlertSuccess />
            <AlertError />
            <AlertLoading />

            {/* Modal  */}
            <MetamaskModal />
        </div>
    )
}

export default DashboardLayout
