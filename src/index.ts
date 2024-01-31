import * as dotenv from "dotenv";
import { connectToDatabase } from "./utils/db";
import { app } from "./app";

dotenv.config();

const PORT = process.env.PORT;

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

void start();
