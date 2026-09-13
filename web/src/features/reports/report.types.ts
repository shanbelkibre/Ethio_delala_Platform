export type ReportReason =
  | 'SPAM'
  | 'FRAUD'
  | 'MISLEADING'
  | 'OFFENSIVE'
  | 'OTHER';

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId?: string;
  propertyId?: string;
  reason: ReportReason;
  details?: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface CreateReportInput {
  propertyId?: string;
  reportedUserId?: string;
  reason: ReportReason;
  details?: string;
}
