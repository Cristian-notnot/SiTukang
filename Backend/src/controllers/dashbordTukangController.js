const db = require("../config/db");

exports.getBookingMasuk = (req, res) => {

    const userId = req.user.id;

    // Cari id tukang berdasarkan user login
    const sqlCariTukang = `
        SELECT id
        FROM tukang
        WHERE user_id = ?
    `;

    db.query(sqlCariTukang, [userId], (err, tukangResult) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (tukangResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Data tukang tidak ditemukan"
            });
        }

        const tukangId = tukangResult[0].id;

        const sqlBooking = `
            SELECT
                booking.id,
                booking.alamat,
                booking.keluhan,
                booking.status,
                booking.tanggal_booking,
                users.nama AS nama_user,
                users.email
            FROM booking

            JOIN users
                ON booking.user_id = users.id

            WHERE booking.tukang_id = ?

            ORDER BY booking.created_at DESC
        `;

        db.query(sqlBooking, [tukangId], (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            return res.status(200).json({
                success: true,
                total: result.length,
                data: result
            });

        });

    });

};