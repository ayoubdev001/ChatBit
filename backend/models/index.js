import { sequelize } from "../config/database.js";
import { User } from "./User.js";
import { Conversation } from "./Conversation.js";
import { Message } from "./Message.js";


User.hasMany(Conversation, { foreignKey: "clientId", as: "clientConversations" });
Conversation.belongsTo(User, { foreignKey: "clientId", as: "client" });

User.hasMany(Conversation, { foreignKey: "agentId", as: "agentConversations" });
Conversation.belongsTo(User, { foreignKey: "agentId", as: "agent" });

Conversation.hasMany(Message, { foreignKey: "conversationId", as: "messages" });
Message.belongsTo(Conversation, { foreignKey: "conversationId" });

User.hasMany(Message, { foreignKey: "senderId", as: "sentMessages" });
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });

export { sequelize, User, Conversation, Message };