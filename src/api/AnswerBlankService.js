import { API_URL, axiosWithAuth } from "./config";

export default class AnswerBlankService {
    static async getAnswerBlankById(id) {
        const response = await axiosWithAuth.get(`${API_URL}/AnswerBlank/GetAnswerBlankById`, {
            params: {
                id: id
            }
        }).catch((error) => {
            return error.response
        })
        return response;
    }

    static async getAnswerBlankByExamenIdAndStudentId(examId, studentId) {
        const response = await axiosWithAuth.get(`${API_URL}/AnswerBlank/GetAnswerBlanksByExamenIdAndStudentId`, {
            params: {
                examId: examId,
                studentId: studentId
            }
        })
        return response;
    }

    static async updateAnswerBlank(answerBlank) {
        const response = await axiosWithAuth.post(`${API_URL}/AnswerBlank/UpdateAnswerBlank`, answerBlank).catch((error) => {
            return error.response
        })
        return response;
    }

    static async endExamenForStudent(answerBlankId) {
        const response = await axiosWithAuth.post(`${API_URL}/AnswerBlank/EndExamenForStudent?answerBlankId=${answerBlankId}`).catch((error) => {
            return error.response
        })
        return response;
    }

    static async resetExamenForStudent(answerBlankId, isRemoveAnswerBlank, additionalTimeInMinutes) {
        const response = await axiosWithAuth.post(`${API_URL}/AnswerBlank/ResetAnswerBlank`, {
            answerBlankId: answerBlankId,
            isRemoveAnswerBlank: isRemoveAnswerBlank
        }, {
            params: {
                answerBlankId: answerBlankId,
                additionalTimeInMinutes,
                isRemoveAnswerBlank: isRemoveAnswerBlank
            }
        })
        return response;
    }
}