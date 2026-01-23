import { API_URL, axiosWithAuth } from "./config"

export default class EmployeeService {
    static async getAuditories() {
        const response = await axiosWithAuth.get(`${API_URL}/Employee/GetAuditories`)
        return response;
    }
}