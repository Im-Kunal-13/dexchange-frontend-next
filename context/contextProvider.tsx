import React, { createContext, ReactNode, useContext, useState } from "react"

export interface AppContextInterface {
    snackbarWarning: {
        open: boolean
        message: string
        autoHide?: boolean
        content?: string
    }
    setSnackbarWarning: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            message: string
            autoHide: boolean
            content: string
        }>
    >
    snackbarError: {
        open: boolean
        message: string
        autoHide?: boolean
        content: string
    }
    setSnackbarError: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            message: string
            autoHide: boolean
            content: string
        }>
    >
    snackbarSuccess: {
        open: boolean
        message: string
        autoHide: boolean
        content: string
    }
    setSnackbarSuccess: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            message: string
            autoHide: boolean
            content: string
        }>
    >
    snackbarInfo: {
        open: boolean
        message: string
        autoHide: boolean
        content: string
    }
    setSnackbarInfo: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            message: string
            autoHide: boolean
            content: string
        }>
    >
    snackbarLoading: {
        open: boolean
        message: string
        autoHide: boolean
        content: string | undefined
    }
    setSnackbarLoading: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            message: string
            autoHide: boolean
            content: string
        }>
    >
    metamaskModalActive: boolean
    setMetamaskModalActive: React.Dispatch<React.SetStateAction<boolean>>
    sidebarToggleCollapse: boolean
    setSidebarToggleCollapse: React.Dispatch<React.SetStateAction<boolean>>
}
export const AppStateContext = createContext<AppContextInterface | null>(null)

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [snackbarWarning, setSnackbarWarning] = useState({
        open: false,
        message: "",
        autoHide: true,
        content: "",
    })
    const [snackbarError, setSnackbarError] = useState({
        open: false,
        message: "",
        autoHide: true,
        content: "",
    })
    const [snackbarSuccess, setSnackbarSuccess] = useState({
        open: false,
        message: "",
        autoHide: true,
        content: "",
    })
    const [snackbarInfo, setSnackbarInfo] = useState({
        open: false,
        message: "",
        autoHide: true,
        content: "",
    })
    const [snackbarLoading, setSnackbarLoading] = useState({
        open: false,
        message: "",
        autoHide: true,
        content: "",
    })
    const [metamaskModalActive, setMetamaskModalActive] = useState(false)
    const [sidebarToggleCollapse, setSidebarToggleCollapse] = useState(true)

    return (
        <AppStateContext.Provider
            value={{
                snackbarWarning,
                setSnackbarWarning,
                snackbarError,
                setSnackbarError,
                snackbarSuccess,
                setSnackbarSuccess,
                snackbarInfo,
                setSnackbarInfo,
                snackbarLoading,
                setSnackbarLoading,
                metamaskModalActive,
                setMetamaskModalActive,
                sidebarToggleCollapse,
                setSidebarToggleCollapse,
            }}
        >
            {children}
        </AppStateContext.Provider>
    )
}

export default AppStateContext
export const useAppStateContext = () => useContext(AppStateContext)
