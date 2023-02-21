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
