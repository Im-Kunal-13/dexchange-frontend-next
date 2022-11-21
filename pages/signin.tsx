import { Button, IconButton, Switch, Tooltip } from "@mui/material"
import LightModeIcon from "@mui/icons-material/LightMode"
import PrivacyTipOutlinedIcon from "@mui/icons-material/PrivacyTipOutlined"
import MetamaskModal from "../components/Core/Modal/MetamaskModal"
import { useAppStateContext } from "../context/contextProvider"
import { useEffect, useState } from "react"
import ReplyAllIcon from "@mui/icons-material/ReplyAll"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import { useAppDispatch, useAppSelector } from "../store/store"
import { loadProvider, loadNetwork, loadAccount } from "../api/interactions"
import AlertWarning from "../components/Alerts/AlertWarning"
import AlertInfo from "../components/Alerts/AlertInfo"
import AlertSuccess from "../components/Alerts/AlertSuccess"
import AlertError from "../components/Alerts/AlertError"
import AlertLoading from "../components/Alerts/AlertLoading"

const signin = () => {
    // @ts-ignore
    const { setSnackbarInfo, setMetamaskModalActive } = useAppStateContext()

    const dispatch = useAppDispatch()

    const { account } = useAppSelector((state) => state.provider)

    const [loginState, setLoginState] = useState("1")
    const [selectedOption, setSelectedOption] = useState("")

    const [clipboardTitle, setClipboardTitle] = useState("Copy to clipboard")

    useEffect(() => {
        if (selectedOption === "metamask") {
            setLoginState("2")

            if (typeof window.ethereum !== "undefined") {
                const provider: any = loadProvider(dispatch)
                loadNetwork(provider, dispatch)

                loadAccount(provider, dispatch)
            } else {
                setSnackbarInfo({
                    open: true,
                    message: "You don't have metamask installed !",
                })
                setMetamaskModalActive(true)
            }
        }
    }, [selectedOption])

    return (
        <div className="flex min-h-screen bg-bgBlack1 relative">
            <IconButton className="absolute top-[30px] right-[40px] bg-white bg-opacity-10 hover:bg-opacity-10 hover:bg-white hover:scale-110 duration-300 transition-all p-3">
                <LightModeIcon className="text-white text-base" />
            </IconButton>
            <div className="w-[44%] transition-all duration-500 bg-purple1 rounded-tr-xl rounded-br-xl"></div>
            <div className="w-[56%] flex flex-col items-center justify-center max-w-[412px] mx-auto relative">
                {loginState === "1" && selectedOption === "" ? (
                    <>
                        <div className="flex items-center mb-[16px]">
                            <h2 className="text-[32px] leading-[1.25] tracking-[-.5px] font-medium text-white">
                                Sign in to Dexchange
                            </h2>
                            <IconButton className="text-2xl text-textGray1 hover:text-purple1 transition-all duration-300 hover:scale-105">
                                <PrivacyTipOutlinedIcon />
                            </IconButton>
                        </div>
                        <h6 className="text-[18px] leading-[1.25] tracking-[-.5px] font-medium text-white relative right-1 mb-[20px]">
                            Select your wallet to continue
                        </h6>
                        <div className="flex flex-col gap-[15px] items-center mt-[15px] mb-[40px]">
                            <Button
                                className="w-[290px] h-[52px] relative normal-case bg-bgSidebarGray1 rounded-[10px] transition-all duration-300 border-[2px] hover:border-[2px] border-white border-opacity-5 hover:border-opacity-70 hover:border-purple1 text-textGray1 hover:text-purple1 hover:scale-105"
                                variant="outlined"
                                onClick={() => setSelectedOption("metamask")}
                            >
                                <img
                                    className="w-[20px] absolute top-0 bottom-0 left-10 m-auto"
                                    src="/images/metamask.png"
                                />
                                <span className="text-[14px] font-medium leading-[140%] tracking-wider">
                                    Metamask
                                </span>
                            </Button>
                            <Button
                                className="w-[290px] h-[52px] relative normal-case bg-bgSidebarGray1 rounded-[10px] transition-all duration-300 border-[2px] hover:border-[2px] border-white border-opacity-5 hover:border-opacity-70 hover:border-purple1 text-textGray1 hover:text-purple1 hover:scale-105"
                                variant="outlined"
                                onClick={() => setSelectedOption("coinbase")}
                            >
                                <img
                                    className="w-[20px] absolute top-0 bottom-0 left-10 m-auto"
                                    src="/images/coinbase.png"
                                />
                                <span className="text-[14px] font-medium leading-[140%] tracking-wider">
                                    Coinbase
                                </span>
                            </Button>
                            <Button
                                className="w-[290px] h-[52px] relative normal-case bg-bgSidebarGray1 rounded-[10px] transition-all duration-300 border-[2px] hover:border-[2px] border-white border-opacity-5 hover:border-opacity-70 hover:border-purple1 text-textGray1 hover:text-purple1 hover:scale-105"
                                variant="outlined"
                                onClick={() =>
                                    setSelectedOption("wallet_connect")
                                }
                            >
                                <img
                                    className="w-[20px] absolute top-0 bottom-0 left-10 m-auto"
                                    src="/images/wallet_connect.png"
                                />
                                <span className="text-[14px] font-medium leading-[140%] tracking-wider">
                                    Wallet Connect
                                </span>
                            </Button>
                        </div>
                        <div className="flex items-center ">
                            <span className="leading-[1.25] tracking-[-.5px] font-bold text-white text-[13px]">
                                Don't have a wallet ?
                            </span>
                            <Button
                                variant="text"
                                className="text-purple1 normal-case leading-[1.25] tracking-[-.5px] font-bold text-[13px] hover:underline"
                                onClick={() => {
                                    setMetamaskModalActive(true)
                                }}
                            >
                                Click Here
                            </Button>
                        </div>
                        <p className="mt-[20px] text-textGray1 text-center mb-[32px] text-[13px] font-medium leading-[1.3]">
                            By logging in with any of the options above, you
                            acknowledge that you have read, understood, and
                            agree to the{" "}
                            <a className="text-purple1">
                                {" "}
                                Terms and Privacy policy
                            </a>
                        </p>
                    </>
                ) : (
                    <>
                        <Button
                            variant="text"
                            className="absolute top-[30px] -left-[120px] hover:bg-transparent duration-300 transition-all p-3 normal-case text-textGray1 hover:text-white"
                            startIcon={<ReplyAllIcon />}
                            onClick={() => {
                                setSelectedOption("")
                                setLoginState("1")
                            }}
                        >
                            Back
                        </Button>
                        <h2 className="text-[32px] leading-[1.25] tracking-[-.5px] font-medium text-white mb-[20px]">
                            Sign in to Dexchange
                        </h2>
                        <img
                            src={`/images/${selectedOption}.png`}
                            className="max-w-[150px] my-[10px]"
                            alt=""
                        />
                        <h6 className="text-[14px] mt-[40px] mb-[20px] max-w-[380px] font-medium text-textGray1">
                            Great to have you here. Let's start trading right
                            away !
                        </h6>
                        <Tooltip
                            title={clipboardTitle}
                            arrow
                            classes={{
                                tooltip: "bg-bgLightGray1",
                                arrow: "before:bg-bgLightGray1",
                            }}
                            onMouseLeave={() => {
                                setTimeout(() => {
                                    setClipboardTitle("Copy to clipboard")
                                }, 500)
                            }}
                        >
                            <Button
                                className="flex items-center gap-2 py-2.5 bg-white hover:bg-white hover:bg-opacity-10 bg-opacity-5 h-[47px] px-[22px] rounded-xl"
                                onClick={() => {
                                    if (account) {
                                        navigator.clipboard.writeText(account)
                                        setClipboardTitle("Copied !")
                                    }
                                }}
                            >
                                {account ? (
                                    <span className="leading-[1.25] tracking-[-.5px] text-white font-semibold text-[14px]">
                                        {account.slice(0, 14) +
                                            "..." +
                                            account.slice(-4)}
                                    </span>
                                ) : (
                                    <>
                                        <FiberManualRecordIcon className="text-red1 text-[16px]" />
                                        <span className="leading-[1.25] tracking-[-.5px] text-white font-semibold text-[14px] normal-case">
                                            Not connected
                                        </span>
                                    </>
                                )}
                            </Button>
                        </Tooltip>
                        <div className="bg-purple1 bg-opacity-10 py-[10px] pl-[15px] pr-[18px] rounded-xl mt-[24px] mb-[20px] flex items-center gap-2 border-2 border-purple1 border-opacity-50">
                            <Switch
                                className="transition-all duration-300 scale-[125%]"
                                classes={{
                                    thumb: "bg-white",
                                    track: "bg-white",
                                }}
                            />
                            <span className="text-white text-[14px] font-medium">
                                Verify you're a human
                            </span>
                        </div>
                        <Button
                            variant="contained"
                            className="bg-purple1 hover:bg-purple1 hover:bg-opacity-80 normal-case w-full rounded-xl text-[14px] font-semibold h-[48px] mb-[20px]"
                        >
                            Get Started
                        </Button>
                        <div className="flex items-center ">
                            <span className="leading-[1.25] tracking-[-.5px] font-bold text-white text-[13px]">
                                Don't have a wallet ?
                            </span>
                            <Button
                                variant="text"
                                className="text-purple1 normal-case leading-[1.25] tracking-[-.5px] font-bold text-[13px] hover:underline"
                                onClick={() => {
                                    setMetamaskModalActive(true)
                                }}
                            >
                                Click Here
                            </Button>
                        </div>
                    </>
                )}
            </div>

            <MetamaskModal />
            {/* Alerts */}
            <AlertWarning />
            <AlertInfo />
            <AlertSuccess />
            <AlertError />
            <AlertLoading />
        </div>
    )
}

export default signin
