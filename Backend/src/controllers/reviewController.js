const db = require("../config/db");

exports.createReview = (req, res) => {

    const {
        booking_id,
        rating,
        komentar
    } = req.body;

    const user_id = req.user.id;

    const sqlBooking = `
        SELECT *
        FROM booking
        WHERE id = ?
    `;

    db.query(
        sqlBooking,
        [booking_id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Booking tidak ditemukan"
                });
            }

            const tukang_id = result[0].tukang_id;

            const sqlReview = `
                INSERT INTO reviews (
                    booking_id,
                    user_id,
                    tukang_id,
                    rating,
                    komentar
                )
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                sqlReview,
                [
                    booking_id,
                    user_id,
                    tukang_id,
                    rating,
                    komentar
                ],
                (err, reviewResult) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    res.status(201).json({
                        success: true,
                        message: "Review berhasil dibuat"
                    });

                }
            );

        }
    );

};