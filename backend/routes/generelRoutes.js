const express = require("express");
const getUsernew = require("../controllers/generelController");


const router = express.Router();

router.get("/user/:id", getUsernew);

module.exports = router;