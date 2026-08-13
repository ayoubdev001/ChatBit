import { Conversation, Message, User } from "../models/index.js";
import { Op } from "sequelize";

                                                      // POST /api/conversations - client creates a new conversation

export async function createConversation(req, res, next) {
  try {

    const { subject,agentId } = req.body;

    const agent = await User.findByPk(agentId)

    //reject if agent is missing OR not actually an agent
    if(!agent || agent.role !=="agent" ) {
        return res.status(404).json({error:"Agent Not found!"})
    }

    if (!subject) {
      return res.status(400).json({ error: "Subject is required" });
    }

    const conversation = await Conversation.create({
       //get the userId from the jwt verfaction not from the customer
      subject,
      agentId:agent.id,
      clientId: req.user.userId, 
      status: "en_attente",
    });

    res.status(201).json(conversation);
  } catch (err) {
    next(err);
  }
}; 

                                                   // get /api/conversations - what clint or agent see in deffrent

export async function getConversations(req, res, next) {
  try {
    let conversations;

    if (req.user.role === "client") {
      // Client sees only their own conversations
      conversations = await Conversation.findAll({
        where: { clientId: req.user.userId },
        order: [["createdAt", "DESC"]],
      });
    } else {
      // Agent sees waiting conversations or their own ongoing conversations
      conversations = await Conversation.findAll({
        where: {
          [Op.or]: [
            { status: "en_attente" },
            {
              status: "en_cours",
              agentId: req.user.userId,
            },
          ],
        },
        order: [["createdAt", "DESC"]],
      });
    }

    res.json(conversations);
  } catch (err) {
    next(err);
  }
}

                                              // GET /api/conversations/:id/messages - paginated message history

export async function getMessages(req, res, next) {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // find the conversation first, to check participation
    const conversation = await Conversation.findByPk(id);

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // only the client or the assigned agent can view messages
    const isParticipant =
      conversation.clientId === req.user.userId ||
      conversation.agentId === req.user.userId;

    if (!isParticipant) {
      return res.status(403).json({ error: "You are not part of this conversation" });
    }
    //find all messages
    const messages = await Message.findAll({
      where: { conversationId: id },
      order: [["createdAt", "ASC"]], // oldest first, like a chat history
      limit,
      offset,
    });

    res.json({
      page,
      limit,
      messages,
    });
  } catch (err) {
    next(err);
  }
}


                                              // PATCH /api/conversations/:id/close - agent closes their assigned conversation

export async function closeConversation(req, res, next) {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findByPk(id);

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // must be the agent actually assigned to this conversation
    if (conversation.agentId !== req.user.userId) {
      return res.status(403).json({ error: "You are not assigned to this conversation" });
    }

    if (conversation.status === "fermee") {
      return res.status(400).json({ error: "Conversation is already closed" });
    }

    conversation.status = "fermee";
    conversation.closedAt = new Date();
    await conversation.save();

    // TODO: broadcast conversation:updated via Socket.IO once sockets are built,
    // so the client is notified in real time and can no longer send messages

    res.json(conversation);
  } catch (err) {
    next(err);
  }
}

