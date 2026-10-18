const express = require("express");
const routes = express.Router();

const { 
    RegisterController, 
    LoginController, 
    LogoutController, 
    MeController 
} = require("../Controller/AuthController");

routes.post("/register", RegisterController);
routes.post("/login", LoginController);
routes.post("/logout", LogoutController);
routes.get("/me", MeController);

module.exports = routes;