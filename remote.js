const { ApolloServer, gql } = require('apollo-server');
const { HttpLink } = require('apollo-link-http');
const { introspectSchema, makeExecutableSchema, makeRemoteExecutableSchema, mergeSchemas, AuthenticationError } = require('graphql-tools');
const fetch = require('node-fetch');
const { AuthDirective } = require('./auth-directive');

// Define local schema
const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
    isPublic: true
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
    isPublic: false
  },
];

/*======================= LOCAL SCHEMA =======================*/

directive @auth(
  requires: Role = ADMIN,
) on OBJECT | FIELD_DEFINITION

enum Role {
  ADMIN
  REVIEWER
  USER
  UNKNOWN
}


// Local type definitions
const localTypeDefs = gql`
    type Book {
        title: String
        author: String @auth()
        isPublic: Boolean!
    }

    # The Query type defines exactly which GraphQL queries (i.e., read operations) clients can execute against your data graph. It resembles an object type, but its name is always Query.
    # Each field of the Query type defines the name and return type of a different supported query. The Query type for our example schema might resemble the following:e
    type Query {
        books: [Book]
    }
`;

// Local resolvers
const localResolvers = {
    Query: {
        books: () => books,
    }
}

// Join our local resolvers and typeDefs to create a schema
const localSchema = makeExecutableSchema({
    typeDefs: localTypeDefs,
    resolvers: localResolvers,
    schemaDirectives: {
        auth: AuthDirective
    }
});

/*=================== END LOCAL SCHEMA =======================*/

// Load a remote schema and set up the http-link
getRemoteSchema = async(remoteUri) => {
    try {
        console.log('Loading remote schema:', remoteUri)
        const link = new HttpLink({ uri: remoteUri, fetch });
        const schema = await introspectSchema(link);

        console.log('Loaded remote schema:', remoteUri)
        return makeRemoteExecutableSchema({
            schema,
            link,
        });
    } catch(e) {
        Console.error(e);
    }
}

// Set up the schemas and initialize the server
initialize = async () => {

    // Load remote schemas here
    spacexSchema = await getRemoteSchema('https://api.spacex.land/graphql');
    countriesSchema = await getRemoteSchema('https://countries.trevorblades.com/');

    // Merge all schemas (remote and local) here
    const schema = mergeSchemas({
        schemas: [
            spacexSchema,
            countriesSchema,
            localSchema
        ]
    });

    // Create our ApolloServer object, and pass our merged schemas
    const server = new ApolloServer({
        schema,
        context: ({ req }) => {
            // Check if the user is logged in here
            // Whatever is returned becomes available in all resolvers
            const user = { name: 'John Doe' };

            // optionally we could block all requests here if the user is not logged in
            //  if (!user) throw AuthenticationError;
            if (!user) throw new AuthenticationError('you must be logged in'); 

            return user;
        },
    });

    // Listen up!
    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
}

initialize();
