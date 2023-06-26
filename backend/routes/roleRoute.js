const express = require("express");
const { addRole } = require("../controllers/rolesController");
const router = express.Router();


// Routes
router.post("/addrole" , addRole);






module.exports = router;


