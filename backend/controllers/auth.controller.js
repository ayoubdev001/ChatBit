import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

// POST register
export async function register(req, res, next) {
  try {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!["client", "agent"].includes(role)) {
      return res.status(400).json({ error: "Role must be 'client' or 'agent'" });
    }

    if (password.length < 4) {
  return res.status(400).json({ error: "Password must be at least 4 characters" });
}


    // check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }
    
    // hash the password before storing
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ fullname, email, passwordHash, role });

    //respond to frontend without the hash of pass
    res.status(201).json({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
}

// POST login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
 
    // look for the email in database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    //compare thr passwords hash
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    // put the infos in the token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    //send back to frontend
    res.json({
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}