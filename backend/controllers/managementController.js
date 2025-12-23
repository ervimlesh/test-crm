import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import EmployeeSlip from "../models/employeeSlipModel.js";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import getStream from "get-stream";
import puppeteer from "puppeteer";

//  Convert "HH:mm:ss" → total seconds of the day
const parseHHMMSS = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m, s] = timeStr.split(":").map(Number);
  return h * 3600 + m * 60 + s;
};

//  Calculate duration in seconds
const calculateDuration = (inTime, outTime) => {
  if (!inTime || !outTime) return 0;
  return Math.max(0, parseHHMMSS(outTime) - parseHHMMSS(inTime));
};

// Punch In
export const punchIn = async (req, res) => {
  try {
    const { breakType } = req.body;
    const employeeId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let record = await Attendance.findOne({
      employee: employeeId,
      date: { $gte: today },
    });

    const now = new Date();
    const nowHHMMSS = now.toTimeString().slice(0, 8); // HH:mm:ss

    if (!record) {
      record = new Attendance({ employee: employeeId, date: today });
    }

    if (!breakType) {
      // Main shift
      record.sessions.push({
        in: nowHHMMSS,
        duration: 0,
      });
      record.punchHistory.push({
        date: now,
        in: nowHHMMSS,
        duration: 0,
      });
    } else {
      // Break
      record[breakType].push({
        in: nowHHMMSS,
        duration: 0,
      });
    }

    await record.save();
    res.json({ success: true, record });
  } catch (err) {
    console.error("Punch In Error:", err);
    res.status(500).json({ success: false, message: "Error punching in" });
  }
};

//  Punch Out
export const punchOut = async (req, res) => {
  try {
    const { breakType } = req.body;
    const employeeId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let record = await Attendance.findOne({
      employee: employeeId,
      date: { $gte: today },
    });

    if (!record) return res.status(404).json({ message: "No record found" });

    const now = new Date();
    const nowHHMMSS = now.toTimeString().slice(0, 8);

    if (!breakType) {
      // Main session
      const lastSession = record.sessions[record.sessions.length - 1];
      if (!lastSession || lastSession.out)
        return res.status(400).json({ message: "No active session" });

      lastSession.out = nowHHMMSS;
      lastSession.duration = calculateDuration(lastSession.in, lastSession.out);

      // Update total shift
      record.totalShiftDuration =
        (record.totalShiftDuration || 0) + lastSession.duration;

      // Sync punchHistory
      const lastHistory = record.punchHistory[record.punchHistory.length - 1];
      if (lastHistory && !lastHistory.out) {
        lastHistory.out = nowHHMMSS;
        lastHistory.duration = lastSession.duration;
      }
    } else {
      // Break
      const breakArr = record[breakType];
      const lastBreak = breakArr[breakArr.length - 1];
      if (!lastBreak || lastBreak.out)
        return res.status(400).json({ message: "No active break" });

      lastBreak.out = nowHHMMSS;
      lastBreak.duration = calculateDuration(lastBreak.in, lastBreak.out);
    }

    await record.save();
    res.json({ success: true, record });
  } catch (err) {
    console.error("Punch Out Error:", err);
    res.status(500).json({ success: false, message: "Error punching out" });
  }
};

//  Get today's record
export const getTodayRecord = async (req, res) => {
  try {
    const employeeId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let record = await Attendance.findOne({
      employee: employeeId,
      date: { $gte: today },
    });

    if (record) {
      const nowHHMMSS = new Date().toTimeString().slice(0, 8);

      // Live main session
      const lastSession = record.sessions[record.sessions.length - 1];
      if (lastSession && lastSession.in && !lastSession.out) {
        lastSession.duration = calculateDuration(lastSession.in, nowHHMMSS);
      }

      // Live breaks
      ["teaBreak1", "lunchBreak", "teaBreak2"].forEach((breakType) => {
        const breakArr = record[breakType];
        if (breakArr?.length) {
          const lastBreak = breakArr[breakArr.length - 1];
          if (lastBreak.in && !lastBreak.out) {
            lastBreak.duration = calculateDuration(lastBreak.in, nowHHMMSS);
          }
        }
      });
    }

    res.json(record || {});
  } catch (err) {
    console.error("Get Today Record Error:", err);
    res.status(500).json({ success: false, message: "Error fetching data" });
  }
};

