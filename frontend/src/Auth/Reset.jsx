import React, {useContext, useState } from "react";
import "./authStyle.css";
import { Card } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import SignContext from "contextApi/Context/SignContext";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const Reset = () => {
  const { resetPassword } = useContext(SignContext);
  const navigate = useNavigate();
  const [UserInfo, setUserInfo] = useState({
    password: "",
    password2: "",
  });
  const { resetToken } = useParams();
  const [Error, setError] = useState("");
  const [Success, setSuccess] = useState("");


  const handleChange = (e) => {
    setUserInfo({ ...UserInfo, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await resetPassword(resetToken,UserInfo.password);
    
    if (res.success) {
      setSuccess(res.msg)
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(res.msg);
      setTimeout(() => {
        setError("");
      }, 1000);
    }
  };

  return (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <div className="register-body">
        <Stack spacing={2}>
        {Error && <Alert severity="error">{Error}</Alert>}
        {Success && <Alert severity="success">{Success}</Alert>}
        <form onSubmit={(e) => handleSubmit(e)}>
          <Card style={{ padding: "20px", backgroundColor: "#ffe3a3" }}>
            <div className="form-group">
              <h4 className="text-center mb-3">Reset Password </h4>
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
            {/* <div className="form-group mt-3">
              <input
                type="password"
                className="form-control mt-2"
                id="exampleInputPassword2"
                placeholder="Re-type Password"
                name="password2"
                value={UserInfo.password2}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div> */}
            <div className="submit-btn d-flex justify-content-center mt-3">
              <button type="submit" className="btn">
                Reset Password
              </button>
            </div>
          </Card>
        </form>
        </Stack>
      </div>
    </div>
  );
};

export default Reset;
