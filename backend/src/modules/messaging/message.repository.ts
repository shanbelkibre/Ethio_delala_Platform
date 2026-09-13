import { prisma } from '../../config/database';
import { Message } from '@prisma/client';

export class MessageRepository {
  static async sendMessage(data: {
    senderId: string;
    receiverId: string;
    propertyId?: string;
    content: string;
  }): Promise<Message> {
    return prisma.message.create({
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

  static async getThread(user1Id: string, user2Id: string, propertyId?: string): Promise<Message[]> {
    return prisma.message.findMany({
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

  static async getUserConversations(userId: string): Promise<any[]> {
    const messages = await prisma.message.findMany({
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
