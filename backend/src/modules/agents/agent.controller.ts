import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma';
import { sendSuccess } from '../../utils/response';

export class AgentController {
  static async getPublicAgents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agents = await prisma.user.findMany({
        where: {
          role: {
            name: 'AGENT',
          },
          accountStatus: 'ACTIVE',
        },
        include: {
          profile: true,
          role: true,
          identityVerification: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      const formattedAgents = agents.map((agent) => {
        const firstName = agent.profile?.firstName || '';
        const lastName = agent.profile?.lastName || '';
        const fullName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : 'Delala Certified Agent';
        const initials = (firstName && lastName)
          ? `${firstName[0]}${lastName[0]}`.toUpperCase()
          : fullName.slice(0, 2).toUpperCase();

        const location = agent.profile?.zone 
          ? `${agent.profile.zone}, ${agent.profile.region || 'Addis Ababa'}`
          : (agent.profile?.region || 'Addis Ababa');

        return {
          id: agent.id,
          name: fullName,
          initials: initials,
          role: `Certified Real Estate Agent`,
          dept: `Field Operations`,
          location: location,
          zone: agent.profile?.zone || 'Bole',
          region: agent.profile?.region || 'Addis Ababa',
          email: agent.email,
          phone: agent.phone,
          photo: agent.profile?.profileImageUrl || '',
          isVerified: agent.identityVerification?.status === 'VERIFIED' || true,
          bio: `Dedicated Delala property specialist in ${location}, ensuring verified listings and secure rental agreements.`,
        };
      });

      sendSuccess(res, formattedAgents, 'Public agents retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
