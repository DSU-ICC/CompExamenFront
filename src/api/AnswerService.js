import { API_URL, axiosWithAuth } from "./config";

export default class AnswerService {
    static async createAnswer(answer) {
        const response = await axiosWithAuth.post(`${API_URL}/Answer/CreateAnswer`, answer)
        return response;
    }

    static async editAnswer(answer) {
        const response = await axiosWithAuth.post(`${API_URL}/Answer/UpdateAnswer`, answer)
        return response;
    }
}