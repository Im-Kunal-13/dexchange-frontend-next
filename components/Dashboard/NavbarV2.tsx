import {
    Button,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    Tooltip,
} from "@mui/material"

import NorthIcon from "@mui/icons-material/North"
import CropFreeIcon from "@mui/icons-material/CropFree"
import DashboardIcon from "@mui/icons-material/Dashboard"
import DonutSmallIcon from "@mui/icons-material/DonutSmall"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import HelpIcon from "@mui/icons-material/Help"
import { useAppDispatch, useAppSelector } from "../../store/store"
import { loadAccount, loadTokens } from "../../api/interactions"
import { useQueryClient, useSigningClient, useWallet } from "@sei-js/react"
import { StdFee } from "@cosmjs/stargate"
import { useCallback, useEffect } from "react"
import { actions } from "../../features/reducerActions"

const contractAddr =
    "sei14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sh9m79m"

const chainConfig = {
    chainId: "atlantic-1",
    rpcUrl: "https://rpc.sei.autonomy.network/",
    restUrl: "https://lcd.sei.autonomy.network/",
}

const fee: StdFee = {
    amount: [
        {
            denom: "usei",
            amount: "2000",
        },
    ],
    gas: "200000",
}

const NavbarV2 = () => {
    const dispatch = useAppDispatch()

    // @ts-ignore
    const seiWallet = useWallet(window, {
        inputWallet: "keplr",
        autoConnect: true,
        chainConfiguration: chainConfig,
    })

    const { queryClient, isLoading } = useQueryClient(chainConfig.restUrl)

    const { signingClient } = useSigningClient(
        chainConfig.rpcUrl,
        seiWallet?.offlineSigner
    )

    const { connection, chainId, account, balance } = useAppSelector(
        (state) => state.provider
    )
    const { pair, symbols } = useAppSelector((state) => state.tokens)

    const marketHandler = async (e: SelectChangeEvent<`${any},${any}`>) => {
        console.log(e.target.value.split("-")[0])
        loadTokens(
            connection,
            [
                pair.pairs[e.target.value].baseAssetAddress,
                pair.pairs[e.target.value].quoteAssetAddress,
            ],
            e.target.value.split("-"),
            dispatch
        )
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

    // Gets the account balance
    const getAccountBalance = useCallback(async () => {
        if (!isLoading && seiWallet !== null) {
            const accounts = await seiWallet?.offlineSigner?.getAccounts()
            console.log("account address", accounts)

            if (accounts) {
                dispatch(actions.load_account(accounts[0]?.address))
            }

            // Check whether account exist in blockchain or not
            const account = await queryClient?.sei?.auth?.v1beta1?.account({
                address: accounts[0].address,
            })

            console.log("account info", account)

            // Query the account balance
            const accountBalance =
                await queryClient?.sei?.bank?.v1beta1.allBalances({
                    address: accounts ? accounts[0].address : null,
                })
            console.log("account Balance", accountBalance)
        }
    }, [isLoading])

    const getShorBookAllQuery = useCallback(async () => {
        if (!isLoading) {
            const query =
                await queryClient.seiprotocol.seichain.dex.shortBookAll({
                    contractAddr: contractAddr,
                    priceDenom: "USDC",
                    assetDenom: "SEI",
                })
            console.log("get short book query", query)
        }
    }, [isLoading])

    const getLongBookAllQuery = useCallback(async () => {
        if (!isLoading) {
            const query =
                await queryClient.seiprotocol.seichain.dex.longBookAll({
                    contractAddr: contractAddr,
                    priceDenom: "USDC",
                    assetDenom: "SEI",
                })
            console.log("get long book query", query)
        }
    }, [isLoading])

    // const getOrdersOfAccount = useCallback(async () => {
    //     if (!isLoading) {
    //         const query = await queryClient.seiprotocol.seichain.dex.getOrders({
    //             contractAddr: contractAddr,
    //             account: address,
    //         })
    //         console.log("Get orders of the account", query)
    //     }
    // }, [isLoading])

    const connectHandler = async () => {
        getAccountBalance()
    }

    useEffect(() => {
        if (!isLoading && seiWallet) {
            dispatch(actions.load_network(seiWallet?.chainId))
        }
    }, [seiWallet])

    useEffect(() => {
        getAccountBalance()
    }, [])

    return (
        <div
            className="grid grid-cols-7 h-[92px] bg-bgSidebarGray1 border-b border-white border-opacity-10 fixed top-0 z-10"
            style={{ width: "calc(100vw - 95px)" }}
        >
            <div className="flex items-center w-full border-r border-r-white border-opacity-10">
                <Select
                    // @ts-ignore
                    value={symbols[0] ? symbols.join("-") : `pair_default`}
                    variant="standard"
                    classes={{
                        select: "focus:bg-transparent overflow-scroll",
                    }}
                    className="py-[18px] pl-[24px] shadow text-[14px] leading-[1.7] w-fit mx-auto max-w-full my-auto max-h-[73px]"
                    disableUnderline={true}
                    onChange={marketHandler}
                    MenuProps={{
                        classes: {
                            paper: "bg-bgSidebarGray1 border border-white border-opacity-10 mt-1.5 rounded-xl w-[190px] max-h-[300px] overflow-y-scroll custom-scrollbar pl-2",
                        },
                    }}
                    IconComponent={() => (
                        <KeyboardArrowDownIcon className="text-white relative right-3 bottom-1" />
                    )}
                >
                    {!symbols[0] && (
                        <MenuItem value={"pair_default"} key={"pair_default"}>
                            <div className="flex gap-[16px] items-center">
                                <div className="relative">
                                    <HelpIcon className="text-[40px] text-btcYellow" />
                                    <HelpIcon className="text-[20px] text-blue1 absolute -right-2 bottom-0" />
                                </div>
                                <div className="flex flex-col items-start min-w-[86px]">
                                    <span className="font-semibold text-[14px] text-white leading-[1.7]">
                                        Token
                                    </span>
                                    <span className="text-textGray1 text-[14px] leading-[1.7] font-semibold">
                                        ? / ?
                                    </span>
                                </div>
                            </div>
                        </MenuItem>
                    )}

                    {pair?.pairs &&
                        Object.keys(pair.pairs).map((key) => (
                            <MenuItem value={key} key={key}>
                                <div className="flex gap-[16px] items-center">
                                    <div className="relative">
                                        <img
                                            src={`/images/${
                                                key.split("-")[0]
                                            }.png`}
                                            className="w-[40px] min-w-[40px]"
                                            alt=""
                                        />
                                        <img
                                            src={`/images/${
                                                key.split("-")[1]
                                            }.png`}
                                            alt=""
                                            className="w-[20px] absolute -right-2 bottom-0"
                                        />
                                    </div>
                                    <div className="flex flex-col items-start min-w-[86px]">
                                        <span className="font-semibold text-[14px] text-white leading-[1.7]">
                                            {key.split("-")[0] === "BTC"
                                                ? "Bitcoin"
                                                : key.split("-")[0]}
                                        </span>
                                        <span className="text-textGray1 text-[14px] leading-[1.7] font-semibold">
                                            {key.split("-").join(" / ")}
                                        </span>
                                    </div>
                                </div>
                            </MenuItem>
                        ))}
                </Select>
            </div>
            <div className="py-[18px] pl-[24px] shadow text-[14px] leading-[1.7] flex flex-col gap-1 border-r border-r-white border-opacity-10 w-full my-auto max-h-[73px]">
                <p className="text-[12px] leading-[1.3] font-semibold text-textGray1">
                    Last price
                </p>
                <p className="text-[14px] leading-[1.3] font-semibold text-textGreen1 uppercase">
                    32,000 USDC
                </p>
            </div>
            <div className="py-[18px] pl-[24px] shadow text-[14px] leading-[1.7] flex flex-col gap-1 border-r border-r-white border-opacity-10 w-full my-auto max-h-[73px]">
                <p className="text-[12px] leading-[1.3] font-semibold text-textGray1">
                    24h change
                </p>
                <p className="text-[14px] leading-[1.3] font-semibold text-textGreen1 uppercase">
                    <NorthIcon className="text-base text-textGreen1" /> +6.67%
                </p>
            </div>
            <div className="flex items-center w-full border-r border-r-white border-opacity-10">
                <Select
                    value={
                        chainId ? `0x${chainId.toString(16)}` : `chain_default`
                    }
                    variant="standard"
                    classes={{
                        select: "focus:bg-transparent overflow-scroll py-[18px] pl-[24px] z-10",
                    }}
                    id="networks"
                    className=" shadow text-[14px] leading-[1.7]  w-fit mx-auto my-auto max-h-[73px]"
                    disableUnderline={true}
                    onChange={networkHandler}
                    MenuProps={{
                        classes: {
                            paper: "bg-bgSidebarGray1 border border-white border-opacity-10 mt-1.5 rounded-xl w-fit max-h-[400px] overflow-y-scroll custom-scrollbar pl-2",
                        },
                    }}
                    IconComponent={() => (
                        <KeyboardArrowDownIcon className="text-white relative right-7" />
                    )}
                >
                    {!chainId && (
                        <MenuItem value={"chain_default"} key={"chain_default"}>
                            <div className="flex gap-[16px] items-center">
                                <div
                                    className={
                                        "w-[40px] min-w-[40px] h-[40px] rounded-full flex items-center justify-center"
                                    }
                                >
                                    <HelpIcon className="text-[40px] text-btcYellow" />
                                </div>

                                <div className="flex flex-col items-start min-w-[86px]">
                                    <span className="font-semibold text-[14px] text-white leading-[1.7]">
                                        Chain ?
                                    </span>
                                    <span className="text-textGray1 text-[14px] leading-[1.7] font-semibold overflow-visible">
                                        Network ?
                                    </span>
                                </div>
                            </div>
                        </MenuItem>
                    )}
                    {[
                        {
                            id: 5,
                            name: "Goerli",
                            chain: "Ethereum",
                        },
                        {
                            id: 280,
                            name: "zkSync 2.0",
                            chain: "Ethereum",
                        },
                        {
                            id: 80001,
                            name: "Mumbai",
                            chain: "Polygon",
                        },
                        {
                            id: 1402,
                            name: "Hermez",
                            chain: "Polygon",
                        },
                        {
                            id: 534354,
                            name: "Scroll",
                            chain: "Ethereum",
                        },
                    ].map(({ id, name, chain }) => (
                        <MenuItem value={`0x${id.toString(16)}`} key={id}>
                            <div className="flex gap-[16px] items-center">
                                <div
                                    className={
                                        "w-[40px] min-w-[40px] h-[40px] rounded-full bg-blue1 flex items-center justify-center"
                                    }
                                >
                                    <img
                                        src={`/images/0x${id.toString(16)}.png`}
                                        className={`${
                                            id === 5 && "h-5"
                                        } max-w-[20px]`}
                                        alt=""
                                    />
                                </div>

                                <div className="flex flex-col items-start min-w-[86px]">
                                    <span className="font-semibold text-[14px] text-white leading-[1.7]">
                                        {chain}
                                    </span>
                                    <span className="text-textGray1 text-[14px] leading-[1.7] font-semibold overflow-visible">
                                        {name}
                                    </span>
                                </div>
                            </div>
                        </MenuItem>
                    ))}
                </Select>
            </div>
            <div className="py-[18px] shadow text-[14px] leading-[1.7] border-r border-r-white border-opacity-10 w-full my-auto max-h-[73px] flex items-center gap-[5px] justify-center">
                <Tooltip
                    title="Help center"
                    arrow
                    classes={{ tooltip: "h-[25px] max-h-[25px]" }}
                >
                    <IconButton>
                        <DonutSmallIcon className="text-[24px] text-textGray1" />
                    </IconButton>
                </Tooltip>
                <Tooltip
                    title="Enter full screen"
                    arrow
                    classes={{ tooltip: "h-[25px] max-h-[25px]" }}
                >
                    <IconButton>
                        <CropFreeIcon className="text-[24px] text-textGray1" />{" "}
                    </IconButton>
                </Tooltip>
                <Tooltip
                    title="Change layout"
                    arrow
                    classes={{ tooltip: "h-[25px] max-h-[25px]" }}
                >
                    <IconButton>
                        <DashboardIcon className="text-[24px] text-textGray1" />{" "}
                    </IconButton>
                </Tooltip>
            </div>
            <div className="py-[18px] pl-[24px] shadow text-[14px] leading-[1.7] flex flex-col gap-1 border-r border-r-white border-opacity-10 w-full my-auto max-h-[73px]">
                <p className="text-[12px] leading-[1.3] font-semibold text-textGray1">
                    My balance
                </p>
                <p className="text-[14px] leading-[1.3] font-semibold text-purple1 uppercase">
                    {balance ? (
                        `${Number(balance).toFixed(4)} ETH`
                    ) : (
                        <span className="flex items-center gap-1">
                            <FiberManualRecordIcon className="text-red1 text-[14px]" />
                            <span className="text-[12px] leading-[1.3] font-semibold text-white normal-case">
                                Not connected
                            </span>
                        </span>
                    )}
                </p>
            </div>
            <div className="py-[18px] shadow text-[14px] leading-[1.7] flex items-center justify-center gap-1 border-r border-r-white border-opacity-10 w-full my-auto max-h-[73px]">
                {account ? (
                    <a
                        href={`${pair?.blockExplorerUrl}/address/${account}`}
                        target="_blank"
                        rel="noreferrer"
                        className="normal-case bg-purple1 hover:bg-purple1 hover:bg-opacity-90 text-[14px] font-semibold transition-all w-[150px] h-[45px] rounded-lg flex items-center justify-center gap-2 text-white"
                    >
                        <span>
                            {account.slice(0, 5) +
                                "..." +
                                account.slice(38, 42)}
                        </span>
                        <img
                            className="w-[22.5px] h-fit"
                            src="/images/kepler.png"
                        />
                    </a>
                ) : (
                    <Button
                        variant="contained"
                        className="normal-case bg-purple1 hover:bg-purple1 hover:bg-opacity-90 text-[14px] font-semibold transition-all w-[150px] h-[45px] rounded-lg"
                        onClick={connectHandler}
                    >
                        Connect Wallet
                    </Button>
                )}
            </div>
        </div>
    )
}

export default NavbarV2
