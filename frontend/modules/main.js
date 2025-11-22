import { endpoints } from './api.js';
import { renderSiteCards, populateSelect, renderArtefacts } from './ui.js';
import { initMap, addMarkers, flyTo } from './map.js';
import { isLoggedIn, logout, saveToken } from './auth.js';

window.viewOnMap = (lat, long) => flyTo(lat, long);

window.toggleArtefacts = async (situsId) => {
    const container = document.getElementById(`artefacts-${situsId}`);
    if (container.style.display === 'none') {
        container.style.display = 'block';
        try {
            const data = await endpoints.getSiteArtefacts(situsId);
            renderArtefacts(data, `artefacts-${situsId}`);
        } catch (e) {
            container.innerHTML = '<small>Error memuat data</small>';
        }
    } else {
        container.style.display = 'none';
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    
    const navAuth = document.getElementById('nav-auth');
    if (navAuth) {
        if (isLoggedIn()) {
            navAuth.innerHTML = '<a href="#" id="btn-logout" style="color:#e74c3c;">Logout</a>';
            document.getElementById('btn-logout').addEventListener('click', logout);
        } else {
            navAuth.innerHTML = '<a href="login.html">Login</a>';
        }
    }

    if (document.getElementById('situs-list')) {
        initMap('mapid');
        try {
            const sites = await endpoints.getVerifiedSites();
            renderSiteCards(sites, 'situs-list');
            addMarkers(sites);
        } catch (err) {
            console.log("Tidak bisa memuat situs:", err);
        }
    }

    const addForm = document.getElementById('form-add-situs');
    if (addForm) {
        if (!isLoggedIn()) {
            alert("Mohon login dahulu.");
            window.location.href = 'login.html';
            return;
        }

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

        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const payload = {
                nama_situs: document.getElementById('nama_situs').value,
                jenis_situs: document.getElementById('jenis_situs').value,
                periode_sejarah: document.getElementById('periode_sejarah').value || null,
                jalan_dusun: document.getElementById('jalan_dusun').value,
                latitude: parseFloat(document.getElementById('latitude').value),
                longitude: parseFloat(document.getElementById('longitude').value),
                desa_kelurahan_id: parseInt(document.getElementById('desa_kelurahan_id').value),
                kerajaan_id: document.getElementById('kerajaan_id').value ? parseInt(document.getElementById('kerajaan_id').value) : null
            };

            try {
                await endpoints.addSite(payload);
                alert("Penambahan berhasil disubmit!");
                window.location.href = 'index.html';
            } catch (err) {
                alert("Gagal: " + err.message);
            }
        });
    }

    const loginForm = document.getElementById('form-login');
    if (loginForm) {

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const errorBox = document.getElementById('login-error');

            errorBox.style.display = 'none';
            errorBox.textContent = '';

            try {
                const res = await endpoints.login({
                    email: emailInput.value,
                    password: passwordInput.value
                });
                
                if (res && res.token) {
                    saveToken(res.token);
                    window.location.href = 'add.html'; 
                }
            } catch (err) {
                errorBox.style.display = 'block';
                errorBox.textContent = "email atau password salah.";
                
                passwordInput.value = '';
                passwordInput.focus();
            }
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
                alert("Berhasil mendaftar! Mohon login.");
                window.location.href = 'login.html';
            } catch (err) {
                alert(err.message);
            }
        });
    }

    const artefactForm = document.getElementById('form-add-artefact');
    if (artefactForm) {
        if (!isLoggedIn()) {
            alert("Mohon login dahulu.");
            window.location.href = 'login.html';
            return;
        }

        try {
            const sites = await endpoints.getVerifiedSites();
            populateSelect('situs_id', sites, 'situs_id', 'nama_situs');
        } catch (err) {
            console.error("Gagal memuat situs", err);
        }

        artefactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const payload = {
                nama_objek: document.getElementById('nama_objek').value,
                jenis_objek: document.getElementById('jenis_objek').value,
                bahan: document.getElementById('bahan').value,
                
                panjang: parseFloat(document.getElementById('panjang').value),
                lebar: parseFloat(document.getElementById('lebar').value),
                tinggi: parseFloat(document.getElementById('tinggi').value),
                situs_id: parseInt(document.getElementById('situs_id').value),
                
                teks_transliterasi: "",
                aksara: "",
                bahasa: ""
            };

            try {
                await endpoints.addArtefact(payload);
                alert("Objek berhasil ditambahkan! Mohon untuk menunggu verifikasi.");
                window.location.href = 'index.html';
            } catch (err) {
                alert("Gagal: " + err.message);
            }
        });
    }
});