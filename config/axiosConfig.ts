// First we need to import axios.js
import axios from "axios"
import { BACKEND_DEV_URL } from "../constants/links"
// Next we make an 'instance' of it
const instance = axios.create({
    // .. where we make our configurations
    baseURL: process.env.NEXT_PUBLIC_DEXCHANGE_SERVER_DEV,
})

export default instance
