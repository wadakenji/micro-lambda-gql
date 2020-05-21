const finish = require('./node_modules/serverless-http/lib/finish')
const getProvider = require('./node_modules/serverless-http/lib/provider/get-provider')
const Response = require('./node_modules/serverless-http/lib/response')

const getFramework = (app) => {
  return request => {
    const response = new Response(request);

    ((request, response) => {
      app._events.request(request, response)
    })(request, response)

    return response
  }
}

const defaultOptions = {
  requestId: 'x-request-id'
}

const serverless = function (app, opts) {
  const options = Object.assign({}, defaultOptions, opts)

  const framework = getFramework(app)
  const provider = getProvider(options)

  return provider(async (request, ...context) => {
    await finish(request, options.request, ...context)
    const response = await framework(request)
    await finish(response, options.response, ...context)
    return response
  })
}

module.exports = serverless