import axios from "axios";
import { API_URL, getToken } from "./config";

export default class QuestionService {
    static async deleteQuestion(id) {
        const response = await axios.post(`${API_URL}/Question/DeleteQuestion?id=${id}`, {}, {
            params: {
                id: id
            },
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            withCredentials: true
        })
        return response;
    }
}