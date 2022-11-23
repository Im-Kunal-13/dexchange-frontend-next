import React, { SetStateAction } from "react"
import { useEffect, useState, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../store/store"
import { deposit, withdraw } from "../../api/interactions"
import { Button, Divider, TextField } from "@mui/material"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import { useAppStateContext } from "../../context/contextProvider"
import FormHelperText from "@mui/material/FormHelperText"
import { BigNumber, ethers } from "ethers"
import { containsOnlyValidNumber } from "../../utility"

const Balance = () => {
    // @ts-ignore
    const { setSnackbarWarning } = useAppStateContext()

    const [isDeposit, setIsDeosit] = useState(true)
    const [token1TransferAmount, setToken1TransferAmount] = useState("")
    const [token2TransferAmount, setToken2TransferAmount] = useState("")

    const dispatch = useAppDispatch()

    const { balances, contracts, symbols, pair } = useAppSelector(
        (state) => state.tokens
    )

    const { chainId, connection, account } = useAppSelector(
        (state) => state.provider
    )

    const exchange = useAppSelector((state) => state.exchange.contract)
    const exchangeBalances = useAppSelector((state) => state.exchange.balances)

    const depositRef = useRef(null)
    const withdrawRef = useRef(null)

    const logoMap = new Map([
        ["BTC", "/images/bitcoin-btc-logo.svg"],
        ["DAI", "/images/dai.svg"],
        ["USDC", "/images/usd-coin-usdc-logo.svg"],
        ["LINK", "/images/chainlink-link-logo.svg"],
    ])

    const depositHandler = (token: any, baseAsset: boolean) => {
        const token1BigNum = ethers.utils.parseUnits(
            token1TransferAmount || "0",
            pair?.pairs[symbols.join("-")].baseAssetPrecision
        )

        const token2BigNum = ethers.utils.parseUnits(
            token2TransferAmount || "0",
            pair?.pairs[symbols.join("-")].quoteAssetPrecision
        )

        const balance1 = balances[0]
        const balance2 = balances[1]

        if (token.address === contracts[0].address) {
            if (!token1BigNum.isZero()) {
                if (token1BigNum.lt(balance1)) {
                    deposit(
                        chainId,
                        account,
                        token,
                        token1TransferAmount,
                        exchange.address,
                        pair.pairs[symbols.join("-")][
                            baseAsset
                                ? "baseAssetPrecision"
                                : "quoteAssetPrecision"
                        ],
                        connection,
                        dispatch
                    )
                    setToken1TransferAmount("")
                } else {
                    setSnackbarWarning({
                        open: true,
                        message: "You have insufficient amount of tokens !",
                    })
                }
            } else {
                setSnackbarWarning({
                    open: true,
                    message: "Token amount must be greater than zero !",
                })
            }
        } else {
            if (!token2BigNum.isZero()) {
                if (token2BigNum.lt(balance2)) {
                    deposit(
                        chainId,
                        account,
                        token,
                        token2TransferAmount,
                        exchange.address,
                        pair.pairs[symbols.join("-")][
                            baseAsset
                                ? "baseAssetPrecision"
                                : "quoteAssetPrecision"
                        ],
                        connection,
                        dispatch
                    )
                    setToken2TransferAmount("")
                } else {
                    setSnackbarWarning({
                        open: true,
                        message: "You have insufficient amount of tokens !",
                    })
                }
            } else {
                setSnackbarWarning({
                    open: true,
                    message: "Token amount must be greater than zero !",
                })
            }
        }
    }

    const withdrawHandler = (token: any, baseAsset: boolean) => {
        const token1BigNum = ethers.utils.parseUnits(
            token1TransferAmount || "0",
            pair?.pairs[symbols.join("-")].baseAssetPrecision
        )
        const token2BigNum = ethers.utils.parseUnits(
            token2TransferAmount || "0",
            pair?.pairs[symbols.join("-")].quoteAssetPrecision
        )

        const bal1Deposited = exchangeBalances[0].deposited

        const bal1Blocked = exchangeBalances[0].blocked

        const bal2Deposited = exchangeBalances[1].deposited
        const bal2Blocked = exchangeBalances[1].blocked

        if (token.address === contracts[0].address) {
            if (!token1BigNum.isZero()) {
                if (token1BigNum.lte(bal1Deposited.sub(bal1Blocked))) {
                    withdraw(
                        chainId,
                        account,
                        token,
                        token1TransferAmount,
                        exchange.address,
                        pair.pairs[symbols.join("-")][
                            baseAsset
                                ? "baseAssetPrecision"
                                : "quoteAssetPrecision"
                        ],
                        connection,
                        dispatch
                    )
                    setToken1TransferAmount("")
                } else {
                    setSnackbarWarning({
                        open: true,
                        message: "You have insufficient amount of tokens !",
                    })
                }
            } else {
                setSnackbarWarning({
                    open: true,
                    message: "Token amount must be greater than zero !",
                })
            }
        } else {
            if (!token2BigNum.isZero()) {
                if (token2BigNum.lte(bal2Deposited.sub(bal2Blocked))) {
                    withdraw(
                        chainId,
                        account,
                        token,
                        token2TransferAmount,
                        exchange.address,
                        pair?.pairs[symbols.join("-")][
                            baseAsset
                                ? "baseAssetPrecision"
                                : "quoteAssetPrecision"
                        ],
                        connection,
                        dispatch
                    )
                    setToken2TransferAmount("")
                } else {
                    setSnackbarWarning({
                        open: true,
                        message: "You have insufficient amount of tokens !",
                    })
                }
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
        setToken1TransferAmount("")
        setToken2TransferAmount("")
    }, [symbols])

    return (
        <div className="col-span-full">
            <div className="flex items-center justify-between">
                <h2 className="text-white">Balance</h2>
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
                        <div className="flex items-center text-white">
                            <img
                                src={logoMap.get(symbols[0])}
                                alt="Token Logo"
                                className="mr-[0.3em] float-left"
                            />
                            {symbols && symbols[0]}
                        </div>
                    </div>
                    <p className="flex flex-col items-start gap-1 text-white">
                        <small>Wallet</small>
                        {balances[0] &&
                            ethers.utils.formatUnits(
                                balances[0].toString(),
                                pair?.pairs[symbols.join("-")]
                                    .baseAssetPrecision
                            )}
                    </p>
                    <p className="flex flex-col items-start gap-1 text-white">
                        <small>Deposited</small>
                        {exchangeBalances[0] &&
                            symbols[0] &&
                            ethers.utils.formatUnits(
                                exchangeBalances[0].deposited.toString(),
                                pair?.pairs[symbols.join("-")]
                                    .baseAssetPrecision
                            )}
                    </p>

                    <p className="flex flex-col items-start gap-1 whitespace-nowrap text-white">
                        <small>Blocked</small>
                        <span className="whitespace-nowrap">
                            {exchangeBalances[0] &&
                                symbols[0] &&
                                ethers.utils.formatUnits(
                                    exchangeBalances[0].blocked.toString(),
                                    pair?.pairs[symbols.join("-")]
                                        .baseAssetPrecision
                                )}
                        </span>
                    </p>
                </div>

                <form
                    onSubmit={
                        isDeposit
                            ? (e) => {
                                  e.preventDefault()
                                  depositHandler(contracts[0], true)
                              }
                            : (e) => {
                                  e.preventDefault()
                                  withdrawHandler(contracts[0], true)
                              }
                    }
                >
                    <label htmlFor="token0" className="text-white">
                        {symbols && symbols[0]} Amount
                    </label>
                    <TextField
                        id="token0"
                        type="string"
                        placeholder={"0.0000"}
                        value={token1TransferAmount}
                        variant="standard"
                        onChange={(e) =>
                            handleInput(
                                e.target.value,
                                true,
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
                            balances[0] &&
                            exchangeBalances[0] &&
                            BigNumber.from(
                                Number(token1TransferAmount) > 0
                                    ? ethers.utils.parseUnits(
                                          token1TransferAmount
                                              ? token1TransferAmount
                                              : "0",
                                          pair?.pairs[symbols.join("-")]
                                              .baseAssetPrecision
                                      )
                                    : "0"
                            ).gt(
                                isDeposit
                                    ? balances[0]
                                    : exchangeBalances[0].deposited.sub(
                                          exchangeBalances[0].blocked
                                      )
                            )
                                ? { border: "1px solid #DD3D32" }
                                : { border: "1px solid transparent" }
                        }
                    />
                    <FormHelperText
                        className={`text-inputErrorRed relative bottom-2 transition-all duration-300 ${
                            balances[0] &&
                            exchangeBalances[0] &&
                            BigNumber.from(
                                Number(token1TransferAmount) > 0
                                    ? ethers.utils.parseUnits(
                                          token1TransferAmount,
                                          pair?.pairs[symbols.join("-")]
                                              .baseAssetPrecision
                                      )
                                    : "0"
                            ).gt(
                                isDeposit
                                    ? balances[0]
                                    : exchangeBalances[0].deposited.sub(
                                          exchangeBalances[0].blocked
                                      )
                            )
                                ? "opacity-100"
                                : "opacity-0"
                        }`}
                    >
                        You don't have enough
                        {isDeposit
                            ? ` ${symbols[0]} in your Wallet`
                            : " withdrawal balance"}{" "}
                    </FormHelperText>
                    <Button
                        variant="outlined"
                        type="submit"
                        className="w-full normal-case font-bold py-3.5 mt-2 rounded flex items-center justify-center gap-1 hover:gap-2.5 transition-all duration-300 border-btnBlue1 hover:border-white hover:text-white"
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
                        <div className="flex items-center gap-1 text-white">
                            <img
                                src={logoMap.get(symbols[1])}
                                alt="Token Logo"
                            />
                            {symbols && symbols[1]}
                        </div>
                    </div>
                    <p className="flex flex-col items-start gap-1 text-white">
                        <small>Wallet</small>
                        {balances[1] &&
                            ethers.utils.formatUnits(
                                balances[1].toString(),
                                pair?.pairs[symbols.join("-")]
                                    .quoteAssetPrecision
                            )}
                    </p>
                    <p className="text-white">
                        <small>Deposited</small>
                        <br />
                        {exchangeBalances[1] &&
                            symbols[0] &&
                            ethers.utils.formatUnits(
                                exchangeBalances[1].deposited.toString(),
                                pair?.pairs[symbols.join("-")]
                                    .quoteAssetPrecision
                            )}
                    </p>
                    <p className="text-white">
                        <small>blocked</small>
                        <br />
                        {exchangeBalances[1] &&
                            symbols[0] &&
                            ethers.utils.formatUnits(
                                exchangeBalances[1].blocked.toString(),
                                pair?.pairs[symbols.join("-")]
                                    .quoteAssetPrecision
                            )}
                    </p>
                </div>

                <form
                    onSubmit={
                        isDeposit
                            ? (e) => {
                                  e.preventDefault()
                                  depositHandler(contracts[1], false)
                              }
                            : (e) => {
                                  e.preventDefault()
                                  withdrawHandler(contracts[1], false)
                              }
                    }
                >
                    <label htmlFor="token1" className="text-white">
                        {symbols && symbols[1]} Amount
                    </label>
                    <TextField
                        placeholder={"0.0000"}
                        variant="standard"
                        type="string"
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
                            balances[1] &&
                            exchangeBalances[1] &&
                            BigNumber.from(
                                Number(token2TransferAmount) > 0
                                    ? ethers.utils.parseUnits(
                                          token2TransferAmount,
                                          pair?.pairs[symbols.join("-")]
                                              .quoteAssetPrecision
                                      )
                                    : "0"
                            ).gt(
                                isDeposit
                                    ? balances[1]
                                    : exchangeBalances[1].deposited.sub(
                                          exchangeBalances[1].blocked
                                      )
                            )
                                ? { border: "1px solid #DD3D32" }
                                : { border: "1px solid transparent" }
                        }
                        id="token1"
                        value={token2TransferAmount}
                        onChange={(e) =>
                            handleInput(
                                e.target.value,
                                false,
                                setToken2TransferAmount
                            )
                        }
                    />
                    <FormHelperText
                        className={`text-inputErrorRed relative bottom-2 transition-all duration-300 ${
                            balances[1] &&
                            exchangeBalances[1] &&
                            BigNumber.from(
                                Number(token2TransferAmount) > 0
                                    ? ethers.utils.parseUnits(
                                          token2TransferAmount,
                                          pair?.pairs[symbols.join("-")]
                                              .quoteAssetPrecision
                                      )
                                    : "0"
                            ).gt(
                                isDeposit
                                    ? balances[1]
                                    : exchangeBalances[1].deposited.sub(
                                          exchangeBalances[1].blocked
                                      )
                            )
                                ? "opacity-100"
                                : "opacity-0"
                        }`}
                    >
                        You don't have enough
                        {isDeposit
                            ? ` ${symbols[1]} in your Wallet`
                            : " withdrawal balance"}{" "}
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
