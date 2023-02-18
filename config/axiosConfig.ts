import axios from "axios"

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_DEXCHANGE_SERVER_DEV,
})

export default instance
