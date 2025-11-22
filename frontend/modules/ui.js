export function renderSiteCards(sites, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    if (!sites || sites.length === 0) {
        container.innerHTML = '<p style="text-align:center; width:100%;">Tidak ada situs terverifikasi ditemukan.</p>';
        return;
    }

    sites.forEach(s => {
        const card = document.createElement('div');
        card.className = 'card-situs';
        card.innerHTML = `
            <h3>${s.nama_situs}</h3>
            <span class="badge">${s.jenis_situs}</span>
            <p class="location"> <strong>Lokasi</strong>: ${s.nama_desa_kelurahan}, ${s.nama_kecamatan}</p>
            <p class="desc">${s.nama_kerajaan ? '<strong>Kerajaan</strong>: ' + s.nama_kerajaan : 'Kerajaan Tidak Diketahui'}</p>
            <div class="card-actions">
                <button class="btn-map" onclick="window.viewOnMap(${s.latitude}, ${s.longitude})">Peta</button>
                <button class="btn-detail" onclick="window.toggleArtefacts(${s.situs_id})">Objek/Artefak</button>
            </div>
            <div id="artefacts-${s.situs_id}" class="artefact-list" style="display:none;">Memuat...</div>
        `;
        container.appendChild(card);
    });
}

export function renderArtefacts(artefacts, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!artefacts || artefacts.length === 0) {
        container.innerHTML = '<small>Tidak ada artefak terverifikasi.</small>';
        return;
    }

    container.innerHTML = artefacts.map(a => `
        <div class="artefact-item">
            <strong>${a.nama_objek}</strong> (${a.jenis_objek})<br>
            <small>Bahan: ${a.bahan}</small>
        </div>
    `).join('');
}

export function populateSelect(elementId, data, valueKey, textKey) {
    const select = document.getElementById(elementId);
    if (!select) return;
    
    const firstOption = select.firstElementChild;
    select.innerHTML = ''; 
    select.appendChild(firstOption);

    if (!data) return;

    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[textKey];
        select.appendChild(option);
    });
}

export function renderPendingSites(sites, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    if (!sites || sites.length === 0) {
        container.innerHTML = '<p>Tidak ada situs menunggu verifikasi.</p>';
        return;
    }

    sites.forEach(s => {
        const card = document.createElement('div');
        card.className = 'card-situs card-pending'; 
        card.innerHTML = `
            <div class="status-badge pending">Menunggu Verifikasi</div>
            <h3>${s.nama_situs}</h3>
            <p><strong>Jenis:</strong> ${s.jenis_situs}</p>
            <p><strong>Lokasi:</strong> ${s.nama_desa_kelurahan}, ${s.nama_kecamatan}</p>
            <p><strong>ID Pelapor:</strong> ${s.pengguna_pelapor_id || 'N/A'}</p>
            <div class="card-actions">
                <button class="btn-approve" onclick="window.handleSiteAction(${s.situs_id}, 'approve')">✅ Setuju</button>
                <button class="btn-reject" onclick="window.handleSiteAction(${s.situs_id}, 'reject')">❌ Tolak</button>
            </div>
        `;
        container.appendChild(card);
    });
}

export function renderPendingArtefacts(artefacts, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    if (!artefacts || artefacts.length === 0) {
        container.innerHTML = '<p>Tidak ada artefak menunggu verifikasi.</p>';
        return;
    }

    artefacts.forEach(a => {
        const card = document.createElement('div');
        card.className = 'card-situs card-pending';
        card.innerHTML = `
             <div class="status-badge pending">Menunggu Verifikasi</div>
            <h3>${a.nama_objek}</h3>
            <p><strong>Bahan:</strong> ${a.bahan}</p>
            <p><strong>ID Situs:</strong> ${a.situs_id}</p>
            <div class="card-actions">
                <button class="btn-approve" onclick="window.handleArtefactAction(${a.objek_id}, 'approve')">✅ Setuju</button>
                <button class="btn-reject" onclick="window.handleArtefactAction(${a.objek_id}, 'reject')">❌ Tolak</button>
            </div>
        `;
        container.appendChild(card);
    });
}