// First we need to import axios.js
import axios from "axios"
// Next we make an 'instance' of it
const instance = axios.create({
    // .. where we make our configurations
    baseURL: "https://sea-turtle-app-p4lss.ondigitalocean.app/",
})

export default instance
