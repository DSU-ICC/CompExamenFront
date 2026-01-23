import { API_URL, axiosWithAuth } from "./config";

export default class TicketService {
    static async getTicketsByExamenId(id) {
        const response = await axiosWithAuth.get(`${API_URL}/Ticket/GetTicketsByExamenId`, {
            params: {
                examenId: id
            }
        })
        return response;
    }

    static async deleteTicket(id) {
        const response = await axiosWithAuth.post(`${API_URL}/Ticket/DeleteTicket?id=${id}`)
        return response;
    }
}