import { useAppDispatch, useAppSelector } from "../../store/store"
import { useEffect } from "react"

// Import Selectors
import { orderBookSelector } from "../../features/selectors"

// Import Interactions
import { getOrders } from "../../api/interactions"
import * as React from "react"
import { styled } from "@mui/material/styles"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}))

function createData(name: string, calories: number, fat: number) {
    return { name, calories, fat }
}

const rows = [
    createData(1, 0.002, 500),
    createData(1, 237, 9.0),
    createData(1, 262, 16.0),
    createData(1, 305, 3.7),
    createData(1, 356, 16.0),
]

const OrderBook = () => {
    const provider = useAppSelector((state) => state.provider.connection)
    const exchange = useAppSelector((state) => state.exchange.contract)
    const symbols = useAppSelector((state) => state.tokens.symbols)
    const orderBook = useAppSelector(orderBookSelector)

    const dispatch = useAppDispatch()

    // const fillOrderHandler = (order: any) => {
    //     fillOrder(provider, exchange, order, dispatch)
    // }
    useEffect(() => {
        getOrders(dispatch)
    }, [])

    return (
        <div className="relative bg-black py-[0.75em] px-[1.75em] m-[0.75em] h-[300px] col-span-full overflow-y-scroll shadow-black1">
            <div className="flex items-center justify-between">
                <h2>Order Book</h2>
            </div>

            <div className="flex items-center">
                {!orderBook || orderBook.sellOrders.length === 0 ? (
                    <p className="flex-center">No Sell Orders</p>
                ) : (
                    // <table className="exchange__orderbook--sell">
                    //     <caption>Selling</caption>
                    //     <thead>
                    //         <tr>
                    //             <th>
                    //                 {symbols && symbols[0]}
                    //                 <img src="/images/sort.svg" alt="Sort" />
                    //             </th>
                    //             <th>
                    //                 {symbols && symbols[0]}/
                    //                 {symbols && symbols[1]}
                    //                 <img src="/images/sort.svg" alt="Sort" />
                    //             </th>
                    //             <th>
                    //                 {symbols && symbols[1]}
                    //                 <img src="/images/sort.svg" alt="Sort" />
                    //             </th>
                    //         </tr>
                    //     </thead>
                    //     <tbody>
                    //         {/* MAPPING OF SELL ORDERS... */}

                    //         {orderBook &&
                    //             orderBook.sellOrders.map(
                    //                 (order: any, index: any) => {
                    //                     return (
                    //                         <tr
                    //                             key={index}
                    //                             onClick={() =>
                    //                                 fillOrderHandler(order)
                    //                             }
                    //                         >
                    //                             <td>{order.token0Amount}</td>
                    //                             <td
                    //                                 style={{
                    //                                     color: `${order.orderTypeClass}`,
                    //                                 }}
                    //                             >
                    //                                 {order.tokenPrice}
                    //                             </td>
                    //                             <td>{order.token1Amount}</td>
                    //                         </tr>
                    //                     )
                    //                 }
                    //             )}
                    //     </tbody>
                    // </table>
                    <TableContainer component={Paper}>
                        <Table
                            sx={{ minWidth: 700 }}
                            aria-label="customized table"
                        >
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>
                                        {symbols && symbols[0]}

                                        <img
                                            src="/images/sort.svg"
                                            alt="Sort"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {symbols && symbols[0]}/
                                        {symbols && symbols[1]}
                                        <img
                                            src="/images/sort.svg"
                                            alt="Sort"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {symbols && symbols[1]}
                                        <img
                                            src="/images/sort.svg"
                                            alt="Sort"
                                        />
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <StyledTableRow key={row.name}>
                                        <StyledTableCell
                                            component="th"
                                            scope="row"
                                        >
                                            {row.name}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.calories}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.fat}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.carbs}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.protein}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <div className="divider"></div>

                {!orderBook || orderBook.buyOrders.length === 0 ? (
                    <p className="flex-center">No Buy Orders</p>
                ) : (
                    <table className="exchange__orderbook--buy">
                        <caption>Buying</caption>
                        <thead>
                            <tr>
                                <th>
                                    {symbols && symbols[0]}
                                    <img src="/images/sort.svg" alt="Sort" />
                                </th>
                                <th>
                                    {symbols && symbols[0]}/
                                    {symbols && symbols[1]}
                                    <img src="/images/sort.svg" alt="Sort" />
                                </th>
                                <th>
                                    {symbols && symbols[1]}
                                    <img src="/images/sort.svg" alt="Sort" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* MAPPING OF BUY ORDERS... */}

                            {orderBook &&
                                orderBook.buyOrders.map(
                                    (order: any, index: any) => {
                                        return (
                                            <tr
                                                key={index}
                                                onClick={() =>
                                                    fillOrderHandler(order)
                                                }
                                            >
                                                <td>{order.token0Amount}</td>
                                                <td
                                                    style={{
                                                        color: `${order.orderTypeClass}`,
                                                    }}
                                                >
                                                    {order.tokenPrice}
                                                </td>
                                                <td>{order.token1Amount}</td>
                                            </tr>
                                        )
                                    }
                                )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default OrderBook
