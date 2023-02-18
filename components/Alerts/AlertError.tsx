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

const AlertError = () => {
    // @ts-ignore
    const { snackbarError, setSnackbarError } = useAppStateContext()
    const position: SnackbarOrigin = { vertical: "bottom", horizontal: "right" }

    return (
        <Snackbar
            anchorOrigin={position}
            onClose={(reason) => {
                if (reason === null) {
                    setSnackbarError({
                        open: false,
                        message: snackbarError.message,
                    })
                    setTimeout(() => {
                        setSnackbarError({
                            open: false,
                            message: "",
                        })
                    }, 10000)
                }
            }}
            open={snackbarError.open}
            autoHideDuration={6000}
            message="Note archived"
            key={"top" + "center"}
            TransitionComponent={TransitionLeft}
        >
            <Alert
                severity="error"
                className="bg-alertBgRed text-alertTextRed py-5 flex items-center justify-between relative rounded overflow-hidden shadow-black1"
                classes={{ icon: "relative bottom-0.5" }}
            >
                <div className="h-full w-1 absolute bg-alertRed left-0 top-0" />
                <span className="mr-3">{snackbarError.message}</span>
                <CloseIcon
                    className="relative bottom-0.5 hover:bg-alertTextRed hover:text-alertBgRed rounded-full transition-all duration-300 cursor-pointer"
                    onClick={() => {
                        setSnackbarError({
                            open: false,
                            message: snackbarError.message,
                        })
                        setTimeout(() => {
                            setSnackbarError({
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

export default AlertError
