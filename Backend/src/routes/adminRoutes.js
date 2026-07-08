const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {

    getPendingTukang,
    approveTukang,
    rejectTukang

} = require("../controllers/adminController");

router.get(

    "/tukang/pending",

    verifyToken,

    roleMiddleware("admin"),

    getPendingTukang

);

router.put(

    "/tukang/:id/approve",

    verifyToken,

    roleMiddleware("admin"),

    approveTukang

);

router.put(

    "/tukang/:id/reject",

    verifyToken,

    roleMiddleware("admin"),

    rejectTukang

);

module.exports = router;