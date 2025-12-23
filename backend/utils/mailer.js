

// mailer.js
// import nodemailer from "nodemailer";

// function createTransporter(user, pass) {
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST || "smtp.gmail.com",
//     port: process.env.SMTP_PORT || 465,
//     secure: true,
//     auth: { user, pass },
//     pool: true,
//     maxConnections: 5,
//     maxMessages: Infinity,
//     connectionTimeout: 20000,
//     greetingTimeout: 20000,
//     socketTimeout: 30000,
//   });

//   transporter.verify()
//     .then(() => console.log(` SMTP ready for ${user}`))
//     .catch(err => {
//       console.error(`❌ SMTP verify failed for ${user}:`, err);
//       if (err.code === 'ETIMEDOUT') {
//         console.error("Check your network, firewall, and SMTP credentials.");
//       }
//     });

//   return transporter;
// }


// export const defaultTransporter = createTransporter(
//   process.env.EMAIL,
//   process.env.PASSWORD
// );

// export const authTransporter = createTransporter(
//   process.env.AUTH_EMAIL,
//   process.env.AUTH_PASSWORD 
// );

// export const invoiceTransporter = createTransporter(
//   process.env.INVOICE_EMAIL,
//   process.env.INVOICE_PASSWORD
// );
// mailer.js
import nodemailer from "nodemailer";

export function createDynamicTransporter(user, pass) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 465,
    secure: true,
    auth: { user, pass },
    pool: true,
    maxConnections: 5,
    maxMessages: Infinity,
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 30000,
  });

  transporter.verify()
    .then(() => console.log(` SMTP ready for ${user}`))
    .catch(err => console.error(`❌ SMTP verify failed for ${user}:`, err));

  return transporter;
}
