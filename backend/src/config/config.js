import dotenv from "dotenv";

dotenv.config();

const cfg = {
  port: getFromEnv("PORT"),
  nodeEnv: getFromEnv("NODE_ENV"),
  mongoURI: getFromEnv("MONGO_URI"),
  //   jwtSecret: getFromEnv("JWT_SECRET"),
  awsAccessKeyId: getFromEnv("AWS_ACCESS_KEY_ID"),
  awsSecretAccessKey: getFromEnv("AWS_SECRET_ACCESS_KEY"),
  s3Region: getFromEnv("S3_REGION"),
  s3BucketName: getFromEnv("S3_BUCKET_NAME"),
  sesRegion: getFromEnv("SES_REGION"),
  sesDomain: getFromEnv("SES_DOMAIN"),
};

function getFromEnv(key) {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return val;
}

export default cfg;
