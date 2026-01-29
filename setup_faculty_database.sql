-- =============================================================================
-- FACULTY MANAGEMENT - DATABASE SETUP SQL
-- Copy and paste this entire file into phpMyAdmin or MySQL terminal
-- =============================================================================

-- Create the faculty_users table
CREATE TABLE IF NOT EXISTS `faculty_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier for faculty member',
  `firstname` varchar(100) NOT NULL COMMENT 'Faculty member first name',
  `lastname` varchar(100) NOT NULL COMMENT 'Faculty member last name',
  `position` varchar(100) NOT NULL COMMENT 'Faculty position/title (e.g. Professor, Associate Professor)',
  `advisory` varchar(100) DEFAULT NULL COMMENT 'Department or advisory assignment (optional)',
  `image` longtext COMMENT 'Faculty photo stored as Base64 encoded image or URL',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
  PRIMARY KEY (`id`),
  KEY `idx_firstname` (`firstname`),
  KEY `idx_lastname` (`lastname`),
  KEY `idx_position` (`position`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Faculty members database table for CCIS Connect';

-- =============================================================================
-- Sample Data (Optional - for testing)
-- Uncomment to add sample faculty members
-- =============================================================================

-- INSERT INTO `faculty_users` (`firstname`, `lastname`, `position`, `advisory`) VALUES
-- ('John', 'Doe', 'Professor', 'College of Computing and Information Sciences'),
-- ('Jane', 'Smith', 'Associate Professor', 'Computer Science Department'),
-- ('Robert', 'Johnson', 'Assistant Professor', 'Information Technology Department'),
-- ('Maria', 'Garcia', 'Lecturer', 'Web Development Program');

-- =============================================================================
-- Verification Queries (Run these to check your setup)
-- =============================================================================

-- Check if table exists
-- SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'YOUR_DATABASE_NAME' AND TABLE_NAME = 'faculty_users';

-- View table structure
-- DESCRIBE faculty_users;

-- Count faculty members
-- SELECT COUNT(*) as total_faculty FROM faculty_users;

-- Get all faculty (ordered by name)
-- SELECT id, firstname, lastname, position, advisory, created_at FROM faculty_users ORDER BY firstname ASC, lastname ASC;

-- Search faculty by name
-- SELECT * FROM faculty_users WHERE firstname LIKE '%John%' OR lastname LIKE '%Doe%';

-- Delete all records (USE WITH CAUTION)
-- TRUNCATE TABLE faculty_users;

-- Drop table completely (USE WITH EXTREME CAUTION)
-- DROP TABLE IF EXISTS faculty_users;

-- =============================================================================
-- Database Indexes Explanation
-- =============================================================================
-- idx_firstname: Speeds up searches by first name
-- idx_lastname: Speeds up searches by last name
-- idx_position: Speeds up searches by position

-- =============================================================================
-- Notes
-- =============================================================================
-- 1. All table and column names are lowercase with underscores
-- 2. UTF-8 encoding is used for international character support
-- 3. Timestamps are auto-generated and in UTC
-- 4. Images are stored as Base64 data in the 'image' column
-- 5. The 'advisory' field is optional (can be NULL)
-- 6. Records cannot be created without firstname, lastname, and position

-- =============================================================================
-- End of Database Setup File
-- =============================================================================
