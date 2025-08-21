import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLFloat } from "graphql";

import { globalIdField } from "graphql-relay";

// Define AccountType

const AccountType = new GraphQLObjectType({
  name: "Account",
  description: "A bank account with balance and transactions capabilities",

  fields: () => ({
    // Global Relay ID
    id: globalIdField("Account"),

    // Simple ID MongoDB
    _id: {
      type: GraphQLID,
      description: "MongoDB ObjectID of the account",
      resolve: (account) => account._id.toString(),
    },

    // Account name
    name: {
      type: GraphQLString,
      description: "Account holder full name",
      resolve: (account) => account.name,
    },

    // Account email
    email: {
      type: GraphQLString,
      description: "Account holder email",
      resolve: (account) => account.email,
    },

    // Formated balance (to expose)
    formattedBalance: {
      type: GraphQLString,
      description: "Account balance formatted to BRL",
      resolve: (account) => account.getFormattedBalance(),
    },

    // Account number
    accountNumber: {
      type: GraphQLString,
      description: "Unique account identifier",
      resolve: (account) => account.accountNumber,
    },

    // Account createdAt
    createdAt: {
      type: GraphQLString,
      description: "Account creation date in ISO format",
      resolve: (account) => account.createdAt.toISOString(),
    },

    // Account updatedAt
    updatedAt: {
      type: GraphQLString,
      description: "Account last update date in ISO format",
      resolve: (account) => account.updatedAt.toISOString(),
    },
  }),
});

export default AccountType;
