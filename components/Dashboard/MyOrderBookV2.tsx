import { Button, Divider, Stack } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { ethers } from "ethers"
import { formatTimestamp } from "../../utility"
import { useAppSelector } from "../../store/store"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import InfoIcon from "@mui/icons-material/Info"
import DoneIcon from "@mui/icons-material/Done"
import AutorenewIcon from "@mui/icons-material/Autorenew"
import ReportProblemIcon from "@mui/icons-material/ReportProblem"
import { useQueryClient } from "@sei-js/react"
import { REST_URL, CONTRACT_ADDRESS } from "constants/index"
import { useAppPersistStore } from "@store/app"

const columns: GridColDef[] = [
    {
        field: "amount",
        headerName: "AMOUNT",

        flex: 1,
        sortable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (cellValues) => {
            return (
                <span
                    className={`relative bottom-[14px] ${
                        cellValues.row.side === "Buy"
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
                        cellValues.row.side === "Buy"
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
        field: "orderType",
        headerName: "ORDER-TYPE",
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
    {
        field: "status",
        headerName: "STATUS",
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

const tradeColumns: GridColDef[] = [
    {
        field: "amount",
        headerName: "AMOUNT",

        flex: 1,
        sortable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (cellValues) => {
            return (
                <span
                    className={`relative bottom-[14px] ${
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

interface Props {}

export interface MyOrder {
    account: string
    assetDenom: string
    contractAddr: string
    data: string
    id: string
    orderType: string
    positionDirection: string
    price: string
    priceDenom: string
    quantity: string
    status: string
    statusDescription: ""
}

const MyOrderBookV2 = ({}: Props) => {
    let { queryClient, isLoading } = useQueryClient(REST_URL)

    const [myOrders, setMyOrders] = useState([])

    const { provider } = useAppPersistStore()

    const getOrdersOfAccount = useCallback(async () => {
        if (!isLoading && provider?.account) {
            const query = await queryClient.seiprotocol.seichain.dex.getOrders({
                contractAddr: CONTRACT_ADDRESS,
                account: provider?.account,
            })

            setMyOrders(query?.orders)
        }
    }, [isLoading, provider])

    const mySellOrders = myOrders.filter(
        // @ts-ignore
        (order) => order?.positionDirection === "SHORT"
    )

    const myBuyOrders = myOrders.filter(
        // @ts-ignore
        (order) => order?.positionDirection === "LONG"
    )

    useEffect(() => {
        if (!!provider?.account) {
            getOrdersOfAccount()
        }
    }, [isLoading, provider])

    const [activeTab, setActiveTab] = useState("all_orders")
    const { symbols, pair } = useAppSelector((state) => state.tokens)
    const { myTrades } = useAppSelector((state) => state.trade)

    return (
        <div className="bg-bgSidebarGray1 border border-t-0 border-r-0 border-white border-opacity-10 pt-1.5">
            <div className="flex items-center justify-around pl-[35px] pr-[20px] py-[5px]">
                {[
                    { tab: "trades", label: "TRADES" },
                    { tab: "all_orders", label: "All Orders" },
                    { tab: "buy_orders", label: "Buy Orders" },
                    { tab: "sell_orders", label: "Sell Orders" },
                    { tab: "cancelled_orders", label: "Cancelled Orders" },
                ].map(({ tab, label }) => (
                    <Button
                        key={tab}
                        variant="outlined"
                        className={`normal-case rounded-full  ${
                            activeTab === tab
                                ? "border-[2px] hover:border-[2px] border-blue1 text-blue1 hover:border-blue1"
                                : "border-[2px] hover:border-[2px] border-transparent hover:border-transparent hover:bg-transparent text-textGray1"
                        } rounded-full px-[16px] py-[3.5px] text-[10px] font-bold leading-[1.6] tracking-[.9px] transition-all duration-300`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {label}
                    </Button>
                ))}
            </div>
            <Divider className="bg-white bg-opacity-10" />
            {activeTab === "trades" ? (
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
                        virtualScroller: "overflow-x-hidden",
                        footerContainer: "hidden",
                        menuIconButton: "hidden",
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
                        time: formatTimestamp(trade.updatedAt, ""),
                    }))}
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
            ) : activeTab === "buy_orders" ? (
                <div style={{ height: "calc(550px)" }}>
                    <DataGrid
                        classes={{
                            root: "border-none bg-bgSidebarGray1",
                            checkboxInput: "text-white",

                            columnHeaderTitle:
                                "text-textGray1 leading-[1.6] tracking-[.9px] font-bold text-[10px]",
                            cellContent:
                                "h-[30px] min-h-[30px] max-h-[30px] text-white leading-[1.3] tracking-[.9px] font-semibold text-[12px]",
                            iconSeparator: "stroke-black w-[20px]",
                            virtualScroller: "overflow-x-hidden",
                            footerContainer: "hidden",
                            sortIcon: "hidden",
                            menuIconButton: "hidden",
                        }}
                        className="text-white"
                        columns={columns}
                        rows={
                            myBuyOrders
                                ? myBuyOrders.map((order: MyOrder, index) => ({
                                      id: index,
                                      amount: Number(order?.quantity).toFixed(
                                          3
                                      ),
                                      price: Number(order?.price).toFixed(3),
                                      side: "Buy",
                                      orderType: order?.orderType,
                                      status: order?.status,
                                  }))
                                : []
                        }
                    />
                </div>
            ) : activeTab === "sell_orders" ? (
                <DataGrid
                    classes={{
                        root: "border-none bg-bgSidebarGray1",
                        checkboxInput: "text-white",
                        sortIcon: "hidden",
                        columnHeaderTitle:
                            "text-textGray1 leading-[1.6] tracking-[.9px] font-bold text-[10px]",
                        cellContent:
                            "h-[30px] min-h-[30px] max-h-[30px]  text-white leading-[1.3] tracking-[.9px] font-semibold text-[12px]",
                        iconSeparator: "stroke-black w-[20px]",
                        virtualScroller: "overflow-x-hidden",
                        footerContainer: "hidden",
                        menuIconButton: "hidden",
                    }}
                    className="text-white"
                    style={{ height: "calc(550px)" }}
                    rows={
                        mySellOrders
                            ? mySellOrders.map((order: MyOrder, index) => ({
                                  id: index,
                                  amount: Number(order?.quantity).toFixed(3),
                                  price: Number(order?.price).toFixed(3),
                                  side: "Sell",
                                  orderType: order?.orderType,
                                  status: order?.status,
                              }))
                            : []
                    }
                    columns={columns}
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
                                No Sell Orders
                            </Stack>
                        ),
                    }}
                />
            ) : activeTab === "all_orders" ? (
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
                        virtualScroller: "overflow-x-hidden",
                        footerContainer: "hidden",
                        menuIconButton: "hidden",
                    }}
                    className="text-white"
                    style={{ height: "calc(550px)" }}
                    rows={
                        mySellOrders && myBuyOrders
                            ? mySellOrders
                                  .concat(myBuyOrders)
                                  .map((order: MyOrder, index) => ({
                                      id: index,
                                      amount: Number(order?.quantity).toFixed(
                                          3
                                      ),
                                      price: Number(order?.price).toFixed(3),
                                      side:
                                          order?.positionDirection === "LONG"
                                              ? "Buy"
                                              : "Sell",
                                      orderType: order?.orderType,
                                      status: order?.status,
                                  }))
                            : []
                    }
                    columns={columns}
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
                                No Orders
                            </Stack>
                        ),
                    }}
                />
            ) : (
                activeTab === "cancelled_orders" && (
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
                            virtualScroller: "overflow-x-hidden",
                            footerContainer: "hidden",
                            menuIconButton: "hidden",
                        }}
                        className="text-white"
                        style={{ height: "calc(550px)" }}
                        rows={[]}
                        columns={columns}
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
                                    No Cancelled Orders
                                </Stack>
                            ),
                        }}
                    />
                )
            )}
        </div>
    )
}

export default MyOrderBookV2
