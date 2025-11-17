import dotenv from 'dotenv';
dotenv.config();
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  const msg = {
    to,
    from: "shalman4502n@gmail.com",
    subject,
    text,
    html,
  };

  await sgMail.send(msg);
};

export default sendEmail;
