
const { SchemaDirectiveVisitor } = require("apollo-server");
const {
    defaultFieldResolver,
    GraphQLString,
} = require("graphql");

class AuthDirective extends SchemaDirectiveVisitor {
    visitObject(type) {
        console.log('visited object')
        console.log(this.args.requires)
        this.ensureFieldsWrapped(type);
        type._requiredAuthRole = this.args.requires;
    }

    // Visitor methods for nested types like fields and arguments
    // also receive a details object that provides information about
    // the parent and grandparent types.
    visitFieldDefinition(field, details) {
        console.log(`field: ${JSON.stringify(field)}, details: ${JSON.stringify(details)}`)
        this.ensureFieldsWrapped(details.objectType);
        field._requiredAuthRole = this.args.requires;
    }

    ensureFieldsWrapped(objectType) {
        // Mark the GraphQLObjectType object to avoid re-wrapping:
        if (objectType._authFieldsWrapped) return;
        objectType._authFieldsWrapped = true;

        const fields = objectType.getFields();

        Object.keys(fields).forEach(fieldName => {
            console.log(`Called on field ${fieldName}`)
            const field = fields[fieldName];
            const { resolve = defaultFieldResolver } = field;

            field.resolve = async function (...args) {
                console.log('Field.resolve called with args: ', JSON.stringify(...args));

                // Only return data if the isPublic field is true
                if(args[0]['isPublic']) return resolve.apply(this, args);
            
                // Get the required Role from the field first, falling back
                // to the objectType if no Role is required by the field:
                // const requiredRole =
                //     field._requiredAuthRole ||
                //     objectType._requiredAuthRole;

                // if (!requiredRole) {
                //     return resolve.apply(this, args);
                // }

                // const context = args[2];
                // const user = await getUser(context.headers.authToken);
                // if (!user.hasRole(requiredRole)) {
                //     throw new Error("not authorized");
                // }

                // return resolve.apply(this, args);
            };
        });
    }
}

module.exports = { AuthDirective };