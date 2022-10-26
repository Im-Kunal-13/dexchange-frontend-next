import { useState, useRef, SetStateAction, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../store/store"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"

import {
    insertOrder,
    // makeBuyOrder,
    // makeSellOrder,
} from "../../api/interactions"
import { Button, FormHelperText, TextField } from "@mui/material"
import { useAppStateContext } from "../../context/contextProvider"
import { tokenDecimalLimit } from "../../constants/abi"

const Order = () => {
    // @ts-ignore
    const { setSnackbarWarning, setSnackbarSuccess } = useAppStateContext()

    const [isMarket, setIsMarket] = useState(false)
    const [isBuy, setIsBuy] = useState(true)
    const [amount, setAmount] = useState("")
    const [price, setPrice] = useState("")

    const { connection, account, chainId } = useAppSelector(
        (state) => state.provider
    )
    const { contracts, symbols, balances } = useAppSelector(
        (state) => state.tokens
    )

    const dispatch = useAppDispatch()

    const buyRef = useRef(null)
    const sellRef = useRef(null)

    const marketRef = useRef(null)
    const limitRef = useRef(null)

    const buyHandler = (e: React.FormEvent<HTMLFormElement>) => {
        console.log(amount)
        e.preventDefault()
        if (
            (isMarket && Number(amount) > 0) ||
            (Number(amount) > 0 && Number(price) > 0)
        ) {
            insertOrder(
                connection,
                account,
                `${symbols[0]}-${symbols[1]}`,
                isMarket ? "market" : "limit",
                isBuy ? "buy" : "sell",
                amount,
                isMarket ? "" : price,
                chainId,
                dispatch,
                setSnackbarSuccess
            )
            // makeBuyOrder(connection, contract, contracts, { amount, price }, dispatch);
            setAmount("0")
            setPrice("0")
        } else {
            setSnackbarWarning({
                open: true,
                message: "Token amount must be greater than zero !",
            })
        }
    }

    const sellHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (
            (isMarket && Number(amount) > 0) ||
            (Number(amount) > 0 && Number(price) > 0)
        ) {
            // makeSellOrder(
            //     connection,
            //     contract,
            //     contracts,
            //     { amount, price },
            //     dispatch
            // )
            insertOrder(
                connection,
                account,
                `${symbols[0]}-${symbols[1]}`,
                isMarket ? "Market" : "Limit",
                isBuy ? "Buy" : "Sell",
                amount,
                price,
                chainId,
                dispatch,
                setSnackbarSuccess
            )
            setAmount("0")
            setPrice("0")
        } else {
            setSnackbarWarning({
                open: true,
                message: "Token amount must be greater than zero !",
            })
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
            if (
                arr.length <= tokenDecimalLimit.get(symbol) &&
                arr[1].length <= tokenDecimalLimit.get(symbol)
            ) {
                setValue(value)
            }
        } else {
            setValue(value)
        }
    }

    useEffect(() => {
        setAmount("")
        setPrice("")
    }, [symbols])
    return (
        <div className="col-span-full flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h2>Order Type</h2>
                <div className="bg-bgGray1 rounded p-[0.2em]">
                    <button
                        onClick={() => {
                            setIsMarket(true)
                        }}
                        ref={marketRef}
                        className={`${
                            isMarket ? "bg-btnBlue1" : "bg-transparent"
                        } text-white min-w-[6em] py-[0.25em] px-[0.5em] border-none rounded font-medium cursor-pointer relative`}
                    >
                        Market
                    </button>
                    <button
                        onClick={() => {
                            setIsMarket(false)
                        }}
                        ref={limitRef}
                        className={`${
                            !isMarket ? "bg-btnBlue1" : "bg-transparent"
                        } text-white min-w-[6em] py-[0.25em] px-[0.5em] border-none rounded font-medium cursor-pointer relative`}
                    >
                        Limit
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h2>Order Side</h2>
                <div className="bg-bgGray1 rounded p-[0.2em]">
                    <button
                        onClick={() => {
                            setIsBuy(true)
                        }}
                        ref={buyRef}
                        className={`${
                            isBuy ? "bg-btnBlue1" : "bg-transparent"
                        } text-white min-w-[6em] py-[0.25em] px-[0.5em] border-none rounded font-medium cursor-pointer relative`}
                    >
                        Buy
                    </button>
                    <button
                        onClick={() => {
                            setIsBuy(false)
                        }}
                        ref={sellRef}
                        className={`${
                            !isBuy ? "bg-btnBlue1" : "bg-transparent"
                        } text-white min-w-[6em] py-[0.25em] px-[0.5em] border-none rounded font-medium cursor-pointer relative`}
                    >
                        Sell
                    </button>
                </div>
            </div>

            <form onSubmit={isBuy ? buyHandler : sellHandler}>
                {isBuy ? (
                    <label htmlFor="amount">Buy Amount</label>
                ) : (
                    <label htmlFor="amount">Sell Amount</label>
                )}
                <TextField
                    id="amount"
                    placeholder="0.0000"
                    type="number"
                    value={amount}
                    autoComplete="off"
                    onChange={(e) => {
                        handleInput(e.target.value, symbols[0], setAmount)
                    }}
                    variant="standard"
                    InputProps={{
                        className: "text-white focus:normal-case",
                        disableUnderline: true,
                        inputProps: { min: 0 },
                    }}
                    inputProps={{
                        step: "any",
                    }}
                    className="my-2.5 rounded py-2 px-4 transition-all duration-300"
                    classes={{
                        root: "bg-bgGray1 w-full",
                    }}
                    style={
                        Number(amount) > Number(balances[0])
                            ? { border: "1px solid #DD3D32" }
                            : { border: "1px solid transparent" }
                    }
                />
                <FormHelperText
                    className={`text-inputErrorRed relative bottom-2 transition-all duration-300 ${
                        Number(amount) > Number(balances[0])
                            ? "opacity-100"
                            : "opacity-0"
                    }`}
                >
                    You don't have enough USDC deposited !
                </FormHelperText>

                {isMarket ? (
                    <></>
                ) : (
                    <>
                        {isBuy ? (
                            <label htmlFor="price">Buy Price</label>
                        ) : (
                            <label htmlFor="price">Sell Price</label>
                        )}
                    </>
                )}

                {isMarket ? (
                    <></>
                ) : (
                    <>
                        <TextField
                            id="price"
                            placeholder="0.0000"
                            value={price}
                            type="number"
                            onChange={(e) =>
                                handleInput(
                                    e.target.value,
                                    symbols[1],
                                    setPrice
                                )
                            }
                            variant="standard"
                            InputProps={{
                                className: "text-white focus:normal-case",
                                disableUnderline: true,
                                inputProps: { min: 0 },
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
                                Number(price) > Number(balances[1])
                                    ? { border: "1px solid #DD3D32" }
                                    : { border: "1px solid transparent" }
                            }
                        />
                        <FormHelperText
                            className={`text-inputErrorRed relative bottom-2 transition-all duration-300 ${
                                Number(price) > Number(balances[1])
                                    ? "opacity-100"
                                    : "opacity-0"
                            }`}
                        >
                            You don't have enough USDC deposited !
                        </FormHelperText>
                    </>
                )}

                <Button
                    variant="contained"
                    type="submit"
                    className="w-full normal-case font-bold py-3.5 mt-2 rounded flex items-center gap-1 hover:gap-2.5 transition-all duration-300 border-btnBlue1 bg-btnBlue1 hover:border-white hover:text-white"
                >
                    {isBuy ? <span>Buy Order</span> : <span>Sell Order</span>}
                    <KeyboardArrowRightIcon className="text-xl" />
                </Button>
            </form>
        </div>
    )
}

export default Order
