import React, { useContext } from "react";
import "./authStyle.css";
import { NavLink, useNavigate } from "react-router-dom";
import { Card } from "@mui/material";
import SignContext from "contextApi/Context/SignContext";
import { useState } from "react";
// import { GoogleLogin } from "@react-oauth/google";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const Login = () => {
  const { loginUser } = useContext(SignContext);
  const navigate = useNavigate();
  const [UserInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserInfo({ ...UserInfo, [e.target.name]: e.target.value });
  };

  const [Error, setError] = useState("");
  const [Success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(UserInfo);
    if (res.success) {
      window.localStorage.setItem('loggedIn',true)
      window.localStorage.setItem('authToken',res.token)
      window.localStorage.setItem('user',JSON.stringify(res));
      window.localStorage.setItem('rights',JSON.stringify(res.roles));
      if(res.roles.role === "Admin"){
        setSuccess(res.msg);
        setTimeout(() => {
          navigate("/users");
        }, 1000);
      } else{
        setSuccess(res.msg);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } else {
      setError(res.msg);
      setTimeout(() => {
        setError("");
      }, 1000);
    }
  };

  return (
    <>
      <div className="h-100 d-flex justify-content-center align-items-center">
        <div className="register-body">
          <Stack spacing={2}>
        {Error && <Alert severity="error">{Error}</Alert>}
        {Success && <Alert severity="success">{Success}</Alert>}
          <form onSubmit={(e) => handleSubmit(e)}>
            <Card style={{ padding: "20px", backgroundColor: "#ffe3a3" }}>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input
                  type="text"
                  className="form-control mt-2"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter Email"
                  name="email"
                  value={UserInfo.email}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
              </div>
              <div className="form-group mt-2">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input
                  type="password"
                  className="form-control mt-2"
                  id="exampleInputPassword1"
                  placeholder="Password"
                  name="password"
                  value={UserInfo.password}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
              </div>
              <div className="submit-btn d-flex justify-content-center mt-3">
                <button type="submit" className="btn">
                  Login
                </button>
              </div>
              <div className="forgot mt-2">
                <NavLink className="pwdlink" to="/forgot">
                  Forgot Password ?
                </NavLink>
              </div>
            </Card>
            {/* <div className="helper mt-2">
              don't have an account?
              <NavLink to="/register"> Register now</NavLink>
            </div> */}
          </form>
          </Stack>
        </div>
      </div>
    </>
  );
};

export default Login;
