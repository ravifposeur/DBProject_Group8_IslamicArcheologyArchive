import { endpoints } from './api.js';
import { renderSiteCards, populateSelect, renderArtefacts, renderResearchers } from './ui.js';
import { initMap, addMarkers, flyTo } from './map.js';
import { isLoggedIn, logout, saveToken, getUserRole } from './auth.js';

window.viewOnMap = (lat, long) => flyTo(lat, long);

window.loadSiteDetails = async (situsId) => {
    const container = document.getElementById(`details-${situsId}`); 
    const resContainer = document.getElementById(`researchers-${situsId}`);
    const artContainer = document.getElementById(`artefacts-${situsId}`);

    if (container.style.display === 'block') { 
        container.style.display = 'none'; 
        return; 
    }
    container.style.display = 'block';
    
    resContainer.innerHTML = '<small>Memuat data peneliti...</small>';
    artContainer.innerHTML = '<small>Memuat artefak...</small>';

    try {
        const researchers = await endpoints.getResearchersBySite(situsId);
        renderResearchers(researchers, `researchers-${situsId}`, situsId);

        const rawArtefacts = await endpoints.getSiteArtefacts(situsId);

        const artefactsWithOwners = await Promise.all(rawArtefacts.map(async (item) => {
            try {
                const owners = await endpoints.getOwnersByObject(item.objek_id);
                return { ...item, owners: owners };
            } catch (err) {
                return { ...item, owners: [] };
            }
        }));

        renderArtefacts(artefactsWithOwners, `artefacts-${situsId}`);

    } catch (e) { 
        console.error(e);
        resContainer.innerHTML = '<small style="color:red">Gagal memuat data.</small>'; 
    }
};

window.delItem = async (type, id) => {
    if(!confirm("Yakin ingin menghapus data ini?")) return;
    try {
        if(type === 'tokoh') await endpoints.deleteTokoh(id);
        if(type === 'arkeolog') await endpoints.deleteArkeolog(id);
        if(type === 'kerajaan') await endpoints.deleteKingdom(id);
        if(type === 'situs') await endpoints.deleteSite(id);     
        if(type === 'objek') await endpoints.deleteArtefact(id); 
        alert("Terhapus!");
        location.reload();
    } catch(e) { alert(e.message); }
};

