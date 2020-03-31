// import ApolloClient from 'apollo-client';
// import { print } from 'graphql/language/printer';

const { ApolloServer, gql } = require('apollo-server');
const { createApolloFetch } = require('apollo-fetch');


const apolloFetch = createApolloFetch({
  uri: 'https://api.spacex.land/graphql',
});

const tiesto = (stuff) => {
    console.log(stuff)
}
// fetch({
//   query: '{ launches { mission_name }}',
// }).then(res => {
//   console.log(res.data);
// });

// // You can also easily pass variables for dynamic arguments
// fetch({
//   query: `query PostsForAuthor($id: Int!) {
//     author(id: $id) {
//       firstName
//       posts {
//         title
//         votes
//       }
//     }
//   }`,
//   variables: { id: 1 },
// }).then(res => {
//   console.log(res.data);
// });

const typeDefs = gql`
    type Rocket {
        name: String
    }

    type Query {
        Rockets: [Rocket]
    }
`;


const resolvers = {
//   Query: (req) => apolloFetch({...req, query: '{ rockets { name } }').then(res => console.log(res.data)),
    Query: (req) => tiesto(hi)
};

const server = new ApolloServer({
    typeDefs,
    resolvers
})

// The 'listen' method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});