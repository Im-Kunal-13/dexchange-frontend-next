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

const AlertInfo = () => {
    // @ts-ignore
    const { snackbarInfo, setSnackbarInfo } = useAppStateContext()
    const position: SnackbarOrigin = { vertical: "bottom", horizontal: "right" }

    return (
        <Snackbar
            anchorOrigin={position}
            onClose={() => {
                setSnackbarInfo({
                    open: false,
                    message: snackbarInfo.message,
                })
                setTimeout(() => {
                    setSnackbarInfo({
                        open: false,
                        message: "",
                    })
                }, 10000)
            }}
            open={snackbarInfo.open}
            autoHideDuration={6000}
            message="Note archived"
            key={"top" + "center"}
            TransitionComponent={TransitionLeft}
        >
            <Alert
                severity="info"
                className="bg-alertBgBlue text-alertTextBlue py-5 flex items-center justify-between relative rounded overflow-hidden shadow-black1"
                classes={{ icon: "relative bottom-0.5" }}
            >
                <div className="h-full w-1 absolute bg-alertBlue left-0 top-0" />
                <span className="mr-3">{snackbarInfo.message}</span>
                <CloseIcon
                    className="relative bottom-0.5 hover:bg-alertTextBlue hover:text-alertBgBlue rounded-full transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setSnackbarInfo({
                            open: false,
                            message: snackbarInfo.message,
                        })
                        setTimeout(() => {
                            setSnackbarInfo({
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

export default AlertInfo