export const getAllLoginAttendance = async (req, res) => {
  try {
    console.log("hey it is calling for getallloginAttendance.....")
    const employeeId = req.user._id;
    const { from, to } = req.query;

    console.log("from is", from);
    console.log("to is", to);

    let query = { employee: employeeId };

    if (from && to) {
      query.date = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const records = await Attendance.find(query)
      .sort({ date: -1 })
      .populate("employee");

    res.json(records);
  } catch (err) {
    console.error("Get All Attendance Error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching all attendance data",
    });
  }
};

export const getAllEmployeeController = async (req, res) => {
  try {
    const employees = await User.find({ isTrashed: false });

    res.status(200).send({
      success: true,
      message: "Employees fetched successfully",
      data: employees,
    });
  } catch (error) {
    console.error("Error fetching employees", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

// Get full attendance for a single employee
export const getAttendanceByEmployeeController = async (req, res) => {
  try {
    const { id } = req.params;

    // check if employee exists
    const employee = await User.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // fetch attendance records for that employee
    const attendanceRecords = await Attendance.find({ employee: id })
      .populate("employee", "userName email role")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: "Attendance records fetched successfully",
      employee: {
        id: employee._id,
        name: employee.userName,
        email: employee.email,
        role: employee.role,
      },
      attendance: attendanceRecords,
    });
  } catch (error) {
    console.error("Error fetching attendance", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// -------------------------------------------Slips--------------------------------

export const pdfSlipController = async (req, res) => {
  try {
    const { data } = req.body;

    // Compute totals
    const totals = {
      earnings:
        (data.basic || 0) +
        (data.hra || 0) +
        (data.conveyance || 0) +
        (data.medical || 0) +
        (data.specialAllowance || 0) +
        (data.bonus || 0) +
        (data.otherEarnings || 0),
      deductions:
        (data.pf || 0) +
        (data.professionalTax || 0) +
        (data.incomeTax || 0) +
        (data.esic || 0) +
        (data.otherDeductions || 0),
    };
    totals.net = totals.earnings - totals.deductions;

    // Build HTML
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Salary Slip</title>
      <style>
        body { font-family: Arial, sans-serif; margin:0; padding:20px; }
        .salary-slip { max-width:800px; margin:auto; background:#fff; border:1px solid #ddd; border-radius:8px; padding:25px 30px; }
        .header { text-align:center; border-bottom:2px solid #eee; padding-bottom:10px; margin-bottom:20px; }
        .header h2 { margin:0; font-size:22px; }
        .header p { margin:3px 0; font-size:13px; color:#666; }
        .slip-title { font-size:18px; font-weight:600; margin:10px 0; text-align:center; background:#fdf3ec; padding:10px; border-radius:6px; color:#b45d28; }
        .details { margin-bottom:20px; font-size:14px; }
        .details p { margin:5px 0; }
        .table-section { display:flex; justify-content:space-between; margin-bottom:20px; gap:20px; }
        .table-section table { width:100%; border-collapse:collapse; font-size:14px; }
        .table-section th { text-align:left; font-size:14px; padding-bottom:8px; color:#444; border-bottom:1px solid #ccc; }
        .table-section td { padding:6px 0; border-bottom:1px dashed #eee; }
        .totals { font-size:15px; margin:15px 0; }
        .totals strong { font-size:16px; color:#222; }
        .net-pay { font-size:18px; font-weight:700; color:#2a6c2a; margin-top:10px; padding:10px; background:#e9f7ec; border-radius:6px; }
        .notes { margin-top:20px; font-size:12px; color:#666; }
        .footer { text-align:center; font-size:12px; color:#999; margin-top:30px; border-top:1px solid #eee; padding-top:10px; }
      </style>
    </head>
    <body>
      <div class="salary-slip">
        <div class="header">
          <h2>${data.companyName || "Company Name"}</h2>
          <p>${data.companyAddress || ""}</p>
        </div>

        <div class="slip-title">Salary Slip - ${data.payPeriod || ""}</div>

        <div class="details">
          <p><strong>Employee:</strong> ${data.empName || ""} (${
      data.empId || ""
    })</p>
          <p><strong>Designation:</strong> ${
            data.designation || ""
          } &nbsp;&nbsp; <strong>Department:</strong> ${
      data.department || ""
    }</p>
          <p><strong>Pay Date:</strong> ${
            data.payDate || ""
          } &nbsp;&nbsp; <strong>Slip No:</strong> ${data.slipNo || ""}</p>
        </div>

        <div class="table-section">
          <div style="flex:1;">
            <table>
              <thead><tr><th>Earnings</th><th>Amount (₹)</th></tr></thead>
              <tbody>
                <tr><td>Basic</td><td>${data.basic || 0}</td></tr>
                <tr><td>HRA</td><td>${data.hra || 0}</td></tr>
                <tr><td>Conveyance</td><td>${data.conveyance || 0}</td></tr>
                <tr><td>Medical</td><td>${data.medical || 0}</td></tr>
                <tr><td>Special Allowance</td><td>${
                  data.specialAllowance || 0
                }</td></tr>
                <tr><td>Bonus</td><td>${data.bonus || 0}</td></tr>
                <tr><td>Other</td><td>${data.otherEarnings || 0}</td></tr>
              </tbody>
            </table>
          </div>
          <div style="flex:1;">
            <table>
              <thead><tr><th>Deductions</th><th>Amount (₹)</th></tr></thead>
              <tbody>
                <tr><td>PF</td><td>${data.pf || 0}</td></tr>
                <tr><td>Professional Tax</td><td>${
                  data.professionalTax || 0
                }</td></tr>
                <tr><td>Income Tax</td><td>${data.incomeTax || 0}</td></tr>
                <tr><td>ESIC</td><td>${data.esic || 0}</td></tr>
                <tr><td>Other</td><td>${data.otherDeductions || 0}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="totals">
          <p><strong>Total Earnings:</strong> ₹${
            totals.earnings
          } &nbsp;&nbsp; <strong>Total Deductions:</strong> ₹${
      totals.deductions
    }</p>
          <div class="net-pay">Net Pay: ₹${totals.net}</div>
        </div>

        <div class="notes"><p>${
          data.notes ||
          "This is a system-generated payslip and does not require signature."
        }</p></div>
        <div class="footer">${
          data.companyName || "Company"
        } | www.company.com</div>
      </div>
    </body>
    </html>`;

    // Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // fixes some hosting issues
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
    });

    await browser.close();

    // Send PDF with proper headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=salary-slip.pdf"
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    return res.end(pdfBuffer);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ message: "Could not generate PDF" });
  }
};

export const sendSlipController = async (req, res) => {
  try {
    const {
      companyName,
      companyAddress,
      payPeriod,
      payDate,
      slipNo,
      empId,
      empName,
      designation,
      department,
      pan,
      uan,
      pfNo,
      esicNo,
      bankName,
      accountNo,
      ifsc,
      paymentMode,
      daysInMonth,
      daysPresent,
      leaves,
      paidLeaves,
      overtimeHours,
      basic,
      hra,
      conveyance,
      medical,
      specialAllowance,
      bonus,
      otherEarnings,
      pf,
      professionalTax,
      incomeTax,
      esic,
      otherDeductions,
      notes,
      employeeEmail,
      employee,
    } = req.body.data;

    // Totals
    const totals = {
      earnings:
        (basic || 0) +
        (hra || 0) +
        (conveyance || 0) +
        (medical || 0) +
        (specialAllowance || 0) +
        (bonus || 0) +
        (otherEarnings || 0),
      deductions:
        (pf || 0) +
        (professionalTax || 0) +
        (incomeTax || 0) +
        (esic || 0) +
        (otherDeductions || 0),
    };

    totals.net = totals.earnings - totals.deductions;

    console.log("req.body", req.body);
 
    // Find the user
    const user = await User.findOne({email:employeeEmail});

    console.log("user is ", user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Save all slip fields in user.document array for monthly records
    user.document.push({
      companyName,
      companyAddress,
      payPeriod,
      payDate,
      slipNo,
      bankName,
      empId,
      accountNo,
      ifsc,
      designation,
      department,
      paymentMode,
      pan,
      uan,
      daysInMonth,
      daysPresent,
      leaves,
      paidLeaves,
      overtimeHours,
      pfNo,
      esicNo,
      basic,
      hra,
      conveyance,
      pf,
      esic,
      medical,
      specialAllowance,
      bonus,
      otherEarnings,
      professionalTax,
      incomeTax,
      otherDeductions,
      notes,
      employeeEmail,
      totals: {
        earnings: totals.earnings,
        deductions: totals.deductions,
        net: totals.net,
      },
      createdAt: new Date(),
    });

    await user.save();

    console.log("usrs s is update ", user);

    // HTML Template
    const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .slip-container {
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
            max-width: 700px;
            margin: auto;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #f4f4f4;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .header h2 {
            margin: 0;
            color: #444;
          }
          .header p {
            margin: 3px 0;
            font-size: 12px;
            color: #666;
          }
          .netpay-box {
            text-align: right;
            background: #fef3f2;
            border: 1px solid #fcdcdc;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 14px;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 5px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 6px 10px;
            font-size: 13px;
          }
          th {
            background: #f9f9f9;
            text-align: left;
          }
          .footer {
            margin-top: 30px;
            font-size: 11px;
            text-align: center;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="slip-container">
          <div class="header">
            <h2>${companyName || ""}</h2>
            <p>${companyAddress || ""}</p>
          </div>

          <div class="netpay-box">
            Net Pay: ₹${totals.net || 0}
          </div>

          <div>
            <p><strong>Employee:</strong> ${empName || ""} (${empId || ""})</p>
            <p><strong>Designation:</strong> ${designation || ""} | 
               <strong>Department:</strong> ${department || ""}</p>
            <p><strong>Pay Period:</strong> ${payPeriod || ""} | 
               <strong>Pay Date:</strong> ${payDate || ""} | 
               <strong>Slip No:</strong> ${slipNo || ""}</p>
          </div>

          <div class="section-title">Employee Details</div>
          <table>
            <tr><th>PAN</th><td>${pan || ""}</td></tr>
            <tr><th>UAN</th><td>${uan || ""}</td></tr>
            <tr><th>PF No</th><td>${pfNo || ""}</td></tr>
            <tr><th>ESIC No</th><td>${esicNo || ""}</td></tr>
            <tr><th>Bank Name</th><td>${bankName || ""}</td></tr>
            <tr><th>Account No</th><td>${accountNo || ""}</td></tr>
            <tr><th>IFSC</th><td>${ifsc || ""}</td></tr>
            <tr><th>Payment Mode</th><td>${paymentMode || ""}</td></tr>
            <tr><th>Days in Month</th><td>${daysInMonth || 0}</td></tr>
            <tr><th>Days Present</th><td>${daysPresent || 0}</td></tr>
            <tr><th>Leaves</th><td>${leaves || 0}</td></tr>
            <tr><th>Paid Leaves</th><td>${paidLeaves || 0}</td></tr>
            <tr><th>Overtime Hours</th><td>${overtimeHours || 0}</td></tr>
          </table>

          <div class="section-title">Earnings</div>
          <table>
            <tr><th>Component</th><th>Amount</th></tr>
            <tr><td>Basic</td><td>₹${basic || 0}</td></tr>
            <tr><td>HRA</td><td>₹${hra || 0}</td></tr>
            <tr><td>Conveyance</td><td>₹${conveyance || 0}</td></tr>
            <tr><td>Medical</td><td>₹${medical || 0}</td></tr>
            <tr><td>Special Allowance</td><td>₹${
              specialAllowance || 0
            }</td></tr>
            <tr><td>Bonus</td><td>₹${bonus || 0}</td></tr>
            <tr><td>Other</td><td>₹${otherEarnings || 0}</td></tr>
          </table>

          <div class="section-title">Deductions</div>
          <table>
            <tr><th>Component</th><th>Amount</th></tr>
            <tr><td>PF</td><td>₹${pf || 0}</td></tr>
            <tr><td>Professional Tax</td><td>₹${professionalTax || 0}</td></tr>
            <tr><td>Income Tax</td><td>₹${incomeTax || 0}</td></tr>
            <tr><td>ESIC</td><td>₹${esic || 0}</td></tr>
            <tr><td>Other</td><td>₹${otherDeductions || 0}</td></tr>
          </table>

          <div class="section-title">Summary</div>
          <p><strong>Total Earnings:</strong> ₹${totals.earnings || 0}</p>
          <p><strong>Total Deductions:</strong> ₹${totals.deductions || 0}</p>
          <p><strong>Net Pay:</strong> ₹${totals.net || 0}</p>

          <div class="footer">
            ${notes || "This is a system generated salary slip."}
          </div>
        </div>
      </body>
    </html>`;

    // Generate PDF with Puppeteer
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: employee?.email || employeeEmail,
      subject: `Salary Slip - ${payPeriod} - ${empName}`,
      html: `
        <p>Dear ${empName},</p>
        <p>Please find attached your salary slip for <strong>${payPeriod}</strong>.</p>
        <p>Regards,<br/>${companyName}</p>
      `,
      attachments: [
        {
          filename: `${empName || "salary"}-slip-${payPeriod || ""}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Salary slip sent to " + (employee?.email || employeeEmail),
    });
  } catch (err) {
    console.error("Error sending slip:", err);
    res.status(500).json({ success: false, message: "Failed to send slip" });
  }
};
