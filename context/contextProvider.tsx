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
}
export const AppStateContext = createContext<AppContextInterface | null>(null)

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [snackbarWarning, setSnackbarWarning] = useState({
        open: false,
        message: "",
    })
    const [snackbarError, setSnackbarError] = useState({
        open: false,
        message: ""
    })
    const [snackbarSuccess, setSnackbarSuccess] = useState({
        open: false,
        message: ""
    })
    const [snackbarInfo, setSnackbarInfo] = useState({
        open: false,
        message: ""
    })

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
            }}
        >
            {children}
        </AppStateContext.Provider>
    )
}

export default AppStateContext
export const useAppStateContext = () => useContext(AppStateContext)
