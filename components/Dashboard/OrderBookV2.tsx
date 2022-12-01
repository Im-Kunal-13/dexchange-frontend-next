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
import { DataGrid, GridColDef } from "@mui/x-data-grid"

const OrderBookV2 = () => {
    const [isTrades, setIsTrades] = useState(false)
    const { symbols, pair } = useAppSelector((state) => state.tokens)
    const { myOrders, buyOrders, sellOrders } = useAppSelector(
        (state) => state.order
    )
    const { myTrades, allTrades } = useAppSelector((state) => state.trade)

    // Grid
    const orderColumns: GridColDef[] = [
        {
            field: "amount",
            headerName: "AMOUNT",

            flex: 1,
            sortable: false,
            align: "center",
            headerAlign: "center",
            renderHeader: () => (
                <span className="text-[9px] font-bold leading-[1.6] tracking-[.9px] text-textGray1 flex flex-col items-center">
                    AMOUNT
                    <span>({symbols[0] && symbols[0]})</span>
                </span>
            ),
            renderCell: (cellValues) => {
                console.log(cellValues)
                return (
                    <span
                        className={`relative bottom-[14px] text-[12px] leading-[1.3] font-semibold ${
                            cellValues.row.side === "buy"
                                ? "text-textGreen1"
                                : "text-inputErrorRed"
                        }`}
                    >
                        {cellValues.formattedValue}
                    </span>
                )
            },
        },
        {
            field: "price",
            headerName: "PRICE",

            flex: 1,
            sortable: false,
            align: "center",
            headerAlign: "center",
            renderHeader: () => (
                <span className="text-[9px] font-bold leading-[1.6] tracking-[.9px] text-textGray1 flex flex-col items-center">
                    PRICE
                    <span>({symbols[1] && symbols[1]})</span>
                </span>
            ),
            renderCell: (cellValues) => {
                return (
                    <span className="relative bottom-[14px] text-[12px] leading-[1.3] font-semibold">
                        {cellValues.formattedValue}
                    </span>
                )
            },
        },
    ]
    const tradeColumns: GridColDef[] = [
        {
            field: "amount",
            headerName: "AMOUNT",

            flex: 1,
            sortable: false,
            align: "center",
            headerAlign: "center",
            renderHeader: () => (
                <span className="text-[9px] font-bold leading-[1.6] tracking-[.9px] text-textGray1 flex flex-col items-center">
                    AMOUNT
                    <span>({symbols[0] && symbols[0]})</span>
                </span>
            ),
            renderCell: (cellValues) => {
                console.log(cellValues)
                return (
                    <span
                        className={`relative bottom-[14px] text-[12px] leading-[1.3] font-semibold ${
                            cellValues.row.side === "buy"
                                ? "text-textGreen1"
                                : "text-inputErrorRed"
                        }`}
                    >
                        {cellValues.formattedValue}
                    </span>
                )
            },
        },
        {
            field: "price",
            headerName: "PRICE",

            flex: 1,
            sortable: false,
            align: "center",
            headerAlign: "center",
            renderHeader: () => (
                <span className="text-[9px] font-bold leading-[1.6] tracking-[.9px] text-textGray1 flex flex-col items-center">
                    PRICE
                    <span>({symbols[1] && symbols[1]})</span>
                </span>
            ),
            renderCell: (cellValues) => {
                return (
                    <span className="relative bottom-[14px] text-[12px] leading-[1.3] font-semibold">
                        {cellValues.formattedValue}
                    </span>
                )
            },
        },
        {
            field: "time",
            headerName: "TIME",
            type: "string",

            flex: 1,
            sortable: false,
            align: "center",
            headerAlign: "center",
            renderCell: (cellValues) => {
                return (
                    <span className="relative bottom-[14px]">
                        {cellValues.formattedValue}
                    </span>
                )
            },
        },
    ]

    //@ts-ignore
    const { setSnackbarInfo } = useAppStateContext()

    return (
        <div className="bg-bgSidebarGray1 border border-t-0 border-white border-opacity-10 h-full">
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
                <DataGrid
                    classes={{
                        root: "bg-black border-none bg-bgSidebarGray1",
                        checkboxInput: "text-white",
                        sortIcon: "hidden",
                        columnHeaderTitle:
                            "text-textGray1 leading-[1.6] tracking-[.9px] font-bold text-[10px]",
                        cellContent:
                            "h-[30px] min-h-[30px] max-h-[30px] text-white leading-[1.3] tracking-[.9px] font-semibold text-[12px]",
                        iconSeparator: "stroke-black w-[20px]",
                    }}
                    className="text-white"
                    style={{ height: "calc(550px)" }}
                    rows={
                        allTrades &&
                        allTrades
                            .filter((trade) => {
                                return (
                                    (trade.status === "filled" ||
                                        trade.status === "partially-filled") &&
                                    trade.market === symbols.join("-")
                                )
                            })
                            .map((trade) => ({
                                id: trade._id,
                                amount: ethers.utils.formatUnits(
                                    (
                                        Number(trade.originalQuantity) -
                                        Number(trade.remainingQuantity)
                                    ).toString(),
                                    pair.pairs[symbols.join("-")]
                                        .baseAssetPrecision !== 0
                                        ? pair.pairs[symbols.join("-")]
                                              .baseAssetPrecision
                                        : 0
                                ),
                                price: ethers.utils.formatUnits(
                                    trade.price,
                                    pair.pairs[symbols.join("-")]
                                        .quoteAssetPrecision !== 0
                                        ? pair.pairs[symbols.join("-")]
                                              .quoteAssetPrecision
                                        : 0
                                ),
                                time: formatTimestamp(trade.updatedAt),
                            }))
                    }
                    columns={tradeColumns}
                    disableSelectionOnClick
                    hideFooterPagination
                    hideFooter
                    disableColumnMenu
                />
            ) : (
                <DataGrid
                    classes={{
                        root: "bg-black border-none bg-bgSidebarGray1",
                        checkboxInput: "text-white",
                        sortIcon: "hidden",
                        columnHeaderTitle:
                            "text-textGray1 leading-[1.6] tracking-[.9px] font-bold text-[10px]",
                        cellContent:
                            "h-[30px] min-h-[30px] max-h-[30px] text-white leading-[1.3] tracking-[.9px] font-semibold text-[12px]",
                        iconSeparator: "stroke-black w-[20px]",
                    }}
                    className="text-white"
                    style={{ height: "calc(550px)" }}
                    rows={buyOrders.concat(sellOrders).map((trade) => ({
                        id: trade._id,
                        amount: ethers.utils.formatUnits(
                            trade.remainingQuantity,
                            pair &&
                                pair.pairs[symbols.join("-")]
                                    .baseAssetPrecision !== 0
                                ? pair.pairs[symbols.join("-")]
                                      .baseAssetPrecision
                                : 0
                        ),
                        price: ethers.utils.formatUnits(
                            trade.price,
                            pair.pairs[symbols.join("-")]
                                .quoteAssetPrecision !== 0
                                ? pair.pairs[symbols.join("-")]
                                      .quoteAssetPrecision
                                : 0
                        ),
                    }))}
                    columns={orderColumns}
                    disableSelectionOnClick
                    hideFooterPagination
                    hideFooter
                    disableColumnMenu
                />
            )}
        </div>
    )
}

export default OrderBookV2
