import { Alert, Snackbar } from "@mui/material"
import { SnackbarOrigin } from "@mui/material/Snackbar"
import { useAppStateContext } from "../../context/contextProvider"
import Slide, { SlideProps } from "@mui/material/Slide"
import CloseIcon from "@mui/icons-material/Close"
import React from "react"

type TransitionProps = Omit<SlideProps, "direction">

function TransitionLeft(props: TransitionProps) {
    return <Slide {...props} direction="left" />
}

const WarningSuccess = () => {
    // @ts-ignore
    const { snackbarSuccess, setSnackbarSuccess } = useAppStateContext()
    const position: SnackbarOrigin = { vertical: "bottom", horizontal: "right" }

    return (
        <Snackbar
            anchorOrigin={position}
            onClose={() => {
                setSnackbarSuccess({
                    open: false,
                    message: snackbarSuccess.message,
                })
                setTimeout(() => {
                    setSnackbarSuccess({
                        open: false,
                        message: "",
                    })
                }, 10000)
            }}
            open={snackbarSuccess.open}
            autoHideDuration={6000}
            message="Note archived"
            key={"top" + "center"}
            TransitionComponent={TransitionLeft}
        >
            <Alert
                severity="success"
                className="bg-alertBgGreen text-alertTextGreen py-5 flex items-center justify-between relative rounded overflow-hidden shadow-black1"
                classes={{ icon: "relative bottom-0.5" }}
            >
                <div className="h-full w-1 absolute bg-alertGreen left-0 top-0" />
                <span className="mr-3">{snackbarSuccess.message}</span>
                <CloseIcon
                    className="relative bottom-0.5 hover:bg-alertTextGreen hover:text-alertBgGreen rounded-full transition-all duration-300 cursor-pointer"
                    onClick={() => {
                        setSnackbarSuccess({
                            open: false,
                            message: snackbarSuccess.message,
                        })
                        setTimeout(() => {
                            setSnackbarSuccess({
                                open: false,
                                message: "",
                            })
                        }, 10000)
                    }}
                />
            </Alert>
        </Snackbar>
    )
}

export default WarningSuccess
