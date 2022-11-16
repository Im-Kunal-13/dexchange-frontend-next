import { KeyboardReturnRounded } from "@mui/icons-material"
import { BigNumber } from "ethers"
import { IGetOrder } from "../types"

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

    console.log(date1, date2)

    if (date1 > date2) {
        return 1
    } else if (date1 < date2) {
        return -1
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
