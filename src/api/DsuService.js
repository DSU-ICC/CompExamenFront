import { API_URL,axiosClassic,axiosWithAuth } from "./config";

export default class DsuService {
    static async getEdukinds() {
        const response = await axiosClassic.get(`${API_URL}/Dsu/GetEdukinds`)
        return response;
    }

    static async getFilials() {
        const response = await axiosClassic.get(`${API_URL}/Dsu/GetFilials`)
        return response;
    }

    static async getFaculties() {
        const response = await axiosClassic.get(`${API_URL}/Dsu/GetFaculties`)
        return response;
    }

    static async getCaseSDepartmentByFacultyId(id) {
        const response = await axiosClassic.get(`${API_URL}/Dsu/GetCaseSDepartmentByFacultyId`, {
            params: {
                facultyId: id
            }
        })
        return response;
    }

    static async getCourseByDepartmentId(id, filialId) {
        const response = await axiosClassic.get(`${API_URL}/Dsu/GetCourseByDepartmentId`, {
            params: {
                departmentId: id,
                filialId: filialId
            }
        })
        return response;
    }

    static async getGroupsByDepartmentIdAndCourse(id, nCourse, filialId) {
        const response = await axiosClassic.get(`${API_URL}/Dsu/GetGroupsByDepartmentIdAndCourse`, {
            params: {
                departmentId: id,
                course: nCourse,
                filialId: filialId
            }
        })
        return response;
    }

    static async getStudentsByCourseAndGroup(departmentId, nCourse, nGroup, filialId) {
        const response = await axiosClassic.get(`${API_URL}/Dsu/GetStudentsByCourseAndGroup`, {
            params: {
                departmentId: departmentId,
                course: nCourse,
                ngroup: nGroup,
                filialId: filialId
            }
        })
        return response;
    }

    static async getDisciplinesWithFilter(departmentId, nCourse, nGroup, edukindId, filId) {
        const response = await axiosWithAuth.get(`${API_URL}/Dsu/GetDisciplinesWithFilter`, {
            params: {
                departmentId: departmentId,
                course: nCourse,
                ngroup: nGroup,
                edukindId: edukindId,
                filId: filId
            }
        })
        return response;
    }

    static async getTeachers() {
        const response = await axiosWithAuth.get(`${API_URL}/Dsu/GetTeachers`)
        return response;
    }

    static async signInStudent(studentId, nzachkn) {
        const response = await axiosClassic.post(`${API_URL}/Dsu/StudentSignIn`, {
            studentId: studentId,
            nzachkn: nzachkn
        }, {
            params: {
                studentId: studentId,
                nzachkn: nzachkn
            }
        }).catch((error) => {
            return error.response;
        })

        return response;
    }
}