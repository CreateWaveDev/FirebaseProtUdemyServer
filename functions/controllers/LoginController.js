/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const logger = require("firebase-functions/logger");
const LoginService = require("../services/LoginService");
const UserModel = require("../models/UserModel");
class LoginController {
  constructor(request, response, admin) {
    this.request = request;
    this.response = response;
    this.admin = admin;
  }

  async handleLogin() {
    const firestore = this.admin.firestore();
    const loginService = new LoginService(firestore, this.admin);
    logger.info("UserModel");
    logger.info(UserModel);
    const userModel = new UserModel(firestore);
    try {
      const firebaseId = await loginService.processLoginRequest(this.request);
      const userId = await userModel.initializeUser(firebaseId);
      this.response.json({errorCode: 0, userId: userId});
    } catch (error) {
      this.response.json({errorCode: 1, message: error.message});
    }
  }
}

module.exports = LoginController;
