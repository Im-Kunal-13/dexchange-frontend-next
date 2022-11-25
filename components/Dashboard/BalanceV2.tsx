import {
    Button,
    FormHelperText,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
} from "@mui/material"
import { BigNumber, ethers } from "ethers"
import { SetStateAction, useEffect, useState } from "react"
import { deposit, withdraw } from "../../api/interactions"
import { useAppStateContext } from "../../context/contextProvider"
import { useAppDispatch, useAppSelector } from "../../store/store"
import { containsOnlyValidNumber } from "../../utility"
import RefreshIcon from "@mui/icons-material/Refresh"
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"

const BalanceV2 = () => {
    // @ts-ignore
    const { setSnackbarWarning } = useAppStateContext()

    const [isDeposit, setIsDeosit] = useState(true)
    const [isToken1Selected, setIsToken1Selected] = useState(true)
    const [tokenTransferAmount, setTokenTransferAmount] = useState("")

    const dispatch = useAppDispatch()

    const { contracts, symbols, pair } = useAppSelector((state) => state.tokens)
    const tokenBalances = useAppSelector((state) => state.tokens.balances)

    const { chainId, connection, account } = useAppSelector(
        (state) => state.provider
    )

    const exchange = useAppSelector((state) => state.exchange.contract)
    const exchangeBalances = useAppSelector((state) => state.exchange.balances)

    const depositHandler = (token: any, baseAsset: boolean) => {
        const tokenBigNum = ethers.utils.parseUnits(
            tokenTransferAmount || "0",
            pair?.pairs[symbols.join("-")][
                isToken1Selected ? "baseAssetPrecision" : "quoteAssetPrecision"
            ]
        )

        const balance = tokenBalances[baseAsset ? 0 : 1]

        if (!tokenBigNum.isZero()) {
            if (tokenBigNum.lt(balance)) {
                deposit(
                    chainId,
                    account,
                    token,
                    tokenTransferAmount,
                    exchange.address,
                    pair.pairs[symbols.join("-")][
                        baseAsset ? "baseAssetPrecision" : "quoteAssetPrecision"
                    ],
                    connection,
                    dispatch
                )
                setTokenTransferAmount("")
            } else {
                setSnackbarWarning({
                    open: true,
                    message: "You have insufficient amount of tokens !",
                })
            }
        } else {
            setSnackbarWarning({
                open: true,
                message: "Token amount cannot be zero !",
            })
        }
    }

    const withdrawHandler = (token: any, baseAsset: boolean) => {
        const tokenBigNum = ethers.utils.parseUnits(
            tokenTransferAmount || "0",
            pair?.pairs[symbols.join("-")][
                baseAsset ? "baseAssetPrecision" : "quoteAssetPrecision"
            ]
        )

        const balDeposited =
            exchangeBalances[isToken1Selected ? 0 : 1].deposited
        const balBlocked = exchangeBalances[isToken1Selected ? 0 : 1].blocked

        if (!tokenBigNum.isZero()) {
            if (tokenBigNum.lte(balDeposited.sub(balBlocked))) {
                withdraw(
                    chainId,
                    account,
                    token,
                    tokenTransferAmount,
                    exchange.address,
                    pair.pairs[symbols.join("-")][
                        baseAsset ? "baseAssetPrecision" : "quoteAssetPrecision"
                    ],
                    connection,
                    dispatch
                )
                setTokenTransferAmount("")
            } else {
                setSnackbarWarning({
                    open: true,
                    message: "You don't have enough withdrawal balance !",
                })
            }
        } else {
            setSnackbarWarning({
                open: true,
                message: "Token amount cannot be zero !",
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
        setTokenTransferAmount("")
    }, [symbols])

    return (
        <div>
            <div className="flex items-center gap-2">
                <Button
                    variant="text"
                    className={`normal-case text-[13px] font-semibold ${
                        isDeposit
                            ? "bg-purple1 hover:bg-purple1 text-white hover:bg-opacity-90"
                            : "text-purple1 hover:bg-opacity-10 hover:bg-white"
                    }  rounded-full w-full h-[37.5px] border border-white`}
                    onClick={() => setIsDeosit(true)}
                >
                    Deposit
                </Button>
                <Button
                    variant="text"
                    className={`normal-case text-[13px] font-semibold rounded-full w-full h-[37.5px] ${
                        !isDeposit
                            ? "bg-purple1 hover:bg-purple1 hover:bg-opacity-90 text-white"
                            : "text-purple1 hover:bg-opacity-10 hover:bg-white"
                    } `}
                    onClick={() => setIsDeosit(false)}
                >
                    Withdraw
                </Button>
            </div>
            <div className="bg-purple1 bg-opacity-25 flex flex-col gap-[6px] mt-[24px] rounded-xl py-[20px] px-[24px]">
                <h6 className="text-[10px] font-bold leading-[1] trackig-widest uppercase text-textGray1">
                    DEXCHANGE BALANCE
                </h6>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-[3px]">
                        <p className="text-[12px] text-white font-bold leading-[1.6] trackig-widest">
                            {exchangeBalances[isToken1Selected ? 0 : 1] &&
                                symbols[isToken1Selected ? 0 : 1] &&
                                ethers.utils.formatUnits(
                                    exchangeBalances[
                                        isToken1Selected ? 0 : 1
                                    ].deposited.toString(),
                                    pair?.pairs[symbols.join("-")][
                                        isToken1Selected
                                            ? "baseAssetPrecision"
                                            : "quoteAssetPrecision"
                                    ]
                                )}{" "}
                            {symbols[isToken1Selected ? 0 : 1]} ( Deposited )
                        </p>
                        <p className="text-[12px] text-white font-bold leading-[1.6] trackig-widest">
                            {exchangeBalances[isToken1Selected ? 0 : 1] &&
                                symbols[isToken1Selected ? 0 : 1] &&
                                ethers.utils.formatUnits(
                                    exchangeBalances[
                                        isToken1Selected ? 0 : 1
                                    ].blocked.toString(),
                                    pair?.pairs[symbols.join("-")][
                                        isToken1Selected
                                            ? "baseAssetPrecision"
                                            : "quoteAssetPrecision"
                                    ]
                                )}{" "}
                            {symbols[isToken1Selected ? 0 : 1]} ( Blocked )
                        </p>
                    </div>
                    <IconButton className="rounded-full rotate-0 hover:rotate-[45deg] transition-all duration-300 bg-white bg-opacity-10 hover:bg-black hover:bg-opacity-20 relative bottom-[2px]">
                        <RefreshIcon className="text-white text-2xl" />
                    </IconButton>
                </div>
            </div>
            <Select
                value={isToken1Selected ? symbols[0] : symbols[1]}
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
                    setIsToken1Selected(e.target.value === symbols[0])
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
                {symbols.map((symbol) => (
                    <MenuItem
                        value={symbol}
                        className="px-6 font-medium"
                        classes={{ selected: "text-purple1" }}
                        key={symbol}
                    >
                        {symbol}
                    </MenuItem>
                ))}
            </Select>
            <TextField
                placeholder={"0.0000"}
                type="string"
                value={tokenTransferAmount}
                autoComplete="off"
                onChange={(e) => {
                    handleInput(
                        e.target.value,
                        isToken1Selected,
                        setTokenTransferAmount
                    )
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
                                className={`text-purple1 relative bottom-2 font-semibold text-[14px]`}
                            >
                                {symbols[isToken1Selected ? 0 : 1]}
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
                    tokenBalances[isToken1Selected ? 0 : 1] &&
                    exchangeBalances[isToken1Selected ? 0 : 1] &&
                    BigNumber.from(
                        Number(tokenTransferAmount) > 0
                            ? ethers.utils.parseUnits(
                                  tokenTransferAmount
                                      ? tokenTransferAmount
                                      : "0",
                                  pair?.pairs[symbols.join("-")][
                                      isToken1Selected
                                          ? "baseAssetPrecision"
                                          : "quoteAssetPrecision"
                                  ]
                              )
                            : "0"
                    ).gt(
                        isDeposit
                            ? tokenBalances[isToken1Selected ? 0 : 1]
                            : exchangeBalances[
                                  isToken1Selected ? 0 : 1
                              ].deposited.sub(
                                  exchangeBalances[isToken1Selected ? 0 : 1]
                                      .blocked
                              )
                    )
                        ? { border: "2px solid #DD3D32" }
                        : { border: "2px solid rgb(255,255,255,.1)" }
                }
            />
            <FormHelperText
                className={`text-inputErrorRed px-2 transition-all duration-300 font-semibold relative bottom-[2.5px] ${
                    tokenBalances[isToken1Selected ? 0 : 1] &&
                    exchangeBalances[isToken1Selected ? 0 : 1] &&
                    BigNumber.from(
                        Number(tokenTransferAmount) > 0
                            ? ethers.utils.parseUnits(
                                  tokenTransferAmount
                                      ? tokenTransferAmount
                                      : "0",
                                  pair?.pairs[symbols.join("-")][
                                      isToken1Selected
                                          ? "baseAssetPrecision"
                                          : "quoteAssetPrecision"
                                  ]
                              )
                            : "0"
                    ).gt(
                        isDeposit
                            ? tokenBalances[isToken1Selected ? 0 : 1]
                            : exchangeBalances[
                                  isToken1Selected ? 0 : 1
                              ].deposited.sub(
                                  exchangeBalances[isToken1Selected ? 0 : 1]
                                      .blocked
                              )
                    )
                        ? "opacity-100"
                        : "opacity-0"
                }`}
            >
                You don't have enough {symbols[0]} deposited !
            </FormHelperText>
            <Button
                variant="contained"
                onClick={
                    isDeposit
                        ? () =>
                              depositHandler(
                                  contracts[isToken1Selected ? 0 : 1],
                                  isToken1Selected
                              )
                        : () =>
                              withdrawHandler(
                                  contracts[isToken1Selected ? 0 : 1],
                                  isToken1Selected
                              )
                }
                className={`${"bg-purple1 hover:bg-purple1"} w-full rounded-xl mt-[4px] normal-case font-semibold py-3 hover:bg-opacity-90`}
            >
                {isDeposit ? "Deposit" : "Withdraw"}
            </Button>
        </div>
    )
}

export default BalanceV2
