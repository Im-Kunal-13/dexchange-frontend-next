import { useAppDispatch, useAppSelector } from "../../store/store"
import Blockies from "react-blockies"
import { loadAccount } from "../../api/interactions"
import { Button, MenuItem, Select, SelectChangeEvent } from "@mui/material"

const Navbar = () => {
    const dispatch = useAppDispatch()
    const { connection, chainId, account, balance } = useAppSelector(
        (state) => state.provider
    )

    const connectHandler = async () => {
        await loadAccount(connection, dispatch)
        localStorage.setItem("isWalletConnected", "true")
    }

    // Metamask method for handling chain change
    const networkHandler = async (e: SelectChangeEvent<string>) => {
        if (typeof window !== "undefined") {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: e.target.value }],
            })
        }
    }
    return (
        <div className="grid grid-cols-12 bg-bgGray1 h-[10vh] relative">
            <div className="px-[2em] flex col-span-4 bg-black">
                <img
                    src="/images/dexchange_logo.png"
                    className="logo"
                    alt="Dexchange Logo"
                />
            </div>

            <div className="col-start-5 col-end-7 top-[21.5px] right-[48px] absolute flex">
                {chainId && (
                    <Select
                        value={chainId ? `0x${chainId.toString(16)}` : `0`}
                        variant="standard"
                        name="networks"
                        MenuProps={{
                            classes: {
                                list: "text-white shadow",
                                paper: "rounded bg-bgGray2",
                            },
                        }}
                        id="networks"
                        onChange={networkHandler}
                        sx={{ color: "white" }}
                        classes={{
                            select: "w-36 text-white shadow-black1 py-3 px-4",
                            icon: "text-white transition-all duration-300 ",
                            nativeInput: "text-white",
                        }}
                        disableUnderline={true}
                    >
                        <MenuItem value="0" disabled>
                            Select Network
                        </MenuItem>
                        <MenuItem value="0x118" defaultChecked>
                            zkSync 2.0 Testnet
                        </MenuItem>
                        <MenuItem value="0x5">Goerli</MenuItem>
                        <MenuItem value="0x13881">Polygon Mumbai</MenuItem>
                    </Select>
                )}
            </div>

            <div className="bg-black absolute top-[25%] right-[24px] w-[400px] h-[48px] rounded flex shadow-black1">
                <p className="flex items-center gap-2.5 mx-auto">
                    <span className="text-sm text-textGray1 font-medium">
                        My Balance
                    </span>
                    {balance ? (
                        <span className="text-lg">
                            {Number(balance).toFixed(4)}
                        </span>
                    ) : (
                        <span className="text-lg">0 ETH</span>
                    )}
                </p>
                {account ? (
                    <a
                        href={`https://explorer.zksync.io/address/${account}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex justify-center items-center bg-bgGray2 border-none text-white m-0 rounded-tl-lg rounded-bl-lg rounded-tr rounded-br w-[182px] h-[48px] text-[16px] no-underline transition-all duration-300"
                    >
                        {account.slice(0, 5) + "..." + account.slice(38, 42)}
                        <Blockies
                            seed={account}
                            size={10}
                            scale={3}
                            color="#2187D0"
                            bgColor="#F1F2F9"
                            spotColor="#767F92"
                            className="identicon"
                        />
                    </a>
                ) : (
                    <Button
                        variant="contained"
                        className="flex justify-center items-center bg-bgGray2 text-white m-0 rounded-tl-lg rounded-bl-lg rounded w-[182px] h-[48px] text-[16px] no-underline transition-all duration-300 hover:bg-btnBlue1 border-none normal-case"
                        onClick={connectHandler}
                    >
                        Connect Wallet
                    </Button>
                )}
            </div>
        </div>
    )
}

export default Navbar
