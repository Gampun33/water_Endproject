<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "water_pure_db";

// สร้างการเชื่อมต่อ
$conn = new mysqli($servername, $username, $password, $dbname);

// ตรวจสอบการเชื่อมต่อ
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// เริ่ม Session ทุกครั้งที่มีการเรียกใช้ไฟล์นี้
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>