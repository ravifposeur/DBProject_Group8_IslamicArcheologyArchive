import { endpoints } from './api.js';
import { renderPendingSites, renderPendingArtefacts } from './ui.js';
import { isLoggedIn } from './auth.js';

window.handleSiteAction = async (id, action) => {
    if (!confirm("Yakin?")) return;
    try {
        if (action === 'approve') await endpoints.approveSite(id);
        else if (action === 'reject') await endpoints.rejectSite(id);
        else if (action === 'delete') await endpoints.deleteSite(id);
        alert("Sukses!"); loadDashboardData();
    } catch (err) { alert(err.message); }
};

window.handleArtefactAction = async (id, action) => {
    if (!confirm("Yakin?")) return;
    try {
        if (action === 'approve') await endpoints.approveArtefact(id);
        else if (action === 'reject') await endpoints.rejectArtefact(id);
        else if (action === 'delete') await endpoints.deleteArtefact(id);
        alert("Sukses!"); loadDashboardData();
    } catch (err) { alert(err.message); }
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