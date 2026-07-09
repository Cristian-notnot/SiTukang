-- 1. Tambah kolom status ke tabel tukang (jika belum ada)
ALTER TABLE tukang
ADD COLUMN IF NOT EXISTS `status` ENUM('pending','approved','rejected') DEFAULT 'pending'
AFTER `foto`;

-- 2. Update tukang yang sudah ada (user_id 1-5) jadi approved
UPDATE tukang SET status = 'approved' WHERE user_id IN (1,2,3,4,5);