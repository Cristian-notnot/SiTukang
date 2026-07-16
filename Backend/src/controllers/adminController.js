const db = require("../config/db");

// ─── DASHBOARD ────────────────────────────────────────────
exports.getDashboardAdmin = (req, res) => {
    const sql = `
        SELECT
            (SELECT COUNT(*) FROM users) AS total_user,
            (SELECT COUNT(*) FROM users WHERE role = 'tukang') AS total_tukang,
            (SELECT COUNT(*) FROM tukang WHERE status = 'approved') AS total_tukang_approved,
            (SELECT COUNT(*) FROM tukang WHERE status = 'pending') AS total_tukang_pending,
            (SELECT COUNT(*) FROM booking) AS total_booking,
            (SELECT COUNT(*) FROM booking WHERE status = 'pending') AS booking_pending,
            (SELECT COUNT(*) FROM booking WHERE status = 'diterima') AS booking_diterima,
            (SELECT COUNT(*) FROM booking WHERE status = 'dikerjakan') AS booking_dikerjakan,
            (SELECT COUNT(*) FROM booking WHERE status = 'selesai') AS booking_selesai,
            (SELECT COUNT(*) FROM booking WHERE status = 'ditolak') AS booking_ditolak,
            (SELECT COUNT(*) FROM booking WHERE status = 'dibatalkan') AS booking_dibatalkan,
            (SELECT COUNT(*) FROM reviews) AS total_review,
            (SELECT ROUND(AVG(rating), 1) FROM reviews) AS avg_rating,
            (SELECT COUNT(*) FROM booking WHERE DATE(tanggal_booking) = CURDATE()) AS booking_hari_ini,
            (SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()) AS user_hari_ini,
            (SELECT COUNT(*) FROM payment WHERE DATE(created_at) = CURDATE() AND status = 'completed') AS revenue_hari_ini,
            (SELECT COUNT(*) FROM tukang WHERE status = 'approved') AS tukang_aktif
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result[0] });
    });
};

exports.getDashboardStats = (req, res) => {
    const sql = `
        SELECT
            COUNT(DISTINCT CASE WHEN role = 'user' THEN id END) AS total_user,
            COUNT(DISTINCT CASE WHEN role = 'tukang' THEN id END) AS total_tukang,
            COUNT(DISTINCT CASE WHEN role = 'admin' THEN id END) AS total_admin,
            COUNT(DISTINCT CASE WHEN status = 'approved' THEN id END) AS tukang_aktif,
            COUNT(*) AS total_booking,
            COUNT(CASE WHEN status = 'pending' THEN 1 END) AS booking_pending,
            COUNT(CASE WHEN status = 'selesai' THEN 1 END) AS booking_selesai,
            COUNT(CASE WHEN status = 'diterima' THEN 1 END) AS booking_diterima,
            COUNT(CASE WHEN status = 'dikerjakan' THEN 1 END) AS booking_dikerjakan,
            COUNT(CASE WHEN status = 'ditolak' THEN 1 END) AS booking_ditolak,
            COUNT(CASE WHEN status = 'dibatalkan' THEN 1 END) AS booking_dibatalkan,
            COUNT(*) AS total_review,
            ROUND(AVG(rating), 1) AS avg_rating
        FROM (
            SELECT id, role FROM users
            UNION ALL
            SELECT id, status FROM tukang
            UNION ALL
            SELECT id, status FROM booking
            UNION ALL
            SELECT id, rating FROM reviews
        ) combined;
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result[0] });
    });
};

