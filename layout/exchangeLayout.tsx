import { SetStateAction, useEffect, useRef, useState } from "react"
import {
    Button,
    FormHelperText,
    IconButton,
    MenuItem,
    Select,
    TextField,
} from "@mui/material"
import RefreshIcon from "@mui/icons-material/Refresh"
import ReplayCircleFilledIcon from "@mui/icons-material/ReplayCircleFilled"
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import { useAppStateContext } from "../context/contextProvider"
import { useAppDispatch, useAppSelector } from "../store/store"
import { BigNumber, ethers } from "ethers"
import { insertOrder } from "../api/interactions"
import { containsOnlyValidNumber } from "../utility"
import { InputAdornment } from "@material-ui/core"

const exchangeLayout = () => {
    const {
        // @ts-ignore
        setSnackbarWarning,
    } = useAppStateContext()

    const [isMarket, setIsMarket] = useState(false)
    const [isBuy, setIsBuy] = useState(true)
    const [amount, setAmount] = useState("")
    const [price, setPrice] = useState("")

    const { connection, account, chainId } = useAppSelector(
        (state) => state.provider
    )
    const { symbols, pair } = useAppSelector((state) => state.tokens)
    const tokenBalances = useAppSelector((state) => state.tokens.balances)
    const { balances } = useAppSelector((state) => state.exchange)
    const exchange = useAppSelector((state) => state.exchange.contract)

    const dispatch = useAppDispatch()

    const buyRef = useRef(null)
    const sellRef = useRef(null)

    const marketRef = useRef(null)
    const limitRef = useRef(null)

    const buyHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const amountBigNum = ethers.utils.parseUnits(
            amount || "0",
            pair?.pairs[symbols.join("-")].baseAssetPrecision
        )
        const priceBigNum = ethers.utils.parseUnits(
            amount || "0",
            pair?.pairs[symbols.join("-")].quoteAssetPrecision
        )

        if (!amountBigNum.isZero() && (isMarket || !priceBigNum.isZero())) {
            if (
                priceBigNum.lte(balances[1].deposited.sub(balances[1].blocked))
            ) {
                insertOrder(
                    account,
                    `${symbols[0]}-${symbols[1]}`,
                    isMarket ? "market" : "limit",
                    isBuy ? "buy" : "sell",
                    amount,
                    !isMarket ? price : "0",
                    chainId,
                    exchange.address,
                    [
                        pair.pairs[symbols.join("-")].baseAssetPrecision,
                        pair.pairs[symbols.join("-")].quoteAssetPrecision,
                    ],
                    connection,
                    dispatch
                )
                setAmount("")
                setPrice("")
            } else {
                setSnackbarWarning({
                    open: true,
                    message: "You don't have enough USDC deposited !",
                })
            }
        } else {
            setSnackbarWarning({
                open: true,
                message: "Token amount must be greater than zero !",
            })
        }
    }

    const sellHandler = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault()
        if (
            (isMarket && Number(amount) > 0) ||
            (Number(amount) > 0 && Number(price) > 0)
        ) {
            if (
                Number(amount) <=
                Number(balances[0].deposited) - Number(balances[0].blocked)
            ) {
                insertOrder(
                    account,
                    `${symbols[0]}-${symbols[1]}`,
                    isMarket ? "market" : "limit",
                    isBuy ? "buy" : "sell",
                    amount,
                    !isMarket ? price : "0",
                    chainId,
                    exchange.address,
                    [
                        pair.pairs[symbols.join("-")].baseAssetPrecision,
                        pair.pairs[symbols.join("-")].quoteAssetPrecision,
                    ],
                    connection,
                    dispatch
                )
                setAmount("")
                setPrice("")
            } else {
                setSnackbarWarning({
                    open: true,
                    message: "You don't have enough tokens to sell !",
                })
            }
        } else {
            setSnackbarWarning({
                open: true,
                message: "Token amount must be greater than zero !",
            })
        }
    }

    const handleInput = (
        value: string,
        baseAsset: boolean,
        setValue: React.Dispatch<SetStateAction<string>>
    ) => {
        if (containsOnlyValidNumber(value)) {
            if (value.includes(".")) {
                const arr = value.split(".")
                if (
                    arr[1].length <=
                    pair.pairs[symbols.join("-")][
                        baseAsset ? "baseAssetPrecision" : "quoteAssetPrecision"
                    ]
                ) {
                    setValue(value)
                }
            } else {
                setValue(value)
            }
        }
    }

    useEffect(() => {
        setAmount("")
        setPrice("")
    }, [symbols])

    return (
        <div className="grid grid-cols-7 h-[92px]">
            <div className="col-span-3">
                <div className="w-[55%] mt-[24px] mb-[20px] px-[24px]">
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
                                <p className="text-[12px] text-white font-bold leading-[1.6] trackig-widest">
                                    {tokenBalances[0] &&
                                        ethers.utils.formatUnits(
                                            tokenBalances[0].toString(),
                                            pair?.pairs[symbols.join("-")]
                                                .baseAssetPrecision
                                        )} {symbols[0]}
                                </p>
                                <p className="text-[12px] text-white font-bold leading-[1.6] trackig-widest">
                                    {tokenBalances[1] &&
                                        ethers.utils.formatUnits(
                                            tokenBalances[1].toString(),
                                            pair?.pairs[symbols.join("-")]
                                                .quoteAssetPrecision
                                        )} {symbols[1]}
                                </p>
                            </div>
                            <IconButton className="rounded-full rotate-0 hover:rotate-[45deg] transition-all duration-300 bg-black bg-opacity-10 hover:bg-black hover:bg-opacity-20 relative bottom-[2px]">
                                <RefreshIcon className="text-purple1 text-2xl" />
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
                                root: "left-[22px]",
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
                            handleInput(e.target.value, true, setAmount)
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
                            className:
                                "text-white focus:normal-case font-semibold",
                            disableUnderline: true,
                            inputProps: { min: 0 },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <span
                                        className={`${
                                            isBuy
                                                ? "text-textGreen1"
                                                : "text-alertRed"
                                        } relative bottom-2 font-semibold text-[14px]`}
                                    >
                                        {symbols[0]}
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
                        style={
                            !isBuy &&
                            balances[0] &&
                            BigNumber.from(
                                ethers.utils.parseUnits(
                                    amount ? amount : "0",
                                    pair?.pairs[symbols.join("-")]
                                        .baseAssetPrecision
                                )
                            ).gt(balances[0].deposited)
                                ? { border: "2px solid #DD3D32" }
                                : { border: "2px solid rgb(255,255,255,.1)" }
                        }
                    />
                    <FormHelperText
                        className={`text-inputErrorRed px-2 transition-all duration-300 font-semibold relative bottom-[2.5px] ${
                            !isBuy &&
                            balances[0] &&
                            BigNumber.from(
                                ethers.utils.parseUnits(
                                    amount ? amount : "0",
                                    pair?.pairs[symbols.join("-")]
                                        .baseAssetPrecision
                                )
                            ).gt(balances[0].deposited)
                                ? "opacity-100"
                                : "opacity-0"
                        }`}
                    >
                        You don't have enough {symbols[0]} deposited !
                    </FormHelperText>
                    <TextField
                        id="price"
                        placeholder={"0.0000"}
                        type="string"
                        value={price}
                        disabled={isMarket}
                        autoComplete="off"
                        onChange={(e) => {
                            if (!isMarket) {
                                handleInput(e.target.value, false, setPrice)
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
                            className:
                                "text-white focus:normal-case font-semibold",
                            disableUnderline: true,
                            inputProps: { min: 0 },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <span
                                        className={`${
                                            isMarket
                                                ? "text-textGray1"
                                                : "text-purple1"
                                        } relative bottom-2 font-semibold text-[14px]`}
                                    >
                                        {symbols[1]}
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
                        style={
                            isBuy &&
                            !isMarket &&
                            balances[1] &&
                            BigNumber.from(
                                ethers.utils.parseUnits(
                                    price ? price : "0",
                                    pair?.pairs[symbols.join("-")]
                                        .quoteAssetPrecision
                                )
                            ).gt(balances[1].deposited)
                                ? { border: "2px solid #DD3D32" }
                                : { border: "2px solid rgb(255,255,255,.1)" }
                        }
                    />
                    <FormHelperText
                        className={`text-inputErrorRed px-2 transition-all duration-300 font-semibold relative bottom-[2.5px] ${
                            isBuy &&
                            !isMarket &&
                            balances[1] &&
                            BigNumber.from(
                                ethers.utils.parseUnits(
                                    price ? price : "0",
                                    pair?.pairs[symbols.join("-")]
                                        .quoteAssetPrecision
                                )
                            ).gt(balances[1].deposited)
                                ? "opacity-100"
                                : "opacity-0"
                        }`}
                    >
                        You don't have enough {symbols[0]} deposited !
                    </FormHelperText>
                    <Button
                        variant="contained"
                        onClick={isBuy ? buyHandler : sellHandler}
                        className={`${
                            isBuy
                                ? "bg-green1 hover:bg-green1"
                                : "bg-alertRed hover:bg-alertRed"
                        } w-full rounded-xl mt-[4px] normal-case font-semibold py-3 hover:bg-opacity-90`}
                    >
                        {isBuy ? "Buy" : "Sell"} {symbols[0]}
                    </Button>
                </div>
            </div>
            <div></div>
        </div>
    )
}

export default exchangeLayout
