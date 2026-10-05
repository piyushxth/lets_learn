import "dotenv/config";
import express from "express";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { loggerMiddleware } from "./middleware/logger.middleware.js";
import logger from "./lib/logger.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.use("/api", apiRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
