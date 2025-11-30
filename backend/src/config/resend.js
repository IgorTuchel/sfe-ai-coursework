import cfg from "./config.js";
import { Resend } from "resend";

const resendClient = await new Resend(cfg.resendApiKey);

export default resendClient;
