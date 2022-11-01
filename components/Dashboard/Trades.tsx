import { useAppSelector } from "../../store/store"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { truncateDecimals } from "../../utility/index"

const Trades = () => {
    const symbols = useAppSelector((state) => state.tokens.symbols)

    return (
        <div className="relative bg-black py-[0.75em] px-[1.75em] m-[0.75em] col-start-7 col-end-13  overflow-y-scroll shadow-black1 min-h-[250px]">
            <div className="flex items-center justify-between">
                <h2>Trades</h2>
            </div>
            <TableContainer
                component={Paper}
                className="rounded-lg overflow-scroll bg-black min-h-[200px] max-h-[400px] mt-8"
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
                                    {symbols && symbols[0]}
                                    <img src="/images/sort.svg" alt="Sort" />
                                </span>
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ borderBottom: "0" }}
                                className=" whitespace-nowrap bg-black"
                            >
                                <span className="flex items-center mx-auto w-fit text-textGray1">
                                    {symbols && symbols[0]} /{" "}
                                    {symbols && symbols[1]}
                                    <img src="/images/sort.svg" alt="Sort" />
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="bg-black">
                        {Array(20)
                            .fill({
                                time: "10:40:44am 5 Oct 28",
                                amount: "10",
                                price: "10",
                                side: "sell",
                            })
                            .map((order, index) => (
                                <TableRow key={index}>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        className={`text-white border-none  h-5 py-2.5 whitespace-nowrap`}
                                        align="center"
                                    >
                                        {order.time}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        className={`${
                                            index % 2 === 0 // todo -> change to side === 'buy' when real data comes
                                                ? "text-textGreen1"
                                                : "text-inputErrorRed"
                                        }  border-none text-center text-white h-5 py-2.5`}
                                    >
                                        <span className="ml-7 w-fit">
                                            {order.side === "sell" ? "-" : "+"}{" "}
                                            {order.amount}
                                        </span>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        className="text-white border-none h-5 py-2.5"
                                    >
                                        {truncateDecimals(
                                            (
                                                Number(order.amount) /
                                                Number(order.price)
                                            ).toString(),
                                            5
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="w-1 h-[99%] rounded-full bg-btnBlue1 absolute right-0.5 top-0" />
        </div>
    )
}

export default Trades
