const db = require("../config/db");

exports.getDashboardStats = (req, res) => {

    const stats = {};

    db.query(
        "SELECT COUNT(*) AS total_users FROM users",
        (err, users) => {

            if (err) {
                return res.status(500).json(err);
            }

            stats.total_users = users[0].total_users;

            db.query(
                "SELECT COUNT(*) AS total_tukang FROM tukang",
                (err, tukang) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    stats.total_tukang = tukang[0].total_tukang;

                    db.query(
                        "SELECT COUNT(*) AS total_booking FROM booking",
                        (err, booking) => {

                            if (err) {
                                return res.status(500).json(err);
                            }

                            stats.total_booking =
                                booking[0].total_booking;

                            db.query(
                                "SELECT COUNT(*) AS total_review FROM reviews",
                                (err, review) => {

                                    if (err) {
                                        return res.status(500).json(err);
                                    }

                                    stats.total_review =
                                        review[0].total_review;

                                    res.json({
                                        success: true,
                                        data: stats
                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};