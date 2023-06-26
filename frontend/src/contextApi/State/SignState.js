import axios from "axios";
import SignContext from "contextApi/Context/SignContext";
import React from "react";

export const SignState = (props) => {
  const url = `${process.env.REACT_APP_BASE_URL}`;

  //Register User
  const registerUser = async (UserInfo) => {
    try {
      if (UserInfo.password !== UserInfo.confirmPassword) {
        return { success: false, msg: "Password and confirm password do not match" };
      }
      const response = await axios.post(`${url}/api/users/register`, UserInfo);
      console.log(response.data)
      return response.data;
    } catch (error) {
      // return ({ success: false, msg: "server Error" })
    }
  };

  //Login User
  const loginUser = async (UserInfo) => {
    try {
      const response = await axios.post(`${url}/api/users/login`, UserInfo);

      return response.data;
    } catch (error) {
      return ({ success: false, msg: "server Error" })
    }
  };

  //Forgot Password
  const forgotPassword = async (UserInfo) => {
    try {
      const response = await axios.post(
        `${url}/api/users/forgotpassword`,
        UserInfo
      );

      return response.data;
    } catch (error) {
      return ({ success: false, msg: "server Error" })
    }
  };

  //Reset Password
  const resetPassword = async (resetToken,password) => {
    try {
      const response = await axios.put(
        `${url}/api/users/resetpassword/${resetToken}`,
        {password:password}
      );
      return response.data;
    } catch (error) {
      return ({ success: false, msg: "server Error" })
    }
  };

  // Update Password
  const changePassword = async (UserInfo, Token) => {
    try {
      const response = await axios.post(`${url}/api/users/updatepassword`, {
        ...UserInfo,
        token: Token,
      });
      return response.data;
    } catch (error) {
      return ({ success: false, msg: "server Error" })
    }
  };

  // Get LoggedInUser
  const getLoggedInUser = async (Token) => {
    try {
      const response = await axios.post(`${url}/api/users/getloggedinuser`, {
        token: Token,
      });

      return response.data;
    } catch (error) {
      return ({ success: false, msg: "server Error" })
    }
  };

  // Get Specific user
  const getSpecificUser = async (id , role) => {
    try {
      const response = await axios.post(`${url}/api/users/getspecificuser`, {
        id: id,
        roles : [role]
      });
      console.log(response.data._id)
      return response.data;
    } catch (error) {
      return ({ success: false, msg: "server Error" })
    }
  };

  // GetUsers
  const getUsers = async () => {
    try {
      const response = await axios.get(`${url}/api/users/getusers`, {
      });
      return response.data;
    } catch (error) {
      return ({ success: false, msg: "server Error" })
    }
  };

  // Update User

  const updateUser = async (userInfo, id, profilePhoto) => {
    try {
      const formData = new FormData();
      formData.append("name", userInfo.name);
      formData.append("roles", userInfo.roles);
      formData.append("id", id);
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      const response = await axios.post(
        `${url}/api/users/updateuser`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return ({ success: false, msg: "server Error" })
    }
  };

  // delete user
  const deleteUser = async (userId) => {
    try {
      const response = await axios.post(`${url}/api/users/deleteuser`, {
        id: userId,
      });
      return response.data;
    } catch (error) {
      return ({ success: false, msg: "server Error" })
    }
  };
  
  const GetRoles = async ()=> {
    try {
      const response = await axios.get(`${url}/api/users/getroles`, {});
      return response.data;
    } catch (error) {
      return ({ success: false, msg: "server Error" })
    }
  }

  return (
    <SignContext.Provider
      value={{
        registerUser,
        loginUser,
        forgotPassword,
        resetPassword,
        changePassword,
        getLoggedInUser,
        getSpecificUser,
        getUsers,
        updateUser,
        deleteUser,
        GetRoles
      }}
    >
      {props.children}
    </SignContext.Provider>
  );
};
