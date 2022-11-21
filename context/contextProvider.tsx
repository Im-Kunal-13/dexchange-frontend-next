import React, { createContext, ReactNode, useContext, useState } from "react"

export interface AppContextInterface {
    snackbarWarning: {
        open: boolean
        message: string
    }
    setSnackbarWarning: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            message: string
        }>
    >
    snackbarError: {
        open: boolean
        message: string
    }
    setSnackbarError: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            message: string
        }>
    >
    snackbarSuccess: {
        open: boolean
        message: string
    }
    setSnackbarSuccess: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            message: string
        }>
    >
    snackbarInfo: {
        open: boolean
        message: string
    }
    setSnackbarInfo: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            message: string
        }>
    >
    snackbarLoading: {
        open: boolean
        message: string
    }
    setSnackbarLoading: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            message: string
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
    })
    const [snackbarError, setSnackbarError] = useState({
        open: false,
        message: "",
    })
    const [snackbarSuccess, setSnackbarSuccess] = useState({
        open: false,
        message: "",
    })
    const [snackbarInfo, setSnackbarInfo] = useState({
        open: false,
        message: "",
    })
    const [snackbarLoading, setSnackbarLoading] = useState({
        open: false,
        message: "",
    })
    const [metamaskModalActive, setMetamaskModalActive] = useState(false)
    const [sidebarToggleCollapse, setSidebarToggleCollapse] = useState(false)

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
