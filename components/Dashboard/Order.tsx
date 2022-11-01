import { useState, useRef, SetStateAction, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../store/store"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import { insertOrder } from "../../api/interactions"
import { Button, FormHelperText, TextField, Tooltip } from "@mui/material"
import { useAppStateContext } from "../../context/contextProvider"
import config from "../../assets/data/config.json"

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
    const { symbols, balances } = useAppSelector((state) => state.tokens)

    const dispatch = useAppDispatch()

    const buyRef = useRef(null)
    const sellRef = useRef(null)

    const marketRef = useRef(null)
    const limitRef = useRef(null)

    const buyHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (
            (isMarket && Number(amount) > 0) ||
            (Number(amount) > 0 && Number(price) > 0)
        ) {
            if (Number(price) <= Number(balances[1])) {
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
                setAmount("0")
                setPrice("0")
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

    const sellHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (
            (isMarket && Number(amount) > 0) ||
            (Number(amount) > 0 && Number(price) > 0)
        ) {
            if (Number(amount) <= Number(balances[0])) {
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
        symbol: string,
        setValue: React.Dispatch<SetStateAction<string>>
    ) => {
        if (value.includes(".")) {
            const arr = value.split(".")
            if (
                //@ts-ignore
                arr.length <= config[chainId][symbol].decimal_places &&
                //@ts-ignore
                arr[1].length <= config[chainId][symbol].decimal_places
            ) {
                setValue(value)
            }
        } else {
            setValue(value)
        }
    }

    const getPlaceholder = (symbol: string) => {
        return (
            "0." +
            [
                ...Array(
                    // @ts-ignore
                    config[chainId][symbol].decimal_places
                ),
            ]
                .map(() => {
                    return "0"
                })
                .join("")
        )
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
                    placeholder={
                        chainId && symbols[0] ? getPlaceholder(symbols[0]) : "0"
                    }
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

                {isBuy ? (
                    <label
                        htmlFor="price"
                        className={`${
                            isMarket &&
                            "text-opacity-30 text-white transition-all duration-500"
                        }  transition-all duration-500`}
                    >
                        Buy Price
                    </label>
                ) : (
                    <label
                        htmlFor="price"
                        className={`${
                            isMarket &&
                            "text-opacity-30 text-white transition-all duration-500"
                        }  transition-all duration-500`}
                    >
                        Sell Price
                    </label>
                )}

                <TextField
                    id="price"
                    placeholder={
                        isMarket
                            ? "Disabled"
                            : chainId && symbols[1]
                            ? getPlaceholder(symbols[1])
                            : "0"
                    }
                    value={price}
                    type="number"
                    onChange={(e) => {
                        if (!isMarket) {
                            handleInput(e.target.value, symbols[1], setPrice)
                        }
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
                    autoComplete="off"
                    className="my-2.5 rounded py-2 px-4 transition-all duration-300"
                    classes={{
                        root: `${
                            isMarket && "bg-opacity-40"
                        } bg-bgGray1 w-full disabled:bg-white`,
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
