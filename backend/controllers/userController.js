const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const Role = require("../models/Roles");


const app = express();
app.use(cookieParser());

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//  Register User

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password,confirmPassword  , role } = req.body;
  console.log(req.body)
  //Validation
  if (!name || !email || !password) {
    return res
      // .status(400)
      .json({ success: false, msg: "Please fill all required fields" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, msg: "Passwords doesn't match"});
  }

  if (password.length < 6) {
    return res
      // .status(400)
      .json({ success: false, msg: "Password must be upto 6 characters" });
  }

  //If the user email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.json({
      success: false,
      msg: "This email already exist,Please enter a new email",
    });
  }

  //   Encrypt password before saving to DB
  //   const salt = await bcrypt.genSalt(10);
  //   const secPass = await bcrypt.hash(password , salt);

  const defaultRole = "User";

  //Create a user
  const user = await User.create({
    name,
    email,
    password,
    roles: role ? [role] : [defaultRole],
    // password : secPass
  });

  //   Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  // User's permissions
  const userRole = role ? role : defaultRole;
  // Fetch the user's assigned role and its associated permissions
  const userPermissions = await Role.findOne({ role: userRole });
  console.log(userPermissions);
  let permissions = [];
  if (userPermissions) {
    // Add the default permissions
    

    // Add the user's assigned role permissions
    permissions = permissions.concat(userPermissions.permissions);
  }
  console.log(permissions);

  if (user) {
    return res.status(201).json({
      success: true,
      msg : "Succesfully Registered",
      _id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      permissions : permissions,
      token,
    });
  } else {
    return res.status(400).json({ success: false, msg: "Invalid user data" });
  }
});

// Login User

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    res.send({ success: false, msg: "Please fill all required fields" });
  }

  // Check user exist
  const user = await User.findOne({ email });

  if (!user) {
    res.send({ success: false, msg: "User not found , Please signup" });
  }

  // User exist , check the password is correct
  const passwordIscorrect = await bcrypt.compare(password, user.password);

  //   Generate Token
  const token = generateToken(user._id);

  // Fetch user's permissions
  const roles = await Role.findOne({ role: user.roles[0] });
  // console.log(permissions);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user && passwordIscorrect) {
    // const { _id, name, email, photo } = user;
    res.status(200).json({
      success: true,
      msg : "Successfully LoggedIn",
      token,
      roles,
    });
  } else {
    res.send({ success: false, msg: "Invalid user data" });
  }
});

// Logout User
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // 1 day
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({
    message: "Successfully logged out",
  });
});

// Get User Data
const getLoggedInUser = asyncHandler(async (req, res) => {
  let userId = req.body.id;
  console.log(userId)
  const user = await User.findById(userId);

  if (user) {
    const { _id, name, email, photo, password } = user;
    res.status(200).json({
      success: true,
      _id,
      name,
      email,
      photo,
      password,
    });
  } else {
    res.status(404).send({ success: false, msg: "User not found" });
  }
});

const getSpecificUser = asyncHandler(async (req, res) => {
  let userId = req.body.id;
  const user = await User.findById(userId);
  console.log(user);
  if (user) {
    const { _id, name, email, photo , roles } = user;
    res.status(200).send({
      success: true,
      _id,
      name,
      email,
      photo,
      roles,
    });
  } else {
    res.status(404).send({ success: false, msg: "User not found" });
  }
});

//   Get login Status

const loginStatus = asyncHandler(async (req, res) => {
  const token = req.body.token;
  console.log(token);
  if (!token) {
    return res.json(false);
  }

  // Verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  } else {
    return res.json(false);
  }
});

//  Update User

const updateUser = asyncHandler(async (req, res) => {
  if (req.body.id) {
    const { id, name, roles } = req.body;
    const photo = req.file ? req.file.path : "uploads/wallpaper1.jpg";   // Get the path of the uploaded file

    await User.findByIdAndUpdate(id, {
      name: name,
      roles: roles,
      photo: photo,
    });

    res.status(200).send({
      success: true,
      msg: "User updated",
    });
  } else {
    res.status(400).send({
      success: false,
      msg: "User not found",
    });
  }
});

// Update Password
const updatePassword = asyncHandler(async (req, res) => {
  console.log(req.body);
  const user = await User.findById(req.body.id);
  const { oldPassword, newPassword, id } = req.body;
  if (!user) {
    res
      .status(400)
      .send({ success: false, msg: "User not found , Please signup" });
  }
  // Validate
  if (!oldPassword || !newPassword) {
    res.status(400).send({success : false , msg : "Please add old and new password"});
  }

  // check if old password matches password in DB
  const passwordIsOldPass = await bcrypt.compare(newPassword, user.password);
  console.log(user && passwordIsOldPass, passwordIsOldPass);

  // Save new password

  if (user && passwordIsOldPass) {
    res.send({
      success: false,
      msg: "New Password cannot be same as Old password",
    });
  } else {
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(newPassword, salt);
    await User.findByIdAndUpdate(id, {
      password: secPass,
    });
    res
      .status(200)
      .send({ success: true, msg: "Password changed successfully" });
  }
});

// Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  let { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.send({ success: false, msg: "User does not exist" });
  }
  // Delete Token if it exist in DB
  await Token.findOneAndDelete({ userId: user.id });

  // Create Rest Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);

  // Hash token before saving to db
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // /Save token to DB
  await new Token({
    userId: user.id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), //30 Minutes
  }).save();

  // Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/reset/${resetToken}`;

  // Reset Email
  const message = `
  <h2>Hello ${user.name}</h2>
  <p>Please use this URL below to reset your password</p>
  <p>This reset link is valid for 30 Minutes</p>


  <a href=${resetUrl} clicktraking = off> ${resetUrl}</a>

  <p>Regards .... </p>
  `;
  const subject = "Password reset request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).send({ success: true, msg: "Reset Email Sent" });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // Hash token  then compare to Token in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Find Token in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404).send("Invalid or Expired Token");
  }

  // Find User
  const user = await User.findOne({ _id: userToken.userId });
  user.password = password;
  console.log(user);
  user.save();

  res.status(200).send({
    success: true,
    msg: "Password Reset Successful,Please Login",
  });
});

// Get User
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().exec();
  if (users) {
    res.status(200).json({ users });
  } else {
    res.status(404).send({ success: false, msg: "User not found" });
  }
});

const DeleteUser = asyncHandler(async (req, res) => {
  const id = req.body.id;
  const users = await User.findByIdAndRemove(id);
  if (users) {
    res.status(200).send({ success: true, msg: "User Deleted Successfully" });
  } else {
    res.status(404).send({ success: false, msg: "User not found" });
  }
});

const getRoles = asyncHandler(async (req, res) => {
  try {
    const roles = await Role.find().exec();
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  getLoggedInUser,
  loginStatus,
  updateUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  getUsers,
  DeleteUser,
  getSpecificUser,
  getRoles,
};
