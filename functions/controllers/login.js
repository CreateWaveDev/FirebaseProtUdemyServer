/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const LoginModel = require("../models/loginModel");

module.exports = class login {
  // 1.まずコンストラクタを作ってください。
  // まずこれを作ってください。
  // requestはクライアントからきてる情報が入る
  // responseはクライアントに返すためのオブジェクト
  // adminはfirebase扱うための関数？


  // ここがスタート地点

  // コンストラクタでアズシンクできるかやってみよう Todo
  // constructor(request, response, admin, fireStore) {
  //  this.getUserInfo(request, response, admin, fireStore);
  // }

  // async getUserInfo(request, response, admin, fireStore) {
  // if (!request.headers.authorization || !request.headers.authorization.match(/^Bearer (.*)$/)) {
  // return response.send("tokenの値がundefinedです。");
  // }
  // Unity側のFirebase SDKからTokenを送ってくるのでチェック
  // request.headers.authorization.matchという文でチェック？
  // ベアラーの説明する？
  // const match = request.headers.authorization.match(/^Bearer (.*)$/);

  // トークン
  // let token;
  // nullかunderfindかどうかを判定するもの
  // 正規のトークンの値が返ってきてない場合はfalseになる
  // match関数というもので返ってきてる
  /*
    if (match) {
      // ここで
      token = match[1];
    } else {
      // ここreturnが必要かどうか要確認
      return response.send("正規のtokenの値じゃありません");
    }
    */
  constructor(request, response, admin) {
    this.getUserInfo(request, response, admin);
  }
  // 匿名ID？
  // Googleが発行したトークンが正しいかチェックする
  // トークンからFirebase IDを取得する
  async getUserInfo(request, response, admin) {
    this.request = request;
    this.response = response;
    this.admin = admin;
    // Unityから来たTokenをとる
    const match = request.headers.authorization.match(/^Bearer (.*)$/);
    let token;
    if (match) {
      token = match[1];
      console.log(match[0]);
    } else {
      token = "tokenとれんかった";
    }

    // TokenからFirebaseIDを抽出する
    let firebaseId;
    await admin.auth().verifyIdToken(token)
        .then((decodedToken) => {
          firebaseId = decodedToken.uid;
        }).catch((error) => {
          console.log("FireBaseID戻すのに失敗" + error.message);
        });

    const fireStore = admin.firestore();
    const batch = fireStore.batch();
    const loginModel = new LoginModel();
    const userId = await loginModel.setUserInit(fireStore, batch, firebaseId);

    const obj = {};
    if (userId == 0) {
      obj.errorCode = 1;
      obj.userId = userId;
      const json = JSON.stringify(obj);
      response.send(json);
    } else {
      // トランザクション実行
      await batch.commit()
          .then((result) => {
            // 成功
            obj.errorCode = 0;
            obj.userId = userId;
            const json = JSON.stringify(obj);
            response.send(json);
          })
          .catch((error) => {
            // 失敗
            obj.errorCode = 2;
            obj.userId = userId;
            const json = JSON.stringify(obj);
            response.send(json);
          });
    }
  }
};
