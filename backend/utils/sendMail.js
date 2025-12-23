
// import {
//   defaultTransporter,
//   authTransporter,
//   invoiceTransporter,
// } from "./mailer.js";

// export const sendMail = async (to, subject, html, from = process.env.EMAIL) => {
//   let transporter;


//   if (from === process.env.AUTH_EMAIL) {
//     console.log("calling for auth vimlesh")
//     transporter = authTransporter;
//   } else if (from === process.env.INVOICE_EMAIL) {
//     transporter = invoiceTransporter;
//   } else {
//     transporter = defaultTransporter; 
//   }

//   const mailOptions = { from, to, subject, html };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`📧 Email sent from ${from}:`, info.messageId);
//     return info;
//   } catch (err) {
//     console.error("❌ Email send failed:", err);
//     throw err;
//   }
// };

// sendMail.js
import { createDynamicTransporter } from "./mailer.js";

export const sendMail = async (to, subject, html, authCredentials) => {
  console.log("authcrediential is",authCredentials)
  console.log("sendmail is",authCredentials.authMails,authCredentials.authPassword)
  if (!authCredentials || !authCredentials.authMails || !authCredentials.authPassword) {
   console.log("giving error")
    throw new Error("Missing auth mail credentials.");
  }

  const transporter = createDynamicTransporter(
    authCredentials.authMails,
    authCredentials.authPassword
  );

  const mailOptions = {
    from: authCredentials.authMails,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📨 Email sent from ${authCredentials.authMails}:`, info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    throw err;
  }
};
