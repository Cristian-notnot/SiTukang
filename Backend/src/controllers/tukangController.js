const db = require("../config/db");

exports.getAllTukang = (req, res) => {

  const sql = `
    SELECT
      tukang.id,
      users.nama,
      kategori.nama_kategori,
      tukang.telepon,
      tukang.alamat,
      tukang.rating
    FROM tukang
    JOIN users
      ON tukang.user_id = users.id
    JOIN kategori
      ON tukang.kategori_id = kategori.id
  `;

  db.query(sql, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

exports.getDetailTukang = (req, res) => {

    const { id } = req.params;
    console.log(req.params.id);
    const sql = `
        SELECT
            tukang.id,
            users.nama,
            kategori.nama_kategori,
            tukang.telepon,
            tukang.alamat,
            tukang.deskripsi,
            tukang.rating,
            tukang.pengalaman
        FROM tukang
        JOIN users
            ON tukang.user_id = users.id
        JOIN kategori
            ON tukang.kategori_id = kategori.id
        WHERE tukang.id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tukang tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            message: "Detail tukang berhasil diambil",
            data: result[0]
        });

    });

};

exports.registerTukang = (req, res) => {

    const userId = req.user.id;

    const {
        kategori_id,
        telepon,
        alamat,
        deskripsi,
        pengalaman
    } = req.body;

    // Cek apakah user sudah menjadi tukang
    const cekSql = `
        SELECT *
        FROM tukang
        WHERE user_id = ?
    `;

    db.query(cekSql, [userId], (err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        if (result.length > 0) {

            return res.status(400).json({
                success: false,
                message: "Anda sudah pernah mendaftar sebagai tukang"
            });

        }

        const insertSql = `
            INSERT INTO tukang
            (
                user_id,
                kategori_id,
                telepon,
                alamat,
                deskripsi,
                pengalaman,
                rating,
                status
            )
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(

            insertSql,

            [
                userId,
                kategori_id,
                telepon,
                alamat,
                deskripsi,
                pengalaman,
                0,
                "pending"
            ],

            (err) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                }

                res.status(201).json({

                    success: true,
                    message: "Pendaftaran tukang berhasil. Menunggu persetujuan admin."

                });

            }

        );

    });

};

exports.getBookingTukang = (req, res) => {

    const userId = req.user.id;
    const status = req.query.status;

    const sqlCariTukang = `
        SELECT id
        FROM tukang
        WHERE user_id = ?
    `;

    db.query(sqlCariTukang, [userId], (err, tukang) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (tukang.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tukang tidak ditemukan"
            });
        }

        const tukangId = tukang[0].id;

        let sql = `
            SELECT
                booking.*,
                users.nama AS nama_user
            FROM booking
            JOIN users
                ON booking.user_id = users.id
            WHERE booking.tukang_id = ?
        `;

        let params = [tukangId];

        if (status) {

            sql += " AND booking.status = ?";

            params.push(status);

        }

        sql += " ORDER BY booking.created_at DESC";

        db.query(sql, params, (err, result) => {

            if (err) {
                return res.status(500).json({
                    success:false,
                    message:err.message
                });
            }

            res.json({
                success:true,
                data:result
            });

        });

    });

};

exports.updateStatusBooking = (req, res) => {

    const userId = req.user.id;
    const bookingId = req.params.id;
    const { status } = req.body;

    // Validasi status
    const allowedStatus = [
    "diterima",
    "ditolak",
    "dikerjakan",
    "selesai"
];

    if (!allowedStatus.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Status tidak valid"
        });
    }

    // Cari data tukang berdasarkan user login
    const sqlCariTukang = `
        SELECT id
        FROM tukang
        WHERE user_id = ?
    `;

    db.query(sqlCariTukang, [userId], (err, tukang) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (tukang.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tukang tidak ditemukan"
            });
        }

        const tukangId = tukang[0].id;

        // Pastikan booking memang milik tukang ini
        const sqlCekBooking = `
            SELECT *
            FROM booking
            WHERE id = ?
            AND tukang_id = ?
        `;

        db.query(sqlCekBooking, [bookingId, tukangId], (err, booking) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (booking.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Booking tidak ditemukan"
                });
            }

            const currentStatus = booking[0].status;

            if (
    currentStatus === "pending" &&
    status !== "diterima" &&
    status !== "ditolak"
) {

    return res.status(400).json({
        success:false,
        message:"Booking pending hanya bisa diterima atau ditolak"
    });

}

if (
    currentStatus === "diterima" &&
    status !== "dikerjakan"
){

    return res.status(400).json({
        success:false,
        message:"Booking diterima hanya bisa menjadi dikerjakan"
    });

}

if (
    currentStatus === "dikerjakan" &&
    status !== "selesai"
){

    return res.status(400).json({
        success:false,
        message:"Booking dikerjakan hanya bisa menjadi selesai"
    });

}

if (
    currentStatus === "ditolak" ||
    currentStatus === "selesai"
){

    return res.status(400).json({
        success:false,
        message:"Status booking tidak dapat diubah lagi"
    });

}

            // Update status booking
            const sqlUpdate = `
                UPDATE booking
                SET status = ?
                WHERE id = ?
            `;

            db.query(sqlUpdate, [status, bookingId], (err) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                res.json({
                    success: true,
                    message: "Status booking berhasil diperbarui"
                });

            });

        });

    });

};

exports.getDashboardTukang = (req,res)=>{

    const userId=req.user.id;

    const sql=`
    SELECT

    SUM(CASE WHEN booking.status='pending' THEN 1 ELSE 0 END) AS pending,

    SUM(CASE WHEN booking.status='diterima' THEN 1 ELSE 0 END) AS diterima,

    SUM(CASE WHEN booking.status='dikerjakan' THEN 1 ELSE 0 END) AS dikerjakan,

    SUM(CASE WHEN booking.status='selesai' THEN 1 ELSE 0 END) AS selesai,

    AVG(booking.rating) AS rating

    FROM tukang

    LEFT JOIN booking
    ON booking.tukang_id=tukang.id

    WHERE tukang.user_id=?
    `;

    db.query(sql,[userId],(err,result)=>{

        if(err){

            return res.status(500).json(err);

        }

        res.json({

            success:true,

            data:result[0]

        });

    });

};

// NEW: Search tukang by keyword + alamat
exports.searchTukang = (req, res) => {

  const { keyword = "", alamat = "" } = req.query;

  const keywordTrim = String(keyword).trim();
  const alamatTrim = String(alamat).trim();

  if (!keywordTrim && !alamatTrim) {
    return res.status(200).json([]);
  }

  const sql = `
    SELECT
      tukang.id,
      users.nama,
      kategori.nama_kategori,
      tukang.telepon,
      tukang.alamat,
      tukang.rating
    FROM tukang
    JOIN users
      ON tukang.user_id = users.id
    JOIN kategori
      ON tukang.kategori_id = kategori.id
    WHERE 1=1
    AND ( ? = '' OR users.nama LIKE ? OR kategori.nama_kategori LIKE ? )
    AND ( ? = '' OR tukang.alamat LIKE ? )
    `;

  const params = [
    keywordTrim,
    `%${keywordTrim}%`,
    `%${keywordTrim}%`,
    alamatTrim,
    `%${alamatTrim}%`
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });

};
