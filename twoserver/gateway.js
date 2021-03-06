const { ApolloServer, gql } = require('apollo-server');
const { AuthDirective } = require('../auth-directive');
const { introspectSchema, makeExecutableSchema, makeRemoteExecutableSchema, mergeSchemas, delegateToSchema, Transform, FilterTypes, AuthenticationError } = require('graphql-tools');
const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');





// Define resolvers (define the technique for fetching the types defined in our schema)
const resolvers = {
    Query: {
        contentItems: (parent, args, context) => { return contentItems },
        articles: (parent, args, context) => { return articles }
    },
};


// Set up remote schemas
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
        console.error(e);
    }
}

class AuthTransform { //implements Transform

    transformSchema(schema) {
	// Remove isPublic field out of Article
	return schema
    }
    
    transformRequest(request) {
	// Add isPublic parameter depending on whether it's authorised
	return request
    }
    
}

// Set up the schemas and initialize the server
initialize = async () => {

    // Load remote schemas here
    remoteSchema = await getRemoteSchema('http://localhost:4000')

    transform = new AuthTransform()

    sanitisedSchema = delegateToSchema({
    	schema: remoteSchema,
    	transforms: [transform]
    })

    const server = new ApolloServer({ 
        schema: sanitisedSchema,
        context: ({ req }) => {
            user = { upi: 'skav012' }; // Get session here
            //user = null;
            return  { user };
        }
    });

    // The 'listen' method launches a web server.
    server.listen({port:4001}).then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });


}

initialize();
