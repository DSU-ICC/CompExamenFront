import axios from "axios";
import { API_URL, getToken } from "./config";

export default class AnswerService {
    static async createAnswer(answer) {
        const response = await axios.post(`${API_URL}/Answer/CreateAnswer`, answer, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            withCredentials: true
        })
        return response;
    }

    static async editAnswer(answer) {
        const response = await axios.post(`${API_URL}/Answer/UpdateAnswer`, answer, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            withCredentials: true
        })
        return response;
    }
}