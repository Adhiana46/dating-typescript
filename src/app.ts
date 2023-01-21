import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import { NotFoundError } from "./errors";
import { errorHandler } from "./middlewares";

import { ProfileRouter, CommentRouter } from "./routes";

const app = express();
app.use(json());

app.use("/api/v1/profile", ProfileRouter);
app.use("/api/v1/profile", CommentRouter);

app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
