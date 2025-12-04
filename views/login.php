<div class="bg-white p-8 rounded-lg shadow-lg w-96 border border-blue-100 animate-fade-in-up">
    <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">💧 Water Login</h2>
    
    <?php if(!empty($error)): ?>
        <div class="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center border border-red-200">
            <?php echo $error; ?>
        </div>
    <?php endif; ?>

    <form method="POST" action="index.php?page=login">
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input type="text" name="username" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 transition-colors" required placeholder="Enter username">
        </div>
        <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input type="password" name="password" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 transition-colors" required placeholder="Enter password">
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition transform active:scale-95 shadow-md">
            เข้าสู่ระบบ
        </button>
    </form>
    
    <div class="mt-4 text-center">
        <a href="index.php?page=home" class="text-sm text-gray-500 hover:text-blue-600 underline decoration-dotted">
            กลับไปหน้าแผนที่
        </a>
    </div>
</div>