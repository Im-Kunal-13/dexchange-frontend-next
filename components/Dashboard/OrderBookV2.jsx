import { Button, Divider } from "@mui/material"
import { useState } from "react"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { cancelOrder } from "../../api/interactions"
import { useAppStateContext } from "../../context/contextProvider"
import { ethers } from "ethers"
import { formatTimestamp } from "../../utility"
import { useAppSelector } from "../../store/store"

const OrderBookV2 = () => {
    const [isTrades, setIsTrades] = useState(false)
    const { symbols, pair } = useAppSelector((state) => state.tokens)
    const { myOrders } = useAppSelector((state) => state.order)
    const { myTrades } = useAppSelector((state) => state.trade)

    //@ts-ignore
    const { setSnackbarInfo } = useAppStateContext()

    return (
        <div className="bg-bgSidebarGray1 border border-t-0 border-white border-opacity-10">
            <div className="flex items-center gap-2 px-[10px] py-[5px]">
                <Button
                    variant="text"
                    className={`normal-case ${
                        !isTrades
                            ? "bg-white bg-opacity-10 text-purple1"
                            : "text-textGray1  hover:text-white"
                    }  rounded-full w-full hover:bg-white hover:bg-opacity-20 border border-white p-[5px] m-[5px] text-[10px] font-bold leading-[1.6] tracking-[.9px]`}
                    onClick={() => setIsTrades(false)}
                >
                    ORDER BOOK
                </Button>
                <Button
                    variant="text"
                    className={`normal-case rounded-full w-full ${
                        isTrades
                            ? "bg-white bg-opacity-10 text-purple1"
                            : "text-textGray1  hover:text-white"
                    } rounded-full w-full hover:bg-white hover:bg-opacity-20 border border-white p-[5px] m-[5px] text-[10px] font-bold leading-[1.6] tracking-[.9px]`}
                    onClick={() => setIsTrades(true)}
                >
                    TRADES
                </Button>
            </div>
            <Divider className="bg-white bg-opacity-10" />
            {isTrades ? (
                <TableContainer
                    component={Paper}
                    className="bg-transparent flex flex-col justify-between"
                    style={{ height: "calc(100vh - 140px)" }}
                >
                    <div
                        className="h-[100%] overflow-y-scroll"
                        style={{ overflowY: "overlay" }}
                    >
                        <Table
                            aria-label="customized table"
                            className="relative"
                        >
                            <TableHead className="h-5 border-b-0 shadow-tableStickyHead sticky left-0 top-0 right-0 bg-bgSidebarGray1">
                                <TableRow className="flex items-center py-[5px]">
                                    <TableCell
                                        sx={{ borderBottom: "0" }}
                                        className="text-textGray1 whitespace-nowrap m-0 p-0 min-w-[40%]"
                                    >
                                        <span className="mx-auto w-fit text-[9px] font-bold leading-[1.6] tracking-[.9px] flex flex-col items-center">
                                            AMOUNT
                                            <span>
                                                ({symbols[0] && symbols[0]})
                                            </span>
                                        </span>
                                    </TableCell>
                                    <TableCell
                                        sx={{ borderBottom: "0" }}
                                        className="text-textGray1 whitespace-nowrap m-0 p-0 relative bottom-[1px] min-w-[25%]"
                                    >
                                        <span className="mx-auto w-fit text-[9px] font-bold leading-[1.6] tracking-[.9px] flex flex-col items-center">
                                            PRICE
                                            <span>
                                                ({symbols[1] && symbols[1]})
                                            </span>
                                        </span>
                                    </TableCell>
                                    <TableCell
                                        sx={{ borderBottom: "0" }}
                                        className="text-textGray1 whitespace-nowrap m-0 p-0 relative bottom-[1px] min-w-[35%]"
                                    >
                                        <span className="mx-auto w-fit text-[9px] font-bold leading-[1.6] tracking-[.9px] flex flex-col items-center">
                                            TIME
                                        </span>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {myTrades &&
                                    myTrades
                                        .filter((order) => {
                                            return (
                                                (order.status === "filled" ||
                                                    order.status ===
                                                        "partially-filled") &&
                                                order.market ===
                                                    symbols.join("-")
                                            )
                                        })
                                        .map((order, index) => (
                                            <TableRow
                                                key={index}
                                                className={`flex items-center justify-between p-0 h-[32px] w-full hover:bg-white hover:bg-opacity-10 transition-all duration-300 cursor-pointer ${
                                                    index === 0 && "mt-[10px]"
                                                }`}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    className={`${
                                                        order.side === "buy"
                                                            ? "text-textGreen1"
                                                            : "text-inputErrorRed"
                                                    } text-white border-none h-full text-[12px] leading-[1.3] font-semibold flex items-center justify-center min-w-[40%]`}
                                                >
                                                    {ethers.utils.formatUnits(
                                                        (
                                                            Number(
                                                                order.originalQuantity
                                                            ) -
                                                            Number(
                                                                order.remainingQuantity
                                                            )
                                                        ).toString(),
                                                        pair.pairs[
                                                            symbols.join("-")
                                                        ].baseAssetPrecision !==
                                                            0
                                                            ? pair.pairs[
                                                                  symbols.join(
                                                                      "-"
                                                                  )
                                                              ]
                                                                  .baseAssetPrecision
                                                            : 0
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    className={`border-none text-center text-white text-[12px] leading-[1.3] font-semibold h-full flex items-center justify-center min-w-[25%]`}
                                                >
                                                    {ethers.utils.formatUnits(
                                                        order.price,
                                                        pair.pairs[
                                                            symbols.join("-")
                                                        ]
                                                            .quoteAssetPrecision !==
                                                            0
                                                            ? pair.pairs[
                                                                  symbols.join(
                                                                      "-"
                                                                  )
                                                              ]
                                                                  .quoteAssetPrecision
                                                            : 0
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    className={`border-none text-center text-white text-[12px] leading-[1.3] font-semibold h-full flex items-center justify-center min-w-[35%]`}
                                                >
                                                    {formatTimestamp(
                                                        order.updatedAt
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                            </TableBody>
                        </Table>
                    </div>
                </TableContainer>
            ) : (
                <TableContainer
                    component={Paper}
                    className="bg-transparent flex flex-col justify-between"
                    style={{ height: "calc(100vh - 140px)" }}
                >
                    <div
                        className="h-[50%] custom-scrollbar"
                        style={{ overflowY: "overlay" }}
                    >
                        <Table
                            aria-label="customized table"
                            className="relative"
                        >
                            <TableHead className="h-5 border-b-0 shadow-tableStickyHead sticky left-0 top-0 right-0 bg-bgSidebarGray1">
                                <TableRow className="flex items-center justify-between px-[20px] py-[5px]">
                                    <TableCell
                                        sx={{ borderBottom: "0" }}
                                        className="text-textGray1 whitespace-nowrap m-0 p-0"
                                    >
                                        <span className="mx-auto w-fit text-[9px] font-bold leading-[1.6] tracking-[.9px]">
                                            AMOUNT ({symbols[0] && symbols[0]})
                                        </span>
                                    </TableCell>
                                    <TableCell
                                        sx={{ borderBottom: "0" }}
                                        className="text-textGray1 whitespace-nowrap m-0 p-0 relative bottom-[1px]"
                                    >
                                        <span className="mx-auto w-fit text-[9px] font-bold leading-[1.6] tracking-[.9px]">
                                            PRICE ({symbols[1] && symbols[1]})
                                        </span>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {myOrders &&
                                    myOrders
                                        .filter((order) => {
                                            return (
                                                order.type === "limit" &&
                                                order.type === "sell" &&
                                                (order.status === "open" ||
                                                    order.status ===
                                                        "partially-filled") &&
                                                order.market ===
                                                    `${symbols[0]}-${symbols[1]}`
                                            )
                                        })
                                        .map((order, index) => (
                                            <TableRow
                                                key={index}
                                                className={`flex items-center justify-between p-0 h-[32px] hover:bg-white hover:bg-opacity-10 transition-all duration-300 cursor-pointer ${
                                                    index === 0 && "mt-[10px]"
                                                }`}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    className={`${
                                                        order.side === "buy"
                                                            ? "text-textGreen1"
                                                            : "text-inputErrorRed"
                                                    } text-white border-none h-full text-[12px] leading-[1.3] font-semibold flex items-center px-[20px]`}
                                                    align="left"
                                                >
                                                    {ethers.utils.formatUnits(
                                                        order.remainingQuantity,
                                                        pair &&
                                                            pair.pairs[
                                                                symbols.join(
                                                                    "-"
                                                                )
                                                            ]
                                                                .baseAssetPrecision !==
                                                                0
                                                            ? pair.pairs[
                                                                  symbols.join(
                                                                      "-"
                                                                  )
                                                              ]
                                                                  .baseAssetPrecision
                                                            : 0
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    className={`border-none text-center text-white text-[12px] leading-[1.3] font-semibold h-full flex items-center px-[20px]`}
                                                >
                                                    {ethers.utils.formatUnits(
                                                        order.price,
                                                        pair.pairs[
                                                            symbols.join("-")
                                                        ]
                                                            .quoteAssetPrecision !==
                                                            0
                                                            ? pair.pairs[
                                                                  symbols.join(
                                                                      "-"
                                                                  )
                                                              ]
                                                                  .quoteAssetPrecision
                                                            : 0
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                            </TableBody>
                        </Table>
                    </div>
                    <Divider className="bg-white bg-opacity-10" />
                    <div
                        className="h-[50%] custom-scrollbar"
                        style={{ overflowY: "overlay" }}
                    >
                        <Table
                            aria-label="customized table"
                            className="relative"
                        >
                            <TableHead className="h-5 border-b-0 shadow-tableStickyHead sticky left-0 top-0 right-0 bg-bgSidebarGray1">
                                <TableRow className="flex items-center justify-between px-[20px] py-[5px]">
                                    <TableCell
                                        sx={{ borderBottom: "0" }}
                                        className="text-textGray1 whitespace-nowrap m-0 p-0"
                                    >
                                        <span className="mx-auto w-fit text-[9px] font-bold leading-[1.6] tracking-[.9px]">
                                            AMOUNT ({symbols[0] && symbols[0]})
                                        </span>
                                    </TableCell>
                                    <TableCell
                                        sx={{ borderBottom: "0" }}
                                        className="text-textGray1 whitespace-nowrap m-0 p-0 relative bottom-[1px]"
                                    >
                                        <span className="mx-auto w-fit text-[9px] font-bold leading-[1.6] tracking-[.9px]">
                                            PRICE ({symbols[1] && symbols[1]})
                                        </span>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {myOrders &&
                                    myOrders
                                        .filter((order) => {
                                            return (
                                                order.type === "limit" &&
                                                order.side === "buy" &&
                                                (order.status === "open" ||
                                                    order.status ===
                                                        "partially-filled") &&
                                                order.market ===
                                                    `${symbols[0]}-${symbols[1]}`
                                            )
                                        })
                                        .map((order, index) => (
                                            <TableRow
                                                key={index}
                                                className={`flex items-center justify-between p-0 h-[32px] hover:bg-white hover:bg-opacity-10 transition-all duration-300 cursor-pointer ${
                                                    index === 0 && "mt-[10px]"
                                                }`}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    className={`${
                                                        order.side === "buy"
                                                            ? "text-textGreen1"
                                                            : "text-inputErrorRed"
                                                    } text-white border-none h-full text-[12px] leading-[1.3] font-semibold flex items-center px-[20px]`}
                                                    align="left"
                                                >
                                                    {ethers.utils.formatUnits(
                                                        order.remainingQuantity,
                                                        pair &&
                                                            pair.pairs[
                                                                symbols.join(
                                                                    "-"
                                                                )
                                                            ]
                                                                .baseAssetPrecision !==
                                                                0
                                                            ? pair.pairs[
                                                                  symbols.join(
                                                                      "-"
                                                                  )
                                                              ]
                                                                  .baseAssetPrecision
                                                            : 0
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    className={`border-none text-center text-white text-[12px] leading-[1.3] font-semibold h-full flex items-center px-[20px]`}
                                                >
                                                    {ethers.utils.formatUnits(
                                                        order.price,
                                                        pair.pairs[
                                                            symbols.join("-")
                                                        ]
                                                            .quoteAssetPrecision !==
                                                            0
                                                            ? pair.pairs[
                                                                  symbols.join(
                                                                      "-"
                                                                  )
                                                              ]
                                                                  .quoteAssetPrecision
                                                            : 0
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                            </TableBody>
                        </Table>
                    </div>
                </TableContainer>
            )}
        </div>
    )
}

export default OrderBookV2
