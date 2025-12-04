<?php
require_once 'db.php';

// ถ้าล็อกอินอยู่แล้ว ให้เด้งไปหน้าแรกเลย
if (isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit();
}

$error = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $_POST['username'];
    $pass = md5($_POST['password']); // แปลงรหัสเป็น MD5 เพื่อเทียบกับใน DB

    // Query ตรวจสอบข้อมูล (ใช้ Prepared Statement เพื่อความปลอดภัยพื้นฐาน)
    $stmt = $conn->prepare("SELECT id, username FROM users WHERE username = ? AND password = ?");
    $stmt->bind_param("ss", $user, $pass);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        // สร้าง Session
        $_SESSION['user_id'] = $row['id'];
        $_SESSION['username'] = $row['username'];
        header("Location: index.php"); // ไปหน้าแรก
        exit();
    } else {
        $error = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>เข้าสู่ระบบ - Water Map</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-blue-50 h-screen flex items-center justify-center">

    <div class="bg-white p-8 rounded-lg shadow-lg w-96 border border-blue-100">
        <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">💧 Water Login</h2>
        
        <?php if($error): ?>
            <div class="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
                <?php echo $error; ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Username</label>
                <input type="text" name="username" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required>
            </div>
            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input type="password" name="password" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required>
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                เข้าสู่ระบบ
            </button>
        </form>
        <div class="mt-4 text-center">
            <a href="index.php" class="text-sm text-gray-500 hover:text-blue-600">กลับไปหน้าหลัก</a>
        </div>
    </div>

</body>
</html>