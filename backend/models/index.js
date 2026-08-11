import { sequelize } from "../config/database.js";
import { User } from "./User.js";
import { Conversation } from "./Conversation.js";
import { Message } from "./Message.js";


User.hasMany(Conversation, { foreignKey: "clientid", as: "clientConversations" });
Conversation.belongsTo(User, { foreignKey: "clientid", as: "client" });


User.hasMany(Conversation, { foreignKey: "agentid", as: "agentConversations" });
Conversation.belongsTo(User, { foreignKey: "agentid", as: "agent" });


Conversation.hasMany(Message, { foreignKey: "conversationid", as: "messages" });
Message.belongsTo(Conversation, { foreignKey: "conversationid" });


User.hasMany(Message, { foreignKey: "senderid", as: "sentMessages" });
Message.belongsTo(User, { foreignKey: "senderid", as: "sender" });

export { sequelize, User, Conversation, Message };