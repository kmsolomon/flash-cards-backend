import * as dotenv from "dotenv";
import { app } from "./app";

dotenv.config();

const PORT = process.env.PORT;

const start = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

void start();
