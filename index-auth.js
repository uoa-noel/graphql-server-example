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
    ) on OBJECT | FIELD_DEFINITION

    enum Role {
        ADMIN
        REVIEWER
        USER
        UNKNOWN
    }

    type Article @auth(requires: ADMIN){
        title: String
        summary: String
        body: String @auth(requires: ADMIN)
        isPublic: Boolean
    }

    type Query {
        articles: [Article]
    }

`;

// Define resolvers (define the technique for teching the types defined in our schema)
const resolvers = {
    Query: {
        articles: () => articles,
    },
};


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

const schema = makeExecutableSchema({
    typeDefs,
    schemaDirectives: {
        auth: AuthDirective
    }
});

const server = new ApolloServer({ 
    typeDefs,
    resolvers,
});

// The 'listen' method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});


