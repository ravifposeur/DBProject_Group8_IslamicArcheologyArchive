import { endpoints } from './api.js';
import { renderPendingSites, renderPendingArtefacts } from './ui.js';
import { isLoggedIn } from './auth.js';

window.handleSiteAction = async (id, action) => {
    const actionText = action === 'approve' ? 'menyetujui' : 'menolak';
    
    if (!confirm(`Apakah Anda yakin ingin ${actionText} situs ini?`)) return;
    
    try {
        if (action === 'approve') await endpoints.approveSite(id);
        else await endpoints.rejectSite(id);
        
        alert(`Situs berhasil di${action === 'approve' ? 'setujui' : 'tolak'}!`);
        loadDashboardData();
    } catch (err) {
        alert(`Error: ${err.message}`);
    }
};

window.handleArtefactAction = async (id, action) => {
    const actionText = action === 'approve' ? 'menyetujui' : 'menolak';
    
    if (!confirm(`Apakah Anda yakin ingin ${actionText} objek ini?`)) return;

    try {
        if (action === 'approve') await endpoints.approveArtefact(id);
        else await endpoints.rejectArtefact(id);
        
        alert(`Objek berhasil di${action === 'approve' ? 'setujui' : 'tolak'}!`);
        loadDashboardData();
    } catch (err) {
        alert(`Error: ${err.message}`);
    }
};

async function loadDashboardData() {
    try {
        const sites = await endpoints.getPendingSites();
        renderPendingSites(sites, 'pending-sites-list');

        const artefacts = await endpoints.getPendingArtefacts();
        renderPendingArtefacts(artefacts, 'pending-artefacts-list');

    } catch (err) {
        console.error(err);
        document.getElementById('dashboard-container').innerHTML = 
            `<div class="error-msg"><h3>Akses Ditolak</h3><p>Anda tidak memiliki izin untuk melihat halaman ini.</p></div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    if (document.getElementById('dashboard-container')) {
        loadDashboardData();
    }
});