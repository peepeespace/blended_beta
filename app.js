const express = require('express');
const path = require('path');
var cors = require('cors');

const PORT = 8082;
const HOST = '0.0.0.0';

const app = express(); // 앱 시작
app.set('views', `${__dirname}/dist`); // HTML 파일 연결
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(cors());
app.use(express.static(`${__dirname}/dist`)); // CSS 파일 연결

// 앱을 포트와 호스트와 연결하여 작동 시작하기
app.listen(PORT, HOST);
console.log(`서버가 http://${HOST}:${PORT} 에서 작동하고 있습니다.`);

// //////////////////////////
// // URL 정의는 여기서 부터 ////
// /////////////////////////

// 여기부터는 프론트엔드 개발자의 창의력을 보여주세요~! //

// app.get함수에 들어가는 것은 첫 번째 인자: URL 정의입니다
// 두 번째 인자는 디폴트로 (req, res)라고 두고 텍스트를 보여주고 싶으면, res.send를
// html을 보내고 싶으면, res.render함수를 사용합니다.

app.get('/', (req, res) => {
  res.render('keystone.html');
});