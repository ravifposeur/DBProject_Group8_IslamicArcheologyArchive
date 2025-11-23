import { isLoggedIn, getUserRole } from './auth.js';

export function renderSiteCards(sites, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    if (!sites || sites.length === 0) {
        container.innerHTML = '<p style="text-align:center; width:100%;">Tidak ada situs terverifikasi ditemukan.</p>';
        return;
    }

    const userIn = isLoggedIn();
    const role = getUserRole();
    const canEdit = userIn && (role === 'verifikator' || role === 'administrator');
    const canDelete = userIn && (role === 'administrator');

    sites.forEach(s => {
        const card = document.createElement('div');
        card.className = 'card-situs';
        
        let adminActions = '';
        if (canEdit) {
            adminActions += `<a href="edit-situs.html?id=${s.situs_id}" class="btn-xs" style="background:#3498db; text-decoration:none; padding:5px 10px; color:white; border-radius:4px; margin-right:5px;">Edit</a>`;
        }
        if (canDelete) {
            adminActions += `<button onclick="window.delItem('situs', ${s.situs_id})" class="btn-xs" style="background:#c0392b; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Hapus</button>`;
        }

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:start;">
                <h3>${s.nama_situs}</h3>
                <span class="badge">${s.jenis_situs}</span>
            </div>
            
            <p class="location"> <strong>Lokasi</strong>: ${s.nama_desa_kelurahan}, ${s.nama_kecamatan}</p>
            <p class="desc">${s.nama_kerajaan ? '<strong>Kerajaan</strong>: ' + s.nama_kerajaan : 'Kerajaan Tidak Diketahui'}</p>
            
            <div style="margin-top:10px; margin-bottom:10px;">
                ${adminActions}
            </div>

            <div class="card-actions">
                <button class="btn-map" onclick="window.viewOnMap(${s.latitude}, ${s.longitude})">Peta</button>
                <button class="btn-detail" onclick="window.loadSiteDetails(${s.situs_id})">Objek/Artefak</button>
            </div>

            <div id="details-${s.situs_id}" style="display:none; margin-top:10px; border-top:1px dashed #ccc; padding-top:10px;">
                <div id="researchers-${s.situs_id}" class="researcher-list"></div>
                <div id="artefacts-${s.situs_id}" class="artefact-list"></div>
            </div>
        `;
        container.appendChild(card);
    });
}

export function renderResearchers(researchers, containerId, situsId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const canMod = isLoggedIn() && (getUserRole() === 'verifikator' || getUserRole() === 'administrator');

    if (!researchers || researchers.length === 0) {
        container.innerHTML = '<small style="display:block; margin-bottom:10px;">Belum ada data peneliti.</small>';
        return;
    }

    const listHtml = researchers.map(r => `
        <li style="margin-bottom: 4px;">
            <a href="arkeolog.html">${r.nama_lengkap}</a>
            ${canMod ? ` <a href="#" onclick="window.unlinkPenelitian(${r.arkeolog_id}, ${situsId})" style="color:red; text-decoration:none; font-weight:bold; font-size:0.9em;">Hapus</a>` : ''}
        </li>
    `).join('');

    container.innerHTML = `<strong>Tim Peneliti:</strong><ul style="margin:5px 0 15px 20px;">${listHtml}</ul>`;
}

export function renderArtefacts(artefacts, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const canMod = isLoggedIn() && (getUserRole() === 'verifikator' || getUserRole() === 'administrator');

    if (!artefacts || artefacts.length === 0) {
        container.innerHTML = '<small>Tidak ada artefak terverifikasi.</small>';
        return;
    }

    container.innerHTML = artefacts.map(a => {
        let ownerHtml = '';
        
        if (a.owners && a.owners.length > 0) {
            const names = a.owners.map(o => {
                let link = `<a href="tokoh.html">${o.nama_tokoh}</a>`;
                if (canMod) {
                    link += ` <a href="#" onclick="window.unlinkAtribusi(${a.objek_id}, ${o.tokoh_id}, ${a.situs_id})" style="color:red; text-decoration:none; margin-left:2px;">Hapus</a>`;
                }
                return link;
            }).join(', ');
            
            ownerHtml = `<div style="font-size:0.85em; color:#555; margin-top:2px;">Atribusi: ${names}</div>`;
        }

        let itemActions = '';
        if (canMod) {
            itemActions = `
                <div style="margin-top:5px; font-size:0.9em;">
                    <a href="edit-artefak.html?id=${a.objek_id}" style="color:#f39c12; text-decoration:none; margin-right:5px;">Edit</a>
                    <a href="#" onclick="window.delItem('objek', ${a.objek_id})" style="color:#c0392b;">Hapus</a>
                </div>
            `;
        }

        return `
        <div class="artefact-item">
            <strong>${a.nama_objek}</strong> (${a.jenis_objek})<br>
            <small>Bahan: ${a.bahan}</small>
            ${ownerHtml} 
            ${itemActions}
        </div>
        `;
    }).join('');
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