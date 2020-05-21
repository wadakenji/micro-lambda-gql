const micro = require('micro')
const app = require('./app')
const serverless = require('./serverless-for-micro')

const isProd = !!process.env.AWS_REGION

if (isProd) {
  const server = micro(app)
  module.exports.handler = serverless(server)
} else {
  module.exports = app
}