exports.getDashboardCharts = (req, res) => {
    const getMonthlyBooking = new Promise((resolve, reject) => {
        const sql = `
            SELECT DATE_FORMAT(tanggal_booking, '%Y-%m') AS bulan, COUNT(*) AS total, SUM(IF(status = 'selesai', 10, 0)) AS revenue
            FROM booking
            WHERE tanggal_booking >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY bulan ORDER BY bulan ASC
        `;
        db.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });

    const getTukangPerKategori = new Promise((resolve, reject) => {
        const sql = `
            SELECT kategori.nama_kategori, COUNT(*) AS total
            FROM tukang
            JOIN kategori ON kategori.id = tukang.kategori_id
            WHERE tukang.status = 'approved'
            GROUP BY kategori.nama_kategori
            ORDER BY total DESC LIMIT 10
        `;
        db.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });

    const getBookingStatus = new Promise((resolve, reject) => {
        const sql = `
            SELECT status, COUNT(*) AS total
            FROM booking
            GROUP BY status
        `;
        db.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });

    const getTopKategori = new Promise((resolve, reject) => {
        const sql = `
            SELECT kategori.nama_kategori, COUNT(booking.id) AS total
            FROM tukang
            JOIN kategori ON kategori.id = tukang.kategori_id
            JOIN booking ON booking.tukang_id = tukang.id
            WHERE tukang.status = 'approved'
            GROUP BY kategori.nama_kategori
            ORDER BY total DESC LIMIT 10
        `;
        db.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });

    Promise.all([getMonthlyBooking, getTukangPerKategori, getBookingStatus, getTopKategori])
        .then(([monthlyBooking, tukangPerKategori, bookingStatus, topKategori]) => {
            res.json({
                success: true,
                data: {
                    monthlyBooking,
                    tukangPerKategori,
                    bookingStatus,
                    topKategori
                }
            });
        })
        .catch(err => {
            res.status(500).json({ success: false, message: err.message });
        });
};

// ─── USERS ────────────────────────────────────────────────
exports.getAllUsers = (req, res) => {
    let sql = "SELECT id, nama, email, role, created_at FROM users";
    const { search, role, sort, order } = req.query;
    const conditions = [];
    const params = [];

    if (search) { conditions.push("(nama LIKE ? OR email LIKE ?)"); params.push(`%${search}%`, `%${search}%`); }
    if (role) { conditions.push("role = ?"); params.push(role); }
    if (conditions.length) sql += " WHERE " + conditions.join(" AND ");

    const sortBy = ['id','nama','email','role','created_at'].includes(sort) ? sort : 'created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    sql += ` ORDER BY ${sortBy} ${sortOrder}`;

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: result.length, data: result });
    });
};

exports.getUserById = (req, res) => {
    const sql = "SELECT id, nama, email, role, created_at FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!result.length) return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        res.json({ success: true, data: result[0] });
    });
};

exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { nama, email } = req.body;
    db.query("UPDATE users SET nama=?, email=? WHERE id=?", [nama, email, id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        res.json({ success: true, message: "User berhasil diperbarui" });
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        res.json({ success: true, message: "User berhasil dihapus" });
    });
};

exports.updateUserRole = (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!["user", "tukang", "admin"].includes(role)) {
        return res.status(400).json({ success: false, message: "Role tidak valid" });
    }
    db.query("UPDATE users SET role = ? WHERE id = ?", [role, id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        res.json({ success: true, message: "Role user berhasil diubah" });
    });
};

// ─── TUKANG ───────────────────────────────────────────────
exports.getPendingTukang = (req, res) => {
    const sql = `
        SELECT tukang.id, users.nama, users.email, kategori.nama_kategori,
               tukang.telepon, tukang.alamat, tukang.deskripsi, tukang.pengalaman, tukang.status, tukang.foto
        FROM tukang
        JOIN users ON users.id = tukang.user_id
        JOIN kategori ON kategori.id = tukang.kategori_id
        WHERE tukang.status = 'pending'
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: result.length, data: result });
    });
};

exports.getAllTukang = (req, res) => {
    let sql = `SELECT tukang.id, users.nama, users.email, kategori.nama_kategori,
               tukang.telepon, tukang.alamat, tukang.deskripsi, tukang.pengalaman, tukang.rating, tukang.status, tukang.foto
        FROM tukang
        JOIN users ON users.id = tukang.user_id
        JOIN kategori ON kategori.id = tukang.kategori_id`;
    const { search, kategori, status, sort, order } = req.query;
    const conditions = [];
    const params = [];

    if (search) { conditions.push("(users.nama LIKE ? OR kategori.nama_kategori LIKE ?)"); params.push(`%${search}%`, `%${search}%`); }
    if (kategori) { conditions.push("kategori.nama_kategori = ?"); params.push(kategori); }
    if (status) { conditions.push("tukang.status = ?"); params.push(status); }
    if (conditions.length) sql += " WHERE " + conditions.join(" AND ");

    const sortBy = ['nama','rating','pengalaman','status'].includes(sort) ? `tukang.${sort}` : 'users.nama';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
    sql += ` ORDER BY ${sortBy} ${sortOrder}`;

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: result.length, data: result });
    });
};

exports.getTukangById = (req, res) => {
    const sql = `SELECT tukang.*, users.nama, users.email, kategori.nama_kategori
        FROM tukang
        JOIN users ON users.id = tukang.user_id
        JOIN kategori ON kategori.id = tukang.kategori_id
        WHERE tukang.id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!result.length) return res.status(404).json({ success: false, message: "Tukang tidak ditemukan" });
        res.json({ success: true, data: result[0] });
    });
};

