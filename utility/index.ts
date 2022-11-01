export const truncateDecimals = (num: string, truncateLimit: number) => {
    if (num.includes(".")) {
        let temp = num.split(".")
        return temp[0] + "." + temp[1].slice(0,5)
    } else return num
}
