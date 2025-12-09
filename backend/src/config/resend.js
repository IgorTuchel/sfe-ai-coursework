/**
 * @file resend.js
 * @description Configuration and initialization of the Resend email client.
 * Handles client creation for transactional email services.
 * @module config/resend
 */

import cfg from "./config.js";
import { Resend } from "resend";

/**
 * The configured Resend email client instance.
 * @type {Resend}
 * @description Client for sending transactional emails via Resend.
 * @see https://resend.com/docs/introduction
 */
const resendClient = new Resend(cfg.resendApiKey);

export default resendClient;
