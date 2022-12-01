import HighchartsReact from "highcharts-react-official"
import HighChartsExporting from "highcharts/modules/exporting"
import HighChartsData from "highcharts/modules/data"
import HighChartsAccessibility from "highcharts/modules/accessibility"
import HighChartsStock from "highcharts/highstock"
import { buildCandleStickData, formatTimestamp } from "../../utility"
import { useAppSelector } from "../../store/store"
import { useState } from "react"

if (typeof HighChartsStock === "object") {
    HighChartsExporting(HighChartsStock)
    HighChartsData(HighChartsStock)
    HighChartsAccessibility(HighChartsStock)
}

const PriceChartV2 = () => {
    const { allTrades } = useAppSelector((state) => state.trade)
    const { pair, symbols } = useAppSelector((state) => state.tokens)
    const [graphInterval, setGraphInterval] = useState("hour")

    const candleStickOptions = {
        rangeSelector: {
            enabled: true,
            label: "",
            inputPosition: {
                align: "right",
                x: 0,
                y: 0,
            },
            buttonPosition: {
                align: "left",
                x: 0,
                y: 0,
            },
            buttonTheme: {
                fill: "rgb(255, 255, 255, .1)",
                style: {
                    color: "white",
                    backgroundColor: "",
                    border: "10px solid red",
                },
            },
        },
        chart: {
            backgroundColor: "#111113",
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
                    //  buildCandleStickData(allTrades, 'minute', 8),
                    [
                        [1668177000000, 145.82, 150.01, 144.37, 149.7],
                        [1668436200000, 148.97, 150.28, 147.43, 148.28],
                        [1668522600000, 152.22, 153.59, 148.56, 150.04],
                        [1668609000000, 149.13, 149.87, 147.29, 148.79],
                        [1668695400000, 146.43, 151.48, 146.15, 150.72],
                        [1668781800000, 152.31, 152.7, 149.97, 151.29],
                        [1669041000000, 150.16, 150.37, 147.72, 148.01],
                        [1669127400000, 148.13, 150.42, 146.93, 150.18],
                        [1669213800000, 149.45, 151.83, 149.34, 151.07],
                    ],

                dataGrouping: {
                    units: [
                        [
                            "week", // unit name
                            [1], // allowed multiples
                        ],
                        ["month", [1, 2, 3, 4, 6]],
                    ],
                    grouping: false,
                },
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
                    return formatTimestamp(this.value)
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
    }

    return (
        <div className="w-full border-b border-l border-white border-opacity-10 h-fit bg-bgSidebarGray1">
            <HighchartsReact
                containerProps={{
                    style: {
                        height: "443px",
                        padding: "10px",
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
