import resendClient from "../config/resend.js";

const verificationTemplate = `
Hello,

Here's your verification code: <strong>{{CODE}}</strong>

Thank you!
`;

const resetPasswrordTemplate = `
Hello,

You have requested to reset your password. Use the following link to reset it: 

<button style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;" href="{{LINK}}">Reset Password</button>

If you did not request this, please ignore this email.
`;

export const emailTemplates = {
  verification: verificationTemplate,
  resetPassword: resetPasswrordTemplate,
};

export async function sendEmailWithResend(to, from, subject, htmlBody) {
  const { data, error } = await resendClient.emails.send({
    to: to,
    from: from,
    subject: subject,
    html: htmlBody,
  });
  if (error) {
    return { success: false, data: error };
  }
  return { success: true, data: data };
}
