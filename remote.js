const { ApolloServer, gql } = require('apollo-server');
const { HttpLink } = require('apollo-link-http');
const { introspectSchema , makeRemoteExecutableSchema, mergeSchemas } = require('graphql-tools');
const fetch = require('node-fetch');

/**
 * Define constants
 */
const link = new HttpLink({ uri: 'https://api.spacex.land/graphql', fetch });

getContentfulSchema = async() => {
    const schema = await introspectSchema(link);
  
    const executableSchema = makeRemoteExecutableSchema({
      schema,
      link,
    });
  
    return executableSchema
}

/**
 * Set up the schemas and initialize the server
 */
initialize = async () => {
    contentfulSchema = await getContentfulSchema();

    // Load all schemas (remote and local) here
    const schema = mergeSchemas({
        schemas: [contentfulSchema],
    });

    const server = new ApolloServer({
        schema
    });

    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });

}

initialize();
