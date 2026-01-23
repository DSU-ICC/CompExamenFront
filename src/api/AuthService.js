import axios from "axios";
import { API_URL, axiosClassic } from "./config";

export default class AuthService {

    static async login(loginUser, passwordUser) {
        const response = await axiosClassic.post(`${API_URL}/Account/Login`, {
            login: loginUser,
            password: passwordUser
        })
        return response;
    }
}