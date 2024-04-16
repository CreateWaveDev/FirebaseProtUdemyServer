/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
// v1のほうが安価のため、今回はv1で構築していきます。
// const {onRequest} = require("firebase-functions/v2/https");
// v1を使うための宣言を行います。
const functions = require("firebase-functions");


// ログイン情報を作成するときに使用
const admin = require("firebase-admin");
admin.initializeApp();

const LoginController = require("./controllers/LoginController");
// まず最初に関数を作ってみましょう
// .region('asia-northeast1')を指定することで、Tokyoサーバーをクラウドファンクションズが出来上がる
// 指定しないと、基本的にはUSサーバーになります（要確認）

// まずはfirebase deployでやる。
// 慣れてきたらもっと局所的なデプロイの方法を伝える。
exports.test = functions.region("asia-northeast1").https.onRequest((request, response) => {
  response.send("Hello Firebase");
});


exports.login = functions.region("asia-northeast1").https.onRequest((request, response) => {
  new LoginController(request, response, admin).handleLogin();
});
