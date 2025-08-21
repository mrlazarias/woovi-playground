import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  // Person Info (Required)
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  // Email (Required and Unique)
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  // Balance (always positive)
  balance: {
    type: Number,
    default: 0,
    min: [0, "Balance cannot be negative"],
  },
  // Created at (default to current date)
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Updated at (default to current date)
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware: always save and refresh
AccountSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Format method real balance
AccountSchema.methods.getFormattedBalance = function () {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(this.balance);
};

// Perfomance: Indexing
AccountSchema.index({ email: 1 });
AccountSchema.index({ accountNumber: 1 });
AccountSchema.index({ createdAt: 1 });

export default mongoose.model("Account", AccountSchema);
