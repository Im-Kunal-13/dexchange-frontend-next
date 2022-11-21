import { Box, Button, IconButton, Modal } from "@mui/material"
import { useAppStateContext } from "../../../context/contextProvider"
import CloseIcon from "@mui/icons-material/Close"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import Fade from "@mui/material/Fade"

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
}

const MetamaskModal = () => {
    // @ts-ignore
    const { metamaskModalActive, setMetamaskModalActive } = useAppStateContext()

    return (
        <Modal
            open={metamaskModalActive}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Fade in={metamaskModalActive}>
                <Box
                    sx={style}
                    className="max-w-[640px] w-[640px] h-[405px] rounded-[24px] bg-bgSidebarGray1 outline-none shadow relative border border-opacity-10 border-white"
                >
                    <IconButton
                        className="rounded-full absolute top-[24px] right-[32px] bg-white bg-opacity-10 hover:bg-opacity-10 hover:bg-white hover:scale-110 duration-300 transition-all p-3"
                        onClick={() => {
                            setMetamaskModalActive(false)
                        }}
                    >
                        <CloseIcon className="text-white text-base" />
                    </IconButton>
                    <div className="flex py-[40px] justify-between px-[60px] items-center">
                        <div className="flex flex-col mt-[16px]">
                            <div className="flex items-center gap-2.5 mt-[22px]">
                                <p className="text-white">
                                    Step 1 : Go to the Metamask website
                                </p>
                                <Button
                                    variant="contained"
                                    className="bg-purple1 hover:bg-purple1 hover:bg-opacity-80 min-w-[80px] w-[89px] h-[34px] text-[12px] normal-case leading-[1.25] tracking-tight font-bold"
                                    href="https://metamask.io/download/"
                                    target="_blank"
                                >
                                    Click here
                                </Button>
                            </div>
                            <p className="mt-[22px] text-white">
                                Step 2: Click on{" "}
                                <span className="text-purple1">
                                    Install Now
                                </span>
                            </p>
                            <p className="mt-[22px] text-white">
                                Step 3: Click on{" "}
                                <span className="text-purple1">
                                    Add to Browser
                                </span>
                            </p>
                            <p className="mt-[22px] text-white">
                                Step 4: Once Added, Click on Get Started
                            </p>
                        </div>
                        <img
                            className="w-[125px] h-fit relative top-7"
                            src="/images/metamask.png"
                        />
                    </div>
                    <div className="height-[100px] flex justify-between p-[40px] bg-purple1 absolute bottom-0 left-0 w-full rounded-br-[24px] rounded-bl-[24px]">
                        <div className="flex items-center gap-1">
                            <span className="text-white">
                                It takes just a few seconds to setup
                            </span>
                            <CheckBoxIcon className="text-textGreen1" />
                        </div>
                        <img
                            src="/images/dexchange_d.png"
                            className="w-10 h-fit relative right-[65px]"
                            alt=""
                        />
                    </div>
                </Box>
            </Fade>
        </Modal>
    )
}

export default MetamaskModal
