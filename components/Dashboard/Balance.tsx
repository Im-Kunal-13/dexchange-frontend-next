import React, { SetStateAction } from "react"
import { useEffect, useState, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../store/store"

import { loadBalances, transferTokens } from "../../api/interactions"
import { Button, Divider, TextField } from "@mui/material"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import { useAppStateContext } from "../../context/contextProvider"
import FormHelperText from "@mui/material/FormHelperText"
import { tokenDecimalLimit } from "../../constants/abi"

const Balance = () => {
    // @ts-ignore
    const { setSnackbarWarning } = useAppStateContext()

    const [isDeposit, setIsDeosit] = useState(true)
    const [token1TransferAmount, setToken1TransferAmount] = useState("")
    const [token2TransferAmount, setToken2TransferAmount] = useState("")

    const dispatch = useAppDispatch()

    const { balances } = useAppSelector((state) => state.tokens)

    const provider = useAppSelector((state) => state.provider.connection)
    const account = useAppSelector((state) => state.provider.account)

    const exchange = useAppSelector((state) => state.exchange.contract)
    const exchangeBalances = useAppSelector((state) => state.exchange.balances)
    const transferInProgress = useAppSelector(
        (state) => state.exchange.transferInProgress
    )

    const tokens = useAppSelector((state) => state.tokens.contracts)
    const symbols = useAppSelector((state) => state.tokens.symbols)
    const tokenBalances = useAppSelector((state) => state.tokens.balances)

    const depositRef = useRef(null)
    const withdrawRef = useRef(null)

    const logoMap = new Map([
        ["BTC", "/images/bitcoin-btc-logo.svg"],
        ["DAI", "/images/dai.svg"],
        ["USDC", "/images/usd-coin-usdc-logo.svg"],
        ["LINK", "/images/chainlink-link-logo.svg"],
    ])

    const depositHandler = (e: any, token: any) => {
        e.preventDefault()
        if (token.address === tokens[0].address) {
            if (Number(token1TransferAmount) > 0) {
                transferTokens(
                    provider,
                    exchange,
                    "Deposit",
                    token,
                    Number(token1TransferAmount),
                    dispatch
                )
                // setToken1TransferAmount("")
            } else {
                setSnackbarWarning({
                    open: true,
                    message: "Token amount must be greater than zero !",
                })
            }
        } else {
            if (Number(token2TransferAmount) > 0) {
                transferTokens(
                    provider,
                    exchange,
                    "Deposit",
                    token,
                    Number(token2TransferAmount),
                    dispatch
                )
                setToken2TransferAmount("")
            } else {
                setSnackbarWarning({
                    open: true,
                    message: "Token amount must be greater than zero !",
                })
            }
        }
    }

    const withdrawHandler = (e: any, token: any) => {
        e.preventDefault()

        if (token.address === tokens[0].address) {
            if (Number(token1TransferAmount) > 0) {
                transferTokens(
                    provider,
                    exchange,
                    "Withdraw",
                    token,
                    Number(token1TransferAmount),
                    dispatch
                )
                setToken1TransferAmount("")
            } else {
                setSnackbarWarning({
                    open: true,
                    message: "Token amount must be greater than zero !",
                })
            }
        } else {
            if (Number(token2TransferAmount) > 0) {
                transferTokens(
                    provider,
                    exchange,
                    "Withdraw",
                    token,
                    Number(token2TransferAmount),
                    dispatch
                )
                setToken2TransferAmount("")
            } else {
                setSnackbarWarning({
                    open: true,
                    message: "Token amount must be greater than zero !",
                })
            }
        }
    }

    const handleInput = (
        value: string,
        symbol: string,
        setValue: React.Dispatch<SetStateAction<string>>
    ) => {
        if (value.includes(".")) {
            const arr = value.split(".")
            //@ts-ignore
            if ( arr.length <= tokenDecimalLimit.get(symbol) && arr[1].length <= tokenDecimalLimit.get(symbol)
            ) {
                setValue(value)
            }
        } else {
            setValue(value)
        }
    }

    useEffect(() => {
        if (exchange && tokens[0] && tokens[1] && account) {
            loadBalances(exchange, tokens, account, dispatch)
        }
    }, [exchange, tokens, account, transferInProgress, dispatch])

    useEffect(() => {
        setToken1TransferAmount("")
        setToken2TransferAmount("")
    }, [symbols])

    return (
        <div className="col-span-full">
            <div className="flex items-center justify-between">
                <h2>Balance</h2>
                <div className="bg-bgGray1 rounded p-[0.2em]">
                    <button
                        onClick={() => {
                            setIsDeosit(true)
                        }}
                        ref={depositRef}
                        className={`${
                            isDeposit ? "bg-btnBlue1" : "bg-transparent"
                        } text-white min-w-[6em] py-[0.25em] px-[0.5em] border-none rounded font-medium cursor-pointer relative`}
                    >
                        Deposit
                    </button>
                    <button
                        onClick={() => {
                            setIsDeosit(false)
                        }}
                        ref={withdrawRef}
                        className={`${
                            !isDeposit ? "bg-btnBlue1" : "bg-transparent"
                        } text-white min-w-[6em] py-[0.25em] px-[0.5em] border-none rounded font-medium cursor-pointer relative`}
                    >
                        Withdraw
                    </button>
                </div>
            </div>

            {/* Deposit/Withdraw Component 1 (BTC) */}

            <div className="">
                <div className="flex items-center justify-between py-[1.25rem]">
                    <div className="flex flex-col items-start gap-1">
                        <small>Token</small>
                        <div className="flex items-center">
                            <img
                                src={logoMap.get(symbols[0])}
                                alt="Token Logo"
                                className="mr-[0.3em] float-left"
                            />
                            {symbols && symbols[0]}
                        </div>
                    </div>
                    <p className="flex flex-col items-start gap-1">
                        <small>Wallet</small>
                        {tokenBalances && Number(tokenBalances[0]).toFixed(4)}
                    </p>
                    <p className="flex flex-col items-start gap-1">
                        <small>Dexchange</small>
                        {exchangeBalances && exchangeBalances[0]}
                    </p>
                </div>

                <form
                    onSubmit={
                        isDeposit
                            ? (e) => depositHandler(e, tokens[0])
                            : (e) => withdrawHandler(e, tokens[0])
                    }
                >
                    <label htmlFor="token0">
                        {symbols && symbols[0]} Amount
                    </label>
                    <TextField
                        id="token0"
                        type="number"
                        placeholder="0.0000"
                        value={token1TransferAmount}
                        variant="standard"
                        onChange={(e) =>
                            handleInput(
                                e.target.value,
                                symbols[0],
                                setToken1TransferAmount
                            )
                        }
                        InputProps={{
                            className: "text-white focus:normal-case",
                            disableUnderline: true,
                            inputProps: { min: 0, step: "any" },
                        }}
                        inputProps={{
                            step: "any",
                        }}
                        autoComplete="off"
                        className="my-2.5 rounded py-2 px-4 transition-all duration-300"
                        classes={{
                            root: "bg-bgGray1 w-full",
                        }}
                        style={
                            Number(token1TransferAmount) > Number(balances[0])
                                ? { border: "1px solid #DD3D32" }
                                : { border: "1px solid transparent" }
                        }
                    />
                    <FormHelperText
                        className={`text-inputErrorRed relative bottom-2 transition-all duration-300 ${
                            Number(token1TransferAmount) > Number(balances[0])
                                ? "opacity-100"
                                : "opacity-0"
                        }`}
                    >
                        You don't have enough USDC deposited !
                    </FormHelperText>
                    <Button
                        variant="outlined"
                        type="submit"
                        className="w-full normal-case font-bold py-3.5 mt-2 rounded flex items-center gap-1 hover:gap-2.5 transition-all duration-300 border-btnBlue1 hover:border-white hover:text-white"
                    >
                        {isDeposit ? (
                            <span>Deposit</span>
                        ) : (
                            <span>Withdraw</span>
                        )}
                        <KeyboardArrowRightIcon className="text-xl" />
                    </Button>
                </form>
            </div>

            <hr />

            {/* Deposit/Withdraw Component 2 (LINK) */}

            <div className="">
                <div className="flex items-center justify-between py-[1.25rem]">
                    <div className="flex flex-col items-start gap-1">
                        <small>Token</small>
                        <div className="flex items-center gap-1">
                            <img
                                src={logoMap.get(symbols[1])}
                                alt="Token Logo"
                            />
                            {symbols && symbols[1]}
                        </div>
                    </div>
                    <p>
                        <small>Wallet</small>
                        <br />
                        {tokenBalances && Number(tokenBalances[1]).toFixed(4)}
                    </p>
                    <p>
                        <small>Dexchange</small>
                        <br />
                        {exchangeBalances && exchangeBalances[1]}
                    </p>
                </div>

                <form
                    onSubmit={
                        isDeposit
                            ? (e) => depositHandler(e, tokens[1])
                            : (e) => withdrawHandler(e, tokens[1])
                    }
                >
                    <label htmlFor="token1">
                        {symbols && symbols[1]} Amount
                    </label>
                    <TextField
                        placeholder="0.0000"
                        variant="standard"
                        type="number"
                        autoComplete="off"
                        InputProps={{
                            className: "text-white focus:normal-case",
                            disableUnderline: true,
                            inputProps: { min: 0 },
                        }}
                        className="my-2.5 rounded py-2 px-4 transition-all duration-300"
                        classes={{
                            root: "bg-bgGray1 w-full",
                        }}
                        style={
                            Number(token2TransferAmount) > Number(balances[1])
                                ? { border: "1px solid #DD3D32" }
                                : { border: "1px solid transparent" }
                        }
                        id="token1"
                        value={token2TransferAmount}
                        onChange={(e) =>
                            handleInput(
                                e.target.value,
                                symbols[1],
                                setToken2TransferAmount
                            )
                        }
                    />
                    <FormHelperText
                        className={`text-inputErrorRed relative bottom-2 transition-all duration-300 ${
                            Number(token2TransferAmount) > Number(balances[1])
                                ? "opacity-100"
                                : "opacity-0"
                        }`}
                    >
                        You don't have enough USDC deposited !
                    </FormHelperText>
                    <Button
                        variant="outlined"
                        type="submit"
                        className="w-full normal-case font-bold py-3.5 mt-2 rounded flex items-center gap-1 hover:gap-2.5 transition-all duration-300 border-btnBlue1 hover:border-white hover:text-white"
                    >
                        {isDeposit ? (
                            <span>Deposit</span>
                        ) : (
                            <span>Withdraw</span>
                        )}
                        <KeyboardArrowRightIcon className="text-xl" />
                    </Button>
                </form>
            </div>

            <Divider className="my-7" />
        </div>
    )
}

export default Balance
