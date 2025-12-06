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
    console.log("Error sending email with Resend:", error);
    return { success: false, data: "Failed to send email." };
  }
  return { success: true, data: data };
}
