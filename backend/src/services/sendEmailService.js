import sesClient from "../config/ses.js";
import { SendEmailCommand } from "@aws-sdk/client-ses";

const verificationTemplate = `
Hello,

Here's your verification code: {{CODE}}

Thank you!
`;

const resetPasswrordTemplate = `
Hello,

You have requested to reset your password. Use the following link to reset it: 

{{LINK}}

If you did not request this, please ignore this email.
`;

export const emailTemplates = {
  verification: verificationTemplate,
  resetPassword: resetPasswrordTemplate,
};

export async function sendEmail(to, from, subject, body) {
  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Text: { Data: body, Charset: "UTF-8" },
      },
      Subject: { Data: subject },
    },
    Source: from,
  };

  const command = new SendEmailCommand(params);
  try {
    const data = await sesClient.send(command);
    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
