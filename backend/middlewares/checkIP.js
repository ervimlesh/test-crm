export const checkIP = async (req, res, next) => {
  try {
 
    const userIP =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip;
 
    const cleanIP = userIP.replace("::ffff:", "");
   
    const ALLOWED_IP = process.env.ALLOWED_IP;
 
    if (cleanIP !== ALLOWED_IP) {
      return res
        .status(403)
        .json({ success: false, restricted: true, message: "IP Restricted" });
    }
 
    next();
  } catch (error) {
    console.log("IP Check Error", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};