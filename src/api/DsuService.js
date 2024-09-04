import axios from "axios";
import { API_URL } from "./config";

export default class DsuService {
    static async getEdukinds() {
        const response = await axios.get(`${API_URL}/Dsu/GetEdukinds`, {
            withCredentials: true
        })
        return response;
    }

    static async getFilials() {
        const response = await axios.get(`${API_URL}/Dsu/GetFilials`, {
            withCredentials: true
        })
        return response;
    }

    static async getFaculties() {
        const response = await axios.get(`${API_URL}/Dsu/GetFaculties`, {
            withCredentials: true
        })
        return response;
    }

    static async getCaseSDepartmentByFacultyId(id) {
        const response = await axios.get(`${API_URL}/Dsu/GetCaseSDepartmentByFacultyId`, {
            params: {
                facultyId: id
            },
            withCredentials: true
        })
        return response;
    }

    static async getCourseByDepartmentId(id, filialId) {
        const response = await axios.get(`${API_URL}/Dsu/GetCourseByDepartmentId`, {
            params: {
                departmentId: id,
                filialId: filialId
            },
            withCredentials: true
        })
        return response;
    }
    
    static async getGroupsByDepartmentIdAndCourse(id, nCourse, filialId) {
        const response = await axios.get(`${API_URL}/Dsu/GetGroupsByDepartmentIdAndCourse`, {
            params: {
                departmentId: id,
                course: nCourse,
                filialId: filialId
            },
            withCredentials: true
        })
        return response;
    }

    static async getStudentsByCourseAndGroup(departmentId, nCourse, nGroup, filialId) {
        const response = await axios.get(`${API_URL}/Dsu/GetStudentsByCourseAndGroup`, {
            params: {
                departmentId: departmentId,
                course: nCourse,
                ngroup: nGroup,
                filialId: filialId
            },
            withCredentials: true
        })
        return response;
    }

    static async getDisciplinesWithFilter(departmentId, nCourse, nGroup, edukindId, filId) {
        const response = await axios.get(`${API_URL}/Dsu/GetDisciplinesWithFilter`, {
            params: {
                departmentId: departmentId,
                course: nCourse,
                ngroup: nGroup,
                edukindId: edukindId,
                filId: filId
            },
            withCredentials: true
        })
        return response;
    }

    static async getTeachers() {
        const response = await axios.get(`${API_URL}/Dsu/GetTeachers`)
        return response;
    }

    static async signInStudent(studentId, nzachkn) {
        const response = await axios.post(`${API_URL}/Dsu/SignInStudent`, {
            studentId: studentId,
            nzachkn: nzachkn
        }, {
            params: {
                studentId: studentId,
                nzachkn: nzachkn
            },
            withCredentials: true
        }).catch((error) => {
            return error.response;
        })

        return response;
    }
}