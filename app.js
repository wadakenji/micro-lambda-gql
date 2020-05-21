const {send} = require('micro')

const app = async (req, res) => {
  return send(res, 200, {res: 'ok'})
}

module.exports = app