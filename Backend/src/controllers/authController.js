const db = require("../config/db");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

exports.register = async (req, res) => {
  const { nama, email, password } = req.body;

  console.log("BODY:", req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (nama,email,password) VALUES (?,?,?)";

    db.query(
      sql,
      [nama, email, hashedPassword],
      (err, result) => {

        if (err) {
          console.log("REGISTER ERROR:", err);

          return res.status(500).json({
            message: err.sqlMessage,
            code: err.code
          });
        }

        console.log("REGISTER BERHASIL");

        res.status(201).json({
          message: "User berhasil dibuat",
        });
      }
    );

  } catch (error) {

    console.log("CATCH ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};

const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { email, password, loginAs } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Password salah",
      });
    }

    if (loginAs === "admin" && user.role !== "admin") {
      return res.status(403).json({
        message: "Akun ini bukan admin.",
      });
    }

    if (loginAs === "tukang" && user.role !== "tukang") {
      return res.status(403).json({
        message: "Akun ini bukan tukang. Silakan login sebagai Customer.",
      });
    }

    if (loginAs === "customer" && user.role === "tukang") {
      return res.status(403).json({
        message: "Akun tukang tidak bisa login sebagai Customer. Gunakan tab Tukang.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    const userData = { ...user };
    delete userData.password;

    res.json({
      token,
      user: userData,
    });
  });
};

exports.registerTukang = async (req, res) => {
  const { nama, email, password, no_hp, kategori_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userSql = "INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, 'tukang')";

    db.query(userSql, [nama, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({
            success: false,
            message: "Email sudah terdaftar"
          });
        }
        return res.status(500).json({
          success: false,
          message: err.sqlMessage
        });
      }

      const userId = result.insertId;

      const tukangSql = `
        INSERT INTO tukang (user_id, kategori_id, telepon, rating, status)
        VALUES (?, ?, ?, 0, 'pending')
      `;

      db.query(tukangSql, [userId, kategori_id, no_hp], (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message
          });
        }

        const token = jwt.sign(
          { id: userId, email, role: 'tukang' },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        res.status(201).json({
          success: true,
          message: "Pendaftaran tukang berhasil. Menunggu persetujuan admin.",
          token,
          user: {
            id: userId,
            nama,
            email,
            role: 'tukang'
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getProfile = (req, res) => {
  const userId = req.user.id;

  const sql = "SELECT * FROM users WHERE id = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    const data = result[0];
    delete data.password;

    res.json({ success: true, data });
  });
};

exports.updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { nama, email, current_password, new_password } = req.body;

    if (!nama && !email && !new_password) {
        return res.status(400).json({ success: false, message: "Tidak ada data yang diubah" });
    }

    const buildQuery = () => {
        let sql = "UPDATE users SET";
        const params = [];
        const sets = [];

        if (nama) {
            sets.push(" nama = ?");
            params.push(nama);
        }
        if (email) {
            sets.push(" email = ?");
            params.push(email);
        }
        if (new_password) {
            sets.push(" password = ?");
            params.push(new_password);
        }

        sql += sets.join(",");
        sql += " WHERE id = ?";
        params.push(userId);

        return { sql, params };
    };

    const handleUpdate = (hashedPassword) => {
        const { sql, params } = buildQuery();
        db.query(sql, params, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ success: false, message: "Email sudah digunakan" });
                }
                return res.status(500).json({ success: false, message: err.message });
            }
            res.json({ success: true, message: "Profil berhasil diperbarui" });
        });
    };

    if (new_password) {
        if (!current_password) {
            return res.status(400).json({ success: false, message: "Password saat ini wajib diisi untuk mengganti password" });
        }
        db.query("SELECT password FROM users WHERE id = ?", [userId], async (err, result) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            const isMatch = await bcrypt.compare(current_password, result[0].password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Password saat ini salah" });
            }
            const hashedPassword = await bcrypt.hash(new_password, 10);
            handleUpdate(hashedPassword);
        });
    } else {
        handleUpdate(null);
    }
};

exports.uploadPhoto = (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "Tidak ada file yang diupload" });
  }

  const fotoPath = "uploads/profile/" + req.file.filename;

  const tryUpdate = () => {
    db.query("UPDATE users SET foto = ? WHERE id = ?", [fotoPath, userId], (err) => {
      if (err) {
        if (err.errno === 1054) {
          db.query("ALTER TABLE users ADD COLUMN `foto` VARCHAR(255) DEFAULT NULL AFTER `role`", (alterErr) => {
            if (alterErr) return res.status(500).json({ success: false, message: alterErr.message });
            tryUpdate();
          });
        } else {
          return res.status(500).json({ success: false, message: err.message });
        }
      } else {
        res.json({ success: true, message: "Foto berhasil diupload", data: { foto: fotoPath } });
      }
    });
  };

  db.query("SELECT foto FROM users WHERE id = ?", [userId], (err, result) => {
    if (err && err.errno === 1054) {
      db.query("ALTER TABLE users ADD COLUMN `foto` VARCHAR(255) DEFAULT NULL AFTER `role`", (alterErr) => {
        if (alterErr) return res.status(500).json({ success: false, message: alterErr.message });
        tryUpdate();
      });
    } else if (err) {
      return res.status(500).json({ success: false, message: err.message });
    } else {
      if (result[0]?.foto) {
        const oldPath = path.join(__dirname, "../..", result[0].foto);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      tryUpdate();
    }
  });
};

exports.resetPassword = async (req, res) => {

    const { id } = req.params;
    const { password } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            UPDATE users
            SET password = ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [hashedPassword, id],
            (err, result) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                }

                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        success: false,
                        message: "User tidak ditemukan"
                    });

                }

                res.json({

                    success: true,
                    message: "Password berhasil diubah"

                });

            }
        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
