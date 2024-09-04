import axios from "axios"
import { API_URL, getToken } from "./config"

export default class EmployeeService {
    static async getEmployees() {
        const response = await axios.get(`${API_URL}/Employee/GetEmployees`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        })
        return response;
    }

    static async getAuditories() {
        const response = await axios.get(`${API_URL}/Employee/GetAuditories`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        })
        return response;
    }
}