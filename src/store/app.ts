import { IProvider } from "../types/index"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface AppPersistState {
    provider: IProvider
    setProvider: (provider: IProvider) => void
    reset: () => void
}

interface ISnackbarState {
    open: boolean
    message: string
    autoHide?: boolean
    content?: string
}

interface AppUIState {
    metamaskModalActive: boolean
    setMetamaskModalActive: (metamaskModalActive: boolean) => void
    sidebarToggleCollapse: boolean
    setSidebarToggleCollapse: (sidebarToggleCollapse: boolean) => void
    snackbarWarning: ISnackbarState
    setSnackbarWarning: (snackbarWarning: ISnackbarState) => void
    snackbarError: ISnackbarState
    setSnackbarError: (snackbarError: ISnackbarState) => void
    snackbarSuccess: ISnackbarState
    setSnackbarSuccess: (snackbarSuccess: ISnackbarState) => void
    snackbarInfo: ISnackbarState
    setSnackbarInfo: (snackbarInfo: ISnackbarState) => void
    snackbarLoading: ISnackbarState
    setSnackbarLoading: (snackbarLoading: ISnackbarState) => void
    reset: () => void
}

export const useAppPersistStore = create<AppPersistState>()(
    devtools(
        persist(
            (set) => ({
                provider: {
                    connection: null,
                    account: "",
                    balances: [],
                    chainId: "",
                },
                setProvider: (provider: IProvider) => set(() => ({ provider })),
                reset: () =>
                    set(() => ({
                        provider: {
                            connection: null,
                            account: "",
                            balances: [],
                            chainId: "",
                        },
                    })),
            }),
            {
                name: "app-storage",
            }
        )
    )
)

export const useAppUiStore = create<AppUIState>()(
    devtools(
        (set) => ({
            metamaskModalActive: false,
            setMetamaskModalActive: (metamaskModalActive: boolean) =>
                set(() => ({
                    metamaskModalActive,
                })),
            sidebarToggleCollapse: true,
            setSidebarToggleCollapse: (sidebarToggleCollapse: boolean) =>
                set(() => ({
                    sidebarToggleCollapse,
                })),
            snackbarWarning: {
                open: false,
                message: "",
                autoHide: true,
                content: "",
            },
            setSnackbarWarning: (snackbarWarning: ISnackbarState) =>
                set(() => ({
                    snackbarWarning,
                })),
            snackbarError: {
                open: false,
                message: "",
                autoHide: true,
                content: "",
            },
            setSnackbarError: (snackbarError: ISnackbarState) =>
                set(() => ({
                    snackbarError,
                })),
            snackbarSuccess: {
                open: false,
                message: "",
                autoHide: true,
                content: "",
            },
            setSnackbarSuccess: (snackbarSuccess: ISnackbarState) =>
                set(() => ({
                    snackbarSuccess,
                })),
            snackbarInfo: {
                open: false,
                message: "",
                autoHide: true,
                content: "",
            },
            setSnackbarInfo: (snackbarInfo: ISnackbarState) =>
                set(() => ({
                    snackbarInfo,
                })),
            snackbarLoading: {
                open: false,
                message: "",
                autoHide: true,
                content: "",
            },
            setSnackbarLoading: (snackbarLoading: ISnackbarState) =>
                set(() => ({
                    snackbarLoading,
                })),
            reset: () =>
                set(() => ({
                    snackbarWarning: {
                        open: false,
                        message: "",
                        autoHide: true,
                        content: "",
                    },
                    snackbarError: {
                        open: false,
                        message: "",
                        autoHide: true,
                        content: "",
                    },
                    snackbarSuccess: {
                        open: false,
                        message: "",
                        autoHide: true,
                        content: "",
                    },
                    snackbarInfo: {
                        open: false,
                        message: "",
                        autoHide: true,
                        content: "",
                    },
                    snackbarLoading: {
                        open: false,
                        message: "",
                        autoHide: true,
                        content: "",
                    },
                })),
        }),
        {
            name: "app-ui-storage",
        }
    )
)
