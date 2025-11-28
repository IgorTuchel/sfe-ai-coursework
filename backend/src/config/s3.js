import cfg from "./config.js";
import s3 from "@aws-sdk/client-s3";

const s3Client = new s3.S3Client({
  region: cfg.s3Region,
  credentials: {
    accessKeyId: cfg.awsAccessKeyId,
    secretAccessKey: cfg.awsSecretAccessKey,
  },
});

export default s3Client;
