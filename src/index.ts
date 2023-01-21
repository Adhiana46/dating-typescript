import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  // check env variables
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  const port = process.env.PORT || 3000;

  try {
    mongoose.set("strictQuery", false); // mongoose v7
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }

  app.listen(port, () => {
    console.log("Express started. Listening on %s", port);
  });
};

start();
