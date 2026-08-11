import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    conversationid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    
  },
  {
    tableName: "messages",
    timestamps: true,
  }
);