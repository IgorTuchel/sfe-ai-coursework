import express from "express";
import cors from "cors";
import serviceStartup from "./config/startup.js";
import usersRouter from "./routes/userRoutes.js";
import resetPasswordRouter from "./routes/resetPasswordRoutes.js";
import characterRouter from "./routes/characterRoutes.js";
import cookieParser from "cookie-parser";
import { errorHandlingMiddleware } from "./middleware/errorMiddleware.js";
import chatRotuer from "./routes/chatRoute.js";
import cfg from "./config/config.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/users", usersRouter);
app.use("/reset-password", resetPasswordRouter);
app.use("/characters", characterRouter);
app.use("/chat", chatRotuer);

app.listen(cfg.port, async () => {
  await serviceStartup();

  console.log(`Server is running on http://localhost:${cfg.port}`);
});

app.use(errorHandlingMiddleware);
