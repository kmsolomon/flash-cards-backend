import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import flashCardRouter from "./routers/flashcard";
import cardSetRouter from "./routers/cardset";
import { handleError } from "./utils/request-error-middleware";

const app = express();
dotenv.config();

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

if (isString(process.env.ALLOWED_ORIGINS)) {
  const allowedOrigins = [process.env.ALLOWED_ORIGINS];
  const options: cors.CorsOptions = {
    origin: allowedOrigins,
  };

  app.use(
    (cors as (options: cors.CorsOptions) => express.RequestHandler)(options)
  );
}

console.log("The node env is", process.env.NODE_ENV);
app.use(express.json());
app.use("/api/flashcard", flashCardRouter);
app.use("/api/cardset", cardSetRouter);
app.use(handleError);

export { app };
