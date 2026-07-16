const db = require("../config/db");

const ensureTables = (callback) => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS wallets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      saldo DECIMAL(15,2) DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      tipe ENUM('topup','payment','withdraw','refund') NOT NULL,
      jumlah DECIMAL(15,2) NOT NULL,
      metode VARCHAR(50) DEFAULT NULL,
      status ENUM('pending','success','failed') DEFAULT 'pending',
      referensi VARCHAR(100) DEFAULT NULL,
      keterangan TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS payment_methods (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      tipe ENUM('bank_transfer','e_wallet','virtual_account') NOT NULL,
      nama_bank VARCHAR(100) DEFAULT NULL,
      nomor_rekening VARCHAR(50) DEFAULT NULL,
      nama_pemilik VARCHAR(100) DEFAULT NULL,
      is_default TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  ];

  let completed = 0;
  queries.forEach((sql) => {
    db.query(sql, (err) => {
      if (err) return callback(err);
      completed++;
      if (completed === queries.length) callback(null);
    });
  });
};

exports.getWallet = (req, res) => {
  ensureTables((err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    const userId = req.user.id;
    db.query(
      "SELECT id, user_id, saldo, created_at, updated_at FROM wallets WHERE user_id = ?",
      [userId],
      (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        if (result.length === 0) {
          db.query(
            "INSERT INTO wallets (user_id, saldo) VALUES (?, 0)",
            [userId],
            (err, insertResult) => {
              if (err) return res.status(500).json({ success: false, message: err.message });
              res.json({
                success: true,
                data: { id: insertResult.insertId, user_id: userId, saldo: 0 }
              });
            }
          );
        } else {
          res.json({ success: true, data: result[0] });
        }
      }
    );
  });
};

exports.getTransactions = (req, res) => {
  ensureTables((err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    const userId = req.user.id;
    const { tipe, limit = 20, offset = 0 } = req.query;

    let sql = "SELECT * FROM transactions WHERE user_id = ?";
    const params = [userId];

    if (tipe) {
      sql += " AND tipe = ?";
      params.push(tipe);
    }

    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    db.query(sql, params, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      db.query(
        "SELECT COUNT(*) as total FROM transactions WHERE user_id = ?",
        [userId],
        (err, countResult) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          res.json({ success: true, total: countResult[0].total, data: result });
        }
      );
    });
  });
};

exports.getPaymentMethods = (req, res) => {
  ensureTables((err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    const userId = req.user.id;
    db.query(
      "SELECT * FROM payment_methods WHERE user_id = ? ORDER BY is_default DESC, created_at DESC",
      [userId],
      (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result });
      }
    );
  });
};

exports.addPaymentMethod = (req, res) => {
  ensureTables((err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    const userId = req.user.id;
    const { tipe, nama_bank, nomor_rekening, nama_pemilik, is_default } = req.body;

    if (!tipe || !nomor_rekening || !nama_pemilik) {
      return res.status(400).json({ success: false, message: "Data metode pembayaran tidak lengkap" });
    }

    if (is_default) {
      db.query(
        "UPDATE payment_methods SET is_default = 0 WHERE user_id = ?",
        [userId],
        (err) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          insertMethod();
        }
      );
    } else {
      insertMethod();
    }

    function insertMethod() {
      db.query(
        "INSERT INTO payment_methods (user_id, tipe, nama_bank, nomor_rekening, nama_pemilik, is_default) VALUES (?, ?, ?, ?, ?, ?)",
        [userId, tipe, nama_bank || null, nomor_rekening, nama_pemilik, is_default ? 1 : 0],
        (err, result) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          res.status(201).json({ success: true, message: "Metode pembayaran berhasil ditambahkan", id: result.insertId });
        }
      );
    }
  });
};

exports.deletePaymentMethod = (req, res) => {
  ensureTables((err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    const userId = req.user.id;
    const { id } = req.params;

    db.query(
      "DELETE FROM payment_methods WHERE id = ? AND user_id = ?",
      [id, userId],
      (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Metode pembayaran tidak ditemukan" });
        res.json({ success: true, message: "Metode pembayaran berhasil dihapus" });
      }
    );
  });
};

exports.setDefaultPaymentMethod = (req, res) => {
  ensureTables((err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    const userId = req.user.id;
    const { id } = req.params;

    db.query(
      "UPDATE payment_methods SET is_default = 0 WHERE user_id = ?",
      [userId],
      (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        db.query(
          "UPDATE payment_methods SET is_default = 1 WHERE id = ? AND user_id = ?",
          [id, userId],
          (err, result) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Metode pembayaran tidak ditemukan" });
            res.json({ success: true, message: "Metode pembayaran utama berhasil diubah" });
          }
        );
      }
    );
  });
};

exports.payBooking = (req, res) => {
  ensureTables((err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    const userId = req.user.id;
    const { booking_id, jumlah, metode } = req.body;

    if (!booking_id || !jumlah || jumlah <= 0) {
      return res.status(400).json({ success: false, message: "Data pembayaran tidak lengkap" });
    }

    const paymentMethod = metode || "qris";

    db.query("SELECT * FROM booking WHERE id = ? AND user_id = ?", [booking_id, userId], (err, booking) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (booking.length === 0) return res.status(404).json({ success: false, message: "Booking tidak ditemukan" });
      if (booking[0].status !== "selesai") return res.status(400).json({ success: false, message: "Booking belum selesai dikerjakan" });

      const referensi = "PAY-" + Date.now();

      db.query(
        "INSERT INTO transactions (user_id, tipe, jumlah, metode, status, referensi, keterangan) VALUES (?, 'payment', ?, ?, 'success', ?, ?)",
        [userId, jumlah, paymentMethod, referensi, `Pembayaran booking #${booking_id}`],
        (err, txResult) => {
          if (err) return res.status(500).json({ success: false, message: err.message });

          db.query(
            "UPDATE wallets SET saldo = saldo - ? WHERE user_id = ? AND saldo >= ?",
            [jumlah, userId, jumlah],
            (err, walletResult) => {
              if (err) return res.status(500).json({ success: false, message: err.message });
              if (walletResult.affectedRows === 0) return res.status(400).json({ success: false, message: "Saldo tidak mencukupi" });

              res.json({
                success: true,
                message: "Pembayaran berhasil",
                data: { transaction_id: txResult.insertId, referensi }
              });
            }
          );
        }
      );
    });
  });
};
