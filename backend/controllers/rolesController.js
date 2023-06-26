const express = require("express");
const Roles = require("../models/Roles");

// Add Role
const addRole = async (req,res)=> {

    const role = req.body.role;
    const permissions = req.body.permissions;

    const newRole = new Roles({role , permissions})
    const isSaved = await newRole.save();

    if(isSaved){
    return res.send({code : 200 , message : "role added" })
    }
}

// Delete Role

const deleteRole = async(req,res)=>{
    return res.send({code : 200 , message : "role Deleted" })
}

module.exports = {
    addRole , 
    deleteRole
}
