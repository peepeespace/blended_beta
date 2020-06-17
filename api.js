const express = require('express');
const path = require('path');
var cors = require('cors');
const { RedisClient } = require('./src/cache.js');

const PORT = 8081;
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

// Redis 인스턴스 만들기
const r = new RedisClient();
r.auth();

// //////////////////////////
// // URL 정의는 여기서 부터 ////
// /////////////////////////
app.get('/', (req, res) => {
    res.send({'Status': 'API works'})    
});

app.get('/codelist/:type', async (req, res) => {
  let type = req.params.type;
  let codelist;
  if (type == 'all') {
    codelist = await r.getList('codelist', 'str');
  } else if (type == 'stock') {
    codelist = await r.getList('stock_codelist', 'str');
  } else if (type == 'etf') {
    codelist = await r.getList('etf_codelist', 'str');
  } else if (type == 'putcall') {
    codelist = await r.getList('putcall_codelist', 'str');
  } else if (type == 'spac') {
    codelist = await r.getList('spac_codelist', 'str');
  } else if (type == 'etn') {
    codelist = await r.getList('etn_codelist', 'str')
  }
  res.json(codelist);
});

app.get('/adj_close/:code', async (req, res) => {
  let code = req.params.code;
  let codelist = await r.getList('codelist', 'str');
  if (codelist.includes(code)) {
    let jsonData = await r.redisClient.get(code);
    jsonData = JSON.parse(jsonData);
    res.json(jsonData);
  } else {
    res.send({'Error': 'No such data'});
  }
});

app.get('/close_by_date/:date', async (req, res) => {
  let date = req.params.date;
  let jsonData = await r.redisClient.get(date);
  if (jsonData == null) {
    res.send({'Error': 'No such data'});
  } else {
    jsonData = JSON.parse(jsonData);
    res.json(jsonData);
  }
});