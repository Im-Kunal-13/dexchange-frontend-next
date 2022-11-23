import { BigNumber } from "ethers"
import { IGetOrder } from "../types"
import moment from "moment"
import { groupBy, maxBy, minBy } from "lodash"
import { ethers } from "ethers"

export const truncateDecimals = (num: string, truncateLimit: number) => {
    if (num.includes(".")) {
        let temp = num.split(".")
        return temp[0] + "." + temp[1].slice(0, 5)
    } else return num
}

export const formatTimestamp = (timestamp: string) => {
    var date = new Date(timestamp)

    return date.toLocaleString("en-GB", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        month: "short",
        day: "numeric",
    })
}

export const sortByTimeStamp = (order1: IGetOrder, order2: IGetOrder) => {
    const date1 = new Date(order1.createdAt)
    const date2 = new Date(order2.createdAt)

    if (date1 > date2) {
        return 1
    } else if (date1 < date2) {
        return -1
    } else return 0
}
export const sortByTimeStampDescending = (
    order1: IGetOrder,
    order2: IGetOrder
) => {
    const date1 = new Date(order1.createdAt)
    const date2 = new Date(order2.createdAt)

    if (date1 > date2) {
        return -1
    } else if (date1 < date2) {
        return 1
    } else return 0
}

export const sortByPriceAscending = (order1: IGetOrder, order2: IGetOrder) => {
    const price1 = BigNumber.from(order1.price)
    const price2 = BigNumber.from(order2.price)

    if (price1.gt(price2)) {
        return 1
    } else if (price1.lt(price2)) {
        return -1
    } else return 0
}

export const sortByPriceDescending = (order1: IGetOrder, order2: IGetOrder) => {
    const price1 = BigNumber.from(order1.price)
    const price2 = BigNumber.from(order2.price)

    if (price1.lt(price2)) {
        return 1
    } else if (price1.gt(price2)) {
        return -1
    } else return 0
}

export const getPriceChartOptions = (graphInterval: string) => ({
    chart: {
        animations: { enabled: true },
        type: "candlestick",
        height: 350,
        foreColor: "white",
        background: "black",
        toolbar: { show: true, offsetX: -30, offsetY: -35 },
        width: "100px",
    },
    title: {
        text: "",
        align: "left",
    },
    plotOptions: {
        candlestick: {
            colors: {
                upward: "#00B746",
                downward: "#EF403C",
            },
            wick: {
                useFillColor: true,
            },
        },
    },
    tooltip: {
        enabled: true,
        theme: false,
        style: {
            fontSize: "12px",
            fontFamily: undefined,
        },
        x: {
            show: false,
            format: "dd MMM",
            formatter: undefined,
        },
        y: {
            show: true,
            title: "price",
        },
        marker: {
            show: false,
        },
        items: {
            display: "flex",
        },
        fixed: {
            enabled: false,
            position: "topRight",
            offsetX: 0,
            offsetY: 0,
        },
    },
    grid: {
        show: true,
        borderColor: "#767F92",
        strokeDashArray: 0,

        padding: {
            left: 50,
            right: 50, // Also you may want to increase this (based on the length of your labels)
        },
    },
    xaxis: {
        tickPlacement: "on",
        type: "datetime",
        labels: {
            formatter: function (value: any) {
                console.log(graphInterval)
                const formattedDate =
                    (graphInterval === "hour"
                        ? new Date(value).getHours()
                        : "") +
                    ":" +
                    new Date(value).getMinutes()

                return formattedDate
            },
            show: true,
            style: {
                colors: "#767F92",
                fontSize: "14px",
                cssClass: "apexcharts-xaxis-label",
            },
        },
    },
    yaxis: {
        labels: {
            show: true,
            minWidth: 0,
            maxWidth: 160,
            style: {
                color: "#F1F2F9",
                fontSize: "14px",
                cssClass: "apexcharts-yaxis-label",
            },
            offsetX: 0,
            offsetY: 0,
            rotate: 0,
        },
    },
})

export const buildGraphData = (
    orders: IGetOrder[],
    interval: moment.unitOfTime.StartOf,
    quoteAssetPrecision: number
) => {
    const sortedTrades = orders.slice().sort(sortByTimeStamp)

    const groupedOrders = groupBy(sortedTrades, (order) =>
        moment(order.createdAt).startOf(interval).format()
    )

    const hours = Object.keys(groupedOrders)

    const graphData = hours.map((hour) => {
        const group = groupedOrders[hour]

        const open = group[0]
        const high = maxBy(group, "price")
        const low = minBy(group, "price")
        const close = group[group.length - 1]

        return {
            x: new Date(hour),
            y: [open, high, low, close].map((p) =>
                ethers.utils.formatUnits(
                    p?.price ? p.price : "0",
                    quoteAssetPrecision
                )
            ),
        }
    })

    return graphData
}

export const containsOnlyValidNumber = (str: string) => {
    return /^\d*\.?\d*$/.test(str)
}
