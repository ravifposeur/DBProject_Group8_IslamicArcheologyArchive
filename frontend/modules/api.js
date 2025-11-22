import { getToken, logout } from './auth.js';

const API_BASE = 'http://localhost:3000'; 

async function apiRequest(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        const data = await response.json();
        
        if (response.status === 401 || response.status === 403) {
            if (response.status === 401) {
                logout();
            }
            throw new Error(data.message || 'Access Denied');
        }

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }
        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

export const endpoints = {
    getVerifiedSites: () => apiRequest('/api/situs/verified'),
    getSiteArtefacts: (situsId) => apiRequest(`/api/objek/verified/by-situs/${situsId}`),
    getKingdoms: () => apiRequest('/api/kerajaan'),
    getCities: () => apiRequest('/api/alamat/kota'),
    getDistricts: (kotaId) => apiRequest(`/api/alamat/kecamatan/by-kota/${kotaId}`),
    getVillages: (kecId) => apiRequest(`/api/alamat/desa/by-kecamatan/${kecId}`),

    register: (data) => apiRequest('/api/auth/register', 'POST', data),
    login: (data) => apiRequest('/api/auth/login', 'POST', data),
    addSite: (data) => apiRequest('/api/situs', 'POST', data),
    addArtefact: (data) => apiRequest('/api/objek', 'POST', data),

    getPendingSites: () => apiRequest('/api/situs/pending'),
    getPendingArtefacts: () => apiRequest('/api/objek/pending'),
    
    approveSite: (id) => apiRequest(`/api/situs/approve/${id}`, 'PUT'),
    rejectSite: (id) => apiRequest(`/api/situs/reject/${id}`, 'PUT'),
    
    approveArtefact: (id) => apiRequest(`/api/objek/approve/${id}`, 'PUT'),
    rejectArtefact: (id) => apiRequest(`/api/objek/reject/${id}`, 'PUT')
};