const db = require("../config/db");
const midtransService = require("../services/midtransService");

const generateInvoiceNumber = () => {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `INV-${y}${m}${d}-${rand}`;
};

exports.createPayment = (req, res) => {
    const { booking_id } = req.body;
    const userId = req.user.id;

    if (!booking_id) {
        return res.status(400).json({ success: false, message: "booking_id wajib diisi" });
    }

    const getBookingSql = `
        SELECT
            booking.*,
            users.nama AS nama_user,
            users.email AS email_user,
            tukang.telepon AS telepon_tukang,
            kategori.nama_kategori
        FROM booking
        JOIN users ON booking.user_id = users.id
        JOIN tukang ON booking.tukang_id = tukang.id
        JOIN kategori ON tukang.kategori_id = kategori.id
        WHERE booking.id = ? AND booking.user_id = ?
    `;

    db.query(getBookingSql, [booking_id, userId], (err, bookingResult) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        if (bookingResult.length === 0) {
            return res.status(404).json({ success: false, message: "Booking tidak ditemukan" });
        }

        const booking = bookingResult[0];

        if (booking.status !== "waiting_payment") {
            return res.status(400).json({
                success: false,
                message: "Status booking harus 'waiting_payment' untuk melakukan pembayaran",
            });
        }

        const existingPaymentSql = "SELECT * FROM payments WHERE booking_id = ? AND payment_status = 'pending'";
        db.query(existingPaymentSql, [booking_id], async (err, existingPayments) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }

            if (existingPayments.length > 0) {
                const existing = existingPayments[0];
                return res.json({
                    success: true,
                    message: "Pembayaran sudah pernah dibuat",
                    data: {
                        id: existing.id,
                        invoice_number: existing.invoice_number,
                        snap_token: existing.snap_token,
                        snap_redirect_url: existing.snap_redirect_url,
                        payment_status: existing.payment_status,
                        amount: existing.amount,
                    },
                });
            }

            const invoiceNumber = generateInvoiceNumber();
            const amount = 150000;

            try {
                const userData = {
                    nama: booking.nama_user,
                    email: booking.email_user,
                    telepon: booking.telepon_tukang,
                };

                const transaction = await midtransService.createTransaction({
                    invoiceNumber,
                    amount,
                    user: userData,
                    booking: {
                        id: booking.id,
                        nama_kategori: booking.nama_kategori,
                    },
                });

                const insertPaymentSql = `
                    INSERT INTO payments (booking_id, user_id, invoice_number, amount, payment_status, snap_token, snap_redirect_url)
                    VALUES (?, ?, ?, ?, 'pending', ?, ?)
                `;

                db.query(
                    insertPaymentSql,
                    [booking_id, userId, invoiceNumber, amount, transaction.snapToken, transaction.snapRedirectUrl],
                    (err, paymentResult) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: err.message });
                        }

                        res.status(201).json({
                            success: true,
                            message: "Pembayaran berhasil dibuat",
                            data: {
                                id: paymentResult.insertId,
                                invoice_number: invoiceNumber,
                                snap_token: transaction.snapToken,
                                snap_redirect_url: transaction.snapRedirectUrl,
                                payment_status: "pending",
                                amount,
                            },
                        });
                    }
                );
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Gagal membuat transaksi pembayaran: " + error.message,
                });
            }
        });
    });
};

// ─── Legacy Wallet API (backward compatibility) ───

// ─── Legacy Wallet API (backward compatibility) ───

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

        const doInsert = () => {
            db.query(
                "INSERT INTO payment_methods (user_id, tipe, nama_bank, nomor_rekening, nama_pemilik, is_default) VALUES (?, ?, ?, ?, ?, ?)",
                [userId, tipe, nama_bank || null, nomor_rekening, nama_pemilik, is_default ? 1 : 0],
                (err, result) => {
                    if (err) return res.status(500).json({ success: false, message: err.message });
                    res.status(201).json({ success: true, message: "Metode pembayaran berhasil ditambahkan", id: result.insertId });
                }
            );
        };

        if (is_default) {
            db.query(
                "UPDATE payment_methods SET is_default = 0 WHERE user_id = ?",
                [userId],
                (err) => {
                    if (err) return res.status(500).json({ success: false, message: err.message });
                    doInsert();
                }
            );
        } else {
            doInsert();
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

exports.getPaymentByBooking = (req, res) => {
    const bookingId = req.params.bookingId;
    const userId = req.user.id;

    const sql = `
        SELECT id, booking_id, invoice_number, amount, payment_status,
               payment_method, payment_channel, transaction_id,
               transaction_time, snap_token, snap_redirect_url,
               created_at, updated_at
        FROM payments
        WHERE booking_id = ? AND user_id = ?
        ORDER BY created_at DESC
        LIMIT 1
    `;

    db.query(sql, [bookingId, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Pembayaran tidak ditemukan" });
        }
        res.json({ success: true, data: result[0] });
    });
};

