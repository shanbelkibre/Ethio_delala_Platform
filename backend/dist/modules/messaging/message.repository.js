"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const database_1 = require("../../config/database");
class MessageRepository {
    static async sendMessage(data) {
        return database_1.prisma.message.create({
            data: {
                senderId: data.senderId,
                receiverId: data.receiverId,
                propertyId: data.propertyId,
                content: data.content,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        phone: true,
                        email: true,
                        profile: { select: { firstName: true, lastName: true, profileImageUrl: true } },
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        phone: true,
                        email: true,
                        profile: { select: { firstName: true, lastName: true, profileImageUrl: true } },
                    },
                },
            },
        });
    }
    static async getThread(user1Id, user2Id, propertyId) {
        return database_1.prisma.message.findMany({
            where: {
                OR: [
                    { senderId: user1Id, receiverId: user2Id },
                    { senderId: user2Id, receiverId: user1Id },
                ],
                ...(propertyId && { propertyId }),
            },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: {
                    select: {
                        id: true,
                        phone: true,
                        email: true,
                        profile: { select: { firstName: true, lastName: true, profileImageUrl: true } },
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        phone: true,
                        email: true,
                        profile: { select: { firstName: true, lastName: true, profileImageUrl: true } },
                    },
                },
            },
        });
    }
    static async getUserConversations(userId) {
        const messages = await database_1.prisma.message.findMany({
            where: {
                OR: [{ senderId: userId }, { receiverId: userId }],
            },
            orderBy: { createdAt: 'desc' },
            include: {
                sender: {
                    select: {
                        id: true,
                        phone: true,
                        email: true,
                        profile: { select: { firstName: true, lastName: true, profileImageUrl: true } },
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        phone: true,
                        email: true,
                        profile: { select: { firstName: true, lastName: true, profileImageUrl: true } },
                    },
                },
            },
        });
        return messages;
    }
}
exports.MessageRepository = MessageRepository;
