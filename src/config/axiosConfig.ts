import axios from "axios"

const axiosConfig = axios.create({
    baseURL: process.env.NEXT_PUBLIC_DEXCHANGE_SERVER_DEV || "",
})

export default axiosConfig
