import { MenuItem, Select } from "@mui/material"
import dynamic from "next/dynamic"
import { useState } from "react"
import { useAppSelector } from "../../store/store"
import { buildGraphData, getPriceChartOptions } from "../../utility"
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

const PriceChart = () => {
    const { allTrades } = useAppSelector((state) => state.trade)
    const { pair, symbols } = useAppSelector((state) => state.tokens)
    const [graphInterval, setGraphInterval] = useState("hour")

    return (
        <div
            id="chart"
            className="bg-black my-[0.75rem] m-[0.75em] min-h-[400px] col-start-1 col-end-13 rounded overflow-hidden shadow-black1 pt-5 px-5 border border-opacity-10 border-white"
        >
            <Select
                value={graphInterval}
                variant="standard"
                name="networks"
                MenuProps={{
                    classes: {
                        list: "text-white shadow",
                        paper: "rounded bg-bgGray1 mt-2 shadow",
                    },
                }}
                className="bg-bgGray1 rounded overflow-hidden"
                onChange={(e) => {
                    setGraphInterval(e.target.value)
                }}
                sx={{ color: "white" }}
                classes={{
                    select: "w-24  text-white whitespace-nowrap  py-3 px-4 bg-bgGray1",
                    icon: "text-white transition-all duration-300 relative right-2.5",
                    nativeInput: "text-white",
                }}
                disableUnderline={true}
            >
                <MenuItem value="0" disabled>
                    Select Interval
                </MenuItem>
                <MenuItem value="minute" defaultChecked>
                    Minute
                </MenuItem>
                <MenuItem value="hour">Hour</MenuItem>
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="year">Year</MenuItem>
            </Select>
            {typeof window !== "undefined" ? (
                <ReactApexChart
                    // @ts-ignore
                    options={getPriceChartOptions(graphInterval)}
                    series={[
                        {
                            data: buildGraphData(
                                allTrades.slice(1),
                                // @ts-ignore
                                graphInterval,
                                pair?.pairs &&
                                    symbols[0] &&
                                    symbols[1] &&
                                    pair.pairs[symbols.join("-")]
                                        .quoteAssetPrecision
                            ),
                        },
                    ]}
                    type="candlestick"
                    height={350}
                />
            ) : (
                <></>
            )}
        </div>
    )
}

export default PriceChart