exports.updateTukang = (req, res) => {
    const { id } = req.params;
    const { telepon, alamat, deskripsi, pengalaman, kategori_id } = req.body;
    db.query("UPDATE tukang SET telepon=?, alamat=?, deskripsi=?, pengalaman=?, kategori_id=? WHERE id=?",
        [telepon, alamat, deskripsi, pengalaman, kategori_id, id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Tukang tidak ditemukan" });
        res.json({ success: true, message: "Tukang berhasil diperbarui" });
    });
};

exports.approveTukang = (req, res) => {
    const { id } = req.params;
    const sqlCari = "SELECT user_id FROM tukang WHERE id = ?";
    db.query(sqlCari, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.length === 0) return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
        const userId = result[0].user_id;
        db.query("UPDATE tukang SET status='approved' WHERE id=?", [id], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            db.query("UPDATE users SET role='tukang' WHERE id=?", [userId], (err) => {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, message: "Tukang berhasil disetujui" });
            });
        });
    });
};

exports.rejectTukang = (req, res) => {
    const { id } = req.params;
    const sqlCari = "SELECT user_id FROM tukang WHERE id = ?";
    db.query(sqlCari, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.length === 0) return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
        const userId = result[0].user_id;
        db.query("UPDATE tukang SET status='rejected' WHERE id=?", [id], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            db.query("UPDATE users SET role='user' WHERE id=? AND role='tukang'", [userId], (err) => {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, message: "Tukang ditolak" });
            });
        });
    });
};

exports.deleteTukang = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM tukang WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Tukang tidak ditemukan" });
        res.json({ success: true, message: "Tukang berhasil dihapus" });
    });
};

// ─── BOOKING ──────────────────────────────────────────────
exports.getAllBooking = (req, res) => {
    let sql = `SELECT booking.*, users.nama AS nama_user, tukang_usr.nama AS nama_tukang
        FROM booking
        LEFT JOIN users ON booking.user_id = users.id
        LEFT JOIN tukang ON booking.tukang_id = tukang.id
        LEFT JOIN users AS tukang_usr ON tukang.user_id = tukang_usr.id`;
    const { search, status, sort, order } = req.query;
    const conditions = [];
    const params = [];

    if (search) { conditions.push("(users.nama LIKE ? OR tukang_usr.nama LIKE ?)"); params.push(`%${search}%`, `%${search}%`); }
    if (status) { conditions.push("booking.status = ?"); params.push(status); }
    if (conditions.length) sql += " WHERE " + conditions.join(" AND ");

    const sortBy = ['created_at','tanggal_booking','status'].includes(sort) ? `booking.${sort}` : 'booking.created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    sql += ` ORDER BY ${sortBy} ${sortOrder}`;

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: result.length, data: result });
    });
};

