/**
 * การตั้งค่า Configuration
 */
const CONFIG = {
    // URL ของรูปภาพพื้นหลัง
    IMAGE_URL: 'img/0123.png', 
    // ขอบเขตของรูปภาพ (คำนวณตาม Ratio ~1.69)
    IMAGE_BOUNDS: [[13.7600, 100.4660], [13.7200, 100.5340]],
    // จุดกึ่งกลาง (อาจไม่จำเป็นต้องใช้ถ้าเรา FitBounds ตลอด)
    MAP_CENTER: [13.7400, 100.5000],
    ZOOM: 14,
    MIN_ZOOM: 12, // กำหนดซูมต่ำสุด (ไม่ให้ซูมออกจนเล็กเกินไป)
    MAX_ZOOM: 18  // กำหนดซูมสูงสุด
};

/**
 * 1. ฟังก์ชันเริ่มต้นแผนที่ (Initialize Map)
 */
function initMap() {
    const map = L.map('map', {
        center: CONFIG.MAP_CENTER,
        zoom: CONFIG.ZOOM,
        minZoom: CONFIG.MIN_ZOOM,
        maxZoom: CONFIG.MAX_ZOOM,
        crs: L.CRS.EPSG3857,
        
        // ✅ เปิดการควบคุมเพื่อให้ซูมและเลื่อนได้ภายในขอบเขต
        zoomControl: true,         // เปิดปุ่ม +/-
        scrollWheelZoom: true,     // เปิดการหมุนลูกกลิ้งเมาส์
        doubleClickZoom: true,     // เปิดการดับเบิ้ลคลิก
        touchZoom: true,           // เปิดการใช้นิ้วถ่างขยาย
        dragging: true,            // เปิดการลากแผนที่

        // ✅ แต่ยังคงล็อคขอบเขตให้อยู่แค่ในรูปภาพ (ห้ามเลื่อนออกนอกภาพ)
        maxBounds: CONFIG.IMAGE_BOUNDS, 
        maxBoundsViscosity: 1.0 // ค่าความหนืด 1.0 คือชนขอบแล้วหยุดทันที ไม่มียืดหยุ่น
    });

    // เพิ่ม Event Listener: เมื่อมีการปรับขนาดหน้าจอ ให้ปรับขอบเขตให้พอดี
    window.addEventListener('resize', () => {
        map.fitBounds(CONFIG.IMAGE_BOUNDS);
    });

    return map;
}

/**
 * 2. ฟังก์ชันเพิ่มรูปพื้นหลัง (Background Layer)
 */
function addBackgroundLayer(map) {
    const imageOverlay = L.imageOverlay(CONFIG.IMAGE_URL, CONFIG.IMAGE_BOUNDS, {
        opacity: 1.0,
        interactive: true
    }).addTo(map);

    // ปรับมุมกล้องให้พอดีกับรูปภาพตั้งแต่เริ่มต้น
    map.fitBounds(CONFIG.IMAGE_BOUNDS);
}

/**
 * 3. ฟังก์ชันเพิ่มจุดวัดน้ำ (Water Stations)
 */
function addWaterStations(map) {
    const waterStations = [
        { name: "ประตูระบายน้ำ A", lat: 13.7500, lng: 100.4900, level: "ปกติ", val: "1.2m", color: "green" },
        { name: "จุดวัดระดับ B", lat: 13.7350, lng: 100.5050, level: "วิกฤต", val: "2.8m", color: "red" },
        { name: "สถานีสูบน้ำ C", lat: 13.7450, lng: 100.5150, level: "เฝ้าระวัง", val: "1.9m", color: "orange" }
    ];

    waterStations.forEach(function(station) {
        // ใช้ circle (ขนาดเมตร) เพื่อให้สัดส่วนสมจริงกับแผนที่
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
 * 4. ฟังก์ชันคำนวณทิศทาง (Helper: Get Bearing)
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
 * 5. ฟังก์ชันสร้าง Animation ลูกศร (Moving Arrow)
 */
function createMovingArrow(map, start, end, duration = 2000) {
    const startLat = start[0], startLng = start[1];
    const endLat = end[0], endLng = end[1];

    // คำนวณมุม
    const angle = getBearing(startLat, startLng, endLat, endLng);

    // สร้างไอคอน (ใช้ HTML เพื่อให้ปรับ CSS transform ได้ง่าย)
    const arrowIcon = L.divIcon({
        className: 'arrow-icon',
        html: `<div class="moving-arrow-body" style="transform: rotate(${angle}deg);"></div>`, 
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    // สร้าง Marker
    const marker = L.marker([startLat, startLng], { icon: arrowIcon }).addTo(map);

    // เริ่ม Animation Loop
    let startTime = null;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = (timestamp - startTime) / duration;

        if (progress > 1) {
            startTime = timestamp;
            progress = 0;
        }

        // Linear Interpolation (คำนวณตำแหน่งปัจจุบัน)
        const currentLat = startLat + (endLat - startLat) * progress;
        const currentLng = startLng + (endLng - startLng) * progress;

        marker.setLatLng([currentLat, currentLng]);
        
        // --- ✅ Logic การปรับขนาดตาม Zoom ---
        // ดึงค่า Zoom ปัจจุบัน
        const currentZoom = map.getZoom();
        
        // คำนวณ Scale Factor: เทียบกับ Base Zoom ที่ตั้งไว้ใน CONFIG (14)
        // สูตร: 2 ^ (Zoom ปัจจุบัน - Zoom เริ่มต้น)
        // เช่น Zoom 14 -> scale 1 (เท่าเดิม), Zoom 15 -> scale 2 (ใหญ่ขึ้น 2 เท่า)
        const scale = Math.pow(2, currentZoom - CONFIG.ZOOM);

        // เข้าถึง Element ของไอคอนเพื่อปรับ CSS Transform
        const iconElement = marker.getElement();
        if (iconElement) {
            const body = iconElement.querySelector('.moving-arrow-body');
            if (body) {
                // คงค่า rotation เดิมไว้ และเพิ่ม scale เข้าไป
                body.style.transform = `rotate(${angle}deg) scale(${scale})`;
            }
        }
        // ------------------------------------

        // Fade In/Out Effect
        let opacity = 1;
        if (progress < 0.1) opacity = progress * 10;
        if (progress > 0.8) opacity = (1 - progress) * 5;
        marker.setOpacity(opacity);

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

/**
 * 6. ฟังก์ชันเริ่มระบบไหลของน้ำทั้งหมด (Main Flow Controller)
 */
function startWaterFlows(map) {
    // เส้นที่ 1: ไหลจากเหนือลงใต้
    createMovingArrow(map, [13.7580, 100.4950], [13.7480, 100.4950], 3000);

    // เส้นที่ 2: ไหลจากซ้ายไปขวา (เฉียงๆ)
    createMovingArrow(map, [13.7450, 100.4900], [13.7350, 100.5100], 4000);

    // เส้นที่ 3: ไหลเข้าหาจุดวิกฤต (แดง)
    createMovingArrow(map, [13.7400, 100.5000], [13.7350, 100.5050], 2500);

    // เส้นที่ 4: ไหลออกจากจุดเฝ้าระวัง (ส้ม)
    createMovingArrow(map, [13.7450, 100.5150], [13.7550, 100.5250], 3500);
}

// --- เริ่มต้นการทำงานเมื่อโหลดหน้าเว็บเสร็จ ---
document.addEventListener('DOMContentLoaded', () => {
    const map = initMap();
    addBackgroundLayer(map);
    addWaterStations(map);
    startWaterFlows(map);
});