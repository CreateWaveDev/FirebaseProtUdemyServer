/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* 今回は匿名でログインします */
module.exports = class LoginModel {
  constructor() {}
  async setUserInit(fireStore, batch, fireBaseId) {
    // ユーザー初期化
    let userId = 0;
    const userDataRef = fireStore.collection("user").doc(fireBaseId);
    let isExistence;
    await userDataRef.get().then((doc) => {
      if (doc.exists) {
        // 存在する
        isExistence = true;
        console.log(doc.data());
        userId = doc.data().userId;
      } else {
        // 存在しない
        isExistence = false;
      }
    }).catch((error) => {
      console.log(error.message);
      return 0;
    });

    const obj = {};
    const objGame = {};
    if (!isExistence) {
      // 新規ユーザー
      let isLoop = true;
      while (isLoop) {
        userId = Math.floor(Math.random() * 1000000000);// 0から999999999
        // かならず9桁にする為の処理
        if (userId < 100000000) {
          userId += 100000000;
        }
        const userGameDataRef = fireStore.collection("userData").doc("u" + userId);
        await userGameDataRef.get().then((doc) => {
          if (doc.exists) {
            // 存在する
            console.log(userId, "存在します");
          } else {
            // 存在しない
            isLoop = false;
            console.log(userId, "存在しません");
          }
        }).catch((error) => {
          console.log(error.message);
          return 0;
        });
      }

      const userGameDataRef = fireStore.collection("userData").doc("u" + userId);
      console.log("新規ユーザー");
      obj["createTime"] = new Date();
      obj.firebaseId = fireBaseId;
      obj.userId = userId;
      batch.set(userDataRef, obj);

      objGame.loginTime = new Date();
      objGame.createTime = new Date();
      objGame.firebaseId = fireBaseId;
      objGame.jewel = 1000;
      objGame.userId = userId;
      objGame.score = 0;
      batch.set(userGameDataRef, objGame);
    } else {
      // 既存ユーザー
      console.log("既存ユーザー");
      const userGameDataRef = fireStore.collection("userData").doc("u" + userId);
      objGame.loginTime = new Date();
      batch.update(userGameDataRef, objGame);
    }
    return userId;
  }
};
