import React, { useEffect, useState } from "react";
import "./authStyle.css";
import { Card } from "@mui/material";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import SignContext from "contextApi/Context/SignContext";

const createUser = () => {
  const { id } = useParams();
  const { registerUser,getSpecificUser } = useContext(SignContext);
  const navigate = useNavigate();
  const [UserInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setUserInfo({ ...UserInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser(UserInfo);
    if (res.success) {
      navigate("/login");
    }
  };

  const getspecificUser = async (id) => {
    const res = await getSpecificUser(id);
    if (res.success) {
      setUserInfo(res);
    } else {
      console.log(res.msg);
    }
  };

  useEffect(() => {
    getspecificUser(id);
  }, []);

  return (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <div className="register-body">
        <form onSubmit={(e) => handleSubmit(e)}>
          <Card style={{ padding: "20px", backgroundColor: "#ffe3a3" }}>
            <div className="form-group mt-3">
              <label htmlFor="name1">name</label>
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
            <div className="form-group mt-3">
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
              <small id="emailHelp" className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div className="form-group mt-3">
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
                Password must contain Special Operater, <br /> Uppercase letters
                and Numbers.
              </small>
            </div>
            <div className="form-group mt-3">
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
            {/* <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
          />
          <label class="form-check-label" htmlFor="flexRadioDefault1">
            Admin
          </label>
        </div> */}
            {/* <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault2"
          />
          <label class="form-check-label" htmlFor="flexRadioDefault2">
            Super
          </label>
        </div> */}
            <div className="form-check mt-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
              />
              <label className="form-check-label" htmlFor="exampleCheck1">
                Agree Our <a href="">Terms & Conditions</a>
              </label>
            </div>
            <div className="submit-btn d-flex justify-content-center mt-3">
              <button type="submit" className="btn">
                Register
              </button>
            </div>
          </Card>
          <div className="helper mt-2">
            Already have an account?<NavLink to="/login"> login</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default createUser;
