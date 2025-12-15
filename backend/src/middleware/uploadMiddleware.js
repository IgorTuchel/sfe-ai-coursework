/**
 * @file uploadMiddleware.js
 * @description Middleware for handling file uploads using Multer.
 * Provides in-memory file storage with size limits for processing and uploading to cloud storage.
 * @module middleware/uploadMiddleware
 */

import multer from "multer";

/**
 * Multer middleware configured for in-memory file uploads.
 * @type {multer.Multer}
 *
 * @description Configures Multer to store uploaded files in memory as Buffer objects
 * with a maximum file size limit of 5 MB. Files are stored temporarily in RAM
 * for processing or uploading to cloud storage (e.g., S3).
 *
 * Configuration:
 * - Storage: Memory storage (files accessible via req.file.buffer)
 * - Max file size: 5 MB (5,242,880 bytes)
 * - Exceeding limit triggers LIMIT_FILE_SIZE error (handled by errorHandlingMiddleware)
 *
 * @example
 * // Single file upload
 * app.post("/api/upload/avatar", upload.single("avatar"), (req, res) => {
 *   const fileBuffer = req.file.buffer;
 *   const fileName = req.file.originalname;
 *   // Process or upload to S3
 * });
 *
 * @example
 * // Multiple files upload
 * app.post("/api/upload/images", upload.array("images", 10), (req, res) => {
 *   req.files.forEach(file => {
 *     console.log(file.buffer, file.mimetype);
 *   });
 * });
 *
 * @example
 * // Multiple fields
 * app.post("/api/upload/profile", upload.fields([
 *   { name: "avatar", maxCount: 1 },
 *   { name: "documents", maxCount: 5 }
 * ]), (req, res) => {
 *   const avatar = req.files.avatar[0].buffer;
 *   const docs = req.files.documents;
 * });
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

export default upload;
