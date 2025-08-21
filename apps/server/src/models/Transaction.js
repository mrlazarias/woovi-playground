import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  // Sender money account
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  // Receiver money account
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },

  // Transaction amount
  amount: {
    type: Number,
    required: true,
    min: [0, "Amount must be at least 0.01"],
    max: [999999.99, "Amount cannot exceed 999999.99"],
  },

  // Optional description
  description: {
    type: String,
    trim: true,
    maxlength: [200, "Description cannot exceed 200 characters"],
    default: "Money transfer",
  },

  // Status of transaction
  status: {
    type: String,
    enum: {
      values: ["pending", "completed", "failed", "cancelled"],
      message: "Status must be one of: pending, completed, failed, cancelled",
    },
    default: "completed",
  },

  // Transaction type
  type: {
    type: String,
    enum: ["deposit", "withdrawal", "transfer"],
    default: "transfer",
  },

  // Transaction date
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Audit data
  metadata: {
    userAgent: String,
    ipAdress: String,
    sessionId: String,
  },
});

// Custom validation: different accounts
TransactionSchema.pre("save", function (next) {
  if (this.fromAccount.equals(this.toAccount)) {
    next(new Error("Sender and receiver cannot be the same account"));
  } else {
    next();
  }
});

// Method to get formatted amount
TransactionSchema.methods.getFormattedAmount = function () {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(this.amount);
};

// Index to fast search
TransactionSchema.index({ fromAccount: 1, createdAt: -1 });
TransactionSchema.index({ toAccount: 1, createdAt: -1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ createdAt: -1 });

// Compound index to reports
TransactionSchema.index({ fromAccount: 1, toAccount: 1, createdAt: -1 });

export default mongoose.model("Transaction", TransactionSchema);
