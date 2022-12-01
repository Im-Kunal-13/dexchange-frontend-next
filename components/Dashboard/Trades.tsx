import { useAppSelector } from "../../store/store"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { formatTimestamp } from "../../utility"
import { ethers } from "ethers"

const Trades = () => {
    const { symbols, pair } = useAppSelector((state) => state.tokens)
    const { allTrades } = useAppSelector((state) => state.trade)

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
                                    AMOUNT ({symbols && symbols[0]})
                                    <img src="/images/sort.svg" alt="Sort" />
                                </span>
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ borderBottom: "0" }}
                                className=" whitespace-nowrap bg-black"
                            >
                                <span className="flex items-center mx-auto w-fit text-textGray1">
                                    PRICE ({symbols && symbols[1]})
                                    <img src="/images/sort.svg" alt="Sort" />
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="bg-black">
                        {allTrades &&
                            symbols[0] && symbols[1] &&
                            allTrades
                                .filter((order) => {
                                    return (
                                        (order.status === "filled" ||
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
                                            className={`text-white border-none  h-5 py-0 my-0 whitespace-nowrap ${
                                                index === 0 ? "pt-2.5" : "pt-0"
                                            }`}
                                            align="center"
                                        >
                                            {formatTimestamp(order.updatedAt)}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            className={`${
                                                order.side === "buy"
                                                    ? "text-textGreen1"
                                                    : "text-inputErrorRed"
                                            }  border-none text-center text-white h-5 py-0 my-0 ${
                                                index === 0 ? "pt-2.5" : "pt-0"
                                            }`}
                                        >
                                            <span className="ml-7 w-fit">
                                                {order.side === "sell"
                                                    ? "-"
                                                    : "+"}{" "}
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
                                                    ].baseAssetPrecision !== 0
                                                        ? pair.pairs[
                                                              symbols.join("-")
                                                          ].baseAssetPrecision
                                                        : 0
                                                )}
                                            </span>
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            className={`text-white border-none h-5 py-0 my-0 ${
                                                index === 0 ? "pt-2.5" : "pt-0"
                                            }`}
                                        >
                                            {ethers.utils.formatUnits(
                                                order.price,
                                                pair.pairs[symbols.join("-")]
                                                    .quoteAssetPrecision !== 0
                                                    ? pair.pairs[
                                                          symbols.join("-")
                                                      ].quoteAssetPrecision
                                                    : 0
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
