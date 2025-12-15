/**
 * @file sendEmail.js
 * @description Service for sending emails using Resend API.
 * Provides email templates for common use cases (verification, password reset)
 * and functionality to send HTML emails.
 * @module services/sendEmail
 */

import resendClient from "../config/resend.js";

const verificationTemplate = `
Hello,
<br/><br/>
Here's your verification code: <strong>{{CODE}}</strong>
<br/><br/>
This code is valid for 5 minutes.
<br/><br/>
Thank you!
`;

const resetPasswrordTemplate = `
Hello,
<br/><br/>
You have requested to reset your password. Use the following link to reset it: 
<br/><br/>
<a href="{{LINK}}">Click Here</a>
<br/><br/>
If you did not request this, please ignore this email.
`;

/**
 * Predefined HTML email templates for common use cases.
 * @type {Object}
 * @property {string} verification - Email template for verification codes. Replace {{CODE}} with actual code.
 * @property {string} resetPassword - Email template for password reset. Replace {{LINK}} with reset URL.
 *
 * @example
 * const emailBody = emailTemplates.verification.replace("{{CODE}}", "123456");
 */
export const emailTemplates = {
  verification: verificationTemplate,
  resetPassword: resetPasswrordTemplate,
};

/**
 * Sends an HTML email using Resend API.
 *
 * @async
 * @param {string|string[]} to - Recipient email address(es).
 * @param {string} from - Sender email address (must be verified domain in Resend).
 * @param {string} subject - Email subject line.
 * @param {string} htmlBody - HTML content of the email body.
 * @returns {Promise<Object>} Response object with success status and data or error message.
 * @returns {boolean} returns.success - Whether the email was sent successfully.
 * @returns {Object|string} returns.data - Resend API response data if successful, error message if failed.
 *
 * @description Sends an email via Resend API. Use emailTemplates for common scenarios
 * and replace placeholder values ({{CODE}}, {{LINK}}) before passing to htmlBody.
 *
 * @example
 * const emailBody = emailTemplates.verification.replace("{{CODE}}", "123456");
 * const result = await sendEmailWithResend(
 *   "user@example.com",
 *   "noreply@yourdomain.com",
 *   "Verify Your Email",
 *   emailBody
 * );
 * if (result.success) {
 *   console.log("Email sent:", result.data);
 * }
 *
 * @example
 * const resetLink = "https://yourdomain.com/reset?token=abc123";
 * const emailBody = emailTemplates.resetPassword.replace("{{LINK}}", resetLink);
 * await sendEmailWithResend(
 *   "user@example.com",
 *   "noreply@yourdomain.com",
 *   "Reset Your Password",
 *   emailBody
 * );
 */
export async function sendEmailWithResend(to, from, subject, htmlBody) {
  const { data, error } = await resendClient.emails.send({
    to: to,
    from: from,
    subject: subject,
    html: htmlBody,
  });
  if (error) {
    console.log("Error sending email with Resend:", error);
    return { success: false, data: "Failed to send email." };
  }
  return { success: true, data: data };
}
