const { ApolloServer, gql } = require('apollo-server');
const { HttpLink } = require('apollo-link-http');
const { introspectSchema , makeRemoteExecutableSchema, mergeSchemas } = require('graphql-tools');
const fetch = require('node-fetch');

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
            countriesSchema
        ],
    });

    // Create our ApolloServer object, and pass our merged schemas
    const server = new ApolloServer({
        schema
    });

    // Listen up!
    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
}

initialize();
