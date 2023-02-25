import { Moment } from "moment"

const formatTime = (date: Moment): string => {
    return date.format("HH:mm:ss")
}
export default formatTime
