export interface IAuditLog {
  _id: any;
  userId: any;
  userEmail: string;
  userName: string;
  userRole?: string;
  action: string; // e.g. 'APPLICATION_SELECTED', 'ATTENDANCE_CORRECTED', 'TRAINEE_DROPPED'
  entityType: string; // e.g. 'Application', 'Enrollment', 'AttendanceRecord', 'Staff'
  entityId: any;
  centreId?: any;
  programId?: any;
  cohortId?: any;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface IAnnouncement {
  _id: any;
  title: string;
  content: string;
  scopeType: 'GLOBAL' | 'CENTRE' | 'PROGRAM' | 'COHORT' | 'SKILL_AREA';
  targetCentreId?: any;
  targetProgramId?: any;
  targetCohortId?: any;
  targetSkillAreaId?: any;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  publishedBy: any;
  publishedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface INotification {
  _id: any;
  recipientUserId: any;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  actionUrl?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}
