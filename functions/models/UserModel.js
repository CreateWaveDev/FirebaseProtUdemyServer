/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
class UserModel {
  constructor(firestore) {
    this.firestore = firestore;
  }

  async initializeUser(firebaseId) {
    const userDataRef = this.firestore.collection("user").doc(firebaseId);
    const doc = await userDataRef.get();

    if (!doc.exists) {
      return await this.createUserData(firebaseId);
    }
    return doc.data().userId;
  }

  async createUserData(firebaseId) {
    const userId = this.generateUniqueId();
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

    return userId;
  }

  generateUniqueId() {
    let userId;
    do {
      userId = 100000000 + Math.floor(Math.random() * 900000000); // Always 9 digits
    } while (this.userIdExists(userId));
    return userId;
  }

  async userIdExists(userId) {
    const doc = await this.firestore.collection("userData").doc("u" + userId).get();
    return doc.exists;
  }
}

module.exports = UserModel;
