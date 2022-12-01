import { Button, Divider, IconButton } from "@mui/material"
import { useState } from "react"
import { ethers } from "ethers"
import { formatTimestamp } from "../../utility"
import { useAppSelector } from "../../store/store"
import RefreshIcon from "@mui/icons-material/Refresh"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import InfoIcon from "@mui/icons-material/Info"
import DoneIcon from "@mui/icons-material/Done"
import AutorenewIcon from "@mui/icons-material/Autorenew"
import ReportProblemIcon from "@mui/icons-material/ReportProblem"

const columns: GridColDef[] = [
    {
        field: "amount",
        headerName: "AMOUNT",

        flex: 1,
        sortable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (cellValues) => {
            console.log(cellValues)
            return (
                <span
                    className={`relative bottom-[14px] ${
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
        renderCell: (cellValues) => {
            return (
                <span className="relative bottom-[14px]">
                    {cellValues.formattedValue}
                </span>
            )
        },
    },
    {
        field: "side",
        headerName: "SIDE",
        type: "string",

        flex: 1,
        sortable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (cellValues) => {
            return (
                <span
                    className={`relative bottom-[14px] capitalize ${
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
        field: "orderStatus",
        headerName: "STATUS",
        type: "string",

        flex: 1,
        sortable: false,
        align: "center",
        headerAlign: "center",

        renderCell: (cellValues) => {
            return (
                <span
                    className={`relative bottom-[10px] border-[2px] rounded-full px-1 py-[1px] flex items-center gap-[5px] ${
                        cellValues.formattedValue === "open"
                            ? "border-blue1 text-blue1"
                            : cellValues.formattedValue === "partially-filled"
                            ? "border-btcYellow text-btcYellow"
                            : cellValues.formattedValue === "filled"
                            ? "border-textGreen1 text-green1"
                            : "border-inputErrorRed text-inputErrorRed"
                    }`}
                >
                    {cellValues.formattedValue === "open" ? (
                        <InfoIcon className="text-lg" />
                    ) : cellValues.formattedValue === "partially-filled" ? (
                        <AutorenewIcon className="text-lg" />
                    ) : cellValues.formattedValue === "filled" ? (
                        <DoneIcon className="text-lg" />
                    ) : (
                        <ReportProblemIcon className="text-lg" />
                    )}

                    <span className="mr-1 capitalize">
                        {cellValues.formattedValue}
                    </span>
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

const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: "Kunal", age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
]
const MyOrderBookV2 = () => {
    const [activeTab, setActiveTab] = useState("all_orders")
    const { symbols, pair } = useAppSelector((state) => state.tokens)
    const { myOrders, buyOrders, sellOrders, cancelledOrders } = useAppSelector(
        (state) => state.order
    )
    const { myTrades, allTrades } = useAppSelector((state) => state.trade)

    return (
        <div className="bg-bgSidebarGray1 border border-t-0 border-r-0 border-white border-opacity-10">
            <div className="flex items-center justify-between   pl-[35px] pr-[20px] py-[5px]">
                <div className="flex items-center gap-6">
                    <Button
                        variant="text"
                        className={`normal-case rounded-full w-full ${
                            activeTab === "trades"
                                ? "bg-white bg-opacity-10 text-purple1"
                                : "text-textGray1  hover:text-white"
                        } rounded-full w-fit px-[16px] hover:bg-white hover:bg-opacity-20 border border-white p-[5px] text-[10px] font-bold leading-[1.6] tracking-[.9px]`}
                        onClick={() => setActiveTab("trades")}
                    >
                        TRADES
                    </Button>
                    <Button
                        variant="text"
                        className={`normal-case ${
                            activeTab === "all_orders"
                                ? "bg-white bg-opacity-10 text-purple1"
                                : "text-textGray1  hover:text-white"
                        }  rounded-full w-fit px-[16px] hover:bg-white hover:bg-opacity-20 border border-white p-[5px] text-[10px] font-bold leading-[1.6] tracking-[.9px]`}
                        onClick={() => setActiveTab("all_orders")}
                    >
                        All Orders
                    </Button>
                    <Button
                        variant="text"
                        className={`normal-case ${
                            activeTab === "buy_orders"
                                ? "bg-white bg-opacity-10 text-purple1"
                                : "text-textGray1  hover:text-white"
                        }  rounded-full w-fit px-[16px] hover:bg-white hover:bg-opacity-20 border border-white p-[5px] text-[10px] font-bold leading-[1.6] tracking-[.9px]`}
                        onClick={() => setActiveTab("buy_orders")}
                    >
                        Buy Orders
                    </Button>
                    <Button
                        variant="text"
                        className={`normal-case ${
                            activeTab === "sell_orders"
                                ? "bg-white bg-opacity-10 text-purple1"
                                : "text-textGray1  hover:text-white"
                        }  rounded-full w-fit px-[16px] hover:bg-white hover:bg-opacity-20 border border-white p-[5px] text-[10px] font-bold leading-[1.6] tracking-[.9px]`}
                        onClick={() => setActiveTab("sell_orders")}
                    >
                        Sell Orders
                    </Button>
                    <Button
                        variant="text"
                        className={`normal-case ${
                            activeTab === "cancelled_orders"
                                ? "bg-white bg-opacity-10 text-purple1"
                                : "text-textGray1  hover:text-white"
                        }  rounded-full w-fit px-[16px] hover:bg-white hover:bg-opacity-20 border border-white p-[5px] text-[10px] font-bold leading-[1.6] tracking-[.9px]`}
                        onClick={() => setActiveTab("cancelled_orders")}
                    >
                        Cancelled Orders
                    </Button>
                </div>
                <IconButton className="rounded-full rotate-0 hover:rotate-[45deg] transition-all duration-300 bg-white bg-opacity-10 hover:bg-white hover:bg-opacity-20 relative bottom-[2px] p-[5px]s">
                    <RefreshIcon className="text-white text-lg" />
                </IconButton>
            </div>
            <Divider className="bg-white bg-opacity-10" />
            {activeTab === "trades" ? (
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
                    rows={myTrades.map((trade) => ({
                        id: trade._id,
                        amount: ethers.utils.formatUnits(
                            trade.originalQuantity,
                            pair &&
                                symbols[0] &&
                                pair.pairs[symbols.join("-")]
                                    .baseAssetPrecision !== 0
                                ? pair.pairs[symbols.join("-")]
                                      .baseAssetPrecision
                                : 0
                        ),
                        price: ethers.utils.formatUnits(
                            trade.price,
                            pair &&
                                symbols[0] &&
                                pair.pairs[symbols.join("-")]
                                    .quoteAssetPrecision !== 0
                                ? pair.pairs[symbols.join("-")]
                                      .quoteAssetPrecision
                                : 0
                        ),
                        side: trade.side,
                        orderStatus: trade.status,
                        time: formatTimestamp(trade.updatedAt),
                    }))}
                    columns={columns}
                    disableSelectionOnClick
                    hideFooterPagination
                    hideFooter
                    disableColumnMenu
                />
            ) : activeTab === "buy_orders" ? (
                <DataGrid
                    classes={{
                        root: "bg-black border-none bg-bgSidebarGray1",
                        checkboxInput: "text-white",
                        sortIcon: "hidden",
                        columnHeaderTitle:
                            "text-textGray1 leading-[1.6] tracking-[.9px] font-bold text-[10px]",
                        cellContent:
                            "h-[30px] min-h-[30px] max-h-[30px]  text-white leading-[1.3] tracking-[.9px] font-semibold text-[12px]",
                        iconSeparator: "stroke-black w-[20px]",
                    }}
                    className="text-white"
                    style={{ height: "calc(550px)" }}
                    rows={myOrders
                        .filter(
                            (order) =>
                                order.side === "buy" &&
                                (order.status === "open" ||
                                    order.status === "partially-filled")
                        )
                        .map((order) => ({
                            id: order._id,
                            amount: ethers.utils.formatUnits(
                                order.remainingQuantity,
                                pair &&
                                    symbols[0] &&
                                    pair.pairs[symbols.join("-")]
                                        .baseAssetPrecision !== 0
                                    ? pair.pairs[symbols.join("-")]
                                          .baseAssetPrecision
                                    : 0
                            ),
                            price: ethers.utils.formatUnits(
                                order.price,
                                pair &&
                                    symbols[0] &&
                                    pair.pairs[symbols.join("-")]
                                        .quoteAssetPrecision !== 0
                                    ? pair.pairs[symbols.join("-")]
                                          .quoteAssetPrecision
                                    : 0
                            ),
                            side: order.side,
                            orderStatus: order.status,
                            time: formatTimestamp(order.updatedAt),
                        }))}
                    columns={columns}
                    disableSelectionOnClick
                    hideFooterPagination
                    hideFooter
                    disableColumnMenu
                />
            ) : activeTab === "sell_orders" ? (
                <DataGrid
                    classes={{
                        root: "bg-black border-none bg-bgSidebarGray1",
                        checkboxInput: "text-white",
                        sortIcon: "hidden",
                        columnHeaderTitle:
                            "text-textGray1 leading-[1.6] tracking-[.9px] font-bold text-[10px]",
                        cellContent:
                            "h-[30px] min-h-[30px] max-h-[30px]  text-white leading-[1.3] tracking-[.9px] font-semibold text-[12px]",
                        iconSeparator: "stroke-black w-[20px]",
                    }}
                    className="text-white"
                    style={{ height: "calc(550px)" }}
                    rows={myOrders
                        .filter(
                            (order) =>
                                order.side === "sell" &&
                                (order.status === "open" ||
                                    order.status === "partially-filled")
                        )
                        .map((order) => ({
                            id: order._id,
                            amount: ethers.utils.formatUnits(
                                order.remainingQuantity,
                                pair &&
                                    symbols[0] &&
                                    pair.pairs[symbols.join("-")]
                                        .baseAssetPrecision !== 0
                                    ? pair.pairs[symbols.join("-")]
                                          .baseAssetPrecision
                                    : 0
                            ),
                            price: ethers.utils.formatUnits(
                                order.price,
                                pair &&
                                    symbols[0] &&
                                    pair.pairs[symbols.join("-")]
                                        .quoteAssetPrecision !== 0
                                    ? pair.pairs[symbols.join("-")]
                                          .quoteAssetPrecision
                                    : 0
                            ),
                            side: order.side,
                            orderStatus: order.status,
                            time: formatTimestamp(order.updatedAt),
                        }))}
                    columns={columns}
                    disableSelectionOnClick
                    hideFooterPagination
                    hideFooter
                    disableColumnMenu
                />
            ) : activeTab === "all_orders" ? (
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
                    rows={myOrders
                        .filter(
                            (order) =>
                                order.status === "open" ||
                                order.status === "partially-filled"
                        )
                        .concat(cancelledOrders)
                        .map((order) => ({
                            id: order._id,
                            amount: ethers.utils.formatUnits(
                                order.remainingQuantity,
                                pair &&
                                    symbols[0] &&
                                    pair.pairs[symbols.join("-")]
                                        .baseAssetPrecision !== 0
                                    ? pair.pairs[symbols.join("-")]
                                          .baseAssetPrecision
                                    : 0
                            ),
                            price: ethers.utils.formatUnits(
                                order.price,
                                pair &&
                                    symbols[0] &&
                                    pair.pairs[symbols.join("-")]
                                        .quoteAssetPrecision !== 0
                                    ? pair.pairs[symbols.join("-")]
                                          .quoteAssetPrecision
                                    : 0
                            ),
                            side: order.side,
                            orderStatus: order.status,
                            time: formatTimestamp(order.updatedAt),
                        }))}
                    columns={columns}
                    disableSelectionOnClick
                    hideFooterPagination
                    hideFooter
                    disableColumnMenu
                />
            ) : (
                activeTab === "cancelled_orders" && (
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
                        rows={myOrders
                            .filter(
                                (order) =>
                                    order.status ===
                                        "partially-filled-cancelled" ||
                                    order.status === "cancelled"
                            )
                            .concat(cancelledOrders)
                            .map((order) => ({
                                id: order._id,
                                amount: ethers.utils.formatUnits(
                                    order.remainingQuantity,
                                    pair &&
                                        symbols[0] &&
                                        pair.pairs[symbols.join("-")]
                                            .baseAssetPrecision !== 0
                                        ? pair.pairs[symbols.join("-")]
                                              .baseAssetPrecision
                                        : 0
                                ),
                                price: ethers.utils.formatUnits(
                                    order.price,
                                    pair &&
                                        symbols[0] &&
                                        pair.pairs[symbols.join("-")]
                                            .quoteAssetPrecision !== 0
                                        ? pair.pairs[symbols.join("-")]
                                              .quoteAssetPrecision
                                        : 0
                                ),
                                side: order.side,
                                orderStatus: order.status,
                                time: formatTimestamp(order.updatedAt),
                            }))}
                        columns={columns}
                        disableSelectionOnClick
                        hideFooterPagination
                        hideFooter
                        disableColumnMenu
                    />
                )
            )}
        </div>
    )
}

export default MyOrderBookV2
