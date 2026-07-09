const db = require("../config/db");

exports.getDashboardAdmin = (req, res) => {
    const sql = `
        SELECT
            (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_user,
            (SELECT COUNT(*) FROM tukang WHERE status = 'approved') AS total_tukang_approved,
            (SELECT COUNT(*) FROM tukang WHERE status = 'pending') AS total_tukang_pending,
            (SELECT COUNT(*) FROM booking) AS total_booking,
            (SELECT COUNT(*) FROM booking WHERE status = 'pending') AS booking_pending,
            (SELECT COUNT(*) FROM booking WHERE status = 'selesai') AS booking_selesai,
            (SELECT COUNT(*) FROM booking WHERE status = 'dikerjakan') AS booking_dikerjakan,
            (SELECT COUNT(*) FROM reviews) AS total_review
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result[0] });
    });
};

exports.getPendingTukang = (req, res) => {
    const sql = `
        SELECT
            tukang.id,
            users.nama,
            users.email,
            kategori.nama_kategori,
            tukang.telepon,
            tukang.alamat,
            tukang.pengalaman,
            tukang.status
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
    const sql = `
        SELECT
            tukang.id,
            users.nama,
            users.email,
            kategori.nama_kategori,
            tukang.telepon,
            tukang.alamat,
            tukang.pengalaman,
            tukang.rating,
            tukang.status
        FROM tukang
        JOIN users ON users.id = tukang.user_id
        JOIN kategori ON kategori.id = tukang.kategori_id
        ORDER BY tukang.status ASC, users.nama ASC
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: result.length, data: result });
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

    db.query("UPDATE tukang SET status='rejected' WHERE id=?", [id], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Tukang ditolak" });
    });
};

exports.getAllBooking = (req, res) => {
    const sql = `
        SELECT
            booking.*,
            users.nama AS nama_user,
            tukang_usr.nama AS nama_tukang
        FROM booking
        JOIN users ON booking.user_id = users.id
        JOIN tukang ON booking.tukang_id = tukang.id
        JOIN users AS tukang_usr ON tukang.user_id = tukang_usr.id
        ORDER BY booking.created_at DESC
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: result.length, data: result });
    });
};

exports.getAllUsers = (req, res) => {
    const sql = "SELECT id, nama, email, role, created_at FROM users ORDER BY created_at DESC";

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: result.length, data: result });
    });
};

exports.getAllReview = (req, res) => {
    const sql = `
        SELECT
            reviews.*,
            users.nama AS nama_user,
            tukang_usr.nama AS nama_tukang
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        JOIN tukang ON reviews.tukang_id = tukang.id
        JOIN users AS tukang_usr ON tukang.user_id = tukang_usr.id
        ORDER BY reviews.created_at DESC
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: result.length, data: result });
    });
};