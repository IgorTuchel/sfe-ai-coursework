import express from "express";
import cors from "cors";
import serviceStartup from "./config/startup.js";
import multer from "multer";
import { fileTypeFromBuffer } from "file-type";
import { uploadObjectToS3 } from "./services/putObjectS3.js";
import usersRouter from "./routes/users.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// TEMP CODE

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  console.log(
    `Received file: ${req.file.originalname}, size: ${req.file.size} bytes`
  );

  const fileType = await fileTypeFromBuffer(req.file.buffer);
  if (!fileType) {
    return res.status(400).send("Could not determine file type.");
  }
  if (fileType.mime !== "image/png" && fileType.mime !== "image/jpeg") {
    return res.status(400).send("Only PNG and JPEG files are allowed.");
  }

  const data = await uploadObjectToS3(
    req.file.originalname,
    req.file.buffer,
    fileType.mime
  );

  if (!data.success) {
    return res.status(500).send("Error uploading file to S3.");
  }
  console.log("File uploaded to S3:", data.data);
  res.send("File uploaded successfully.");
});

// END TEMP CODE

app.use("/users", usersRouter);

app.listen(3000, async () => {
  await serviceStartup();

  console.log("Server is running on http://localhost:3000");
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Internal Server Error xd");
});
