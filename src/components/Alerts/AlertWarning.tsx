import { Alert, Snackbar } from "@mui/material"
import { SnackbarOrigin } from "@mui/material/Snackbar"
import Slide, { SlideProps } from "@mui/material/Slide"
import CloseIcon from "@mui/icons-material/Close"
import React from "react"
import { useAppUiStore } from "@store/app"

type TransitionProps = Omit<SlideProps, "direction">

function TransitionLeft(props: TransitionProps) {
    return <Slide {...props} direction="left" />
}

const AlertWarning = () => {
    const { snackbarWarning, setSnackbarWarning } = useAppUiStore()
    const position: SnackbarOrigin = { vertical: "bottom", horizontal: "right" }

    return (
        <Snackbar
            anchorOrigin={position}
            onClose={(reason) => {
                if (reason === null) {
                    setSnackbarWarning({
                        open: false,
                        message: snackbarWarning.message,
                    })
                    setTimeout(() => {
                        setSnackbarWarning({
                            open: false,
                            message: "",
                        })
                    }, 10000)
                }
            }}
            open={snackbarWarning.open}
            autoHideDuration={1000}
            message="Note archived"
            key={"top" + "center"}
            TransitionComponent={TransitionLeft}
        >
            <Alert
                severity="warning"
                className="bg-alertBgYellow text-alertTextYellow py-5 flex items-center justify-between relative rounded overflow-hidden shadow-black1"
                classes={{ icon: "relative bottom-0.5" }}
            >
                <div className="h-full w-1 absolute bg-alertYellow left-0 top-0" />
                <span className="mr-3">{snackbarWarning.message}</span>
                <CloseIcon
                    className="relative bottom-0.5 hover:bg-alertTextYellow hover:text-alertBgYellow rounded-full transition-all duration-300 cursor-pointer"
                    onClick={() => {
                        setSnackbarWarning({
                            open: false,
                            message: snackbarWarning.message,
                        })
                        setTimeout(() => {
                            setSnackbarWarning({
                                open: false,
                                message: "",
                            })
                        }, 1000)
                    }}
                />
            </Alert>
        </Snackbar>
    )
}

export default AlertWarning
