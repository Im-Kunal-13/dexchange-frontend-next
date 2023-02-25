export const isStringValidNumber = (text: string): boolean => {
    if (
        text === "" ||
        (text.split(".").length - 1 < 2 &&
            text[text.length - 1] === "." &&
            text[text.length - 2] !== ".")
    ) {
        return true
    }
    const floatRegex = /^[+-]?\d+(\.\d+)?$/

    return floatRegex.test(text)
}
