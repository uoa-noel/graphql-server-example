const { ApolloServer, gql } = require('apollo-server');
const { AuthDirective } = require('./auth-directive');
const { makeExecutableSchema } = require('graphql-tools');

const articles = [
  {
    title: 'Sams Latex Workshop',
    summary: 'A workshop about LaTeX',
    body: 'Gonna teach you some stuff',
    isPublic: true
  },
  {
    title: 'Top Secret NASA Project',
    summary: 'A top secret article about NASA',
    body: 'This is all top secret',
    isPublic: false
  },
];

// Define schema (collection of type definitions)
const typeDefs = gql`

    directive @auth(
        requires: Role = USER,
    ) on OBJECT

    enum Role {
        USER
        STAFF
    }

    type Article @auth {
        title: String
        summary: String
        body: String 
        isPublic: Boolean
    }

    type Query {
        articles: [Article]
    }

`;

// Define resolvers (define the technique for fetching the types defined in our schema)
const resolvers = {
    Query: {
        articles: (parent, args, context) => { 
            // console.log('context', context) // Can access logged in user here
            return articles 
        }
    },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives: {
        auth: AuthDirective
    }
});

const server = new ApolloServer({ 
    schema,
    context: ({ req }) => {
        user = { upi: 'skav012' }; // Get session here
        return  { user };
    }
});

// The 'listen' method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});


