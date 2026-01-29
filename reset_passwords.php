<?php
// TEMPORARY PASSWORD RESET SCRIPT
// This script resets all user passwords to 'pass1234' for testing
// DELETE THIS FILE AFTER TESTING

define('BASEPATH', dirname(__FILE__) . '/');
require_once(BASEPATH . 'application/config/database.php');

// Create database connection
$db_config = $db['default'];
$conn = new mysqli(
    $db_config['hostname'],
    $db_config['username'],
    $db_config['password'],
    $db_config['database']
);

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

echo "<h2>🔐 Password Reset Tool</h2>";
echo "<p>This script resets all user passwords to <strong>pass1234</strong></p>";

// Hash the password
$hashed_password = password_hash('pass1234', PASSWORD_DEFAULT);

// Update all users
$sql = "UPDATE users SET password_hash = ? WHERE is_active = 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $hashed_password);

if ($stmt->execute()) {
    echo "<div style='background: #90EE90; padding: 10px; border-radius: 5px;'>";
    echo "✅ <strong>SUCCESS!</strong> All user passwords have been reset to <strong>pass1234</strong><br>";
    echo "Affected rows: " . $stmt->affected_rows . "<br><br>";
    echo "<h3>✅ You can now login with any of these accounts:</h3>";
    echo "<ul>";
    echo "<li><strong>boyet@bisu.edu.ph</strong> / pass1234 (Faculty)</li>";
    echo "<li><strong>hiny@bisu.edu.ph</strong> / pass1234 (Student)</li>";
    echo "<li><strong>faculty@bisu.edu.ph</strong> / pass1234 (Faculty)</li>";
    echo "<li><strong>lorbot@bisu.edu.ph</strong> / pass1234 (Student)</li>";
    echo "<li><strong>amdi@bisu.edu.ph</strong> / pass1234 (Faculty)</li>";
    echo "</ul>";
    echo "</div>";
} else {
    echo "<div style='background: #FFB6C6; padding: 10px; border-radius: 5px;'>";
    echo "❌ <strong>ERROR:</strong> " . $stmt->error;
    echo "</div>";
}

$stmt->close();
$conn->close();

echo "<br><br>";
echo "<div style='background: #FFE4B5; padding: 10px; border-radius: 5px; color: #333;'>";
echo "⚠️ <strong>IMPORTANT:</strong> Delete this file (reset_passwords.php) after testing!<br>";
echo "This is a security risk if left on the server.";
echo "</div>";
?>