exports.getBookingById = (req, res) => {
    const sql = `SELECT booking.*, users.nama AS nama_user, users.email AS email_user, tukang_usr.nama AS nama_tukang, kategori.nama_kategori
        FROM booking
        JOIN users ON booking.user_id = users.id
        JOIN tukang ON booking.tukang_id = tukang.id
        JOIN users AS tukang_usr ON tukang.user_id = tukang_usr.id
        JOIN kategori ON kategori.id = tukang.kategori_id
        WHERE booking.id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!result.length) return res.status(404).json({ success: false, message: "Booking tidak ditemukan" });
        res.json({ success: true, data: result[0] });
    });
};

exports.updateBookingStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const validStatus = ['pending', 'diterima', 'dikerjakan', 'selesai', 'ditolak', 'dibatalkan'];
    if (!validStatus.includes(status)) {
        return res.status(400).json({ success: false, message: "Status tidak valid" });
    }
    db.query("UPDATE booking SET status = ? WHERE id = ?", [status, id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Booking tidak ditemukan" });
        res.json({ success: true, message: "Status booking berhasil diubah" });
    });
};

exports.deleteBooking = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM booking WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Booking tidak ditemukan" });
        res.json({ success: true, message: "Booking berhasil dihapus" });
    });
};

exports.getBookingStats = (req, res) => {
    const sql = `
        SELECT
            COUNT(*) AS total,
            COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending,
            COUNT(CASE WHEN status = 'diterima' THEN 1 END) AS diterima,
            COUNT(CASE WHEN status = 'dikerjakan' THEN 1 END) AS dikerjakan,
            COUNT(CASE WHEN status = 'selesai' THEN 1 END) AS selesai,
            COUNT(CASE WHEN status = 'ditolak' THEN 1 END) AS ditolak,
            COUNT(CASE WHEN status = 'dibatalkan' THEN 1 END) AS dibatalkan,
            COUNT(CASE WHEN DATE(tanggal_booking) = CURDATE() THEN 1 END) AS hari_ini
        FROM booking
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result[0] });
    });
};

// ─── REVIEW ───────────────────────────────────────────────
exports.getAllReview = (req, res) => {
    let sql = `SELECT reviews.*, users.nama AS nama_user, tukang_usr.nama AS nama_tukang
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        JOIN tukang ON reviews.tukang_id = tukang.id
        JOIN users AS tukang_usr ON tukang.user_id = tukang_usr.id`;
    const { search, sort, order } = req.query;
    const conditions = [];
    const params = [];

    if (search) { conditions.push("(users.nama LIKE ? OR tukang_usr.nama LIKE ? OR reviews.komentar LIKE ?)"); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    if (conditions.length) sql += " WHERE " + conditions.join(" AND ");

    const sortBy = ['created_at','rating'].includes(sort) ? `reviews.${sort}` : 'reviews.created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    sql += ` ORDER BY ${sortBy} ${sortOrder}`;

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: result.length, data: result });
    });
};

exports.moderateReview = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.query("UPDATE reviews SET status = ? WHERE id = ?", [status, id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Review tidak ditemukan" });
        res.json({ success: true, message: "Review berhasil dimoderasi" });
    });
};

exports.deleteReview = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM reviews WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Review tidak ditemukan" });
        res.json({ success: true, message: "Review berhasil dihapus" });
    });
};

// ─── KATEGORI ─────────────────────────────────────────────
exports.getAllKategori = (req, res) => {
    db.query("SELECT * FROM kategori ORDER BY nama_kategori ASC", (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: result.length, data: result });
    });
};

exports.createKategori = (req, res) => {
    const { nama_kategori, komisi } = req.body;
    if (!nama_kategori) return res.status(400).json({ success: false, message: "Nama kategori wajib diisi" });
    const sql = komisi !== undefined
        ? "INSERT INTO kategori (nama_kategori, komisi) VALUES (?, ?)"
        : "INSERT INTO kategori (nama_kategori) VALUES (?)";
    const params = komisi !== undefined ? [nama_kategori, komisi] : [nama_kategori];
    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Kategori berhasil ditambahkan", id: result.insertId });
    });
};

