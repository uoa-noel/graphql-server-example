const { ApolloServer, gql } = require('apollo-server');
//const { AuthDirective } = require('../auth-directive');
const { introspectSchema, makeExecutableSchema, makeRemoteExecutableSchema, mergeSchemas, AuthenticationError } = require('graphql-tools');
const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');

const articles = [
  {
    body: 'Gonna teach you some stuff',
    isPublic: true
  },
  {
    body: 'This is all top secret',
    isPublic: false
  },
];

const contentItems = [
    {
        title: 'Sams Latex Workshop',
        summary: 'A workshop about LaTeX',
        article: articles[0]
    },
    {
        title: 'Top Secret NASA Project',
        summary: 'A top secret article about NASA',
        article: articles[1]
    }
]


// Define schema (collection of type definitions)
const typeDefs = gql`

    directive @auth(
        requires: Role = USER,
    ) on OBJECT

    enum Role {
        USER
        STAFF
    }

    type ContentItem {
        title: String
        summary: String
        article: Article
    }

    type Article @auth {
        body: String 
        isPublic: Boolean
    }

    type Query {
        contentItems: [ContentItem]
        articles: [Article]
    }

`;

// Define resolvers (define the technique for fetching the types defined in our schema)
const resolvers = {
    Query: {
        contentItems: (parent, args, context) => { return contentItems },
        articles: (parent, args, context) => { return articles }
    },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const localSchema = makeExecutableSchema({
    typeDefs,
    resolvers
});


// Set up the schemas and initialize the server
initialize = async () => {

    const server = new ApolloServer({ 
        schema:localSchema
    });

    // The 'listen' method launches a web server.
    server.listen({port:4000}).then(({ url }) => {
        console.log(`🚀  Remote server ready at ${url}`);
    });


}

initialize();
