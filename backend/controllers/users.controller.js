import { User } from "../models/index.js";

// GET /api/users/me
export async function getMe(req, res, next) {
  // Try to get the user from the database
  try {
    // Find the user using the userId stored in the verified JWT
    const user = await User.findByPk(req.user.userId, {
      // Return only safe user information, not the password hash
      attributes: ["id", "fullname", "email", "role", "isOnline"],
    });

    // Check if the user does not exist
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the user's information back to the frontend
    res.json(user);
  } catch (err) {
    next(err);
  }
}

//look for all agents
export async function getAllAgents(req, res, next) {
  try {
    const agents = await User.findAll({
      where: { role: "agent" },
      order: [["createdAt", "ASC"]],
    });

    //create with agent 
    res.status(200).json({ agents });
  } catch (err) {
    next(err);
  }
}