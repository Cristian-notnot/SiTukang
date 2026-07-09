const db = require("../config/db");
const bcrypt = require("bcrypt");

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

    res.json({
      token,
      user,
    });
  });
};

exports.getProfile = (req, res) => {
  const userId = req.user.id;

  const sql = `
        SELECT
            id,
            nama,
            email,
            role
        FROM users
        WHERE id = ?
    `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      data: result[0],
    });
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
