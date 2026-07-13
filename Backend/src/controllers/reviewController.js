const db = require("../config/db");

exports.createReview = (req, res) => {
    const userId = req.user.id;
    const { booking_id, rating, komentar } = req.body;

    const sqlBooking = `
        SELECT *
        FROM booking
        WHERE id = ?
        AND user_id = ?
        AND status='selesai'
    `;

    db.query(sqlBooking, [booking_id, userId], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.length === 0) return res.status(400).json({ success: false, message: "Booking belum selesai atau tidak ditemukan" });

        const booking = result[0];

        db.query("SELECT * FROM reviews WHERE booking_id = ? AND user_id = ?", [booking_id, userId], (err, existing) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            if (existing.length > 0) return res.status(400).json({ success: false, message: "Anda sudah memberikan review untuk booking ini" });

            const sqlReview = `
                INSERT INTO reviews (booking_id, user_id, tukang_id, rating, komentar)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(sqlReview, [booking.id, userId, booking.tukang_id, rating, komentar], (err) => {
                if (err) return res.status(500).json({ success: false, message: err.message });

                const sqlUpdateRating = `
                    UPDATE tukang
                    SET rating = (
                        SELECT ROUND(AVG(rating), 1)
                        FROM reviews
                        WHERE tukang_id = ?
                    )
                    WHERE id = ?
                `;

                db.query(sqlUpdateRating, [booking.tukang_id, booking.tukang_id], (err) => {
                    if (err) return res.status(500).json({ success: false, message: err.message });
                    res.json({ success: true, message: "Review berhasil ditambahkan dan rating diperbarui" });
                });
            });
        });
    });
};

exports.getReviewByBooking = (req, res) => {
    const userId = req.user.id;
    const { booking_id } = req.params;

    const sql = `
        SELECT *
        FROM reviews
        WHERE booking_id = ? AND user_id = ?
    `;

    db.query(sql, [booking_id, userId], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result[0] || null });
    });
};

exports.getMyReviews = (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT
            reviews.*,
            booking.tanggal_booking,
            users.nama AS nama_tukang
        FROM reviews
        JOIN booking ON reviews.booking_id = booking.id
        JOIN tukang ON reviews.tukang_id = tukang.id
        JOIN users ON tukang.user_id = users.id
        WHERE reviews.user_id = ?
        ORDER BY reviews.created_at DESC
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: result.length, data: result });
    });
};

exports.getLatestReviews = (req, res) => {
    const limit = parseInt(req.query.limit) || 4;

    const sql = `
        SELECT
            reviews.id,
            reviews.rating,
            reviews.komentar,
            reviews.created_at,
            users.nama AS nama_user
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        WHERE reviews.status = 'approved'
        ORDER BY reviews.created_at DESC
        LIMIT ?
    `;

    db.query(sql, [limit], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: result.length, data: result });
    });
};

exports.getReviewByTukangId = (req, res) => {
    const { tukang_id } = req.params;

    const sql = `
        SELECT
            reviews.id,
            reviews.rating,
            reviews.komentar,
            reviews.created_at,
            users.nama AS nama_user
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        WHERE reviews.tukang_id = ? AND reviews.status = 'approved'
        ORDER BY reviews.created_at DESC
    `;

    db.query(sql, [tukang_id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: result.length, data: result });
    });
};