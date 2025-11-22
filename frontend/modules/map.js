let map;

export function initMap(elementId = 'mapid') {
    if (!document.getElementById(elementId)) return;

    map = L.map(elementId).setView([-7.7956, 110.3695], 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

export function addMarkers(sites) {
    if (!map || !sites) return;
    
    sites.forEach(s => {
        L.marker([s.latitude, s.longitude])
         .addTo(map)
         .bindPopup(`<b>${s.nama_situs}</b><br>${s.jenis_situs}`);
    });
}

export function flyTo(lat, long) {
    if (map) {
        map.flyTo([lat, long], 15);
        document.getElementById('mapid').scrollIntoView({ behavior: 'smooth' });
    }
}