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
            if (response.status === 401) logout();
            throw new Error(data.message || 'Akses Ditolak');
        }
        if (!response.ok) throw new Error(data.message || 'Gagal Request');
        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

export const endpoints = {
    getVerifiedSites: () => apiRequest('/api/situs/verified'),
    getSiteArtefacts: (situsId) => apiRequest(`/api/objek/verified/by-situs/${situsId}`),
    getPendingSites: () => apiRequest('/api/situs/pending'),
    getPendingArtefacts: () => apiRequest('/api/objek/pending'),
    addSite: (data) => apiRequest('/api/situs', 'POST', data),
    addArtefact: (data) => apiRequest('/api/objek', 'POST', data),
    
    approveSite: (id) => apiRequest(`/api/situs/approve/${id}`, 'PUT'),
    rejectSite: (id) => apiRequest(`/api/situs/reject/${id}`, 'PUT'),
    deleteSite: (id) => apiRequest(`/api/situs/${id}`, 'DELETE'),
    
    approveArtefact: (id) => apiRequest(`/api/objek/approve/${id}`, 'PUT'),
    rejectArtefact: (id) => apiRequest(`/api/objek/reject/${id}`, 'PUT'),
    deleteArtefact: (id) => apiRequest(`/api/objek/${id}`, 'DELETE'),

    getTokoh: () => apiRequest('/api/tokoh'),
    getTokohById: (id) => apiRequest(`/api/tokoh/${id}`),
    addTokoh: (data) => apiRequest('/api/tokoh', 'POST', data),
    updateTokoh: (id, data) => apiRequest(`/api/tokoh/${id}`, 'PUT', data),
    deleteTokoh: (id) => apiRequest(`/api/tokoh/${id}`, 'DELETE'),

    getArkeolog: () => apiRequest('/api/arkeolog'),
    getArkeologById: (id) => apiRequest(`/api/arkeolog/${id}`),
    addArkeolog: (data) => apiRequest('/api/arkeolog', 'POST', data),
    updateArkeolog: (id, data) => apiRequest(`/api/arkeolog/${id}`, 'PUT', data),
    deleteArkeolog: (id) => apiRequest(`/api/arkeolog/${id}`, 'DELETE'),

    getKingdoms: () => apiRequest('/api/kerajaan'),
    getKingdomById: (id) => apiRequest(`/api/kerajaan/${id}`),
    addKingdom: (data) => apiRequest('/api/kerajaan', 'POST', data),
    updateKingdom: (id, data) => apiRequest(`/api/kerajaan/${id}`, 'PUT', data),
    deleteKingdom: (id) => apiRequest(`/api/kerajaan/${id}`, 'DELETE'),

    getCities: () => apiRequest('/api/alamat/kota'),
    getDistricts: (kotaId) => apiRequest(`/api/alamat/kecamatan/by-kota/${kotaId}`),
    getVillages: (kecId) => apiRequest(`/api/alamat/desa/by-kecamatan/${kecId}`),
    
    addCity: (name) => apiRequest('/api/alamat/kota', 'POST', { nama_kota_kabupaten: name }),
    updateCity: (id, name) => apiRequest(`/api/alamat/kota/${id}`, 'PUT', { nama_kota_kabupaten: name }),
    deleteCity: (id) => apiRequest(`/api/alamat/kota/${id}`, 'DELETE'),

    addDistrict: (name, kotaId) => apiRequest('/api/alamat/kecamatan', 'POST', { nama_kecamatan: name, kota_kabupaten_id: kotaId }),
    updateDistrict: (id, name, kotaId) => apiRequest(`/api/alamat/kecamatan/${id}`, 'PUT', { nama_kecamatan: name, kota_kabupaten_id: kotaId }),
    deleteDistrict: (id) => apiRequest(`/api/alamat/kecamatan/${id}`, 'DELETE'),

    addVillage: (name, kecId) => apiRequest('/api/alamat/desa', 'POST', { nama_desa_kelurahan: name, kecamatan_id: kecId }),
    updateVillage: (id, name, kecId) => apiRequest(`/api/alamat/desa/${id}`, 'PUT', { nama_desa_kelurahan: name, kecamatan_id: kecId }),
    deleteVillage: (id) => apiRequest(`/api/alamat/desa/${id}`, 'DELETE'),

    getResearchersBySite: (situsId) => apiRequest(`/api/relasi/penelitian/by-situs/${situsId}`),
    getOwnersByObject: (objekId) => apiRequest(`/api/relasi/atribusi/by-objek/${objekId}`),
    getTitles: (tokohId) => apiRequest(`/api/relasi/gelar/by-tokoh/${tokohId}`),

    addPenelitian: (arkeologId, situsId) => apiRequest('/api/relasi/penelitian', 'POST', { arkeolog_id: arkeologId, situs_id: situsId }),
    deletePenelitian: (arkeologId, situsId) => apiRequest('/api/relasi/penelitian', 'DELETE', { arkeolog_id: arkeologId, situs_id: situsId }),

    addAtribusi: (objekId, tokohId) => apiRequest('/api/relasi/atribusi', 'POST', { objek_id: objekId, tokoh_id: tokohId }),
    deleteAtribusi: (objekId, tokohId) => apiRequest('/api/relasi/atribusi', 'DELETE', { objek_id: objekId, tokoh_id: tokohId }),

    addTitle: (tokohId, gelar) => apiRequest('/api/relasi/gelar', 'POST', { tokoh_id: tokohId, gelar_tokoh: gelar }),
    deleteTitle: (tokohId, gelar) => apiRequest('/api/relasi/gelar', 'DELETE', { tokoh_id: tokohId, gelar_tokoh: gelar }),
    
    register: (data) => apiRequest('/api/auth/register', 'POST', data),
    login: (data) => apiRequest('/api/auth/login', 'POST', data),
};