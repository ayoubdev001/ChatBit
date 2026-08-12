import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Conversation = sequelize.define(
  "Conversation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("en_attente", "en_cours", "fermee"),
      allowNull: false,
      defaultValue: "en_attente",
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    agentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "conversations",
    timestamps: true,
  }
);