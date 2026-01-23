import axios from "axios"

//export const API_URL = "/api"
export const API_URL = "https://localhost:44370"

export const getToken = () => {
    return localStorage.getItem("access_token")
}

export const axiosClassic = axios.create({
    baseURL: API_URL
})

export const axiosWithAuth = axios.create({
    baseURL: API_URL
})

axiosWithAuth.interceptors.request.use(async (config) => {
    const accessToken = getToken()
    if (config.headers && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    
    return config
})
