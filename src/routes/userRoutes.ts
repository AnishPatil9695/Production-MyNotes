import express from "express";
import * as UserController from "../controllers/usersController"

const router =express.Router();

//Route to getAuthenticate user
router.get('/',UserController.getAuthenticatedUser)

//Route for SignUp
router.post('/signup',UserController.signUp);

//Route for LogIn
router.post('/login',UserController.login);

//Route for logout
router.post('/logout',UserController.logout);

export default router;