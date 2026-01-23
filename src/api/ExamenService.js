import { API_URL, axiosWithAuth } from "./config";

export default class ExamenService {
    static async getExamens() {
        const response = await axiosWithAuth.get(`${API_URL}/Examen/GetExamens`)
        return response;
    }

    static async getExamenById(examenId) {
        const response = await axiosWithAuth.get(`${API_URL}/Examen/GetExamenByExamenId`, {
            params: {examenId}
        })
        return response
    }

    static async getRetakes() {
        const response = await axiosWithAuth.get(`${API_URL}/Examen/GetRetakes`)
        return response
    }

    static async getExamensByStudentId(id) {
        const response = await axiosWithAuth.get(`${API_URL}/Examen/GetExamensByStudentId`, {
            params: {
                studentId: id
            }
        }).catch((error) => {
            return error.response;
        })
        return response;
    }

    static async getExamensByEmployeeId(id) {
        const response = await axiosWithAuth.get(`${API_URL}/Examen/GetExamensByEmployeeId`, {
            params: {
                employeeId: id,
            }
        })
        return response;
    }

    static async getExamensByAuditoriumId(id) {
        const response = await axiosWithAuth.get(`${API_URL}/Examen/GetExamensByAuditoriumId`, {
            params: {
                auditoriumId: id,
            }
        })
        return response;
    }

    static async getStudentsByExamenId(id) {
        const response = await axiosWithAuth.get(`${API_URL}/Examen/GetStudentsByExamenId`, {
            params: {
                examenId: id,
            }
        })
        return response;
    }

    static async getStatisticForExamFromArchive(examenId) {
        const response = await axiosWithAuth.get(`${API_URL}/Examen/GetStatisticForExamFromArchive`, {
            params: {
                examenId
            }
        })
        return response;
    }

    static async startExamen(id, examenId) {
        const response = await axiosWithAuth.get(`${API_URL}/Examen/StartExamen`, {
            params: {
                studentId: id,
                examId: examenId
            }
        }).catch((error) => {
            return error.response;
        })
        return response;
    }

    static async createExamen(examenData) {
        const response = await axiosWithAuth.post(`${API_URL}/Examen/CreateExamen`, examenData)
        return response;
    }

    static async editExamen(examenData) {
        const response = await axiosWithAuth.post(`${API_URL}/Examen/UpdateExamen`, examenData)
        return response;
    }

    static async deleteExamen(examenId) {
        const response = await axiosWithAuth.post(`${API_URL}/Examen/DeleteExamen?id=${examenId}`)
        return response;
    }

    static async copyExamen(examenId, newDateExamen) {
        const response = await axiosWithAuth.post(`${API_URL}/Examen/CopyExamen`, {
            examenId: examenId,
            newExamDate: newDateExamen
        }, {
            params: {
                examenId: examenId,
                newExamDate: newDateExamen
            }
        })
        return response;
    }

    static async resetExamenForTeacher(examenId) {
        const response = await axiosWithAuth.post(`${API_URL}/Examen/ResetExamen`, {
            examenId: examenId,
        }, {
            params: {
                examenId: examenId,
            }
        })
        return response
    }

    static async getStudentsByExamenIdForChecking(examenId) {
        const response = await axiosWithAuth.get(`${API_URL}/Examen/GetStudentsByExamenIdForChecking`, {
            params: {
                examenId: examenId
            }
        })
        return response;
    }

    static async getExamensFromArchiveByFilter(filter) {
        const response = await axiosWithAuth.get(`${API_URL}/Examen/GetExamensFromArchiveByFilter`, {
            params: {
                filialId: filter.filialId,
                facultyId: filter.facultyId,
                departmentId: filter.departmentId,
                startDate: new Date(new Date(filter.startDate).setHours(new Date(filter.startDate).getHours() + 3)),
                endDate: new Date(new Date(filter.endDate).setHours(new Date(filter.endDate).getHours() + 3))
            }
        })
        return response;
    }

    static async getExamensFromArchiveByAuditoriumId(auditoriumId) {
        const response = await axiosWithAuth.get(`${API_URL}/Examen/GetExamensFromArchiveByAuditoriumId`, {
            params: {
                auditoriumId: auditoriumId
            }
        })
        return response;
    }

    static async generateExcelFile(examenId) {
        const response = await axiosWithAuth.get(`${API_URL}/Examen/GenerateExcelFile`, {
            params: {
                examenId: examenId
            }
        })
        return response;
    }

    static async endExamenForEmployee(examenId) {
        const response = await axiosWithAuth.get(`${API_URL}/Examen/EndExamenForEmployee`, {
            params: {
                examId: examenId
            }
        })
        return response;
    }

    static async getStatisticForPrint(examenId) {
        const response = await axiosWithAuth.get(`${API_URL}/Examen/GetStatisticForPrint`, {
            params: {examenId}
        })
        return response
    }
}