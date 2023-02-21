import { Alert, Button, IconButton, Snackbar, Tooltip } from "@mui/material"
import { SnackbarOrigin } from "@mui/material/Snackbar"
import { useAppStateContext } from "../../context/contextProvider"
import Slide, { SlideProps } from "@mui/material/Slide"
import { CopyToClipboard } from "react-copy-to-clipboard"
import React, { useState } from "react"
import { ContentCopy, Close } from "@mui/icons-material"
import { TRUE } from "sass"

type TransitionProps = Omit<SlideProps, "direction">

function TransitionLeft(props: TransitionProps) {
    return <Slide {...props} direction="left" />
}

const AlertSuccess = () => {
    // @ts-ignore
    const { snackbarSuccess, setSnackbarSuccess } = useAppStateContext()
    const position: SnackbarOrigin = { vertical: "bottom", horizontal: "right" }
    const [isContentCopied, setIsContentCopied] = useState(false)

    return (
        <Snackbar
            anchorOrigin={position}
            onClose={(reason) => {
                if (reason === null) {
                    setSnackbarSuccess({
                        open: false,
                        message: snackbarSuccess.message,
                    })
                    setTimeout(() => {
                        setSnackbarSuccess({
                            open: false,
                            message: "",
                            content: "",
                        })

                        setIsContentCopied(false)
                    }, 10000)
                }
            }}
            open={snackbarSuccess.open}
            autoHideDuration={snackbarSuccess?.autohide ? 6000 : null}
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
                <span className="mr-0">{snackbarSuccess.message}</span>
                {!!snackbarSuccess?.content && (
                    <CopyToClipboard
                        text={snackbarSuccess?.content}
                        onCopy={() => {
                            setIsContentCopied(true)
                        }}
                    >
                        <Tooltip
                            title={isContentCopied ? "Copied" : "Copy"}
                            placement="top"
                            arrow
                            classes={{
                                tooltip: "bg-gray-200 text-black",
                                arrow: "text-gray-200",
                            }}
                        >
                            <IconButton
                                aria-label="copy"
                                className="min-w-fit relative bottom-[2px]"
                            >
                                <ContentCopy className="text-lg cursor-pointer text-green1" />
                            </IconButton>
                        </Tooltip>
                    </CopyToClipboard>
                )}

                <Close
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

export default AlertSuccess
