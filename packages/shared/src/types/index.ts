export type MemberStatus = 'pending' | 'active' | 'suspended';
export type InvitationStatus = 'sent' | 'used' | 'expired' | 'revoked';
export type ModerationStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published' | 'archived';
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
export type TicketStatus = 'valid' | 'used' | 'cancelled' | 'refunded';

export interface UserSession {
  id: string;
  email: string;
  matricule: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
}

export interface ApiResponse<T = any> {
  data?: T;
  meta?: Record<string, any>;
  error?: {
    code: string;
    message: string;
    details?: any;
    requestId?: string;
  };
}
