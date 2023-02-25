import { Button, IconButton, MenuItem, Select, Tooltip } from "@mui/material"

import NorthIcon from "@mui/icons-material/North"
import CropFreeIcon from "@mui/icons-material/CropFree"
import DashboardIcon from "@mui/icons-material/Dashboard"
import DonutSmallIcon from "@mui/icons-material/DonutSmall"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import HelpIcon from "@mui/icons-material/Help"
import { useQueryClient, UseWallet } from "@sei-js/react"
import { useCallback, useEffect } from "react"
import { useAppPersistStore } from "@store/app"
import { RPC_URL, REST_URL } from "@constants/index"
import { formatUnits } from "ethers/lib/utils"

interface Props {
    seiWallet: UseWallet | null
}

const NavbarV2 = ({ seiWallet }: Props) => {
    const { provider, setProvider } = useAppPersistStore()

    let { queryClient, isLoading } = useQueryClient(REST_URL)

    const suggestChain = async () => {
        // @ts-ignore
        return window?.keplr.experimentalSuggestChain({
            chainId: "sei",
            chainName: "Sei Devnet",
            rpc: RPC_URL,
            rest: REST_URL,
            bip44: {
                coinType: 118,
            },
            bech32Config: {
                bech32PrefixAccAddr: "sei",
                bech32PrefixAccPub: "sei" + "pub",
                bech32PrefixValAddr: "sei" + "valoper",
                bech32PrefixValPub: "sei" + "valoperpub",
                bech32PrefixConsAddr: "sei" + "valcons",
                bech32PrefixConsPub: "sei" + "valconspub",
            },
            currencies: [
                {
                    coinDenom: "SEI",
                    coinMinimalDenom: "usei",
                    coinDecimals: 6,
                    coinGeckoId: "sei",
                },
            ],
            feeCurrencies: [
                {
                    coinDenom: "SEI",
                    coinMinimalDenom: "usei",
                    coinDecimals: 6,
                    coinGeckoId: "sei",
                    gasPriceStep: {
                        low: 0.01,
                        average: 0.025,
                        high: 0.04,
                    },
                },
            ],
            stakeCurrency: {
                coinDenom: "sei",
                coinMinimalDenom: "usei",
                coinDecimals: 6,
                coinGeckoId: "sei",
            },
        })
    }

    const getAccountBalance = useCallback(async () => {
        if (!isLoading && seiWallet?.offlineSigner && seiWallet?.chainId) {
            const accounts = await seiWallet?.offlineSigner?.getAccounts()

            // Query the account balance
            const accountBalance =
                await queryClient.cosmos.bank.v1beta1.allBalances({
                    address: accounts[0]?.address,
                })

            setProvider({
                ...provider,
                account: accounts[0]?.address,
                balances:
                    accountBalance?.balances?.length > 0
                        ? accountBalance?.balances?.map(
                              (balance: { denom: string; amount: string }) => ({
                                  ...balance,
                                  amount: formatUnits(
                                      balance?.amount,
                                      6
                                  ).toString(),
                              })
                          )
                        : [],

                chainId: seiWallet?.chainId,
            })
        }
    }, [isLoading, seiWallet?.offlineSigner, seiWallet?.chainId])

    const connectHandler = async () => {
        getAccountBalance()
    }

    useEffect(() => {
        if (!isLoading && seiWallet?.offlineSigner) {
            suggestChain()
            getAccountBalance()
        }
    }, [isLoading, seiWallet?.offlineSigner])

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
                    value={"usdc/sei"}
                    variant="standard"
                    classes={{
                        select: "focus:bg-transparent overflow-scroll",
                    }}
                    className="py-[18px] pl-[24px] shadow text-[14px] leading-[1.7] w-fit mx-auto max-w-full my-auto max-h-[73px]"
                    disableUnderline={true}
                    // onChange={marketHandler}
                    MenuProps={{
                        classes: {
                            paper: "bg-bgSidebarGray1 border border-white border-opacity-10 mt-1.5 rounded-xl w-[190px] max-h-[300px] overflow-y-scroll custom-scrollbar pl-2",
                        },
                    }}
                    IconComponent={() => (
                        <KeyboardArrowDownIcon className="text-white relative right-3 bottom-1" />
                    )}
                >
                    <MenuItem value={"usdc/sei"}>
                        <div className="flex gap-[16px] items-center">
                            <div className="relative">
                                <img
                                    src={`/images/sei.png`}
                                    className="w-[40px] min-w-[40px]"
                                    alt=""
                                />
                                <img
                                    src={`/images/USDC.png`}
                                    alt=""
                                    className="w-[20px] min-w-[20px] absolute -right-2 bottom-0"
                                />
                            </div>
                            <div className="flex flex-col items-start min-w-[86px]">
                                <span className="font-semibold text-[14px] text-white leading-[1.7]">
                                    SEI
                                </span>
                                <span className="text-textGray1 text-[14px] leading-[1.7] font-semibold">
                                    USDC
                                </span>
                            </div>
                        </div>
                    </MenuItem>
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
                    value={seiWallet?.chainId}
                    variant="standard"
                    classes={{
                        select: "focus:bg-transparent overflow-scroll py-[18px] pl-[24px] z-10",
                    }}
                    id="networks"
                    className=" shadow text-[14px] leading-[1.7]  w-fit mx-auto my-auto max-h-[73px]"
                    disableUnderline={true}
                    // onChange={networkHandler}
                    MenuProps={{
                        classes: {
                            paper: "bg-bgSidebarGray1 border border-white border-opacity-10 mt-1.5 rounded-xl w-fit max-h-[400px] overflow-y-scroll custom-scrollbar pl-2",
                        },
                    }}
                    IconComponent={() => (
                        <KeyboardArrowDownIcon className="text-white relative right-14 lg1350:right-9 xl1450:right-7 bottom-1" />
                    )}
                >
                    {seiWallet?.chainId && (
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
                            id: "sei",
                            name: "Sei Devnet",
                            chain: "Sei",
                        },
                    ].map(({ id, name, chain }) => (
                        <MenuItem value={id} key={id}>
                            <div className="flex gap-[16px] items-center">
                                <div
                                    className={
                                        "w-[40px] min-w-[40px] h-[40px] rounded-full flex items-center justify-center"
                                    }
                                >
                                    <img
                                        src={`/images/${id}.png`}
                                        className={`w-full h-full`}
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
                    {provider?.balances?.length > 0 ? (
                        `${Number(provider?.balances[0]?.amount).toFixed(
                            4
                        )} SEI`
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
                {provider?.account ? (
                    <a
                        href={`#`}
                        target="_blank"
                        rel="noreferrer"
                        className="normal-case bg-purple1 hover:bg-purple1 hover:bg-opacity-90 text-[14px] font-semibold transition-all w-[150px] h-[45px] rounded-lg flex items-center justify-center gap-2 text-white"
                    >
                        <span>
                            {provider?.account.slice(0, 5) +
                                "..." +
                                provider?.account.slice(38, 42)}
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
