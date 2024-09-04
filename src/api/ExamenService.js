import axios from "axios";
import { API_URL, getToken } from "./config";

export default class ExamenService {
    static async getExamens() {
        const response = await axios.get(`${API_URL}/Examen/GetExamens`)
        return response;
    }

    static async getExamensByStudentId(id) {
        const response = await axios.get(`${API_URL}/Examen/GetExamensByStudentId`, {
            params: {
                studentId: id
            },
            withCredentials: true
        }).catch((error) => {
            return error.response;
        })
        return response;
    }

    static async getExamensByEmployeeId(id) {
        const response = await axios.get(`${API_URL}/Examen/GetExamensByEmployeeId`, {
            params: {
                employeeId: id,
            },
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            withCredentials: true
        })
        return response;
    }

    static async getExamensByAuditoriumId(id) {
        const response = await axios.get(`${API_URL}/Examen/GetExamensByAuditoriumId`, {
            params: {
                auditoriumId: id,
            },
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            withCredentials: true
        })
        return response;
    }

    static async getStudentsByExamenId(id) {
        const response = await axios.get(`${API_URL}/Examen/GetStudentsByExamenId`, {
            params: {
                examenId: id,
            },
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            withCredentials: true
        })
        return response;
    }

    static async startExamen(id, examenId) {
        const response = await axios.get(`${API_URL}/Examen/StartExamen`, {
            params: {
                studentId: id,
                examId: examenId
            },
            withCredentials: true
        }).catch((error) => {
            return error.response;
        })
        return response;
    }

    static async createExamen(examenData) {
        const response = await axios.post(`${API_URL}/Examen/CreateExamen`, examenData, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            withCredentials: true
        })
        return response;
    }

    static async editExamen(examenData) {
        const response = await axios.post(`${API_URL}/Examen/UpdateExamen`, examenData, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            withCredentials: true
        })
        return response;
    }

    static async deleteExamen(examenId) {
        const response = await axios.post(`${API_URL}/Examen/DeleteExamen?id=${examenId}`, {}, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            withCredentials: true
        })
        return response;
    }

    static async copyExamen(examenId, newDateExamen) {
        const response = await axios.post(`${API_URL}/Examen/CopyExamen`, {
            examenId: examenId,
            newExamDate: newDateExamen
        }, {
            params: {
                examenId: examenId,
                newExamDate: newDateExamen
            },
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            withCredentials: true
        })
        return response;
    }

    static async resetExamenForTeacher(examenId) {
        const response = await axios.post(`${API_URL}/Examen/ResetExamen`, {
            examenId: examenId,
        }, {
            params: {
                examenId: examenId,
            },
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            withCredentials: true
        })
        return response
    }

    static async getStudentsByExamenIdForChecking(examenId) {
        const response = await axios.get(`${API_URL}/Examen/GetStudentsByExamenIdForChecking`, {
            params: {
                examenId: examenId
            },
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            withCredentials: true
        })
        return response;
    }

    static async getExamensFromArchiveByFilter(filter) {
        const response = await axios.get(`${API_URL}/Examen/GetExamensFromArchiveByFilter`, {
            params: {
                filialId: filter.filialId,
                facultyId: filter.facultyId,
                departmentId: filter.departmentId,
                startDate: filter.startDate,
                endDate: filter.endDate
            },
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            withCredentials: true
        })
        return response;
    }

    static async getExamensFromArchiveByAuditoriumId(auditoriumId) {
        const response = await axios.get(`${API_URL}/Examen/GetExamensFromArchiveByAuditoriumId`, {
            params: {
                auditoriumId: auditoriumId
            },
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            withCredentials: true
        })
        return response;
    }

    static async generateExcelFile(examenId) {
        const response = await axios.get(`${API_URL}/Examen/GenerateExcelFile`, {
            params: {
                examenId: examenId
            },
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            withCredentials: true
        })
        return response;
    }

    static async endExamenForEmployee(examenId) {
        const response = await axios.get(`${API_URL}/Examen/EndExamenForEmployee`, {
            params: {
                examId: examenId
            },
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            withCredentials: true
        })
        return response;
    }
}