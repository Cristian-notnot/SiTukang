const db = require("../config/db");

const getTukangId = (userId, callback) => {
    db.query(
        "SELECT id FROM tukang WHERE user_id = ?",
        [userId],
        (err, result) => {
            if (err) return callback(err);
            if (result.length === 0)
                return callback({ status: 404, message: "Tukang tidak ditemukan" });
            callback(null, result[0].id);
        }
    );
};

exports.getDashboard = (req, res) => {
    const userId = req.user.id;

    getTukangId(userId, (err, tukangId) => {
        if (err) {
            const status = err.status || 500;
            return res.status(status).json({ success: false, message: err.message });
        }

        const sql = `
            SELECT
                (SELECT COUNT(*) FROM booking WHERE tukang_id = ? AND status = 'pending') AS pending,
                (SELECT COUNT(*) FROM booking WHERE tukang_id = ? AND status = 'diterima') AS diterima,
                (SELECT COUNT(*) FROM booking WHERE tukang_id = ? AND status = 'dikerjakan') AS dikerjakan,
                (SELECT COUNT(*) FROM booking WHERE tukang_id = ? AND status = 'selesai') AS selesai,
                (SELECT COUNT(*) FROM booking WHERE tukang_id = ? AND status = 'ditolak') AS ditolak,
                (SELECT ROUND(AVG(rating), 1) FROM reviews WHERE tukang_id = ?) AS rating,
                (SELECT COUNT(*) FROM reviews WHERE tukang_id = ?) AS total_review
        `;

        db.query(sql, [tukangId, tukangId, tukangId, tukangId, tukangId, tukangId, tukangId], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, data: result[0] });
        });
    });
};

exports.getBookingMasuk = (req, res) => {
    const userId = req.user.id;

    getTukangId(userId, (err, tukangId) => {
        if (err) {
            const status = err.status || 500;
            return res.status(status).json({ success: false, message: err.message });
        }

        const sql = `
            SELECT
                booking.id,
                booking.alamat,
                booking.keluhan,
                booking.status,
                booking.tanggal_booking,
                booking.created_at,
                users.nama AS nama_user,
                users.email
            FROM booking
            JOIN users ON booking.user_id = users.id
            WHERE booking.tukang_id = ?
            ORDER BY booking.created_at DESC
        `;

        db.query(sql, [tukangId], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, total: result.length, data: result });
        });
    });
};

exports.getRiwayatPekerjaan = (req, res) => {
    const userId = req.user.id;
    const { status } = req.query;

    getTukangId(userId, (err, tukangId) => {
        if (err) {
            const statusCode = err.status || 500;
            return res.status(statusCode).json({ success: false, message: err.message });
        }

        let sql = `
            SELECT
                booking.id,
                booking.alamat,
                booking.keluhan,
                booking.status,
                booking.tanggal_booking,
                booking.created_at,
                users.nama AS nama_user,
                users.email
            FROM booking
            JOIN users ON booking.user_id = users.id
            WHERE booking.tukang_id = ?
        `;
        const params = [tukangId];

        if (status) {
            sql += " AND booking.status = ?";
            params.push(status);
        }

        sql += " ORDER BY booking.created_at DESC";

        db.query(sql, params, (err, result) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, total: result.length, data: result });
        });
    });
};

exports.getReviewTukang = (req, res) => {
    const userId = req.user.id;

    getTukangId(userId, (err, tukangId) => {
        if (err) {
            const statusCode = err.status || 500;
            return res.status(statusCode).json({ success: false, message: err.message });
        }

        const sql = `
            SELECT
                reviews.id,
                reviews.rating,
                reviews.komentar,
                reviews.created_at,
                users.nama AS nama_user
            FROM reviews
            JOIN users ON reviews.user_id = users.id
            WHERE reviews.tukang_id = ?
            ORDER BY reviews.created_at DESC
        `;

        db.query(sql, [tukangId], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, total: result.length, data: result });
        });
    });
};

exports.updateRatingTukang = (req, res) => {
    const userId = req.user.id;

    getTukangId(userId, (err, tukangId) => {
        if (err) {
            const statusCode = err.status || 500;
            return res.status(statusCode).json({ success: false, message: err.message });
        }

        const sql = `
            UPDATE tukang
            SET rating = (
                SELECT ROUND(AVG(rating), 1)
                FROM reviews
                WHERE tukang_id = ?
            )
            WHERE id = ?
        `;

        db.query(sql, [tukangId, tukangId], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            db.query("SELECT rating FROM tukang WHERE id = ?", [tukangId], (err, result) => {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, message: "Rating berhasil diperbarui", rating: result[0].rating });
            });
        });
    });
};

exports.getProfil = (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT
            tukang.id,
            users.nama,
            users.email,
            kategori.nama_kategori,
            tukang.telepon,
            tukang.alamat,
            tukang.deskripsi,
            tukang.pengalaman,
            tukang.rating,
            tukang.status
        FROM tukang
        JOIN users ON tukang.user_id = users.id
        JOIN kategori ON tukang.kategori_id = kategori.id
        WHERE tukang.user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.length === 0) return res.status(404).json({ success: false, message: "Profil tukang belum lengkap" });
        res.json({ success: true, data: result[0] });
    });
};

exports.updateProfil = (req, res) => {
    const userId = req.user.id;
    const { nama, telepon, alamat, deskripsi, pengalaman } = req.body;

    db.query("SELECT id FROM tukang WHERE user_id = ?", [userId], (err, tukangResult) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (tukangResult.length === 0) return res.status(404).json({ success: false, message: "Data tukang tidak ditemukan" });

        const tukangId = tukangResult[0].id;

        const sqlTukang = `
            UPDATE tukang
            SET telepon = ?, alamat = ?, deskripsi = ?, pengalaman = ?
            WHERE id = ?
        `;

        db.query(sqlTukang, [telepon, alamat, deskripsi, pengalaman, tukangId], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            if (nama) {
                db.query("UPDATE users SET nama = ? WHERE id = ?", [nama, userId], (err) => {
                    if (err) return res.status(500).json({ success: false, message: err.message });
                    res.json({ success: true, message: "Profil berhasil diperbarui" });
                });
            } else {
                res.json({ success: true, message: "Profil berhasil diperbarui" });
            }
        });
    });
};