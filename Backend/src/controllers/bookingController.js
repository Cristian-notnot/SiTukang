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