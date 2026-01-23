import { API_URL, axiosWithAuth } from "./config";

export default class QuestionService {
    static async deleteQuestion(id) {
        const response = await axiosWithAuth.post(`${API_URL}/Question/DeleteQuestion?id=${id}`)
        return response;
    }
}