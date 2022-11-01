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
import { truncateDecimals } from "../../utility"

const OrderBook = () => {
    const { symbols } = useAppSelector((state) => state.tokens)
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
                                                {symbols && symbols[0]}
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
                                            <span className="flex items-center mx-auto w-fit">
                                                {symbols && symbols[0]} /{" "}
                                                {symbols && symbols[1]}
                                                <img
                                                    src="/images/sort.svg"
                                                    alt="Sort"
                                                />
                                            </span>
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ borderBottom: "0" }}
                                            className="text-textGray1"
                                        >
                                            <span className="flex items-center w-full justify-end ml-auto">
                                                {symbols && symbols[1]}
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
                                                order.status !== "cancelled" &&
                                                order.market ===
                                                    `${symbols[0]}-${symbols[1]}`
                                            )
                                        })
                                        .map((order, index) => (
                                            <TableRow key={index}>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    className="text-white border-none px-8 h-5 py-2.5"
                                                    align="center"
                                                >
                                                    {order.originalQuantity}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    className="border-none text-textGreen1 text-center h-5 py-2.5"
                                                >
                                                    {truncateDecimals(
                                                        (
                                                            Number(
                                                                order.originalQuantity
                                                            ) /
                                                            Number(order.price)
                                                        ).toString(),
                                                        5
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    className="text-white border-none px-8 h-5 py-2.5"
                                                >
                                                    {order.price}
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
                                                {symbols && symbols[0]}
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
                                            <span className="flex items-center mx-auto w-fit">
                                                {symbols && symbols[0]} /{" "}
                                                {symbols && symbols[1]}
                                                <img
                                                    src="/images/sort.svg"
                                                    alt="Sort"
                                                />
                                            </span>
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ borderBottom: "0" }}
                                            className="text-textGray1"
                                        >
                                            <span className="flex items-center w-full justify-end ml-auto">
                                                {symbols && symbols[1]}
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
                                                order.status !== "cancelled" &&
                                                order.market ===
                                                    `${symbols[0]}-${symbols[1]}`
                                            )
                                        })
                                        .map((order) => (
                                            <TableRow key={order._id}>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    className="text-white border-none px-8 mt-0 h-5 py-2.5"
                                                    align="center"
                                                >
                                                    {order.originalQuantity}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    className="border-none text-textGreen1 text-center h-5 py-2.5"
                                                >
                                                    {truncateDecimals(
                                                        (
                                                            Number(
                                                                order.originalQuantity
                                                            ) /
                                                            Number(order.price)
                                                        ).toString(),
                                                        5
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    className="text-white border-none px-8 h-5 py-2.5"
                                                >
                                                    {order.price}
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
