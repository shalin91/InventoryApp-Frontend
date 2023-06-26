import React, { useEffect, useState } from "react";
import "./authStyle.css";
import { Card } from "@mui/material";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import SignContext from "contextApi/Context/SignContext";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const Register = (props) => {
  const { id } = useParams();
  const { registerUser, getSpecificUser } = useContext(SignContext);
  const [Error, setError] = useState("");
  const [Success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [UserInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e) => {
    setUserInfo({ ...UserInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.nativeEvent.submitter.name === "back") {
      // Handle back button click
      navigate("/users");
    } else {
      const res = await registerUser(UserInfo);
      console.log(res);
      if (res.success) {
        setSuccess(props.createUser ? "Successfully Created" : res.msg);
        setTimeout(() => {
          navigate(`/${props.navigate}`);
        }, 1000);
      } else {
        setError(res.msg);
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    }
  };


  // const helper = () => {
  //   if (props.register) {
  //     return (
  //       <div className="helper mt-2">
  //         Already have an account?<NavLink to="/login"> login</NavLink>
  //       </div>
  //     );
  //   }
  // };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{overflow : "hidden" , marginTop : "7rem"}}>
      <div className="register-body" style={{ overflow: "auto" , height : "100%" }}>
        <Stack spacing={2}>
          {Error && <Alert severity="error">{Error}</Alert>}
          {Success && <Alert severity="success">{Success}</Alert>}
          <form onSubmit={(e) => handleSubmit(e)}>
            <Card style={{ padding: "20px", backgroundColor: "#ffe3a3" }}>
              {/* {renderRoleDropdown()} */}
              <div className="form-group mt-3 text-dark">
                <label htmlFor="name1">Name</label>
                <input
                  type="text"
                  className="form-control mt-1"
                  id="name"
                  placeholder="name"
                  name="name"
                  value={UserInfo.name}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
              </div>
              <div className="form-group mt-3 text-dark">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input
                  type="email"
                  className="form-control mt-1"
                  id="exampleInputEmail1"
                  name="email"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                  value={UserInfo.email}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                {/* <small id="emailHelp" className="form-text text-muted">
                  We'll never share your email with anyone else.
                </small> */}
              </div>
              <div className="form-group mt-3 text-dark">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input
                  type="password"
                  className="form-control mt-1"
                  id="exampleInputPassword2"
                  name="password"
                  placeholder="Password"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  value={UserInfo.password}
                />
                <small id="emailHelp" className="form-text text-muted">
                  Password must contain Special Operater, <br /> Uppercase
                  letters and Numbers.
                </small>
              </div>
              <div className="form-group mt-3 text-dark">
                <label htmlFor="exampleInputPassword1">Confirm Password</label>
                <input
                  type="password"
                  className="form-control mt-1"
                  id="exampleInputPassword1"
                  name="confirmPassword"
                  placeholder="Re-type Password"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  value={UserInfo.confirmPassword}
                />
              </div>
              <div className="submit-btn d-flex justify-content-between mt-3 text-dark">
                {props.createUser && (
                  <button type="submit" name="back" className="btn">
                    Back
                  </button>
                )}
                <button type="submit" className="btn">
                  {props.createUser ? "Create" : "Register"}
                </button>
              </div>
            </Card>
            {/* {helper()} */}
          </form>
        </Stack>
      </div>
    </div>
  );
};

export default Register;
