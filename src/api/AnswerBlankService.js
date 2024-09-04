import axios from "axios";
import { API_URL, getToken } from "./config";

export default class AnswerBlankService {
    static async getAnswerBlankById(id) {
        const response = await axios.get(`${API_URL}/AnswerBlank/GetAnswerBlankById`, {
            params: {
                id: id
            },
            withCredentials: true
        }).catch((error) => {
            return error.response
        })
        return response;
    }

    static async getAnswerBlankByExamenIdAndStudentId(examId, studentId) {
        const response = await axios.get(`${API_URL}/AnswerBlank/GetAnswerBlanksByExamenIdAndStudentId`, {
            params: {
                examId: examId,
                studentId: studentId
            },
            withCredentials: true
        })
        return response;
    }

    static async updateAnswerBlank(answerBlank) {
        const response = await axios.post(`${API_URL}/AnswerBlank/UpdateAnswerBlank`, answerBlank, {
            withCredentials: true
        }).catch((error) => {
            return error.response
        })
        return response;
    }

    static async endExamenForStudent(answerBlankId) {
        const response = await axios.post(`${API_URL}/AnswerBlank/EndExamenForStudent?answerBlankId=${answerBlankId}`).catch((error) => {
            return error.response
        })
        return response;
    }

    static async resetExamenForStudent(answerBlankId, isRemoveAnswerBlank) {
        const response = await axios.post(`${API_URL}/AnswerBlank/ResetAnswerBlank`, {
            answerBlankId: answerBlankId,
            isRemoveAnswerBlank: isRemoveAnswerBlank
        }, {
            params: {
                answerBlankId: answerBlankId,
                isRemoveAnswerBlank: isRemoveAnswerBlank
            },
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            withCredentials: true
        })
        return response;
    }
}