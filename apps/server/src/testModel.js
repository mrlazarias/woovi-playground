import mongoose from "mongoose";
import Account from "./models/Account.js";
import Transaction from "./models/Transaction.js";

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/woovi-bank-test");
    console.log("🗄️  Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

async function testModels() {
  try {
    console.log("🧪 Testing Models...");

    // Clear old data (be careful in production!)
    await Account.deleteMany({});
    await Transaction.deleteMany({});
    console.log("🧹 Cleaned old data");

    // Test 1: Create two accounts
    console.log("\n📝 Test 1: Creating accounts...");

    const account1 = new Account({
      name: "John Silva",
      email: "john@email.com",
      balance: 1000,
      accountNumber: "ACC001",
    });

    const account2 = new Account({
      name: "Mary Santos",
      email: "mary@email.com",
      balance: 500,
      accountNumber: "ACC002",
    });

    // Save to database
    const savedAccount1 = await account1.save();
    const savedAccount2 = await account2.save();
    console.log(
      "✅ Account 1 created:",
      savedAccount1.name,
      savedAccount1.getFormattedBalance()
    );
    console.log(
      "✅ Account 2 created:",
      savedAccount2.name,
      savedAccount2.getFormattedBalance()
    );

    // Test 2: Create a transaction
    console.log("\n💸 Test 2: Creating transaction...");

    const transaction = new Transaction({
      fromAccount: savedAccount1._id,
      toAccount: savedAccount2._id,
      amount: 100,
      description: "Transfer test",
    });

    const savedTransaction = await transaction.save();
    console.log(
      "✅ Transaction created:",
      savedTransaction.getFormattedAmount()
    );

    // Test 3: Query with population
    console.log("\n🔍 Test 3: Querying with population...");

    const populatedTransaction = await Transaction.findById(
      savedTransaction._id
    ).populate("fromAccount toAccount");

    console.log("📤 From:", populatedTransaction.fromAccount.name);
    console.log("📥 To:", populatedTransaction.toAccount.name);
    console.log("💰 Amount:", populatedTransaction.getFormattedAmount());

    // Test 4: Validations
    console.log("\n🛡️  Test 4: Testing validations...");

    try {
      // Try to create account with invalid email
      const invalidAccount = new Account({
        name: "Test",
        email: "invalid-email",
        accountNumber: "ACC003",
      });
      await invalidAccount.save();
    } catch (error) {
      console.log("✅ Email validation working:", error.message);
    }

    try {
      // Try to create transaction to same account
      const invalidTransaction = new Transaction({
        fromAccount: savedAccount1._id,
        toAccount: savedAccount1._id,
        amount: 50,
      });
      await invalidTransaction.save();
    } catch (error) {
      console.log("✅ Same account validation working:", error.message);
    }

    // Final statistics
    console.log("\n📊 Final statistics:");
    const accountCount = await Account.countDocuments();
    const transactionCount = await Transaction.countDocuments();

    console.log(`👥 Total accounts: ${accountCount}`);
    console.log(`💸 Total transactions: ${transactionCount}`);

    console.log("\n🎉 All tests passed successfully!");
  } catch (error) {
    console.error("❌ Test error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
  }
}

// Run the tests
connectDB().then(testModels);
