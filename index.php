<?php
require_once 'db.php'; // เชื่อมต่อฐานข้อมูลและ Start Session

// ตรวจสอบการ Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Water Flow Map</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    
    <!-- Custom CSS (แยกไฟล์แล้ว) -->
    <link rel="stylesheet" href="index.css">
</head>
<body class="bg-gray-100 overflow-hidden">

    <!-- Navbar -->
    <nav class="bg-white/90 backdrop-blur-md shadow-md h-16 fixed w-full top-0 z-[1000]">
        <div class="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
            <!-- Logo -->
            <a href="index.php" class="text-2xl font-bold text-blue-600 flex items-center gap-2">
                <span class="text-3xl">🌊</span> PureWaterMap
            </a>

            <!-- Menu -->
            <div class="flex items-center space-x-4">
                <a href="index.php" class="hidden md:block text-gray-700 hover:text-blue-600 font-medium">สถานการณ์น้ำ</a>
                
                <?php if (isset($_SESSION['user_id'])): ?>
                    <div class="flex items-center gap-3 pl-4 border-l border-gray-300">
                        <span class="text-gray-600 text-sm hidden sm:inline">
                            คุณ <b><?php echo htmlspecialchars($_SESSION['username']); ?></b>
                        </span>
                        <a href="?logout=1" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full text-sm transition shadow-sm">
                            Logout
                        </a>
                    </div>
                <?php else: ?>
                    <a href="login.php" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm transition shadow-lg transform hover:scale-105">
                        เข้าสู่ระบบ
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </nav>

    <!-- Map Container -->
    <div class="pt-16 w-full h-full relative">
        <div id="map"></div>
        
    </div>

    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    
    <!-- Custom JS (แยกไฟล์แล้ว) -->
    <script src="map.js"></script>
    
</body>
</html>