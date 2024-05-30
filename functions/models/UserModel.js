/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const logger = require("firebase-functions/logger");
class UserModel {
  constructor(admin) {
    this.firestore = admin.firestore();
  }

  async initializeUser(firebaseId) {
    const userDataRef = this.firestore.collection("user").doc(firebaseId);
    const doc = await userDataRef.get();

    return doc;
  }

  async createUserData(firebaseId,batch) {
    const userId = await this.generateUniqueId();
    //const batch = this.firestore.batch();

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

    return userId;
  }

  async userIdExists(userId) {
    const doc = await this.firestore.collection("userData").doc("u" + userId).get();
   
    return doc.exists;
  }

  setScore(userId,batch,score){

  }
}

module.exports = UserModel;
