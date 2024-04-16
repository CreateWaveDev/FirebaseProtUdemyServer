const LoginService = require("../services/LoginService.1");

class LoginController {
  constructor(request, response, admin) {
    this.request = request;
    this.response = response;
    this.admin = admin;
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
