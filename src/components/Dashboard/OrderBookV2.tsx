import { Button, Divider, Stack } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useQueryClient } from "@sei-js/react"
import { CONTRACT_ADDRESS, REST_URL } from "@constants/index"
import { useAppPersistStore, useAppUiStore } from "@store/app"
import { useTradeStore } from "@store/trades"
import { IBookOrder } from "../../types/index"
import formatTime from "@components/utility/formatTime"
import moment from "moment"

interface Props {}

const OrderBookV2 = ({}: Props) => {
    const [isTrades, setIsTrades] = useState(false)

    let { queryClient, isLoading } = useQueryClient(REST_URL)

    const [sellOrders, setSellOrders] = useState<IBookOrder[]>([])
    const [buyOrders, setBuyOrders] = useState<IBookOrder[]>([])

    const { provider } = useAppPersistStore()
    const { txHistory } = useTradeStore()

    // Grid
    const orderColumns: GridColDef[] = [
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
                    <span>( USDC )</span>
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
            field: "amount",
            headerName: "AMOUNT",

            flex: 1,
            sortable: false,
            align: "center",
            headerAlign: "center",
            renderHeader: () => (
                <span className="text-[9px] font-bold leading-[1.6] tracking-[.9px] text-textGray1 flex flex-col items-center text-white">
                    AMOUNT
                    <span>( SEI )</span>
                </span>
            ),
            renderCell: (cellValues) => {
                return (
                    <span
                        className={`relative bottom-[14px] text-[12px] leading-[1.3] font-semibold`}
                    >
                        {cellValues.formattedValue}
                    </span>
                )
            },
        },
    ]
    const tradeColumns: GridColDef[] = [
        {
            field: "price",
            headerName: "PRICE",

            flex: 1,
            sortable: false,
            align: "center",
            headerAlign: "center",
            renderHeader: () => (
                <span
                    className={`text-[9px] font-bold leading-[1.6] tracking-[.9px] text-textGray1 flex flex-col items-center `}
                >
                    PRICE
                    <span>( USDC )</span>
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
            field: "amount",
            headerName: "AMOUNT",

            flex: 1,
            sortable: false,
            align: "center",
            headerAlign: "center",
            renderHeader: () => (
                <span className="text-[9px] font-bold leading-[1.6] tracking-[.9px] text-textGray1 flex flex-col items-center">
                    AMOUNT
                    <span>( SEI )</span>
                </span>
            ),
            renderCell: (cellValues) => {
                return (
                    <span
                        className={`relative bottom-[14px] text-[12px] leading-[1.3] font-semibold text-white`}
                    >
                        {cellValues.row.side === "buy" ? "+ " : "- "}
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

    const getShortBookAllQuery = useCallback(async () => {
        if (!isLoading) {
            const query =
                await queryClient.seiprotocol.seichain.dex.shortBookAll({
                    contractAddr: CONTRACT_ADDRESS,
                    priceDenom: "USDC",
                    assetDenom: "SEI",
                })

            setSellOrders(
                query?.ShortBook.map((order: IBookOrder) => ({
                    ...order,
                    side: "sell",
                }))
            )
        }
    }, [isLoading])

    const getLongBookAllQuery = useCallback(async () => {
        if (!isLoading) {
            const query =
                await queryClient.seiprotocol.seichain.dex.longBookAll({
                    contractAddr: CONTRACT_ADDRESS,
                    priceDenom: "USDC",
                    assetDenom: "SEI",
                })

            setBuyOrders(
                query?.LongBook.map((order: IBookOrder) => ({
                    ...order,
                    side: "buy",
                }))
            )
        }
    }, [isLoading])

    useEffect(() => {
        if (!!provider?.account) {
            getLongBookAllQuery()
            getShortBookAllQuery()
        }
    }, [isLoading, provider])

    const { setSnackbarInfo } = useAppUiStore()

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
                    rows={txHistory
                        .sort((tx1, tx2) =>
                            moment(tx2.date).diff(moment(tx1.date))
                        )
                        .map((trade, index) => ({
                            id: index,
                            amount: trade?.amount,
                            price: trade?.price,
                            time: formatTime(moment(trade?.date)),
                            side: trade.side,
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
                    rows={sellOrders
                        .sort(
                            (a: IBookOrder, b: IBookOrder) =>
                                Number(a.entry?.price) - Number(b.entry?.price)
                        )
                        .reverse()
                        .concat(
                            buyOrders
                                ?.sort(
                                    (a: IBookOrder, b: IBookOrder) =>
                                        Number(a.entry?.price) -
                                        Number(b.entry?.price)
                                )
                                .reverse()
                        )
                        .map((order, index) => ({
                            id: index,
                            amount: Number(order?.entry?.quantity).toFixed(2),
                            price: Number(order?.entry?.price).toFixed(2),
                            side: order?.side,
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
