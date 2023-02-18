import { Button, Divider, Stack } from "@mui/material"
import { useState } from "react"
import { cancelOrder } from "../../api/interactions"
import { useAppStateContext } from "../../context/contextProvider"
import { ethers } from "ethers"
import { formatTimestamp } from "../../utility"
import { useAppSelector } from "../../store/store"
import { DataGrid, GridColDef } from "@mui/x-data-grid"

interface Props {
    shortBookOrders: any[]
}

const OrderBookV2 = ({ shortBookOrders }: Props) => {
    const [isTrades, setIsTrades] = useState(false)
    const { symbols, pair } = useAppSelector((state) => state.tokens)
    const { buyOrders, sellOrders } = useAppSelector((state) => state.order)
    const { allTrades } = useAppSelector((state) => state.trade)

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
                return (
                    <span
                        className={`relative bottom-[14px] text-[12px] leading-[1.3] font-semibold ${
                            cellValues.row.side === "buy"
                                ? "text-textGreen1"
                                : "text-inputErrorRed"
                        }`}
                    >
                        {cellValues.row.side === "buy" ? "+ " : "- "}
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
                    variant="outlined"
                    className={`normal-case ${
                        !isTrades
                            ? "border-[2px] hover:border-[2px] border-blue1 text-blue1 hover:border-blue1"
                            : "border-[2px] hover:border-[2px] border-transparent hover:border-transparent hover:bg-transparent text-textGray1"
                    }  rounded-full w-full p-[4px] m-[5px] text-[10px] font-bold leading-[1.6] tracking-[.9px]`}
                    onClick={() => setIsTrades(false)}
                >
                    ORDER BOOK
                </Button>
                <Button
                    variant="outlined"
                    className={`normal-case ${
                        isTrades
                            ? "border-[2px] hover:border-[2px] border-blue1 text-blue1 hover:border-blue1"
                            : "border-[2px] hover:border-[2px] border-transparent hover:border-transparent hover:bg-transparent text-textGray1"
                    }  rounded-full w-full p-[4px] m-[5px] text-[10px] font-bold leading-[1.6] tracking-[.9px]`}
                    onClick={() => setIsTrades(true)}
                >
                    TRADES
                </Button>
            </div>
            <Divider className="bg-white bg-opacity-10" />
            {isTrades ? (
                // <div className="h-96 custom-scrollbar">
                <DataGrid
                    classes={{
                        root: "border-none bg-bgSidebarGray1",
                        checkboxInput: "text-white",
                        sortIcon: "hidden",
                        columnHeaderTitle:
                            "text-textGray1 leading-[1.6] tracking-[.9px] font-bold text-[10px]",
                        cellContent:
                            "h-[30px] min-h-[30px] max-h-[30px] text-white leading-[1.3] tracking-[.9px] font-semibold text-[12px]",
                        iconSeparator: "stroke-black w-[20px]",
                    }}
                    className="text-white"
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
                                time: formatTimestamp(trade.updatedAt, ""),
                                side: trade.side,
                            }))
                    }
                    columns={tradeColumns}
                    disableSelectionOnClick
                    hideFooterPagination
                    hideFooter
                    disableColumnMenu
                    components={{
                        NoRowsOverlay: () => (
                            <Stack
                                height="100%"
                                alignItems="center"
                                justifyContent="center"
                            >
                                No Trades
                            </Stack>
                        ),
                    }}
                />
            ) : (
                <DataGrid
                    classes={{
                        root: "border-none bg-bgSidebarGray1",
                        checkboxInput: "text-white",
                        sortIcon: "hidden",
                        columnHeaderTitle:
                            "text-textGray1 leading-[1.6] tracking-[.9px] font-bold text-[10px]",
                        cellContent:
                            "h-[30px] min-h-[30px] max-h-[30px] text-white leading-[1.3] tracking-[.9px] font-semibold text-[12px]",
                        iconSeparator: "stroke-black w-[20px]",
                    }}
                    className="text-white"
                    rows={buyOrders.concat(sellOrders).map((trade) => ({
                        id: trade._id,
                        amount: ethers.utils.formatUnits(
                            trade.remainingQuantity,
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
                    }))}
                    disableVirtualization
                    columns={orderColumns}
                    disableSelectionOnClick
                    hideFooterPagination
                    hideFooter
                    disableColumnMenu
                    components={{
                        NoRowsOverlay: () => (
                            <Stack
                                height="100%"
                                alignItems="center"
                                justifyContent="center"
                            >
                                No Orders in Orderbook
                            </Stack>
                        ),
                    }}
                />
            )}
        </div>
    )
}

export default OrderBookV2
