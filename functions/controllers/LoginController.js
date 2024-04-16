/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const LoginService = require("../services/LoginService");

class LoginController {
  constructor(request, response, admin) {
    this.request = request;
    this.response = response;
    this.admin = admin;
    // this.handleLogin();
  }

  async handleLogin() {
    const loginService = new LoginService(this.admin);
    try {
      const userId = await loginService.processLoginRequest(this.request);
      this.response.json({errorCode: 0, userId: userId});
    } catch (error) {
      this.response.status(500).json({errorCode: 1, message: error.message});
    }
  }
}

module.exports = LoginController;
