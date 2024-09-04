//export const API_URL = "/api"
export const API_URL = "https://localhost:44370"

export const getToken = () => {
    return localStorage.getItem("access_token")
}