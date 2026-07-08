const db = require("../config/db");

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

        JOIN users

            ON users.id = tukang.user_id

        JOIN kategori

            ON kategori.id = tukang.kategori_id

        WHERE tukang.status = 'pending'

    `;

    db.query(sql, (err, result) => {

        if (err) {

            return res.status(500).json({

                success: false,

                message: err.message

            });

        }

        res.json({

            success: true,

            total: result.length,

            data: result

        });

    });

};

exports.approveTukang = (req, res) => {

    const { id } = req.params;

    const sqlCari = `
        SELECT user_id
        FROM tukang
        WHERE id = ?
    `;

    db.query(sqlCari, [id], (err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        if (result.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Data tidak ditemukan"
            });

        }

        const userId = result[0].user_id;

        const sqlApprove = `
            UPDATE tukang
            SET status='approved'
            WHERE id=?
        `;

        db.query(sqlApprove, [id], (err) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            const sqlRole = `
                UPDATE users
                SET role='tukang'
                WHERE id=?
            `;

            db.query(sqlRole, [userId], (err) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                }

                res.json({

                    success: true,

                    message: "Pendaftaran tukang berhasil disetujui"

                });

            });

        });

    });

};

exports.rejectTukang = (req, res) => {

    const { id } = req.params;

    const sql = `
        UPDATE tukang
        SET status='rejected'
        WHERE id=?
    `;

    db.query(sql, [id], (err) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        res.json({

            success: true,

            message: "Pendaftaran ditolak"

        });

    });

};