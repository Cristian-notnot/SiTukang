const db = require("../config/db");

exports.createBooking = (req, res) => {

    const { tukang_id, alamat, keluhan } = req.body;

    const user_id = req.user.id;

    if (!tukang_id || !alamat) {
        return res.status(400).json({
            success: false,
            message: "Data booking tidak lengkap"
        });
    }

    const sql = `
        INSERT INTO booking (
            user_id,
            tukang_id,
            tanggal_booking,
            alamat,
            keluhan
        )
        VALUES (?, ?, NOW(), ?, ?)
    `;

    db.query(
        sql,
        [user_id, tukang_id, alamat, keluhan],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Booking berhasil dibuat",
                booking_id: result.insertId
            });

        }
    );

};

exports.getMyBooking = (req, res) => {

    const user_id = req.user.id;

    const sql = `
        SELECT
            booking.*,
            users.nama AS nama_tukang
        FROM booking
        JOIN tukang
            ON booking.tukang_id = tukang.id
        JOIN users
            ON tukang.user_id = users.id
        WHERE booking.user_id = ?
        ORDER BY booking.created_at DESC
    `;

    db.query(sql, [user_id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            data: result
        });

    });

};