exports.updateKategori = (req, res) => {
    const { id } = req.params;
    const { nama_kategori, komisi } = req.body;
    if (!nama_kategori) return res.status(400).json({ success: false, message: "Nama kategori wajib diisi" });
    const sql = komisi !== undefined
        ? "UPDATE kategori SET nama_kategori = ?, komisi = ? WHERE id = ?"
        : "UPDATE kategori SET nama_kategori = ? WHERE id = ?";
    const params = komisi !== undefined ? [nama_kategori, komisi, id] : [nama_kategori, id];
    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Kategori tidak ditemukan" });
        res.json({ success: true, message: "Kategori berhasil diubah" });
    });
};

exports.deleteKategori = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM kategori WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Kategori tidak ditemukan" });
        res.json({ success: true, message: "Kategori berhasil dihapus" });
    });
};

// ─── CHART ────────────────────────────────────────────────
exports.getMonthlyBooking = (req, res) => {
    const sql = `
        SELECT DATE_FORMAT(tanggal_booking, '%Y-%m') AS bulan, COUNT(*) AS total
        FROM booking
        WHERE tanggal_booking >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY bulan ORDER BY bulan ASC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result });
    });
};

exports.getTukangPerKategori = (req, res) => {
    const sql = `
        SELECT kategori.nama_kategori, COUNT(*) AS total
        FROM tukang
        JOIN kategori ON kategori.id = tukang.kategori_id
        WHERE tukang.status = 'approved'
        GROUP BY kategori.nama_kategori
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result });
    });
};

// ─── TICKET SUPPORT (simulasi - bisa dikembangkan) ────────
exports.getAllTicket = (req, res) => {
    const sql = `
        SELECT id, judul, deskripsi, status, priority, created_at, updated_at
        FROM ticket_support
        ORDER BY created_at DESC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: result.length, data: result });
    });
};

exports.updateTicketStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.query("UPDATE ticket_support SET status = ? WHERE id = ?", [status, id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Ticket tidak ditemukan" });
        res.json({ success: true, message: "Status ticket berhasil diubah" });
    });
};

// ─── PEMBAYARAN & KOMISI ─────────────────────────────────
exports.getAllPembayaran = (req, res) => {
    const sql = `
        SELECT p.*, u.nama AS nama_user
        FROM pembayaran p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: result.length, data: result });
    });
};

exports.updatePembayaranStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.query("UPDATE pembayaran SET status = ? WHERE id = ?", [status, id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Status pembayaran berhasil diubah" });
    });
};

exports.getAllKomisi = (req, res) => {
    const sql = `
        SELECT k.*, u.nama AS nama_tukang
        FROM komisi k
        JOIN users u ON k.tukang_user_id = u.id
        ORDER BY k.created_at DESC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: result.length, data: result });
    });
};

// ─── RECENT ────────────────────────────────────────────────
exports.getRecentBooking = (req, res) => {
    const sql = `SELECT booking.*, users.nama AS nama_user, tukang_usr.nama AS nama_tukang
        FROM booking
        JOIN users ON booking.user_id = users.id
        JOIN tukang ON booking.tukang_id = tukang.id
        JOIN users AS tukang_usr ON tukang.user_id = tukang_usr.id
        ORDER BY booking.created_at DESC LIMIT 10`;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result });
    });
};

exports.getRecentUsers = (req, res) => {
    const sql = "SELECT id, nama, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 10";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result });
    });
};

// ─── LAPORAN ─────────────────────────────────────────────
exports.getLaporan = (req, res) => {
    const sql = `
        SELECT
            (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_user,
            (SELECT COUNT(*) FROM tukang WHERE status = 'approved') AS total_tukang_aktif,
            (SELECT COUNT(*) FROM booking) AS total_booking,
            (SELECT COUNT(*) FROM booking WHERE status = 'selesai') AS booking_selesai,
            (SELECT ROUND(AVG(rating), 1) FROM reviews) AS avg_rating,
            (SELECT COUNT(*) FROM reviews) AS total_review,
            (SELECT COUNT(*) FROM tukang WHERE status = 'pending') AS pending_verifikasi
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result[0] });
    });
};

