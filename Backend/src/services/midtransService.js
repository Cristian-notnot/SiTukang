const midtransClient = require("midtrans-client");

let snap = null;
let core = null;

const initMidtrans = () => {
    if (snap) return { snap, core };

    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

    snap = new midtransClient.Snap({
        isProduction,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    core = new midtransClient.CoreApi({
        isProduction,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    return { snap, core };
};

const createTransaction = async ({ invoiceNumber, amount, user, booking }) => {
    const { snap } = initMidtrans();

    const parameter = {
        transaction_details: {
            order_id: invoiceNumber,
            gross_amount: Number(amount),
        },
        credit_card: {
            secure: true,
        },
        customer_details: {
            first_name: user.nama || "Customer",
            email: user.email || "",
            phone: user.telepon || "",
        },
        item_details: [
            {
                id: `BOOKING-${booking.id}`,
                price: Number(amount),
                quantity: 1,
                name: `Jasa Tukang - ${booking.nama_kategori || "Service"}`,
            },
        ],
        callbacks: {
            finish: `${process.env.FRONTEND_URL || "http://localhost:5173"}/user/payment/finish?invoice=${invoiceNumber}`,
            error: `${process.env.FRONTEND_URL || "http://localhost:5173"}/user/payment/error?invoice=${invoiceNumber}`,
            pending: `${process.env.FRONTEND_URL || "http://localhost:5173"}/user/payment/pending?invoice=${invoiceNumber}`,
        },
    };

    const transaction = await snap.createTransaction(parameter);

    return {
        snapToken: transaction.token,
        snapRedirectUrl: transaction.redirect_url,
    };
};

const verifyTransaction = async (orderId) => {
    const { core } = initMidtrans();
    const status = await core.transaction.status(orderId);
    return status;
};

const handleWebhookNotification = (notificationJson) => {
    initMidtrans();

    const statusResponse = {};
    statusResponse.orderId = notificationJson.order_id;
    statusResponse.statusCode = notificationJson.status_code;
    statusResponse.transactionStatus = notificationJson.transaction_status;
    statusResponse.fraudStatus = notificationJson.fraud_status;
    statusResponse.paymentType = notificationJson.payment_type;
    statusResponse.transactionId = notificationJson.transaction_id;
    statusResponse.transactionTime = notificationJson.transaction_time;
    statusResponse.grossAmount = notificationJson.gross_amount;
    statusResponse.signatureKey = notificationJson.signature_key;

    return statusResponse;
};

const verifySignatureKey = (notificationJson) => {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const orderId = notificationJson.order_id;
    const statusCode = notificationJson.status_code;
    const grossAmount = notificationJson.gross_amount;
    const signatureKey = notificationJson.signature_key;

    const hash = require("crypto")
        .createHash("sha512")
        .update(orderId + statusCode + grossAmount + serverKey)
        .digest("hex");

    return hash === signatureKey;
};

const mapTransactionStatus = (transactionStatus, fraudStatus) => {
    if (transactionStatus === "capture") {
        if (fraudStatus === "accept") return "paid";
        return "failed";
    }
    if (transactionStatus === "settlement") return "paid";
    if (transactionStatus === "pending") return "pending";
    if (transactionStatus === "deny") return "failed";
    if (transactionStatus === "cancel") return "failed";
    if (transactionStatus === "expire") return "expired";
    if (transactionStatus === "refund") return "refund";
    if (transactionStatus === "partial_refund") return "refund";
    return "pending";
};

module.exports = {
    createTransaction,
    verifyTransaction,
    handleWebhookNotification,
    verifySignatureKey,
    mapTransactionStatus,
};
