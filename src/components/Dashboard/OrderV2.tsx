import { useCallback, useEffect, useState } from "react"
import {
    Button,
    FormHelperText,
    IconButton,
    MenuItem,
    Select,
    TextField,
} from "@mui/material"
import RefreshIcon from "@mui/icons-material/Refresh"
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import { InputAdornment } from "@material-ui/core"
import { useAppPersistStore, useAppUiStore } from "@store/app"
import Long from "long"
import { useQueryClient, useSigningClient, UseWallet } from "@sei-js/react"
import { StdFee } from "@cosmjs/stargate"
import { RPC_URL, CONTRACT_ADDRESS, REST_URL } from "@constants/index"
import { formatUnits } from "ethers/lib/utils"
import moment from "moment"
import { isStringValidNumber } from "@components/utility/isStringValidNumber"
import axiosConfig from "src/config/axiosConfig"
import { IProvider } from "../../types/index"
import { showNotification, updateNotification } from "@mantine/notifications"
import { CheckCircleRounded, ErrorRounded } from "@mui/icons-material"

const fee: StdFee = {
    amount: [
        {
            denom: "usei",
            amount: "2000",
        },
    ],
    gas: "200000",
}

interface Props {
    seiWallet: UseWallet | null
}

const OrderV2 = ({ seiWallet }: Props) => {
    const { provider, setProvider } = useAppPersistStore()

    const [contractBalances, setContractBalances] =
        useState<IProvider["balances"]>()

    const [isMarket, setIsMarket] = useState(false)
    const [isBuy, setIsBuy] = useState(true)
    const [amount, setAmount] = useState("")
    const [price, setPrice] = useState("")

    const { signingClient } = useSigningClient(
        RPC_URL,
        seiWallet?.offlineSigner
    )

    let { queryClient, isLoading } = useQueryClient(REST_URL)

    const getAccountBalance = useCallback(async () => {
        if (!isLoading && seiWallet?.offlineSigner && seiWallet?.chainId) {
            const accounts = await seiWallet?.offlineSigner?.getAccounts()

            // Query the account balance
            const accountBalance =
                await queryClient.cosmos.bank.v1beta1.allBalances({
                    address: accounts[0]?.address,
                    // address: "sei14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sh9m79m",
                })

            console.log({ contractBalances: accountBalance })

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

    const getContractBalance = useCallback(async () => {
        if (!isLoading && seiWallet?.offlineSigner && seiWallet?.chainId) {
            // Query the contract balance
            const contractBal =
                await queryClient.cosmos.bank.v1beta1.allBalances({
                    address:
                        "sei14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sh9m79m",
                })

            setContractBalances(
                contractBal?.balances?.length > 0
                    ? contractBal?.balances?.map(
                          (balance: { denom: string; amount: string }) => ({
                              ...balance,
                              amount: formatUnits(
                                  balance?.amount,
                                  6
                              ).toString(),
                          })
                      )
                    : []
            )
        }
    }, [isLoading, seiWallet?.offlineSigner, seiWallet?.chainId])

    const msgPlaceOrder = async () => {
        let msgOrder = {
            typeUrl: "/seiprotocol.seichain.dex.MsgPlaceOrders",
            value: {
                creator: provider?.account,
                funds: [
                    {
                        denom: isBuy ? "uusdc" : "usei",
                        amount: isBuy
                            ? (
                                  Number(amount) *
                                  Number(price) *
                                  1000000
                              ).toString()
                            : (Number(amount) * 1000000).toString(),
                    },
                ], // Check this  update to uusdc
                contractAddr: CONTRACT_ADDRESS,
                orders: [
                    {
                        id: Long.fromNumber(0),
                        status: 0,
                        account: provider?.account,
                        contractAddr: CONTRACT_ADDRESS,
                        price: isMarket
                            ? "1000000000000000000"
                            : (Number(price) * 1000000000000000000).toString(), // check the prices in orderbook  1 * 10 ^ 18
                        quantity: (
                            Number(amount) * 1000000000000000000
                        ).toString(), // 1 * 10 ^ 18
                        priceDenom: "USDC",
                        assetDenom: "SEI",
                        orderType: isMarket ? 1 : 0, // 0 -Limit, 1 - Market
                        positionDirection: isBuy ? 0 : 1, // Check this 0 - Long, 1 - Short
                        data: '{"leverage":"1","position_effect":"Open"}',
                        statusDescription: "",
                    },
                ],
            },
        }

        showNotification({
            id: "placing-order",
            loading: true,
            title: "User notification",
            message: "Placing your order . . .",
            autoClose: false,
            classNames: {
                root: "bg-alertBgBlue py-5 text-alertTextBlue rounded overflow-hidden shadow-black1 min-w-[275px] border-none px-[18px]",
                loader: "stroke-[#3453FF] h-[24px]",
                title: "text-white",
                description: "text-alertTextBlue",
                closeButton:
                    "rounded-full hover:rounded-full hover:bg-alertTextBlue transition-all hover:text-alertBgBlue",
                icon: "bg-transparent",
            },
            // styles: () => ({
            //     root: {
            //         zIndex: 1000000000,
            //         width: "300px",
            //         padding: "12.5px 5px 20px 22px",
            //         "&::before": { backgroundColor: "#3453FF" },
            //         border: "2px solid rgb(52, 83, 255, .25)",
            //     },
            // }),
        })

        const res = await signingClient.signAndBroadcast(
            provider?.account,
            [msgOrder],
            fee,
            "test msg place order"
        )

        getAccountBalance()
        getContractBalance()

        if (res?.code === 0) {
            updateNotification({
                id: "placing-order",
                title: "Transaction Successfull",
                classNames: {
                    root: "bg-alertBgGreen py-5 text-alertTextGreen rounded overflow-hidden shadow-black1 min-w-[275px] border-none px-[18px]",
                    title: "text-white",
                    description: "text-alertTextGreen",
                    closeButton:
                        "rounded-full hover:rounded-full hover:bg-alertTextGreen transition-all hover:text-alertBgGreen",
                    icon: "bg-transparent",
                },
                message:
                    "tx hash : " + res.transactionHash.slice(0, 15) + "...",
                icon: (
                    <CheckCircleRounded
                        className="text-green1"
                        style={{ fontSize: "28px" }}
                    />
                ),
                styles: () => ({
                    icon: {
                        backgroundColor: "transparent",
                    },
                }),
                autoClose: false,
            })

            // Inserting transaction in the db
            await axiosConfig({
                method: "post",
                url: "/api/trades",
                data: {
                    amount,
                    date: moment().toString(),
                    price,
                    txHash: res.transactionHash,
                    side: isBuy ? "buy" : "sell",
                    address: provider?.account,
                },
            })
        } else {
            updateNotification({
                id: "placing-order",
                title: "Transaction Failed",
                classNames: {
                    root: "bg-alertBgRed py-5 text-alertTextRed rounded overflow-hidden shadow-black1 min-w-[275px] border-none px-[18px]",
                    title: "text-white",
                    description: "text-alertTextRed",
                    closeButton:
                        "rounded-full hover:rounded-full hover:bg-alertTextRed transition-all hover:text-alertBgRed",
                    icon: "bg-transparent",
                },
                message:
                    "tx hash : " + res.transactionHash.slice(0, 15) + "...",
                icon: (
                    <ErrorRounded
                        className="text-alertRed"
                        style={{ fontSize: "28px" }}
                    />
                ),
                styles: () => ({
                    icon: {
                        backgroundColor: "transparent",
                    },
                }),
                autoClose: false,
            })
        }
    }

    useEffect(() => {
        getContractBalance()
    }, [isLoading, seiWallet?.offlineSigner, seiWallet?.chainId])

    return (
        <div>
            <div className="flex items-center gap-2">
                <Button
                    variant="text"
                    className={`normal-case text-[13px] font-semibold text-textGreen1 ${
                        isBuy && "bg-white bg-opacity-10"
                    }  rounded-full w-full h-[37.5px] hover:bg-white hover:bg-opacity-20 border border-white`}
                    onClick={() => setIsBuy(true)}
                >
                    Buy
                </Button>
                <Button
                    variant="text"
                    className={`normal-case text-[13px] font-semibold text-alertRed rounded-full w-full h-[37.5px] ${
                        !isBuy && "bg-white bg-opacity-10"
                    } hover:bg-white hover:bg-opacity-20`}
                    onClick={() => setIsBuy(false)}
                >
                    Sell
                </Button>
            </div>
            <div className="bg-textGreen1 bg-opacity-25 flex flex-col gap-[6px] mt-[24px] rounded-xl py-[20px] px-[24px]">
                <h6 className="text-[10px] font-bold leading-[1] trackig-widest uppercase text-textGray1">
                    WALLET BALANCE
                </h6>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-[3px]">
                        {provider.balances.map((token) => (
                            <p
                                className="text-[12px] text-white font-bold leading-[1.6] trackig-widest"
                                key={token?.denom}
                            >
                                {token?.amount} -{" "}
                                {token?.denom.slice(1).toUpperCase()}
                            </p>
                        ))}
                    </div>
                    <IconButton
                        className="rounded-full rotate-0 hover:rotate-[45deg] transition-all duration-300 bg-white bg-opacity-10 hover:bg-black hover:bg-opacity-20 relative bottom-[2px]"
                        onClick={() => {}}
                    >
                        <RefreshIcon className="text-white text-2xl" />
                    </IconButton>
                </div>
            </div>

            <div className="bg-purple1 bg-opacity-25 flex flex-col gap-[6px] mt-[24px] rounded-xl py-[20px] px-[24px]">
                <h6 className="text-[10px] font-bold leading-[1] trackig-widest uppercase text-textGray1">
                    CONTRACT BALANCE
                </h6>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-[3px]">
                        {/* @ts-ignore */}
                        {contractBalances &&
                            contractBalances.map((token) => (
                                <p
                                    className="text-[12px] text-white font-bold leading-[1.6] trackig-widest"
                                    key={token?.denom}
                                >
                                    {token?.amount} -{" "}
                                    {token?.denom.slice(1).toUpperCase()}
                                </p>
                            ))}
                    </div>
                    <IconButton
                        className="rounded-full rotate-0 hover:rotate-[45deg] transition-all duration-300 bg-white bg-opacity-10 hover:bg-black hover:bg-opacity-20 relative bottom-[2px]"
                        onClick={() => {}}
                    >
                        <RefreshIcon className="text-white text-2xl" />
                    </IconButton>
                </div>
            </div>
            <Select
                value={isMarket ? "market" : "limit"}
                variant="standard"
                name="markets"
                id="markets"
                className="bg-bgSidebarGray1 border border-white border-opacity-10 overflow-hidden mt-[20px] rounded-[12px] tracking-[1px] uppercase w-full px-[15px]"
                MenuProps={{
                    classes: {
                        list: "text-white shadow",
                        paper: "rounded bg-bgSidebarGray1 mt-2 shadow rounded-[12px] text-[10px] w-[295px] border border-white border-opacity-10",
                        root: "left-[22px] border-none",
                    },
                }}
                onChange={(e) => {
                    setIsMarket(e.target.value === "market")
                }}
                sx={{ color: "white" }}
                classes={{
                    select: "w-full text-white focus:bg-transparent border-none font-semibold cursor-pointer relative py-[20px] px-[10px] text-[10px] font-semibold text-textGray1",
                    icon: "text-white transition-all duration-300 relative right-2.5",
                }}
                disableUnderline={true}
                IconComponent={() => (
                    <span className="flex items-center gap-[-2px]">
                        <HorizontalRuleIcon className="rotate-90 text-textGray1" />{" "}
                        <KeyboardArrowDownIcon className="relative right-1" />
                    </span>
                )}
            >
                <MenuItem
                    value="limit"
                    className="px-6 font-medium"
                    classes={{ selected: "text-purple1" }}
                >
                    Limit
                </MenuItem>
                <MenuItem
                    value="market"
                    className="px-6 font-medium"
                    classes={{ selected: "text-purple1" }}
                >
                    Market
                </MenuItem>
            </Select>
            <TextField
                id="amount"
                placeholder={"0.0000"}
                type="string"
                value={amount}
                autoComplete="off"
                onChange={(e) => {
                    // handleInput(e.target.value, true, setAmount)
                    if (isStringValidNumber(e?.target?.value)) {
                        setAmount(e?.target?.value)
                    }
                }}
                variant="standard"
                label={
                    <span className="relative text-[15px] font-semibold text-textGray1">
                        AMOUNT
                    </span>
                }
                InputLabelProps={{
                    shrink: true,
                    className: "text-black mt-[14px] ml-[23px]",
                }}
                InputProps={{
                    className: "text-white focus:normal-case font-semibold",
                    disableUnderline: true,
                    inputProps: { min: 0 },
                    endAdornment: (
                        <InputAdornment position="end">
                            <span
                                className={`${
                                    isBuy ? "text-textGreen1" : "text-alertRed"
                                } relative bottom-2 font-semibold text-[14px]`}
                            >
                                SEI
                            </span>
                        </InputAdornment>
                    ),
                }}
                inputProps={{
                    step: "any",
                }}
                className="bg-bgSidebarGray1 overflow-hidden mt-[20px] rounded-[12px] tracking-[1px] uppercase w-full px-[15px] transition-all duration-300"
                classes={{
                    root: "w-full text-white focus:bg-transparent font-semibold cursor-pointer relative py-[10px] px-[22.5px] text-[10px] font-semibold text-textGray1",
                }}
                // style={
                //     !isBuy &&
                //     balances[0] &&
                //     BigNumber.from(
                //         ethers.utils.parseUnits(
                //             amount ? amount : "0",
                //             pair?.pairs[symbols.join("-")].baseAssetPrecision
                //         )
                //     ).gt(balances[0].deposited)
                //         ? { border: "2px solid #DD3D32" }
                //         : { border: "2px solid rgb(255,255,255,.1)" }
                // }
            />
            <FormHelperText
                className={`opacity-0 text-inputErrorRed px-2 transition-all duration-300 font-semibold relative bottom-[2.5px]

                
                `}
            >
                You don't have enough SEI deposited !
            </FormHelperText>
            <TextField
                id="price"
                placeholder={"0.0000"}
                type="string"
                value={price}
                disabled={isMarket}
                autoComplete="off"
                onChange={(e) => {
                    // if (!isMarket) {
                    //     handleInput(e.target.value, false, setPrice)
                    // }

                    if (isStringValidNumber(e?.target?.value)) {
                        setPrice(e?.target?.value)
                    }
                }}
                variant="standard"
                label={
                    <span className="relative text-[15px] font-semibold text-textGray1">
                        {isMarket ? "DISABLED" : "PRICE"}
                    </span>
                }
                InputLabelProps={{
                    shrink: true,
                    className: "text-black mt-[14px] ml-[23px]",
                }}
                InputProps={{
                    className: "text-white focus:normal-case font-semibold",
                    disableUnderline: true,
                    inputProps: { min: 0 },
                    endAdornment: (
                        <InputAdornment position="end">
                            <span
                                className={`${
                                    isMarket ? "text-textGray1" : "text-purple1"
                                } relative bottom-2 font-semibold text-[14px]`}
                            >
                                USDC
                            </span>
                        </InputAdornment>
                    ),
                }}
                inputProps={{
                    step: "any",
                }}
                className="bg-bgSidebarGray1 overflow-hidden mt-[0px] rounded-[12px] tracking-[1px] uppercase w-full px-[15px] transition-all duration-300"
                classes={{
                    root: `w-full text-white focus:bg-transparent font-semibold cursor-pointer relative py-[10px] px-[22.5px] text-[10px] font-semibold text-textGray1`,
                }}
                // style={
                //     isBuy &&
                //     !isMarket &&
                //     balances[1] &&
                //     BigNumber.from(
                //         ethers.utils.parseUnits(
                //             price ? price : "0",
                //             pair?.pairs[symbols.join("-")].quoteAssetPrecision
                //         )
                //     ).gt(balances[1].deposited)
                //         ? { border: "2px solid #DD3D32" }
                //         : { border: "2px solid rgb(255,255,255,.1)" }
                // }
            />
            <FormHelperText
                className={`opacity-0 text-inputErrorRed px-2 transition-all duration-300 font-semibold relative bottom-[2.5px] `}
            >
                You don't have enough SEI deposited !
            </FormHelperText>

            <Button
                variant="contained"
                onClick={() => {
                    msgPlaceOrder()
                }}
                className={`${
                    isBuy
                        ? "bg-green1 hover:bg-green1"
                        : "bg-alertRed hover:bg-alertRed"
                } w-full rounded-xl mt-[4px] normal-case font-semibold py-3 hover:bg-opacity-90`}
            >
                {isBuy ? "Buy" : "Sell"} SEI
            </Button>
        </div>
    )
}

export default OrderV2
