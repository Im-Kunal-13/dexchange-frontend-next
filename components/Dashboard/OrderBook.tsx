import { useAppDispatch, useAppSelector } from "../../store/store"
import { useEffect } from "react"

// Import Interactions
import { getBuyOrders, getSellOrders } from "../../api/interactions"
import * as React from "react"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { ethers } from "ethers"

const OrderBook = () => {
    const { symbols, pair } = useAppSelector((state) => state.tokens)
    const { buyOrders, sellOrders } = useAppSelector((state) => state.order)

    const dispatch = useAppDispatch()

    useEffect(() => {
        getBuyOrders(dispatch)
        getSellOrders(dispatch)
    }, [])

    return (
        <div className="relative bg-black py-[0.75em] px-[1.75em] m-[0.75em] col-span-full overflow-y-scroll shadow-black1">
            <div className="flex items-center justify-between">
                <h2>Order Book</h2>
            </div>

            <div className="flex items-center gap-5 max-h-[550px]">
                {false ? (
                    <p className="flex-center">No Sell Orders</p>
                ) : (
                    <div className="flex flex-col my-10 h-full mb-auto">
                        <span className="text-lg px-4">Selling</span>
                        <TableContainer
                            component={Paper}
                            className="rounded-lg overflow-scroll bg-black min-h-[250px] max-h-[500px]"
                        >
                            <Table aria-label="customized table">
                                <TableHead className="bg-black border-b border-b-textGray1 border-opacity-20 sticky top-[0px]">
                                    <TableRow>
                                        <TableCell
                                            sx={{ borderBottom: "0" }}
                                            className="text-textGray1"
                                            align="center"
                                        >
                                            <span className="flex w-full justify-start items-center">
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
                                            className="text-textGray1"
                                        >
                                            <span className="flex items-center w-fit justify-end mr-auto">
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
                                    {sellOrders
                                        .filter((order) => {
                                            return (
                                                order.side === "sell" &&
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
                                                    } border-none px-8 h-5 py-0 my-0 ${
                                                        index === 0
                                                            ? "pt-2.5"
                                                            : "pt-0"
                                                    }`}
                                                    align="center"
                                                >
                                                    {ethers.utils.formatUnits(
                                                        order.remainingQuantity,
                                                        pair &&
                                                            pair.baseAssetPrecision !==
                                                                0
                                                            ? pair.baseAssetPrecision
                                                            : 0
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    align="left"
                                                    className={`text-white border-none px-8  h-5 py-0 my-0 ${
                                                        index === 0
                                                            ? "pt-2.5"
                                                            : "pt-0"
                                                    }`}
                                                >
                                                    {ethers.utils.formatUnits(
                                                        order.price,
                                                        pair &&
                                                            pair.quoteAssetPrecision !==
                                                                0
                                                            ? pair.quoteAssetPrecision
                                                            : 0
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                )}
                {false ? (
                    <p className="flex-center">No Buy Orders</p>
                ) : (
                    <div className="my-10 flex flex-col mb-auto">
                        <span className="text-lg px-4">Buying</span>
                        <TableContainer
                            component={Paper}
                            className="rounded-lg overflow-scroll bg-black min-h-[250px] max-h-[500px]"
                        >
                            <Table aria-label="customized table relative">
                                <TableHead className="bg-black border-b-0 shadow-tableStickyHead sticky top-0">
                                    <TableRow>
                                        <TableCell
                                            sx={{ borderBottom: "0" }}
                                            className="text-textGray1"
                                            align="center"
                                        >
                                            <span className="flex w-full justify-start items-center">
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
                                            className="text-textGray1"
                                        >
                                            <span className="flex items-center w-fit justify-end mr-auto">
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
                                    {buyOrders
                                        .filter((order) => {
                                            return (
                                                order.side === "buy" &&
                                                order.type === "limit" &&
                                                (order.status === "open" ||
                                                    order.status ===
                                                        "partially-filled") &&
                                                order.market ===
                                                    `${symbols[0]}-${symbols[1]}`
                                            )
                                        })
                                        .map((order, index) => (
                                            <TableRow key={order._id}>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    className={`${
                                                        order.side === "buy"
                                                            ? "text-textGreen1"
                                                            : "text-inputErrorRed"
                                                    } border-none px-8 h-5 py-0 my-0 ${
                                                        index === 0
                                                            ? "pt-2.5"
                                                            : "pt-0"
                                                    }`}
                                                    align="left"
                                                >
                                                    {ethers.utils.formatUnits(
                                                        order.remainingQuantity,
                                                        pair &&
                                                            pair.baseAssetPrecision !==
                                                                0
                                                            ? pair.baseAssetPrecision
                                                            : 0
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    align="left"
                                                    className={`text-white border-none px-8  h-5 py-0 my-0 ${
                                                        index === 0
                                                            ? "pt-2.5"
                                                            : "pt-0"
                                                    }`}
                                                >
                                                    {ethers.utils.formatUnits(
                                                        order.price,
                                                        pair &&
                                                            pair.quoteAssetPrecision !==
                                                                0
                                                            ? pair.quoteAssetPrecision
                                                            : 0
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderBook
