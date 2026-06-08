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