import JWT from "jsonwebtoken";
import User from "../models/User.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
   
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    
    req.user = decode;  
    next();
  } catch (error) {
    
    console.log(error);
     return res.status(401).send({ message: "Token expired or invalid" });
  }
};

export const protect = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const admin = async (req, res, next) => {


  // if (req.user.role === "admin" || req.user.role === "superadmin") {
  //   console.log("hello admin")
  //   next();
  // } else {
  //   res.status(403).json({ message: "Access denied" });
  // }
  const user = await User.findById(req.user._id);
  if (user.role === "admin" || user.role === "superadmin") {
    next();

  } else {
    return res.status(401).send({
      success: false,
      message: "UnAuthorized Access",
    });
  }
};

export const superAdmin = async (req, res, next) => {
  // if (req.user.role === "superadmin") {
  //   next();
  // } else {
  //   res.status(403).json({ message: "Access denied" });
  // }

  const user = await User.findById(req.user._id);
  if (user.role !== "superadmin") {
    return res.status(401).send({
      success: false,
      message: "UnAuthorized Access",
    });
  } else {

    next();
  }
};
// https://www.instagram.com/reel/DMK7XxISWp2/?utm_source=ig_web_copy_link
// air74542