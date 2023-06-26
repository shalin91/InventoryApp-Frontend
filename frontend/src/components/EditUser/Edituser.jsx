import React, { useEffect, useState } from "react";
import "../../Auth/authStyle.css";
import { Card } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import SignContext from "contextApi/Context/SignContext";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const Edituser = (props) => {
  const { id } = useParams();
  const { updateUser, getSpecificUser, GetRoles } = useContext(SignContext);
  const navigate = useNavigate();
  const [UserInfo, setUserInfo] = useState({ roles: [] });
  const [profilePhoto, setProfilePhoto] = useState("");
  const [Error, setError] = useState("");
  const [Success, setSuccess] = useState("");
  const [Roles, setRoles] = useState([]);

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    if (e.target.name === "roles") {
      setUserInfo({ ...UserInfo, [e.target.name]: [e.target.value] });
    } else {
      setUserInfo({ ...UserInfo, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.nativeEvent.submitter.name === "back") {
      // Handle back button click
      navigate("/users");
    } else {
      const res = await updateUser(UserInfo, id, profilePhoto);
      if (res.success) {
        setSuccess(props.editUser ? res.msg : "Successfully Edited");
        setTimeout(() => {
          navigate("/users");
        }, 1000);
      } else {
        setError(res.msg);
        setTimeout(() => {
          setError("");
        }, 1000);
      }
    }
  };

  const getspecificUser = async (id) => {
    const res = await getSpecificUser(id);
    // console.log(res);
    if (res.success) {
      setUserInfo(res);
    } else {
      console.log(res.msg);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setProfilePhoto(file);
  };
  
  

  const getRoles = async () => {
    const res = await GetRoles();
    setRoles(res);
  };

  const renderRoleDropdown = () => {
    if (props.editUser) {
      // Render the dropdown only when the component is used for creating a user
      return (
        <div className="form-group mt-3 text-dark">
          <label htmlFor="role">Role</label>
          <select
            className="form-control mt-1"
            id="role"
            name="roles"
            value={UserInfo.roles[0]}
            // defaultValue={UserInfo.roles[0]}
            onChange={(e) => {
              handleChange(e);
            }}
          >
            {Roles.map((role) => {
              return (
                <option key={role.role} value={role.role}>
                  {role.role}
                </option>
              );
            })}
          </select>
        </div>
      );
    }
  };

  useEffect(() => {
    getspecificUser(id);
    getRoles();
  }, []);

  // console.log(UserInfo);

  return (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <div className="register-body">
        <Stack spacing={2}>
          {Error && <Alert severity="error">{Error}</Alert>}
          {Success && <Alert severity="success">{Success}</Alert>}
          <form onSubmit={(e) => handleSubmit(e)}>
            <Card style={{ padding: "20px", backgroundColor: "#ffe3a3" }}>
              <div className="form-group mt-3 text-dark">
                <label htmlFor="photo">Profile Photo</label>
                <input
                  type="file"
                  className="form-control mt-1"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
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
              {renderRoleDropdown()}
              <div className="submit-btn d-flex justify-content-between mt-3 text-dark">
                <button type="submit" name="back" className="btn">
                  Back
                </button>
                <button type="submit" className="btn">
                  Save
                </button>
              </div>
            </Card>
          </form>
        </Stack>
      </div>
    </div>
  );
};

export default Edituser;
