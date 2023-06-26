import React, { useState } from "react";
import "./Profile.css";
import { Card } from "@mui/material";
import { useContext } from "react";
import SignContext from "contextApi/Context/SignContext";
import { useNavigate } from "react-router-dom";
// import profileImage from "../../assets/default-avatar.png";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const ChangePassword = () => {
  const { changePassword } = useContext(SignContext);
  const navigate = useNavigate();
  const [UserInfo, setUserInfo] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [Error, setError] = useState("");
  const [Success, setSuccess] = useState("");

  const handleChange = (e) => {
    setUserInfo({ ...UserInfo, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = window.localStorage.getItem('authToken')
    const res = await changePassword(UserInfo,token);
    console.log(res);
    if (res.success) {
      setTimeout(() => {
        setSuccess(res.msg)
      }, 1000);
      navigate("/login");
    } else {
      setError(res.msg);
      setTimeout(() => {
        setError("");
      }, 1000);
    }
  };

  return (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <div className="profile-body">
        <Stack spacing={2}>
        {Error && <Alert severity="error">{Error}</Alert>}
        {Success && <Alert severity="success">{Success}</Alert>}
          <form onSubmit={(e) => handleSubmit(e)}>
        <Card style={{ padding: "20px" , backgroundColor: "#ffe3a3"}}>
            <div className="mb-3 text-dark">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Current Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword0"
                placeholder="Current Password"
                name="oldPassword"
                value={UserInfo.oldPassword}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
            <div className="mb-3 text-dark">
              <label htmlFor="exampleInputPassword1" className="form-label">
                New Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="New Password"
                name="newPassword"
                value={UserInfo.newPassword}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
            {/* <div className="mb-3 text-dark">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword2"
                placeholder="Confirm New Password"
                name="confirmPassword"
                value={UserInfo.confirmPassword}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div> */}
            <div className="d-flex justify-content-center align-items-center mt-3 text-dark">
              <button type="submit" className="btn btn-primary mb-3" style={{border : "none"}}>
                Change
              </button>
            </div>
        </Card>
          </form>
        </Stack>
      </div>
    </div>
  );
};

export default ChangePassword;
