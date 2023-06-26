import React from "react";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridCellParams,
} from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { useContext } from "react";
import SignContext from "contextApi/Context/SignContext";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export const UserTable = () => {
  const url = `${process.env.REACT_APP_BASE_URL}`;
  const { getUsers, deleteUser } = useContext(SignContext);
  const [usersData, setUsersData] = useState({});
  const [editRows, setEditRows] = useState([]);
  const theme = useTheme();
  const rights = JSON.parse(localStorage.getItem('rights')).permissions
  
  const navigate = useNavigate();

  const getusers = async () => {
    const res = await getUsers();
    const transformedData = res.users.map((user, index) => ({
      ...user,
      id: index + 1,
    }));
    setUsersData(transformedData);
  };

  useEffect(() => {
    getusers();
  }, []);

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (confirmed) {
      console.log(`Deleting user with ID ${userId}`);
      const res = await deleteUser(userId);
      if (res.success) {
        getusers();
        window.alert("User deleted successfully");
      }
    }
  };

  const handleEditUser = (userId) => {
    navigate(`/edituser/${userId}`);
  };

  const handleCreateUser =  () => {
    // Logic to navigate to the create user page
    navigate("/createuser");
  };


  const columns: GridColDef[] = [
    // { field: "_id", headerName: "ID", width: 70 },
    {
      field: "_id",
      headerName: "Sr No.",
      renderCell: (params: GridCellParams) => <>{params.row.id}</>,
    },
    { field: "name", headerName: "Name", width: 100 },
    { field: "email", headerName: "Email", width: 160 },
    {
      field: "photo",
      headerName: "Photo",
      width: 130,
      renderCell: (params: GridCellParams) => (
        <div
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <img
            src={`${url}/${params.row.photo}`}
            alt={params.row.photo}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ),
    },
    {
      field: "roles",
      headerName: "Role",
      width: 130,
    },

    rights.indexOf("Edit-user") !== -1 &&
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      renderCell: (params: GridCellParams) => (
        <button
          onClick={() => handleEditUser(params.row._id)}
          style={{ width: "100%", backgroundColor: theme.palette.secondary[300] , border : "none"}}
        >
          Edit
        </button>
      )
    },

    rights.indexOf("Delete-user") !== -1 &&
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params: GridCellParams) => (
        <button
          onClick={() => handleDeleteUser(params.row._id)}
          style={{ width: "100%", backgroundColor: theme.palette.secondary[300] , border : "none" }}
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div style={{ height: "60%", width: "100%" ,  display: "flex", flexDirection: "column",  justifyContent  : "space-between" }}>
      {rights.indexOf("Create-user") !== -1 && <button
        onClick={handleCreateUser}
        style={{
          backgroundColor: theme.palette.secondary[300],
          height: "4vh",
          borderRadius: "5px",
          border : "none",
          cursor  :"pointer",
          alignSelf: "flex-end",
          marginBottom  : "10px",
          marginTop  : "10px",
        }}
      >
        Create User
      </button>}
      <DataGrid
        rows={usersData}
        columns={columns}
        editRowsModel={editRows}
        onEditRowsModelChange={(newModel) => setEditRows(newModel)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        // checkboxSelection
      />
      <div
        style={{ textAlign: "right", marginTop: "10px", marginRight: "60px" }}
      >
      </div>
    </div>
  );
};

export default UserTable;