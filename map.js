/**
 * การตั้งค่า Configuration
 */
const CONFIG = {
    // URL ของรูปภาพพื้นหลัง
    IMAGE_URL: 'img/0123.png', 
    IMAGE_BOUNDS: [[13.7600, 100.4660], [13.7200, 100.5340]],
    MAP_CENTER: [13.7400, 100.5000],
    ZOOM: 14,
    MIN_ZOOM: 12,
    MAX_ZOOM: 18
};

/**
 * 1. ฟังก์ชันเริ่มต้นแผนที่
 */
function initMap() {
    const map = L.map('map', {
        center: CONFIG.MAP_CENTER,
        zoom: CONFIG.ZOOM,
        minZoom: CONFIG.MIN_ZOOM,
        maxZoom: CONFIG.MAX_ZOOM,
        crs: L.CRS.EPSG3857,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
        dragging: true,
        maxBounds: CONFIG.IMAGE_BOUNDS, 
        maxBoundsViscosity: 1.0
    });

    window.addEventListener('resize', () => {
        map.fitBounds(CONFIG.IMAGE_BOUNDS);
    });

    return map;
}

/**
 * 2. เพิ่มรูปพื้นหลัง
 */
function addBackgroundLayer(map) {
    L.imageOverlay(CONFIG.IMAGE_URL, CONFIG.IMAGE_BOUNDS, {
        opacity: 1.0,
        interactive: true
    }).addTo(map);

    map.fitBounds(CONFIG.IMAGE_BOUNDS);
}

/**
 * 3. เพิ่มจุดวัดน้ำ
 */
function addWaterStations(map) {
    const waterStations = [
        { name: "ประตูระบายน้ำ A", lat: 13.7500, lng: 100.4900, level: "ปกติ", val: "1.2m", color: "green" },
        { name: "จุดวัดระดับ B", lat: 13.7350, lng: 100.5050, level: "วิกฤต", val: "2.8m", color: "red" },
        { name: "สถานีสูบน้ำ C", lat: 13.7450, lng: 100.5150, level: "เฝ้าระวัง", val: "1.9m", color: "orange" }
    ];

    waterStations.forEach(function(station) {
        const circle = L.circle([station.lat, station.lng], {
            color: 'white',
            weight: 2,
            fillColor: station.color,
            fillOpacity: 0.9,
            radius: 120 
        }).addTo(map);

        circle.bindPopup(`
            <div class="text-center p-2 min-w-[150px]">
                <h3 class="font-bold text-gray-800 text-lg">${station.name}</h3>
                <div class="my-2 text-2xl font-bold" style="color:${station.color}">${station.val}</div>
                <span class="px-2 py-1 rounded text-white text-xs" style="background-color:${station.color}">
                    สถานะ: ${station.level}
                </span>
            </div>
        `, { className: 'custom-popup' });
    });
}

/**
 * 4. Helper: คำนวณทิศทาง
 */
function getBearing(startLat, startLng, destLat, destLng) {
    const toRad = (deg) => deg * (Math.PI / 180);
    const toDeg = (rad) => (rad * 180 / Math.PI + 360) % 360;

    const startLatRad = toRad(startLat);
    const startLngRad = toRad(startLng);
    const destLatRad = toRad(destLat);
    const destLngRad = toRad(destLng);

    const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
    const x = Math.cos(startLatRad) * Math.sin(destLatRad) -
            Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);
    
    return toDeg(Math.atan2(y, x));
}

/**
 * 5. Animation ลูกศร
 */
