const {send} = require('micro')
const {get, post, router} = require('microrouter')
const {ApolloServer, gql} = require('apollo-server-micro')
const {makeExecutableSchema} = require('graphql-tools')

const users = [
  {
    id: '1',
    name: 'Kenji',
    from: 'Japan'
  },
  {
    id: '2',
    name: 'Billy',
    from: 'US'
  },
]

const typeDefs = gql`
    type User {
        id: ID!
        name: String
        from: String
    }
    type Query {
        users: [User]
        userById(id: ID!): User
    }
`

const resolvers = {
  Query: {
    users: () => users,
    userById: (obj, args) => {
      return users.find(u => u.id === args.id)
    }
  },
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const apolloServer = new ApolloServer({schema})
const graphqlPath = '/graphql'
const graphqlHandler = apolloServer.createHandler({path: graphqlPath})

const app = router(
  get('/', (req, res) => 'hello, Micro'),
  get('/about', (req, res) => 'about page'),
  post(graphqlPath, graphqlHandler),
  get(graphqlPath, graphqlHandler),
  (_, res) => send(res, 404, 'Not Found'),
)

module.exports = app