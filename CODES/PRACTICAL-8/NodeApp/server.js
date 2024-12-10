'use strict';
  
const express = require('express');
const PORT = 8080;
const HOST = '127.0. 0.1';

// App
const app = express();
app.get('/myhealth', (req, res) => {
  res.sendStatus(200);
  console.log("status code is 200");
  console.log('status code', res.statusCode);
  console.log(`I am alive`);
});
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
console.log(`Running`);
