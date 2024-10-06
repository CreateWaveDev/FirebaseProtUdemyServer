/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const LoginService = require("../services/LoginService");
const UserModel = require("../models/UserModel");
class ScoreController {
  constructor(request, response, admin) {
    this.request = request;
    this.response = response;
    this.admin = admin;
  }

  async setScore() {
    const batch = this.admin.firestore().batch();
    const loginService = new LoginService(this.admin);
    const userModel = new UserModel(this.admin);
    try {
      const firebaseId = await loginService.processLoginRequest(this.request);
      const userDoc = await userModel.getUser(firebaseId);
      let userId;

      if (userDoc.exists) {
        userId = userDoc.data().userId;
      } else {
        userId = await userModel.createUser(firebaseId, batch);
      }

      await batch.commit();

      this.response.json({errorCode: 0, userId: userId});
    } catch (error) {
      this.response.json({errorCode: 1, message: error.message});
    }
  }
}

module.exports = ScoreController;
