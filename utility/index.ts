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
