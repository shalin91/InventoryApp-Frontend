import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Register from "Auth/Register";
import Dashboard from "scenes/Dashbboard/Dashboard";
import Layouts from "scenes/Layouts/Layouts";
import { themeSettings } from "theme";
import Login from "Auth/Login";
import Forgot from "Auth/Forgot";
import Reset from "Auth/Reset";
import { SignState } from "contextApi/State/SignState";
import { LogInRoute } from "components/PrivateRoutes/LogInRoute";

import ChangePassword from "components/Profile/ChangePassword";
import { UserTable } from "components/User-Master/UserTable";
import Edituser from "components/EditUser/Edituser";
import Products from "components/Products/Products";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          {/* <Route */}
            {/* // exact */}
            {/* // path="/register" */}
            {/* // element={ */}
              {/* // <SignState> */}
              {/* //   <Register navigate="login" register={true}/> */}
              {/* // </SignState> */}
            {/* // } */}
          {/* // /> */}
          <Route
            exact
            path="/edituser/:id"
            element={
              <SignState>
                <Edituser editUser={true} />
              </SignState>
            }
          />
          <Route
            exact
            path="/login"
            element={
              <SignState>
                <Login />
              </SignState>
            }
          />
          <Route
            exact
            path="/"
            element={
              <SignState>
                <Login />
              </SignState>
            }
          />
          <Route
            exact
            path="/forgot"
            element={
              <SignState>
                <Forgot />
              </SignState>
            }
          />
          <Route exact path="/reset/:resetToken" element={<SignState><Reset /></SignState>}/>
        </Routes>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route exact path="/" element={<LogInRoute />}>
              <Route
                element={
                  <SignState>
                    <Layouts />
                  </SignState>
                }
              >
                <Route
                  exact
                  path="/dashboard"
                  element={<Navigate to="/dashboard"/>}
                />
                <Route exact path="/products" 
                  element = {<Products/>}
                />
                <Route
                  exact
                  path="/users"
                  element={
                    <SignState>
                      <UserTable />
                    </SignState>
                  }
                />
                <Route
                  exact
                  path="/createuser"
                  element={
                    <SignState>
                      <Register navigate="users" createUser={true}/>
                    </SignState>
                  }
                />
                <Route exact path="/dashboard" element={<Dashboard />} />
              </Route>
            </Route>
          </Routes>
          <Routes>
            <Route
              exact
              path="/editprofile/:id"
              element={
                <SignState>
                  <Edituser />
                </SignState>
              }
            />
            <Route
              exact
              path="/changepassword"
              element={
                <SignState>
                  <ChangePassword />
                </SignState>
              }
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
