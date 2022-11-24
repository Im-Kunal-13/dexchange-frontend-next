import { Alert, CircularProgress, Snackbar } from "@mui/material"
import { SnackbarOrigin } from "@mui/material/Snackbar"
import { useAppStateContext } from "../../context/contextProvider"
import Slide, { SlideProps } from "@mui/material/Slide"
import CloseIcon from "@mui/icons-material/Close"
import React from "react"

type TransitionProps = Omit<SlideProps, "direction">

function TransitionLeft(props: TransitionProps) {
    return <Slide {...props} direction="left" />
}

const AlertLoading = () => {
    // @ts-ignore
    const { snackbarLoading, setSnackbarLoading } = useAppStateContext()
    const position: SnackbarOrigin = { vertical: "bottom", horizontal: "right" }

    return (
        <Snackbar
            anchorOrigin={position}
            onClose={() => {
                setSnackbarLoading({
                    open: false,
                    message: snackbarLoading.message,
                })
                setTimeout(() => {
                    setSnackbarLoading({
                        open: false,
                        message: "",
                    })
                }, 10000)
            }}
            open={snackbarLoading.open}
            message="Note archived"
            key={"top" + "center"}
            TransitionComponent={TransitionLeft}
        >
            <Alert
                severity="info"
                className="bg-alertBgBlue text-alertTextBlue py-5 flex items-center relative rounded overflow-hidden shadow-black1"
                classes={{ icon: "hidden" }}
            >
                <div className="h-full w-1 absolute bg-blue1 left-0 top-0" />
                <div className="min-w-[260px] flex items-center justify-between">
                    <CircularProgress
                        variant="indeterminate"
                        size={20}
                        className="text-blue1 ml-2 mr-4"
                        thickness={5}
                    />
                    <span className="mr-3">{snackbarLoading.message}</span>
                    <CloseIcon
                        className="relative bottom-0.5 hover:bg-blue1 hover:text-alertBgBlue rounded-full transition-all duration-300 cursor-pointer ml-auto w-fit"
                        onClick={() => {
                            setSnackbarLoading({
                                open: false,
                                message: snackbarLoading.message,
                            })
                            setTimeout(() => {
                                setSnackbarLoading({
                                    open: false,
                                    message: "",
                                })
                            }, 10000)
                        }}
                    />
                </div>
            </Alert>
        </Snackbar>
    )
}

export default AlertLoading