document.addEventListener('DOMContentLoaded', async () => {
    
    const navAuth = document.getElementById('nav-auth');
    if (navAuth) {
        if (isLoggedIn()) {
            const role = getUserRole();
            let html = '';
            if (role === 'verifikator' || role === 'administrator') {
                html += '<a href="dashboard.html" style="color:#f1c40f; font-weight:bold; margin-right:15px; text-decoration:none;">Dashboard</a>';
            }
            html += '<a href="#" id="btn-logout" style="color:#e74c3c; text-decoration:none;">Keluar</a>';
            navAuth.innerHTML = html;
            document.getElementById('btn-logout').addEventListener('click', logout);
        } else {
            navAuth.innerHTML = '<a href="login.html">Masuk</a>';
        }
    }

    if (document.getElementById('situs-list')) {
        initMap('mapid');
        try {
            const sites = await endpoints.getVerifiedSites();
            renderSiteCards(sites, 'situs-list');
            addMarkers(sites);
            
            const searchInput = document.getElementById('search-input');
            if(searchInput) {
                searchInput.addEventListener('keyup', (e) => {
                    const term = e.target.value.toLowerCase();
                    const cards = document.querySelectorAll('.card-situs');
                    cards.forEach(card => {
                        card.style.display = card.innerText.toLowerCase().includes(term) ? 'flex' : 'none';
                    });
                });
            }
        } catch (err) { console.log("Error load sites:", err); }
    }

    if (document.getElementById('tokoh-list')) {
        try {
            const list = await endpoints.getTokoh();
            const container = document.getElementById('tokoh-list');
            const userIn = isLoggedIn();
            
            const render = (data) => {
                container.innerHTML = data.map(t => `
                    <div class="card-situs">
                        <div style="display:flex; justify-content:space-between;">
                            <h3>${t.nama_tokoh}</h3>
                            ${userIn ? `<div>
                                <a href="edit-tokoh.html?id=${t.tokoh_id}" class="btn-xs" style="background:#3498db; text-decoration:none; padding:3px 8px; color:white;">Edit</a>
                                <button onclick="window.delItem('tokoh', ${t.tokoh_id})" class="btn-xs" style="background:#c0392b; color:white;">Hapus</button>
                            </div>` : ''}
                        </div>
                        <span class="badge">${t.nama_kerajaan || 'Kerajaan ?'}</span>
                        <p>${t.biografi_singkat}</p>
                        ${userIn ? `<div style="margin-top:10px; border-top:1px solid #eee; padding-top:5px;">
                            <a href="manage-gelar.html?id=${t.tokoh_id}" style="font-size:0.8rem;">Gelar</a> | 
                            <a href="link-atribusi.html" style="font-size:0.8rem;">Atribusi</a>
                        </div>` : ''}
                    </div>`).join('');
            };
            render(list);
            document.getElementById('search-tokoh').addEventListener('keyup', (e) => render(list.filter(x => x.nama_tokoh.toLowerCase().includes(e.target.value.toLowerCase()))));
        } catch(e) { document.getElementById('tokoh-list').innerHTML = 'Error loading data.'; }
    }

    if (document.getElementById('arkeolog-list')) {
        try {
            const list = await endpoints.getArkeolog();
            const container = document.getElementById('arkeolog-list');
            const userIn = isLoggedIn();
            const render = (data) => {
                container.innerHTML = data.map(a => `
                    <div class="card-situs">
                        <div style="display:flex; justify-content:space-between;">
                            <h3>${a.nama_lengkap}</h3>
                            ${userIn ? `<div>
                                <a href="edit-arkeolog.html?id=${a.arkeolog_id}" class="btn-xs" style="background:#3498db; text-decoration:none; padding:3px 8px; color:white;">Edit</a>
                                <button onclick="window.delItem('arkeolog', ${a.arkeolog_id})" class="btn-xs" style="background:#c0392b; color:white;">Hapus</button>
                            </div>` : ''}
                        </div>
                        <p><strong>Institusi:</strong> ${a.afiliasi_institusi}</p>
                        <p>📧 ${a.email}</p>
                        ${userIn ? `<div style="margin-top:10px; border-top:1px solid #eee; padding-top:5px;"><a href="link-penelitian.html" style="font-size:0.8rem;">Catat Penelitian</a></div>` : ''}
                    </div>`).join('');
            };
            render(list);
            document.getElementById('search-arkeolog').addEventListener('keyup', (e) => render(list.filter(x => x.nama_lengkap.toLowerCase().includes(e.target.value.toLowerCase()))));
        } catch(e) { document.getElementById('arkeolog-list').innerHTML = 'Error.'; }
    }

    if (document.getElementById('kingdom-list')) {
        try {
            const list = await endpoints.getKingdoms();
            const container = document.getElementById('kingdom-list');
            const userIn = isLoggedIn();
            const render = (data) => {
                container.innerHTML = data.map(k => `
                    <div class="card-situs">
                        <div style="display:flex; justify-content:space-between;">
                            <h3>${k.nama_kerajaan}</h3>
                            ${userIn ? `<div>
                                <a href="edit-kerajaan.html?id=${k.kerajaan_id}" class="btn-xs" style="background:#3498db; text-decoration:none; padding:3px 8px; color:white;">Edit</a>
                                <button onclick="window.delItem('kerajaan', ${k.kerajaan_id})" class="btn-xs" style="background:#c0392b; color:white;">Hapus</button>
                            </div>` : ''}
                        </div>
                        <span class="badge">${k.pusat_pemerintahan || '?'}</span>
                        <p>${k.deskripsi_singkat}</p>
                    </div>`).join('');
            };
            render(list);
            document.getElementById('search-kingdom').addEventListener('keyup', (e) => render(list.filter(x => x.nama_kerajaan.toLowerCase().includes(e.target.value.toLowerCase()))));
        } catch(e) { document.getElementById('kingdom-list').innerHTML = 'Error.'; }
    }

    const addForm = document.getElementById('form-add-situs');
    if (addForm) {
        if (!isLoggedIn()) { alert("Silakan login."); window.location.href = 'login.html'; return; }

        const kingdoms = await endpoints.getKingdoms();
        populateSelect('kerajaan_id', kingdoms, 'kerajaan_id', 'nama_kerajaan');
        const cities = await endpoints.getCities();
        populateSelect('kota_id', cities, 'kota_kabupaten_id', 'nama_kota_kabupaten');

        document.getElementById('kota_id').addEventListener('change', async (e) => {
            const data = await endpoints.getDistricts(e.target.value);
            populateSelect('kecamatan_id', data, 'kecamatan_id', 'nama_kecamatan');
            document.getElementById('desa_kelurahan_id').innerHTML = '<option value="">Pilih Desa...</option>';
        });

        document.getElementById('kecamatan_id').addEventListener('change', async (e) => {
            const data = await endpoints.getVillages(e.target.value);
            populateSelect('desa_kelurahan_id', data, 'desa_kelurahan_id', 'nama_desa_kelurahan');
        });

        const setupAddBtn = (btnId, action, promptMsg, parentIdInput = null, refreshFunc) => {
            const btn = document.getElementById(btnId);
            if(btn) {
                btn.addEventListener('click', async () => {
                    const parentId = parentIdInput ? document.getElementById(parentIdInput).value : null;
                    if (parentIdInput && !parentId) { alert("Pilih terlebih dahulu!"); return; }
                    const name = prompt(promptMsg);
                    if (!name) return;
                    try {
                        await action(name, parentId);
                        alert("Berhasil ditambahkan!");
                        alert("Mohon refresh halaman atau pilih ulang untuk melihat data baru.");
                    } catch(e) { alert(e.message); }
                });
            }
        };

        setupAddBtn('btn-add-kota', endpoints.addCity, "Nama Kota:");
        setupAddBtn('btn-add-kecamatan', endpoints.addDistrict, "Nama Kecamatan:", 'kota_id');
        setupAddBtn('btn-add-desa', endpoints.addVillage, "Nama Desa:", 'kecamatan_id');

        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                nama_situs: document.getElementById('nama_situs').value,
                jenis_situs: document.getElementById('jenis_situs').value,
                periode_sejarah: document.getElementById('periode_sejarah').value,
                jalan_dusun: document.getElementById('jalan_dusun').value,
                latitude: parseFloat(document.getElementById('latitude').value),
                longitude: parseFloat(document.getElementById('longitude').value),
                desa_kelurahan_id: parseInt(document.getElementById('desa_kelurahan_id').value),
                kerajaan_id: document.getElementById('kerajaan_id').value ? parseInt(document.getElementById('kerajaan_id').value) : null
            };
            try { await endpoints.addSite(payload); alert("Laporan terkirim!"); window.location.href = 'index.html'; }
            catch (err) { alert("Gagal: " + err.message); }
        });
    }

    const artefactForm = document.getElementById('form-add-artefact');
    if (artefactForm) {
        if (!isLoggedIn()) { alert("Silakan login."); window.location.href = 'login.html'; return; }
        
        endpoints.getVerifiedSites().then(s => populateSelect('situs_id', s, 'situs_id', 'nama_situs'));

        artefactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                situs_id: parseInt(document.getElementById('situs_id').value),
                nama_objek: document.getElementById('nama_objek').value,
                jenis_objek: document.getElementById('jenis_objek').value,
                bahan: document.getElementById('bahan').value,
                panjang: parseFloat(document.getElementById('panjang').value),
                lebar: parseFloat(document.getElementById('lebar').value),
                tinggi: parseFloat(document.getElementById('tinggi').value),
                aksara: document.getElementById('aksara') ? document.getElementById('aksara').value : "",
                bahasa: document.getElementById('bahasa') ? document.getElementById('bahasa').value : "",
                teks_transliterasi: document.getElementById('teks_transliterasi') ? document.getElementById('teks_transliterasi').value : ""
            };
            try { await endpoints.addArtefact(payload); alert("Artefak dilaporkan!"); window.location.href = 'index.html'; }
            catch (err) { alert(err.message); }
        });
    }

    const editArtForm = document.getElementById('form-edit-artefact');
    if(editArtForm) {
        // Populates the dropdown with sites so the user can change the location if needed
        endpoints.getVerifiedSites().then(s => populateSelect('situs_id', s, 'situs_id', 'nama_situs'));
    }

    const handleAdd = (formId, apiCall, redirect) => {
        const form = document.getElementById(formId);
        if(form) {
            if (!isLoggedIn()) window.location.href = 'login.html';
            
            if(formId === 'form-tokoh') {
                endpoints.getKingdoms().then(d => populateSelect('kerajaan_id', d, 'kerajaan_id', 'nama_kerajaan'));
            }

            form.addEventListener('submit', async(e) => {
                e.preventDefault();
                
                const btn = form.querySelector('button[type="submit"]');
                if(btn) {
                    btn.disabled = true;
                    btn.innerText = "Menyimpan...";
                }

                const data = {};
                Array.from(form.elements).forEach(el => {
                    if(el.id) data[el.id] = (el.type === 'number' && el.value) ? parseInt(el.value) : el.value;
                });
                if(data.kerajaan_id === "") data.kerajaan_id = null;
                
                try { 
                    await apiCall(data); 
                    alert("Sukses!"); 
                    window.location.href = redirect; 
                } catch(err) { 
                    alert(err.message);
                    if(btn) {
                        btn.disabled = false;
                        btn.innerText = "Simpan";
                    }
                }
            });
        }
    };

    handleAdd('form-tokoh', endpoints.addTokoh, 'tokoh.html');
    handleAdd('form-arkeolog', endpoints.addArkeolog, 'arkeolog.html');
    handleAdd('form-add-kingdom', endpoints.addKingdom, 'kerajaan.html');

    const handleEdit = async (formId, getApi, updateApi, redirect, idParamName = 'id') => {
        const form = document.getElementById(formId);
        if(form) {
            if (!isLoggedIn()) window.location.href = 'login.html';
            const id = new URLSearchParams(window.location.search).get('id');
            if(!id) { alert("ID Missing"); window.location.href=redirect; return; }

            try {
                if(formId === 'form-edit-tokoh' || formId === 'form-edit-situs') {
                    const k = await endpoints.getKingdoms();
                    populateSelect('kerajaan_id', k, 'kerajaan_id', 'nama_kerajaan');
                }

                const data = await getApi(id);
                Object.keys(data).forEach(key => {
                    const el = document.getElementById(key);
                    if(el) el.value = data[key];
                });

            } catch(e) { alert("Gagal load: " + e.message); }

            form.addEventListener('submit', async(e) => {
                e.preventDefault();
                const data = {};
                Array.from(form.elements).forEach(el => {
                    if(el.id) data[el.id] = (el.type === 'number' && el.value) ? parseFloat(el.value) : el.value;
                });
                try { await updateApi(id, data); alert("Update Sukses!"); window.location.href=redirect; }
                catch(err) { alert(err.message); }
            });
        }
    };

    handleEdit('form-edit-tokoh', endpoints.getTokohById, endpoints.updateTokoh, 'tokoh.html');
    handleEdit('form-edit-arkeolog', endpoints.getArkeologById, endpoints.updateArkeolog, 'arkeolog.html');
    handleEdit('form-edit-kingdom', endpoints.getKingdomById, endpoints.updateKingdom, 'kerajaan.html');
    handleEdit('form-edit-situs', endpoints.getSiteById, endpoints.updateSite, 'index.html');
    handleEdit('form-edit-artefact', endpoints.getArtefactById, endpoints.updateArtefact, 'index.html');

    const linkPenelitian = document.getElementById('form-link-penelitian');
    if(linkPenelitian) {
        Promise.all([endpoints.getArkeolog(), endpoints.getVerifiedSites()]).then(([a, s]) => {
            populateSelect('arkeolog_id', a, 'arkeolog_id', 'nama_lengkap');
            populateSelect('situs_id', s, 'situs_id', 'nama_situs');
        });
        linkPenelitian.addEventListener('submit', async(e)=>{
            e.preventDefault();
            try {
                await endpoints.addPenelitian(document.getElementById('arkeolog_id').value, document.getElementById('situs_id').value);
                alert("Sukses!"); window.location.href='arkeolog.html';
            } catch(err){alert(err.message);}
        });
    }

    const linkAtribusi = document.getElementById('form-link-atribusi');
    if(linkAtribusi) {
        endpoints.getVerifiedSites().then(s => populateSelect('filter_situs_id', s, 'situs_id', 'nama_situs'));
        endpoints.getTokoh().then(t => populateSelect('tokoh_id', t, 'tokoh_id', 'nama_tokoh'));
        
        document.getElementById('filter_situs_id').addEventListener('change', async(e)=>{
            const o = await endpoints.getSiteArtefacts(e.target.value);
            populateSelect('objek_id', o, 'objek_id', 'nama_objek');
            document.getElementById('objek_id').disabled=false;
        });

        linkAtribusi.addEventListener('submit', async(e)=>{
            e.preventDefault();
            try {
                await endpoints.addAtribusi(document.getElementById('objek_id').value, document.getElementById('tokoh_id').value);
                alert("Sukses!"); window.location.href='tokoh.html';
            } catch(err){alert(err.message);}
        });
    }

    const loginForm = document.getElementById('form-login');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const res = await endpoints.login({
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                });
                if (res && res.token) { saveToken(res.token); window.location.href = 'index.html'; }
            } catch (err) { alert("Gagal: " + err.message); }
        });
    }

    const regForm = document.getElementById('form-register');
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                await endpoints.register({
                    nama_pengguna: document.getElementById('nama_pengguna').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                });
                alert("Berhasil! Silakan login."); window.location.href = 'login.html';
            } catch (err) { alert(err.message); }
        });
    }

    const kotaContainer = document.getElementById('kota');
    if (kotaContainer) {
        if (!isLoggedIn()) { window.location.href = 'login.html'; return; }

        let selKotaId = null;
        let selKecId = null;

        const item = (id, name, type, pid) => `
            <div class="list-item" id="${type}-${id}" onclick="window.sel('${type}',${id},'${name}',${pid})">
                <span>${name}</span>
                <div>
                    <button class="btn-xs" style="background:#f39c12; color:white;" onclick="event.stopPropagation();window.ed('${type}',${id},'${name}',${pid})">Edit</button>
                    <button class="btn-xs" style="background:#c0392b; color:white;" onclick="event.stopPropagation();window.delLoc('${type}',${id})">Hapus</button>
                </div>
            </div>
        `;

        const loadLoc = async () => {
            try {
                const d = await endpoints.getCities();
                kotaContainer.innerHTML = d.map(x => item(x.kota_kabupaten_id, x.nama_kota_kabupaten, 'kota')).join('');
            } catch(e) { kotaContainer.innerHTML = 'Error.'; }
        };

        window.sel = async(type, id, name, pid) => {
            document.querySelectorAll('.list-item').forEach(el => el.classList.remove('selected'));
            const el = document.getElementById(`${type}-${id}`);
            if(el) el.classList.add('selected');

            if(type === 'kota') {
                selKotaId = id; 
                selKecId = null; 
                document.getElementById('kec').innerHTML = 'Memuat...';
                document.getElementById('desa').innerHTML = '<i>Pilih Kecamatan...</i>';
                
                const d = await endpoints.getDistricts(id);
                document.getElementById('kec').innerHTML = d.length ? d.map(x => item(x.kecamatan_id, x.nama_kecamatan, 'kec', id)).join('') : '<i>(Kosong)</i>';
            } 
            else if(type === 'kec') {
                selKecId = id;
                document.getElementById('desa').innerHTML = 'Memuat...';
                
                const d = await endpoints.getVillages(id);
                document.getElementById('desa').innerHTML = d.length ? d.map(x => item(x.desa_kelurahan_id, x.nama_desa_kelurahan, 'desa', id)).join('') : '<i>(Kosong)</i>';
            }
        };

        document.getElementById('btn-add-kota-m').addEventListener('click', async () => {
            const n = prompt("Nama Kota Baru:");
            if(n) {
                try { await endpoints.addCity(n); loadLoc(); } 
                catch(e) { alert(e.message); }
            }
        });

        document.getElementById('btn-add-kec-m').addEventListener('click', async () => {
            if(!selKotaId) { alert("Pilih KOTA terlebih dahulu!"); return; }
            const n = prompt("Nama Kecamatan Baru:");
            if(n) {
                try { await endpoints.addDistrict(n, selKotaId); window.sel('kota', selKotaId); } 
                catch(e) { alert(e.message); }
            }
        });

        document.getElementById('btn-add-desa-m').addEventListener('click', async () => {
            if(!selKecId) { alert("Pilih KECAMATAN terlebih dahulu!"); return; }
            const n = prompt("Nama Desa Baru:");
            if(n) {
                try { await endpoints.addVillage(n, selKecId); window.sel('kec', selKecId); } 
                catch(e) { alert(e.message); }
            }
        });

        window.ed = async(t, id, old, pid) => {
            const n = prompt("Nama baru:", old); if(!n) return;
            try {
                if(t==='kota') await endpoints.updateCity(id, n);
                if(t==='kec') await endpoints.updateDistrict(id, n, pid);
                if(t==='desa') await endpoints.updateVillage(id, n, pid);
                alert("Sukses!");
                if(t==='kota') loadLoc(); else if(t==='kec') window.sel('kota', pid); else window.sel('kec', pid);
            } catch(e){alert(e.message);}
        };

        window.delLoc = async(t, id) => {
            if(!confirm("Hapus?")) return;
            try {
                if(t==='kota') await endpoints.deleteCity(id);
                if(t==='kec') await endpoints.deleteDistrict(id);
                if(t==='desa') await endpoints.deleteVillage(id);
                alert("Terhapus!");
                if(t==='kota') { loadLoc(); document.getElementById('kec').innerHTML='...'; document.getElementById('desa').innerHTML='...'; }
                else if(t==='kec') { window.sel('kota', selKotaId); document.getElementById('desa').innerHTML='...'; }
                else window.sel('kec', selKecId);
            } catch(e){alert(e.message);}
        };

        loadLoc();
    }

    const gelarHeader = document.getElementById('hdr');
    if (gelarHeader) {
        const id = new URLSearchParams(window.location.search).get('id');
        
        const loadGelar = async () => {
            try {
                const t = await endpoints.getTokohById(id);
                gelarHeader.innerText = `Gelar: ${t.nama_tokoh}`;
                const g = await endpoints.getTitles(id);
                document.getElementById('list').innerHTML = g.map(x => `
                    <div style="padding:10px; border-bottom:1px solid #eee; display:flex; justify-content:space-between;">
                        ${x.gelar_tokoh}
                        <button onclick="window.delGelar('${x.gelar_tokoh}')" style="background:red; color:white; padding:2px 5px;">🗑️</button>
                    </div>`).join('');
            } catch(e) { console.log(e); }
        };

        document.getElementById('form').addEventListener('submit', async(e)=>{
            e.preventDefault();
            try {
                await endpoints.addTitle(id, document.getElementById('glr').value);
                document.getElementById('glr').value=''; 
                loadGelar();
            } catch(e) { alert(e.message); }
        });

        window.delGelar = async(glr) => { 
            if(confirm("Hapus?")) { 
                await endpoints.deleteTitle(id, glr); 
                loadGelar(); 
            }
        };
        
        loadGelar();
    }
});

window.unlinkPenelitian = async (arkeologId, situsId) => {
    if(!confirm("Hapus arkeolog ini dari situs?")) return;
    try {
        await endpoints.deletePenelitian(arkeologId, situsId);
        alert("Terhapus!");
        window.loadSiteDetails(situsId);
    } catch(e) { alert(e.message); }
};

window.unlinkAtribusi = async (objekId, tokohId, situsId) => {
    if(!confirm("Hapus atribusi tokoh ini?")) return;
    try {
        await endpoints.deleteAtribusi(objekId, tokohId);
        alert("Terhapus!");
        window.loadSiteDetails(situsId);
    } catch(e) { alert(e.message); }
};