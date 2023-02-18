import HighchartsReact from "highcharts-react-official"
import HighChartsExporting from "highcharts/modules/exporting"
import HighChartsData from "highcharts/modules/data"
import HighChartsAccessibility from "highcharts/modules/accessibility"
import HighChartsStock from "highcharts/highstock"
import { buildCandleStickData, formatTimestamp } from "../../utility"
import { useAppSelector } from "../../store/store"
import { useEffect, useState } from "react"
import { Button } from "@mui/material"

if (typeof HighChartsStock === "object") {
    HighChartsExporting(HighChartsStock)
    HighChartsData(HighChartsStock)
    HighChartsAccessibility(HighChartsStock)
}

const PriceChartV2 = () => {
    const { allTrades } = useAppSelector((state) => state.trade)
    const { pair, symbols } = useAppSelector((state) => state.tokens)
    const [graphInterval, setGraphInterval] =
        useState<moment.unitOfTime.StartOf>("hour")

    const candleStickOptions = {
        chart: {
            backgroundColor: "#111113",
            style: {
                overflow: "visible",
            },
        },
        plotOptions: {
            candlestick: {
                color: "#DD3D32",
                upColor: "#25ce8f",
            },
        },
        title: {
            text: "",
        },
        series: [
            {
                type: "candlestick",
                name: "Order",
                data:
                    pair && symbols[0]
                        ? buildCandleStickData(
                              allTrades,
                              graphInterval,
                              pair?.pairs[symbols.join("-")].quoteAssetPrecision
                          )
                        : [],
                lineColor: "#DD3D32",
                upLineColor: "#25ce8f",
            },
        ],
        credits: {
            enabled: false,
        },
        xAxis: {
            labels: {
                // @ts-ignore
                formatter: function () {
                    // @ts-ignore
                    return formatTimestamp(this.value, graphInterval)
                },
                style: {
                    color: "#8A8991",
                    fontSize: "9px",
                },
            },
            lineColor: "#29292B",
            tickColor: "#111113",
            tickLength: 0,
        },
        yAxis: {
            gridLineColor: "#29292B",
            lineColor: "",
            title: {
                enabled: false,
            },
            labels: {
                style: {
                    color: "#8A8991",
                    fontSize: "9px",
                },
            },
        },
        legend: {
            enabled: false,
        },
        exporting: {
            enabled: false,
            buttons: {
                contextButton: {
                    // y: -40,
                    y: -10,
                },
            },
        },
    }

    useEffect(() => {})

    return (
        <div className="w-full border-b border-l border-white border-opacity-10 h-fit bg-bgSidebarGray1 flex flex-col">
            <div className="flex items-center gap-2 pl-5 relative top-[20px]">
                <h6 className="text-[10px] font-bold leading-[1.6] tracking-[.9px] text-textGray1">
                    INTERVAL
                </h6>
                <div className="flex items-center">
                    <Button
                        variant="outlined"
                        className={`${
                            graphInterval === "minute"
                                ? "border-[2px] hover:border-[2px] border-blue1 text-blue1 hover:border-blue1"
                                : "border-[2px] hover:border-[2px] border-white border-opacity-10 hover:border-opacity-20 text-textGray1 hover:border-textGray1"
                        } normal-case rounded-full text-[10px] font-bold leading-[1.6] tracking-[.9px] scale-[85%]`}
                        onClick={() => setGraphInterval("minute")}
                    >
                        MIN
                    </Button>
                    <Button
                        variant="outlined"
                        className={`${
                            graphInterval === "hour"
                                ? "border-[2px] hover:border-[2px] border-blue1 text-blue1 hover:border-blue1"
                                : "border-[2px] hover:border-[2px] border-white border-opacity-10 hover:border-opacity-20 text-textGray1 hover:border-textGray1"
                        } normal-case rounded-full text-[10px] font-bold leading-[1.6] tracking-[.9px] scale-[85%]`}
                        onClick={() => setGraphInterval("hour")}
                    >
                        HOUR
                    </Button>
                    <Button
                        variant="outlined"
                        className={`${
                            graphInterval === "day"
                                ? "border-[2px] hover:border-[2px] border-blue1 text-blue1 hover:border-blue1"
                                : "border-[2px] hover:border-[2px] border-white border-opacity-10 hover:border-opacity-20 text-textGray1 hover:border-textGray1"
                        } normal-case rounded-full text-[10px] font-bold leading-[1.6] tracking-[.9px] scale-[85%]`}
                        onClick={() => setGraphInterval("day")}
                    >
                        DAY
                    </Button>
                    <Button
                        variant="outlined"
                        className={`${
                            graphInterval === "year"
                                ? "border-[2px] hover:border-[2px] border-blue1 text-blue1 hover:border-blue1"
                                : "border-[2px] hover:border-[2px] border-white border-opacity-10 hover:border-opacity-20 text-textGray1 hover:border-textGray1"
                        } normal-case rounded-full text-[10px] font-bold leading-[1.6] tracking-[.9px] scale-[85%]`}
                        onClick={() => setGraphInterval("year")}
                    >
                        YEAR
                    </Button>
                </div>
            </div>
            <HighchartsReact
                containerProps={{
                    style: {
                        height: "443px",
                        padding: "30px 10px 10px 10px",
                        backgroundColor: "#111113",
                    },
                }}
                highcharts={HighChartsStock}
                options={candleStickOptions}
            />
        </div>
    )
}

export default PriceChartV2
