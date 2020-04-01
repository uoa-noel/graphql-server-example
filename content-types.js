// Content Type Brainstorm
const { gql } = require('apollo-server');

const TypeDefs = gql`

    type ContentItem {
        name: String
        summary: String
        appearsInSearchResults: Boolean # Can do filtering on client?
        serviceOwners: Person
        copyOwners: Person
        userSupport: Person
        content: ContentPage  # Union type? How does this work with contentful?
    }

    # Union Type?
    union ContentPage = Article | PrivateArticle | MultipageGuide | PrivateMutlipageGuide

`;

const localResolvers = {
    Query: {
        if (!context.user) {

        }
        PrivateArticle: (parent, args, context) => {
            if (!context.user) return null;
        },
        PrivateMultipageGuide: (parent, args, context) => {
            if (!context.user) return null;
        }
    }
};