function createMovingArrow(map, start, end, duration = 2000) {
    const startLat = start[0], startLng = start[1];
    const endLat = end[0], endLng = end[1];

    const angle = getBearing(startLat, startLng, endLat, endLng);

    const arrowIcon = L.divIcon({
        className: 'arrow-icon',
        html: `<div class="moving-arrow-body" style="transform: rotate(${angle}deg);"></div>`, 
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    const marker = L.marker([startLat, startLng], { icon: arrowIcon }).addTo(map);

    let startTime = null;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = (timestamp - startTime) / duration;

        if (progress > 1) {
            startTime = timestamp;
            progress = 0;
        }

        const currentLat = startLat + (endLat - startLat) * progress;
        const currentLng = startLng + (endLng - startLng) * progress;

        marker.setLatLng([currentLat, currentLng]);
        
        // Logic ปรับขนาดตาม Zoom
        const currentZoom = map.getZoom();
        const scale = Math.pow(2, currentZoom - CONFIG.ZOOM);

        const iconElement = marker.getElement();
        if (iconElement) {
            const body = iconElement.querySelector('.moving-arrow-body');
            if (body) {
                body.style.transform = `rotate(${angle}deg) scale(${scale})`;
            }
        }

        let opacity = 1;
        if (progress < 0.1) opacity = progress * 10;
        if (progress > 0.8) opacity = (1 - progress) * 5;
        marker.setOpacity(opacity);

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function startWaterFlows(map) {
    createMovingArrow(map, [13.7580, 100.4950], [13.7480, 100.4950], 3000);
    createMovingArrow(map, [13.7450, 100.4900], [13.7350, 100.5100], 4000);
    createMovingArrow(map, [13.7400, 100.5000], [13.7350, 100.5050], 2500);
    createMovingArrow(map, [13.7450, 100.5150], [13.7550, 100.5250], 3500);
}

/**
 * 6. ✅ ฟังก์ชัน Export PDF (ปรับปรุงใหม่)
 */
async function captureAndDownloadPDF() {
    const { jsPDF } = window.jspdf;
    
    // 1. เลือกพื้นที่ที่จะ Capture
    const element = document.getElementById('map-capture-area');
    const btn = document.getElementById('export-btn');

    // เก็บข้อความเดิมไว้ก่อน
    const originalText = btn.innerHTML;

    try {
        // เปลี่ยนสถานะปุ่มให้รู้ว่ากำลังทำงาน
        btn.innerHTML = '⏳ กำลังสร้าง PDF...';
        btn.disabled = true; // ล็อคปุ่มกันกดย้ำ
        btn.classList.add('opacity-75', 'cursor-wait');

        // รอสักนิดให้ UI อัปเดตก่อนเริ่มหนัก
        await new Promise(resolve => setTimeout(resolve, 100));

        // 2. ซ่อนปุ่มกดก่อนถ่ายรูป (จะได้ไม่ติดใน PDF)
        // ใช้ visibility แทน display เพื่อไม่ให้ Layout ขยับ (เผื่อไว้)
        btn.style.opacity = '0'; 

        // 3. แปลง HTML เป็น Canvas
        const canvas = await html2canvas(element, {
            useCORS: true, 
            allowTaint: true,
            scale: 2 
        });

        // 4. สร้างไฟล์ PDF
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        
        let pdfWidth = pageWidth;
        let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        // ถ้าสูงเกินหน้า A4 ให้ปรับตามความสูงแทน
        if (pdfHeight > pageHeight) {
            pdfHeight = pageHeight;
            pdfWidth = (imgProps.width * pdfHeight) / imgProps.height;
        }

        const x = (pageWidth - pdfWidth) / 2;
        const y = (pageHeight - pdfHeight) / 2;

        // 5. ใส่รูปลง PDF และ Save
        pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);
        pdf.save('water-map-report.pdf');

    } catch (err) {
        console.error("PDF Export Error:", err);
        alert("เกิดข้อผิดพลาดในการสร้าง PDF");
    } finally {
        // 6. คืนค่าปุ่มกลับมาเหมือนเดิม
        btn.style.opacity = '1';
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-75', 'cursor-wait');
    }
}

// --- เริ่มต้นการทำงาน ---
document.addEventListener('DOMContentLoaded', () => {
    const map = initMap();
    addBackgroundLayer(map);
    addWaterStations(map);
    startWaterFlows(map);

    // ผูก Event ปุ่มกด PDF
    const exportBtn = document.getElementById('export-btn');
    if(exportBtn) {
        exportBtn.addEventListener('click', captureAndDownloadPDF);
    }
});