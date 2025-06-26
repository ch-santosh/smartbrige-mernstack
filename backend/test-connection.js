const mongoose = require("mongoose")

const testConnection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/complaint-resolver", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ MongoDB connection successful!")
    console.log("Database:", mongoose.connection.name)
    console.log("Host:", mongoose.connection.host)
    console.log("Port:", mongoose.connection.port)

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log(
      "Collections:",
      collections.map((c) => c.name),
    )

    mongoose.connection.close()
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message)
  }
}

testConnection()
