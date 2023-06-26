import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

export const LogInRoute = () => {
  const loggedin = window.localStorage.getItem('loggedIn');
  return (
    <>
     {loggedin ? <Outlet /> : <Navigate to="/login" />}
    </>
  )
}