exports.getPaymentByInvoice = (req, res) => {
    const invoiceNumber = req.params.invoiceNumber;
    const userId = req.user.id;

    const sql = `
        SELECT
            p.*,
            booking.tukang_id,
            booking.tanggal_booking,
            booking.alamat,
            booking.keluhan,
            booking.status AS booking_status,
            users.nama AS nama_user,
            tukang_user.nama AS nama_tukang,
            kategori.nama_kategori
        FROM payments p
        JOIN booking ON p.booking_id = booking.id
        JOIN users ON p.user_id = users.id
        JOIN tukang ON booking.tukang_id = tukang.id
        JOIN users AS tukang_user ON tukang.user_id = tukang_user.id
        JOIN kategori ON tukang.kategori_id = kategori.id
        WHERE p.invoice_number = ? AND p.user_id = ?
    `;

    db.query(sql, [invoiceNumber, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Invoice tidak ditemukan" });
        }

        let paymentDetails = result[0].payment_details;
        if (paymentDetails && typeof paymentDetails === "string") {
            try {
                paymentDetails = JSON.parse(paymentDetails);
            } catch (e) {
                paymentDetails = null;
            }
        }

        res.json({
            success: true,
            data: { ...result[0], payment_details: paymentDetails },
        });
    });
};

exports.getMyPayments = (req, res) => {
    const userId = req.user.id;
    const { status, limit = 20, offset = 0 } = req.query;

    let sql = `
        SELECT
            p.id, p.invoice_number, p.amount, p.payment_status,
            p.payment_method, p.payment_channel, p.transaction_id,
            p.transaction_time, p.created_at,
            booking.id AS booking_id,
            booking.status AS booking_status,
            users.nama AS nama_tukang,
            kategori.nama_kategori
        FROM payments p
        JOIN booking ON p.booking_id = booking.id
        JOIN users ON booking.tukang_id = (SELECT id FROM tukang WHERE id = booking.tukang_id)
        JOIN tukang ON booking.tukang_id = tukang.id
        JOIN users AS tukang_user ON tukang.user_id = tukang_user.id
        JOIN kategori ON tukang.kategori_id = kategori.id
        WHERE p.user_id = ?
    `;
    const params = [userId];

    if (status) {
        sql += " AND p.payment_status = ?";
        params.push(status);
    }

    sql += " ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    db.query(sql, params, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        db.query(
            "SELECT COUNT(*) AS total FROM payments WHERE user_id = ?",
            [userId],
            (err, countResult) => {
                if (err) {
                    return res.status(500).json({ success: false, message: err.message });
                }
                res.json({
                    success: true,
                    total: countResult[0].total,
                    data: result.map((row) => ({
                        ...row,
                        nama_tukang: row.nama_tukang,
                    })),
                });
            }
        );
    });
};

exports.getAllPayments = (req, res) => {
    const { status, limit = 50, offset = 0 } = req.query;

    let sql = `
        SELECT
            p.*,
            booking.tanggal_booking,
            users.nama AS nama_user,
            tukang_user.nama AS nama_tukang
        FROM payments p
        JOIN booking ON p.booking_id = booking.id
        JOIN users ON p.user_id = users.id
        JOIN tukang ON booking.tukang_id = tukang.id
        JOIN users AS tukang_user ON tukang.user_id = tukang_user.id
    `;
    const params = [];

    if (status) {
        sql += " WHERE p.payment_status = ?";
        params.push(status);
    }

    sql += " ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    db.query(sql, params, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        db.query("SELECT COUNT(*) AS total FROM payments", (err, countResult) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }
            res.json({
                success: true,
                total: countResult[0].total,
                data: result,
            });
        });
    });
};

exports.handleMidtransWebhook = (req, res) => {
    const notification = req.body;

    if (!notification || !notification.order_id) {
        return res.status(400).json({ success: false, message: "Invalid notification" });
    }

    const isValid = midtransService.verifySignatureKey(notification);
    if (!isValid) {
        return res.status(403).json({ success: false, message: "Invalid signature" });
    }

    const invoiceNumber = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;
    const paymentType = notification.payment_type;
    const transactionId = notification.transaction_id;
    const transactionTime = notification.transaction_time;
    const grossAmount = notification.gross_amount;

    const paymentStatus = midtransService.mapTransactionStatus(transactionStatus, fraudStatus);

    const getPaymentSql = "SELECT * FROM payments WHERE invoice_number = ?";
    db.query(getPaymentSql, [invoiceNumber], (err, paymentResult) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        if (paymentResult.length === 0) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        const payment = paymentResult[0];

        if (payment.payment_status === "paid") {
            return res.json({ success: true, message: "Payment already processed" });
        }

        const paymentDetails = {
            transaction_status,
            fraud_status,
            payment_type: paymentType,
            transaction_id: transactionId,
            transaction_time: transactionTime,
            gross_amount: grossAmount,
            raw: notification,
        };

        const updatePaymentSql = `
            UPDATE payments
            SET payment_status = ?,
                payment_method = ?,
                payment_channel = ?,
                transaction_id = ?,
                transaction_time = ?,
                payment_details = ?
            WHERE invoice_number = ?
        `;

        const paymentChannel = notification.va_numbers
            ? notification.va_numbers[0]?.bank
            : notification.payment_code
            ? "permata"
            : notification.issuer
            ? notification.issuer
            : paymentType;

        db.query(
            updatePaymentSql,
            [
                paymentStatus,
                paymentType,
                paymentChannel,
                transactionId,
                transactionTime,
                JSON.stringify(paymentDetails),
                invoiceNumber,
            ],
            (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: err.message });
                }

                if (paymentStatus === "paid") {
                    const updateBookingSql = "UPDATE booking SET status = 'paid' WHERE id = ?";
                    db.query(updateBookingSql, [payment.booking_id], (err) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: err.message });
                        }
                        res.json({ success: true, message: "Payment and booking updated" });
                    });
                } else {
                    res.json({ success: true, message: "Payment status updated" });
                }
            }
        );
    });
};
