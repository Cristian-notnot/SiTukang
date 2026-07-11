const db = require("../config/db");

exports.createBooking = (req, res) => {
    const { tukang_id, tanggal_booking, alamat, keluhan } = req.body;
    const user_id = req.user.id;

    if (!tukang_id || !alamat) {
        return res.status(400).json({ success: false, message: "Data booking tidak lengkap" });
    }

    const sql = `
        INSERT INTO booking (user_id, tukang_id, tanggal_booking, alamat, keluhan)
        VALUES (?, ?, ?, ?, ?)
    `;

    let bookingDate;
    if (tanggal_booking) {
        const d = new Date(tanggal_booking);
        const pad = (n) => String(n).padStart(2, '0');
        bookingDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    } else {
        bookingDate = new Date();
    }

    db.query(sql, [user_id, tukang_id, bookingDate, alamat, keluhan], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        res.status(201).json({
            success: true,
            message: "Booking berhasil dibuat",
            booking_id: result.insertId
        });
    });
};

exports.getMyBooking = (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT
            booking.*,
            users.nama AS nama_tukang
        FROM booking
        JOIN tukang ON booking.tukang_id = tukang.id
        JOIN users ON tukang.user_id = users.id
        WHERE booking.user_id = ?
        ORDER BY booking.created_at DESC
    `;

    db.query(sql, [user_id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result });
    });
};

exports.getMyBookingSelesai = (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT
            booking.*,
            users.nama AS nama_tukang
        FROM booking
        JOIN tukang ON booking.tukang_id = tukang.id
        JOIN users ON tukang.user_id = users.id
        WHERE booking.user_id = ? AND booking.status = 'selesai'
        ORDER BY booking.created_at DESC
    `;

    db.query(sql, [user_id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        db.query(
            "SELECT booking_id, rating, komentar, created_at FROM reviews WHERE booking_id IN (?)",
            [result.length > 0 ? result.map(r => r.id) : [0]],
            (err, reviews) => {
                if (err) return res.status(500).json({ success: false, message: err.message });

                const reviewMap = {};
                reviews.forEach(r => { reviewMap[r.booking_id] = r; });

                const data = result.map(b => ({
                    ...b,
                    review: reviewMap[b.id] || null
                }));

                res.json({ success: true, total: data.length, data });
            }
        );
    });
};

exports.updateBookingStatus = (req, res) => {
    const bookingId = req.params.id;
    const { status } = req.body;

    const allowedStatus = ["pending", "diterima", "dikerjakan", "selesai", "ditolak", "dibatalkan"];

    if (!allowedStatus.includes(status)) {
        return res.status(400).json({ success: false, message: "Status tidak valid" });
    }

    const sql = "UPDATE booking SET status = ? WHERE id = ?";

    db.query(sql, [status, bookingId], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Booking tidak ditemukan" });
        res.json({ success: true, message: "Status booking berhasil diperbarui" });
    });
};

exports.cancelBooking = (req, res) => {
    const bookingId = req.params.id;
    const userId = req.user.id;

    db.query("SELECT * FROM booking WHERE id = ? AND user_id = ?", [bookingId, userId], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.length === 0) return res.status(404).json({ success: false, message: "Booking tidak ditemukan" });

        if (result[0].status !== "pending") {
            return res.status(400).json({ success: false, message: "Hanya booking dengan status pending yang bisa dibatalkan" });
        }

        db.query("UPDATE booking SET status = 'dibatalkan' WHERE id = ?", [bookingId], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: "Booking berhasil dibatalkan" });
        });
    });
};