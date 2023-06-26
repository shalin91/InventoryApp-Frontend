const express = require("express");
const { registerUser, loginUser, logout, getLoggedInUser, loginStatus, updateUser, updatePassword, forgotPassword, resetPassword, getUsers, DeleteUser, getSpecificUser, getRoles } = require("../controllers/userController");
const cookieParser = require("cookie-parser");
const protect = require("../middlewares/authMiddleware");
const router = express.Router();
const upload = require("../middlewares/multerMiddleware");
// const upload = multer({ dest: 'uploads/' })

router.use(cookieParser());

router.post("/register" , registerUser);
router.post("/login" , loginUser);
router.get("/logout" , logout);
router.post("/getloggedinuser",protect, getLoggedInUser);
router.post("/getspecificuser", getSpecificUser);
router.get("/loggedin", loginStatus);
router.post("/updateuser" , upload.single('profilePhoto') ,updateUser);
router.post("/updatepassword", protect, updatePassword);
router.post("/forgotpassword",forgotPassword);
router.put("/resetpassword/:resetToken",resetPassword
);
router.get("/getusers",getUsers);
router.post("/deleteuser",DeleteUser);
router.get("/getroles",getRoles);




module.exports = router;