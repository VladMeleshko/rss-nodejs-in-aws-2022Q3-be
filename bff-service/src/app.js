const express = require('express');
const bffHandler = require('./resources/bff.service');
const config = require('../common/config');

const app = express();
const port = config.PORT || 3001;

app.use(express.json());

app.all('/*', (req, res) => bffHandler(req, res))

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
