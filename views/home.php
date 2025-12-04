<!-- ครอบด้วย ID สำหรับ Capture หน้าจอ -->
<div id="map-capture-area" class="w-full h-full relative">
    
    <div id="map"></div>

    <!-- ปุ่ม Export PDF (มุมซ้ายบน ใต้ Navbar) -->
    <button id="export-btn" class="absolute top-4 left-4 z-[999] bg-white text-blue-600 font-bold py-2 px-4 rounded shadow-lg hover:bg-blue-50 transition flex items-center gap-2">
        📄 Download PDF
    </button>

    <!-- แถบตำนาน (Legend) -->
    <div class="absolute bottom-8 right-4 z-[999] bg-white p-4 rounded-lg shadow-xl border border-gray-200 text-sm">
        <h4 class="font-bold text-gray-700 mb-2">สัญลักษณ์</h4>
        <div class="flex items-center gap-2 mb-1"><span class="w-3 h-3 rounded-full bg-green-500"></span> ปกติ</div>
        <div class="flex items-center gap-2 mb-1"><span class="w-3 h-3 rounded-full bg-orange-500"></span> เฝ้าระวัง</div>
        <div class="flex items-center gap-2 mb-1"><span class="w-3 h-3 rounded-full bg-red-600"></span> วิกฤต</div>
        <div class="flex items-center gap-2"><span class="text-blue-600 font-bold">↑</span> ทิศทางน้ำไหล</div>
    </div>

</div>