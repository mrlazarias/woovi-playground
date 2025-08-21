import { GraphQLID, GraphQLObjectType } from "graphql";

import { globalIdField } from "graphql-relay";

import AccountType from "./AccountType";

// Define TransactionType

const TransactionType = new GraphQLObjectType({
  name: "Transaction",
  description: "A Money transfer transaction between accounts",

  fields: () => ({
    id: globalIdField("Transaction"),

    _id: {
      type: GraphQLID,
      description: "Internal MongoDB ObjectID",
      resolve: (transaction) => transaction._id.toString(),
    },

    // Source account (Returns complete object Account)
    fromAccount: {
      type: AccountType,
      description: "Account that sent the money",
      resolve: async (transaction) => {
        // if populate = true, return the account object
        if (transaction.fromAccount && transaction.fromAccount.name) {
          return transaction.fromAccount;
        }

        // else, search in the db
        try {
          const Account = (
            await import("../../apps/server/src/models/Account.js")
          ).default;
          return await Account.findById(transaction.fromAccount);
        } catch (error) {
          console.error("Error loading fromAccount:", error);
          return null;
        }
      },
    },
  }),

  // Destination account (Returns complete object Account)
  toAccount: {
    type: AccountType,
    description: "Account that received the money",
    resolve: async (transaction) => {
      // if populate = true, return the account object
      if (transaction.toAccount && transaction.toAccount.name) {
        return transaction.toAccount;
      }

      // else, search in the db
      try {
        const Account = (
          await import("../../apps/server/src/models/Account.js")
        ).default;
        return await Account.findById(transaction.toAccount);
      } catch (error) {
        console.error("Error loading toAccount:", error);
        return null;
      }
    },
  },

  // Transaction amount
  amount: {
    type: GraphQLFloat,
    description: "Transaction amount in BRL",
    resolve: (transaction) => transaction.amount,
  },

  // Amount formatted
  formattedAmount: {
    type: GraphQLString,
    description: "Transaction amount formatted to BRL",
    resolve: (transaction) => transaction.getFormattedAmount(),
  },

  // Description
  description: {
    type: GraphQLString,
    description: "Transaction description or memo",
    resolve: (transaction) => transaction.description,
  },

  // Status
  status: {
    type: GraphQLString,
    description: "Transaction status (pending, completed, failed, cancelled)",
    resolve: (transaction) => transaction.status,
  },

  // Type
  type: {
    type: GraphQLString,
    description: "Transaction type (transfer, deposit, withdrawal)",
    resolve: (transaction) => transaction.type,
  },

  // Transaction date
  createdAt: {
    type: GraphQLString,
    description: "Transaction creation date in ISO format",
    resolve: (transaction) => transaction.createdAt.toISOString(),
  },
  
});

export default TransactionType;