// ─── LAPORAN SPESIFIK ─────────────────────────────────────────
exports.getLaporanPendapatan = (req, res) => {
    const sql = `
        SELECT DATE_FORMAT(p.created_at, '%Y-%m') AS bulan,
               SUM(CASE WHEN p.tipe = 'masuk' THEN p.jumlah ELSE 0 END) AS pemasukan,
               SUM(CASE WHEN p.tipe = 'keluar' THEN p.jumlah ELSE 0 END) AS pengeluaran
        FROM pembayaran p
        WHERE p.created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY bulan ORDER BY bulan ASC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        const total = result.reduce((acc, r) => ({ pemasukan: acc.pemasukan + Number(r.pemasukan || 0), pengeluaran: acc.pengeluaran + Number(r.pengeluaran || 0) }), { pemasukan: 0, pengeluaran: 0 });
        res.json({ success: true, data: { bulanan: result, total } });
    });
};

exports.getLaporanTukang = (req, res) => {
    const sql = `
        SELECT
            COUNT(*) AS total,
            COUNT(CASE WHEN status = 'approved' THEN 1 END) AS aktif,
            COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending,
            ROUND(AVG(NULLIF(rating, 0)), 1) AS rating_rata
        FROM tukang
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result[0] });
    });
};

exports.getLaporanCustomer = (req, res) => {
    const sql = `
        SELECT
            COUNT(*) AS total,
            COUNT(CASE WHEN role = 'user' THEN 1 END) AS user,
            COUNT(CASE WHEN role = 'tukang' THEN 1 END) AS tukang,
            COUNT(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 END) AS minggu_ini
        FROM users
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result[0] });
    });
};

exports.getLaporanPembayaran = (req, res) => {
    const sql = `
        SELECT
            COUNT(*) AS total_transaksi,
            SUM(CASE WHEN tipe = 'masuk' THEN jumlah ELSE 0 END) AS total_pemasukan,
            SUM(CASE WHEN tipe = 'keluar' THEN jumlah ELSE 0 END) AS total_pengeluaran,
            COUNT(CASE WHEN status = 'sukses' THEN 1 END) AS sukses,
            COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending,
            COUNT(CASE WHEN status = 'gagal' OR status = 'pending_refund' THEN 1 END) AS gagal
        FROM pembayaran
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result[0] });
    });
};

exports.getLaporanKategori = (req, res) => {
    const sql = `
        SELECT k.nama_kategori, COUNT(t.id) AS total_tukang,
               COALESCE(COUNT(b.id), 0) AS total_booking
        FROM kategori k
        LEFT JOIN tukang t ON t.kategori_id = k.id AND t.status = 'approved'
        LEFT JOIN booking b ON b.tukang_id = t.id
        GROUP BY k.id, k.nama_kategori
        ORDER BY total_tukang DESC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result });
    });
};

exports.getLaporanWilayah = (req, res) => {
    const sql = `
        SELECT
            TRIM(SUBSTRING_INDEX(alamat, ' ', -1)) AS kota,
            COUNT(*) AS total_tukang
        FROM tukang
        WHERE alamat IS NOT NULL AND alamat != ''
        GROUP BY kota
        ORDER BY total_tukang DESC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result });
    });
};

// ─── PENGATURAN & PROFIL ────────────────────────────────────────
exports.getPengaturan = (req, res) => {
    const sql = "SELECT * FROM pengaturan WHERE id = 1";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result[0] || {} });
    });
};

exports.updatePengaturan = (req, res) => {
    const { nama_platform, email_admin, deskripsi, logo } = req.body;
    const sql = `UPDATE pengaturan SET nama_platform=?, email_admin=?, deskripsi=?, logo=? WHERE id=1`;
    db.query(sql, [nama_platform, email_admin, deskripsi, logo], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Pengaturan berhasil disimpan" });
    });
};

exports.getAdminProfile = (req, res) => {
    const sql = "SELECT id, nama, email, role, created_at FROM users WHERE id = ?";
    db.query(sql, [req.user.id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result[0] });
    });
};

exports.updateAdminProfile = (req, res) => {
    const { nama, email } = req.body;
    db.query("UPDATE users SET nama=?, email=? WHERE id=?", [nama, email, req.user.id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Profil berhasil diupdate" });
    });
};