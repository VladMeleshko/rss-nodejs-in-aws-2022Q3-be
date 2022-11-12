const config = require('../../common/config');
const axios = require('axios');

const bffHandler = (req, res) => {
  const recipient = req.originalUrl.split('/')[1];
  const recipientUrl = config[recipient];

  if (recipientUrl) {
    const axiosConfig = {
      method: req.method,
      url: `${recipientUrl}${req.originalUrl}`,
      headers: {
        Authorization: req.headers.authorization
      },
      ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
    };

    axios.request(axiosConfig)
      .then((response) => res.json(response.data))
      .catch(error => {
        if (error.response) {
          const {
            status,
            data
          } = error.response;

          res.status(status).json(data);
        } else {
          res.status(500).json({error: error.message});
        }
      });
  } else {
    res.status(502).json({error: 'Cannot process request'});
  }
}

module.exports = bffHandler;