import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

export const getStats = async () => {
    const response = await axios.get(`${API_URL}/support/stats`, getHeaders());
    return response.data;
};

export const getTickets = async () => {
    const response = await axios.get(`${API_URL}/support/tickets`, getHeaders());
    return response.data;
};

export const replyTicket = async (ticketId, message) => {
    const response = await axios.post(`${API_URL}/support/ticket/reply`, { ticketId, message }, getHeaders());
    return response.data;
};

export const closeTicket = async (id) => {
    const response = await axios.put(`${API_URL}/support/ticket/${id}/close`, {}, getHeaders());
    return response.data;
};

export const getAllUsers = async () => {
    const response = await axios.get(`${API_URL}/support/users`, getHeaders());
    return response.data;
};
