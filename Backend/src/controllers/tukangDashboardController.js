const db = require("../config/db");

const getTukangId = (userId) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT id FROM tukang WHERE user_id = ?", [userId], (err, result) => {
      if (err) return reject(err);
      if (!result.length) return reject(new Error("Tukang tidak ditemukan"));
      resolve(result[0].id);
    });
  });
};

// ─── DASHBOARD ───
exports.getDashboard = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);

    const stats = {};
    const queryCount = (status) =>
      new Promise((resolve, reject) => {
        db.query("SELECT COUNT(*) AS total FROM booking WHERE tukang_id = ? AND status = ?", [tukangId, status], (err, r) => {
          if (err) return reject(err);
          resolve(r[0].total);
        });
      });

    const [pending, diterima, dikerjakan, selesai, ditolak, ratingResult] = await Promise.all([
      queryCount("pending"),
      queryCount("diterima"),
      queryCount("dikerjakan"),
      queryCount("selesai"),
      queryCount("ditolak"),
      new Promise((resolve, reject) => {
        db.query("SELECT ROUND(AVG(rating),1) AS avg_rating, COUNT(*) AS total_review FROM reviews WHERE tukang_id = ?", [tukangId], (err, r) => {
          if (err) return reject(err);
          resolve(r[0]);
        });
      }),
      new Promise((resolve, reject) => {
        db.query("SELECT COALESCE(SUM(total),0) AS total_earnings FROM payment WHERE tukang_id = ? AND status = 'completed'", [tukangId], (err, r) => {
          if (err) return reject(err);
          resolve(r[0]);
        });
      }),
    ]);
    const earningsResult = await new Promise((resolve, reject) => {
      db.query("SELECT COALESCE(SUM(total),0) AS total_earnings FROM payment WHERE tukang_id = ? AND status = 'completed'", [tukangId], (err, r) => {
        if (err) return reject(err);
        resolve(r[0]);
      });
    });

    res.json({
      success: true,
      data: {
        pending,
        diterima,
        dikerjakan,
        selesai,
        ditolak,
        rating: ratingResult.avg_rating || 0,
        total_review: ratingResult.total_review,
        total_earnings: earningsResult.total_earnings,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── INCOMING / ACTIVE / COMPLETED ORDERS ───
exports.getOrders = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    const { status } = req.query;
    let sql = `SELECT booking.*, users.nama AS nama_user, booking.alamat AS alamat_user,
               users.email AS email_user
        FROM booking
        JOIN users ON users.id = booking.user_id
        WHERE booking.tukang_id = ?`;
    const params = [tukangId];

    if (status) {
      if (status === "incoming") {
        sql += " AND booking.status = 'pending'";
      } else if (status === "active") {
        sql += " AND booking.status IN ('diterima','dikerjakan')";
      } else if (status === "completed") {
        sql += " AND booking.status = 'selesai'";
      } else {
        sql += " AND booking.status = ?";
        params.push(status);
      }
    }

    sql += " ORDER BY booking.created_at DESC";

    db.query(sql, params, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: result });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["diterima", "ditolak", "dikerjakan", "selesai"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Status tidak valid" });
    }

    // Verify booking belongs to this tukang
    db.query("SELECT id, status FROM booking WHERE id = ? AND tukang_id = ?", [id, tukangId], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (!result.length) return res.status(404).json({ success: false, message: "Booking tidak ditemukan" });

      const currentStatus = result[0].status;
      const transitions = {
        pending: ["diterima", "ditolak"],
        diterima: ["dikerjakan"],
        dikerjakan: ["selesai"],
      };

      if (!transitions[currentStatus] || !transitions[currentStatus].includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Tidak bisa mengubah status dari "${currentStatus}" ke "${status}"`,
        });
      }

      db.query("UPDATE booking SET status = ? WHERE id = ?", [status, id], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: `Status berhasil diubah menjadi "${status}"` });
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── EARNINGS ───
exports.getEarnings = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);

    const [monthly, total, balance] = await Promise.all([
      new Promise((resolve, reject) => {
        db.query(
          `SELECT DATE_FORMAT(created_at, '%Y-%m') AS bulan, SUM(total) AS total
           FROM payment WHERE tukang_id = ? AND status = 'completed'
           AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
           GROUP BY bulan ORDER BY bulan ASC`,
          [tukangId],
          (err, r) => (err ? reject(err) : resolve(r))
        );
      }),
      new Promise((resolve, reject) => {
        db.query(
          "SELECT COALESCE(SUM(total),0) AS total_earnings FROM payment WHERE tukang_id = ? AND status = 'completed'",
          [tukangId],
          (err, r) => (err ? reject(err) : resolve(r[0]))
        );
      }),
      new Promise((resolve, reject) => {
        db.query(
          "SELECT COALESCE(SUM(CASE WHEN status='completed' THEN total ELSE 0 END),0) - COALESCE(SUM(CASE WHEN status='withdraw' THEN total ELSE 0 END),0) AS balance FROM payment WHERE tukang_id = ?",
          [tukangId],
          (err, r) => (err ? reject(err) : resolve(r[0]))
        );
      }),
    ]);

    // Transactions
    const transactions = await new Promise((resolve, reject) => {
      db.query(
        "SELECT p.*, b.nama_user FROM payment p LEFT JOIN (SELECT booking.id, users.nama AS nama_user FROM booking JOIN users ON users.id = booking.user_id) b ON b.id = p.booking_id WHERE p.tukang_id = ? ORDER BY p.created_at DESC LIMIT 20",
        [tukangId],
        (err, r) => (err ? reject(err) : resolve(r))
      );
    });

    res.json({
      success: true,
      data: {
        monthly,
        total_earnings: total.total_earnings,
        balance: balance.balance,
        transactions,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── SCHEDULE ───
exports.getSchedule = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    const { month, year } = req.query;
    const m = month || new Date().getMonth() + 1;
    const y = year || new Date().getFullYear();

    const firstDay = `${y}-${String(m).padStart(2, "0")}-01`;
    const lastDay = new Date(y, m, 0).toISOString().split("T")[0];

    db.query(
      `SELECT id, tanggal_booking, status, users.nama AS nama_user
       FROM booking JOIN users ON users.id = booking.user_id
       WHERE tukang_id = ? AND DATE(tanggal_booking) BETWEEN ? AND ?
       ORDER BY tanggal_booking ASC`,
      [tukangId, firstDay, lastDay],
      (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result });
      }
    );
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── TODAY'S SCHEDULE ───
exports.getTodaySchedule = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    const today = new Date().toISOString().split("T")[0];

    db.query(
      `SELECT booking.*, users.nama AS nama_user, booking.alamat AS alamat_user
       FROM booking JOIN users ON users.id = booking.user_id
       WHERE tukang_id = ? AND DATE(tanggal_booking) = ?
       ORDER BY tanggal_booking ASC`,
      [tukangId, today],
      (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result });
      }
    );
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PORTFOLIO ───
exports.getPortfolio = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    db.query("SELECT * FROM tukang_portfolio WHERE tukang_id = ? ORDER BY created_at DESC", [tukangId], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: result });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addPortfolio = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    const { caption } = req.body;
    const foto = req.file ? req.file.filename : null;

    if (!foto) return res.status(400).json({ success: false, message: "Foto wajib diupload" });

    db.query("INSERT INTO tukang_portfolio (tukang_id, foto, caption) VALUES (?, ?, ?)", [tukangId, foto, caption || null], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: "Portfolio berhasil ditambahkan" });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    db.query("DELETE FROM tukang_portfolio WHERE id = ? AND tukang_id = ?", [req.params.id, tukangId], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: "Portfolio berhasil dihapus" });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── BANK & WITHDRAW ───
exports.getBank = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    db.query("SELECT * FROM tukang_bank WHERE tukang_id = ?", [tukangId], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: result[0] || null });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveBank = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    const { bank_name, account_number, account_holder } = req.body;

    if (!bank_name || !account_number || !account_holder) {
      return res.status(400).json({ success: false, message: "Semua field bank wajib diisi" });
    }

    db.query(
      "INSERT INTO tukang_bank (tukang_id, bank_name, account_number, account_holder) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE bank_name = VALUES(bank_name), account_number = VALUES(account_number), account_holder = VALUES(account_holder)",
      [tukangId, bank_name, account_number, account_holder],
      (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Data bank berhasil disimpan" });
      }
    );
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.requestWithdraw = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    const { jumlah } = req.body;

    if (!jumlah || jumlah <= 0) {
      return res.status(400).json({ success: false, message: "Jumlah tidak valid" });
    }

    // Get bank info
    db.query("SELECT * FROM tukang_bank WHERE tukang_id = ?", [tukangId], (err, bank) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (!bank.length) return res.status(400).json({ success: false, message: "Silakan isi data bank terlebih dahulu" });

      db.query(
        "INSERT INTO withdraw_requests (tukang_id, jumlah, bank_name, account_number, account_holder) VALUES (?, ?, ?, ?, ?)",
        [tukangId, jumlah, bank[0].bank_name, bank[0].account_number, bank[0].account_holder],
        (err) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          res.json({ success: true, message: "Permintaan penarikan dana berhasil diajukan" });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getWithdrawHistory = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    db.query("SELECT * FROM withdraw_requests WHERE tukang_id = ? ORDER BY created_at DESC", [tukangId], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: result });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── REVIEWS ───
exports.getReviews = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    db.query(
      `SELECT reviews.*, users.nama AS nama_user
       FROM reviews JOIN users ON users.id = reviews.user_id
       WHERE reviews.tukang_id = ? ORDER BY reviews.created_at DESC`,
      [tukangId],
      (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result });
      }
    );
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── NOTIFICATIONS ───
exports.getNotifications = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    db.query(
      "SELECT * FROM notifications WHERE tukang_id = ? ORDER BY created_at DESC LIMIT 50",
      [tukangId],
      (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result });
      }
    );
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.readNotification = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    db.query("UPDATE notifications SET is_read = 1 WHERE id = ? AND tukang_id = ?", [req.params.id, tukangId], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: "Notifikasi dibaca" });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.readAllNotifications = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    db.query("UPDATE notifications SET is_read = 1 WHERE tukang_id = ?", [tukangId], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: "Semua notifikasi dibaca" });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── AVAILABILITY ───
exports.getAvailability = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    db.query("SELECT * FROM tukang_availability WHERE tukang_id = ?", [tukangId], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: result[0] || null });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveAvailability = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    const { is_online, jam_kerja, cuti } = req.body;

    // Upsert availability
    const jk = jam_kerja || {};
    db.query(
      `INSERT INTO tukang_availability (tukang_id, is_online, senin_mulai, senin_selesai, selasa_mulai, selasa_selesai, rabu_mulai, rabu_selesai, kamis_mulai, kamis_selesai, jumat_mulai, jumat_selesai, sabtu_mulai, sabtu_selesai, minggu_mulai, minggu_selesai)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       is_online = VALUES(is_online),
       senin_mulai = VALUES(senin_mulai), senin_selesai = VALUES(senin_selesai),
       selasa_mulai = VALUES(selasa_mulai), selasa_selesai = VALUES(selasa_selesai),
       rabu_mulai = VALUES(rabu_mulai), rabu_selesai = VALUES(rabu_selesai),
       kamis_mulai = VALUES(kamis_mulai), kamis_selesai = VALUES(kamis_selesai),
       jumat_mulai = VALUES(jumat_mulai), jumat_selesai = VALUES(jumat_selesai),
       sabtu_mulai = VALUES(sabtu_mulai), sabtu_selesai = VALUES(sabtu_selesai),
       minggu_mulai = VALUES(minggu_mulai), minggu_selesai = VALUES(minggu_selesai)`,
      [
        tukangId, is_online !== undefined ? (is_online ? 1 : 0) : 1,
        jk.senin_mulai || "08:00", jk.senin_selesai || "17:00",
        jk.selasa_mulai || "08:00", jk.selasa_selesai || "17:00",
        jk.rabu_mulai || "08:00", jk.rabu_selesai || "17:00",
        jk.kamis_mulai || "08:00", jk.kamis_selesai || "17:00",
        jk.jumat_mulai || "08:00", jk.jumat_selesai || "16:00",
        jk.sabtu_mulai || "08:00", jk.sabtu_selesai || "14:00",
        jk.minggu_mulai || null, jk.minggu_selesai || null,
      ],
      (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        // Handle leave requests
        if (cuti && Array.isArray(cuti)) {
          cuti.forEach((c) => {
            if (c.tanggal_mulai && c.tanggal_selesai) {
              db.query(
                "INSERT INTO tukang_leave (tukang_id, tanggal_mulai, tanggal_selesai, alasan, status) VALUES (?, ?, ?, ?, 'approved')",
                [tukangId, c.tanggal_mulai, c.tanggal_selesai, c.alasan || "Cuti"]
              );
            }
          });
        }

        res.json({ success: true, message: "Pengaturan ketersediaan berhasil disimpan" });
      }
    );
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLeaves = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    db.query("SELECT * FROM tukang_leave WHERE tukang_id = ? ORDER BY tanggal_mulai DESC", [tukangId], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: result });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PROFILE ───
exports.getProfile = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    db.query(
      `SELECT tukang.*, users.nama, users.email, users.role, kategori.nama_kategori
       FROM tukang
       JOIN users ON users.id = tukang.user_id
       JOIN kategori ON kategori.id = tukang.kategori_id
       WHERE tukang.id = ?`,
      [tukangId],
      (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: result[0] });
      }
    );
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const tukangId = await getTukangId(req.user.id);
    const { nama, telepon, alamat, deskripsi, pengalaman } = req.body;

    db.query(
      "UPDATE tukang SET telepon = ?, alamat = ?, deskripsi = ?, pengalaman = ? WHERE id = ?",
      [telepon || null, alamat || null, deskripsi || null, pengalaman || 0, tukangId],
      (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        if (nama) {
          db.query("UPDATE users SET nama = ? WHERE id = ?", [nama, req.user.id], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: "Profil berhasil diperbarui" });
          });
        } else {
          res.json({ success: true, message: "Profil berhasil diperbarui" });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── TIPS ───
exports.getTips = async (req, res) => {
  const tips = [
    { icon: "💡", title: "Respon Cepat", description: "Respon pesanan masuk dalam waktu 1 jam untuk meningkatkan kepercayaan pelanggan." },
    { icon: "⭐", title: "Jaga Rating", description: "Rating di atas 4.5 akan membuat Anda lebih sering muncul di pencarian." },
    { icon: "📸", title: "Portfolio Menarik", description: "Upload foto hasil kerja terbaik untuk menarik lebih banyak pelanggan." },
    { icon: "💰", title: "Harga Kompetitif", description: "Sesuaikan harga dengan standar pasar di wilayah Anda." },
    { icon: "🕐", title: "Tepat Waktu", description: "Datang tepat waktu sesuai jadwal untuk mendapatkan review positif." },
    { icon: "📱", title: "Aktif di Aplikasi", description: "Selalu online dan cek notifikasi agar tidak ketinggalan order." },
  ];
  res.json({ success: true, data: tips });
};
