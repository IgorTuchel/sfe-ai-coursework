import cfg from "./config.js";
import ses from "@aws-sdk/client-ses";

const sesClient = new ses.SESClient({
  region: cfg.sesRegion,
  credentials: {
    accessKeyId: cfg.awsAccessKeyId,
    secretAccessKey: cfg.awsSecretAccessKey,
  },
});

export default sesClient;
