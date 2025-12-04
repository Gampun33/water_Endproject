<?php
// ใช้ __DIR__ เชื่อมต่อฐานข้อมูล เพื่อให้หาไฟล์เจอแน่นอน
require_once __DIR__ . '/db.php'; 

ob_start(); 

// --- 1. ส่วน Controller (Logic) ---

$page = isset($_GET['page']) ? $_GET['page'] : 'home';
$error = '';

// จัดการ Logout
if ($page === 'logout') {
    session_destroy();
    header("Location: index.php?page=home");
    exit();
}

// จัดการ Login
if ($page === 'login' && $_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $_POST['username'];
    $pass = md5($_POST['password']);

    if (isset($conn)) {
        $stmt = $conn->prepare("SELECT id, username FROM users WHERE username = ? AND password = ?");
        $stmt->bind_param("ss", $user, $pass);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['username'] = $row['username'];
            header("Location: index.php?page=home");
            exit();
        } else {
            $error = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
        }
    } else {
        $error = "ไม่สามารถเชื่อมต่อฐานข้อมูลได้";
    }
}

if ($page === 'login' && isset($_SESSION['user_id'])) {
    header("Location: index.php?page=home");
    exit();
}

// --- 2. ส่วน View (Configuration) ---

$bodyClass = 'bg-gray-100 font-sans';
if ($page === 'home') {
    $bodyClass .= ' overflow-hidden'; 
} elseif ($page === 'login') {
    $bodyClass = 'bg-blue-50 h-screen flex flex-col'; 
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PureWaterMap - <?php echo ucfirst($page); ?></title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="index.css">

    <!-- ✅ เพิ่ม Library สำหรับทำ PDF ตรงนี้ -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
</head>
<body class="<?php echo $bodyClass; ?>">

    <!-- Navbar -->
    <?php 
    $navbarPath = __DIR__ . '/views/navbar.php';
    if (file_exists($navbarPath)) {
        include $navbarPath; 
    } else {
        echo "<div class='bg-red-500 text-white p-2 text-center'>❌ หาไฟล์ Navbar ไม่เจอที่:<br> $navbarPath</div>";
    }
    ?>

    <!-- Main Content -->
    <div class="<?php echo ($page === 'home') ? 'pt-16 w-full h-full relative' : 'flex-grow flex items-center justify-center pt-16'; ?>">
        <?php
        switch ($page) {
            case 'login':
                $loginPath = __DIR__ . '/views/login.php';
                if (file_exists($loginPath)) include $loginPath;
                break;
            case 'home':
            default:
                $homePath = __DIR__ . '/views/home.php';
                if (file_exists($homePath)) include $homePath;
                break;
        }
        ?>
    </div>

    <!-- Scripts -->
    <?php if ($page === 'home'): ?>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script src="map.js"></script>
    <?php endif; ?>

</body>
</html>
<?php ob_end_flush(); ?>