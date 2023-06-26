import React, { useContext , useState } from 'react'
import "./authStyle.css";
import { Card } from '@mui/material';
import SignContext from 'contextApi/Context/SignContext';
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const Forgot = () => {
  const { forgotPassword } = useContext(SignContext);
  const [UserInfo, setUserInfo] = useState({
    email: ""
  });
  const [Error, setError] = useState("");
  const [Success, setSuccess] = useState("");

  const handleChange = (e) => {
    setUserInfo({ ...UserInfo, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await forgotPassword(UserInfo);
    if(res.success){
      setSuccess(res.msg);
        setTimeout(() => {
          setSuccess("");
        }, 1000);
    }else{
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
      <Card style={{padding: "20px",backgroundColor: "#ffe3a3"}}>
        <div className="form-group">
          <h4 className='text-center mb-3'>Fogot Password</h4>
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
        <div className="forgot-btn d-flex justify-content-center mt-3">
          <button type="submit" className="btn">
            Get Reset Email
          </button>
        </div>
        </Card>
      </form>
      </Stack>
    </div>
  </div>
  )
}

export default Forgot;