<nav class="bg-white/90 backdrop-blur-md shadow-md h-16 fixed w-full top-0 z-[1000]">
    <div class="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
        <!-- Logo -->
        <a href="index.php?page=home" class="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <span class="text-3xl">🌊</span> PureWaterMap
        </a>

        <!-- Menu -->
        <div class="flex items-center space-x-4">
            <a href="index.php?page=home" class="hidden md:block text-gray-700 hover:text-blue-600 font-medium <?php echo ($page=='home')?'text-blue-600':''; ?>">
                สถานการณ์น้ำ
            </a>
            
            <?php if (isset($_SESSION['user_id'])): ?>
                <div class="flex items-center gap-3 pl-4 border-l border-gray-300">
                    <span class="text-gray-600 text-sm hidden sm:inline">
                        คุณ <b><?php echo htmlspecialchars($_SESSION['username']); ?></b>
                    </span>
                    <a href="index.php?page=logout" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full text-sm transition shadow-sm">
                        Logout
                    </a>
                </div>
            <?php else: ?>
                <!-- ซ่อนปุ่ม Login ถ้าเราอยู่ในหน้า Login แล้ว -->
                <?php if ($page !== 'login'): ?>
                <a href="index.php?page=login" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm transition shadow-lg transform hover:scale-105">
                    เข้าสู่ระบบ
                </a>
                <?php endif; ?>
            <?php endif; ?>
        </div>
    </div>
</nav>