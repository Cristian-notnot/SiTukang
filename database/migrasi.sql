-- 1. Tambah kolom status ke tabel tukang (jika belum ada)
SET @exist_status := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tukang' AND COLUMN_NAME = 'status');
SET @sql_status := IF(@exist_status = 0,
    'ALTER TABLE tukang ADD COLUMN `status` ENUM(''pending'',''approved'',''rejected'') DEFAULT ''pending'' AFTER `foto`',
    'SELECT 1');
PREPARE stmt FROM @sql_status;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Update tukang yang sudah ada (user_id 1-5) jadi approved
UPDATE tukang SET status = 'approved' WHERE user_id IN (1,2,3,4,5);

-- 3. Tambah kolom status dan report_reason ke tabel reviews
SET @exist_review_status := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'reviews' AND COLUMN_NAME = 'status');
SET @sql_review_status := IF(@exist_review_status = 0,
    'ALTER TABLE reviews ADD COLUMN `status` ENUM(''pending'',''approved'',''rejected'') DEFAULT ''pending'' AFTER `komentar`',
    'SELECT 1');
PREPARE stmt FROM @sql_review_status;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist_report := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'reviews' AND COLUMN_NAME = 'report_reason');
SET @sql_report := IF(@exist_report = 0,
    'ALTER TABLE reviews ADD COLUMN `report_reason` VARCHAR(255) DEFAULT NULL AFTER `status`',
    'SELECT 1');
PREPARE stmt FROM @sql_report;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Set existing reviews to approved
UPDATE reviews SET status = 'approved' WHERE status IS NULL;

-- 4. Buat tabel pengaturan jika belum ada
CREATE TABLE IF NOT EXISTS `pengaturan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_platform` varchar(100) DEFAULT 'SiTukang',
  `email_admin` varchar(100) DEFAULT NULL,
  `deskripsi` text,
  `logo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert default pengaturan if table was just created
INSERT IGNORE INTO pengaturan (id, nama_platform, email_admin, deskripsi)
VALUES (1, 'SiTukang', 'halo@situkang.id', 'Marketplace jasa tukang profesional dan terpercaya.');