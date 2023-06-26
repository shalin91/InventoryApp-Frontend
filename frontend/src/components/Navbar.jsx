import React, { useEffect, useState } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import FlexBetween from "./FLexBetween";
import { useDispatch } from "react-redux";
import { setMode } from "state";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import profileImage from "../assets/default-avatar.png";
import { useContext } from "react";
import SignContext from "contextApi/Context/SignContext";

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const url = `${process.env.REACT_APP_BASE_URL}`;

  const { getLoggedInUser } = useContext(SignContext);
  const navigate = useNavigate();
  const [UserInfo, setUserInfo] = useState({});

  const disPatch = useDispatch();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    setAnchorEl(null);
    window.localStorage.removeItem("loggedIn");
    window.localStorage.removeItem("token");
    navigate("/login");
  };

  const getloggedinUser = async (token) => {
    const res = await getLoggedInUser(token);
    if (res.success) {
      setUserInfo(res);
    } else {
      console.log(res.msg);
    }
  };

  useEffect(() => {
    const authToken = window.localStorage.getItem("authToken");
    getloggedinUser(authToken);
  }, []);

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/*LEFT SIDE*/}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          <FlexBetween
            borderRadius="9px"
            backgroundColor={theme.palette.background.alt}
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search.." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <IconButton onClick={() => disPatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>

          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              <Box
                component="img"
                src={`${url}/${UserInfo.photo}`}
                alt=""
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {UserInfo.name}
                </Typography>
                <Typography
                  fontSize="0.75rem"
                  sx={{ color: theme.palette.secondary[200] }}
                ></Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <NavLink
                to={`/editprofile/${UserInfo._id}`}
                style={{ textDecoration: "none", color: theme.palette.secondary[100] }}
              >
                <MenuItem>Edit Profile</MenuItem>
              </NavLink>
              <NavLink
                to="/changepassword"
                style={{ textDecoration: "none", color: theme.palette.secondary[100] }}
              >
                <MenuItem onClick={handleClose}>Change Password</MenuItem>
              </NavLink>
              <p to="/login" style={{ textDecoration: "none", color: theme.palette.secondary[100] }}>
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
              </p>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
