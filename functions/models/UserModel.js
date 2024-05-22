/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const logger = require("firebase-functions/logger");
class UserModel {
  constructor(firestore) {
    this.firestore = firestore;
  }

  async initializeUser(firebaseId) {
    const userDataRef = this.firestore.collection("user").doc(firebaseId);
    const doc = await userDataRef.get();

    logger.info("initializeUser firebase id" + firebaseId);
    if (!doc.exists) {
      logger.info("!doc.exists" + !doc.exists);
      return await this.createUserData(firebaseId);
    }

    logger.info("doc.data().userId" + doc.data().userId);
    return doc.data().userId;
  }

  async createUserData(firebaseId) {
    const userId = await this.generateUniqueId();
    const batch = this.firestore.batch();

    const userDataRef = this.firestore.collection("user").doc(firebaseId);
    const userGameDataRef = this.firestore.collection("userData").doc("u" + userId);

    const userData = {
      createTime: new Date(),
      firebaseId: firebaseId,
      userId: userId,
    };

    const gameData = {
      loginTime: new Date(),
      createTime: new Date(),
      firebaseId: firebaseId,
      jewel: 1000,
      userId: userId,
      score: 0,
    };

    batch.set(userDataRef, userData);
    batch.set(userGameDataRef, gameData);
    await batch.commit();
    logger.info("createUserData" + userId);
    return userId;
  }

  async generateUniqueId() {
    let userId;
    let isLoop = true;
    do {
      userId = 100000000 + Math.floor(Math.random() * 900000000); // Always 9 digits
      isLoop = await this.userIdExists(userId);
    } while (isLoop);
    console.log("ID生成 成功 " + userId);

    logger.info("generateUniqueId" + userId);
    return userId;
  }

  async userIdExists(userId) {
    const doc = await this.firestore.collection("userData").doc("u" + userId).get();
    logger.info("userIdExists" + doc.exists);
    return doc.exists;
  }
}

module.exports = UserModel;
