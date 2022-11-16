import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../store/store"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { Button } from "@mui/material"
import {
    cancelOrder,
    getCancelledOrders,
    getMyOrders,
    loadTrades,
} from "../../api/interactions"
import { useAppStateContext } from "../../context/contextProvider"
import { ethers } from "ethers"
import { formatTimestamp } from "../../utility"

const Transactions = () => {
    const { symbols, pair } = useAppSelector((state) => state.tokens)
    const { account } = useAppSelector((state) => state.provider)
    const { myOrders } = useAppSelector((state) => state.order)
    const { myTrades } = useAppSelector((state) => state.trade)

    const dispatch = useAppDispatch()

    const tradeRef = useRef(null)
    const orderRef = useRef<HTMLButtonElement>(null)

    const [isOrders, setIsOrders] = useState(true)

    //@ts-ignore
    const { setSnackbarInfo } = useAppStateContext()

    useEffect(() => {
        if (account) {
            getMyOrders(account, dispatch)
            loadTrades(dispatch, account)
            getCancelledOrders(account, dispatch)
        }
    }, [account])

    return (
        <div className="relative bg-black py-[0.75em] px-[1.75em] m-[0.75em] col-start-1 col-end-7 overflow-y-scroll shadow-black1">
            <div className="flex items-center justify-between px-1.5 sticky top-[0px]">
                <h2>My Orders</h2>
                <div className="bg-bgGray1 rounded p-[0.2em]">
                    <button
                        onClick={() => {
                            setIsOrders(true)
                        }}
                        ref={orderRef}
                        className={`${
                            isOrders ? "bg-btnBlue1" : "bg-transparent"
                        } text-white min-w-[6em] py-[0.25em] px-[0.5em] border-none rounded font-medium cursor-pointer relative`}
                    >
                        Orders
                    </button>
                    <button
                        onClick={() => {
                            setIsOrders(false)
                        }}
                        ref={tradeRef}
                        className={`${
                            !isOrders ? "bg-btnBlue1" : "bg-transparent"
                        } text-white min-w-[6em] py-[0.25em] px-[0.5em] border-none rounded font-medium cursor-pointer relative`}
                    >
                        Trades
                    </button>
                </div>
            </div>
            {isOrders ? (
                <TableContainer
                    component={Paper}
                    className="rounded-lg overflow-scroll bg-black min-h-[200px] max-h-[400px] mt-5"
                >
                    <Table aria-label="customized table">
                        <TableHead className="bg-black sticky top-[0px] h-5 z-10 border-opacity-20 shadow-tableStickyHead">
                            <TableRow>
                                <TableCell
                                    sx={{ borderBottom: "0" }}
                                    className="text-textGray1 whitespace-nowrap m-0 px-0"
                                    align="left"
                                >
                                    <span className="flex justify-start items-center">
                                        AMOUNT ({symbols && symbols[0]})
                                    </span>
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ borderBottom: "0" }}
                                    className="text-textGray1 whitespace-nowrap"
                                >
                                    <span className="flex items-center mx-auto w-fit">
                                        PRICE ({symbols && symbols[1]})
                                    </span>
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ borderBottom: "0" }}
                                    className=" whitespace-nowrap bg-black"
                                >
                                    <span className="text-textGray1">
                                        ACTION
                                    </span>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="bg-black">
                            {myOrders &&
                                myOrders
                                    .filter((order) => {
                                        return (
                                            order.type === "limit" &&
                                            (order.status === "open" ||
                                                order.status ===
                                                    "partially-filled") &&
                                            order.market ===
                                                `${symbols[0]}-${symbols[1]}`
                                        )
                                    })
                                    .map((order, index) => (
                                        <TableRow key={index}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                className={`${
                                                    order.side === "buy"
                                                        ? "text-textGreen1"
                                                        : "text-inputErrorRed"
                                                } text-white border-none h-5 py-0.5 my-0 ${
                                                    index === 0
                                                        ? "pt-2.5"
                                                        : "pt-0"
                                                }`}
                                                align="left"
                                            >
                                                {ethers.utils.formatUnits(
                                                    order.remainingQuantity,
                                                    pair &&
                                                        pair.pairs[symbols.join("-")]
                                                            .baseAssetPrecision !==
                                                            0
                                                        ? pair.pairs[
                                                              symbols.join("-")
                                                          ].baseAssetPrecision
                                                        : 0
                                                )}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                className={`border-none text-center text-white h-5 py-0.5 my-0 ${
                                                    index === 0
                                                        ? "pt-2.5"
                                                        : "pt-0"
                                                }`}
                                            >
                                                {ethers.utils.formatUnits(
                                                    order.price,
                                                    pair.pairs[symbols.join("-")]
                                                        .quoteAssetPrecision !==
                                                        0
                                                        ? pair.pairs[
                                                              symbols.join("-")
                                                          ].quoteAssetPrecision
                                                        : 0
                                                )}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                className={`text-white border-none h-5 py-0.5 my-0 ${
                                                    index === 0
                                                        ? "pt-2.5"
                                                        : "pt-0"
                                                }`}
                                            >
                                                <Button
                                                    variant="outlined"
                                                    type="submit"
                                                    className="normal-case font-bold py-0.5 px-3 text-xs rounded flex items-center gap-1 hover:gap-2.5 transition-all duration-500 border-btnBlue1 hover:border-inputErrorRed hover:text-inputErrorRed mx-auto"
                                                    onClick={() => {
                                                        cancelOrder(
                                                            order,
                                                            dispatch,
                                                            setSnackbarInfo
                                                        )
                                                    }}
                                                >
                                                    <span>Cancel</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <TableContainer
                    component={Paper}
                    className="rounded-lg overflow-scroll bg-black min-h-[200px] max-h-[400px] mt-5"
                >
                    <Table aria-label="customized table">
                        <TableHead className="bg-black sticky top-[0px] h-5 z-10 border-opacity-20 shadow-tableStickyHead">
                            <TableRow>
                                <TableCell
                                    sx={{ borderBottom: "0" }}
                                    className="text-textGray1 whitespace-nowrap m-0"
                                    align="center"
                                >
                                    <span className="text-textGray1">Time</span>
                                    <img src="/images/sort.svg" alt="Sort" />
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ borderBottom: "0" }}
                                    className="text-textGray1 whitespace-nowrap"
                                >
                                    <span className="flex w-fit ml-auto justify-start items-center">
                                        AMOUNT ({symbols && symbols[0]})
                                        <img
                                            src="/images/sort.svg"
                                            alt="Sort"
                                        />
                                    </span>
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ borderBottom: "0" }}
                                    className=" whitespace-nowrap bg-black"
                                >
                                    <span className="flex items-center mx-auto w-fit text-textGray1">
                                        PRICE ({symbols && symbols[1]})
                                        <img
                                            src="/images/sort.svg"
                                            alt="Sort"
                                        />
                                    </span>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="bg-black">
                            {myTrades
                                .filter((order) => {
                                    return (
                                        (order.status === "filled" ||
                                            order.status ===
                                                "partially-filled") &&
                                        order.market === symbols.join("-")
                                    )
                                })
                                .map((order, index) => (
                                    <TableRow key={index}>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            className={`text-white border-none  h-5 py-0 my-0 whitespace-nowrap ${
                                                index === 0 ? "pt-2.5" : "pt-0"
                                            }`}
                                            align="center"
                                        >
                                            {formatTimestamp(order.updatedAt)}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            className={`${
                                                order.side === "buy"
                                                    ? "text-textGreen1"
                                                    : "text-inputErrorRed"
                                            }  border-none text-center text-white h-5 py-0 my-0 ${
                                                index === 0 ? "pt-2.5" : "pt-0"
                                            }`}
                                        >
                                            <span className="ml-7 w-fit">
                                                {order.side === "sell"
                                                    ? "-"
                                                    : "+"}{" "}
                                                {ethers.utils.formatUnits(
                                                    (
                                                        Number(
                                                            order.originalQuantity
                                                        ) -
                                                        Number(
                                                            order.remainingQuantity
                                                        )
                                                    ).toString(),
                                                    pair.pairs[symbols.join("-")]
                                                        .baseAssetPrecision !==
                                                        0
                                                        ? pair.pairs[
                                                              symbols.join("-")
                                                          ].baseAssetPrecision
                                                        : 0
                                                )}
                                            </span>
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            className={`text-white border-none h-5 py-0 my-0 ${
                                                index === 0 ? "pt-2.5" : "pt-0"
                                            }`}
                                        >
                                            {ethers.utils.formatUnits(
                                                order.price,
                                                pair.pairs[symbols.join("-")]
                                                    .quoteAssetPrecision !== 0
                                                    ? pair.pairs[symbols.join("-")]
                                                          .quoteAssetPrecision
                                                    : 0
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <div className="w-1 h-[99%] rounded-full bg-btnBlue1 absolute right-0.5 top-0" />
        </div>
    )
}

export default Transactions
