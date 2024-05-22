/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
// const UserModel = require("../models/UserModel");
class LoginService {
  constructor(firestore, admin) {
    this.firestore = firestore;
    this.admin = admin;
  }

  async processLoginRequest(request) {
    try {
      const token = this.extractToken(request);
      const firebaseId = await this.verifyToken(token);
      // const userModel = new UserModel(this.firestore);
      // return await userModel.initializeUser(firebaseId);
      return firebaseId;
    } catch (error) {
      throw new Error(error.message); // エラーメッセージをそのまま投げる
    }
  }

  extractToken(request) {
    if (!request.headers.authorization) {
      throw new Error("Authorization header is missing.");
    }

    const match = request.headers.authorization.match(/^Bearer (.*)$/);
    if (!match) {
      throw new Error("Authorization token is malformed.");
    }
    return match[1];
  }

  async verifyToken(token) {
    try {
      const decodedToken = await this.admin.auth().verifyIdToken(token);
      console.log("通ったよ Prot Udemy Sever " + decodedToken.uid);
      return decodedToken.uid;
    } catch (error) {
      throw new Error("Failed to verify token.");
    }
  }
}

module.exports = LoginService;
